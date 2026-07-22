import Link from "next/link";
import {
  actors,
  baselineIssue,
  periods,
  records,
  themes,
  relationships,
} from "@/data/baseline";
import { Timeline, WorldMap } from "@/components/home-experience";
import { NetworkPreview } from "@/components/network-preview";
export default function Home() {
  const policyCount = records.filter((r) => r.kind !== "学术研究").length,
    research = records.filter((r) => r.kind === "学术研究").length;
  return (
    <main className="home">
      <section className="hero">
        <p className="eyebrow">
          HISTORICAL BASELINE · RESEARCH READING EDITION
        </p>
        <h1>
          Mondays <i>·</i> AI治理周报
        </h1>
        <p className="lede">
          Global AI Governance Policy &amp; Research Observatory
        </p>
        <p className="intro">
          追踪全球 AI 治理的制度演进、国家路径、国际关系与学术研究。
          <br />
          历史基线与每周增量均经过来源核验和人工审核。
        </p>
        <div className="hero-actions">
          <Link className="button" href={`/weekly/${baselineIssue.slug}`}>
            阅读历史基线特刊 <span>→</span>
          </Link>
          <a className="button secondary" href="#timeline">
            浏览历史节点
          </a>
        </div>
        <dl className="stats">
          <div>
            <dt>历史记录</dt>
            <dd>{records.length}</dd>
          </div>
          <div>
            <dt>国家与地区</dt>
            <dd>{actors.length}</dd>
          </div>
          <div>
            <dt>国际关系</dt>
            <dd>{relationships.length}</dd>
          </div>
          <div>
            <dt>学术研究</dt>
            <dd>{research}</dd>
          </div>
        </dl>
      </section>
      <section className="baseline-callout">
        <div>
          <p className="eyebrow">LATEST READING</p>
          <h2>{baselineIssue.title}</h2>
          <p>
            覆盖 {baselineIssue.coverage} · {policyCount} 条政策与制度记录 ·{" "}
            {research} 条学术研究
          </p>
        </div>
        <Link className="text-link" href={`/weekly/${baselineIssue.slug}`}>
          阅读完整特刊 →
        </Link>
      </section>
      <div id="timeline">
        <Timeline periods={periods} records={records} />
      </div>
      <WorldMap actors={actors} />
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">RELATIONSHIP PREVIEW</p>
          <h2>全球合作与竞争</h2>
          <p>网络关系均基于来源证据，不代表因果关系。</p>
        </div>
        <NetworkPreview />
        <Link className="text-link" href="/cooperation">
          查看完整关系网络 →
        </Link>
      </section>
      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">RESEARCH THEMES</p>
          <h2>学术研究与分析框架</h2>
        </div>
        <div className="theme-grid">
          {themes.map((t) => {
            const count = records.filter((r) => r.theme === t.slug).length;
            return (
              <article key={t.slug}>
                <p className="metadata">{count} 条当前收录</p>
                <h3>{t.name}</h3>
                <p>{t.description}</p>
                {t.subthemes && (
                  <p className="tags">{t.subthemes.slice(0, 4).join(" · ")}…</p>
                )}
                <Link href={`/research?theme=${t.slug}`}>进入主题 →</Link>
              </article>
            );
          })}
        </div>
      </section>
      <section className="section final-issue">
        <div>
          <p className="eyebrow">HISTORICAL BASELINE ISSUE</p>
          <h2>从原则扩散到实施与分化</h2>
          <p>{baselineIssue.insights[0]}</p>
        </div>
        <Link className="button" href={`/weekly/${baselineIssue.slug}`}>
          阅读完整特刊 →
        </Link>
      </section>
    </main>
  );
}
