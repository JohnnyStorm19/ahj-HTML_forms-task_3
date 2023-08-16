/* eslint-disable no-undef */
import './calendar.css'
import * as dayjs from 'dayjs';
import 'dayjs/locale/ru';

let isSameOrBefore = require('dayjs/plugin/isSameOrBefore')
dayjs.extend(isSameOrBefore);
let isSameOrAfter = require('dayjs/plugin/isSameOrAfter')
dayjs.extend(isSameOrAfter);

dayjs.locale('ru')

export default class Calendar {
    constructor(parentEl) {
        this.parentEl = parentEl;
        this.calendarEl;
        this.calendarsContainer;
        this.daysOfWeek = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];
        this.months =['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        this.today = dayjs();
        this.currentMonth = this.today.month();
        this.nextMonth = this.today.add(1, 'month').month();
        this.currentDate = this.today.date(); // получаем текущую дату

        this.currentYear = this.today.format('YYYY');
        this.nextMonthYear = this.today.add(1, 'month').format('YYYY');

        this.dayClicked = false;
        this.startFlyCalendar;

        this.whereBtnIsClicked = false;
        this.returnBtnIsClicked = false;

        this.whereBtnTextContent = '';
        this.returnBtnTextContent = '';

        this.clickedWhere = {};
        this.clickedReturn = {};
    }

    static getCalendarMarkup() {
        return `
            <div class="calendars-container">
                <header class="calendars-header">
                    <span class="calendar-header-title">Дата прилета/вылета</span>
                </header>
                <div class="calendars-wrapper">
                    <div class="calendar-left-wrapper">
                        <div class="calendar-month-wrapper">
                            <span class="calendar-previous-arrow"><</span>
                            <span class="calendar-month"></span>                        
                        </div>
                        <div class="weekdays-row"></div>
                        <div class="days-current"></div>
                    </div>
                    <div class="calendar-right-wrapper">
                        <div class="calendar-month-wrapper">
                            <span class="calendar-month"></span>
                            <span class="calendar-next-arrow">></span>
                        </div>
                        <div class="weekdays-row"></div>
                        <div class="days-next"></div>
                </div>
                </div>
            </div>
        `
    }

    bindToDOM() {
        this.calendarEl = Calendar.getCalendarMarkup();
        this.parentEl.insertAdjacentHTML('beforeend', this.calendarEl);
        this.bindWeekDaysNameToCalendar();
        this.renderCalendar('.days-current');
        this.renderCalendar('.days-next');
        this.addListeners();

        this.calendarsContainer = this.parentEl.querySelector('.calendars-container');
    }

    bindWeekDaysNameToCalendar() {
        const weekdaysRow = document.querySelectorAll('.weekdays-row');

        weekdaysRow.forEach(row => {
            this.daysOfWeek.forEach(day => {
                const nameWeekDayEl = document.createElement('span');
                nameWeekDayEl.classList.add('day');
                if (day === 'сб' || day === 'вс') {
                    nameWeekDayEl.classList.add('weekend')
                }
                nameWeekDayEl.textContent = day;
                row.append(nameWeekDayEl);
            })
        })
    }

