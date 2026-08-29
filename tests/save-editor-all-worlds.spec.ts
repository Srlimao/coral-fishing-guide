import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

async function navigateToTab(page: any, tabNameRegex: RegExp) {
  const hamburger = page.locator('header button[aria-label="Open Navigation Menu"]').first();
  if (await hamburger.isVisible()) {
    await hamburger.click();
    const btn = page.locator('nav button').filter({ hasText: tabNameRegex }).first();
    await expect(btn).toBeVisible();
    await btn.click();
  } else {
    const btn = page.locator('aside button').filter({ hasText: tabNameRegex }).first();
    await expect(btn).toBeVisible();
    await btn.click();
  }
}

test.describe('Save Editor Multi-World & NPC / Quests Verification Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  const worlds = [
    {
      dir: 'World_2',
      expectedName: 'Willow',
      expectedFarm: 'Bauhaus',
      expectedGold: '27362',
      expectedStamina: '705',
      expectedHealth: '400',
      expectedFarmingLevel: '8',
      expectedLilyHearts: '10',
      expectedQuestsText: /126 \/ 248 Quests Completed/i
    },
    {
      dir: 'World_3',
      expectedName: 'Willow',
      expectedFarm: 'Dunhas',
      expectedGold: '73354',
      expectedStamina: '756',
      expectedHealth: '526',
      expectedFarmingLevel: '10',
      expectedLilyHearts: '10',
      expectedQuestsText: /61 \/ 107 Quests Completed/i
    },
    {
      dir: 'World_4',
      expectedName: 'Willian',
      expectedFarm: 'Backhaus',
      expectedGold: '39008',
      expectedStamina: '756',
      expectedHealth: '571',
      expectedFarmingLevel: '9',
      expectedLilyHearts: '10',
      expectedQuestsText: /49 \/ 99 Quests Completed/i
    },
    {
      dir: 'World_5',
      expectedName: 'Willow',
      expectedFarm: 'Dunhas',
      expectedGold: '25179',
      expectedStamina: '771',
      expectedHealth: '541',
      expectedFarmingLevel: '10',
      expectedLilyHearts: '10',
      expectedQuestsText: /62 \/ 107 Quests Completed/i
    },
    {
      dir: 'World_6',
      expectedName: 'Willow',
      expectedFarm: 'Backhaus',
      expectedGold: '300',
      expectedStamina: '450',
      expectedHealth: '400',
      expectedFarmingLevel: '0',
      expectedLilyHearts: '0',
      expectedQuestsText: /0 \/ 107 Quests Completed/i
    }
  ];

  for (const w of worlds) {
    test(`should load ${w.dir} with unique vitals, NPC hearts (Lily: ${w.expectedLilyHearts}❤️) and Quests`, async ({ page }) => {
      await navigateToTab(page, /Save Editor|Editor de Save/i);

      const savePath = path.join(process.env.LOCALAPPDATA || 'C:\\Users\\will_\\AppData\\Local', 'ProjectCoral', 'Saved', 'SaveGames', w.dir, 'EndOfDayAutoSave.sav');
      if (!fs.existsSync(savePath)) {
        test.skip();
        return;
      }

      // Upload save file
      const fileInput = page.locator('input[type="file"]').first();
      await fileInput.setInputFiles(savePath);

      // Verify character name input
      await expect(page.getByLabel('Player Name')).toHaveValue(w.expectedName);

      // Verify farm name input
      await expect(page.getByLabel('Farm Name')).toHaveValue(w.expectedFarm);

      // Verify gold input
      await expect(page.getByLabel('Current Money')).toHaveValue(w.expectedGold);

      // Verify max health
      await expect(page.getByLabel('Max Health')).toHaveValue(w.expectedHealth);

      // Verify max stamina
      await expect(page.getByLabel('Max Stamina')).toHaveValue(w.expectedStamina);

      // Verify Farming level select
      const farmingSelect = page.locator('select').nth(1);
      await expect(farmingSelect).toHaveValue(w.expectedFarmingLevel);

      // Switch to NPCs tab and verify Lily's real hearts
      const npcsTabBtn = page.locator('button').filter({ hasText: /NPCs & Romance|Relacionamentos/i }).first();
      await npcsTabBtn.click();

      // Search Lily
      const npcSearchInput = page.locator('input[placeholder*="Search islander"]').first();
      await npcSearchInput.fill('Lily');

      const lilyCard = page.locator('div').filter({ hasText: /^Lily/ }).first();
      await expect(lilyCard).toBeVisible();
      await expect(lilyCard).toContainText(`${w.expectedLilyHearts} / 10`);

      // Switch to Museum & Altars / Quests tab
      const museumTabBtn = page.locator('button').filter({ hasText: /Museum & Altars|Museu/i }).first();
      await museumTabBtn.click();

      // Verify Quests Completed count
      await expect(page.locator('body')).toContainText(w.expectedQuestsText);
    });
  }
});
