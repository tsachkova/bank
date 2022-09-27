var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var calculateBankData = {};
function convertMoney(currencyRate, requiredCurrency, sum, currencyAccount) {
    if ((requiredCurrency.length !== 3) && (typeof requiredCurrency !== 'string')) {
        throw new Error("invalid currency type format");
    }
    if ((sum >= 0) && (currencyAccount === requiredCurrency)) {
        return sum;
    }
    var rate;
    function getRate(currency) {
        for (var i = 0; i < currencyRate.length; i++) {
            if (currency === currencyRate[i].ccy) {
                rate = currencyRate[i];
            }
        }
        if (currencyRate === undefined) {
            alert("this type of currency is not found");
            document.querySelector('body').innerHTML = '';
            returnStartForm();
            throw new Error("this type of currency is not found");
        }
        return rate;
    }
    var requiredCurrencyRate;
    if (requiredCurrency !== 'UAH') {
        requiredCurrencyRate = getRate(requiredCurrency);
    }
    if ((sum >= 0) && (currencyAccount !== 'UAH')) {
        var accountCurrencyRate = getRate(currencyAccount);
        var accountUah = sum * Number(accountCurrencyRate.sale);
        if (requiredCurrency === 'UAH') {
            return accountUah;
        }
        return accountUah / Number(requiredCurrencyRate.sale);
    }
    if (sum >= 0) {
        return sum / Number(requiredCurrencyRate.sale);
    }
}
function calculatSumBank(rate, requiredCurrency, callback) {
    var sumBankUsd = 0;
    var rateCurrencyCallback = callback.bind({}, rate, requiredCurrency);
    for (var i = 0; i < bank.length; i++) {
        var _a = bank[i], credit = _a.credit, debet = _a.debet;
        for (var j = 0; j < credit.length; j++) {
            if (credit[j].ownMoney > 0) {
                sumBankUsd += rateCurrencyCallback(credit[j].ownMoney, credit[j].currency);
            }
            sumBankUsd += rateCurrencyCallback(credit[j].creditMoney, credit[j].currency);
        }
        for (var j = 0; j < bank[i].debet.length; j++) {
            sumBankUsd += rateCurrencyCallback(debet[j].ownMoney, debet[j].currency);
        }
    }
    calculateBankData['allBankSum'] = sumBankUsd;
}
function calculatDebt(rate, requiredCurrency, convertCallback, sumKey, countKey, callback) {
    var debt = 0;
    var countDebt = 0;
    for (var i = 0; i < bank.length; i++) {
        var isCalculetData = void 0;
        if (callback) {
            isCalculetData = callback(bank[i]);
        }
        else {
            isCalculetData = true;
        }
        var count = 0;
        if (isCalculetData) {
            for (var j = 0; j < bank[i].credit.length; j++) {
                if (bank[i].credit[j].ownMoney < 0) {
                    debt += convertCallback(rate, requiredCurrency, Math.abs(bank[i].credit[j].ownMoney), bank[i].credit[j].currency);
                    count = count || 1;
                }
            }
            countDebt += count;
        }
    }
    calculateBankData[sumKey] = debt;
    if (countKey) {
        calculateBankData[countKey] = countDebt;
    }
}
function debtActive(clientData) {
    if (clientData.isActive) {
        return true;
    }
}
function debtNotActive(clientData) {
    if (!clientData.isActive) {
        return true;
    }
}
function toCalculateBankMoney(requiredCurrency, callback) {
    return __awaiter(this, void 0, void 0, function () {
        var currenRequest;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5')];
                case 1:
                    currenRequest = (_a.sent()).json();
                    currenRequest.then(function (requestResult) { return calculatSumBank(requestResult, requiredCurrency, callback); });
                    currenRequest.then(function (requestResult) { return calculatDebt(requestResult, requiredCurrency, callback, 'sumDebtActive', 'countDebtActiveUser', debtActive); });
                    currenRequest.then(function (requestResult) { return calculatDebt(requestResult, requiredCurrency, callback, 'sumDebtNotActive', 'countNotActiveDebtor', debtNotActive); });
                    currenRequest.then(function (requestResult) { return calculatDebt(requestResult, requiredCurrency, callback, 'allDebtSum'); });
                    currenRequest.then(function () { return putCalculateData(calculateBankData, requiredCurrency); });
                    return [2 /*return*/];
            }
        });
    });
}

