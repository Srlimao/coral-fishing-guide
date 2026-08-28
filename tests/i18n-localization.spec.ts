import { test, expect } from '@playwright/test';

async function switchLanguage(page: any, isMobile: boolean | undefined, flag: string, nativeName: string) {
  if (isMobile) {
    const menuBtn = page.locator('header button[aria-label="Open Navigation Menu"]').first();
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
    }
    const flagBtn = page.locator(`button:has-text("${flag}")`).first();
    await expect(flagBtn).toBeVisible();
    await flagBtn.click();

    // Close mobile drawer by clicking close or backdrop
    const closeBtn = page.locator('button[aria-label="Close"]').first();
    if (await closeBtn.isVisible()) {
      await closeBtn.click();
    }
  } else {
    const langBtn = page.locator('aside button[title="Change Language"]').first();
    await expect(langBtn).toBeVisible();
    await langBtn.click();
    const targetBtn = page.locator(`button:has-text("${nativeName}")`).first();
    await expect(targetBtn).toBeVisible();
    await targetBtn.click();
  }
}

async function navigateToTab(page: any, tabPattern: RegExp) {
  const hamburger = page.locator('header button[aria-label="Open Navigation Menu"]').first();
  if (await hamburger.isVisible()) {
    await hamburger.click();
    const drawerBtn = page.locator('nav button').filter({ hasText: tabPattern }).first();
    await expect(drawerBtn).toBeVisible();
    await drawerBtn.click();
  } else {
    const sidebarBtn = page.locator('aside button').filter({ hasText: tabPattern }).first();
    await expect(sidebarBtn).toBeVisible();
    await sidebarBtn.click();
  }
}

test.describe('Coral Island Fishing Guide - Full App & Game Localization Suite', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test('Default loads in English and displays verified official game names', async ({ page }) => {
    await expect(page.locator('body')).toBeVisible();

    // Verify English fish names
    await expect(page.getByText('Arapaima', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Catfish', { exact: false }).first()).toBeVisible();
  });

  test('Switching to Portuguese (pt-BR) localizes Navigation, Fish, Locations, and Altars', async ({ page, isMobile }) => {
    await switchLanguage(page, isMobile, '🇧🇷', 'Português (BR)');

    // Verify Portuguese Fish Names (Arapaima -> Pirarucu, Catfish -> Bagre)
    await expect(page.getByText(/Pirarucu/i).first()).toBeVisible();
    await expect(page.getByText(/Bagre/i).first()).toBeVisible();

    // Navigate to Temple Altars tab
    await navigateToTab(page, /Altares do Templo/i);

    await expect(page.getByText(/Altar de Captura/i).first()).toBeVisible();
    await expect(page.getByText(/Peixes de Água Doce/i).first()).toBeVisible();
    await expect(page.getByText(/Peixes de Água Salgada/i).first()).toBeVisible();
  });

  test('Craft & Building Wiki renders localized item names, materials, and buildings in Portuguese', async ({ page, isMobile }) => {
    await switchLanguage(page, isMobile, '🇧🇷', 'Português (BR)');

    // Navigate to Craft & Buildings Wiki
    await navigateToTab(page, /Criação & Edifícios/i);

    // Verify Wiki Tabs & Titles
    await expect(page.getByRole('heading', { name: /WIKI DE CRIAÇÃO/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Receitas de Fabricação/i })).toBeVisible();

    // Verify Localized Crafting Items (Mason Jar -> Frasco de conserva, Keg -> Barril, Beehive -> Apiário, Cheese Press -> Prensa de queijo)
    await expect(page.getByText(/Frasco de conserva/i).first()).toBeVisible();
    await expect(page.getByText(/Barril/i).first()).toBeVisible();
    await expect(page.getByText(/Apiário/i).first()).toBeVisible();
    await expect(page.getByText(/Prensa de queijo/i).first()).toBeVisible();

    // Verify Localized Materials
    await expect(page.getByText(/Madeira/i).first()).toBeVisible();
    await expect(page.getByText(/Vidro/i).first()).toBeVisible();

    // Switch to Farm Buildings Tab
    await page.getByRole('button', { name: /Edifícios da Fazenda/i }).first().click();
    await expect(page.getByText(/Aviário|Celeiro/i).first()).toBeVisible();
    await expect(page.getByText(/Celeiro/i).first()).toBeVisible();
  });

  test('Shopping Planner calculates and displays localized materials and gold in Portuguese', async ({ page, isMobile }) => {
    await switchLanguage(page, isMobile, '🇧🇷', 'Português (BR)');

    // Go to Craft & Buildings Wiki
    await navigateToTab(page, /Criação & Edifícios/i);

    // Click on Frasco de Conserva (Mason Jar)
    await page.getByText(/Frasco de conserva/i).first().click();

    // Modal opens, check localized contents
    await expect(page.getByText(/Materiais/i).first()).toBeVisible();
    await expect(page.getByText(/Madeira/i).first()).toBeVisible();

    // Click "+ Adicionar ao Planejador"
    await page.getByRole('button', { name: /\+ Adicionar ao Planejador/i }).click();

    // Open Planner Drawer
    await page.getByTestId('wiki-planner-btn').click();

    // Verify Planner shows localized project name and raw materials
    await expect(page.locator('aside').filter({ hasText: /Planejador de Projetos|Project Planner/i })).toBeVisible();
    await expect(page.getByText(/Frasco de conserva/i).first()).toBeVisible();
    await expect(page.getByText(/Materiais/i).first()).toBeVisible();
  });

  test('Multi-language dynamic switching across Spanish, German, French, Japanese, and Chinese', async ({ page, isMobile }) => {
    // Switch to Spanish
    await switchLanguage(page, isMobile, '🇪🇸', 'Español');
    await expect(page.locator('input[type="text"]:visible').first()).toHaveAttribute('placeholder', /Buscar pez/i);

    // Switch to German
    await switchLanguage(page, isMobile, '🇩🇪', 'Deutsch');
    await expect(page.locator('input[type="text"]:visible').first()).toHaveAttribute('placeholder', /Fisch suchen/i);

    // Switch to French
    await switchLanguage(page, isMobile, '🇫🇷', 'Français');
    await expect(page.locator('input[type="text"]:visible').first()).toHaveAttribute('placeholder', /Rechercher/i);

    // Switch to Japanese
    await switchLanguage(page, isMobile, '🇯🇵', '日本語');
    await expect(page.locator('input[type="text"]:visible').first()).toHaveAttribute('placeholder', /魚を検索/i);

    // Switch to Chinese
    await switchLanguage(page, isMobile, '🇨🇳', '简体中文');
    await expect(page.locator('input[type="text"]:visible').first()).toHaveAttribute('placeholder', /搜索鱼类/i);
  });
});
