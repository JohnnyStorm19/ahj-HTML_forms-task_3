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

  test('page is loading', async () => {
    await page.goto(baseUrl);

    await page.waitForSelector('body');
    await page.waitForSelector('.container');
  });

  test('widget is rendering', async () => {
    await page.goto(baseUrl);

    await page.waitForSelector('.container');
    await page.waitForSelector('.widget-container');
    await page.waitForSelector('.widget-form');
    await page.waitForSelector('.inputs-wrapper');
    await page.waitForSelector('.buttons-wrapper');
    await page.waitForSelector('.dropdown-customers');
    await page.waitForSelector('.find-btn-wrapper');
    await page.waitForSelector('.calendars-container');
  });

  afterAll(async () => {
    await browser.close();
    server.kill();
  });
});
