import { test, expect } from '@playwright/test';

const NAV_ITEMS = ['Dashboard', 'Analytics', 'Users', 'Courses', 'Events', 'Contacts'];

test.describe('Admin Dashboard E2E', () => {
  test.beforeEach(async ({ page }) => {
    // Set desktop viewport to ensure sidebar is visible
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/admin/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Admin dashboard page loads', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/admin/);
    const main = page.locator('main').first();
    await expect(main).toBeVisible({ timeout: 15000 });
  });

  test('Admin sidebar is present and navigation links exist', async ({ page }) => {
    // Sidebar may be collapsed (72px) or expanded (280px)
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeAttached();

    // Check nav links exist (may be hidden if collapsed, but attached)
    const nav = sidebar.locator('nav');
    await expect(nav).toBeAttached();

    for (const item of NAV_ITEMS) {
      const link = sidebar.getByRole('link', { name: new RegExp(item, 'i') });
      await expect(link).toBeAttached();
    }
  });

  test('Dashboard shows main content area', async ({ page }) => {
    const mainContent = page.locator('main').first();
    await expect(mainContent).toBeVisible({ timeout: 15000 });
  });

  test('Analytics page loads via navigation', async ({ page }) => {
    const analyticsLink = page.getByRole('link', { name: /analytics/i }).first();
    await analyticsLink.click();
    await expect(page).toHaveURL(/.*\/admin\/analytics/);
  });

  test('Users page loads via navigation', async ({ page }) => {
    const usersLink = page.getByRole('link', { name: /users/i }).first();
    await usersLink.click();
    await expect(page).toHaveURL(/.*\/admin\/users/);
  });

  test('Courses page loads via navigation', async ({ page }) => {
    const coursesLink = page.getByRole('link', { name: /courses/i }).first();
    await coursesLink.click();
    await expect(page).toHaveURL(/.*\/admin\/courses/);
  });

  test('Events page loads via navigation', async ({ page }) => {
    const eventsLink = page.getByRole('link', { name: /events/i }).first();
    await eventsLink.click();
    await expect(page).toHaveURL(/.*\/admin\/events/);
  });

  test('Contacts page loads via navigation', async ({ page }) => {
    const contactsLink = page.getByRole('link', { name: /contacts/i }).first();
    await contactsLink.click();
    await expect(page).toHaveURL(/.*\/admin\/contacts/);
  });

  test('Settings link exists', async ({ page }) => {
    const settingsLink = page.getByRole('link', { name: /settings/i }).first();
    await expect(settingsLink).toBeAttached();
  });

  test('Logout link exists', async ({ page }) => {
    const logoutLink = page.getByRole('link', { name: /logout/i }).first();
    await expect(logoutLink).toBeAttached();
  });

  test('Check for demo mode indicator', async ({ page }) => {
    const demoIndicator = page.getByText(/demo mode/i);
    if (await demoIndicator.count() > 0) {
      await expect(demoIndicator).toBeVisible();
    }
  });

  test('Sidebar toggle button works', async ({ page }) => {
    // Find the toggle button (ChevronLeft or ChevronRight)
    const toggleButton = page.locator('aside button').first();
    await expect(toggleButton).toBeVisible();

    // Click to toggle
    await toggleButton.click();

    // Sidebar should still be attached after toggle
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeAttached();
  });
});

test.describe('Admin Mobile Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/admin/dashboard');
    await page.waitForLoadState('domcontentloaded');
  });

  test('Mobile header is visible', async ({ page }) => {
    const header = page.locator('header').first();
    await expect(header).toBeVisible();
  });

  test('Mobile menu opens bottom sheet', async ({ page }) => {
    const menuButton = page.locator('header button').first();
    await expect(menuButton).toBeVisible();

    await menuButton.click();

    // Bottom sheet should appear
    const bottomSheet = page.locator('.fixed.bottom-0');
    await expect(bottomSheet).toBeVisible();
  });
});
