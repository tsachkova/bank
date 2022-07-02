class addHtmlForm {

    constructor(parent, dataHtml, callback) {
        this.dataHtml = dataHtml;
        this.parent = parent;
        this.callback = callback;

    }

    container = document.createElement('fieldset');
    elementData;
    elementParent;

    createNewElement() {
        let element = document.createElement(this.elementData.element);

        if (this.elementData.name) {
            element.name = this.elementData.name;
        }

        if (this.elementData.id) {
            element.id = this.elementData.id;
        }

        if (this.elementData.className) {
            element.setAttribute('class', `${this.elementData.className}`);
        }

        if (this.elementData.type) {
            element.type = this.elementData.type;
        }

        if (this.elementData.value) {
            element.value = this.elementData.value;
        }

        if (this.elementData.for) {
            element.setAttribute('for', `${this.elementData.for}`);
        }

        if (this.elementData.size) {
            element.setAttribute('size', `${this.elementData.size}`);
        }

        if (this.elementData.textContent) {
            element.textContent = `${this.elementData.textContent}`;
        }

        if (this.elementData.placeholder) {
            element.setAttribute('placeholder', `${this.elementData.placeholder}`);
        }

        this.elementParent.append(element);
        return this;
    }

    createFragment() {
        for (let i = 0; i < this.dataHtml.length; i++) {
            this.elementData = this.dataHtml[i];
            if (this.dataHtml[i].p) {
                this.elementParent = document.createElement('p');
                this.createNewElement();

                if (this.dataHtml[i].nextElement) {
                    this.elementData = this.dataHtml[i].nextElement;
                    this.createNewElement();
                }

                this.container.append(this.elementParent);

            } else {
                this.elementParent = this.container;
                this.createNewElement();

                if (this.dataHtml[i].nextElement) {
                    this.elementData = this.dataHtml[i].nextElement;
                    this.createNewElement();
                };
            }
        }

        return this;
    }

    addFragment() {
        if (this.callback) {
            this.callback(this.container);
        }

        this.parent.append(this.container);
    }

    addSelectOption() {
        let optionParent = this.container.querySelector('select');


        let optionValues = ["UAH", "EUR", "USD"];

        for (let i = 0; i < optionValues.length; i++) {
            let options = document.createElement('option');
            options.value = optionValues[i];
            options.innerHTML = optionValues[i];;
            optionParent.append(options);
        }

        return this;
    }
}

function clearParents(parents) {
    parents.innerHTML = '';
}

function returnStartForm() {
    clearParents(document.querySelector('#mainForm'));
    new addHtmlForm(startParents, startHtmlData).createFragment().addSelectOption().addFragment();
}