var createFormCallback = function (container) {
    mainForm.innerHTML = '';
    var legendCredit = document.createElement('legend');
    legendCredit.textContent = 'Кредит';
    var creditContainer = container.querySelector('#credit');
    creditContainer.append(legendCredit);
    var legendDebet = document.createElement('legend');
    legendDebet.textContent = 'Дебит';
    var debitContainer = container.querySelector('#debet');
    debitContainer.append(legendDebet);
};
var creditAccountFormCallback = function (container) {
    container.insertAdjacentHTML('afterbegin', "<p><label for=\"limit\">\u043A\u0440\u0435\u0434\u0438\u0442\u043D\u044B\u0439 \u043B\u0438\u043C\u0438\u0442</label><input type=\"text\" class=\"limit\" placeholder=\"0\" autocomplete= \"off\"></p>");
};
var editFormCallback = function (container) {
    var legendEdit = document.createElement('legend');
    legendEdit.textContent = "Редактирование данных";
    container.prepend(legendEdit);
    createFormCallback(container);
};
var deleteUserFormCallback = function (container) {
    var seaerchContainer = document.querySelector("#search");
    seaerchContainer.value = 'Удалить';
    seaerchContainer.id = 'deleteUserButton';
};

var addHtmlForm = /** @class */ (function () {
    function addHtmlForm(parent, dataHtml, callback) {
        this.container = document.createElement('fieldset');
        this.dataHtml = dataHtml;
        this.parent = parent;
        this.callback = callback;
    }
    addHtmlForm.prototype.createNewElement = function (elementData, elementParent) {
        function createElementForTeg(tag, options) {
            var element = document.createElement(tag);
            if (options) {
                Object.assign(element, options);
            }
            return element;
        }
        var element = createElementForTeg(elementData.element);
        if (typeof elementData.element === 'string') {
            element = document.createElement(elementData.element);
            if (elementData.name) {
                element.setAttribute('name', "".concat(elementData.name));
            }
            if (elementData.id) {
                element.id = elementData.id;
            }
            if (elementData.className) {
                element.setAttribute('class', "".concat(elementData.className));
            }
            if (elementData.type) {
                element.setAttribute('type', "".concat(elementData.type));
            }
            if (elementData.value) {
                element.setAttribute('value', "".concat(elementData.value));
            }
            if (elementData["for"]) {
                element.setAttribute('for', "".concat(elementData["for"]));
            }
            if (elementData.size) {
                element.setAttribute('size', "".concat(elementData.size));
            }
            if (elementData.textContent) {
                element.textContent = "".concat(elementData.textContent);
            }
            if (elementData.placeholder) {
                element.setAttribute('placeholder', "".concat(elementData.placeholder));
            }
        }
        elementParent.append(element);
        return this;
    };
    addHtmlForm.prototype.createFragment = function () {
        for (var i = 0; i < this.dataHtml.length; i++) {
            var elementData = void 0;
            var elementParent = void 0;
            elementData = this.dataHtml[i];
            if (elementData.p) {
                elementParent = document.createElement('p');
                this.createNewElement(elementData, elementParent);
                if (elementData.nextElement) {
                    elementData = elementData.nextElement;
                    this.createNewElement(elementData, elementParent);
                }
                this.container.append(elementParent);
            }
            else {
                elementParent = this.container;
                this.createNewElement(elementData, elementParent);
                if (elementData.nextElement) {
                    elementData = elementData.nextElement;
                    this.createNewElement(elementData, elementParent);
                }
                ;
            }
        }
        return this;
    };
    addHtmlForm.prototype.addFragment = function () {
        if (this.callback) {
            this.callback(this.container);
        }
        this.parent.append(this.container);
    };
    addHtmlForm.prototype.addSelectOption = function () {
        var optionParent = this.container.querySelector('select');
        var optionValues = ["UAH", "EUR", "USD"];
        for (var i = 0; i < optionValues.length; i++) {
            var options = document.createElement('option');
            options.value = optionValues[i];
            options.innerHTML = optionValues[i];
            ;
            optionParent.append(options);
        }
        return this;
    };
    return addHtmlForm;
}());
function clearParents(parents) {
    parents.innerHTML = '';
}
function returnStartForm() {
    if (editedClientGetPut) {
        editedClientGetPut = null;
    }
    clearParents(document.querySelector('#mainForm'));
    new addHtmlForm(startParents, startHtmlData).createFragment().addSelectOption().addFragment();
}

