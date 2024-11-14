const { test, expect } = require('@playwright/test');

test('Поиск на странице Google', async ({ page }) => {
  // Переход на страницу гугла
  await page.goto('https://www.google.com');

  // Селектор поиска и ввод текста "Автотесты"
  const searchInput = page.locator('#APjFqb')
  await searchInput.fill('Автотесты');

  // Клик по кнопке "Поиск в Google"
  await Promise.all([
    page.waitForNavigation(),
    searchInput.press('Enter')
  ]);

  // Проверка перехода на страницу результатов
  const resultsSelector = '#search';
  await expect(page.locator(resultsSelector)).toBeVisible();

  // Дополнительно проверяем, что заголовок страницы содержит поисковый запрос
  await expect(page).toHaveTitle(/Автотесты/i);

  // Проверка наличия логотипа Google
  const logo = page.locator('#logo');
  await expect(logo).toBeVisible();

  // Проверка количества результатов поиска на первой странице
  const results = page.locator('.g'); // Класс для каждого результата на странице
  const resultCount = await results.count();
  expect(resultCount).toBeGreaterThan(0); // Проверка наличия результата
 
  // Проверка количества страниц
  const pagination = page.locator('#pnnext'); // Кнопка "Следующая страница"
  const pagesAvailable = await pagination.isVisible();
  expect(pagesAvailable).toBeTruthy(); // Проверим, что есть кнопка "Следующая страница"

  // Проверка количества страниц
  let pageCount = 1; // 1я страница
  const maxPages = 10; // Ограничение кол-ва до видимых 10
 
  while (await page.locator('#pnnext').isVisible() && pageCount < maxPages) {
    // Переход на следующую страницу
    await page.click('#pnnext');
    await page.waitForNavigation();
 
    pageCount++; // + к счётчику
   }
 
   // Нашли несколько страниц
   expect(pageCount).toBeGreaterThan(1);
 
   console.log(`Количество страниц: ${pageCount}`);
 

  // Проверка наличия кнопки "Очистить" и её видимости после ввода текста
  const clearButton = page.locator('//form[@role="search"]//div[@aria-label="Очистить"]');
  await expect(clearButton).toBeVisible();

  // Клик по кнопке "Очистить" и проверка очищения строки поиска
  await clearButton.click();
  const inputValue = await searchInput.inputValue();
  expect(inputValue).toBe(''); // Проверка строки поиска
});
  

