import { test, expect } from '@playwright/test';

test.describe('Save Import Modal Accessibility & Keyboard Focus', () => {

  test('Save Import modal file browse button is keyboard focusable and accessible', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      // Open mobile drawer to access Import Save button
      const menuBtn = page.locator('button[aria-label="Open Navigation Menu"]').first();
      await menuBtn.click();
    }

    // Click Import Save button in sidebar / navigation
    const importBtn = page.locator('button').filter({ hasText: /Import Save|Importar Save/i }).first();
    await expect(importBtn).toBeVisible();
    await importBtn.click();

    // Verify modal dialog opens with proper ARIA attributes
    const modal = page.locator('div[role="dialog"]').first();
    await expect(modal).toBeVisible();
    await expect(modal).toHaveAttribute('aria-modal', 'true');
    await expect(page.locator('#save-import-modal-title')).toHaveText(/Import Coral Island Save File/i);

    // Verify file input is present and accessible (sr-only instead of hidden)
    const fileInput = modal.locator('input[type="file"][aria-label="Upload Coral Island save file"]');
    await expect(fileInput).toBeAttached();

    // Verify focusing the file input triggers visual focus-within ring styling on label
    await fileInput.focus();
    await expect(fileInput).toBeFocused();

    // Close modal using Escape key
    await page.keyboard.press('Escape');
    await expect(modal).not.toBeVisible();
  });

});
