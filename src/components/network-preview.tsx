"use client";
import { useState } from "react";
type Node = {
  id: string;
  label: string;
  x: number;
  y: number;
  kind: "actor" | "document";
};
type Edge = {
  id: string;
  source: string;
  target: string;
  type: string;
  summary: string;
  evidence: string;
};
const actors: Node[] = [
  { id: "oecd", label: "OECD", x: 15, y: 35, kind: "actor" },
  { id: "g20", label: "G20", x: 40, y: 23, kind: "actor" },
  { id: "g7", label: "G7", x: 62, y: 38, kind: "actor" },
  { id: "uk", label: "英国", x: 72, y: 17, kind: "actor" },
  { id: "korea", label: "韩国", x: 86, y: 28, kind: "actor" },
  { id: "china", label: "中国", x: 40, y: 75, kind: "actor" },
];
const actorEdges: Edge[] = [
  {
    id: "oecd-g20",
    source: "oecd",
    target: "g20",
    type: "制度衔接",
    summary: "G20 AI Principles 以 OECD AI Principles 为基础。",
    evidence: "OECD AI Principles",
  },
  {
    id: "uk-korea",
    source: "uk",
    target: "korea",
    type: "共同参与",
    summary: "英国与韩国共同推动 Seoul AI Summit。",
    evidence: "Seoul Declaration",
  },
  {
    id: "g7-uk",
    source: "g7",
    target: "uk",
    type: "共同参与",
    summary: "英国参与 G7 Hiroshima AI Process。",
    evidence: "Hiroshima AI Process",
  },
];
const documents: Node[] = [
  ...actors.filter((n) => ["oecd", "g7", "china"].includes(n.id)),
  {
    id: "oecd-principles",
    label: "OECD AI Principles",
    x: 25,
    y: 65,
    kind: "document",
  },
  {
    id: "hiroshima",
    label: "Hiroshima AI Process",
    x: 73,
    y: 70,
    kind: "document",
  },
  { id: "initiative", label: "全球AI治理倡议", x: 43, y: 90, kind: "document" },
];
const documentEdges: Edge[] = [
  {
    id: "oecd-doc",
    source: "oecd",
    target: "oecd-principles",
    type: "发布",
    summary: "OECD 发布 OECD AI Principles。",
    evidence: "OECD AI Principles",
  },
  {
    id: "g7-doc",
    source: "g7",
    target: "hiroshima",
    type: "形成框架",
    summary: "G7 形成 Hiroshima AI Process。",
    evidence: "Hiroshima AI Process",
  },
  {
    id: "china-doc",
    source: "china",
    target: "initiative",
    type: "提出",
    summary: "中国提出全球人工智能治理倡议。",
    evidence: "Global AI Governance Initiative",
  },
];
export function NetworkPreview() {
  const [view, setView] = useState("actors" as "actors" | "documents"),
    [selected, setSelected] = useState<string | null>(null);
  const nodes = view === "actors" ? actors : documents,
    edges = view === "actors" ? actorEdges : documentEdges;
  const detail = edges.find((e) => e.id === selected);
  const adjacent = (id: string) =>
    edges.some((e) => e.source === id || e.target === id);
  return (
    <div className="network-wrap">
      <div className="network-controls">
        <button
          aria-pressed={view === "actors"}
          onClick={() => {
            setView("actors");
            setSelected(null);
          }}
        >
          国家与机构
        </button>
        <button
          aria-pressed={view === "documents"}
          onClick={() => {
            setView("documents");
            setSelected(null);
          }}
        >
          制度文件
        </button>
        <button onClick={() => setSelected(null)}>重置</button>
      </div>
      <svg
        className="network"
        viewBox="0 0 100 100"
        role="img"
        aria-label={
          view === "actors" ? "国家与机构关系网络" : "制度文件关系网络"
        }
      >
        {edges.map((e) => {
          const a = nodes.find((n) => n.id === e.source)!,
            b = nodes.find((n) => n.id === e.target)!;
          return (
            <line
              key={e.id}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className={selected === e.id ? "selected-edge" : "network-edge"}
              onClick={() => setSelected(e.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(v) => v.key === "Enter" && setSelected(e.id)}
            />
          );
        })}
        {nodes.map((n) => (
          <g
            key={n.id}
            transform={`translate(${n.x} ${n.y})`}
            className={
              selected && !adjacent(n.id) && selected !== n.id ? "dim" : ""
            }
            onClick={() => setSelected(n.id)}
            role="button"
            tabIndex={0}
          >
            <circle
              className={n.kind === "document" ? "document-node" : ""}
              r={n.kind === "document" ? 6 : 4}
            />
            <text y="7">{n.label}</text>
          </g>
        ))}
      </svg>
      <div className="network-detail" aria-live="polite">
        {detail ? (
          <>
            <strong>{detail.type}</strong>
            <p>{detail.summary}</p>
            <small>证据文件：{detail.evidence}</small>
          </>
        ) : (
          <p>选择节点或边查看关系与证据。网络关系不表示未经证明的因果关系。</p>
        )}
      </div>
      <details>
        <summary>以列表查看关系</summary>
        <ul>
          {edges.map((e) => (
            <li key={e.id}>
              {e.summary}（{e.evidence}）
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
