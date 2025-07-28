async function clickSeanceByTime(page, timeText) {
    const timeLink = await page.$x(`//a[contains(@class, "movie-seances__time") and contains(text(), "${timeText}")]`);
    if (timeLink.length > 0) {
        await timeLink[0].click();
    } else {
        throw new Error(`Сеанс с временем "${timeText}" не найден`);
    }
}

module.exports = { clickSeanceByTime };