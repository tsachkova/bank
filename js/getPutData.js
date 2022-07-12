let editedClientGetPut;

class GetPutClientData {
    constructor(clientData) {
        this.clientData = clientData;
        this.idEditClient;
        this.dateEditClient;
    }
    putEditedClientData() {
        if (!this.clientData) {
            alert('в базе нет клиента с таким id');
            returnStartForm();
            return;
        }
        this.idEditClient = this.clientData.id;
        this.dateEditClient = this.clientData.date;
        document.getElementById('firstName').value = this.clientData.firstName;
        document.getElementById('lastName').value = this.clientData.lastName;

        if (this.clientData.isActive) {
            document.getElementById('isActive').setAttribute('checked', `checked`);
        }
        
        document.getElementById('idEditClient').textContent += `${this.clientData.id}`;
        document.getElementById('dateEditClient').textContent += `${this.clientData.date}`;

        let debetAccountForms = document.getElementById('debet');

        for (let i = 0; i < this.clientData.debet.length; i++) {
            new Accounts(this.clientData.debet[i], debetAccountForms).generateAccountsForm().putAccountsData();
        }

        let creditAccountForms = document.getElementById('credit');

        for (let i = 0; i < this.clientData.credit.length; i++) {
            new Accounts(this.clientData.credit[i], creditAccountForms).generateAccountsForm().putAccountsData();
        }
    }
    
    getClientData() {
        let newClientData = {};

        newClientData.firstName = document.getElementById('firstName').value;
        newClientData.lastName = document.getElementById('lastName').value;

        if (!(newClientData.firstName && newClientData.lastName)) {
            alert('введите имя и фамилию');
            document.getElementById('firstName').value = '';
            document.getElementById('lastName').value = '';
            return;
        }

        newClientData.isActive = document.getElementById('isActive').checked;

        if (this.dateEditClient) {
            newClientData.date = this.dateEditClient;
        } else {
            newClientData.date = new Date().toString().match(/[A-Za-z]{3}\s\d\d\s\d{4}/)[0];
        }

        newClientData.id = 1;
        if (this.idEditClient) {
            newClientData.id = Number(this.idEditClient);
        } else {
            for (let i = 0; i < bank.length; i++) {
                if (newClientData.id <= bank[i].id) {
                    newClientData.id = parseInt(bank[i].id) + 1;
                }
            }
        }

        let accountsDebet = document.getElementById('debet').getElementsByTagName('fieldset');
        let accountsCredit = document.getElementById('credit').getElementsByTagName('fieldset');
        newClientData.accounts = [];
        for (let i = 0; i < accountsDebet.length; i++) {
            newClientData.accounts.push(new Accounts(accountsDebet[i],).getAccountsData());
        }
        for (let i = 0; i < accountsCredit.length; i++) {
            newClientData.accounts.push(new Accounts(accountsCredit[i]).getAccountsData());
        }

        return newClientData;
    }

    deleteOldUserData() {
        deleteUser(Number(this.idEditClient));
        return this;
    }
}

class Accounts {
    constructor(accountData, accountContainer,) {
        this.accountData = accountData;
        this.accountsContainer = accountContainer;
    }

    generateAccountsForm() {
        if (this.accountData.limit || this.accountData.limit === 0) {
            new addHtmlForm(this.accountsContainer, debitDataHtml, creditAccountFormCallback).createFragment().addFragment();
        } else {
            new addHtmlForm(this.accountsContainer, debitDataHtml).createFragment().addFragment();
        }
        return this;
    }

    putAccountsData() {
        let carrentAccountContainer = this.accountsContainer.lastChild;
        if (this.accountData.limit || this.accountData.limit === 0) {
            carrentAccountContainer.querySelector('.limit').value = this.accountData.limit;
            carrentAccountContainer.querySelector('.ownSum').value = this.accountData.limit + this.accountData.ownMoney;
        } else {
            carrentAccountContainer.querySelector('.ownSum').value = this.accountData.ownMoney;
        }

        if (this.accountData.isActive) {
            carrentAccountContainer.querySelector('.isActive').setAttribute('checked', `checked`);
        }

        carrentAccountContainer.querySelector('.currency').closest('p').innerHTML = `
            <p><label for="currency" >валюта счета</label>
            <select class = "currency" size="1">
                <option selected  value= ${this.accountData.currency}>${this.accountData.currency}</option>
            </select></p>`;

    }

    getAccountsData() {
        let accountData = {};

        accountData.currency = this.accountData.querySelector('.currency').value;
        accountData.sum = (+this.accountData.querySelector('.ownSum').value) || 0;
        accountData.isActive = this.accountData.querySelector('.isActive').checked;
        accountData.dateActive = new Date();

        if (this.accountData.querySelector('.limit')) {
            accountData.limit = (+this.accountData.querySelector('.limit').value) || 0;
        }

        return accountData;
    }
}

function putCalculateData(calculateData, calculateCarrency) {
    let fieldArrey = document.querySelector('fieldset').querySelectorAll('input');
    for (let i = 0; i < fieldArrey.length; i++) {

        if (fieldArrey[i].type === 'text') {
            fieldArrey[i].previousSibling.textContent += calculateCarrency;
            fieldArrey[i].value = calculateData[fieldArrey[i].id];
        }
    }
}