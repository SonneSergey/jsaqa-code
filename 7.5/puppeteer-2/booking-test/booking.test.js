const puppeteer = require("puppeteer");

jest.setTimeout(60000);

describe("Бронирование билетов", () => {
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
        await page.waitForSelector("nav", { timeout: 10000 });
    });

    afterEach(async () => {
        if (expect.getState().currentTestFailed) {
            await page.screenshot({ path: `screenshots/failed-${Date.now()}.png` });
        }
    });

    test("Должна успешно забронироваться пара мест во вторник", async () => {
        await page.click("nav a:nth-child(2)"); // Вторник
        await page.waitForSelector(".movie-seances__time", { visible: true });
        await page.click(".movie-seances__time");
        await page.waitForSelector(".buying-scheme__wrapper", { visible: true });

        expect(page.url()).toMatch(/hall\.php/);

        await page.click(".buying-scheme__row:nth-child(6) span:nth-child(3)");
        await page.click(".buying-scheme__row:nth-child(6) span:nth-child(4)");

        const isButtonActive = await page.$eval(
            ".acceptin-button",
            (btn) => !btn.disabled,
        );
        expect(isButtonActive).toBe(true);

        await page.click(".acceptin-button");

        await page.waitForSelector(".ticket__check-title", { visible: true });
        const confirmText = await page.$eval(".ticket__check-title", (el) =>
            el.textContent.trim(),
        );
        expect(confirmText).toContain("Вы выбрали билеты");
    });

    test("Должно забронироваться VIP-место в пятницу на 18:00", async () => {
        await page.click("nav a:nth-child(6)"); // Пятница
        await page.waitForSelector(".movie-seances__time", { visible: true });

        const seances = await page.$$(".movie-seances__time");
        for (const seance of seances) {
            const text = await seance.evaluate((el) => el.textContent.trim());
            if (text === "18:00") {
                await seance.click();
                break;
            }
        }

        await page.waitForSelector(".buying-scheme__wrapper", { visible: true });

        await page.click(".buying-scheme__row:nth-child(10) span:nth-child(6)");

        const isButtonActive = await page.$eval(
            ".acceptin-button",
            (btn) => !btn.disabled,
        );
        expect(isButtonActive).toBe(true);

        await page.click(".acceptin-button");

        await page.waitForSelector(".ticket__check-title", { visible: true });
        const confirmText = await page.$eval(".ticket__check-title", (el) =>
            el.textContent.trim(),
        );
        expect(confirmText).toContain("Вы выбрали билеты");
    });

    test('Кнопка "Забронировать" должна быть неактивна, если не выбрано ни одного места', async () => {
        await page.click("nav a:nth-child(7)"); // Воскресенье
        await page.waitForSelector(".movie-seances__time", { visible: true });
        await page.click(".movie-seances__time");
        await page.waitForSelector(".buying-scheme__wrapper", { visible: true });

        const isButtonActive = await page.$eval(
            ".acceptin-button",
            (btn) => !btn.disabled,
        );
        expect(isButtonActive).toBe(false);
    });
});