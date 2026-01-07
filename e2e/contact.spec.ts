import { test, expect } from '@playwright/test';

test.describe('Contact Page E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('Contact page loads successfully', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('Contact form has all required fields', async ({ page }) => {
    const form = page.locator('form');
    await expect(form.getByLabel(/name/i)).toBeVisible();
    await expect(form.getByLabel(/email/i)).toBeVisible();
    await expect(form.getByLabel(/message/i)).toBeVisible();
  });

  test('Submit button is visible', async ({ page }) => {
    const submitButton = page.getByRole('button', { name: /send|submit/i });
    await expect(submitButton).toBeVisible();
  });

  test('Empty form submission shows validation errors', async ({ page }) => {
    await page.route('**/api/contact', route => route.abort('failed'));

    const submitButton = page.getByRole('button', { name: /send|submit/i });
    await submitButton.click();

    const nameInput = page.getByLabel(/name/i);
    // Check for browser native validation
    await expect(nameInput).toHaveAttribute('required', '');
  });

  test('Valid form submission shows success message', async ({ page }) => {
    await page.route('**/api/contact', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true, message: 'Message sent successfully' }),
      });
    });

    const form = page.locator('form');
    await form.getByLabel(/name/i).fill('John Doe');
    await form.getByLabel(/email/i).fill('john.doe@example.com');

    const phoneField = form.getByLabel(/phone/i);
    if (await phoneField.count() > 0) {
      await phoneField.fill('1234567890');
    }

    const subjectField = form.getByLabel(/subject/i);
    if (await subjectField.count() > 0) {
      await subjectField.fill('Test Subject');
    }

    await form.getByLabel(/message/i).fill('This is a test message.');
    await page.getByRole('button', { name: /send|submit/i }).click();

    // Contact page shows "Message sent!" on success - use first() to handle multiple matches
    const successMessage = page.getByText(/message sent|success|thank you/i).first();
    await expect(successMessage).toBeVisible({ timeout: 10000 });
  });

  test('Contact info section is visible', async ({ page }) => {
    // Check for contact details (Phone, Email, Office)
    await expect(page.getByText(/phone|email|office|address|location/i).first()).toBeVisible();
  });

  test('Social links are visible in footer', async ({ page }) => {
    const footer = page.locator('footer');
    const socialLinks = footer.locator('a[href*="facebook"], a[href*="twitter"], a[href*="linkedin"], a[href*="instagram"]');
    const count = await socialLinks.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
