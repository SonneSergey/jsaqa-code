const puppeteer = require("puppeteer");
const { clickSeanceByTime } = require("./helpers");

jest.setTimeout(30000);

describe("Booking Tickets — happy & sad paths", () => {
    let browser;
    let page;
    const baseURL = "http://qamid.tmweb.ru/client/index.php";

    beforeAll(async () => {
        browser = await puppeteer.launch({
            headless: false,
            slowMo: 50,
            args: ["--no-sandbox", "--disable-setuid-sandbox"],
        });
        page = await browser.newPage();
    });

    afterAll(async () => {
        await browser.close();
    });

    beforeEach(async () => {
        await page.goto(baseURL);
    });

    test("Должна успешно забронироваться пара мест во вторник", async () => {
        // Выбор вторника
        await page.click("nav a:nth-child(2)");
        await page.waitForSelector(".movie-seances__time");

        // Переход на первый доступный сеанс
        await page.click(".movie-seances__time");
        await page.waitForSelector(".buying-scheme__wrapper");

        // Выбор двух мест и бронирование
        await page.click(".buying-scheme__row:nth-child(6) span:nth-child(3)");
        await page.click(".buying-scheme__row:nth-child(6) span:nth-child(4)");
        await page.click(".acceptin-button");

        await page.waitForSelector(".ticket__check-title");
        const confirmText = await page.$eval(".ticket__check-title", (el) =>
            el.textContent.trim(),
        );

        expect(confirmText).toContain("Вы выбрали билеты");
    });

    test("Должно забронироваться VIP-место на 11:00", async () => {
        // Доступный сеанс на 11:00
        await page.waitForSelector(".movie-seances__time");
        await clickSeanceByTime(page, "11:00");
        await page.waitForSelector(".buying-scheme__wrapper");

        // Выбор одного VIP-места и подтверждение
        await page.click(".buying-scheme__row:nth-child(10) span:nth-child(6)");
        await page.click(".acceptin-button");

        // Подтверждение
        await page.waitForSelector(".ticket__check-title");
        const confirmText = await page.$eval(".ticket__check-title", (el) =>
            el.textContent.trim(),
        );

        expect(confirmText).toContain("Вы выбрали билеты");
    });

    test("Не должно быть возможности забронировать занятое место", async () => {
        // Открыт сеанс с занятым местом
        await page.waitForSelector(".movie-seances__time");
        await page.evaluate(() => {
            const seance = [
                ...document.querySelectorAll(".movie-seances__time"),
            ].find((el) => el.getAttribute("data-seance-id") === "199");
            if (seance) seance.click();
        });

        // Занятое место
        await page.waitForSelector(
            ".buying-scheme__chair_disabled.buying-scheme__chair_taken",
        );
        const takenSeat = await page.$(
            ".buying-scheme__chair_disabled.buying-scheme__chair_taken",
        );

        expect(takenSeat).not.toBeNull();

        await takenSeat.click();
        const isDisabled = await page.$eval(
            ".acceptin-button",
            (btn) => btn.disabled,
        );

        // Кнопка забронировать не должна быть активной
        expect(isDisabled).toBe(true);
        expect(page.url()).toContain("hall.php");
    });
});