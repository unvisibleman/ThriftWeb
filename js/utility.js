;(function () {
    /**
     * Поиск родителя элемента по классу
     * сюда нужно будет прикрутить запрос к серверу
     * @param {Object} value - имя класса
     * @returns {(HTMLElement|Null)} - найденный элемент или null
     */
    HTMLElement.prototype.parent = function (value) {
        var elem = this;
        while (true) {
            elem = elem.parentElement;
            if (elem === null) return null;
            if (elem.className.split(/\s+/).indexOf(value) > -1) return elem;
        }
    };

})();