    renderCalendar(container) {
        this.renderMonth();

        const currentMonth = this.months[dayjs().month()];
        const currentMonthInCalendar =  this.parentEl.querySelector('.calendar-left-wrapper .calendar-month');
        const nextMonthInCalendar = this.parentEl.querySelector('.calendar-right-wrapper .calendar-month');

        if (container === '.days-current') {
            const daysRow = document.querySelector(container); // контейнер дней для текущего календаря
            const weekDayStartOf = this.today.startOf('month').format('dd'); // узнаю день недели, с которого начинается текущий месяц
            let lastDayOfPreviousMonth = +this.today.subtract(1, 'month').endOf('month').format('D');

            let leftMonth = currentMonthInCalendar.textContent.split(' ')[0];

            let difference = this.daysOfWeek.indexOf(weekDayStartOf);
            const endOf = +this.today.endOf('month').format('D');

            for(let i = difference; i > 0; i -= 1) {
                let dayCount = lastDayOfPreviousMonth - difference + 1;
                let dayEl = document.createElement('span');
                dayEl.classList.add('week-day');
                dayEl.classList.add('previous');
                dayEl.textContent = dayCount
                daysRow.append(dayEl);
                lastDayOfPreviousMonth += 1;
            }

            for(let i = 1; i <= endOf; i += 1) {
                let dayEl = document.createElement('span');
                dayEl.classList.add('week-day');
                dayEl.dataset.month = leftMonth;
                if (leftMonth === currentMonth && i === this.today.date()) {
                    dayEl.classList.add('today');
                }
                dayEl.textContent = i;
                daysRow.append(dayEl)
            }
        }
        if (container === '.days-next') {
            const daysRowNext = document.querySelector('.days-next'); // контейнер дней для календаря следующего месяца
            const weekDayStartOf = this.today.add(1, 'month').startOf('month').format('dd'); // узнаю день недели, с которого начинается текущий месяц
            let lastDayOfPreviousMonth = +this.today.endOf('month').format('D');

            let nextMonth = nextMonthInCalendar.textContent.split(' ')[0];

            let difference = this.daysOfWeek.indexOf(weekDayStartOf);
            const endOf = +this.today.add(1, 'month').endOf('month').format('D');

            for(let i = difference; i > 0; i -= 1) {
                let dayCount = lastDayOfPreviousMonth - difference + 1;
                let dayEl = document.createElement('span');
                dayEl.classList.add('week-day');
                dayEl.classList.add('previous');
                dayEl.textContent = dayCount
                daysRowNext.append(dayEl);
                lastDayOfPreviousMonth += 1;
            }

            for(let i = 1; i <= endOf; i += 1) {
                let dayEl = document.createElement('span');
                dayEl.classList.add('week-day');
                dayEl.textContent = i;
                dayEl.dataset.month = nextMonth;
                if (nextMonth === currentMonth && i === this.today.date()) {
                    dayEl.classList.add('today');
                }
                daysRowNext.append(dayEl)
            }
        }
    }

    renderMonth() {
        const currentMonth = this.parentEl.querySelector('.calendar-left-wrapper .calendar-month');
        const nextMonth = this.parentEl.querySelector('.calendar-right-wrapper .calendar-month');

        currentMonth.textContent = `${this.months[this.currentMonth]} ${this.currentYear}`;
        nextMonth.textContent = `${this.months[this.nextMonth]} ${this.nextMonthYear}`;
    }

