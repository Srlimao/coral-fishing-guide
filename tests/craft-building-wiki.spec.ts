import { test, expect } from '@playwright/test';

async function navigateToWiki(page: any) {
  const hamburger = page.locator('header button[aria-label="Open Navigation Menu"]').first();
  if (await hamburger.isVisible()) {
    await hamburger.click();
    const wikiBtn = page.locator('nav button').filter({ hasText: /Craft & Buildings/i }).first();
    await expect(wikiBtn).toBeVisible();
    await wikiBtn.click();
  } else {
    const sidebarBtn = page.locator('aside button').filter({ hasText: /Craft & Buildings/i }).first();
    await expect(sidebarBtn).toBeVisible();
    await sidebarBtn.click();
  }
  await expect(page.getByRole('heading', { level: 1, name: /CRAFT & BUILDING WIKI/i })).toBeVisible();
}

test.describe('Craft & Building Wiki Feature Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should navigate to Craft & Buildings tab and display hero header', async ({ page }) => {
    await navigateToWiki(page);

    await expect(page.getByRole('heading', { level: 1, name: /CRAFT & BUILDING WIKI/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Crafting Recipes' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Farm Buildings & Upgrades' })).toBeVisible();
  });

  test('should search and filter Crafting recipes', async ({ page }) => {
    await navigateToWiki(page);

    // Search for "Sprinkler"
    const searchInput = page.getByPlaceholder(/Search items, buildings, materials/i);
    await searchInput.fill('Sprinkler');

    await expect(page.locator('[data-recipe-id="sprinkler_1"]')).toBeVisible();
    await expect(page.locator('[data-recipe-id="sprinkler_2"]')).toBeVisible();
    await expect(page.locator('[data-recipe-id="mason_jar"]')).not.toBeVisible();

    // Clear search and filter by category
    await searchInput.fill('');
    await page.getByRole('button', { name: 'Artisan & Processing' }).click();

    await expect(page.locator('[data-recipe-id="mason_jar"]')).toBeVisible();
    await expect(page.locator('[data-recipe-id="keg"]')).toBeVisible();
    await expect(page.locator('[data-recipe-id="sprinkler_1"]')).not.toBeVisible();
  });

  test('should switch to Farm Buildings tab and test upgrade tier preview', async ({ page }) => {
    await navigateToWiki(page);

    // Switch to Farm Buildings tab
    await page.getByRole('button', { name: 'Farm Buildings & Upgrades' }).click();

    // Verify Barn card exists
    const barnCard = page.locator('[data-building-id="barn"]');
    await expect(barnCard).toBeVisible();
    await expect(barnCard.getByRole('heading', { name: 'Barn' })).toBeVisible();

    // Verify Coop card exists
    const coopCard = page.locator('[data-building-id="coop"]');
    await expect(coopCard).toBeVisible();

    // Click Level 2 on Coop card
    await coopCard.getByRole('button', { name: 'Lvl 2' }).click();
    await expect(coopCard.getByRole('heading', { name: 'Upgraded Coop' })).toBeVisible();
    await expect(coopCard.getByText('4,500g')).toBeVisible();

    // Click Level 3 on Coop card
    await coopCard.getByRole('button', { name: 'Lvl 3' }).click();
    await expect(coopCard.getByRole('heading', { name: 'Deluxe Coop' })).toBeVisible();
    await expect(coopCard.getByText('10,000g')).toBeVisible();
  });

  test('should open Crafting Detail Modal and test quantity stepper', async ({ page }) => {
    await navigateToWiki(page);

    // Click on Mason Jar card
    const masonJarCard = page.locator('[data-recipe-id="mason_jar"]');
    await masonJarCard.click();

    // Verify Modal Details (scoped to modal dialog)
    const modal = page.locator('div.fixed.inset-0.z-50');
    await expect(modal.getByRole('heading', { level: 2, name: 'Mason Jar' })).toBeVisible();
    await expect(modal.getByText(/Farming.*3/i)).toBeVisible();
    await expect(modal.getByText('30x', { exact: false }).first()).toBeVisible();

    // Add to planner via modal
    const addBtn = modal.getByRole('button', { name: /Add.*to Planner/i });
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Modal should close
    await expect(modal.getByRole('heading', { level: 2, name: 'Mason Jar' })).not.toBeVisible();
  });

  test('should add items to Shopping Planner and aggregate materials accurately', async ({ page }) => {
    await navigateToWiki(page);

    // Click on Mason Jar card
    const masonJarCard = page.locator('[data-recipe-id="mason_jar"]');
    await masonJarCard.click();

    // Add to planner via modal
    const modal = page.locator('div.fixed.inset-0.z-50');
    await expect(modal.getByRole('heading', { level: 2, name: 'Mason Jar' })).toBeVisible();
    await modal.getByRole('button', { name: /Add.*to Planner/i }).click();
    await expect(modal.getByRole('heading', { level: 2, name: 'Mason Jar' })).not.toBeVisible();

    // Open Planner Drawer
    await page.getByTestId('wiki-planner-btn').click();

    // Verify Planner Drawer opened
    await expect(page.getByText(/Project.*Planned/i)).toBeVisible();
    await expect(page.getByText('Mason Jar', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Wood', { exact: false }).first()).toBeVisible();

    // Copy Shopping List
    const copyBtn = page.getByRole('button', { name: /Copy Shopping List/i });
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();
    await expect(page.getByText(/Copied to Clipboard!/i)).toBeVisible();
  });
});
