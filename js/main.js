let mainFieldset;

let userNameForm = `<p><label for="firstName" >Имя</label><input type="text" name = "firstName"  id="firstName" ></p>
    <p><label for="lastName">Фамилия</label><input type="text" id="lastName" ></p>
    <p id = "isActiveUserContainer"><label for="isActive">Активность аккаунта</label><input type="checkbox" id="isActive"></p>
    <fieldset id = 'debit'>
        <legend>Дебит</legend>
    </fieldset> 
    <fieldset id = 'credit'>
        <legend>Кредит</legend>
    </fieldset>
    <input type="button" id = "debitAccount" value="добавить дебитовый счет">
    <input type="button" id = "creditAccount" value="добавить кредитовый счет">
    <p><input type="button" id = 'submit'  value="Отправить"></p>`;

let debitAccountForm = `<fieldset>
        <form>
            <p><label for="ownSum" >сумма на счету </label><input type="text" class ="ownSum" placeholder="0"></p>
            <p class = "isActiveContainer"><label for="isActive">счет активен</label><input type="checkbox" class ="isActive"></p>
            <p class = "currencyContainer"><label for="currency" >валюта счета</label><select class = "currency" size="1">
                <option  value = "EUR">EUR</option>
                <option value="USD">USD</option>
                <option selected  value="UAH">UAH</option></select>
            </p>
            <p><input type="button" class = "delete" value="удалить"></p>
        </form>
    </fieldset>`;

let creditAccountForm = `<p><label for="limit">кредитный лимит</label><input type="text" class="limit" placeholder="0" autocomplete= "off"></p>`;

let searchForm = `
    <legend>Изменение данных</legend>
    <p><label for="id">id</label><input type="text" id="id"></p>
    <p id = "buttonSearchContainer"><input type="button" id = 'search'  value="Искать"></p>
    <p><input type="button" class = 'back'  value="Назад">`;

let calclateForm =  `
    <fieldset>
        <p><label for="calculateCurrency" >рассчетная валюта </label><select id = "calculateCurrency" size="1">
            <option  value = "EUR">EUR</option>
            <option value="USD">USD</option>
            <option selected  value="UAH">UAH</option></select>
        </p>
        <p><input type="button" value = "Рассчитать суммарные показатели по банку" id ="calculateBank" ></p>
    </fieldset>`;

