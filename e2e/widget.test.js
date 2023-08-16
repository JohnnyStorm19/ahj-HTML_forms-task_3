import puppetteer from 'puppeteer';
import { fork } from 'child_process';

jest.setTimeout(30000); // default puppeteer timeout

describe('app', () => {
  let browser = null;
  let page = null;
  let server = null;
  const baseUrl = 'http://localhost:9000';

  beforeAll(async () => {
    server = fork(`${__dirname}/e2e.server.js`);
    await new Promise((resolve, reject) => {
      server.on('error', reject);
      server.on('message', (message) => {
        if (message === 'ok') {
          resolve();
        }
      });
    });

    browser = await puppetteer.launch({
      // headless: false, // show gui
      // slowMo: 100,
      // devtools: true, // show devTools
    });
    page = await browser.newPage();
  });

  test('click on customers btn', async () => {
    await page.goto(baseUrl);
    const customerBtn = await page.$('.customers-btn');
    await customerBtn.click();
    await page.waitForSelector('.dropdown-content.active');
  });

  test('add customers', async () => {
    await page.goto(baseUrl);
    const customerBtn = await page.$('.customers-btn');
    const customersCount = await page.$('.customers-count');

    await customerBtn.click();
    const adultsItem = await page.$('[data-item="adults"]');
    const childrenItem = await page.$('[data-item="children"]');
    const babiesItem = await page.$('[data-item="babies"]');

    const adultsItemAdd = await adultsItem.$('.customers-counter-add');
    const adultsItemRemove = await adultsItem.$('.customers-counter-remove');
    const childrenItemAdd = await childrenItem.$('.customers-counter-add');
    const babiesItemAdd = await babiesItem.$('.customers-counter-add');

    await adultsItemAdd.click();
    await adultsItemAdd.click();
    await adultsItemAdd.click();
    await adultsItemRemove.click();

    await childrenItemAdd.click();
    await babiesItemAdd.click();

    customersCount.textContent === '5';

  });

  test('reverse', async () => {
    await page.goto(baseUrl);

    const inputFrom = await page.$('.input-from');
    const inputWhere = await page.$('.input-where');
    const reverseBtn = await page.$('.reverse-svg');

    let fromValue = 'Санкт-Петербург';
    let whereValue = 'Прага';

    await inputFrom.type(fromValue);
    await inputWhere.type(whereValue);

    await reverseBtn.click();

    inputFrom.value === whereValue;
    inputWhere.value === fromValue;

  });

  test('service testing', async () => {
    await page.goto(baseUrl);
    const customerBtn = await page.$('.customers-btn');
    const customersService = await page.$('.customers-service');
    const serviceInputContainer = await page.$('.service-inputs-container');

    const comfortClass = await serviceInputContainer.$('#comfort');
    const businessClass = await serviceInputContainer.$('#business');
    const firstClass = await serviceInputContainer.$('#firstclass');

    let currentService = 'Эконом';

    await customerBtn.click();
    customersService.textContent === currentService;

    await comfortClass.click();
    currentService = comfortClass.value;
    customersService.textContent === currentService;

    await businessClass.click();
    currentService = businessClass.value;
    customersService.textContent === currentService;

    await firstClass.click();
    currentService = firstClass.value;
    customersService.textContent === currentService;
  })


  afterAll(async () => {
    await browser.close();
    server.kill();
  });
});
