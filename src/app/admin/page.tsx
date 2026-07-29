import Link from "next/link";
import { requireStaff } from "@/lib/auth";
export default async function Admin() {
  await requireStaff("/admin");
  return (
    <main className="module-page">
      <p className="eyebrow">ADMIN</p>
      <h1>管理工作区</h1>
      <p className="notice">
        管理入口受服务端 session 与 profile role 检查；这不是 RLS 审计的替代。
      </p>
      <div className="actor-list">
        {[
          ["Review Queue", "/admin/review", "审核静态演示"],
          [
            "Published Records",
            "/admin/records",
            "正式记录管理将在后续阶段接入。",
          ],
          ["Notes & Tags", "/admin/notes", "私人笔记与标签尚未持久化。"],
          ["Data Imports", "/admin/import", "导入流程将在后续阶段接入。"],
          ["Settings", "/admin/settings", "账号与工作区设置将在后续阶段接入。"],
        ].map(([n, h, d]) => (
          <article key={h}>
            <h2>{n}</h2>
            <p>{d}</p>
            <Link href={h}>进入模块 →</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
