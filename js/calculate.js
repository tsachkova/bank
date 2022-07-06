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

function calculatDebt(rate, requiredCurrency, convertCallback, sumKey, countKey, callback) {
    let debtActiveUsd = 0;
    let countDebtActive = 0;

    for (let i = 0; i < bank.length; i++) {
        if(callback) {
            isCalculetData = callback(bank[i]);
        } else {
            isCalculetData = true;
        }

        let count = 0;

        if (isCalculetData) {
            for (let j = 0; j < bank[i].credit.length; j++) {
                       
                if (bank[i].credit[j].ownMoney < 0) {
                    debtActiveUsd += convertCallback(Math.abs(bank[i].credit[j].ownMoney), bank[i].credit[j].currency, rate, requiredCurrency);
                    count = count || 1;
                }

            }
            countDebtActive += count; 
        }
    }
    
    calculateBankData[sumKey] = debtActiveUsd;
    calculateBankData[countKey] = countDebtActive;
}

function debtActive(clientData) {
    if(clientData.isActive) {
        return true
    }
}

function debtNotActive(clientData) {
    if(!clientData.isActive) {
        return true
    }
}

async function toCalculateBankMoney(requiredCurrency, callback) {
    let currenRequest = (await fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')).json();
    currenRequest.then(requestResult => calculatSumBank(requestResult, requiredCurrency, callback))
    currenRequest.then((requestResult) => calculatDebt(requestResult, requiredCurrency, callback, 'sumDebtActive', 'countDebtActiveUser', debtActive))
    currenRequest.then((requestResult) => calculatDebt(requestResult, requiredCurrency, callback, 'sumDebtNotActive', 'countNotActiveDebtor', debtNotActive))
    currenRequest.then((requestResult) => calculatDebt(requestResult, requiredCurrency, callback, 'allDebtSum'))
    currenRequest.then(() => putCalculateData(calculateBankData, requiredCurrency))
}