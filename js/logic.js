;(function () {
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
     * Вход в систему
     * сюда нужно будет прикрутить запрос к серверу
     * @param {Object} event - событие
     */
    function login(event) {
        var data = formHandler(this.form);
        this.form.reset();

        // пример данных для отрисовки категорий
        // после впиливания серверной логики - переделать
        var example = [
            {
                id: 'food',
                name: 'Питание',
                total: 650
            },
            {
                id: 'life',
                name: 'Быт',
                total: 500
            },
            {
                id: 'other',
                name: 'Прочее',
                total: 2500
            }
        ];
        drawCategories(example);
    }

    /**
     * Отрисовывает все категории
     * @param {Array.<Object>} data - массив элементов категории
     */
    function drawCategories(data) {
        var table = document.querySelector('#categories-table');
        table.innerHTML = '';
        table.insertAdjacentHTML('afterBegin', getAllItemsHTMLString(data, getCategoryHTMLString));
        switchCategory();
    }

    /**
     * Формирует строку HTML-кода для всех элементов массива по заданному методу
     * @param {Array.<Object>} data - массив элементов категории
     * @param {Function} method - метод для отрисовки одного элемента
     * @returns {String} - строка HTML-кода
     */
    function getAllItemsHTMLString(data, method) {
        if (!data || !data.length ||!method ||
            Object.prototype.toString.call(method) !== '[object Function]') return '';

        var str = '', i = 0, l = data.length;
        for (i; i < l; i++) {
            str += method(data[i]);
        }

        return str;
    }

    /**
     * Формирует строку HTML-кода для одной категории
     * @param {Object} item - категория
     * @returns {String} - строка HTML-кода
     */
    function getCategoryHTMLString(item) {
        // если будут косяки с поддержкой браузером такого формата строк,
        // заменить на обычные с конкатенацией
        return `
            <a class="js-category collection-item pointer" data-id="${item.id}">
                <span>${item.name}</span>
                <span class="right">${item.total}</span>
            </a>`;
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
        table.insertAdjacentHTML('afterBegin', getAllItemsHTMLString(data, getItemHTMLString));

        addItemsHandlers(table);
    }

    /**
     * Формирует строку HTML-кода для одного элемента категории
     * @param {Object} item - элемент категории
     * @returns {String} - строка HTML-кода
     */
    function getItemHTMLString(item) {
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
     * Находит все элементы таблицы и вешает на каждый обработчики
     * редактирования и удаления
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
        var modal = document.querySelector('#item-params'); // получили модальное окно
        var item = this.parent('js-item'); // получили элемент, на котором сработало событие
        var data = getItemData(item); // получили данные этого элемента

        setFormFields(modal, data); // заполнили модальное окно данными
        openModal(); // открыли модальное окно
    }

    /**
     * Получиение данных конкретного ээлемента категории
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
        var key, elem, value;
        // фейковый инпут категории, в него нужно ставить занчение select'а
        var fakeInput = form.querySelector('.select-dropdown');
        for (key in data) {
            value = data[key];
            if (key === 'date') {
                value = new Date(value).toLocaleDateString();
            }

            elem = form.querySelector('[name="' + key + '"]');
            if (elem) {
                elem.value = value;
                if (elem.tagName === 'SELECT') {
                    fakeInput.value = value;
                }
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
        var table = document.querySelector('#category-items'); // таблица элементов категории
        var modal = document.querySelector('#item-params'); // форма из модального окна
        var data = formHandler(modal); // получили данные из этой формы

        if (data.id) { // значит это редактирование старого элемента категории
            var idField = table.querySelector('[data-field="id"][data-value="'+ data.id +'"]');
            var item = idField.parent('js-item');
            var wrap = document.createElement('div');

            wrap.insertAdjacentHTML('afterBegin', getItemHTMLString(data));
            item.parentNode.replaceChild(wrap.firstElementChild, item);
        } else { // значит добавляем новый элемент
            table.insertAdjacentHTML('beforeEnd', getItemHTMLString(data));
        }

        closeModal(); // закрываем модальное окно
        addItemsHandlers(table); // вешаем на элементы категгории обработчики
    }

    // привязываем обработчики после полной загрузки страницы
    // т.к. скрипт подключен внизу body,
    // то явно навешивать на onload не нужно
    var saveSettingBtn = document.querySelector('#save-settings');
    var addCategoryItemBtn = document.querySelector('#add-category-item');
    var itemParamsSaveBtn = document.querySelector('#item-params-save');
    var itemParamsCancelBtn = document.querySelector('#item-params-cancel');

    saveSettingBtn.onclick = login;
    addCategoryItemBtn.onclick = openModal;
    itemParamsSaveBtn.onclick = editCategoryItem;
    itemParamsCancelBtn.onclick = closeModal;
})();