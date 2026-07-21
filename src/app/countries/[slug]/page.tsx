import Link from "next/link";
import { actors, records } from "@/data/baseline";
import { RecordCard } from "@/components/home-experience";
import { notFound } from "next/navigation";
export default async function Country({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const actor = actors.find((a) => a.slug === slug);
  if (!actor) notFound();
  const related = records.filter((r) => r.actor === actor.name);
  return (
    <main className="module-page">
      <p className="eyebrow">GOVERNANCE PATHWAY · {actor.orientation}</p>
      <h1>{actor.name}</h1>
      <p className="lede">{actor.nameEn}</p>
      <p className="notice">
        {actor.summary} 主要机制：{actor.mechanism}（{actor.year}）。
      </p>
      <h2>本地历史基线记录</h2>
      <div className="record-grid">
        {related.length ? (
          related.map((r) => <RecordCard key={r.id} record={r} />)
        ) : (
          <p className="empty-state">
            当前没有可展示的已核验本地记录；完整国家档案将在后续阶段补充。
          </p>
        )}
      </div>
      <Link className="text-link" href="/countries">
        返回国家与地区 →
      </Link>
    </main>
  );
}
