class CreditAccount {
    constructor(ownMoney, creditMoney, limit, currency, isActive, dateActive) {
        this.currency = currency;
        this.creditMoney = creditMoney;
        this.ownMoney = ownMoney;
        this.limit = limit;
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
    constructor(firstName, lastName, isActive, date, id) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isActive = isActive;
        this.date = date;
        this.debet = [];
        this.credit = [];
    }

    addAccount(accounts) {
        for(let i = 0; i < accounts.length; i++) {
        if (accounts[i].hasOwnProperty('limit')) {
            if (accounts[i].sum < 0) {
                throw new Error("exceeded credit limit");
            }

            let creditMoney = (accounts[i].sum - accounts[i].limit) > 0 && accounts[i].limit || accounts[i].sum;
            let ownMoney = accounts[i].sum - accounts[i].limit;

            this.credit.push(new CreditAccount(ownMoney, creditMoney, accounts[i].limit, accounts[i].currency, accounts[i].isActive, accounts[i].dateActive));
        } else {
            if (accounts[i].sum < 0) {
                throw new Error("debet account must be greater than zero");
            }

            this.debet.push(new DebitAccount(accounts[i].sum, accounts[i].currency, accounts[i].isActive, accounts[i].dateActive));
        }
        }
    }
}

let bank = [];

function createNewClient(creatData) {
    

    let newClient = new Client(creatData.firstName, creatData.lastName, creatData.isActive, creatData.date, creatData.id);
    
    newClient.addAccount(creatData.accounts)
    
    bank.push(newClient);

   
}

function getDataSearchUser(idClient) {
    for (let i = 0; i < bank.length; i++) {
        if (bank[i].id == idClient) {
            let searchUser = bank[i];
            bank.splice(i, 1);
            return searchUser;
        }

    }
    return;
}