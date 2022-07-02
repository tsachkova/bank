function createFormCallback(container) {
    document.querySelector('#mainForm').innerHTML = '';
    let legendCredit = document.createElement('legend');
    legendCredit.textContent = 'Кредит';
    container.querySelector('#credit').append(legendCredit);
    let legendDebet = document.createElement('legend');
    legendDebet.textContent = 'Дебит';
    container.querySelector('#debet').append(legendDebet);
}

function creditAccountFormCallback(container) {
    container.insertAdjacentHTML('afterbegin', `<p><label for="limit">кредитный лимит</label><input type="text" class="limit" placeholder="0" autocomplete= "off"></p>`);
}

function editFormCallback(container) {
    let legendEdit = document.createElement('legend');
    legendEdit.textContent = "Редактирование данных";
    container.prepend(legendEdit);
    createFormCallback(container);
}

function deleteUserFormCallback(container) {
    container.querySelector("#search").value = 'Удалить';
    container.querySelector("#search").id = 'deleteUserButton';
}