    addListeners() {
        const previousArrow = this.parentEl.querySelector('.calendar-previous-arrow');
        const nextArrow = this.parentEl.querySelector('.calendar-next-arrow');

        const whereBtn = this.parentEl.querySelector('.when-btn');
        const returnBtn = this.parentEl.querySelector('.return-btn');

        const calendarsContainer = this.parentEl.querySelector('.calendars-container');
        const whereRemover = whereBtn.nextElementSibling;
        const returnRemover = returnBtn.nextElementSibling;

        // очищаем дату в поле "Когда" по нажатию на "крестик"
        whereRemover.addEventListener('click', () => {
            whereRemover.classList.remove('active-remover');
            whereBtn.classList.remove('clicked-where-or-return');

            this.removeClickedDays(whereBtn);
            this.whereBtnIsClicked = false;
            whereBtn.textContent = 'Когда';
            this.hideCalendar();
            this.calendarsOn('Дата вылета');
            if (this.returnBtnIsClicked) {
                this.dayClicked = true;
            } else {
                this.dayClicked = false;
            }
        });
        // очищаем дату в поле "Обратно" по нажатию на "крестик"
        returnRemover.addEventListener('click', () => {
            returnRemover.classList.remove('active-remover');
            returnBtn.classList.remove('clicked-where-or-return');

            this.removeClickedDays(returnBtn);
            this.returnBtnIsClicked = false;
            if (this.whereBtnIsClicked) {
                this.dayClicked = true;
            } else {
                this.dayClicked = false;
            }
            returnBtn.textContent = 'Обратно';
            this.hideCalendar();
            this.calendarsOn('Дата возвращения');
        })
        // переключаем календарь "назад"
        previousArrow.addEventListener('click', () => {
            const currentMonth = this.months[dayjs().format('M') - 1];
            const previousMonth = this.months[dayjs().format('M') - 2];
            console.log(previousMonth, currentMonth);


            if (previousArrow.nextElementSibling.textContent.split(' ')[0] === previousMonth) return;


            this.today = this.today.subtract(1, 'month');
            this.currentMonth = this.today.month();
            this.nextMonth = this.today.add(1, 'month').month();

            this.currentYear = this.today.format('YYYY');
            this.nextMonthYear = this.today.add(1, 'month').format('YYYY');

            this.clearCalendar('.days-current', '.days-next');
            this.renderCalendar('.days-current');
            this.renderCalendar('.days-next');
        });
        // переключаем календарь "вперед"
        nextArrow.addEventListener('click', () => {
            this.today = this.today.add(1, 'month');
            this.currentMonth = this.today.month();
            this.nextMonth = this.today.add(1, 'month').month();

            this.currentYear = this.today.format('YYYY');
            this.nextMonthYear = this.today.add(1, 'month').format('YYYY')

            this.clearCalendar('.days-current', '.days-next');
            this.renderCalendar('.days-current');
            this.renderCalendar('.days-next');
        })

        // настраиваю кнопку поля "Когда"
        whereBtn.addEventListener('click', () => {
            const dropdown = document.querySelector('.dropdown-content');
            dropdown.classList.remove('active');
            this.calendarsOn('Дата вылета');

        })
        // настраиваю кнопку поля "Обратно"
        returnBtn.addEventListener('click', () => {
            const dropdown = document.querySelector('.dropdown-content');
            dropdown.classList.remove('active');
            this.calendarsOn('Дата возвращения');
        })

        // событие при наведении на дату календаря 
        calendarsContainer.addEventListener('mouseover', (e) => {
            this.onMouseOver(e, whereBtn, returnBtn);
        })
        // событие при "уходе" мышки с календаря
        calendarsContainer.addEventListener('mouseout', () => {
            this.onMouseOut(whereBtn, returnBtn)
        })
        // событие клика на день
        calendarsContainer.addEventListener('click', (e) => {
            this.onDayClick(e, whereBtn, returnBtn);
        })
    }

    // показываем календарь: зависит от того, какую строку передаем
    calendarsOn(titleText) {
        if (!(titleText === 'Дата вылета' || titleText === 'Дата возвращения')) {
            throw new Error("Аргумент должен быть либо 'Дата вылета', либо 'Дата возвращения'");
        }
        this.hideCalendar();
        this.revealCalendar();
        
        const title = this.parentEl.querySelector('.calendar-header-title');

        if (titleText === 'Дата вылета') {
            this.startFlyCalendar = true;
        }
        if (titleText === 'Дата возвращения') {
            this.startFlyCalendar = false;
        }

        title.textContent = titleText;
    }

