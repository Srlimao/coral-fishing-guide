import { test, expect } from '@playwright/test';

test.describe('Coral Island Fishing Guide - 3-Column Layout & Responsiveness Tests', () => {

  test('Page loads properly in 3-column layout with left navigation sidebar and no horizontal overflow', async ({ page, isMobile }) => {
    await page.goto('/');

    if (!isMobile) {
      // On desktop/laptop: Left sidebar navigation is visible
      const leftSidebar = page.locator('aside').filter({ hasText: /Coral Guide/i }).first();
      await expect(leftSidebar).toBeVisible();
      await expect(leftSidebar.locator('button').filter({ hasText: /Journal|Diário/i }).first()).toBeVisible();

      // Right filter sidebar is visible
      const rightSidebar = page.locator('aside').filter({ hasText: /Filters & Simulation/i }).first();
      await expect(rightSidebar).toBeVisible();
    } else {
      // On mobile: Mobile header with menu hamburger is visible
      const mobileHeader = page.locator('header').first();
      await expect(mobileHeader).toBeVisible();
    }

    // Verify no horizontal overflow
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);
  });

  test('Left Navigation Sidebar collapses and expands cleanly on desktop', async ({ page, isMobile }) => {
    await page.goto('/');

    if (!isMobile) {
      const leftSidebar = page.locator('aside').first();
      await expect(leftSidebar).toBeVisible();

      // Click collapse button
      const collapseBtn = page.locator('aside button[aria-label="Collapse Menu"]').first();
      if (await collapseBtn.isVisible()) {
        await collapseBtn.click();
        // Should now have expand button
        await expect(page.locator('aside button[aria-label="Expand Menu"]').first()).toBeVisible();

        // Click expand button
        await page.locator('aside button[aria-label="Expand Menu"]').first().click();
        await expect(page.locator('aside button[aria-label="Collapse Menu"]').first()).toBeVisible();
      }
    }
  });

  test('Right Filters Sidebar on desktop and Mobile Filter Modal on mobile open and toggle cleanly', async ({ page, isMobile }) => {
    await page.goto('/');

    if (!isMobile) {
      const rightSidebar = page.locator('aside').filter({ hasText: /Filters & Simulation/i }).first();
      await expect(rightSidebar).toBeVisible();

      // Click desktop collapse button
      const collapseRightBtn = page.locator('aside button[aria-label="Collapse Filters"]').first();
      if (await collapseRightBtn.isVisible()) {
        await collapseRightBtn.click();
        // Should show expand compact button
        const expandRightBtn = page.locator('aside button[aria-label="Expand Filters"]').first();
        await expect(expandRightBtn).toBeVisible();

        // Click expand
        await expandRightBtn.click();
        await expect(page.locator('aside button[aria-label="Collapse Filters"]').first()).toBeVisible();
      }
    } else {
      // On mobile: top filter button opens the mobile bottom sheet modal
      const mobileToggleBtn = page.locator('button[aria-label="Toggle Filters"]').first();
      await expect(mobileToggleBtn).toBeVisible();
      await mobileToggleBtn.click();

      // Mobile filter modal should open with Fishing Level and Season controls
      const mobileModal = page.locator('aside[aria-label="Filters & Simulation"]').first();
      await expect(mobileModal).toBeVisible();
      await expect(page.locator('text=Fishing Level').first()).toBeVisible();

      // Close modal by clicking Close button
      const closeBtn = page.locator('button[aria-label="Close Filters"]').first();
      await closeBtn.click();
      await expect(mobileModal).not.toBeVisible();
    }
  });

  test('Center catalog search filters fish and cards render smoothly', async ({ page }) => {
    await page.goto('/');

    const searchInput = page.locator('input[placeholder*="Search" i]:visible, input[placeholder*="Pesquisar" i]:visible').first();
    await expect(searchInput).toBeVisible();
    await searchInput.fill('Salmon');

    // Should find Salmon
    await expect(page.locator('h3:has-text("Salmon"), h3:has-text("Salmão")').first()).toBeVisible();

    // Clear search
    await searchInput.fill('');
    await expect(page.locator('.cg-card-interactive').first()).toBeVisible();
  });

  test('Clicking a fish card opens Details Modal with Map Location preview', async ({ page }) => {
    await page.goto('/');

    // Click the first fish card
    const firstCard = page.locator('.cg-card-interactive').first();
    await expect(firstCard).toBeVisible();
    await firstCard.click();

    // Modal should be open
    const modal = page.locator('.fixed.inset-0.z-50');
    await expect(modal).toBeVisible();
    await expect(modal.locator('text=Spawn Map Location')).toBeVisible();

    // Close modal
    const closeBtn = page.locator('button[aria-label*="Close" i]').first();
    await closeBtn.click();
    await expect(modal).not.toBeVisible();
  });

  test('Navigation tabs switch smoothly across views via Left Sidebar', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      // Open mobile drawer
      const menuBtn = page.locator('button[aria-label="Open Navigation Menu"]').first();
      await menuBtn.click();
    }

    // Switch to Calendar View
    const calendarTab = page.locator('button').filter({ hasText: /Schedule|Calendário/i }).first();
    await calendarTab.click();
    await expect(page.locator('text=CALENDAR').or(page.locator('text=CALENDÁRIO')).first()).toBeVisible();

    if (isMobile) {
      const menuBtn = page.locator('button[aria-label="Open Navigation Menu"]').first();
      await menuBtn.click();
    }

    // Switch to Map View
    const mapTab = page.locator('button').filter({ hasText: /Island Map|Mapa da Ilha/i }).first();
    await mapTab.click();
    await expect(page.locator('text=Starlet Island Fishing Map').first()).toBeVisible();

    if (isMobile) {
      const menuBtn = page.locator('button[aria-label="Open Navigation Menu"]').first();
      await menuBtn.click();
    }

    // Switch to Altars View
    const altarTab = page.locator('button').filter({ hasText: /Temple Altars|Altares/i }).first();
    await altarTab.click();
    await expect(page.locator('text=Catching Altar').or(page.locator('text=Altar de Captura')).first()).toBeVisible();

    if (isMobile) {
      const menuBtn = page.locator('button[aria-label="Open Navigation Menu"]').first();
      await menuBtn.click();
    }

    // Switch back to Fish Journal
    const journalTab = page.locator('button').filter({ hasText: /Fish Journal|Diário/i }).first();
    await journalTab.click();
    await expect(page.locator('.cg-card-interactive').first()).toBeVisible();
  });

  test('Language selector switches languages dynamically', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      const menuBtn = page.locator('button[aria-label="Open Navigation Menu"]').first();
      await menuBtn.click();
      const ptFlagBtn = page.locator('button:has-text("🇧🇷")').first();
      await expect(ptFlagBtn).toBeVisible();
      await ptFlagBtn.click();
    } else {
      const langBtn = page.locator('aside button[title="Change Language"]').first();
      await expect(langBtn).toBeVisible();
      await langBtn.click();

      const ptBtn = page.locator('button:has-text("Português")').first();
      if (await ptBtn.isVisible()) {
        await ptBtn.click();
      }
    }

    await expect(page.locator('text=Diário').first()).toBeVisible();
  });

  test('Mobile floating filter button opens filter modal and adjusts simulation', async ({ page, isMobile }) => {
    await page.goto('/');

    if (isMobile) {
      // FAB button should be visible on mobile
      const fabBtn = page.locator('button[aria-label="Open Filters & Simulation Modal"]').first();
      await expect(fabBtn).toBeVisible();
      await fabBtn.click();

      // Modal should open
      const mobileModal = page.locator('aside[aria-label="Filters & Simulation"]').first();
      await expect(mobileModal).toBeVisible();

      // Click "Show X Fish" button to close
      const showFishBtn = mobileModal.locator('button:has-text("Show")').first();
      await expect(showFishBtn).toBeVisible();
      await showFishBtn.click();
      await expect(mobileModal).not.toBeVisible();
    }
  });

});

