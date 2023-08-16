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

  test('calendar appears', async () => {
    await page.goto(baseUrl);

    const whenBtn = await page.$('.when-btn');
    const returnBtn = await page.$('.return-btn');
    let calendarsHeader;

    await whenBtn.click();
    await page.waitForSelector('.active');

    calendarsHeader = await page.$('.calendar-header-title')
    calendarsHeader.textContent === 'Дата вылета';

    await returnBtn.click();
    await page.waitForSelector('.active');
    calendarsHeader = await page.$('.calendar-header-title');
    calendarsHeader.textContent === 'Дата возвращения';
  });

  test('click on today', async () => {
    await page.goto(baseUrl);

    const whenBtn = await page.$('.when-btn');
    let clickedTodayDay = await page.$('.today');

    await whenBtn.click();
    await clickedTodayDay.click();
    await page.evaluate(() => {
      const clickedTodayDay = document.querySelector('.today');
      const string = `${clickedTodayDay.textContent} ${clickedTodayDay.getAttribute('month')}`;
      const whenBtn = document.querySelector('.when-btn');
      return whenBtn.textContent.includes(string);
    });
  });

  test('click on whenBtn', async () => {
    await page.goto(baseUrl);
    const whenBtn = await page.$('.when-btn');
    const calendarTitle = await page.$('.calendar-header-title');

    await whenBtn.click();
    calendarTitle.textContent === 'Дата вылета';
  }) 

  test('click on returnBtn', async () => {
    await page.goto(baseUrl);
    const returnBtn = await page.$('.return-btn');
    const calendarTitle = await page.$('.calendar-header-title');

    await returnBtn.click();
    calendarTitle.textContent === 'Дата возвращения';
  }) 


  afterAll(async () => {
    await browser.close();
    server.kill();
  });
});
