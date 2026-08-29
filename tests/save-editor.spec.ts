import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function navigateToSaveEditor(page: any) {
  const hamburger = page.locator('header button[aria-label="Open Navigation Menu"]').first();
  if (await hamburger.isVisible()) {
    await hamburger.click();
    const saveEditorBtn = page.locator('nav button').filter({ hasText: /Save Editor|Editor de Save/i }).first();
    await expect(saveEditorBtn).toBeVisible();
    await saveEditorBtn.click();
  } else {
    const sidebarBtn = page.locator('aside button').filter({ hasText: /Save Editor|Editor de Save/i }).first();
    await expect(sidebarBtn).toBeVisible();
    await sidebarBtn.click();
  }
}

test.describe('Coral Island Save Editor Workbench Feature Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('should navigate to Save Editor and display dropzone when no file loaded', async ({ page }) => {
    await navigateToSaveEditor(page);

    await expect(page.getByRole('heading', { name: /Coral Island Save Editor Workbench/i })).toBeVisible();
    await expect(page.getByText(/Select or Drop Your Save File/i)).toBeVisible();
    await expect(page.getByText(/%LOCALAPPDATA%\\ProjectCoral\\Saved\\SaveGames/i)).toBeVisible();
  });

  test('should upload save file, render tri-pane workbench, and edit player stats', async ({ page }) => {
    await navigateToSaveEditor(page);

    const savePath = path.join(process.env.LOCALAPPDATA || '', 'ProjectCoral', 'Saved', 'SaveGames', 'World_5', 'EndOfDayAutoSave.sav');
    if (!fs.existsSync(savePath)) {
      test.skip();
      return;
    }

    // Upload save file via file input
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(savePath);

    // Verify Workbench renders
    await expect(page.getByText(/Player Profile, Economy & Mastery/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /Backpack & Spawner/i })).toBeVisible();

    // Edit money
    const moneyInput = page.locator('input[type="number"]').first();
    await moneyInput.fill('9999999');

    // Click Max All Skills button
    const maxSkillsBtn = page.getByRole('button', { name: /Max All Skills/i });
    await maxSkillsBtn.click();

    // Verify Save Export Bar shows staged changes
    await expect(page.getByText(/property modification.*staged/i)).toBeVisible();
  });

  test('should switch to Backpack & Spawner, open Item Spawner, and spawn Osmium item', async ({ page }) => {
    await navigateToSaveEditor(page);

    const savePath = path.join(process.env.LOCALAPPDATA || '', 'ProjectCoral', 'Saved', 'SaveGames', 'World_5', 'EndOfDayAutoSave.sav');
    if (!fs.existsSync(savePath)) {
      test.skip();
      return;
    }

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(savePath);

    // Switch to Backpack tab
    await page.getByRole('button', { name: /Backpack & Spawner/i }).click();
    await expect(page.getByText(/Backpack Inventory & Item Spawner/i)).toBeVisible();

    // Click on Slot #1 to open Item Spawner
    await page.locator('[data-slot-index="0"]').click();

    // Item Spawner Modal should be open
    await expect(page.locator('#item-spawner-title')).toBeVisible();

    // Search for "Sword"
    const searchInput = page.getByPlaceholder(/Search items by name, ID/i);
    await searchInput.fill('Sword');

    // Pick first search result
    const firstResult = page.locator('div[role="dialog"] [data-item-id]').first();
    await firstResult.click();

    // Select Osmium quality
    const osmiumBtn = page.locator('div[role="dialog"]').getByRole('button', { name: /Osmium/i });
    await osmiumBtn.click();

    // Click Spawn Item
    await page.getByRole('button', { name: /Spawn Item/i }).click();

    // Verify modal closes and item is displayed in slot
    await expect(page.locator('#item-spawner-title')).not.toBeVisible();
    await expect(page.locator('[data-slot-index="0"]').getByText(/Osmium/i)).toBeVisible();
  });

  test('should open Save Diff Inspector, review staged changes, and trigger export', async ({ page }) => {
    await navigateToSaveEditor(page);

    const savePath = path.join(process.env.LOCALAPPDATA || '', 'ProjectCoral', 'Saved', 'SaveGames', 'World_5', 'EndOfDayAutoSave.sav');
    if (!fs.existsSync(savePath)) {
      test.skip();
      return;
    }

    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles(savePath);

    // Make an edit (click +1,000,000)
    await page.getByRole('button', { name: /\+1,000,000/i }).click();

    // Click Review Diffs
    await page.getByRole('button', { name: /Review Diffs/i }).click();

    // Modal opens
    await expect(page.getByRole('heading', { name: /Pre-Export Save Diff Inspector/i })).toBeVisible();
    await expect(page.getByText(/Wallet Money/i)).toBeVisible();

    // Close diff modal
    await page.getByRole('button', { name: /Back to Editor/i }).click();
    await expect(page.getByRole('heading', { name: /Pre-Export Save Diff Inspector/i })).not.toBeVisible();
  });
});
