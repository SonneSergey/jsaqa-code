import { test, expect } from "@playwright/test";
import { EMAIL, PASSWORD } from "./user.js";

test("Успешная авторизация", async ({ page }) => {
    await page.goto("https://netology.ru/");
    await page.getByRole("link", { name: "Войти" }).click();
    await page.getByRole("textbox", { name: "Email" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(EMAIL);
    await page.getByRole("textbox", { name: "Пароль" }).fill(PASSWORD);
    await page.getByRole("textbox", { name: "Пароль" }).fill(PASSWORD);
    await page.getByTestId("login-submit-btn").click();

    // 🔍 Добавим проверку: что авторизация успешна
    await expect(page).toHaveURL(/cabinet|profile|dashboard/); // уточни, что открывается после входа
});

test("Неуспешная авторизация с неверным паролем", async ({ page }) => {
    await page.goto("https://netology.ru/");
    await page.getByRole("link", { name: "Войти" }).click();
    await page.getByRole("textbox", { name: "Email" }).click();
    await page.getByRole("textbox", { name: "Email" }).fill(EMAIL);
    await page.getByRole("textbox", { name: "Пароль" }).click();
    await page.getByRole("textbox", { name: "Пароль" }).click({
        button: "right",
    });
    await page.getByRole("textbox", { name: "Пароль" }).fill("pseudopassword");
    await page.getByTestId("login-submit-btn").click();
});