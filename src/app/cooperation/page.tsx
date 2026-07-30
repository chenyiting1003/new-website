import { relationships } from "@/data/baseline";
import Link from "next/link";
export default function Cooperation() {
  return (
    <main className="module-page">
      <p className="eyebrow">COOPERATION & COMPETITION</p>
      <h1>全球合作与竞争</h1>
      <p className="lede">
        以本地历史基线中的公开文件为依据，展示制度关系入口。
      </p>
      <p className="notice">
        关系预览不主张未被来源支持的因果关系；完整筛选与关系网络将在后续阶段完成。
      </p>
      <div className="relationship-grid">
        {relationships.map((r) => (
          <article key={`${r.from}-${r.to}`}>
            <p className="metadata">{r.type}</p>
            <h2>
              {r.from} → {r.to}
            </h2>
            <p>{r.note}</p>
            <small>关联来源：{r.evidence}</small>
          </article>
        ))}
      </div>
      <Link className="text-link" href="/">
        返回首页 →
      </Link>
    </main>
  );
}
