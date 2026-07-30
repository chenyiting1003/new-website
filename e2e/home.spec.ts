import { test, expect } from "@playwright/test";
test("home offers readable baseline navigation and interactive timeline", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Mondays · AI治理周报" }),
  ).toBeVisible();
  await expect(page.getByText("历史记录", { exact: true })).toBeVisible();
  const tab = page.getByRole("tab", { name: /2023—2024/ });
  await tab.click();
  await expect(tab).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("欧盟人工智能法案")).toBeVisible();
  await page
    .getByRole("link", { name: /阅读历史基线特刊/ })
    .first()
    .click();
  await expect(page).toHaveURL(/weekly\/historical-baseline-2026/);
  await expect(
    page.getByRole("heading", { name: /历史基线特刊/ }),
  ).toBeVisible();
});
test("map nodes are keyboard accessible and country details render", async ({
  page,
}) => {
  await page.goto("/");
  const node = page.getByRole("button", { name: /欧盟：regulatory/ });
  await node.focus();
  await expect(
    page.getByText("以具有约束力的 AI Act 构成风险分级监管框架。"),
  ).toBeVisible();
  await node.click();
  await page.getByRole("link", { name: "查看详情" }).click();
  await expect(page).toHaveURL(/countries\/european-union/);
  await expect(
    page.getByRole("heading", { name: "欧盟", exact: true }),
  ).toBeVisible();
});
