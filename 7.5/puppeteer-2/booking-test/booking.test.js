const puppeteer = require('puppeteer');
const { clickSeanceByTime } = require('./helpers');

jest.setTimeout(30000);

describe('Booking Tickets — happy & sad paths', () => {
    let browser;
    let page;
    const baseURL = 'http://qamid.tmweb.ru/client/index.php';

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 50,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        await page.goto(baseURL);
    });

    test('Должна успешно забронироваться пара мест во вторник', async () => {
        // Выбор вторника
        await page.click('nav a:nth-child(2)');
        await page.waitForSelector('.movie-seances__time');

        // Переход на первый доступный сеанс
        await page.click('.movie-seances__time');
        await page.waitForSelector('.buying-scheme__wrapper');

        // Выбор двух мест и бронирование
        await page.click('.buying-scheme__row:nth-child(6) span:nth-child(3)');
        await page.click('.buying-scheme__row:nth-child(6) span:nth-child(4)');
        await page.click('.acceptin-button');

        await page.waitForSelector('.ticket__check-title');
        const confirmText = await page.$eval('.ticket__check-title', el => el.textContent.trim());

        expect(confirmText).toContain('Вы выбрали билеты');
    });

    test('Должно забронироваться VIP-место на 11:00', async () => {
        // Доступный сеанс на 11:00
        await page.waitForSelector('.movie-seances__time');
        await clickSeanceByTime(page, '11:00');
        await page.waitForSelector('.buying-scheme__wrapper');

        // Выбор одного VIP-места и подтверждение
        await page.click('.buying-scheme__row:nth-child(10) span:nth-child(6)');
        await page.click('.acceptin-button');

        // Подтверждение
        await page.waitForSelector('.ticket__check-title');
        const confirmText = await page.$eval('.ticket__check-title', el => el.textContent.trim());

        expect(confirmText).toContain('Вы выбрали билеты');
    });

    test('Не должно быть возможности забронировать занятое место', async () => {
        // Открыт сеанс с занятым местом
        await page.waitForSelector('.movie-seances__time');
        await page.evaluate(() => {
            const seance = [...document.querySelectorAll('.movie-seances__time')]
                .find(el => el.getAttribute('data-seance-id') === '199');
            if (seance) seance.click();
        });

        // Занятое место
        await page.waitForSelector('.buying-scheme__chair_disabled.buying-scheme__chair_taken');
        const takenSeat = await page.$('.buying-scheme__chair_disabled.buying-scheme__chair_taken');

        expect(takenSeat).not.toBeNull();

        await takenSeat.click();
        const isDisabled = await page.$eval('.acceptin-button', btn => btn.disabled);

        // Кнопка забронировать не должна быть активной
        expect(isDisabled).toBe(true);
        expect(page.url()).toContain('hall.php');
    });
});















