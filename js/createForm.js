document.body.append(document.createElement('form'));
document.querySelector('form').id = 'mainForm';
let startParents = document.querySelector('form');

function startFormCallback(container){
    addSelectOption(container.querySelector('select'));
}

function createFormCallback (container) {
    document.querySelector('#mainForm').innerHTML = '';
    createNewElement(container.querySelector('#credit'), { element: 'legend', textContent: 'Кредит' });
    createNewElement(container.querySelector('#debet'), { element: 'legend', textContent: 'Дебит' });
}

function debetAccountFormCallback (container) {
    container.querySelector(".currency").closest('p').classList.add("currencyContainer");
    addSelectOption(container.querySelector(".currency"));
}

function creditAccountFormCallback(container){
    debetAccountFormCallback (container);
    container.insertAdjacentHTML('afterbegin', `<p><label for="limit">кредитный лимит</label><input type="text" class="limit" placeholder="0" autocomplete= "off"></p>`)
}

function editFormCallback(container) {
    let legendEdit = document.createElement('legend');
    legendEdit.textContent = "Редактирование данных";
    container.prepend(legendEdit);
    createFormCallback(container);
    container.querySelector('#back').id = 'submit'
}

function deleteUserFormCallback(container) {
    container.querySelector("#search").value = 'Удалить';
    container.querySelector("#search").id = 'deleteUserButton';
}

