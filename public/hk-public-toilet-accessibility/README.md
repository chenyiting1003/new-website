# 香港公厕可达性研究看板

公开访问：https://chenyiting1003.github.io/new-website/

独立静态看板，包含研究框架、测量策略、指标与数据、实施路径。支持方法检索筛选、详情、CSV 导出、演示及打印。

## 发布与更新

GitHub Pages 发布入口：`docs/index.html`。Pages 配置为从 `main` 分支的 `/docs` 目录自动发布，无需自定义 Actions 工作流。

Next.js 内使用的副本位于 `public/hk-public-toilet-accessibility/index.html`。修改看板后同步两份 HTML 并提交到 `main`：

```sh
cp public/hk-public-toilet-accessibility/index.html docs/index.html
```

`docs` 中仅包含看板 HTML 与 `.nojekyll`。此 Pages 站点以看板为首页；仓库现有 Next.js AI 治理网站代码保持原样。运行 Next.js 时仍可通过 `/hk-public-toilet-accessibility/index.html` 访问看板。

此前的 Sites 私有发布独立保留，后续 GitHub 提交仅自动更新 GitHub Pages，不会同步到 Sites。

## 研究边界

研究资料版本：2026-10-10。统计为归档数据快照；方法与公式为研究设计建议，尚未生成实证可达性结果。
