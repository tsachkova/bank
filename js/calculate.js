let calculateBankData = {};

function convertMoney(sum, currencyAccount, currencyRate, requiredCurrency) {
    if ((typeof requiredCurrency !== 'string') && (requiredCurrency.length !== 3)) {
        throw new Error("invalid currency type format");
    }

    if ((sum >= 0) && (currencyAccount === requiredCurrency)) {
        return sum;
    }

    function getRate(rate, currency) {
        let currencyRate;

        for (i = 0; i < rate.length; i++) {
            if (currency === rate[i].ccy) {
                currencyRate = rate[i];
            }
        }

        if (currencyRate === undefined) {
            alert("this type of currency is not found");
            document.querySelector('body').innerHTML = '';

            returnStartForm();

            throw new Error("this type of currency is not found");
        }

        return currencyRate;
    }

    let requiredCurrencyRate;

    if (requiredCurrency !== 'UAH') {
        requiredCurrencyRate = getRate(currencyRate, requiredCurrency);
    }

    if ((sum >= 0) && (currencyAccount !== 'UAH')) {
        let accountCurrencyRate = getRate(currencyRate, currencyAccount);

        let accountUah = sum * accountCurrencyRate.sale;

        if (requiredCurrency === 'UAH') {
            return accountUah;
        }

        return accountUah / requiredCurrencyRate.sale;
    }

    if (sum >= 0) {
        return sum / requiredCurrencyRate.sale;
    }
}

function calculatSumBank(rate, requiredCurrency, callback) {
    let sumBankUsd = 0;

    for (let i = 0; i < bank.length; i++) {

        for (let j = 0; j < bank[i].credit.length; j++) {
            if (bank[i].credit[j].ownMoney > 0) {
                sumBankUsd += callback(bank[i].credit[j].ownMoney, bank[i].credit[j].currency, rate, requiredCurrency);
            }

            sumBankUsd += callback(bank[i].credit[j].creditMoney, bank[i].credit[j].currency, rate, requiredCurrency);
        }

        for (let k = 0; k < bank[i].debet.length; k++) {
            sumBankUsd += callback(bank[i].debet[k].ownMoney, bank[i].debet[k].currency, rate, requiredCurrency);
        }
    }

    calculateBankData['allBankSum'] = sumBankUsd;
}

function calculatDebtActive(rate, requiredCurrency, callback) {
    let debtActiveUsd = 0;
    let countDebtActive = 0;

    for (let i = 0; i < bank.length; i++) {

        if (bank[i].isActive) {
            for (let j = 0; j < bank[i].credit.length; j++) {
                if (bank[i].credit[j].ownMoney < 0) {
                    debtActiveUsd += callback(Math.abs(bank[i].credit[j].ownMoney), bank[i].credit[j].currency, rate, requiredCurrency);
                    countDebtActive += 1;
                }
            }
        }
    }

    calculateBankData['sumDebtActive'] = debtActiveUsd;
    calculateBankData['countDebtActiveUser'] = countDebtActive;

    return debtActiveUsd;
}

function calculatDebtNotActive(rate, requiredCurrency, callback) {
    let debtNotActiveUsd = 0;
    let countDebtNotActive = 0;
    for (let i = 0; i < bank.length; i++) {

        if (!bank[i].isActive) {
            for (let j = 0; j < bank[i].credit.length; j++) {

                if (bank[i].credit[j].ownMoney < 0) {
                    debtNotActiveUsd += callback(Math.abs(bank[i].credit[j].ownMoney), bank[i].credit[j].currency, rate, requiredCurrency);
                    countDebtNotActive += 1;
                }
            }
        }
    }

    calculateBankData['sumDebtNotActive'] = debtNotActiveUsd;
    calculateBankData['countNotActiveDebtor'] = countDebtNotActive;

    return debtNotActiveUsd;
}

function allDebt() {
    calculateBankData.allDebtSum = calculateBankData.sumDebtActive + calculateBankData.sumDebtNotActive;
}

async function toCalculateBankMoney(requiredCurrency, callback) {
    let currenRequest = (await fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')).json();
    currenRequest.then(requestResult => calculatSumBank(requestResult, requiredCurrency, callback))
    currenRequest.then((requestResult) => calculatDebtActive(requestResult, requiredCurrency, callback))
    currenRequest.then((requestResult) => calculatDebtNotActive(requestResult, requiredCurrency, callback))
    currenRequest.then(() => allDebt())
    currenRequest.then(() => putCalculateData(calculateBankData, requiredCurrency))
}