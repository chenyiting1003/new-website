"use client";
import { useState } from "react";
import nodes from "@/data/network/network-nodes.json";
import edges from "@/data/network/network-edges.json";
export function NetworkPreview() {
  const [selected, setSelected] = useState<string | null>(null);
  const active = edges.find((e) => e.id === selected);
  const node = nodes.find((n) => n.id === selected);
  const adjacent = (id: string) =>
    edges.some((e) => e.source === id || e.target === id);
  return (
    <div className="network-wrap">
      <svg
        className="network"
        viewBox="0 0 100 100"
        role="img"
        aria-label="已核验国际关系网络：节点和连线均基于关联来源证据"
      >
        <title>已核验关系网络</title>
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
              tabIndex={0}
              role="button"
              aria-label={`${a.label} 至 ${b.label}：${e.summary}`}
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
            tabIndex={0}
            role="button"
            aria-label={n.label}
          >
            <circle r="4" />
            <text y="8">{n.label}</text>
          </g>
        ))}
      </svg>
      <div className="network-detail" aria-live="polite">
        {active ? (
          <>
            <strong>{active.type}</strong>
            <p>{active.summary}</p>
            <small>证据：{active.evidence}</small>
          </>
        ) : node ? (
          <>
            <strong>{node.label}</strong>
            <p>已突出与该节点相邻的已核验关系。</p>
          </>
        ) : (
          <p>选择节点或连线查看关系与证据。</p>
        )}
      </div>
      <details>
        <summary>以列表查看关系</summary>
        <ul>
          {edges.map((e) => (
            <li key={e.id}>
              {e.summary}（证据：{e.evidence}）
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
