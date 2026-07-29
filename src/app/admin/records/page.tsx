import { requireStaff } from "@/lib/auth";
export default async function Page() {
  await requireStaff("/admin/records");
  return (
    <main className="module-page">
      <p className="eyebrow">ADMIN</p>
      <h1>records</h1>
      <p className="notice">此管理模块的持久化功能将在后续阶段完成。</p>
    </main>
  );
}
