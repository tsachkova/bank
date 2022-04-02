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

            let creditMoney;
            let ownMoney = account.sum - account.limit;

            if(ownMoney >= 0) {
                creditMoney = account.limit;
            } else {                   
                creditMoney = account.limit + ownMoney;
            }

            this.credit.push(new CreditAccount(ownMoney, creditMoney, account.limit, account.currency, account.isActive, account.dateActive))
        
        } else {
            if (account.sum < 0) {
                throw new Error("debit account must be greater than zero");
            }

            this.debit.push(new DebitAccount(account.sum, account.currency, account.isActive, account.dateActive))
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

function rate(sum, currencyAccount, currencyRate ) {

    if((sum > 0) && (currencyAccount === 'USD')){
        return sum;
    }

    if((sum > 0) && (currencyAccount === 'UAH')){
        return sum / currencyRate[0].sale;
    }

    if(sum > 0) {
        let uah = 0;

        for(i = 0; i < currencyRate.length; i++){
            if(currencyAccount === i.ccy) {
                uah = sum * i.buy;
            }
        }

        return uah / currencyRate[0].sale;
    }

    return 0;
}

function calculatSumBankUsd(rate, callback){    
    let sumBankUsd = 0;

    for(let i = 0; i < bank.length; i++){

        for(let j = 0; j < bank[i].credit.length; j++) {
            sumBankUsd += callback(bank[i].credit[j].ownMoney, bank[i].credit[j].currency, rate);
            sumBankUsd += callback(bank[i].credit[j].creditMoney, bank[i].credit[j].currency, rate);
        }

        for(let k = 0; k < bank[i].debit.length; k++) {
            sumBankUsd += callback(bank[i].debit[k].ownMoney, bank[i].debit[k].currency, rate);
        }
    }

    return sumBankUsd;
}

function calculatDebtActiveUsd(rate, callback) {
    let  debtActiveUsd = 0;

    for(let i = 0; i < bank.length; i++) {

        if(bank[i].isActive) {
            for(let j = 0; j < bank[i].credit.length; j++) {
                if(bank[i].credit[j].ownMoney < 0) {
                    debtActiveUsd += callback(Math.abs(bank[i].credit[j].ownMoney), bank[i].credit[j].currency, rate);
                }
            }
        }
    }

    return debtActiveUsd;
}

function calculatDebtNotActiveUsd(rate, callback) {
    let  debtNotActiveUsd = 0;

    for(let i = 0; i < bank.length; i++) {

        if(!bank[i].isActive) {
            for(let j = 0; j < bank[i].credit.length; j++) {

                if(bank[i].credit[j].ownMoney < 0) {
                    debtNotActiveUsd += callback(Math.abs(bank[i].credit[j].ownMoney), bank[i].credit[j].currency, rate);
                }
            }
        }
    }
    return debtNotActiveUsd;
}


async function currency(callback) {
    let currenRequest = (await fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')).json();
    currenRequest.then(requestResult => calculatSumBankUsd(requestResult, callback))
    currenRequest.then((requestResult) => calculatDebtActiveUsd(requestResult, callback))
    currenRequest.then((requestResult) => calculatDebtNotActiveUsd(requestResult, callback))
}

currency(rate);