function start(){
    document.querySelector('body').insertAdjacentHTML('afterbegin', `
    <form>
        <fieldset id = 'mainFieldset'>
            <p><input type="button" value = "создать нового пользователя" id="createUser" ></p>
            <p><input type="button" value = "изменить данные пользователя" id="editUser" ></p>
            <p><input type="button" value = "удалить пользователя" id="deleteUser" ></p>
            <fieldset>
                <p><label for="calculateCurrency" >рассчетная валюта </label><select id = "calculateCurrency" size="1">
                    <option  value = "EUR">EUR</option>
                    <option value="USD">USD</option>
                    <option selected  value="UAH">UAH</option></select>
                </p>
                <p><input type="button" value = "Рассчитать суммарные показатели по банку" id ="calculateBank"></p>
            </fieldset>
        </fieldset>
    </form>`);

    mainFieldset = document.getElementById('mainFieldset');

    mainFieldset.addEventListener('focusout', function(event){
                
        if(event.target.classList.contains("ownSum") || event.target.classList.contains("limit") ){
           
            if(!/^\d+$/.test(event.target.value) && !(event.target.value.length === 0)){
                alert("Поля 'сумма на счету' и 'кредитный лимит' должны содержать только цифры" );
                event.target.value = '';
            }
        }
    })

    mainFieldset.addEventListener('click', function(event){  
        if(event.target.id === "createUser"){
            mainFieldset.innerHTML = `<legend>Новый клиент</legend>${userNameForm}`;
        }

        if(event.target.id === "submit"){
            createNewClient();
        }

        if(event.target.classList.contains("delete")){
            event.target.closest("form").outerHTML = "";
        }
             
        if(event.target.id === "debitAccount"){
            addAccountForm();
        }

        if(event.target.id === "creditAccount"){
            addAccountForm(true);
        }

        if(event.target.id === "editUser"){
            mainFieldset.innerHTML = searchForm;
        }

        if(event.target.id === "search"){
            editClient();
        }

        if(event.target.classList.contains("back")){
            document.querySelector('body').innerHTML = '';
            start();
        }

        if(event.target.id === "apply"){
            let idEditClient = +document.getElementById('idEditClient').getAttribute('data-idInfo');
            let dateEditClient = document.getElementById('dateEditClient').getAttribute('data-dateInfo');
            deleteSearchUser(idEditClient);
            createNewClient(idEditClient, dateEditClient);
        }

        if(event.target.id === "deleteUser"){
            mainFieldset.innerHTML = searchForm;
            document.getElementById('buttonSearchContainer').innerHTML = `<input type="button" id = 'deleteUserButton'  value="Удалить"></input>`
        }

        if(event.target.id === "deleteUserButton"){
            deleteSearchUser(document.getElementById('id').value);
            document.querySelector('body').innerHTML = '';
            start();
        }

        if(event.target.id === "calculateBank"){
            let calculateCurrency = document.getElementById('calculateCurrency').value;

            mainFieldset.innerHTML = `
            <p>сумма средств по банку в ${calculateCurrency} - <span id = "sum"></span></p>
            <p>сумма задолженности активных клиентов по банку в ${calculateCurrency} - <span id = "sumDebitActive"></span><br>
            количество активных клиентов - должников <span id = "countActiveDebtor"></span></p>
            <p>сумма задолженности неактивных клиентов по банку в ${calculateCurrency} - <span id = "sumDebitNotActive"></span><br>
            количество неактивных клиентов - должников <span id = "countNotActiveDebtor"></span> </p>
            <p id = 'test'>сумма общей задолженности по банку в  ${calculateCurrency} - ${document.getElementById('sumDebitActive')}</p>
            <p><input type="button" class = 'back'  value="Назад"></p>`;

            toCalculateBankMoney(calculateCurrency, convertMoney);
        }
    })
}

start();

