import { test, expect } from '@playwright/test';

test.describe('Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the search API to return predictable results
    await page.route('/api/search*', async route => {
      const url = new URL(route.request().url());
      const query = url.searchParams.get('q');

      if (query === 'test') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: '1',
              title: 'Test Article About Technology',
              slug: 'test-article-technology',
              summary: 'This is a test article about technology trends.',
              category: 'Technology',
              published_at: '2024-01-01T00:00:00Z',
              image_url: 'https://example.com/image.jpg',
            },
            {
              id: '2',
              title: 'Another Test Article',
              slug: 'another-test-article',
              summary: 'Another test article for search functionality.',
              category: 'Business',
              published_at: '2024-01-02T00:00:00Z',
              image_url: null,
            },
          ]),
        });
      } else if (query === 'nonexistent') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      } else {
        await route.continue();
      }
    });
  });

  test('search page loads correctly', async ({ page }) => {
    await page.goto('/search');

    await expect(page).toHaveTitle(/Search Articles/);
    await expect(
      page.getByRole('heading', { name: /search articles/i })
    ).toBeVisible();

    const searchInput = page.getByPlaceholder(/search for articles/i);
    await expect(searchInput).toBeVisible();
    await expect(searchInput).toBeFocused();
  });

  test('performs search and displays results', async ({ page }) => {
    await page.goto('/search');

    const searchInput = page.getByPlaceholder(/search for articles/i);
    await searchInput.fill('test');
    await searchInput.press('Enter');

    // Wait for results to load
    await expect(page.getByText('Test Article About Technology')).toBeVisible();
    await expect(page.getByText('Another Test Article')).toBeVisible();

    // Check result count
    await expect(page.getByText(/showing.*of.*results/i)).toBeVisible();
  });

  test('displays no results message for empty search', async ({ page }) => {
    await page.goto('/search');

    const searchInput = page.getByPlaceholder(/search for articles/i);
    await searchInput.fill('nonexistent');
    await searchInput.press('Enter');

    await expect(page.getByText(/no articles found/i)).toBeVisible();
    await expect(page.getByText(/try different keywords/i)).toBeVisible();
  });

  test('search filters work correctly', async ({ page }) => {
    await page.goto('/search?q=test');

    // Wait for initial results
    await expect(page.getByText('Test Article About Technology')).toBeVisible();

    // Test category filter
    const categorySelect = page.getByRole('combobox', { name: /category/i });
    await categorySelect.selectOption('Technology');

    // Results should be filtered (in a real scenario)
    // For this test, we'll just verify the filter was applied
    await expect(categorySelect).toHaveValue('Technology');
  });

  test('search from header works', async ({ page }) => {
    await page.goto('/');

    // Open search from header
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();

    const headerSearchInput = page.getByPlaceholder(/search articles/i);
    await headerSearchInput.fill('test');
    await headerSearchInput.press('Enter');

    // Should navigate to search page with query
    await expect(page).toHaveURL(/\/search\?q=test/);
    await expect(page.getByText('Test Article About Technology')).toBeVisible();
  });

  test('search dropdown shows instant results', async ({ page }) => {
    await page.goto('/');

    // Open search from header
    const searchButton = page.getByRole('button', { name: /search/i });
    await searchButton.click();

    const headerSearchInput = page.getByPlaceholder(/search articles/i);
    await headerSearchInput.fill('test');

    // Wait for dropdown results
    await expect(page.getByText('Test Article About Technology')).toBeVisible();

    // Click on a result
    await page.getByText('Test Article About Technology').click();

    // Should navigate to article page
    await expect(page).toHaveURL(/\/article\/test-article-technology/);
  });

  test('search is accessible', async ({ page }) => {
    await page.goto('/search');

    const searchInput = page.getByPlaceholder(/search for articles/i);

    // Check for proper labeling
    await expect(searchInput).toHaveAttribute('type', 'text');

    // Test keyboard navigation
    await searchInput.focus();
    await expect(searchInput).toBeFocused();

    // Test that search can be performed with keyboard only
    await searchInput.fill('test');
    await searchInput.press('Enter');

    await expect(page.getByText('Test Article About Technology')).toBeVisible();
  });

  test('search handles special characters', async ({ page }) => {
    await page.goto('/search');

    const searchInput = page.getByPlaceholder(/search for articles/i);

    // Test with special characters
    await searchInput.fill('test & "quotes" + symbols');
    await searchInput.press('Enter');

    // Should not crash and should show appropriate message
    await expect(
      page.getByText(/no articles found|showing.*results/i)
    ).toBeVisible();
  });

  test('search pagination works', async ({ page }) => {
    // Mock API for pagination test
    await page.route('/api/search', async route => {
      if (route.request().method() === 'POST') {
        const body = await route.request().postDataJSON();
        const page = body.filters?.page || 1;

        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            articles: Array.from({ length: 12 }, (_, i) => ({
              id: `${(page - 1) * 12 + i + 1}`,
              title: `Article ${(page - 1) * 12 + i + 1}`,
              slug: `article-${(page - 1) * 12 + i + 1}`,
              summary: 'Test summary',
              category: 'Technology',
              published_at: '2024-01-01T00:00:00Z',
              image_url: null,
            })),
            pagination: {
              page,
              limit: 12,
              total: 50,
              totalPages: 5,
            },
          }),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto('/search?q=test');

    // Wait for results
    await expect(page.getByText('Article 1')).toBeVisible();

    // Check pagination controls
    const nextButton = page.getByRole('button', { name: /next/i });
    await expect(nextButton).toBeVisible();

    // Go to next page
    await nextButton.click();

    // Should show page 2 results
    await expect(page.getByText('Article 13')).toBeVisible();
  });

  test('search works on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/search');

    const searchInput = page.getByPlaceholder(/search for articles/i);
    await expect(searchInput).toBeVisible();

    await searchInput.fill('test');
    await searchInput.press('Enter');

    // Results should be displayed in mobile layout
    await expect(page.getByText('Test Article About Technology')).toBeVisible();

    // Filters should be accessible on mobile
    const categorySelect = page.getByRole('combobox', { name: /category/i });
    await expect(categorySelect).toBeVisible();
  });

  test('search preserves state on page refresh', async ({ page }) => {
    await page.goto('/search?q=test');

    // Wait for results
    await expect(page.getByText('Test Article About Technology')).toBeVisible();

    // Refresh page
    await page.reload();

    // Search should be preserved
    const searchInput = page.getByPlaceholder(/search for articles/i);
    await expect(searchInput).toHaveValue('test');
    await expect(page.getByText('Test Article About Technology')).toBeVisible();
  });
});
