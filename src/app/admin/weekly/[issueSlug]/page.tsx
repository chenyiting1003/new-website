import { requireStaff } from "@/lib/auth";
import { WeeklyBriefPage } from "@/app/weekly/[issueSlug]/weekly-brief";
export default async function Page() {
  await requireStaff("/admin/weekly/2026-07-27");
  return (
    <>
      <div className="notice">
        本地审核演示，不会写入远程数据库。状态：published；真实修改、批准与发布持久化为后续任务。
      </div>
      <WeeklyBriefPage />
    </>
  );
}
