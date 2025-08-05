import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('has correct title and meta description', async ({ page }) => {
    await expect(page).toHaveTitle(/Pulse UTD News/);

    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveAttribute(
      'content',
      /Stay informed with Pulse UTD News/
    );
  });

  test('displays header with logo and navigation', async ({ page }) => {
    // Check logo
    const logo = page.getByRole('link', { name: /pulse utd news/i });
    await expect(logo).toBeVisible();

    // Check navigation items
    await expect(page.getByRole('link', { name: 'Latest' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Politics' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Business' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Technology' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Sports' })).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Entertainment' })
    ).toBeVisible();
  });

  test('displays theme toggle button', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await expect(themeToggle).toBeVisible();
  });

  test('displays search button', async ({ page }) => {
    const searchButton = page.getByRole('button', { name: /search/i });
    await expect(searchButton).toBeVisible();
  });

  test('opens search bar when search button is clicked', async ({ page }) => {
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();

    const searchInput = page.getByPlaceholder(/search articles/i);
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeFocused();
  });

  test('displays footer', async ({ page }) => {
    const footer = page.locator('footer');
    await expect(footer).toBeVisible();

    // Check for copyright text
    await expect(footer).toContainText(/pulse utd news/i);
  });

  test('is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Logo should be visible but possibly truncated
    const logo = page.getByRole('link', { name: /pulse/i });
    await expect(logo).toBeVisible();

    // Mobile menu button should be visible
    const mobileMenuButton = page.getByRole('button', { name: /menu/i });
    await expect(mobileMenuButton).toBeVisible();
  });

  test('mobile navigation works correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    const mobileMenuButton = page.getByRole('button', { name: /menu/i });
    await mobileMenuButton.click();

    // Navigation items should be visible in mobile menu
    await expect(page.getByRole('link', { name: 'Latest' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Politics' })).toBeVisible();
  });

  test('theme toggle works correctly', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: /toggle theme/i });
    await themeToggle.click();

    // Theme options should be visible
    await expect(page.getByText('Light')).toBeVisible();
    await expect(page.getByText('Dark')).toBeVisible();
    await expect(page.getByText('System')).toBeVisible();

    // Click dark theme
    await page.getByText('Dark').click();

    // Check if dark theme is applied
    const html = page.locator('html');
    await expect(html).toHaveClass(/dark/);
  });

  test('navigation links work correctly', async ({ page }) => {
    // Test Politics link
    await page.getByRole('link', { name: 'Politics' }).click();
    await expect(page).toHaveURL(/\/category\/politics/);

    // Go back to homepage
    await page.goto('/');

    // Test Technology link
    await page.getByRole('link', { name: 'Technology' }).click();
    await expect(page).toHaveURL(/\/category\/technology/);
  });

  test('search functionality works', async ({ page }) => {
    // Open search
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();

    const searchInput = page.getByPlaceholder(/search articles/i);
    await searchInput.fill('test query');
    await searchInput.press('Enter');

    // Should navigate to search page
    await expect(page).toHaveURL(/\/search\?q=test%20query/);
  });

  test('has proper accessibility features', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1').first();
    await expect(h1).toBeVisible();

    // Check for skip links or other accessibility features
    const header = page.locator('header');
    await expect(header).toHaveAttribute('role', 'banner');

    // Check for proper ARIA labels
    const searchButton = page.getByRole('button', { name: /search/i });
    await expect(searchButton).toHaveAttribute('aria-label');
  });

  test('loads without JavaScript errors', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    page.on('pageerror', error => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors (like network errors in dev)
    const criticalErrors = errors.filter(
      error =>
        !error.includes('Failed to load resource') &&
        !error.includes('net::ERR_') &&
        !error.includes('favicon.ico')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('has good performance metrics', async ({ page }) => {
    await page.goto('/');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Check that page loads reasonably quickly
    const navigationTiming = await page.evaluate(() => {
      const timing = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded:
          timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
        loadComplete: timing.loadEventEnd - timing.loadEventStart,
      };
    });

    // These are reasonable thresholds for a news site
    expect(navigationTiming.domContentLoaded).toBeLessThan(2000); // 2 seconds
    expect(navigationTiming.loadComplete).toBeLessThan(5000); // 5 seconds
  });
});
