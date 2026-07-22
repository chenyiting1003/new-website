"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Actor, BaselineRecord } from "@/data/baseline";

export function Timeline({
  periods,
  records,
}: {
  periods: { slug: string; years: string; title: string; feature: string }[];
  records: BaselineRecord[];
}) {
  const [selected, setSelected] = useState(periods[0].slug);
  const visible = records.filter((r) => r.period === selected);
  return (
    <section
      className="section timeline-section"
      aria-labelledby="timeline-title"
    >
      <div className="section-heading">
        <p className="eyebrow">HISTORICAL BASELINE</p>
        <h2 id="timeline-title">全球 AI 治理的制度演进</h2>
        <p>从伦理原则扩散到法律实施与治理路径分化。</p>
      </div>
      <div className="timeline-tabs" role="tablist" aria-label="历史阶段">
        {periods.map((p) => (
          <button
            key={p.slug}
            role="tab"
            aria-selected={selected === p.slug}
            className={selected === p.slug ? "active" : ""}
            onClick={() => setSelected(p.slug)}
          >
            <span>{p.years}</span>
            <strong>{p.title}</strong>
            <small>
              {records.filter((r) => r.period === p.slug).length} 条记录
            </small>
          </button>
        ))}
      </div>
      {periods
        .filter((p) => p.slug === selected)
        .map((p) => (
          <div className="timeline-detail" key={p.slug}>
            <p>{p.feature}</p>
            <div className="record-grid">
              {visible.length ? (
                visible.map((record) => (
                  <RecordCard key={record.id} record={record} />
                ))
              ) : (
                <p className="empty-state">
                  这一阶段的本地基线记录仍在整理中。
                </p>
              )}
            </div>
          </div>
        ))}
    </section>
  );
}
export function RecordCard({ record }: { record: BaselineRecord }) {
  return (
    <article className="record-card">
      <p className="metadata">
        {record.kind} · {record.legalStatus}
      </p>
      <h3>{record.titleZh ?? record.title}</h3>
      {record.titleZh && <p className="original-title">{record.title}</p>}
      <p>
        {record.issuer} · {record.actor} · {record.date}
      </p>
      <span className="verification">{record.verification}</span>
      <Link href={`/policies/${record.id}`}>
        查看记录 <span aria-hidden>→</span>
      </Link>
    </article>
  );
}
const coordinates: Record<string, [number, number]> = {
  china: [116, 40],
  "hong-kong": [114, 22],
  macao: [113.5, 22.2],
  "united-states": [-77, 39],
  "european-union": [4, 50],
  "united-kingdom": [-1, 52],
  japan: [139, 36],
  "south-korea": [127, 37],
  singapore: [104, 1],
  india: [77, 28],
  canada: [-75, 45],
  australia: [151, -34],
  asean: [101, 3],
  "african-union": [38, 9],
  "united-nations": [-74, 41],
  oecd: [2, 49],
  "council-of-europe": [7, 49],
  taiwan: [121, 23.7],
};
const landPolygons: number[][][] = [
  [
    [-168, 72],
    [-145, 70],
    [-125, 55],
    [-105, 50],
    [-98, 25],
    [-82, 12],
    [-76, 25],
    [-58, 48],
    [-60, 60],
    [-95, 75],
    [-135, 78],
    [-168, 72],
  ],
  [
    [-81, 12],
    [-70, 5],
    [-64, -18],
    [-55, -35],
    [-60, -54],
    [-74, -52],
    [-80, -20],
    [-81, 12],
  ],
  [
    [-12, 72],
    [25, 72],
    [55, 58],
    [44, 42],
    [25, 35],
    [12, 43],
    [-8, 38],
    [-12, 72],
  ],
  [
    [-18, 35],
    [10, 35],
    [35, 28],
    [44, 10],
    [35, -35],
    [15, -35],
    [-5, 5],
    [-18, 35],
  ],
  [
    [40, 72],
    [100, 74],
    [145, 55],
    [150, 35],
    [115, 8],
    [75, 15],
    [45, 35],
    [40, 72],
  ],
  [
    [112, -12],
    [154, -12],
    [153, -40],
    [120, -43],
    [112, -12],
  ],
];
const project = ([longitude, latitude]: [number, number]) =>
  [(longitude + 180) / 3.6, (90 - latitude) / 1.8] as const;
