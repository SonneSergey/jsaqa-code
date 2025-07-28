const { setWorldConstructor } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');

class CustomWorld {
    async launchBrowser() {
        this.browser = await puppeteer.launch({ headless: true });
        this.page = await this.browser.newPage();
    }

    async closeBrowser() {
        if (this.browser) {
            await this.browser.close();
        }
    }
}

console.log('CustomWorld loaded');
setWorldConstructor(CustomWorld);
