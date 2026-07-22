import Link from "next/link";
import {
  baselineIssue,
  periods,
  records,
  relationships,
} from "@/data/baseline";
import { RecordCard } from "@/components/home-experience";
import { notFound } from "next/navigation";
export default async function Issue({
  params,
}: {
  params: Promise<{ issueSlug: string }>;
}) {
  const { issueSlug } = await params;
  if (issueSlug !== baselineIssue.slug) notFound();
  const research = records.filter((r) => r.kind === "学术研究");
  return (
    <main className="module-page issue-detail">
      <p className="eyebrow">PUBLISHED · HISTORICAL BASELINE · 2016—2026</p>
      <h1>{baselineIssue.title}</h1>
      <p className="lede">
        不是“本周新增”；本特刊仅组织当前本地、已核验的历史基线记录。
      </p>
      <section>
        <h2>核心判断</h2>
        <ol>
          {baselineIssue.insights.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ol>
      </section>
      <section>
        <h2>历史阶段</h2>
        <div className="period-list">
          {periods.map((p) => (
            <article key={p.slug}>
              <strong>
                {p.years}｜{p.title}
              </strong>
              <p>{p.feature}</p>
            </article>
          ))}
        </div>
      </section>
      <section>
        <h2>重点政策文件</h2>
        <div className="record-grid">
          {records
            .filter((r) => r.kind !== "学术研究")
            .map((r) => (
              <RecordCard key={r.id} record={r} />
            ))}
        </div>
      </section>
      <section>
        <h2>国际合作机制</h2>
        <div className="relationship-grid">
          {relationships.map((r) => (
            <article key={`${r.from}-${r.to}`}>
              <h3>
                {r.from} → {r.to}
              </h3>
              <p>{r.note}</p>
              <small>关联来源：{r.evidence}</small>
            </article>
          ))}
        </div>
      </section>
      <section>
        <h2>关键学术研究</h2>
        <div className="record-grid">
          {research.map((r) => (
            <RecordCard key={r.id} record={r} />
          ))}
        </div>
      </section>
      <section>
        <h2>检索范围与局限</h2>
        <p className="notice">
          本期仅使用当前代码库中的本地历史基线，未声称其覆盖所有全球政策、关系或学术研究。完整检索、数据库连接与每周增量将在后续阶段完成。
        </p>
      </section>
      <Link className="text-link" href="/weekly">
        返回周报与特刊 →
      </Link>
    </main>
  );
}
