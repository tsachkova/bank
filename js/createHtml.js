function createNewElement(parentElement, elementData) {

    let element =  document.createElement(elementData.element);

    if (elementData.name) {
        element.name = elementData.name;
    }

    if (elementData.id) {
        element.id = elementData.id;
    }

    if (elementData.className) {
        element.setAttribute('class', `${elementData.className}`);
    }

    if (elementData.type) {
        element.type = elementData.type;
    }

    if (elementData.value) {
        element.value = elementData.value;
    }

    if (elementData.for) {
        element.setAttribute('for', `${elementData.for}`);
    }

    if (elementData.size) {
        element.setAttribute('size', `${elementData.size}`);
    }

    if (elementData.textContent) {
        element.textContent = `${elementData.textContent}`;
    }

    if (elementData.placeholder) {
        element.setAttribute('placeholder', `${elementData.placeholder}`);
    }

    parentElement.append(element);
}

function addHtml(dataHtml, container) {
    let htmlContainer = container;
    
    
    for (let i = 0; i < dataHtml.length; i++) {
        if (dataHtml[i].p) {
            let newP = document.createElement('p');
            
            createNewElement(newP, dataHtml[i]);

            if (dataHtml[i].nextElement) {
                createNewElement(newP, dataHtml[i].nextElement);
            }

            htmlContainer.append(newP);

        } else {
            createNewElement(htmlContainer, dataHtml[i]);

            if (dataHtml[i].nextElement) {
                createNewElement(htmlContainer, dataHtml[i].nextElement);
            }
        }
    }
    return htmlContainer;
}

function addSelectOption(parentSelect) {
    let selectOption = document.createDocumentFragment();
    let optionValues = ["UAH", "EUR", "USD"];

    for (let i = 0; i < optionValues.length; i++) {
        createNewElement(selectOption, { element:'option', value: optionValues[i]});
        selectOption.lastChild.innerHTML = optionValues[i];
    }

    parentSelect.append(selectOption);
}


function addHtmlFragment(parents, formData, callback) {
    
    let form = addHtml(formData, document.createElement('fieldset'));
    
    if(callback){
    callback(form);
    }
    parents.append(form);
    
}



function clearParents(parents) {
    parents.innerHTML = '';
}