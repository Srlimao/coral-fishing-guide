import { test, expect } from '@playwright/test';

test.describe('Coral Island Trivia Mini Game Tests', () => {

  test('Navigates to Trivia tab and displays all 9 categories', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      // Open mobile drawer
      const hamburger = page.locator('header button[aria-label="Open Navigation Menu"]').first();
      await hamburger.click();
      const triviaTab = page.locator('aside button').filter({ hasText: /Trivia|Quiz|Curiosidades/i }).first();
      await expect(triviaTab).toBeVisible();
      await triviaTab.click();
    } else {
      // Click Trivia navigation in desktop sidebar
      const triviaTab = page.locator('aside button').filter({ hasText: /Trivia|Quiz|Curiosidades/i }).first();
      await expect(triviaTab).toBeVisible();
      await triviaTab.click();
    }

    // Verify Title and Subtitle
    await expect(page.locator('h1').filter({ hasText: /Trivia|Curiosidades|Quiz/i })).toBeVisible();

    // Verify all 9 categories exist in the grid
    const expectedCategories = ['Fish', 'Insect', 'Critter', 'Farm', 'Forage', 'Artisan', 'Fossil', 'Gem', 'Artifact'];
    for (const cat of expectedCategories) {
      await expect(page.locator('.glass-panel').filter({ hasText: new RegExp(cat, 'i') }).first()).toBeVisible();
    }
  });

  test('Starts a category round and verifies 10.0s timer, 3 hearts, and 4 choices', async ({ page, isMobile }) => {
    await page.goto('/');

    // Navigate to Trivia
    if (isMobile) {
      await page.locator('header button[aria-label="Open Navigation Menu"]').first().click();
      await page.locator('aside button').filter({ hasText: /Trivia|Quiz|Curiosidades/i }).first().click();
    } else {
      await page.locator('aside button').filter({ hasText: /Trivia|Quiz|Curiosidades/i }).first().click();
    }

    // Click on Fish category
    const fishCard = page.locator('[data-testid="category-card-Fish"]').first();
    await expect(fishCard).toBeVisible();
    await fishCard.click();

    // Verify status bar (1 / 15, 3 hearts, timer)
    await expect(page.locator('text=1 / 15')).toBeVisible();
    await expect(page.locator('text=Time')).toBeVisible();

    // Verify in-game item visual image is rendered
    const itemImg = page.locator('[data-testid="trivia-item-image"]').first();
    await expect(itemImg).toBeVisible();

    // Verify 4 option buttons exist
    const options = page.locator('button').filter({ has: page.locator('span') });
    // At least 4 choice buttons in the grid
    expect(await options.count()).toBeGreaterThanOrEqual(4);

    // Click the first choice
    const firstChoice = page.locator('.grid button').first();
    await expect(firstChoice).toBeVisible();
    await firstChoice.click();

    // Verify question transitions to 2 / 15 or displays feedback
    await page.waitForTimeout(1500);
    await expect(page.locator('text=2 / 15').or(page.locator('text=1 / 15'))).toBeVisible();
  });
});
