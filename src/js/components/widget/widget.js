import "./widget.css";


export class Widget {
    constructor(parentEl) {
        this.parentEl = parentEl;
        this.customersCountEl;
        this.inputFromEl;
        this.inputWhereEl;

        this.adults = 1;
        this.children = 0;
        this.babies = 0;

    }

    static getWidgetMarkup() {
        return `
            <div class="widget-container">
                <form class="widget-form">
                    <div class ="inputs-wrapper">
                        <input type="text" class="input-from" placeholder="Откуда"></input>
                        <span class="reverse">
                            <svg xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 512 512" class="reverse-svg"><path class="reverse-svg" d="M74.99 74.98C121.32 28.66 185.33 0 256 0c70.68 0 134.68 28.66 181.01 74.98C483.33 121.31 512 185.32 512 256c0 70.67-28.66 134.68-74.98 181.01C390.69 483.33 326.68 512 256 512s-134.68-28.67-181.01-74.99C28.68 390.62 0 326.61 0 256c0-70.68 28.67-134.69 74.99-181.02zm131.05 79.41c7.48-3.28 15.3-5.79 23.31-7.49l.66-.13c8.46-1.73 17.11-2.64 25.8-2.64 34.79 0 66.32 14.14 89.15 36.96 22.9 22.83 37.04 54.4 37.04 89.24 0 34.78-14.15 66.34-37.01 89.19-22.79 22.87-54.34 37-89.18 37-32.78 0-62.71-12.58-85.19-33.19-22.67-20.77-37.76-49.72-40.55-82.06-.83-9.71 6.36-18.27 16.07-19.11 9.7-.83 18.27 6.36 19.1 16.07 2.02 23.39 12.85 44.25 29.11 59.16 16.14 14.79 37.72 23.82 61.46 23.82 25.08 0 47.81-10.18 64.26-26.62 16.46-16.38 26.62-39.12 26.62-64.26 0-25.1-10.18-47.83-26.62-64.27-16.41-16.44-39.15-26.62-64.26-26.62-6.51 0-12.76.63-18.62 1.81l-.54.13c-6.11 1.3-11.95 3.19-17.35 5.63l18.36 7.4c9.02 3.61 13.4 13.88 9.79 22.9-3.61 9.02-13.88 13.4-22.9 9.79l-57.44-23.18c-9.03-3.61-13.4-13.88-9.79-22.9l22.09-54.75c3.61-9.02 13.88-13.4 22.9-9.79 9.02 3.61 13.4 13.88 9.79 22.9l-6.06 15.01z"/></svg>
                        </span>
                        <input type="text" class="input-where" placeholder="Куда"></input>
                    </div>
                    <div class="buttons-wrapper">
                        <div class="button-wrapper">
                            <button type="button" class="when-btn">
                                Когда
                            </button>
                            <span class="remover">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><style>.c{stroke:#1237a5;stroke-linecap:round;stroke-linejoin:round;}</style></defs><g id="a"/><g id="b"><line class="c" x1="6" x2="18" y1="6" y2="18"/><line class="c" x1="18" x2="6" y1="6" y2="18"/></g></svg>
                            </span>
                        </div>
                        <div class="button-wrapper">
                            <button type="button" class="return-btn">
                                Обратно
                            </button>
                            <span class="remover">
                                <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><style>.c{stroke:#1237a5;stroke-linecap:round;stroke-linejoin:round;}</style></defs><g id="a"/><g id="b"><line class="c" x1="6" x2="18" y1="6" y2="18"/><line class="c" x1="18" x2="6" y1="6" y2="18"/></g></svg>                            
                            </span>
                        </div>
                    </div>
                    <div class="dropdown-customers">
                        <span class="customers-btn" type="button">
                            <div class="customers-count-wrapper">
                                <span class="customers-count-head">Пассажиров</span>
                                <span class="customers-count">1</span>
                                <span class="customers-service">Эконом</span>
                            </div>
                            <span class="customers-triangle">&#9660</span>
                        </span>
                        <div class="dropdown-content">
                            <div class="customers-count-wrapper">
                                <span class="dropdown-count-head">Количество пассажиров</span>
                                <div class="customers-count-container">
                                    <div class="customers-item" data-item="adults">
                                        <div class="customers-decrpition-wrapper">
                                            <span class="customers-description-name">Взрослые</span>
                                            <span class="customers-description-about">Старше 12 лет</span>
                                        </div>
                                        <div class="customers-counter">
                                            <span class="customers-counter-remove">-</span>
                                            <span class="customers-counter-result" data-person="adults-count">1</span>
                                            <span class="customers-counter-add">+</span>
                                        </div>
                                    </div>
                                    <div class="customers-item" data-item="children">
                                        <div class="customers-decrpition-wrapper">
                                            <span class="customers-description-name">Дети</span>
                                            <span class="customers-description-about">От 2 до 12 лет</span>
                                        </div>
                                        <div class="customers-counter">
                                            <span class="customers-counter-remove">-</span>
                                            <span class="customers-counter-result" data-person="children-count">0</span>
                                            <span class="customers-counter-add">+</span>
                                        </div>
                                    </div>
                                    <div class="customers-item" data-item="babies">
                                        <div class="customers-decrpition-wrapper">
                                            <span class="customers-description-name">Младенцы</span>
                                            <span class="customers-description-about">До 2 лет, без места</span>
                                        </div>
                                        <div class="customers-counter">
                                            <span class="customers-counter-remove">-</span>
                                            <span class="customers-counter-result" data-person="babies-count">0</span>
                                            <span class="customers-counter-add">+</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="customers-service-wrapper">
                                <span class="dropdown-count-head">Класс обслуживания</span>

                                <div class="service-inputs-container">

                                    <div class="input-wrapper">
                                        <label for="econom">Эконом</label>
                                        <input type="radio" id="econom" name="service" value="Эконом" checked />
                                    </div>

                                    <div class="input-wrapper">
                                        <label for="comfort">Комфорт</label>
                                        <input type="radio" id="comfort" name="service" value="Комфорт" />
                                    </div>
                                
                                    <div class="input-wrapper">
                                        <label for="business">Бизнес</label>
                                        <input type="radio" id="business" name="service" value="Бизнес" />
                                    </div>

                                    <div class="input-wrapper">
                                        <label for="firstclass">Первый класс</label>
                                        <input type="radio" id="firstclass" name="service" value="Первый класс" />
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="find-btn-wrapper">
                        <button class="find-btn" type="button">Найти билеты</button>
                    </div>
                </form>
            </div>
        `
    }