function addAccountForm(isCredit){
    
    let newAccountForm = document.createElement('form');
    newAccountForm.insertAdjacentHTML('afterbegin', debitAccountForm);

    if(isCredit) {
        newAccountForm.firstElementChild.insertAdjacentHTML('afterbegin', creditAccountForm);
        document.getElementById('credit').append(newAccountForm);
    } else {
    document.getElementById('debit').append(newAccountForm);
    }
}

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
    constructor(firstName, lastName, isActive, date, id){
        this.id = id;
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



function createNewClient(idEditClient, dateEditClient) {
    let firstName = document.getElementById('firstName').value;
    let lastName = document.getElementById('lastName').value;

    if(!(firstName&&lastName)){
        alert('введите имя и фамилию');
        return;
    }

    let isActive = document.getElementById('isActive').checked;
    let date = dateEditClient || new Date().toString().match(/[A-Za-z]{3}\s\d\d\s\d{4}/)[0];

    let id = 1;
    if(!idEditClient) {
        for(let i = 0; i < bank.length; i++){
            if(id <= bank[i].id){
                id = bank[i].id + 1; 
            }
        }
    } else {
        id = idEditClient;
    }

    let newClient = new Client(firstName, lastName, isActive, date, id);    

    function creatAccounts(accounts) {
        for(let i = 0; i < accounts.length; i++) {
            let accountData = {};

            accountData.sum = (+accounts[i].querySelector('.ownSum').value) || 0;
            accountData.currency = accounts[i].querySelector('.currency').value;
            accountData.isActive = accounts[i].querySelector('.isActive').checked;
            accountData.dateActive = new Date();
    
            if(accounts[i].querySelector('.limit')){ 
                accountData.limit = (+accounts[i].querySelector('.limit').value) || 0;
            }
    
            newClient.addAccount(accountData);
        }
    }

    let accountsDebit = document.getElementById('debit').getElementsByTagName('form');
    let accountsCredit = document.getElementById('credit').getElementsByTagName('form');

    creatAccounts(accountsDebit);
    creatAccounts(accountsCredit);
    
    bank.push(newClient);

    document.querySelector('body').innerHTML = '';
    start()
}

function deleteSearchUser (idDeleteClient){
    let searchId = idDeleteClient || document.getElementById('id').value;
    for(let i = 0; i < bank.length; i++){
        if(bank[i].id == searchId){

            if(!idDeleteClient){
                return bank[i];
            }

        bank.splice(i,1);   
        }
            
    }
}   


function editClient(){
    let editedClient = deleteSearchUser();   

    if(!editedClient) {
        alert('в базе нет клиента с таким id');
        mainFieldset.innerHTML = searchForm;
        return;
    }
    
    mainFieldset.innerHTML = `
    <p id = "idEditClient" data-idInfo = ${editedClient.id}> ID клиента - ${editedClient.id}</p>
    <p id = "dateEditClient" data-dateInfo = ${editedClient.date}>Дата регистрации  - ${editedClient.date}</p>
    ${userNameForm}`;
    
    document.getElementById('idEditClient').setAttribute('data-idInfo', `${editedClient.id}`)
    document.getElementById('dateEditClient').setAttribute('data-dateInfo', `${editedClient.date}`);
    
    function editedAccounts(accountsArray) {
        for(let i = 0; i < accountsArray.length; i++){

            let carrentAccount;

            if(accountsArray[i].limit || accountsArray[i].limit === 0){
                carrentAccount = document.getElementById('credit');

                addAccountForm(true);

                carrentAccount.lastElementChild.querySelector('.limit').value = accountsArray[i].limit;
                carrentAccount.lastElementChild.querySelector('.ownSum').value = accountsArray[i].limit + accountsArray[i].ownMoney;
            } else {
                carrentAccount = document.getElementById('debit'); 

                addAccountForm();

                carrentAccount.lastElementChild.querySelector('.ownSum').value = accountsArray[i].ownMoney;
            }

            if(accountsArray[i].isActive) {
                carrentAccount.lastElementChild.querySelector('.isActiveContainer').innerHTML = 
                '<label for="isActive">счет активен</label><input type="checkbox" checked="checked" class ="isActive">';
            }

            carrentAccount.lastElementChild.querySelector('.currencyContainer').innerHTML =  `
            <p><label for="currency" >валюта счета</label>
            <select class = "currency" size="1">
                <option selected  value= ${accountsArray[i].currency}>${accountsArray[i].currency}</option>
            </select></p>`       
        }
    }

    editedAccounts (editedClient.debit, document.getElementById('debit'));
    editedAccounts (editedClient.credit, document.getElementById('credit'));

    document.getElementById('firstName').value = editedClient.firstName;
    document.getElementById('lastName').value = editedClient.lastName;

    if(editedClient.isActive){
        document.getElementById('isActiveUserContainer').innerHTML = 
        '<label for="isActive">Активность аккаунта</label><input type="checkbox" checked ="checked" id="isActive">';
    }

    document.getElementById('submit').closest('p').innerHTML = `
    <p><input type="button" id = 'apply'  value="Применить"></p>
    <p><input type="button" class = 'back'  value="Отмена"></p>`;
}

function convertMoney(sum, currencyAccount, currencyRate, requiredCurrency) {
    if ((typeof requiredCurrency !== 'string') && (requiredCurrency.length !== 3)) {
        throw new Error("invalid currency type format");
    }

    if((sum > 0) && (currencyAccount === requiredCurrency)) {
        return sum;
    }

    function getRate(rate, currency) {
        let currencyRate;

        for(i = 0; i < rate.length; i++) {
            if(currency === rate[i].ccy) {
                currencyRate = rate[i];
            }
        }

        if(currencyRate === undefined) {
            alert ("this type of currency is not found");
            document.querySelector('body').innerHTML = '';
            start();
            throw new Error("this type of currency is not found");
        }
        return currencyRate;
    }
    
    let requiredCurrencyRate;

    if(requiredCurrency !== 'UAH') {
        requiredCurrencyRate = getRate(currencyRate, requiredCurrency);
    }

    if((sum > 0) && (currencyAccount !== 'UAH')) {
        let accountCurrencyRate = getRate(currencyRate, currencyAccount);
        let accountUah = sum * accountCurrencyRate.sale;
       
        if(requiredCurrency === 'UAH') {
            return accountUah;
        }

        return accountUah / requiredCurrencyRate.sale;
    }

    if(sum > 0) {
        return sum /requiredCurrencyRate.sale;
    }
}

function calculatSumBank(rate, requiredCurrency, callback) {    
    let sumBankUsd = 0;

    for(let i = 0; i < bank.length; i++){

        for(let j = 0; j < bank[i].credit.length; j++) {
        if(bank[i].credit[j].ownMoney > 0){
            sumBankUsd += callback(bank[i].credit[j].ownMoney, bank[i].credit[j].currency, rate, requiredCurrency);
        }
            sumBankUsd += callback(bank[i].credit[j].creditMoney, bank[i].credit[j].currency, rate, requiredCurrency);
        }

        for(let k = 0; k < bank[i].debit.length; k++) {
            sumBankUsd += callback(bank[i].debit[k].ownMoney, bank[i].debit[k].currency, rate, requiredCurrency);
        }
    }
    
    document.getElementById('sum').innerHTML = `${sumBankUsd}`;
}

function calculatDebtActive(rate, requiredCurrency, callback) {
    let  debtActiveUsd = 0;
    let countDebtActive = 0;

    for(let i = 0; i < bank.length; i++) {

        if(bank[i].isActive) {
            for(let j = 0; j < bank[i].credit.length; j++) {
                if(bank[i].credit[j].ownMoney < 0) {
                    debtActiveUsd += callback(Math.abs(bank[i].credit[j].ownMoney), bank[i].credit[j].currency, rate, requiredCurrency);
                    countDebtActive += 1;
                }
            }
        }
    }

    document.getElementById('sumDebitActive').innerHTML = `${debtActiveUsd}`;
    document.getElementById('countActiveDebtor').innerHTML = `${countDebtActive}`
    return debtActiveUsd;
}

function calculatDebtNotActive(rate, requiredCurrency, callback) {
    let  debtNotActiveUsd = 0;
    let countDebtNotActive = 0;
    for(let i = 0; i < bank.length; i++) {

        if(!bank[i].isActive) {
            for(let j = 0; j < bank[i].credit.length; j++) {

                if(bank[i].credit[j].ownMoney < 0) {
                    debtNotActiveUsd += callback(Math.abs(bank[i].credit[j].ownMoney), bank[i].credit[j].currency, rate, requiredCurrency);
                    countDebtNotActive += 1;
                }
            }
        }
    }
   
    document.getElementById('sumDebitNotActive').innerHTML = `${debtNotActiveUsd}`;
    document.getElementById('countNotActiveDebtor').innerHTML = `${countDebtNotActive}`
    return debtNotActiveUsd;
}

function allDebt() {
    document.getElementById('test').innerHTML = `сумма общей задолженности по банку в   
    - ${parseInt(document.getElementById('sumDebitActive').innerHTML) + parseInt(document.getElementById('sumDebitNotActive').innerHTML)}`;
}

async function toCalculateBankMoney(requiredCurrency, callback) {
    let currenRequest = (await fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')).json();
    currenRequest.then(requestResult => calculatSumBank(requestResult, requiredCurrency, callback))
    currenRequest.then((requestResult) => calculatDebtActive(requestResult, requiredCurrency, callback))
    currenRequest.then((requestResult) => calculatDebtNotActive(requestResult, requiredCurrency, callback))
    currenRequest.then((requestResult) => allDebt())
}