var bank = [];
var Account = /** @class */ (function () {
    function Account(sum, currency, isActive, dateActive, creditMoney, limit) {
        this.currency = currency;
        this.ownMoney = sum;
        this.isActive = isActive;
        this.dateActive = dateActive;
        this.creditMoney = creditMoney;
        this.limit = limit;
    }
    return Account;
}());
var Client = /** @class */ (function () {
    function Client(firstName, lastName, isActive, id, date) {
        this.debet = [];
        this.credit = [];
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.isActive = isActive;
        this.date = date;
    }
    Client.prototype.addAccount = function (accounts) {
        for (var i = 0; i < accounts.length; i++) {
            if (accounts[i].hasOwnProperty('limit')) {
                if (accounts[i].ownMoney < 0) {
                    throw new Error("exceeded credit limit");
                }
                var creditMoney = (accounts[i].ownMoney - accounts[i].limit) > 0 && accounts[i].limit || accounts[i].ownMoney;
                var ownMoney = accounts[i].ownMoney - accounts[i].limit;
                this.credit.push(new Account(ownMoney, accounts[i].currency, accounts[i].isActive, accounts[i].dateActive, creditMoney, accounts[i].limit));
            }
            else {
                if (accounts[i].ownMoney < 0) {
                    throw new Error("debet account must be greater than zero");
                }
                this.debet.push(new Account(accounts[i].ownMoney, accounts[i].currency, accounts[i].isActive, accounts[i].dateActive));
            }
        }
        return this;
    };
    return Client;
}());
function getSearchUserData(idClient) {
    for (var i = 0; i < bank.length; i++) {
        if (bank[i].id === Number(idClient)) {
            return bank[i];
        }
    }
}
function deleteUser(idDeleteUser) {
    for (var i = 0; i < bank.length; i++) {
        if (bank[i].id === Number(idDeleteUser)) {
            bank.splice(i, 1);
            return;
        }
    }
    alert('Нет клиента с таким ID');
}

