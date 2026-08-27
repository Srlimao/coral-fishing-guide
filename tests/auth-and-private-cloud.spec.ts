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

test.describe('Coral Island Fishing Guide - Account Authentication & Private Cloud Vault', () => {

  test.beforeEach(async ({ page }) => {
    // In-memory mock store for test accounts
    const mockAccounts: Record<string, any> = {};

    await page.route('**/api/coral_fish_accounts**', async route => {
      const url = route.request().url();
      const accountId = url.split('/coral_fish_accounts/')[1]?.split('?')[0];

      if (route.request().method() === 'GET') {
        if (accountId && mockAccounts[accountId]) {
          await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ id: accountId, data: mockAccounts[accountId] })
          });
        } else {
          await route.fulfill({
            status: 404,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Account not found' })
          });
        }
      } else if (route.request().method() === 'POST') {
        const payload = route.request().postDataJSON();
        if (accountId) {
          mockAccounts[accountId] = payload;
        }
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ ok: true, id: accountId })
        });
      }
    });

    await page.route('**/api/coral_fish_users**', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ count: 1, results: [] })
      });
    });
  });

  test('Guest view displays Private Cloud Vault with Sign In and Create Account triggers', async ({ page, isMobile }) => {
    await page.goto('./');
    await openProfileModal(page, isMobile);

    const modal = page.locator('div[role="dialog"]').filter({ has: page.locator('#user-profile-modal-title') });
    await modal.locator('button:has-text("Cloud & Multiplayer")').click();

    // Guest prompt should be visible
    await expect(modal.locator('text=Private Cloud Vault & Account')).toBeVisible();
    await expect(modal.locator('button:has-text("Sign In")').first()).toBeVisible();
    await expect(modal.locator('button:has-text("Create Account")').first()).toBeVisible();
  });

  test('Can register a new account with username and password', async ({ page, isMobile }) => {
    await page.goto('./');
    await openProfileModal(page, isMobile);

    const profileModal = page.locator('div[role="dialog"]').filter({ has: page.locator('#user-profile-modal-title') });
    await profileModal.locator('button:has-text("Cloud & Multiplayer")').click();

    // Click Create Account
    await profileModal.locator('button:has-text("Create Account")').first().click();

    // AuthModal should open
    const authModal = page.locator('div[role="dialog"]').filter({ has: page.locator('#auth-modal-title') });
    await expect(authModal).toBeVisible();
    await expect(authModal.locator('h3:has-text("Create Cloud Account")')).toBeVisible();

    // Fill form
    await authModal.locator('input[placeholder*="willow"]').fill('test_diver');
    await authModal.locator('input[type="password"]').fill('secret123');

    // Submit
    await authModal.locator('button:has-text("Create Private Account")').click();

    // Cloud & Multiplayer tab shows logged in status
    await expect(page.locator('text=@test_diver')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=Private Vault')).toBeVisible();
  });

  test('Can log in with existing credentials and log out cleanly', async ({ page, isMobile }) => {
    await page.goto('./');
    await openProfileModal(page, isMobile);

    const profileModal = page.locator('div[role="dialog"]').filter({ has: page.locator('#user-profile-modal-title') });
    await profileModal.locator('button:has-text("Cloud & Multiplayer")').click();

    // 1. Register first
    await profileModal.locator('button:has-text("Create Account")').first().click();
    const authModal = page.locator('div[role="dialog"]').filter({ has: page.locator('#auth-modal-title') });
    await authModal.locator('input[placeholder*="willow"]').fill('captain_sam');
    await authModal.locator('input[type="password"]').fill('password999');
    await authModal.locator('button:has-text("Create Private Account")').click();
    await expect(authModal).toBeHidden();
    await expect(page.locator('text=@captain_sam')).toBeVisible({ timeout: 8000 });

    // 2. Log out
    const logoutBtn = page.locator('button[title*="Log out"]').first();
    await expect(logoutBtn).toBeVisible();
    await logoutBtn.click();

    // Should return to Guest view
    await expect(page.locator('text=Private Cloud Vault & Account')).toBeVisible();

    // 3. Log in again
    await profileModal.locator('button:has-text("Sign In")').first().click();
    await expect(authModal.locator('h3:has-text("Sign In to Your Account")')).toBeVisible();
    await authModal.locator('input[placeholder*="willow"]').fill('captain_sam');
    await authModal.locator('input[type="password"]').fill('password999');
    await authModal.locator('button:has-text("Sign In to Cloud")').click();
    await expect(authModal).toBeHidden();

    // Should be logged in again
    await expect(page.locator('text=@captain_sam')).toBeVisible({ timeout: 8000 });
  });

});
