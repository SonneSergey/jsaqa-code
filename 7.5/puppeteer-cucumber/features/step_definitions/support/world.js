const { setWorldConstructor } = require("@cucumber/cucumber");
const puppeteer = require("puppeteer");

class CustomWorld {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async launchBrowser() {
        this.browser = await puppeteer.launch({ headless: "new" });
        this.page = await this.browser.newPage();
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
        }
    }
}

setWorldConstructor(CustomWorld);