    bindToDOM() {
        this.parentEl.insertAdjacentHTML('beforeend', Widget.getWidgetMarkup());
        
        this.customersCountEl = this.parentEl.querySelector('.customers-count');
        this.inputFromEl = this.parentEl.querySelector('.input-from');
        this.inputWhereEl = this.parentEl.querySelector('.input-where');
        this.positionReverse(this.inputFromEl, this.inputWhereEl);
        
        this.addListeners();
    }

    addListeners() {
        const customersBtn = this.parentEl.querySelector('.customers-btn');
        const triangle = this.parentEl.querySelector('.customers-triangle');

        customersBtn.addEventListener('click', () => {
            const dropdownContent = this.parentEl.querySelector('.dropdown-content');
            const calendar = this.parentEl.querySelector('.calendars-container');

            dropdownContent.classList.toggle('active');
            triangle.classList.toggle('rotated');

            calendar.classList.remove('active');
        });

        this.parentEl.addEventListener('change', (e) => {
            const customersService = this.parentEl.querySelector('.customers-service');

            const target = e.target;
            if (target.type === 'radio') {
                customersService.textContent = target.value;
            }
        });

        this.parentEl.addEventListener('click', (e) => {
            const target = e.target;
            let res;

            // меняем местами точки назначения
            if (target.classList.contains('reverse-svg-path') || target.classList.contains('reverse-svg') && (this.inputFromEl.value && this.inputWhereEl.value)) {
                this.reverse(this.inputFromEl, this.inputWhereEl);
            }

            if (target.classList.contains('customers-counter-add')) {
                res = target.previousElementSibling;
                // на одного младенца должен приходиться один взрослый
                if (res.dataset.person === 'babies-count') {
                    if (this.babies < this.adults) {
                        res.textContent++;
                        this.addingInfo(res.dataset.person, res.textContent);
                        this.calculateCustomers(this.adults, this.children, this.babies);
                    }
                } else {
                    res.textContent++;
                    this.addingInfo(res.dataset.person, res.textContent);
                    this.calculateCustomers(this.adults, this.children, this.babies);
                }
            }
            if (target.classList.contains('customers-counter-remove')) {
                res = target.nextElementSibling;
                if (res.dataset.person === 'adults-count' && res.textContent === '1') return;
                if (res.textContent === '0') return;
                res.textContent--;
                console.log(res.dataset.person);

                this.addingInfo(res.dataset.person, res.textContent);
                this.calculateCustomers(this.adults, this.children, this.babies);
            }
        });
    }
    addingInfo(dataAttr, count) {
        if (dataAttr === 'adults-count') this.adults = count;
        if (dataAttr === 'children-count') this.children = count;
        if (dataAttr === 'babies-count') this.babies = count;

        console.log(this.adults, this.children, this.babies);
    }

    calculateCustomers(adults, children, babies) {
        this.customersCountEl.textContent = +adults + +children + +babies;
    }

    positionReverse() {
        const reverseCircle = this.parentEl.querySelector('.reverse');

        reverseCircle.style.transform = "translate(200px, 17.5px)";
    }

    reverse(inputFrom, inputWhere) {
        let temp = inputFrom.value;
        inputFrom.value = inputWhere.value;
        inputWhere.value = temp;
    }
}
