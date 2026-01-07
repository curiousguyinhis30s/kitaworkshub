import { test, expect } from '@playwright/test';

test.describe('Events Page', () => {
  test('should load events from PocketBase', async ({ page }) => {
    await page.goto('/events');
    
    // Check hero section
    await expect(page.getByRole('heading', { name: /Events That Connect/i })).toBeVisible();
    
    // Check filter tabs exist
    await expect(page.getByRole('button', { name: /All Events/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Workshop/i })).toBeVisible();
    
    // Wait for events to load from PocketBase
    await page.waitForTimeout(1000);
    
    // Check event cards are displayed (with date badges)
    const eventCards = page.locator('[class*="rounded-2xl"]').filter({ hasText: /Seats/i });
    await expect(eventCards.first()).toBeVisible({ timeout: 5000 });
  });

  test('should show event details', async ({ page }) => {
    await page.goto('/events');
    await page.waitForTimeout(1000);
    
    // Check that event times are displayed (use first() for multiple matches)
    await expect(page.getByText(/\d{1,2}:\d{2}\s*(AM|PM)/).first()).toBeVisible();
  });
});
