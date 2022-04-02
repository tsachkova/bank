class CreditAccount {
    constructor(ownMoney, creditMoney, limit, currency, isActive, dateActive) {
        this.creditMoney = creditMoney;
        this.ownMoney = ownMoney;
        this.limit = limit;
        this.currency = currency;
        this.isActive = isActive;
        this.dateActive = dateActive;
    }
}

class DebitAccount {
constructor(sum, currency, isActive, dateActive) {
    this.currency = currency;
    this.ownMoney = sum;
    this.isActive = isActive;
    this.dateActive = dateActive;
    }
}

class Client {
    constructor(firstName, lastName, isActive, date){
        this.firstName = firstName;
        this.lastName = lastName;
        this.isActive = isActive;
        this.date = date;
        this.debit = [];
        this.credit = [];
    }
    
    addAccount(account) {
        if(account.hasOwnProperty('limit')) {
            if(account.sum < 0 ) {
                throw new Error("exceeded credit limit");
            }

            let creditMoney = (account.sum - account.limit) > 0 && account.limit || account.sum;
            let ownMoney = account.sum - account.limit;

            this.credit.push(new CreditAccount(ownMoney, creditMoney, account.limit, account.currency, account.isActive, account.dateActive));

        } else {
            if (account.sum < 0) {
                throw new Error("debit account must be greater than zero");
            }

            this.debit.push(new DebitAccount(account.sum, account.currency, account.isActive, account.dateActive));
        }
    }
}

let bank = [];

function createNewClient(firstName, lastName, isActive, date, ...rest) {
    let newClient = new Client(firstName, lastName, isActive, date);
    let clientArgs = arguments;

    for(let i = 4; i < clientArgs.length; i++) {
        newClient.addAccount(clientArgs[i]);
    }

    bank.push(newClient);
}

let acc1 = {sum : 120, currency: 'USD', isActive: true, dateActive: '11.03.2012'};
let acc2 = {sum : 240, limit: 100, currency: 'UAH', isActive: true, dateActive: '11.03.2012'};
let acc3 = {sum : 120, currency: 'EUR', isActive: true, dateActive: '11.03.2012'};
let acc4 = {sum : 15, limit: 120, currency: 'UAH', isActive: true, dateActive: '11.03.2012'};

createNewClient('vasys', 'pupkin', true, '10.5.2001', acc1, acc2, acc3, acc4);

function convertMoney(sum, currencyAccount, currencyRate, requiredCurrency ) {
    if ((typeof requiredCurrency !== 'string') && (requiredCurrency.length !== 3)) {
        throw new Error("invalid currency type format");
    }

    let requiredCurrencyRate;
    for(i = 0; i < currencyRate.length; i++){
        if(requiredCurrency === currencyRate[i].ccy) {
            requiredCurrencyRate = currencyRate[i];
        }
    }

    if((sum > 0) && (currencyAccount === requiredCurrency)) {
        return sum;
    }

    if((sum > 0) && (currencyAccount === 'UAH')){
        return sum / requiredCurrencyRate.sale;
    }

    if(sum > 0) {
        let uah = 0;

        for(i = 0; i < currencyRate.length; i++){
            if(currencyAccount === i.ccy) {
                uah = sum * currencyRate[i].buy;
            }
        }

        return uah / requiredCurrencyRate.sale;
    }

    return 0;
}

function calculatSumBank(rate, requiredCurrency, callback){    
    let sumBankUsd = 0;

    for(let i = 0; i < bank.length; i++){

        for(let j = 0; j < bank[i].credit.length; j++) {
            sumBankUsd += callback(bank[i].credit[j].ownMoney, bank[i].credit[j].currency, rate, requiredCurrency);
            sumBankUsd += callback(bank[i].credit[j].creditMoney, bank[i].credit[j].currency, rate, requiredCurrency);
        }

        for(let k = 0; k < bank[i].debit.length; k++) {
            sumBankUsd += callback(bank[i].debit[k].ownMoney, bank[i].debit[k].currency, rate, requiredCurrency);
        }
    }
    console.log(sumBankUsd)
    return sumBankUsd;
}

function calculatDebtActive(rate, requiredCurrency, callback) {
    let  debtActiveUsd = 0;

    for(let i = 0; i < bank.length; i++) {

        if(bank[i].isActive) {
            for(let j = 0; j < bank[i].credit.length; j++) {
                if(bank[i].credit[j].ownMoney < 0) {
                    debtActiveUsd += callback(Math.abs(bank[i].credit[j].ownMoney), bank[i].credit[j].currency, rate, requiredCurrency);
                }
            }
        }
    }
    console.log(debtActiveUsd)
    return debtActiveUsd;
}

function calculatDebtNotActive(rate, requiredCurrency, callback) {
    let  debtNotActiveUsd = 0;

    for(let i = 0; i < bank.length; i++) {

        if(!bank[i].isActive) {
            for(let j = 0; j < bank[i].credit.length; j++) {

                if(bank[i].credit[j].ownMoney < 0) {
                    debtNotActiveUsd += callback(Math.abs(bank[i].credit[j].ownMoney), bank[i].credit[j].currency, rate, requiredCurrency);
                }
            }
        }
    }
    console.log(debtNotActiveUsd)
    return debtNotActiveUsd;
}


async function toCalculateBankMoney(requiredCurrency, callback) {
    let currenRequest = (await fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')).json();
    currenRequest.then(requestResult => calculatSumBank(requestResult, requiredCurrency, callback))
    currenRequest.then((requestResult) => calculatDebtActive(requestResult, requiredCurrency, callback))
    currenRequest.then((requestResult) => calculatDebtNotActive(requestResult, requiredCurrency, callback))
}

toCalculateBankMoney('EUR', convertMoney);

// 0:[ {ccy: 'USD', base_ccy: 'UAH', buy: '29.25490', sale: '29.54740'}
// 1: {ccy: 'EUR', base_ccy: 'UAH', buy: '32.15000', sale: '32.75000'}
// 2: {ccy: 'BTC', base_ccy: 'USD', buy: '44362.3654', sale: '49032.0880'}]