const mask = (selector) => { //селектор, который приходит в модуль будет отмечать инпуты. которые нужны для валидации

    //функция фокуса
    let setCursorPosition = (pos, elem) => { //принимает в качестве аргументов позицию и эл-т на котором работаем в данный момент
        elem.focus(); //вручную устанавливаем фокус на эллементе
        //ставим курсор в опред позицию + полифил для стар браузеров
        if (elem.setSelectionRange) {
            elem.setSelectionRange(pos, pos); //начальные и конечные позиции курсора
        } else if (elem.createTextRange) { // полифил для старых браузеров
            let range = elem.createTextRange();

            //настройка дипазона
            range.collapse(true); //стоит по умолчанию (обьединяет первую и последнюю точки)
            range.moveEnd('character', pos) //где будет конечная точка выделения
            range.moveStart('character', pos) //где будет начальная точка выделения
            range.select(); //выделяем значение которое сформировалась при двух параметрах енд и старт
        }
    };

    //создаем маску ввода
    function createMask(event) {
        let matrix = '_(___) ___ __ __', //матрица
            i = 0, //переменная итератор
            def = matrix.replace(/[^0-9+]/g, ''), //позволяем использовать только цифры и + иначе пустая строка (статично)
            val = this.value.replace(/[^0-9+]/g, ''); //динамичное значение, работает на основе того, что ввел пользователь

        //на всякий случай 
        if (!val) {
            return this.value = "";
        }

        let selectionStart = event.target.selectionStart; //позиция начала выделения
        //позволяем редактировать в середине строки
        if (event.target.value.length != selectionStart) {
            console.log('редактирование в середине строки', event);
            if (event.data && /[^0-9+]/g.test(event.data)) {
                event.target.value = val;
            }
            return
        }

        // не дадим вводить больше символов чем в маске
        if (def.length >= val.length) {
            val = def;
        }

        //проверяем на номера по первой цифре
        if (["7", "8", "9", "+"].indexOf(val[0]) > -1) {
            //russian number
            if (val[0] == "9") {
                matrix = '+_(___) ___ __ __',
                val = "7" + val;
            }
            if (val[0] == "8") {
                matrix = '_(___) ___ __ __';
            }
            if (val[0] == "+") {
                matrix = '__(___) ___ __ __';
            }
            if (val[0] == "7") {
                matrix = '+_(___) ___ __ __';
            }
        } else {
            //not russian numbers
            return this.value = "+" +val.replace(/\D/g, '');
        }

        //берем значение, которое ввел пользователь и во внутрь на основе матрицы положим значение, которое отобразим на странице
        this.value = matrix.replace(/./g, function(a) { //берем каждый символ глобально и для него выполняем callback ф-ю (а - это каждый эл-т)
            //каждая ф-я будет возвращать символ и проверяем данный символ является ли эл-том, который входит в опред диапазон   
            return /[_\d]/.test(a) && i < val.length ? val.charAt(i++) : i >= val.length ? '' : a;
        }); 

        //выходим с фокуса (blur)
        if (event.type === 'blur') {
            if (this.value.length == 2) {
                this.value = '';
            }
        } else  { //фокус
            setCursorPosition(this.value.length, this);
        }

        
    }

    let inputs = document.querySelectorAll(selector); //получаем эллементы на которые хотим установить маску

    inputs.forEach(input => {
        input.addEventListener('input', createMask);
        input.addEventListener('focus', createMask);
        input.addEventListener('blur', createMask);
    });
};

export default mask;