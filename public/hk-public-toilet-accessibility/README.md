# 公交换乘与公厕可达性研究看板 v3

公开访问：https://chenyiting1003.github.io/new-website/

独立静态页面，四部分为研究问题、事件与数据、测量策略和研究流程。支持七项测量检索、类别筛选、详情、时序视角说明、CSV导出、演示与打印。下载区提供与看板同步的英文幻灯片。

## 发布

GitHub Pages 从 `main:/docs` 发布。`docs/index.html` 与 `public/hk-public-toilet-accessibility/index.html` 同步，两处 `assets/` 存放幻灯片PDF及PowerPoint。无需构建。

原有Next.js网站代码保留。此前Sites私有发布不自动同步。

## 数据状态

以乘客换乘事件为研究对象。事件来源与字段尚待确认和接入；页面不展示虚构的时序数据或热点结果。公厕记录来自既有FEHD初筛文件。

## 验证

本地项目使用 `scripts/check_transfer_dashboard.cjs` 检查搜索、筛选、对话框、导出、下载文件存在性、演示与手机布局。原人口框架已归档。
