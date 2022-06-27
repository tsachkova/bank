function putEditedClientData(editedClient) {   
    if (!editedClient) {
        alert('в базе нет клиента с таким id');
        clearParents(document.querySelector('#mainForm'));
        addHtmlFragment(startParents, startHtmlData, startFormCallback);
        return;
    }

    editedAccountsForm(editedClient.debet, document.getElementById('debet'));
    editedAccountsForm(editedClient.credit, document.getElementById('credit'));
    let debitAccountForms = document.getElementById('debet').querySelectorAll('fieldset');
    let creditAccountForms = document.getElementById('credit').querySelectorAll('fieldset');
    putAccountsData(editedClient.debet, debitAccountForms)
    putAccountsData(editedClient.credit, creditAccountForms)
    document.getElementById('firstName').value = editedClient.firstName;
    document.getElementById('lastName').value = editedClient.lastName;

    if (editedClient.isActive) {
        document.getElementById('isActive').setAttribute('checked', `checked`);
    }

    document.getElementById('idEditClient').setAttribute('data-idInfo', `${editedClient.id}`);
    document.getElementById('idEditClient').textContent += `${editedClient.id}`;
    document.getElementById('dateEditClient').setAttribute('data-dateInfo', `${editedClient.date}`);
    document.getElementById('dateEditClient').textContent += `${editedClient.date}`;
}

function editedAccountsForm(accountsArray, carrentAccountField) {
    for (let i = 0; i < accountsArray.length; i++) { 
        if (accountsArray[i].limit || accountsArray[i].limit === 0){
        addHtmlFragment(carrentAccountField, debitDataHtml, creditAccountFormCallback);
        } else {
            addHtmlFragment(carrentAccountField, debitDataHtml, debetAccountFormCallback);
        }
    }
}

function putAccountsData(accountsArray, accountsFormArrey) {
    for (let i = 0; i < accountsArray.length; i++) {
        
        if (accountsArray[i].limit || accountsArray[i].limit === 0) {
            accountsFormArrey[i].querySelector('.limit').value = accountsArray[i].limit;
            accountsFormArrey[i].querySelector('.ownSum').value = accountsArray[i].limit + accountsArray[i].ownMoney;
        } else {
            accountsFormArrey[i].querySelector('.ownSum').value = accountsArray[i].ownMoney;
        }

        if (accountsArray[i].isActive) {
            accountsFormArrey[i].querySelector('.isActive').setAttribute('checked', `checked`);
        }

        accountsFormArrey[i].querySelector('.currencyContainer').innerHTML = `
        <p><label for="currency" >валюта счета</label>
        <select class = "currency" size="1">
            <option selected  value= ${accountsArray[i].currency}>${accountsArray[i].currency}</option>
        </select></p>`
    }
}

function putCalculateData(calculateData, calculateCarrency) {
    let fieldArrey = document.querySelector('fieldset').querySelectorAll ('input');
    for(let i = 0; i < fieldArrey.length; i++) {
        if(fieldArrey[i].type === 'text') {
            fieldArrey[i].previousSibling.textContent+= calculateCarrency;
            fieldArrey[i].value = calculateData[fieldArrey[i].id]
           }
            
            

    }
        
}

function getAccountsData(accounts) {
    let accountsData = [];
       
    for (let i = 0; i < accounts.length; i++) {
        let accountData = {};
        accountData.currency = accounts[i].querySelector('.currency').value;
        accountData.sum = (+accounts[i].querySelector('.ownSum').value) || 0;
        
        accountData.isActive = accounts[i].querySelector('.isActive').checked;
        accountData.dateActive = new Date();

        if (accounts[i].querySelector('.limit')) {
            accountData.limit = (+accounts[i].querySelector('.limit').value) || 0;
        }
        accountsData.push(accountData)
    }
    
    return accountsData;
}

function getEditClientData() {
    let newClientData = {};
    newClientData.firstName = document.getElementById('firstName').value;
    newClientData.lastName = document.getElementById('lastName').value;

    if (!(newClientData.firstName && newClientData.lastName)) {
        alert('введите имя и фамилию');
        addHtmlFragment(document.querySelector('#mainForm'), mainUserForm, createFormCallback);
        return;
    }

    newClientData.isActive = document.getElementById('isActive').checked;
    if(document.getElementById('dateEditClient')){
        newClientData.date = document.getElementById('dateEditClient').getAttribute('data-dateinfo')
    } else {
        newClientData.date = new Date().toString().match(/[A-Za-z]{3}\s\d\d\s\d{4}/)[0];
    } 

    newClientData.id = 1;
    if (!document.getElementById('idEditClient')) {
        for (let i = 0; i < bank.length; i++) {
            if (newClientData.id <= bank[i].id) {
                newClientData.id = parseInt(bank[i].id) + 1;
            }
        }
    } else {
        newClientData.id = document.getElementById('idEditClient').getAttribute('data-idInfo');
    }

    let accountsDebit = document.getElementById('debet').getElementsByTagName('fieldset');
    let accountsCredit = document.getElementById('credit').getElementsByTagName('fieldset');
   
    let accounts = getAccountsData(accountsDebit).concat(getAccountsData(accountsCredit));
    
    newClientData.accounts = accounts;
    return newClientData;
}

function validateNameFormat(event) {
    if (event.target.classList.contains("ownSum") || event.target.classList.contains("limit")) {

        if (!/^\d+$/.test(event.target.value) && !(event.target.value.length === 0)) {
            alert("Поля 'сумма на счету' и 'кредитный лимит' должны содержать только цифры");
            event.target.value = '';
        }
    }
}