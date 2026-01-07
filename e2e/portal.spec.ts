import { test, expect } from '@playwright/test';

const BASE_URL = '/portal';
const NAV_LINKS = ['Dashboard', 'Courses', 'Events', 'Resources', 'Certificates'];

test.describe('Client Portal - Desktop', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
  });

  test('Portal dashboard page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    // Wait for any main element to be visible
    const main = page.locator('main').first();
    await expect(main).toBeVisible({ timeout: 15000 });
  });

  test('Sidebar navigation links are attached', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);

    // Sidebar may be collapsed (64px) or expanded (256px)
    const sidebar = page.locator('aside').first();
    await expect(sidebar).toBeAttached();

    // Check all nav links exist
    for (const link of NAV_LINKS) {
      const navLink = sidebar.getByRole('link', { name: new RegExp(link, 'i') });
      await expect(navLink).toBeAttached();
    }
  });

  test('Navigation between portal pages works', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);

    // Navigate to Courses
    const coursesLink = page.getByRole('link', { name: /courses/i }).first();
    await coursesLink.click();
    await expect(page).toHaveURL(/.*\/portal\/courses/);

    // Navigate to Events
    const eventsLink = page.getByRole('link', { name: /events/i }).first();
    await eventsLink.click();
    await expect(page).toHaveURL(/.*\/portal\/events/);

    // Navigate back to Dashboard
    const dashboardLink = page.getByRole('link', { name: /dashboard/i }).first();
    await dashboardLink.click();
    await expect(page).toHaveURL(/.*\/portal\/dashboard/);
  });

  test('Courses page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/courses`);
    const main = page.locator('main').first();
    await expect(main).toBeVisible({ timeout: 15000 });
  });

  test('Events page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/events`);
    const main = page.locator('main').first();
    await expect(main).toBeVisible({ timeout: 15000 });
  });

  test('Resources page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/resources`);
    const main = page.locator('main').first();
    await expect(main).toBeVisible({ timeout: 15000 });
  });

  test('Certificates page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/certificates`);
    const main = page.locator('main').first();
    await expect(main).toBeVisible({ timeout: 15000 });
  });

  test('Profile page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/profile`);
    const main = page.locator('main').first();
    await expect(main).toBeVisible({ timeout: 15000 });
  });

  test('Sidebar toggle button works', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);

    // Find toggle button in sidebar
    const sidebar = page.locator('aside').first();
    const toggleButton = sidebar.locator('button').first();
    await expect(toggleButton).toBeVisible();

    // Click to toggle
    await toggleButton.click();

    // Sidebar should still be attached
    await expect(sidebar).toBeAttached();
  });
});

test.describe('Client Portal - Mobile', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
  });

  test('Mobile FAB button is visible', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);

    // FAB button at bottom right
    const fab = page.locator('button.fixed').first();
    await expect(fab).toBeVisible();
  });

  test('FAB opens bottom sheet navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);

    // Click FAB to open menu
    const fab = page.locator('button.fixed').first();
    await fab.click();

    // Bottom sheet should appear
    const bottomSheet = page.locator('.fixed.bottom-0.left-0.right-0');
    await expect(bottomSheet).toBeVisible();

    // Navigation links should be visible
    const dashboardLink = bottomSheet.getByRole('link', { name: /dashboard/i });
    await expect(dashboardLink).toBeVisible();
  });

  test('Mobile navigation works', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);

    // Open menu
    const fab = page.locator('button.fixed').first();
    await fab.click();

    // Click on Courses
    const bottomSheet = page.locator('.fixed.bottom-0.left-0.right-0');
    const coursesLink = bottomSheet.getByRole('link', { name: /courses/i });
    await coursesLink.click();

    await expect(page).toHaveURL(/.*\/portal\/courses/);
  });

  test('Bottom sheet closes on navigation', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);

    // Open menu
    const fab = page.locator('button.fixed').first();
    await fab.click();

    // Navigate
    const bottomSheet = page.locator('.fixed.bottom-0.left-0.right-0');
    await expect(bottomSheet).toBeVisible();
    const eventsLink = bottomSheet.getByRole('link', { name: /events/i });
    await eventsLink.click();

    // Wait for navigation to complete
    await expect(page).toHaveURL(/.*\/portal\/events/);

    // Sheet should close - check that it has translate-y-full class (hidden off-screen)
    await expect(bottomSheet).toHaveClass(/translate-y-full/);
  });
});
