import Link from "next/link";
import { requireStaff } from "@/lib/auth";
export default async function Page() {
  await requireStaff("/admin/weekly");
  return (
    <main className="module-page">
      <p className="eyebrow">ADMIN · LOCAL REVIEW DEMO</p>
      <h1>周报审核</h1>
      <p className="notice">本地审核演示，不会写入远程数据库。</p>
      <Link href="/admin/weekly/2026-07-27">预览 2026-07-27 周报 →</Link>
    </main>
  );
}
