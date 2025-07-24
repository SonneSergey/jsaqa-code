import { test, expect } from "@playwright/test";
import { EMAIL, PASSWORD } from "./user.js";


test("Успешная авторизация", async ({ page }) => {
  // 1. Страница авторизации
  await page.goto("https://netology.ru/?modal=sign_in", { timeout: 60000 });

  // 2. Форма
  await page.locator('input[name="email"][placeholder="Email"]').fill(EMAIL);
  await page.locator('input[name="password"]').fill(PASSWORD);

  // 3. Клик кнопки "Войти"
  await page.locator('button[type="submit"]:has-text("Войти")').click();

  // 4. Сообщение об успешном входе
  // await expect(page.locator('text=Привет, Сергей! Вы вошли в аккаунт')).toBeVisible({ timeout: 30000 });

  // 5. Проверка заголовка профиля
  await expect(page.locator('h2:has-text("Моё обучение")')).toBeVisible({ timeout: 15000 });

  // 6. Дополнительная проверка URL
  await expect(page).toHaveURL(/profile/);
});

test("Неуспешная авторизация", async ({ page }) => {
  // 1. Страница авторизации
  await page.goto("https://netology.ru/?modal=sign_in", { timeout: 60000 });

  // 2. Форма невалидными данными
  await page.locator('input[name="email"][placeholder="Email"]').fill("wrong@example.com");
  await page.locator('input[name="password"]').fill("wrongpassword");

  // 3. Клик кнопки "Войти"
  await page.locator('button[type="submit"]:has-text("Войти")').click();

  // 4. Проверка на появление ошибки)
  await expect(page.locator('[data-testid="login-error-hint"]')).toHaveText(
    "Вы ввели неправильно логин или пароль.",
    { timeout: 30000 }
  );

  await expect(page).not.toHaveURL(/profile/);
});