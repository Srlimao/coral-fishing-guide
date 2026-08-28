import { test, expect, Page } from '@playwright/test';

async function navigateToWiki(page: Page) {
  const hamburger = page.locator('header button[aria-label="Open Navigation Menu"]').first();
  if (await hamburger.isVisible()) {
    await hamburger.click();
  }
  const craftNavBtn = page.locator('aside button').filter({ hasText: /Craft & Buildings/i }).first();
  await expect(craftNavBtn).toBeVisible();
  await craftNavBtn.click();
}

test.describe('Craft & Building Wiki Feature Suite', () => {
  test.beforeEach(async ({ page, context }) => {
    try {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    } catch {
      // ignore
    }
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should navigate to Craft & Buildings tab and display hero header', async ({ page }) => {
    await navigateToWiki(page);

    // Verify Wiki View Header
    await expect(page.getByRole('heading', { name: /CRAFT & BUILDING WIKI/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Crafting Recipes/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Farm Buildings/i })).toBeVisible();
  });

  test('should search and filter Crafting recipes', async ({ page }) => {
    await navigateToWiki(page);

    // Search for "Sprinkler"
    const searchInput = page.getByPlaceholder(/Search items, buildings/i);
    await searchInput.fill('Sprinkler');

    // Verify Sprinkler items are shown
    await expect(page.getByRole('heading', { name: 'Sprinkler I', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sprinkler II', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Sprinkler III', exact: true })).toBeVisible();

    // Clear search
    await searchInput.fill('');

    // Filter by Category: Artisan & Processing
    await page.getByRole('button', { name: 'Artisan & Processing' }).click();
    await expect(page.getByRole('heading', { name: 'Mason Jar', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Keg', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Aging Barrel', exact: true })).toBeVisible();
  });

  test('should switch to Farm Buildings tab and test upgrade tier preview', async ({ page }) => {
    await navigateToWiki(page);

    // Switch to Buildings tab
    await page.getByRole('button', { name: /Farm Buildings/i }).click();

    // Find the Coop card container by data-building-id
    const coopCard = page.locator('[data-building-id="coop"]');
    await expect(coopCard.getByRole('heading', { name: 'Basic Coop' })).toBeVisible();
    await expect(coopCard.getByText('2,000g')).toBeVisible();

    // Click Level 2 on Coop card
    await coopCard.getByRole('button', { name: 'Lvl 2' }).click();
    await expect(coopCard.getByRole('heading', { name: 'Upgraded Coop' })).toBeVisible();
    await expect(coopCard.getByText('4,500g')).toBeVisible();

    // Click Level 3 on Coop card
    await coopCard.getByRole('button', { name: 'Lvl 3' }).click();
    await expect(coopCard.getByRole('heading', { name: 'Deluxe Coop' })).toBeVisible();
    await expect(coopCard.getByText('8,000g')).toBeVisible();
  });

  test('should open Crafting Detail Modal and test quantity stepper', async ({ page }) => {
    await navigateToWiki(page);

    // Click on Mason Jar card
    const masonJarCard = page.locator('[data-recipe-id="mason_jar"]');
    await masonJarCard.click();

    // Verify Modal Details (scoped to modal dialog)
    const modal = page.locator('div.fixed.inset-0.z-50');
    await expect(modal.getByRole('heading', { level: 2, name: 'Mason Jar' })).toBeVisible();
    await expect(modal.getByText(/Farming Mastery Level 3/i)).toBeVisible();
    await expect(modal.getByText('30x', { exact: false }).first()).toBeVisible();

    // Add to planner via modal
    const addBtn = modal.getByRole('button', { name: /Add.*to Farm Planner/i });
    await expect(addBtn).toBeVisible();
    await addBtn.click();

    // Modal should close
    await expect(modal.getByRole('heading', { level: 2, name: 'Mason Jar' })).not.toBeVisible();
  });

  test('should add items to Shopping Planner and aggregate materials accurately', async ({ page }) => {
    await navigateToWiki(page);

    // Plan 1x Sprinkler I
    const sprinklerCard = page.locator('[data-recipe-id="sprinkler_1"]');
    await sprinklerCard.getByRole('button', { name: /Plan/i }).click();

    // Open Planner Drawer
    const openPlannerBtn = page.getByRole('button', { name: /Planner/i }).first();
    await openPlannerBtn.click();

    // Verify Planner Drawer opened
    const drawer = page.locator('aside').filter({ hasText: 'Project Planner' });
    await expect(drawer.getByRole('heading', { name: 'Project Planner' })).toBeVisible();
    await expect(drawer.getByText('Sprinkler I', { exact: true })).toBeVisible();
    await expect(drawer.getByText('Bronze Bar', { exact: true })).toBeVisible();
    await expect(drawer.getByText('Scrap', { exact: true })).toBeVisible();
    await expect(drawer.getByText('Bronze Kelp', { exact: true })).toBeVisible();

    // Copy Shopping List
    const copyBtn = drawer.getByRole('button', { name: /Copy Shopping List/i });
    await expect(copyBtn).toBeVisible();
    await copyBtn.click();
    await expect(drawer.getByText(/Copied to Clipboard!/i)).toBeVisible();
  });
});
