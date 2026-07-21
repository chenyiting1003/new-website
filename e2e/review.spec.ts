import { test, expect } from '@playwright/test';
test('reviewer approves one pending submission', async ({ page }) => { await page.goto('/admin/review'); await page.getByRole('link', { name: '审核记录' }).click(); await page.getByRole('button', { name: '批准并创建正式记录' }).click(); await expect(page.getByText('已创建正式记录（开发演示）。审核日志已记录状态变更。')).toContainText('已创建正式记录'); });
