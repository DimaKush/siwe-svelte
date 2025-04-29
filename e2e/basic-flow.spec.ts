import { test, expect } from '@playwright/test';

// Базовый URL для тестов
const baseURL = 'http://localhost:5173';

test('basic app flow', async ({ page }) => {
  // Открываем главную страницу
  await page.goto(baseURL);
  
  // Проверяем, что заголовок отображается
  await expect(page.locator('h1')).toContainText('SIWE Message Signer');
  
  // Проверяем, что компонент подключения кошелька есть на странице
  await expect(page.locator('.wallet-connector')).toBeVisible();
  
  // Проверяем, что форма для ввода сообщения отображается
  await expect(page.locator('.message-signer textarea')).toBeVisible();
});

// Для полных E2E тестов потребуется мок кошелька, так как браузер не имеет доступа к MetaMask
// Эта часть может быть реализована с использованием моков и кастомных хендлеров 