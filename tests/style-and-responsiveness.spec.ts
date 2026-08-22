import { test, expect } from '@playwright/test';

test.describe('Coral Island Fishing Guide - Responsiveness & Style Testing', () => {

  test('Page loads properly with dark frosted header, brand logo, and no horizontal overflow', async ({ page }) => {
    await page.goto('/');

    // Check Header existence and title
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header.locator('text=Coral Guide').first()).toBeVisible();
    await expect(header.locator('text=Fishing').first()).toBeVisible();

    // Verify no unexpected horizontal scrollbar on viewport
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('Responsive Mobile Sidebar collapses by default on phone screen and expands on toggle', async ({ page, isMobile }) => {
    await page.goto('/');

    const mobileToggle = page.locator('button:has-text("Filters & Simulation")');

    if (isMobile) {
      // On mobile screens, toggle button must be visible and collapsed by default
      await expect(mobileToggle).toBeVisible();

      // Click to expand
      await mobileToggle.click();
      await expect(page.locator('text=Fishing Level').first()).toBeVisible();

      // Click to collapse
      await mobileToggle.click();
      await expect(page.locator('text=Fishing Level')).not.toBeVisible();
    } else {
      // On desktop, the sidebar is visible directly
      await expect(page.locator('text=Fishing Level').first()).toBeVisible();
    }
  });

  test('Search input filters fish cards accurately without layout shifts', async ({ page }) => {
    await page.goto('/');

    // Filter input search
    const searchInput = page.locator('input[placeholder*="Search" i], input[placeholder*="Pesquisar" i]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Salmon');

    // Should find Salmon
    await expect(page.locator('h3:has-text("Salmon"), h3:has-text("Salmão")').first()).toBeVisible();

    // Clear search
    await searchInput.fill('');
    await expect(page.locator('.cg-card-interactive').first()).toBeVisible();
  });

  test('Clicking a fish card opens the Details Modal with clean responsive layout', async ({ page }) => {
    await page.goto('/');

    // Click the first fish card
    const firstCard = page.locator('.cg-card-interactive').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Modal should be open
    const modal = page.locator('.fixed.inset-0.z-50');
    await expect(modal).toBeVisible();
    await expect(modal.locator('text=In-Game Fishing Minigame Simulation')).toBeVisible();

    // Close modal
    const closeBtn = page.locator('button[aria-label*="Close" i]').first();
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('Navigation tabs switch smoothly across views (Journal, Calendar, Map, Altars, Mastery)', async ({ page }) => {
    await page.goto('/');

    // Switch to Calendar View
    const calendarTab = page.locator('header nav button').filter({ hasText: /Schedule|Calendário/i }).first();
    await calendarTab.click();
    await expect(page.locator('text=CALENDAR').or(page.locator('text=CALENDÁRIO')).first()).toBeVisible();

    // Switch to Map View
    const mapTab = page.locator('header nav button').filter({ hasText: /Island Map|Mapa da Ilha/i }).first();
    await mapTab.click();
    await expect(page.locator('text=Starlet Island Fishing Map').first()).toBeVisible();

    // Switch to Altars View
    const altarTab = page.locator('header nav button').filter({ hasText: /Temple Altars|Altares/i }).first();
    await altarTab.click();
    await expect(page.locator('text=Catching Altar').or(page.locator('text=Altar de Captura')).first()).toBeVisible();

    // Switch to Mastery & Gear View
    const masteryTab = page.locator('header nav button').filter({ hasText: /Mastery|Maestria/i }).first();
    await masteryTab.click();
    await expect(page.locator('text=Rod Upgrade Path').first()).toBeVisible();

    // Switch back to Fish Journal
    const journalTab = page.locator('header nav button').filter({ hasText: /Fish Journal|Diário/i }).first();
    await journalTab.click();
    await expect(page.locator('.cg-card-interactive').first()).toBeVisible();
  });

  test('Language selector dropdown switches languages dynamically', async ({ page }) => {
    await page.goto('/');

    // Open language dropdown
    const langBtn = page.locator('header button').filter({ hasText: /EN|PT|ES|DE|FR|ZH|JA|ID/i }).first();
    await expect(langBtn).toBeVisible();
    await langBtn.click();

    // Select Portuguese
    const ptBtn = page.locator('button:has-text("Português")').first();
    if (await ptBtn.isVisible()) {
      await ptBtn.click();
      // Should now show Portuguese tab name
      await expect(page.locator('text=Diário de Pesca').first()).toBeVisible();
    }
  });

});
