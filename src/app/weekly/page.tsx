import Link from "next/link";
import { baselineIssue, records } from "@/data/baseline";
export default function Weekly() {
  return (
    <main className="module-page">
      <p className="eyebrow">WEEKLY BRIEFS</p>
      <h1>周报与特刊</h1>
      <p className="lede">以历史基线特刊开始，后续将接入经审核的每周增量。</p>
      <article className="issue-card">
        <p className="metadata">已发布 · 2026年7月27日</p>
        <h2>AI治理政策周报</h2>
        <p>覆盖 2026-06-27—2026-07-27 · 治理与监管 · 国际合作 · 风险治理</p>
        <Link className="button" href="/weekly/2026-07-27">
          阅读本期 →
        </Link>
      </article>
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
