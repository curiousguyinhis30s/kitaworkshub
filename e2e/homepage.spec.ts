import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load and display hero section', async ({ page }) => {
    await page.goto('/');
    
    // Check hero headline
    await expect(page.getByRole('heading', { name: /Where Leaders Grow Deep/i })).toBeVisible();
    
    // Check navigation links (use first() for desktop/mobile nav duplicates)
    await expect(page.getByRole('link', { name: /Home/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Courses/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Events/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /Services/i }).first()).toBeVisible();
    
    // Check CTA buttons
    await expect(page.getByRole('link', { name: /Explore Services/i })).toBeVisible();
  });

  test('should navigate to courses page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Courses/i }).first().click();
    await expect(page).toHaveURL('/courses');
    await expect(page.getByRole('heading', { name: /Expert-Led Training/i })).toBeVisible();
  });

  test('should navigate to events page', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /Events/i }).first().click();
    await expect(page).toHaveURL('/events');
    await expect(page.getByRole('heading', { name: /Events That Connect/i })).toBeVisible();
  });
});
