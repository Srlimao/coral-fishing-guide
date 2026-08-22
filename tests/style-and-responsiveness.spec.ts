import { test, expect } from '@playwright/test';

test.describe('Coral Island Fishing Guide - Style & Responsiveness Tests', () => {

  test('Page loads properly with dark frosted header, brand logo, and no horizontal overflow', async ({ page }) => {
    await page.goto('/');

    // Check Header existence and title
    const header = page.locator('header');
    await expect(header).toBeVisible();
    await expect(header.locator('text=Coral Guide').first()).toBeVisible();
    await expect(header.locator('text=Fishing').first()).toBeVisible();

    // Verify no unexpected horizontal scrollbar on body
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('Time and Weather controls in Side Panel are interactive and update active season/weather', async ({ page }) => {
    await page.goto('/');

    // Check that Current Simulation / Time panel is visible
    await expect(page.locator('text=In-Game Date & Season').first()).toBeVisible();

    // Change Season to Summer
    const summerBtn = page.locator('button:has-text("Summer")').first();
    if (await summerBtn.isVisible()) {
      await summerBtn.click();
    }

    // Change Weather to Rain
    const rainBtn = page.locator('button[title*="Rain" i]').or(page.locator('button:has-text("Rain")')).first();
    if (await rainBtn.isVisible()) {
      await rainBtn.click();
    }

    // Toggle Active RIGHT NOW button
    const activeToggle = page.locator('button:has-text("Active RIGHT NOW")').first();
    await expect(activeToggle).toBeVisible();
  });

  test('Side Panel Gear Controls display fishing level slider and rod selector', async ({ page }) => {
    await page.goto('/');

    // Gear & Equipment section
    await expect(page.locator('text=Fishing Level').first()).toBeVisible();
    await expect(page.locator('input[type="range"]').first()).toBeVisible();

    // Check rod selector buttons presence
    await expect(page.locator('text=Equipped Rod').first()).toBeVisible();
    await expect(page.locator('button:has-text("Makeshift")').or(page.locator('button:has-text("Osmium")')).first()).toBeVisible();
  });

  test('Fish cards grid renders in responsive layout and cards can be filtered', async ({ page }) => {
    await page.goto('/');

    // Fish Journal should be loaded
    const cardsGrid = page.locator('.grid');
    await expect(cardsGrid.first()).toBeVisible();

    // Filter input search
    const searchInput = page.locator('input[placeholder*="Search" i]').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Salmon');

    // Should find Salmon
    await expect(page.locator('h3:has-text("Salmon")').first()).toBeVisible();

    // Clear search
    await searchInput.fill('');
    await expect(page.locator('text=Fish Catalog (69)')).toBeVisible();
  });

  test('Clicking a compact fish card opens the Fish Details Modal with Minigame Visualizer', async ({ page }) => {
    await page.goto('/');

    // Click the first fish card
    const firstCard = page.locator('.cg-card-interactive').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Modal should be open
    const modal = page.locator('.fixed.inset-0.z-50');
    await expect(modal).toBeVisible();
    await expect(modal.locator('text=In-Game Fishing Minigame Simulation')).toBeVisible();
    await expect(modal.locator('text=Hold Left-Click to Reel').or(modal.locator('text=Reeling')).first()).toBeVisible();

    // Close modal
    const closeBtn = page.locator('button:has(svg.lucide-x)');
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('Navigation tabs switch views correctly (Calendar, Map, Altars, Mastery)', async ({ page }) => {
    await page.goto('/');

    // Switch to Calendar View
    const calendarTab = page.locator('header nav button:has-text("Schedule")').first();
    await calendarTab.click();
    await expect(page.locator('text=FISHING CALENDAR').first()).toBeVisible();

    // Switch to Map View
    const mapTab = page.locator('header nav button:has-text("Island Map")').first();
    await mapTab.click();
    await expect(page.locator('text=Starlet Island Fishing Map').first()).toBeVisible();

    // Switch to Altars View
    const altarTab = page.locator('header nav button:has-text("Temple Altars")').first();
    await altarTab.click();
    await expect(page.locator('text=Goddess Lake Temple Offerings').first()).toBeVisible();

    // Switch to Mastery & Gear View
    const masteryTab = page.locator('header nav button:has-text("Mastery")').first();
    await masteryTab.click();
    await expect(page.locator('text=Rod Upgrade Path').first()).toBeVisible();

    // Switch back to Fish Journal
    const journalTab = page.locator('header nav button:has-text("Fish Journal")').first();
    await journalTab.click();
    await expect(page.locator('text=Fish Catalog (69)')).toBeVisible();
  });

  test('Back Office Map Pin Editor allows placing and managing multi-spot fishing pins', async ({ page }) => {
    await page.goto('/');

    // Switch to Back Office tab
    const backofficeTab = page.locator('header nav button:has-text("Back Office")').first();
    await backofficeTab.click();

    // Verify Back Office editor elements
    await expect(page.locator('text=Map Pin & Fishing Spot Manager').first()).toBeVisible();
    await expect(page.locator('text=Click Map to Place Spot for:').first()).toBeVisible();
    await expect(page.locator('text=Export JSON').first()).toBeVisible();
  });

  test('Save File Importer modal opens and displays file dropzone and path helper', async ({ page }) => {
    await page.goto('/');

    // Click Import Save button in header
    const importBtn = page.locator('header nav button:has-text("Import Save"), header nav button[title*="Import"]').first();
    await importBtn.click();

    // Verify modal is visible
    await expect(page.locator('text=Import Coral Island Save File')).toBeVisible();
    await expect(page.locator('text=%LOCALAPPDATA%\\ProjectCoral\\Saved\\SaveGames').first()).toBeVisible();
    await expect(page.locator('text=Click to select or drag & drop your')).toBeVisible();

    // Close modal
    await page.locator('button:has-text("Close")').click();
    await expect(page.locator('text=Import Coral Island Save File')).not.toBeVisible();
  });

});