    // срабатывает при наведении на дату
    onMouseOver(event, whereBtn, returnBtn) {
        const target = event.target.closest('.week-day');
        let text;
        // "отключаем" срабатывание при наведении на невалидные даты
        if (!target || target.classList.contains('previous')) return;

        // если уже кликнули "Когда" и "Обратно", но открыт при этом календарь "Дата вылета" (хотим поменять дату вылета), проверяем на каждом календаре
        if ((this.whereBtnIsClicked && this.returnBtnIsClicked) && this.startFlyCalendar && target && target.closest('.calendar-left-wrapper')) {
            text = this.calculateTextFromCalendars(target.closest('.calendar-left-wrapper'), event.target);
            this.onHoverBtnText(whereBtn, text);
        } else if((this.whereBtnIsClicked && this.returnBtnIsClicked) && this.startFlyCalendar && target && target.closest('.calendar-right-wrapper')) {
            text = this.calculateTextFromCalendars(target.closest('.calendar-right-wrapper'), event.target);
            this.onHoverBtnText(whereBtn, text);
        }

        // если уже кликнули "Когда" и "Обратно", но открыт при этом календарь "Дата возвращения" (хотим поменять дату вылета), проверяем на каждом календаре
        if ((this.whereBtnIsClicked && this.returnBtnIsClicked) && !this.startFlyCalendar && target && target.closest('.calendar-left-wrapper')) {
            let text = this.calculateTextFromCalendars(target.closest('.calendar-left-wrapper'), event.target);
            this.onHoverBtnText(returnBtn, text);
        } else if((this.whereBtnIsClicked && this.returnBtnIsClicked) && !this.startFlyCalendar && target && target.closest('.calendar-right-wrapper')) {
            text = this.calculateTextFromCalendars(target.closest('.calendar-right-wrapper'), event.target);
            this.onHoverBtnText(returnBtn, text);
        }
        
        // здесь проверяю несколько условий соответственно: 
        // - навели на дату левого календаря, открыт календарь "дата вылета" и не выбрана ни одна дата
        // - навели на дату правого календаря, открыт календарь "дата вылета" и не выбрана ни одна дата
        // - навели на дату левого календаря, открыт календарь "дата вылета" и выбрана одна дата
        // - навели на дату правого календаря, открыт календарь "дата вылета" и выбрана одна дата
        // - навели на дату левого календаря, открыт календарь "дата возвращения" и выбрана одна дата
        // - навели на дату правого календаря, открыт календарь "дата возвращения" и выбрана одна дата
        if (target && target.closest('.calendar-left-wrapper') && this.startFlyCalendar && !this.dayClicked) {
            text = this.calculateTextFromCalendars(target.closest('.calendar-left-wrapper'), event.target);
            this.onHoverBtnText(whereBtn, text);
        } else if (target && target.closest('.calendar-right-wrapper') && this.startFlyCalendar && !this.dayClicked) {
            text = this.calculateTextFromCalendars(target.closest('.calendar-right-wrapper'), event.target);
            this.onHoverBtnText(whereBtn, text);
        } else if (target && target.closest('.calendar-left-wrapper') && this.startFlyCalendar && this.dayClicked) {
            let text = this.calculateTextFromCalendars(target.closest('.calendar-left-wrapper'), event.target);
            this.onHoverBtnText(whereBtn, text);
        } else if (target && target.closest('.calendar-right-wrapper') && this.startFlyCalendar && this.dayClicked) {
            text = this.calculateTextFromCalendars(target.closest('.calendar-right-wrapper'), event.target);
            this.onHoverBtnText(whereBtn, text);
        } else if (target && target.closest('.calendar-left-wrapper') && !this.startFlyCalendar && this.dayClicked) {
            text = this.calculateTextFromCalendars(target.closest('.calendar-left-wrapper'), event.target);
            this.onHoverBtnText(returnBtn, text);
        } else if (target && target.closest('.calendar-right-wrapper') && !this.startFlyCalendar && this.dayClicked) {
            text = this.calculateTextFromCalendars(target.closest('.calendar-right-wrapper'), event.target);
            this.onHoverBtnText(returnBtn, text);
        }

        // здесь проверяю несколько условий: 
        // - навели на дату левого календаря, открыт календарь "дата возвращения" и не выбрана ни одна дата
        // - навели на дату правого календаря, открыт календарь "дата возвращения" и не выбрана ни одна дата
        if (target && target.closest('.calendar-left-wrapper') && !this.startFlyCalendar && !this.dayClicked) {
            text = this.calculateTextFromCalendars(target.closest('.calendar-left-wrapper'), event.target);
            this.onHoverBtnText(returnBtn, text);
        } else if (target && target.closest('.calendar-right-wrapper') && !this.startFlyCalendar && !this.dayClicked) {
            text = this.calculateTextFromCalendars(target.closest('.calendar-right-wrapper'), event.target);
            this.onHoverBtnText(returnBtn, text);
        }
    }

