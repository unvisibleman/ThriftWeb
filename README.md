# ThriftWeb
Frontend системы ведения личного и семейного бюджета

## Платформа разработки
Разработка ведется на следующих языках:
* html – используется для верстки страниц сайта;
* css – используется для стилизации элементов сайта.

При этом используются следующие библиотеки:
* http://materializecss.com

## Верстка
Разрабатываемый сайт состоит из одной страницы, которая позволяет выполнять такие операции как: авторизация, выбор категории, добавление нового расхода, редактирование расходов, удаление расходов. index.html – главная страница сайта.

## Использование веб-сервиса
Список функций, обращающихся к серверу:
* login(event): Авторизует (auth) и загружает суммы трат по категориям (getCategories);
* loadCategoryData(category): Загружает данные конкретной категории по строковому названию (getItems); 
* removeItem(event) Удаление элемента (deleteItems);
* editCategoryItem() Вызывается по кнопке сохранить в диалоге. Добавляет (addItem) или редактирует (updateItem) элемент.

Запросы к серверу:
* auth GET http://server/api/user/?login=LOGIN&password=PASSWORD
* getCategories GET http://server/api/categories/?token=TOKEN
* getItems GET http://server/api/item/?token=TOKEN&m=MONTH&y=YEAR&cat=CATEGORYID
* addItem POST http://server/api/item token price date title group=0 cat
* updateItem PUT http://server/api/item/?token=TOKEN&id=ITEMID&price=PRICE&date=YEAR.MONTH.DAY&title=TITLE&group=0&cat=CATEGORYID
* deleteItem DELETE http://server/api/item/?token=TOKEN&id=ITEMID

## Макеты страницы
![beforeAuth.png](https://sinair.ru/i/21dbS4B9)
Страница до авторизации
![afterAuth.png](https://sinair.ru/i/kGuXKN5g)
Страница до авторизации
![addItem.png](https://sinair.ru/i/AXTaP1T9)
Страница добавления расхода в категорию "Быт"
