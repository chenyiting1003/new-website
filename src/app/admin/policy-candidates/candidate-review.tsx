"use client";
import { useEffect, useState } from "react";
import {
  approvePolicyCandidate,
  pendingPolicyCandidates,
  type ApprovedPolicyRecord,
  type CandidateReviewState,
} from "@/data/baseline/policy-candidates";
const STATE_KEY = "governance-policy-candidate-review-v1",
  RECORDS_KEY = "governance-approved-policy-records-v1";
export function CandidateReview() {
  const [states, setStates] = useState<Record<string, CandidateReviewState>>(
    {},
  );
  const [records, setRecords] = useState<ApprovedPolicyRecord[]>([]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setStates(JSON.parse(localStorage.getItem(STATE_KEY) ?? "{}"));
      setRecords(JSON.parse(localStorage.getItem(RECORDS_KEY) ?? "[]"));
    });
    return () => cancelAnimationFrame(frame);
  }, []);
  const update = (id: string, status: CandidateReviewState) => {
    const next = { ...states, [id]: status };
    setStates(next);
    localStorage.setItem(STATE_KEY, JSON.stringify(next));
    if (status === "approved") {
      const record = approvePolicyCandidate(
        pendingPolicyCandidates.find((x) => x.id === id)!,
      );
      const merged = [...records.filter((x) => x.id !== record.id), record];
      setRecords(merged);
      localStorage.setItem(RECORDS_KEY, JSON.stringify(merged));
    }
  };
  return (
    <>
      <div className="heading">
        <div>
          <h1>政策候选审核</h1>
          <p>
            16 条 missing_verified
            本地候选；逐条批准后进入本浏览器的正式记录集合。
          </p>
        </div>
        <span className="count">{records.length} Approved</span>
      </div>
      <p className="notice">
        本地审核演示：状态保存在当前浏览器 localStorage，不会写入远程
        Supabase；清除浏览器数据会丢失审核结果。
      </p>
      <div className="editor">
        {pendingPolicyCandidates.map((c) => {
          const status = states[c.id] ?? "pending_review";
          return (
            <article className="record-card" key={c.id}>
              <p className="metadata">
                {c.jurisdiction} · {c.year} · {status}
              </p>
              <h2>{c.titleZh}</h2>
              <dl>
                <div>
                  <dt>发布机构</dt>
                  <dd>{c.issuingBody}</dd>
                </div>
                <div>
                  <dt>文件类型</dt>
                  <dd>{c.documentType}</dd>
                </div>
                <div>
                  <dt>法律状态</dt>
                  <dd>{c.legalStatus}</dd>
                </div>
              </dl>
              <p>{c.reason}</p>
              <a href={c.sourceUrl} target="_blank" rel="noopener noreferrer">
                检查官方来源 ↗
              </a>
              <div className="actions">
                <button
                  onClick={() => update(c.id, "rejected")}
                  disabled={status === "approved"}
                >
                  不批准
                </button>
                <button
                  className="approve"
                  onClick={() => update(c.id, "approved")}
                  disabled={status === "approved"}
                >
                  {status === "approved"
                    ? "已转入正式记录"
                    : "批准并转入正式记录"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      <section>
        <h2>本地正式记录</h2>
        {records.length ? (
          <div className="record-grid">
            {records.map((r) => (
              <article className="record-card" key={r.id}>
                <p className="metadata">
                  APPROVED · {r.jurisdiction} · {r.year}
                </p>
                <h3>{r.titleZh}</h3>
                <p>
                  {r.issuingBody} · {r.legalStatus}
                </p>
                <a href={r.sourceUrl} target="_blank" rel="noopener noreferrer">
                  官方来源 ↗
                </a>
              </article>
            ))}
          </div>
        ) : (
          <p className="empty-state">尚未批准任何候选。</p>
        )}
      </section>
    </>
  );
}
