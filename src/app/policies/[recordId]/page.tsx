import Link from "next/link";
import { recordById } from "@/data/baseline";
import { notFound } from "next/navigation";
export default async function Policy({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = await params;
  const record = recordById(recordId);
  if (!record) notFound();
  return (
    <main className="module-page record-detail">
      <p className="eyebrow">HISTORICAL BASELINE RECORD</p>
      <h1>{record.titleZh ?? record.title}</h1>
      {record.titleZh && <p className="lede">{record.title}</p>}
      <p className="notice">{record.summary}</p>
      <dl className="record-metadata">
        <div>
          <dt>发布机构</dt>
          <dd>{record.issuer}</dd>
        </div>
        <div>
          <dt>治理层级</dt>
          <dd>{record.actor}</dd>
        </div>
        <div>
          <dt>文件类型</dt>
          <dd>{record.kind}</dd>
        </div>
        <div>
          <dt>法律状态</dt>
          <dd>{record.legalStatus}</dd>
        </div>
        <div>
          <dt>发布日期</dt>
          <dd>{record.date}</dd>
        </div>
        <div>
          <dt>核验状态</dt>
          <dd>{record.verification}</dd>
        </div>
      </dl>
      <a
        className="button"
        href={record.sourceUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        打开来源 ↗
      </a>
      <Link className="text-link" href="/">
        返回首页 →
      </Link>
    </main>
  );
}
