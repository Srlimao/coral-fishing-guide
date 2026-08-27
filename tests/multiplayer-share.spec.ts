import { test, expect } from '@playwright/test';

const openProfileModal = async (page: any, isMobile: boolean) => {
  if (isMobile) {
    const profileBtn = page.locator('button[aria-label="Open Profile Manager"]').first();
    await expect(profileBtn).toBeVisible();
    await profileBtn.click();
  } else {
    const profileSelector = page.locator('aside button').filter({ hasText: /Main Farmer|Farmer/i }).first();
    await expect(profileSelector).toBeVisible();
    await profileSelector.click();
  }
};

test.describe('Coral Island Fishing Guide - Multiplayer Progression Sharing & UI', () => {

  test.beforeEach(async ({ page }) => {
    await page.route('**/api/coral_fish_users**', async route => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ count: 1, results: [] })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ success: true })
        });
      }
    });
  });

  test('User Profiles modal omits technical Server Config and shows Cloud & Multiplayer', async ({ page, isMobile }) => {
    await page.goto('/');
    await openProfileModal(page, isMobile);

    const modal = page.locator('div[role="dialog"]').filter({ has: page.locator('#user-profile-modal-title') });
    await expect(modal).toBeVisible();

    // Verify Profiles tab and Cloud & Multiplayer tab exist
    await expect(modal.locator('button:has-text("Profiles")')).toBeVisible();
    await expect(modal.locator('button:has-text("Cloud & Multiplayer")')).toBeVisible();

    // Verify technical "Server Config" tab is NOT present in the user UI
    await expect(modal.locator('button:has-text("Server Config")')).not.toBeVisible();
  });

  test('Multiplayer Co-Op Share modal generates copyable link and Base64 code', async ({ page, isMobile }) => {
    await page.goto('/');
    await openProfileModal(page, isMobile);

    const modal = page.locator('div[role="dialog"]').filter({ has: page.locator('#user-profile-modal-title') });
    await expect(modal).toBeVisible();

    // Switch to Cloud & Multiplayer tab
    await modal.locator('button:has-text("Cloud & Multiplayer")').click();

    // Click "Share" button
    const shareBtn = modal.locator('button').filter({ hasText: /^Share$/i }).first();
    await expect(shareBtn).toBeVisible();
    await shareBtn.click();

    // Multiplayer Share Modal should open
    const shareModal = page.locator('#multiplayer-share-title');
    await expect(shareModal).toBeVisible();

    // Verify share action buttons
    await expect(page.locator('button:has-text("Copy 1-Click Share Link")')).toBeVisible();
    await expect(page.locator('button:has-text("Copy Base64 Progression Code")')).toBeVisible();
  });

  test('Multiplayer Import tab validates and previews incoming host progress', async ({ page, isMobile }) => {
    await page.goto('/');
    await openProfileModal(page, isMobile);

    const modal = page.locator('div[role="dialog"]').filter({ has: page.locator('#user-profile-modal-title') });
    await modal.locator('button:has-text("Cloud & Multiplayer")').click();

    // Click "Import" button
    const importBtn = modal.locator('button').filter({ hasText: /^Import$/i }).first();
    await expect(importBtn).toBeVisible();
    await importBtn.click();

    // Switch to Import Host Progress tab
    const textarea = page.locator('textarea[placeholder*="Paste share link" i]');
    await expect(textarea).toBeVisible();

    // Create sample valid progression token
    const samplePayload = {
      v: 1,
      hostName: 'Captain Sam',
      avatar: 'captain',
      timestamp: Date.now(),
      season: 'Summer',
      day: 18,
      fishingLevel: 5,
      caught: ['item_72001', 'item_72002', 'item_72003'],
      donatedMuseum: ['item_72001'],
      offeredTemple: ['item_72002']
    };

    const token = Buffer.from(JSON.stringify(samplePayload)).toString('base64url');
    await textarea.fill(token);

    // Should decode and show Captain Sam preview
    await expect(page.locator('h4:has-text("Captain Sam")')).toBeVisible();
    await expect(page.locator('text=Host Save')).toBeVisible();
    await expect(page.locator('text=3/69')).toBeVisible();

    // Verify Merge and Create buttons
    await expect(page.locator('button:has-text("Merge into")')).toBeVisible();
    await expect(page.locator('button:has-text("Create New Co-Op Profile")')).toBeVisible();

    // Click Create New Co-Op Profile
    await page.locator('button:has-text("Create New Co-Op Profile")').click();

    // Notification should indicate success
    await expect(page.locator('text=Created new profile').first()).toBeVisible();
  });

  test('Opening the app with ?share= URL parameter automatically triggers incoming progression modal', async ({ page }) => {
    const samplePayload = {
      v: 1,
      hostName: 'Host Willow',
      avatar: 'diver',
      timestamp: Date.now(),
      season: 'Fall',
      day: 12,
      fishingLevel: 8,
      caught: ['item_72005', 'item_72006'],
      donatedMuseum: ['item_72005'],
      offeredTemple: []
    };

    const token = Buffer.from(JSON.stringify(samplePayload)).toString('base64url');

    // Navigate with share parameter in URL (relative to base)
    await page.goto(`?share=${token}`);

    // Incoming Multiplayer Modal should automatically be visible
    const incomingModal = page.locator('#incoming-share-title');
    await expect(incomingModal).toBeVisible();
    await expect(page.locator('h4:has-text("Host Willow")')).toBeVisible();
    await expect(page.locator('span:has-text("Co-Op Host")')).toBeVisible();

    // Click Merge into Current Profile
    const mergeBtn = page.locator('button:has-text("Merge into Current Profile")');
    await expect(mergeBtn).toBeVisible();
    await mergeBtn.click();

    // Modal should close and URL param cleaned
    await expect(incomingModal).not.toBeVisible();
  });

});