var editedClientGetPut;
var GetPutClientData = /** @class */ (function () {
    function GetPutClientData(clientData) {
        this.clientData = clientData;
    }
    GetPutClientData.prototype.putEditedClientData = function () {
        if (!this.clientData) {
            alert('в базе нет клиента c таким id');
            returnStartForm();
            return;
        }
        this.idEditClient = this.clientData.id;
        this.dateEditClient = this.clientData.date;
        document.getElementById('firstName').value = this.clientData.firstName;
        document.getElementById('lastName').value = this.clientData.lastName;
        if (this.clientData.isActive) {
            document.getElementById('isActive').setAttribute('checked', "checked");
        }
        document.getElementById('idEditClient').textContent += "".concat(this.clientData.id);
        document.getElementById('dateEditClient').textContent += "".concat(this.clientData.date);
        var debetAccountForms = document.getElementById('debet');
        for (var i = 0; i < this.clientData.debet.length; i++) {
            new Accounts({ bankAcountsData: this.clientData.debet[i] }, debetAccountForms).generateAccountsForm().putAccountsData();
        }
        var creditAccountForms = document.getElementById('credit');
        for (var i = 0; i < this.clientData.credit.length; i++) {
            new Accounts({ bankAcountsData: this.clientData.credit[i] }, creditAccountForms).generateAccountsForm().putAccountsData();
        }
    };
    GetPutClientData.prototype.getClientData = function () {
        var firstName = document.getElementById('firstName').value;
        var lastName = document.getElementById('lastName').value;
        if (!(firstName && lastName)) {
            alert('введите имя и фамилию');
            document.getElementById('firstName').value = '';
            document.getElementById('lastName').value = '';
            return;
        }
        var isActive = document.getElementById('isActive').checked;
        var date = '';
        if (this.dateEditClient) {
            date = this.dateEditClient;
        }
        else {
            var dateArrey = new Date().toString().match(/[A-Za-z]{3}\s\d\d\s\d{4}/);
            if (dateArrey !== null)
                date = dateArrey[0];
        }
        var id = 1;
        if (this.idEditClient) {
            id = Number(this.idEditClient);
        }
        else {
            for (var i = 0; i < bank.length; i++) {
                if (id <= bank[i].id) {
                    id = bank[i].id + 1;
                }
            }
        }
        var accountsDebet = document.getElementById('debet').getElementsByTagName('fieldset');
        var accountsCredit = document.getElementById('credit').getElementsByTagName('fieldset');
        var accounts = [];
        for (var i = 0; i < accountsDebet.length; i++) {
            var newAccount = new Accounts({ accountsForm: accountsDebet[i] }).getAccountsData();
            if (newAccount) {
                accounts.push(newAccount);
            }
        }
        for (var i = 0; i < accountsCredit.length; i++) {
            var newAccount = new Accounts({ accountsForm: accountsCredit[i] }).getAccountsData();
            if (newAccount) {
                accounts.push(newAccount);
            }
        }
        var newClientData = {
            firstName: firstName,
            lastName: lastName,
            isActive: isActive,
            date: date,
            id: id,
            accounts: accounts
        };
        return newClientData;
    };
    GetPutClientData.prototype.deleteOldUserData = function () {
        deleteUser(Number(this.idEditClient));
        return this;
    };
    return GetPutClientData;
}());
var Accounts = /** @class */ (function () {
    function Accounts(accountData, accountContainer) {
        this.accountForm = accountData.accountsForm;
        this.accountsContainer = accountContainer;
        this.bankAcountsData = accountData.bankAcountsData;
    }
    Accounts.prototype.generateAccountsForm = function () {
        if (this.accountsContainer) {
            if ((this.bankAcountsData) && (this.bankAcountsData.limit || this.bankAcountsData.limit === 0)) {
                new addHtmlForm(this.accountsContainer, debitDataHtml, creditAccountFormCallback).createFragment().addFragment();
            }
            else {
                new addHtmlForm(this.accountsContainer, debitDataHtml).createFragment().addFragment();
            }
        }
        return this;
    };
    Accounts.prototype.putAccountsData = function () {
        if ((this.bankAcountsData) && (this.accountsContainer)) {
            var carrentAccountContainer = this.accountsContainer.lastElementChild;
            if (this.bankAcountsData.limit || this.bankAcountsData.limit === 0) {
                carrentAccountContainer.querySelector('.limit').value = this.bankAcountsData.limit.toString();
                carrentAccountContainer.querySelector('.ownSum').value = (this.bankAcountsData.limit + this.bankAcountsData.ownMoney).toString();
            }
            else {
                carrentAccountContainer.querySelector('.ownSum').value = this.bankAcountsData.ownMoney.toString();
            }
            if (this.bankAcountsData.isActive) {
                carrentAccountContainer.querySelector('.isActive').setAttribute('checked', "checked");
            }
            carrentAccountContainer.querySelector('.currency').closest('p').innerHTML = "\n            <p><label for=\"currency\" >\u0432\u0430\u043B\u044E\u0442\u0430 \u0441\u0447\u0435\u0442\u0430</label>\n            <select class = \"currency\" size=\"1\">\n                <option selected  value= ".concat(this.bankAcountsData.currency, ">").concat(this.bankAcountsData.currency, "</option>\n            </select></p>");
        }
    };
    Accounts.prototype.getAccountsData = function () {
        if (this.accountForm) {
            var ownSum = Number(this.accountForm.querySelector('.ownSum').value) || 0;
            var accountData = {
                currency: this.accountForm.querySelector('.currency').value,
                ownMoney: ownSum,
                isActive: this.accountForm.querySelector('.isActive').checked,
                dateActive: new Date().toString()
            };
            if (this.accountForm.querySelector('.limit')) {
                accountData.limit = +this.accountForm.querySelector('.limit').value || 0;
            }
            return accountData;
        }
    };
    return Accounts;
}());
function putCalculateData(calculateData, calculateCarrency) {
    var fieldArrey = document.querySelector('fieldset').querySelectorAll('input');
    for (var i = 0; i < fieldArrey.length; i++) {
        if (fieldArrey[i].type === 'text') {
            fieldArrey[i].previousSibling.textContent += calculateCarrency;
            fieldArrey[i].value = calculateData[fieldArrey[i].id];
        }
    }
}

