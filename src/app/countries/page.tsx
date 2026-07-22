import { actors } from "@/data/baseline";
import Link from "next/link";
export default function Countries() {
  return (
    <main className="module-page">
      <p className="eyebrow">COUNTRIES & REGIONS</p>
      <h1>国家与地区</h1>
      <p className="lede">本地历史基线中的治理路径与相关政策入口。</p>
      <p className="notice">
        完整筛选和数据库连接将在后续阶段完成；以下内容仅展示已核验的本地基线。
      </p>
      <div className="actor-list">
        {actors.map((a) => (
          <article key={a.slug}>
            <p className="metadata">{a.orientation}</p>
            <h2>{a.name}</h2>
            <p>{a.summary}</p>
            <Link href={`/countries/${a.slug}`}>查看详情 →</Link>
          </article>
        ))}
      </div>
      <Link className="text-link" href="/">
        返回首页 →
      </Link>
    </main>
  );
}
