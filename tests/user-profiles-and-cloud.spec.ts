import { test, expect } from '@playwright/test';

test.describe('Coral Island Fishing Guide - User Profile & GCP Cloud Sync System', () => {

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/coral_fish_users**', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            count: 1,
            results: [{
              id: 'user_willow_mock',
              data: {
                id: 'user_willow_mock',
                name: 'Willow',
                avatar: 'fisherman',
                userProgress: { caught: { item_72001: true } },
                gameState: { season: 'spring', day: 5, fishingLevel: 2 }
              }
            }]
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });

    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('User profile selector is visible and opens User Profiles modal', async ({ page, isMobile }) => {
    if (isMobile) {
      const menuBtn = page.locator('button[aria-label="Open Navigation Menu"]').first();
      await menuBtn.click();
      const profileBtn = page.locator('aside button').filter({ hasText: /Main Farmer|Farmer/i }).first();
      await expect(profileBtn).toBeVisible();
      await profileBtn.click();
    } else {
      const profileSelector = page.locator('aside button').filter({ hasText: /Main Farmer|Farmer/i }).first();
      await expect(profileSelector).toBeVisible();
      await profileSelector.click();
    }

    const modal = page.locator('div[role="dialog"]').filter({ hasText: /User Profiles & Cloud Sync/i });
    await expect(modal).toBeVisible();
    await expect(modal.locator('text=Local Profiles on This Device')).toBeVisible();

    const closeBtn = modal.locator('button[aria-label="Close"]').first();
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('Can create a new profile with custom name and avatar', async ({ page, isMobile }) => {
    if (isMobile) {
      const menuBtn = page.locator('button[aria-label="Open Navigation Menu"]').first();
      await menuBtn.click();
      await page.locator('aside button').filter({ hasText: /Main Farmer|Farmer/i }).first().click();
    } else {
      await page.locator('aside button').filter({ hasText: /Main Farmer|Farmer/i }).first().click();
    }

    const modal = page.locator('div[role="dialog"]').filter({ hasText: /User Profiles & Cloud Sync/i });
    await expect(modal).toBeVisible();

    // Click "New Profile"
    await modal.locator('button:has-text("New Profile")').first().click();

    // Fill name
    const nameInput = modal.locator('input[placeholder*="Farmer Luna"]').first();
    await nameInput.fill('Speedrunner Will');

    // Click Save Profile
    await modal.locator('button:has-text("Save Profile")').first().click();

    // Verify feedback and profile card
    await expect(modal.locator('text=Profile "Speedrunner Will" created!')).toBeVisible();
    await expect(modal.locator('h4:has-text("Speedrunner Will")')).toBeVisible();
  });

  test('Switching profiles maintains independent progress per user', async ({ page, isMobile }) => {
    // 1. Mark the first fish as caught in default profile
    const firstCatchBtn = page.locator('button[aria-label*="as caught"]').first();
    await expect(firstCatchBtn).toBeVisible();
    await firstCatchBtn.click();

    // Verify caught count is 1/69 in the active visible sidebar/header
    if (isMobile) {
      await expect(page.locator('header').getByText('1/69').first()).toBeVisible();
    } else {
      await expect(page.locator('aside').getByText('1/69').first()).toBeVisible();
    }

    // 2. Open User Profile Modal and create second profile (without cloning)
    if (isMobile) {
      const menuBtn = page.locator('button[aria-label="Open Navigation Menu"]').first();
      await menuBtn.click();
      await page.locator('aside button').filter({ hasText: /Main Farmer|Farmer/i }).first().click();
    } else {
      await page.locator('aside button').filter({ hasText: /Main Farmer|Farmer/i }).first().click();
    }

    const modal = page.locator('div[role="dialog"]').filter({ hasText: /User Profiles & Cloud Sync/i });
    await expect(modal).toBeVisible();
    await modal.locator('button:has-text("New Profile")').first().click();
    await modal.locator('input[placeholder*="Farmer Luna"]').first().fill('Farmer Beta');
    await modal.locator('button:has-text("Save Profile")').first().click();

    // Close modal
    await modal.locator('button[aria-label="Close"]').first().click();

    // In Farmer Beta profile, caught count should be 0/69
    if (isMobile) {
      await expect(page.locator('header').getByText('0/69').first()).toBeVisible();
    } else {
      await expect(page.locator('aside').getByText('0/69').first()).toBeVisible();
    }

    // 3. Switch back to Main Farmer
    if (isMobile) {
      const menuBtn = page.locator('button[aria-label="Open Navigation Menu"]').first();
      await menuBtn.click();
      await page.locator('aside button').filter({ hasText: /Farmer Beta/i }).first().click();
    } else {
      await page.locator('aside button').filter({ hasText: /Farmer Beta/i }).first().click();
    }

    await expect(modal).toBeVisible();
    // Locate the Main Farmer card row and click Switch
    const mainFarmerCard = modal.locator('div.rounded-2xl').filter({ has: page.locator('h4:has-text("Main Farmer")') }).first();
    await expect(mainFarmerCard).toBeVisible();
    await mainFarmerCard.locator('button:has-text("Switch")').first().click();

    // Close modal
    await modal.locator('button[aria-label="Close"]').first().click();

    // In Main Farmer profile, caught count is still 1/69
    if (isMobile) {
      await expect(page.locator('header').getByText('1/69').first()).toBeVisible();
    } else {
      await expect(page.locator('aside').getByText('1/69').first()).toBeVisible();
    }
  });

  test('Cloud & Multiplayer tab displays backup status and multiplayer tools', async ({ page, isMobile }) => {
    if (isMobile) {
      const menuBtn = page.locator('button[aria-label="Open Navigation Menu"]').first();
      await menuBtn.click();
      await page.locator('aside button').filter({ hasText: /Main Farmer|Farmer/i }).first().click();
    } else {
      await page.locator('aside button').filter({ hasText: /Main Farmer|Farmer/i }).first().click();
    }

    const modal = page.locator('div[role="dialog"]').filter({ hasText: /Player Profiles & Cloud Sync|User Profiles/i });
    await expect(modal).toBeVisible();

    // Click Cloud & Multiplayer tab
    const cloudTab = modal.locator('button:has-text("Cloud & Multiplayer")').first();
    await cloudTab.click();

    // Verify Cloud Backup panel and Multiplayer Sharing
    await expect(modal.locator('text=Cloud Backup & Sync')).toBeVisible();
    await expect(modal.locator('text=Multiplayer Co-Op Sharing')).toBeVisible();
    await expect(modal.locator('button:has-text("Save to Cloud")').first()).toBeVisible();
  });

});