var startHtmlData = [
    {
        element: 'input',
        type: 'button',
        value: 'создать нового пользователя',
        id: "createUser",
        p: true
    },
    {
        element: 'input',
        type: 'button',
        value: 'изменить данные пользователя',
        id: "editUser",
        p: true
    },
    {
        element: 'input',
        type: 'button',
        value: 'удалить пользователя',
        id: "deleteUser",
        p: true
    },
    {
        element: 'input',
        type: 'button',
        value: 'Рассчитать суммарные показатели по банку',
        id: "calculateBank",
        p: true
    },
    {
        element: 'label',
        "for": "calculateCurrency",
        textContent: 'рассчетная валюта  ',
        nextElement: {
            element: 'select',
            id: "calculateCurrency",
            size: '1'
        }
    }
];
var createUserData = [
    {
        p: true,
        element: 'label',
        "for": "firstName",
        textContent: 'Имя ',
        nextElement: {
            element: 'input',
            type: 'text',
            id: "firstName",
            name: "firstName"
        }
    },
    {
        p: true,
        element: 'label',
        "for": "lastName",
        textContent: 'Фамилия ',
        nextElement: {
            element: 'input',
            type: 'text',
            id: "lastName",
            name: "lastName"
        }
    },
    {
        p: true,
        element: 'label',
        "for": "isActive",
        textContent: 'Активность аккаунта',
        nextElement: {
            element: 'input',
            type: 'checkbox',
            id: "isActive"
        }
    },
    {
        element: 'fieldset',
        id: 'debet'
    },
    {
        element: 'fieldset',
        id: 'credit'
    },
    {
        element: 'input',
        type: 'button',
        value: "добавить дебитовый счет",
        id: "debitAccount"
    },
    {
        element: 'input',
        type: 'button',
        value: "добавить кредитовый счет",
        id: "creditAccount"
    },
    {
        p: true,
        element: 'input',
        type: "button",
        id: 'submit',
        value: "Применить"
    },
    {
        p: true,
        element: 'input',
        type: "button",
        id: 'back',
        value: "  Отмена  "
    },
];
var debitDataHtml = [
    {
        p: true,
        element: 'label',
        "for": "ownSum",
        textContent: 'сумма на счету',
        nextElement: {
            element: 'input',
            type: 'text',
            className: "ownSum",
            placeholder: "0"
        }
    },
    {
        p: true,
        element: 'label',
        "for": "isActive",
        textContent: 'счет активен',
        nextElement: {
            element: 'input',
            type: "checkbox",
            className: "isActive"
        }
    },
    {
        p: true,
        element: 'label',
        "for": "currency",
        textContent: 'валюта счета',
        nextElement: {
            element: 'select',
            className: "currency",
            size: '1'
        }
    },
    {
        p: true,
        element: 'input',
        type: "button",
        className: "deleteAccount",
        value: "удалить"
    },
];
var searchDataHtml = [
    {
        element: 'legend',
        textContent: 'Изменение данных'
    },
    {
        p: true,
        element: 'label',
        "for": "id",
        textContent: 'id',
        nextElement: {
            element: 'input',
            type: 'text',
            id: "id"
        }
    },
    {
        p: true,
        element: 'input',
        type: "button",
        id: 'search',
        value: "Искать"
    },
    {
        p: true,
        element: 'input',
        type: "button",
        id: 'back',
        value: "Назад"
    },
];
var editUserData = [
    {
        element: 'p',
        textContent: 'ID клиента - ',
        id: "idEditClient"
    },
    {
        element: 'p',
        textContent: 'Дата регистрации - ',
        id: "dateEditClient"
    },
];
var editUserDataHtml = editUserData.concat(createUserData);
var calculateFormData = [
    {
        p: true,
        element: 'label',
        "for": "allBankSum",
        textContent: "\u0441\u0443\u043C\u043C\u0430 \u0441\u0440\u0435\u0434\u0441\u0442\u0432 \u043F\u043E \u0431\u0430\u043D\u043A\u0443 \u0432 ",
        nextElement: {
            element: 'input',
            type: 'text',
            id: "allBankSum",
            name: "allBankSum"
        }
    },
    {
        p: true,
        element: 'label',
        "for": "sumDebtActive",
        textContent: "\u0441\u0443\u043C\u043C\u0430 \u0437\u0430\u0434\u043E\u043B\u0436\u0435\u043D\u043D\u043E\u0441\u0442\u0438 \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u0432 \u043F\u043E \u0431\u0430\u043D\u043A\u0443 \u0432 ",
        nextElement: {
            element: 'input',
            type: 'text',
            id: "sumDebtActive",
            name: "sumDebtActive"
        }
    },
    {
        p: true,
        element: 'label',
        "for": "countDebtActiveUser",
        textContent: "\u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u0432 - \u0434\u043E\u043B\u0436\u043D\u0438\u043A\u043E\u0432 ",
        nextElement: {
            element: 'input',
            type: 'text',
            id: "countDebtActiveUser",
            name: "countDebtActiveUser"
        }
    },
    {
        p: true,
        element: 'label',
        "for": "sumDebtNotActive",
        textContent: "\u0441\u0443\u043C\u043C\u0430 \u0437\u0430\u0434\u043E\u043B\u0436\u0435\u043D\u043D\u043E\u0441\u0442\u0438 \u043D\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u0432 \u043F\u043E \u0431\u0430\u043D\u043A\u0443 \u0432  ",
        nextElement: {
            element: 'input',
            type: 'text',
            id: "sumDebtNotActive",
            name: "sumDebtNotActive"
        }
    },
    {
        p: true,
        element: 'label',
        "for": "countNotActiveDebtor",
        textContent: "\u043A\u043E\u043B\u0438\u0447\u0435\u0441\u0442\u0432\u043E \u043D\u0435\u0430\u043A\u0442\u0438\u0432\u043D\u044B\u0445 \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u0432 - \u0434\u043E\u043B\u0436\u043D\u0438\u043A\u043E\u0432 ",
        nextElement: {
            element: 'input',
            type: 'text',
            id: "countNotActiveDebtor",
            name: "countNotActiveDebtor"
        }
    },
    {
        p: true,
        element: 'label',
        "for": "allDebtSum",
        textContent: "\u0441\u0443\u043C\u043C\u0430 \u043E\u0431\u0449\u0435\u0439 \u0437\u0430\u0434\u043E\u043B\u0436\u0435\u043D\u043D\u043E\u0441\u0442\u0438 \u043F\u043E \u0431\u0430\u043D\u043A\u0443 \u0432 ",
        nextElement: {
            element: 'input',
            type: 'text',
            id: "allDebtSum",
            name: "allDebtSum"
        }
    },
    {
        p: true,
        element: 'input',
        type: "button",
        id: 'back',
        value: "Назад"
    }
];

