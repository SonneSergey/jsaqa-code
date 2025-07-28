const { Before, After } = require('@cucumber/cucumber');

Before(async function () {
    await this.launchBrowser();
});

After(async function () {
    await this.closeBrowser();
});