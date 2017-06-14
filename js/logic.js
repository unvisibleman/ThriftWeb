;(function () {

    var token = "";
    var categories = ["food", "life", "other"];
    var categoriesRus = ["Питание", "Быт", "Прочие"];

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
     * API Client: auth, get categories
     * @param {Object} event - событие
     */
    function login(event) {
        var data = formHandler(this.form);
        //this.form.reset();
	
	var request = "/api/user/?login=" + data['login'] + "&password=" + data['password'];
	console.log( request );
	$.ajax({
		url: request,
		type: "GET",
		success: function(data) { 
			recive = JSON.parse(data);
			if(recive["code"] == 200){
				// if ok - save recived token
				console.log(recive);
				token = recive["data"];
				
				// and load total values for categories
				var request = "/api/categories/?token=" + token;
                		$.ajax({
               		        	url: request,
               			        type: "GET",
                		        success: function(data){
						console.log(data["data"]);
						recive = data["data"];
						recive[0]["id"] = 'food'; recive[1]["id"]='life'; recive[2]["id"]='other';
						//console.log(recive);
						drawCategories(recive);
					},
		                        error:   function(data) {alert("Ошибка: "+data); }
                		});
			}else{
				alert("Ошибка: " + recive["data"]);
			} 
		},
		error:	 function(data) {alert("Ошибка: "+data); }
	});

/*
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
*/
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
     * API Client: get items
     * @param {String} category - идентификатор категории
     */
    function loadCategoryData(category) {
        var table = document.querySelector('#category-items');
        var categoryNameWrap = document.querySelector('#category-name');
        var categoryName;

	var d = new Date();
	var request = "/api/item/?token="+token+"&m="+(d.getMonth()+1)+"&y="+d.getFullYear()+"&cat="+(categories.indexOf(category)+1);
	console.log(request);
	$.ajax({
		url: request,
		type: "GET",
		success: function(data){
			//console.log(data);
			recived = JSON.parse(data)["data"];
			categoryName = categoriesRus[categories.indexOf(category)] //data.length ? data[0].category : '';
		        categoryNameWrap.innerText = categoryName;
		        categoryNameWrap.setAttribute('data-value', categoryName);

		        table.innerHTML = '';
		        table.insertAdjacentHTML('afterBegin', getAllItemsHTMLString(recived, getItemHTMLString));

		        addItemsHandlers(table);
		},
		error: function(data){ alert("Ошибка "+data ) } 
	});

/*        var data = [];
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
	*/
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
                <span class="hide" data-field="category" data-value="${categoriesRus[item.category]}"></span>
                <div class="row valign-wrapper no-m-b">
                    <div class="col s10 no-p-l">
                        <div data-field="comment" data-value="${item.coment}">${item.comment}</div>
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
     * Находит все элементы таблицы и вешает на каждый обраобтчики редактирования и удаления
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
     * Вызов окна редактирования элемента
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
     * Получение данных конкретного элемена категори
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
     * API Client: delete item
     * @param {Object} event - событие
     */
    function removeItem(event) {
        var item = this.parent('js-item');
	var id = $(item).find('[data-field=id]').attr('data-value');
	var request = "/api/item/?token="+token+"&id="+id;
	$.ajax({
		url: request,
		type: "DELETE",
		error: function(data){ alert("Ошибка: "+data); }
	});
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
     * Добавляет или редактирует элемент
     * API Client: update item, add item
     */
    function editCategoryItem() {
        var table = document.querySelector('#category-items');
        var modal = document.querySelector('#item-params');
        var data = formHandler(modal);

        if (data.id) {
            // редактируем имеющийся
            console.log(data);
            var idField = table.querySelector('[data-field="id"][data-value="'+ data.id +'"]');
            var item = idField.parent('js-item');
            var wrap = document.createElement('div');

            wrap.insertAdjacentHTML('afterBegin', getItemHTMLString(data));
            item.parentNode.replaceChild(wrap.firstElementChild, item);
        } else {
            // добавляем новый элемент
	    data["token"] = token;
	    //console.log(data);
	    data["category"] = categoriesRus.indexOf(data["category"])+1;
	    // преобрзовать дату
	    var convdate = new Date(data["date"]);
	    data["date"] = convdate.getFullYear() + "." + (convdate.getMonth()+1) + "." + convdate.getDate();
	    console.log(data);
	    var request = "/api/item/";
	    $.ajax({
		url: request,
		data: data,
		type: "POST",
		success: function(data){ console.log(data); },
		error: function(data){ alert(data); }
	    });
            table.insertAdjacentHTML('beforeEnd', getItemHTMLString(data));
        }

        closeModal();
        addItemsHandlers(table);
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
