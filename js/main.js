addHtmlFragment(startParents, startHtmlData, startFormCallback);
listiners();

function listiners() {
    document.body.addEventListener('click', function (event) {
        if (event.target.id === "createUser") {
            clearParents(document.querySelector('#mainForm'));
            addHtmlFragment(document.querySelector('#mainForm'), createUserDate, createFormCallback)
        }

        if (event.target.id === "submit") {
            let newClientData = getEditClientData();
            createNewClient(newClientData);
            clearParents(document.querySelector('#mainForm'));
            addHtmlFragment(startParents, startHtmlData, startFormCallback);
        }

        if (event.target.classList.contains("deleteAccount")) {
            event.target.closest("fieldset").outerHTML = "";
        }

        if (event.target.id === "debitAccount") {
            addHtmlFragment(document.querySelector('#debet'), debitDataHtml, debetAccountFormCallback);
        }

        if (event.target.id === "creditAccount") {
            addHtmlFragment(document.querySelector('#credit'), debitDataHtml, creditAccountFormCallback)
        }

        if (event.target.id === "editUser") {
            clearParents(document.querySelector('#mainForm'));
            addHtmlFragment(document.querySelector('#mainForm'), searchDataHtml)
        }

        if (event.target.id === "search") {
            let searchUserData = getDataSearchUser(document.querySelector('#id').value);
            clearParents(document.querySelector('#mainForm'));
            addHtmlFragment(document.querySelector('#mainForm'), editUserDateHtml, editFormCallback);
            putEditedClientData(searchUserData);
         }

        if (event.target.id === "back") {
            clearParents(document.querySelector('#mainForm'));
            addHtmlFragment(startParents, startHtmlData, startFormCallback);
        }

        if (event.target.id === "deleteUser") {
            clearParents(document.querySelector('#mainForm'));
            addHtmlFragment(document.querySelector('#mainForm'), searchDataHtml, deleteUserFormCallback)
        }

        if (event.target.id === "deleteUserButton") {
            getDataSearchUser(document.querySelector('#id').value)
            clearParents(document.querySelector('#mainForm'));
            addHtmlFragment(startParents, startHtmlData, startFormCallback);
        }

        if (event.target.id === "calculateBank") {
            let calculateCurrency = document.getElementById('calculateCurrency').value;
            toCalculateBankMoney(calculateCurrency, convertMoney);
            clearParents(document.querySelector('#mainForm'));
            addHtmlFragment(document.querySelector('#mainForm'), calculateFormData);
            console.log(calculateBankData)
        }
    })
    document.body.addEventListener('focusout', function (event) {
        validateNameFormat(event) 
    });


}