console.log(document.body);
document.body.append(document.createElement('form'));
var mainForm = document.querySelector('form');
console.log(mainForm);
mainForm.id = 'mainForm';
var startParents = document.querySelector('form');
new addHtmlForm(startParents, startHtmlData).createFragment().addSelectOption().addFragment();
listiners();
function listiners() {
    document.body.addEventListener('click', function (event) {
        if (event.target) {
            if (event.target.id === "createUser") {
                clearParents(document.querySelector('#mainForm'));
                new addHtmlForm(document.querySelector('#mainForm'), createUserData, createFormCallback).createFragment().addFragment();
            }
            if (event.target.id === "submit") {
                var newClientData = void 0;
                if (editedClientGetPut) {
                    newClientData = editedClientGetPut.deleteOldUserData().getClientData();
                    editedClientGetPut = null;
                }
                else {
                    newClientData = new GetPutClientData().getClientData();
                }
                if (!newClientData) {
                    return;
                }
                bank.push(new Client(newClientData.firstName, newClientData.lastName, newClientData.isActive, newClientData.id, newClientData.date).addAccount(newClientData.accounts));
                returnStartForm();
            }
            if (event.target.classList.contains("deleteAccount")) {
                event.target.closest("fieldset").outerHTML = "";
            }
            if (event.target.id === "debitAccount") {
                new addHtmlForm(document.querySelector('#debet'), debitDataHtml).createFragment().addSelectOption().addFragment();
            }
            if (event.target.id === "creditAccount") {
                new addHtmlForm(document.querySelector('#credit'), debitDataHtml, creditAccountFormCallback).createFragment().addSelectOption().addFragment();
            }
            if (event.target.id === "editUser") {
                clearParents(document.querySelector('#mainForm'));
                new addHtmlForm(document.querySelector('#mainForm'), searchDataHtml).createFragment().addFragment();
            }
            if (event.target.id === "search") {
                var searchUserData = getSearchUserData(document.querySelector('#id').value);
                clearParents(document.querySelector('#mainForm'));
                new addHtmlForm(document.querySelector('#mainForm'), editUserDataHtml, editFormCallback).createFragment().addFragment();
                editedClientGetPut = new GetPutClientData(searchUserData);
                editedClientGetPut.putEditedClientData();
            }
            if (event.target.id === "back") {
                returnStartForm();
            }
            if (event.target.id === "deleteUser") {
                clearParents(document.querySelector('#mainForm'));
                new addHtmlForm(document.querySelector('#mainForm'), searchDataHtml, deleteUserFormCallback).createFragment().addFragment();
            }
            if (event.target.id === "deleteUserButton") {
                deleteUser(document.querySelector('#id').value);
                returnStartForm();
            }
            if (event.target.id === "calculateBank") {
                var calculateCurrency = document.getElementById('calculateCurrency').value;
                toCalculateBankMoney(calculateCurrency, convertMoney);
                clearParents(document.querySelector('#mainForm'));
                new addHtmlForm(document.querySelector('#mainForm'), calculateFormData).createFragment().addFragment();
            }
        }
    });
    document.body.addEventListener('focusout', function (event) {
        event.preventDefault();
        if (event.target.classList.contains("ownSum") || event.target.classList.contains("limit")) {
            if (!/^\d+$/.test(event.target.value) && !(event.target.value.length === 0)) {
                alert("Поля 'сумма на счету' и 'кредитный лимит' должны содержать только цифры");
                event.target.value = '';
            }
        }
        if ((event.target.id === 'firstName') || (event.target.id === 'lastName')) {
            if (!/^[A-Za-z]+$/.test(event.target.value) && !(event.target.value === '')) {
                alert("Поля 'Имя' и 'Фамилия' должны содержать только буквы");
                event.target.value = '';
            }
        }
    });
}
