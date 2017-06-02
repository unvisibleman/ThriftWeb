;(function () {

    var saveSettingBtn = document.querySelector('#save-settings');
    var addCategoryItemBtn = document.querySelector('#add-category-item');
    var itemParamsSaveBtn = document.querySelector('#item-params-save');
    var itemParamsCancelBtn = document.querySelector('#item-params-cancel');

    /**
     * Получение данных формы
     * @param {HTMLElement} form - форма
     * @returns {Object} - данные формы
     */
    function formHandler(form) {
        var inputs = form.elements;
        var data = {}, i = 0, l = inputs.length;

        form.onsubmit = function(e) { e.preventDefault(); };

        for (i; i < l; i++) {
            if (inputs[i].name && inputs[i].value) {
                data[inputs[i].name] = inputs[i].value;
            }
        }

        return data;
    }

    /**
     * Сохранение настроек
     * сюда нужно будет прикрутить запрос к серверу
     * @param {Object} event - событие
     */
    function saveSettings(event) {
        var data = formHandler(this.form);
        this.form.reset();
    }

    /**
     * Переключение категорий расходов
     * навешивает обработчики клика на каждую категорию
     */
    function switchCategory() {
        var table = document.querySelector('#categories-table');
        var categories = table.querySelectorAll('.js-category');
        var i = 0, l = categories.length;
        for (i; i < l; i++) {
            categories[i].onclick = activeCategory(table);
        }
    }

    /**
     * Обработчик клика на конкретную категорию
     * меняет активную категорию
     * @param {HTMLElement} table - таблица категорий
     * @returns {Function} - обработчик клика
     */
    function activeCategory(table) {
        return function (event) {
            var active = table.querySelector('.active');

            if (active) {
                active.classList.remove('active');
            }
            this.classList.add('active');

            loadCategoryData(this.getAttribute('data-id'))
        }
    }

    /**
     * Загружает данные конкретной категории
     * сюда нужно будет прикрутить запрос к серверу
     * @param {String} category - идентификатор категории
     */
    function loadCategoryData(category) {
        var table = document.querySelector('#category-items');
        var categoryNameWrap = document.querySelector('#category-name');
        var categoryName;

        // пример данных для отрисовки элементов категории
        // после впиливания серверной логики - переделать
        var data = [];
        switch (category) {
            case 'food':
                data = [
                    {
                        id: 1,
                        category: 'Питание',
                        comment: 'Мясо',
                        cost: 450,
                        date: new Date()
                    },
                    {
                        id: 2,
                        category: 'Питание',
                        comment: 'Пиво',
                        cost: 200,
                        date: new Date()
                    }
                ];
                break;
            case 'life':
                data = [
                    {
                        id: 3,
                        category: 'Быт',
                        comment: 'Зубная паста',
                        cost: 150,
                        date: new Date()
                    },
                    {
                        id: 4,
                        category: 'Быт',
                        comment: 'Шампунь',
                        cost: 180,
                        date: new Date()
                    },
                    {
                        id: 5,
                        category: 'Быт',
                        comment: 'Гель для бритья',
                        cost: 150,
                        date: new Date()
                    },
                    {
                        id: 6,
                        category: 'Быт',
                        comment: 'Туалетная бумага',
                        cost: 20,
                        date: new Date()
                    }
                ];
                break;
            case 'other':
                data = [
                    {
                        id: 7,
                        category: 'Прочее',
                        comment: 'Джинсы',
                        cost: 2500,
                        date: new Date()
                    }
                ];
                break;

            // no default
        }

        categoryName = data.length ? data[0].category : '';
        categoryNameWrap.innerText = categoryName;
        categoryNameWrap.setAttribute('data-value', categoryName);

        table.innerHTML = '';
        table.insertAdjacentHTML('afterBegin', getHTMLString(data));

        addItemsHandlers(table);
    }

    /**
     * Формирует строку HTML-кода для всех элементов в категории
     * @param {Array.<Object>} data - массив элементов категории
     * @returns {String} - строка HTML-кода
     */
    function getHTMLString(data) {
        if (!data || !data.length) return '';

        var str = '', i = 0, l = data.length;
        for (i; i < l; i++) {
            str += getHTMLElementString(data[i]);
        }

        return str;
    }

    /**
     * Формирует строку HTML-кода для одного элемента категории
     * @param {Object} item - элемент категории
     * @returns {String} - строка HTML-кода
     */
    function getHTMLElementString(item) {
        // если будут косяки с поддержкой браузером такого формата строк,
        // заменить на обычные с конкатенацией
        return `
            <li class="collection-item js-item">
                <span class="hide" data-field="id" data-value="${item.id}"></span>
                <span class="hide" data-field="category" data-value="${item.category}"></span>
                <div class="row valign-wrapper no-m-b">
                    <div class="col s10 no-p-l">
                        <div data-field="comment" data-value="${item.comment}">${item.comment}</div>
                        <div data-field="date" data-value="${item.date}">${new Date(item.date).toLocaleDateString()}</div>
                    </div>
                    <div class="col s2 no-p-l">
                        <div class="" data-field="cost" data-value="${item.cost}">${item.cost}</div>
                    </div>
                    <a class="secondary-content pointer right-spacer js-item-edit"><i class="material-icons">mode_edit</i></a>
                    <a class="secondary-content pointer js-item-del"><i class="material-icons">delete</i></a>
                </div>
            </li>`;
    }

    /**
     * Редактирование элемента категории
     * сюда нужно будет прикрутить запрос к серверу
     * @param {HTMLElement} table - таблица элементов категории
     */
    function addItemsHandlers(table) {
        if (!table) return false;

        var items = table.querySelectorAll('.js-item');
        var edit, remove;
        var i = 0, l = items.length;
        for (i; i < l; i++) {
            edit = items[i].querySelector('.js-item-edit');
            remove = items[i].querySelector('.js-item-del');

            edit.onclick = editItem;
            remove.onclick = removeItem;
        }
    }

    /**
     * Редактирование элемента категории
     * сюда нужно будет прикрутить запрос к серверу
     * @param {Object} event - событие
     */
    function editItem(event) {
        var modal = document.querySelector('#item-params');
        var item = this.parent('js-item');
        var data = getItemData(item);

        setFormFields(modal, data);
        openModal();
    }

    /**
     * Редактирование элемента категории
     * сюда нужно будет прикрутить запрос к серверу
     * @param {HTMLElement} item - событие
     * @returns {Object} - данные элемента категории
     */
    function getItemData(item) {
        var fields = [].slice.call(item.querySelectorAll('[data-field]'));

        return fields.reduce(function (result, field) {
            result[field.getAttribute('data-field')] = field.getAttribute('data-value');
            return result;
        }, {});
    }

    /**
     * Заполнение формы данными
     * @param {HTMLElement} form - форма
     * @param {Object} data - событие
     */
    function setFormFields(form, data) {
        var key, input;
        for (key in data) {
            input = form.querySelector('[name="' + key + '"]');
            if (input) {
                input.value = data[key];
            }
        }
    }

    /**
     * Удаление элемента категории
     * сюда нужно будет прикрутить запрос к серверу
     * @param {Object} event - событие
     */
    function removeItem(event) {
        var item = this.parent('js-item');
        item.parentNode.removeChild(item);
    }

    /**
     * Открывает модальное окно добавление элемента
     */
    function openModal() {
        $('#modal').modal('open');
    }

    /**
     * Закрывает модальное окно добавление элемента,
     * очищает поля формы
     */
    function closeModal() {
        var modal = document.querySelector('#item-params');
        $('#modal').modal('close');
        modal.reset();
    }

    /**
     * Добавляет в категорию новый / редактирует старый элемент
     * сюда нужно будет прикрутить запрос к серверу
     */
    function editCategoryItem() {
        var table = document.querySelector('#category-items');
        var modal = document.querySelector('#item-params');
        var data = formHandler(modal);

        if (data.id) {
            var idField = table.querySelector('[data-field="id"][data-value="'+ data.id +'"]');
            var item = idField.parent('js-item');
            var wrap = document.createElement('div');

            wrap.insertAdjacentHTML('afterBegin', getHTMLElementString(data));
            item.parentNode.replaceChild(wrap.firstElementChild, item);
        } else {
            table.insertAdjacentHTML('beforeEnd', getHTMLElementString(data));
        }

        closeModal();
        addItemsHandlers(table);
    }

    // вызов методов после полной загрузки страницы
    // т.к. скрипт подключен внизу body,
    // то явно навешивать на onload не нужно
    saveSettingBtn.onclick = saveSettings;
    addCategoryItemBtn.onclick = openModal;
    itemParamsSaveBtn.onclick = editCategoryItem;
    itemParamsCancelBtn.onclick = closeModal;
    switchCategory();
})();