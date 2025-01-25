import { test, expect } from '@playwright/test';

// routes
test('portfolio picker', async ({ page }) => {
  await page.goto('http://localhost:3000/');
 
  await expect(page.getByText('Pick a client')).toBeInViewport();

  const portfolio = await page.getByText('Ferries');
  await portfolio.click();
  await expect(page).toHaveURL('http://localhost:3000/portfolio/1');
});

test('asset picker', async ({ page }) => {
  await page.goto('http://localhost:3000/portfolio/1');
 
  await expect(page.getByText('Nettle Ferries Amsterdam')).toBeInViewport();

  const asset = await page.getByText('Terminal');
  await asset.click();
  await expect(page).toHaveURL('http://localhost:3000/asset/1');
});

// asset page
test('geospatial button', async ({ page }) => {
  await page.goto('http://localhost:3000/asset/1');
 
  const asset = await page.getByText('Add geospatial data');
  await asset.click();
  await expect(page.getByText('Generated from external API').nth(0)).toBeInViewport();
});

test('description change', async ({ page }) => {
  await page.goto('http://localhost:3000/asset/1');
 
  await page.fill('input[value="A terminal in Ijmuiden."]', 'meow');
  await page.click('button:has-text("Save")');
  await expect(page.getByText('Save')).not.toBeVisible();
});