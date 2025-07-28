const { Given, When, Then, After } = require("@cucumber/cucumber");
const { expect } = require("chai");

// Начало, переход на главную
Given("I am on the homepage", async function () {
    await this.launchBrowser();
    await this.page.goto("http://qamid.tmweb.ru/client/index.php");
});

// Переход на вкладку "вторник"
When("I select the Tuesday tab", async function () {
    await this.page.click("nav a:nth-child(2)");
});

// Выбор сеанса
When("I choose a session", async function () {
    await this.page.waitForSelector(".movie-seances__time");
    await this.page.click(".movie-seances__time");
});

// Выбор двух мест
When("I select two seats", async function () {
    await this.page.waitForSelector(".buying-scheme__wrapper");
    await this.page.click(".buying-scheme__row:nth-child(6) span:nth-child(3)");
    await this.page.click(".buying-scheme__row:nth-child(6) span:nth-child(4)");
});

// Выбор одного места
When("I select one seat", async function () {
    await this.page.waitForSelector(".buying-scheme__wrapper");
    await this.page.click(".buying-scheme__row:nth-child(5) span:nth-child(2)");
});

// Клик по кнопке "Забронировать"
When("I click the {string} button", async function (buttonText) {
    await this.page.waitForSelector(".acceptin-button");
    const btnText = await this.page.$eval(".acceptin-button", (el) =>
        el.textContent.trim(),
    );
    if (btnText !== buttonText) {
        throw new Error(
            `Expected button text "${buttonText}", but got "${btnText}"`,
        );
    }
    await this.page.click(".acceptin-button");
});

// Подтверждения
Then(
    "I should see a confirmation with text {string}",
    async function (expectedText) {
        await this.page.waitForSelector(".ticket__check-title");
        const confirmText = await this.page.$eval(".ticket__check-title", (el) =>
            el.textContent.trim(),
        );
        expect(confirmText).to.include(expectedText);
    },
);

// Выбор сеанса с занятым местом
When("I choose a session with a taken seat", async function () {
    await this.page.waitForSelector(".movie-seances__time");

    await this.page.evaluate(() => {
        const seance = [...document.querySelectorAll(".movie-seances__time")].find(
            (el) => el.getAttribute("data-seance-id") === "199",
        );
        if (seance) seance.click();
    });

    await this.page.waitForSelector(
        ".buying-scheme__chair_disabled.buying-scheme__chair_taken",
    );
});

// Занятое место
When("I try to click a taken seat", async function () {
    const seat = await this.page.$(
        ".buying-scheme__chair_disabled.buying-scheme__chair_taken",
    );
    this.takenSeat = seat;
    expect(seat).to.not.be.null;
    await seat.click();
});

// Кнопка "Забронировать" отключена
Then("the {string} button should be disabled", async function (buttonText) {
    await this.page.waitForSelector(".acceptin-button");
    const btnText = await this.page.$eval(".acceptin-button", (el) =>
        el.textContent.trim(),
    );
    if (btnText !== buttonText) {
        throw new Error(
            `Expected button text "${buttonText}", but got "${btnText}"`,
        );
    }
    const isDisabled = await this.page.$eval(
        ".acceptin-button",
        (el) => el.disabled,
    );
    expect(isDisabled).to.be.true;
});

// Закрытие браузера после сценария
After(async function () {
    await this.closeBrowser();
});