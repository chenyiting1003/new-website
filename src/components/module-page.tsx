import Link from "next/link";
import { RecordCard } from "@/components/home-experience";
import type { BaselineRecord } from "@/data/baseline";
export function ModulePage({
  eyebrow,
  title,
  description,
  records,
  notice,
}: {
  eyebrow: string;
  title: string;
  description: string;
  records: BaselineRecord[];
  notice: string;
}) {
  return (
    <main className="module-page">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="lede">{description}</p>
      <p className="notice">{notice}</p>
      <div className="record-grid">
        {records.length ? (
          records.map((r) => <RecordCard key={r.id} record={r} />)
        ) : (
          <p className="empty-state">
            当前本地历史基线尚未收录与此筛选相符的研究记录。
          </p>
        )}
      </div>
      <Link className="text-link" href="/">
        返回首页 →
      </Link>
    </main>
  );
}
