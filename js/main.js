document.body.append(document.createElement('form'));
document.querySelector('form').id = 'mainForm';
let startParents = document.querySelector('form');
new addHtmlForm(startParents, startHtmlData).createFragment().addSelectOption().addFragment();

listiners();

function listiners() {
    document.body.addEventListener('click', function (event) {
        if (event.target.id === "createUser") {
            clearParents(document.querySelector('#mainForm'));
            new addHtmlForm(document.querySelector('#mainForm'), createUserDate, createFormCallback).createFragment().addFragment();
        }

        if (event.target.id === "submit") {
            let newClientData = new GetPutClientData().deleteOldUserData().getClientData();
            if (!newClientData) {
                return;
            }
            bank.push(new Client(newClientData.firstName, newClientData.lastName, newClientData.isActive, newClientData.date, newClientData.id).addAccount(newClientData.accounts));
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
            let searchUserData = getSearchUserData(document.querySelector('#id').value);
            clearParents(document.querySelector('#mainForm'));
            new addHtmlForm(document.querySelector('#mainForm'), editUserDateHtml, editFormCallback).createFragment().addFragment();
            new GetPutClientData(searchUserData).putEditedClientData();
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
            let calculateCurrency = document.getElementById('calculateCurrency').value;
            toCalculateBankMoney(calculateCurrency, convertMoney);
            clearParents(document.querySelector('#mainForm'));
            new addHtmlForm(document.querySelector('#mainForm'), calculateFormData).createFragment().addFragment();
        }
    })

    document.body.addEventListener('focusout', function (event) {
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