    // срабатывает при уходе курсора с элемента
    onMouseOut(whereBtn, returnBtn) {
        // если уже есть кликнутые даты, то при уходе с элемента оставляем кликнутые значения вместо "Когда" и "Обратно"
        if (this.whereBtnIsClicked && this.returnBtnIsClicked) {
            whereBtn.textContent = this.whereBtnTextContent;
            returnBtn.textContent = this.returnBtnTextContent;
        } else if (this.whereBtnIsClicked && !this.returnBtnIsClicked) {
            whereBtn.textContent = this.whereBtnTextContent;
        } else if (!this.whereBtnIsClicked && this.returnBtnIsClicked) {
            returnBtn.textContent = this.returnBtnTextContent;
        }

        if (!this.dayClicked && !this.whereBtnIsClicked) {
            whereBtn.textContent = 'Когда';
        } else if (this.dayClicked && !this.whereBtnIsClicked) {
            whereBtn.textContent = 'Когда';
        }

        if (this.dayClicked === true && !this.returnBtnIsClicked) {
            returnBtn.textContent = 'Обратно';
        } else if (!this.dayClicked && !this.returnBtnIsClicked) {
            returnBtn.textContent = 'Обратно';
        }

        if (this.dayClicked === 'done') return;
    }

    // обрабатываем клик по дню
    onDayClick(event, whereBtn, returnBtn) {
        const target = event.target.closest('.week-day');
        const whereRemoverEl = whereBtn.nextElementSibling;
        const returnRemoverEl = returnBtn.nextElementSibling;

        if (!target || target.classList.contains('previous')) return; 
        // функция определит меньше ли кликнутая дата чем сегодняшняя

        if (target && !this.compareClickedWithToday(target)) return;


        // здесь проверяю несколько условий: 
        // - обе даты выбраны и открыт календарь "Дата вылета"
        // - обе даты выбраны и открыт календарь "Дата возвращения"
        if (this.whereBtnIsClicked && this.returnBtnIsClicked && this.startFlyCalendar) {
            if (!this.compareDates(returnBtn, target)) return;
            this.removeClickedDays(whereBtn);
            target.classList.add('clicked-day');
            target.dataset.direction = 'when';

            this.whereBtnTextContent = whereBtn.textContent;
            this.clickedWhere = this.createAnObj(this.whereBtnTextContent, whereBtn, target);
        } else if (this.whereBtnIsClicked && this.returnBtnIsClicked && !this.startFlyCalendar) {
            if (!this.compareDates(whereBtn, target)) return;
            this.removeClickedDays(returnBtn);
            target.classList.add('clicked-day');
            target.dataset.direction = 'return';

            this.returnBtnTextContent = returnBtn.textContent;
            this.clickedReturn = this.createAnObj(this.returnBtnTextContent, returnBtn, target);
        }

        // здесь проверяю несколько условий: 
        // - даты не выбраны, открыт календарь "Дата вылета" и кликнули на валидную дату
        // - выбрана одна из дат, открыт календарь "Дата возвращения" и кликнули на валидную дату
        // - даты не выбраны, открыт календарь "Дата возвращения" и кликнули на валидную дату
        // - выбрана одна из дат, открыт календарь "Дата вылета" и кликнули на валидную дату
        if (!this.dayClicked && this.startFlyCalendar && target) {
            target.classList.add('clicked-day');
            target.dataset.direction = 'where';

            this.dayClicked = true;
            whereBtn.classList.add('clicked-where-or-return');
            whereRemoverEl.classList.add('active-remover');
            
            this.whereBtnIsClicked = true;
            this.whereBtnTextContent = whereBtn.textContent;
            this.clickedWhere = this.createAnObj(this.whereBtnTextContent, whereBtn, target)

            this.calendarsOn('Дата возвращения');
        } else if(this.dayClicked && !this.startFlyCalendar && target) {
            if (!this.compareDates(whereBtn, target)) return;
            returnBtn.classList.add('clicked-where-or-return');
            returnRemoverEl.classList.add('active-remover');
            target.classList.add('clicked-day');
            target.dataset.direction = 'return';

            this.returnBtnIsClicked = true;
            this.dayClicked = 'done';

            this.returnBtnTextContent = returnBtn.textContent;
            this.clickedReturn = this.createAnObj(this.returnBtnTextContent, returnBtn, target);

            if (this.whereBtnIsClicked && this.returnBtnIsClicked) this.hideCalendar(); // если обе даты выбраны - закрываем календарь
        } else if (!this.dayClicked && !this.startFlyCalendar && target) {
            returnBtn.classList.add('clicked-where-or-return');
            returnRemoverEl.classList.add('active-remover');
            target.classList.add('clicked-day');
            target.dataset.direction = 'return';

            this.returnBtnIsClicked = true;
            this.dayClicked = true;
            this.calendarsOn('Дата вылета');

            this.returnBtnTextContent = returnBtn.textContent;
            this.clickedReturn = this.createAnObj(this.returnBtnTextContent, returnBtn, target);
        } else if (this.dayClicked && this.startFlyCalendar && target) {
            if (!this.compareDates(returnBtn, target)) return;
            target.classList.add('clicked-day');
            target.dataset.direction = 'where';

            this.dayClicked = 'done';
            whereBtn.classList.add('clicked-where-or-return');
            whereRemoverEl.classList.add('active-remover');
            
            this.whereBtnIsClicked = true;

            this.whereBtnTextContent = whereBtn.textContent;
            this.clickedWhere = this.createAnObj(this.whereBtnTextContent, whereBtn, target);
            if (this.whereBtnIsClicked && this.returnBtnIsClicked) this.hideCalendar(); // если обе даты выбраны - закрываем календарь
        }
        console.log(this.clickedWhere, this.clickedReturn);
    }