/*
const puppeteer = require('puppeteer');

jest.setTimeout(30000); // Таймаут для всех тестов

describe('Booking Tickets Tests', () => {
    let browser;
    let page;
    const baseURL = 'http://qamid.tmweb.ru/client/index.php';

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 50,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        // Возвращение на главную страницу
        await page.goto(baseURL);
    });

    test('Happy Path 1 — успешное бронирование билетов', async () => {
        // Выбор вторника
        await page.click('nav a:nth-child(2)');

        // Появление сеансов
        await page.waitForSelector('.movie-seances__time-block a');

        // Выбор времени
        await page.click('.movie-seances__time-block a');

        // Появление схемы зала
        await page.waitForSelector('.buying-scheme__wrapper');

        // Выбор двух мест
        await page.click('.buying-scheme__row:nth-child(6) span:nth-child(3)');
        await page.click('.buying-scheme__row:nth-child(6) span:nth-child(4)');

        // "Забронировать"
        await page.click('.acceptin-button');

        // Проверка страницы с подтверждением
        await page.waitForSelector('.ticket__check-title');
        const confirmText = await page.$eval('.ticket__check-title', el => el.textContent);

        console.log('⚠️ Заголовок страницы:', confirmText);

        expect(confirmText).toContain('Вы выбрали билеты');
    });

    test('Happy Path 2 — бронирование VIP-места на 11:00', async () => {
        await page.waitForSelector('.movie');

        // Ссылка с текстом 11:00
        const timeLink = await page.$x("//a[contains(text(), '11:')]");
        if (timeLink.length > 0) {
            await timeLink[0].click();
        } else {
            throw new Error('⛔ Не удалось найти ссылку на сеанс 11:00');
        }

        // Схема зала
        await page.waitForSelector('.buying-scheme__wrapper');

        // VIP место
        await page.click('.buying-scheme__row:nth-child(10) span:nth-child(6)');

        // "Забронировать"
        await page.click('.acceptin-button');

        // Заголовок подтверждения
        await page.waitForSelector('h2.ticket__check-title');

        const confirmText = await page.$eval('h2.ticket__check-title', el => el.textContent);
        console.log('✅ Подтверждение:', confirmText);
        expect(confirmText).toContain('Вы выбрали билеты');
    });

    test('Sad Path — попытка забронировать занятое место', async () => {
        await page.waitForSelector('.movie-seances__time');

        // Сеанс
        await page.evaluate(() => {
            const seance = [...document.querySelectorAll('.movie-seances__time')]
                .find(el => el.getAttribute('data-seance-id') === '199');
            if (seance) seance.click();
        });

        await page.waitForSelector('.buying-scheme__chair_disabled.buying-scheme__chair_taken', { timeout: 5000 });

        const takenSeat = await page.$('.buying-scheme__chair_disabled.buying-scheme__chair_taken');
        expect(takenSeat).not.toBeNull();

        await takenSeat.click();

        const isDisabled = await page.$eval('.acceptin-button', btn => btn.disabled);
        expect(isDisabled).toBe(true);

        expect(page.url()).toContain('hall.php');
    });
});





















/*
const puppeteer = require('puppeteer');

describe('Booking Tickets - Happy Path 1', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: false }); // Поставь true потом
        page = await browser.newPage();
        await page.goto('http://qamid.tmweb.ru/client/index.php');
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Успешное бронирование билетов', async () => {
        // Выбор вторника (второй день в списке)
        await page.click('nav a:nth-child(2)');

        // Ждём появления сеансов
        await page.waitForSelector('.movie-seances__time-block a');

        // Выбор первого времени
        await page.click('.movie-seances__time-block a');

        // Ждём появления схемы зала
        await page.waitForSelector('.buying-scheme__wrapper');

        // Выбор двух мест в 6-м ряду
        await page.click('.buying-scheme__row:nth-child(6) span:nth-child(3)');
        await page.click('.buying-scheme__row:nth-child(6) span:nth-child(4)');

        // Нажатие кнопки "Забронировать"
        await page.click('.acceptin-button');

        // Проверка страницы с подтверждением
        await page.waitForSelector('.ticket__check-title');
        const confirmText = await page.$eval('.ticket__check-title', el => el.textContent);


        // Выведем в консоль, что реально там написано
        console.log('⚠️ Заголовок страницы:', confirmText);

        expect(confirmText).toContain('Вы выбрали билеты');
    }, 10000);
});


/*
const puppeteer = require('puppeteer');

jest.setTimeout(30000); // Увеличиваем глобальный таймаут для всех тестов

describe('Бронирование VIP-места - Микки-Маус', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();
        await page.goto('http://qamid.tmweb.ru/client/index.php');
    });

    afterAll(async () => {
        await browser.close();
    });

    test('Бронирование места на 11:00 (VIP)', async () => {
        // Переход на главную страницу
        await page.goto('http://qamid.tmweb.ru/client/index.php');

        // Ждём появления списка фильмов/сеансов
        await page.waitForSelector('.movie');

        // Используем XPath для поиска ссылки с текстом "11:"
        const timeLink = await page.$x("//a[contains(text(), '11:')]");
        if (timeLink.length > 0) {
            await timeLink[0].click();
        } else {
            throw new Error('⛔ Не удалось найти ссылку на сеанс 11:00');
        }

        // Ждём загрузки схемы зала
        await page.waitForSelector('.buying-scheme__wrapper');

        // Выбираем VIP место (например, 10-й ряд, 6-е место)
        await page.click('.buying-scheme__row:nth-child(10) span:nth-child(6)');

        // Нажимаем "Забронировать"
        await page.click('.acceptin-button');

        // Ждём появления заголовка подтверждения
        await page.waitForSelector('h2.ticket__check-title');

        // Проверяем текст заголовка
        const confirmText = await page.$eval('h2.ticket__check-title', el => el.textContent);
        console.log('✅ Подтверждение:', confirmText);
        expect(confirmText).toContain('Вы выбрали билеты');
    }, 30000);
});


/*
const puppeteer = require('puppeteer');

describe('Sad path — попытка забронировать занятое место', () => {
    let browser;
    let page;

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: true,      // можно false, чтобы видеть браузер при отладке
            slowMo: 50,          // замедление действий, удобно для отладки
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        page = await browser.newPage();
        // Устанавливаем таймаут на ожидание (по желанию)
        page.setDefaultTimeout(10000);
    });

    afterAll(async () => {
        await browser.close();
    });

    test('не должно быть возможности забронировать занятое место', async () => {
        await page.goto('http://qamid.tmweb.ru/client/index.php');
        await page.waitForSelector('.movie-seances__time');

        // Кликаем по сеансу с data-seance-id="199"
        await page.evaluate(() => {
            const seance = [...document.querySelectorAll('.movie-seances__time')]
                .find(el => el.getAttribute('data-seance-id') === '199');
            if (seance) seance.click();
        });

        // Ждём загрузки зала с занятыми местами
        await page.waitForSelector('.buying-scheme__chair_disabled.buying-scheme__chair_taken', { timeout: 5000 });

        const takenSeat = await page.$('.buying-scheme__chair_disabled.buying-scheme__chair_taken');
        expect(takenSeat).not.toBeNull();

        await takenSeat.click();

        const isDisabled = await page.$eval('.acceptin-button', btn => btn.disabled);
        expect(isDisabled).toBe(true);

        expect(page.url()).toContain('hall.php');
    });
});
*/