const pathFor = (ring: number[][]) =>
  ring
    .map(
      ([lon, lat], i) =>
        `${i ? "L" : "M"}${project([lon, lat] as [number, number]).join(" ")}`,
    )
    .join(" ") + "Z";
export function WorldMap({ actors }: { actors: Actor[] }) {
  const [selected, setSelected] = useState<Actor | null>(actors[0]);
  useEffect(() => {
    const close = (event: KeyboardEvent) =>
      event.key === "Escape" && setSelected(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  return (
    <section className="section map-section" aria-labelledby="map-title">
      <div className="section-heading">
        <p className="eyebrow">GOVERNANCE PATHWAYS</p>
        <h2 id="map-title">国家与地区的治理路径</h2>
        <p>
          比较不同司法辖区如何在监管约束、创新促进与国际协调之间形成不同组合。
        </p>
      </div>
      <div className="map-layout">
        <div
          className="dot-map"
          role="group"
          aria-label="国家与地区治理路径地图"
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <clipPath id="land-clip">
                {landPolygons.map((polygon, i) => (
                  <path key={i} d={pathFor(polygon)} />
                ))}
              </clipPath>
            </defs>
            <g clipPath="url(#land-clip)" aria-hidden="true">
              {Array.from({ length: 900 }, (_, i) => (
                <circle
                  key={i}
                  cx={(i % 45) * 2.25}
                  cy={Math.floor(i / 45) * 5 + 5}
                  r=".42"
                  className="map-dot"
                />
              ))}
            </g>
            {actors.map((a) => {
              const [x, y] = project(coordinates[a.slug]);
              return (
                <g key={a.slug} transform={`translate(${x} ${y})`}>
                  <foreignObject x="-8" y="-8" width="16" height="16">
                    <button
                      className={`map-node ${a.orientation}`}
                      onFocus={() => setSelected(a)}
                      onClick={() => setSelected(a)}
                      aria-label={`${a.name}：${a.orientation}`}
                    >
                      <span className="visible-node" />
                      <span className="hit-area" />
                    </button>
                  </foreignObject>
                </g>
              );
            })}
          </svg>
        </div>
        <ActorCard actor={selected} onClose={() => setSelected(null)} />
      </div>
      <div className="orientation-legend">
        <span>
          <i className="regulatory" />
          监管导向
        </span>
        <span>
          <i className="innovation_led" />
          创新导向
        </span>
        <span>
          <i className="international_coordination" />
          国际协调
        </span>
        <span>
          <i className="hybrid" />
          混合路径
        </span>
      </div>
      <Link className="text-link" href="/countries">
        浏览国家与地区 <span aria-hidden>→</span>
      </Link>
    </section>
  );
}
function ActorCard({
  actor,
  onClose,
}: {
  actor: Actor | null;
  onClose: () => void;
}) {
  if (!actor)
    return (
      <div className="actor-card empty-state">选择地图节点以查看治理路径。</div>
    );
  const labels = {
    regulatory: "监管导向",
    innovation_led: "创新导向",
    international_coordination: "国际协调",
    hybrid: "混合路径",
  };
  return (
    <aside className="actor-card" aria-live="polite">
      <button className="close" onClick={onClose} aria-label="关闭信息卡">
        ×
      </button>
      <p className="metadata">{labels[actor.orientation]}</p>
      <h3>{actor.name}</h3>
      <p className="original-title">{actor.nameEn}</p>
      <p>{actor.summary}</p>
      <dl>
        <div>
          <dt>主要机制</dt>
          <dd>{actor.mechanism}</dd>
        </div>
        <div>
          <dt>关键年份</dt>
          <dd>{actor.year}</dd>
        </div>
      </dl>
      {actor.slug === "taiwan" && (
        <a
          className="button small"
          href="https://moda.gov.tw/major-policies/ai/governance/1785"
          target="_blank"
          rel="noopener noreferrer"
        >
          官方治理网站 ↗
        </a>
      )}
      <Link className="button small" href={`/countries/${actor.slug}`}>
        查看详情
      </Link>
    </aside>
  );
}