    // очищаем оба календаря
    clearCalendar(currentCalendarSelector, nextCalendarSelector) {
        let currentCalendarEl = this.parentEl.querySelector(currentCalendarSelector);
        let nextCalendarEl = this.parentEl.querySelector(nextCalendarSelector);

        [...currentCalendarEl.querySelectorAll('span')].forEach(day => day.remove());
        [...nextCalendarEl.querySelectorAll('span')].forEach(day => day.remove());
    }

    onHoverBtnText(btn, text) {
        btn.textContent = text;
    }

    hideCalendar() {
        this.calendarsContainer.classList.remove('active');
    }
    revealCalendar() {
        this.calendarsContainer.classList.add('active');
    }

    // удаляем обводку при клике на другую дату
    removeClickedDays(btn) {
        if (btn.classList.contains('when-btn')) {
            this.clickedWhere.clickedDate.classList.remove('clicked-day');
        }
        if (btn.classList.contains('return-btn')) {
            this.clickedReturn.clickedDate.classList.remove('clicked-day');
        }
        console.log('сработала функция удаления обводки дней!')
    }

    // функция для работы с отображением текста при наведении / клике на дату (ЧИСЛО МЕСЯЦ, день недели)
    calculateTextFromCalendars(calendar, target) {
        let date;
        let text;
        if (calendar.classList.contains('calendar-left-wrapper')) {
            date = `${this.currentYear}-${this.currentMonth + 1}-${target.textContent}`;
            let weekday = dayjs(date).format('dd');
            text = `${target.textContent} ${this.months[this.currentMonth]}, ${weekday}`;
        } 
        if (calendar.classList.contains('calendar-right-wrapper')) {
            date = `${this.nextMonthYear}-${this.nextMonth + 1}-${target.textContent}`
            let weekday = dayjs(date).format('dd');
            text = `${target.textContent} ${this.months[this.nextMonth]}, ${weekday}`;
        }
        return text;
    }

