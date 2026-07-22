import Link from "next/link";
import { baselineIssue, records } from "@/data/baseline";
export default function Weekly() {
  return (
    <main className="module-page">
      <p className="eyebrow">WEEKLY BRIEFS</p>
      <h1>周报与特刊</h1>
      <p className="lede">以历史基线特刊开始，后续将接入经审核的每周增量。</p>
      <article className="issue-card">
        <p className="metadata">已发布 · 历史基线特刊</p>
        <h2>{baselineIssue.title}</h2>
        <p>
          覆盖 {baselineIssue.coverage} · {records.length} 条本地基线记录
        </p>
        <Link className="button" href={`/weekly/${baselineIssue.slug}`}>
          阅读完整特刊 →
        </Link>
      </article>
    </main>
  );
}
