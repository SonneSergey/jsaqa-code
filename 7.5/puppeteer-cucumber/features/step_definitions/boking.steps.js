const { Given, When, Then, After } = require("@cucumber/cucumber");
const { expect } = require("chai");

Given("I open the booking website", async function () {
    await this.launchBrowser();
    await this.page.goto("http://qamid.tmweb.ru/client/index.php");
});

When("I select Tuesday", async function () {
    const days = await this.page.$$(".page-nav__day");
    for (const day of days) {
        const dayText = await day.$eval(".page-nav__day-week", (el) =>
            el.textContent.trim(),
        );
        if (dayText === "Вт") {
            await day.click();
            break;
        }
    }
});

When("I select Sunday", async function () {
    const days = await this.page.$$(".page-nav__day");
    for (const day of days) {
        const dayText = await day.$eval(".page-nav__day-week", (el) =>
            el.textContent.trim(),
        );
        if (dayText === "Вс") {
            await day.click();
            break;
        }
    }
});

When("I choose the first available session", async function () {
    const sessions = await this.page.$$(".movie-seances__time");
    if (sessions.length === 0) {
        throw new Error("Нет доступных сессий для выбора");
    }
    await sessions[0].click();
});

When("I select two free seats", { timeout: 20000 }, async function () {
    await this.page.waitForSelector(".buying-scheme__row", { timeout: 10000 });

    // Поиск свободных мест
    const freeSeats = await this.page.$$(
        ".buying-scheme__chair.buying-scheme__chair_standart:not(.buying-scheme__chair_taken)",
    );

    console.log(`Нашлось свободных мест: ${freeSeats.length}`);

    if (freeSeats.length < 2) {
        throw new Error("Недостаточно свободных мест для выбора");
    }

    await freeSeats[0].click();
    await freeSeats[1].click();
});

When("I click the {string} button", async function (btnText) {
    await this.page.waitForSelector(".acceptin-button", { timeout: 5000 });

    const button = await this.page.$(".acceptin-button");
    if (!button) {
        throw new Error('Кнопка с селектором ".acceptin-button" не найдена');
    }

    // Активность кнопки
    const isDisabled = await this.page.evaluate((btn) => {
        return btn.hasAttribute("disabled") || btn.classList.contains("disabled");
    }, button);

    if (isDisabled) {
        throw new Error('Кнопка "Забронировать" неактивна');
    }

    await button.click();
});

Then("I should see the booking confirmation", async function () {
    await this.page.waitForSelector(".ticket__check-title", { timeout: 5000 });

    const text = await this.page.$eval(".ticket__check-title", (el) =>
        el.textContent.trim(),
    );
    console.log("Booking confirmation text:", text);

    expect(text).to.include("Вы выбрали билеты:");
});

Then("the {string} button should be inactive", async function (btnText) {
    await this.page.waitForSelector(".acceptin-button", { timeout: 5000 });

    const button = await this.page.$(".acceptin-button");
    if (!button) {
        throw new Error('Кнопка с селектором ".acceptin-button" не найдена');
    }

    const isDisabled = await this.page.evaluate((btn) => {
        return btn.hasAttribute("disabled") || btn.classList.contains("disabled");
    }, button);

    expect(isDisabled).to.be.true;
});

After(async function () {
    await this.closeBrowser();
});