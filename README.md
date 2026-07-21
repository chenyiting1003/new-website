# Mondays · AI治理周报

私有 AI 治理政策与学术动态知识库。当前交付仅覆盖 **Phase 0–1**：Next.js 初始化、Supabase schema/RLS 迁移、审核状态机和可操作的单条审核演示。

## 本地启动

```bash
cp .env.example .env.local
npm install
npm run dev
```

在浏览器打开 `http://localhost:3000/admin/review`。此界面使用明确标注的开发演示数据；尚未连接 Supabase 前不会写入任何外部或生产数据。

## 数据库

执行 `supabase/migrations/20260721000000_phase_1_foundation.sql`（通过 Supabase CLI migration workflow）以创建核心 profiles、actors、themes、batches、submissions、records、sources 与 audit_logs 表及 RLS 策略。

生产部署前必须：配置 Supabase Auth，创建首位 admin profile，使用 CLI 执行迁移，并替换演示审核存储为受事务保护的 Server Actions。

## 仍未实现

Phase 2 及后续功能：历史基线与可核验 seed、地图、国家页、周报、研究库、关系网络、笔记标签、导出、真实 Supabase Auth/API、生产部署。

## 本地历史基线阅读版

首页现在使用 `src/data/baseline/` 下的本地、类型化历史基线 fixtures；每条展示记录均保留来源 URL 与核验标记。该数据用于阅读和界面验证，不替代 Supabase 中的正式记录，也不写入外部服务。

可浏览：`/countries`、`/cooperation`、`/research`、`/weekly/historical-baseline-2026`、`/library` 与 `/search`。完整筛选、认证、持久化审核、个人笔记/标签和导出仍不在本轮范围内。
