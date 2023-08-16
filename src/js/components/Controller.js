import Calendar from "./calendar/calendar";
import { Widget } from "./widget/widget";

export default class WidgetController {
    constructor(parentEl) {
        this.parentEl = parentEl;
        this.widgetEl;
        this.calendarEl;
    }

    bindToDOM() {
        this.widgetEl = new Widget(this.parentEl);
        this.widgetEl.bindToDOM();


        const widgetContainer = this.parentEl.querySelector('.widget-container');
        this.calendarEl = new Calendar(widgetContainer);
        this.calendarEl.bindToDOM();

        this.addListeners();
    }
    addListeners() {
        this.parentEl.addEventListener('click', (e) => {
            const target = e.target;
            // сворачиваем календарь или выпадающее меню по клику на пустое место
            if (target.classList.contains('container') || target.classList.contains('widget-container')) {
                const calendar = this.parentEl.querySelector('.calendars-container');
                const dropdownContent = this.parentEl.querySelector('.dropdown-content');

                calendar.classList.remove('active');
                dropdownContent.classList.remove('active');
            }
        })
    }

}