    // для удобной работы с кликнутой датой создаю объект: кликнутая дата, месяц, год, на какой кнопке (Когда или Обратно) отобразится дата 
    // и непосредственно сам элемент 
    createAnObj(btnTextContent, directionBtn, target) {
        let month = '';
        let date = '';
        let year = '';

        const leftCalendar = target.closest('.calendar-left-wrapper');
        const rightCalendar = target.closest('.calendar-right-wrapper');
        let targetDataMonth;

        if (leftCalendar != null) {
            targetDataMonth = leftCalendar.querySelector('.calendar-month-wrapper .calendar-month');
        } else if (rightCalendar != null) {
            targetDataMonth = rightCalendar.querySelector('.calendar-month-wrapper .calendar-month');
        }
        const targetDateText = targetDataMonth.textContent.split(',').join('').split(' ');
        year = targetDateText[1];

        const btnTextContentArr = btnTextContent.split(',').join('').split(' ');
        date = btnTextContentArr[0];
        month = btnTextContentArr[1];

        return { date: date, month: month, year: year, directionBtn: directionBtn, clickedDate: target };
    }
    
    // функция, где сравниваются даты (чтобы не получилось выбрать дату вылета позже, чем дата прилета)
    // для работы использовал возможности библиотеки dayjs, в частности методы isSameOrBefore / isSameOrAfter из соответствующих плагинов
    compareDates(btn, clicked) {
        // сравниваем, чтобы return-дата не была меньше where-даты. Если меньше, то false, если больше или равна, то true
        const leftCalendar = clicked.closest('.calendar-left-wrapper');
        const rightCalendar = clicked.closest('.calendar-right-wrapper');

        let date;
        let dateToCompare;
        let targetDataMonth;
        let targetDateText;

        if (leftCalendar != null) {
            targetDataMonth = leftCalendar.querySelector('.calendar-month-wrapper .calendar-month');
        }
        if (rightCalendar != null) {
            targetDataMonth = rightCalendar.querySelector('.calendar-month-wrapper .calendar-month');
        }

        targetDateText = targetDataMonth.textContent.split(',').join('').split(' ');
        date = `${targetDateText[1]}-${String(+this.months.indexOf(targetDateText[0]) + 1)}-${clicked.textContent}`;

        if (btn.classList.contains('when-btn')) {
            // сравниваем, чтобы дата не была меньше
            dateToCompare = `${this.clickedWhere.year}-${String(+this.months.indexOf(this.clickedWhere.month) + 1)}-${this.clickedWhere.date}` // это дата с которой сравнивать (уже кликнутая)

            if (dayjs(date).isSameOrAfter(dateToCompare)) return true;
            return false;
        }
        if (btn.classList.contains('return-btn')) {
            // сравниваем, чтобы дата не была больше
            dateToCompare = `${this.clickedReturn.year}-${String(+this.months.indexOf(this.clickedReturn.month) + 1)}-${this.clickedReturn.date}`;
            
            if (dayjs(date).isSameOrBefore(dateToCompare)) return true;
            return false;
        }
    }
    compareClickedWithToday(target) {
        const today = dayjs().format('YYYY-MM-DD');
        const leftCalendar = target.closest('.calendar-left-wrapper');
        const rightCalendar = target.closest('.calendar-right-wrapper');

        let clickedDateMonth;
        let clickedDate;

        if (leftCalendar != null) {
            clickedDateMonth = leftCalendar.querySelector('.calendar-month-wrapper .calendar-month');
        }
        if (rightCalendar != null) {
            clickedDateMonth = rightCalendar.querySelector('.calendar-month-wrapper .calendar-month');
        }

        // const month = this.months[this.months.indexOf(clickedDateMonth.textContent.split(' ')[0])];
        const month = this.months.indexOf(clickedDateMonth.textContent.split(' ')[0]) + 1;
        console.log(month);

        clickedDate = `${clickedDateMonth.textContent.split(' ')[1]}-${month}-${target.textContent}`;

        console.log(clickedDate);

        if (dayjs(today).isSameOrBefore(clickedDate)) {
            console.log('TRUE!')
            return true;
        }
        console.log('FALSE!!!')
        return false;
    }
}