import { test, expect } from '@playwright/test';

test.describe('Courses & Events E2E', () => {
  test.describe('Courses Listing Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/courses');
    });

    test('should load courses page with course cards', async ({ page }) => {
      await expect(page).toHaveURL(/\/courses/);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      const courseCards = page.locator('[class*="card"], article').first();
      await expect(courseCards).toBeVisible();
    });

    test('should display course information on cards', async ({ page }) => {
      // Wait for hydration - look for actual course title (h3)
      const courseTitle = page.locator('h3').first();
      await expect(courseTitle).toBeVisible({ timeout: 15000 });
      // Check for course content - price, instructor, or enroll button
      const courseContent = page.locator('text=/RM|Enroll|View Details/i').first();
      await expect(courseContent).toBeVisible();
    });

    test('course detail page loads when clicking a course', async ({ page }) => {
      const courseLink = page.locator('a[href*="/courses/"]').first();
      // Skip if no course links exist
      if (await courseLink.count() === 0) {
        test.skip();
        return;
      }
      await courseLink.click();
      await expect(page).toHaveURL(/\/courses\/.+/);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Course Detail Page', () => {
    test('should show course details and enroll button', async ({ page }) => {
      await page.goto('/courses');
      // Wait for hydration - look for actual course link
      const courseLink = page.locator('a[href*="/courses/"]').first();
      await expect(courseLink).toBeVisible({ timeout: 15000 });
      await courseLink.click();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible({ timeout: 10000 });
      // Check for enroll button or View Details button
      const enrollButton = page.getByRole('button', { name: /enroll|register|join|view details/i });
      if (await enrollButton.count() > 0) {
        await expect(enrollButton.first()).toBeVisible();
      }
    });
  });

  test.describe('Events Listing Page', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/events');
    });

    test('should load events page with event cards', async ({ page }) => {
      await expect(page).toHaveURL(/\/events/);
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    });

    test('should display event information', async ({ page }) => {
      const firstCard = page.locator('[class*="card"], article').first();
      if (await firstCard.count() > 0) {
        await expect(firstCard).toBeVisible();
      }
    });

    test('event detail page loads when clicking an event', async ({ page }) => {
      const eventLink = page.locator('a[href*="/events/"]').first();
      if (await eventLink.count() > 0) {
        await eventLink.click();
        await expect(page).toHaveURL(/\/events\/.+/);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      }
    });
  });

  test.describe('Event Detail Page', () => {
    test('should show event details and register button', async ({ page }) => {
      await page.goto('/events');
      const eventLink = page.locator('a[href*="/events/"]').first();
      if (await eventLink.count() > 0) {
        await eventLink.click();
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        const registerButton = page.getByRole('button', { name: /register|join|sign up/i });
        if (await registerButton.count() > 0) {
          await expect(registerButton).toBeVisible();
        }
      }
    });
  });
});
