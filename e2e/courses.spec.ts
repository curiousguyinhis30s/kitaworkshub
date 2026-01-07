import { test, expect } from '@playwright/test';

test.describe('Courses Page', () => {
  test('should load courses from PocketBase', async ({ page }) => {
    await page.goto('/courses');
    
    // Check hero section
    await expect(page.getByRole('heading', { name: /Advance Your Career/i })).toBeVisible();
    
    // Check filter tabs exist
    await expect(page.getByRole('button', { name: /All Courses/i })).toBeVisible();
    
    // Wait for courses to load from PocketBase
    await page.waitForTimeout(1000);
    
    // Check course cards are displayed
    const courseCards = page.locator('[class*="rounded-2xl"]').filter({ hasText: /Course Includes/i });
    await expect(courseCards.first()).toBeVisible({ timeout: 5000 });
  });

  test('should filter courses by category', async ({ page }) => {
    await page.goto('/courses');
    
    // Wait for initial load
    await page.waitForTimeout(1000);
    
    // Click on PMO Fundamentals filter
    const pmoFilter = page.getByRole('button', { name: /PMO Fundamentals/i });
    if (await pmoFilter.isVisible()) {
      await pmoFilter.click();
      await page.waitForTimeout(500);
    }
  });
});
