import { weeklyBrief20260727 as b } from "@/data/weekly/briefs";
const section = (title: string, items: string[]) => (
  <section>
    <h2>{title}</h2>
    <ul>
      {items.map((v) => (
        <li key={v}>{v}</li>
      ))}
    </ul>
  </section>
);
export function WeeklyBriefPage() {
  const reads = [
    ...b.recommendedReading.officialPolicy,
    ...b.recommendedReading.institutionalResearch,
    ...b.recommendedReading.academicLiterature,
  ];
  return (
    <main className="module-page issue-detail">
      <p className="eyebrow">PUBLISHED · {b.issueDate}</p>
      <h1>{b.title}</h1>
      <p className="lede">
        {b.subtitle} · 覆盖 {b.coverageStart}—{b.coverageEnd}
      </p>
      <section>
        <h2>本期核心变化</h2>
        {b.coreChanges.map((i) => (
          <article className="issue-card" key={i.id} tabIndex={0}>
            <p className="metadata">
              {i.updateKind} · {i.legalStatus}
            </p>
            <h3>{i.titleZh}</h3>
            <p>
              {i.actors.join("、")} · {i.governanceLevel}
            </p>
            <p>{i.summary}</p>
            <strong>为何重要</strong>
            <p>{i.significance}</p>
            <a href={i.sourceUrl} target="_blank" rel="noopener noreferrer">
              {i.sourceLabel} ↗
            </a>
          </article>
        ))}
      </section>
      {section("治理与监管", b.governanceAndRegulation)}
      {section("国际竞争与合作", b.internationalCompetitionAndCooperation)}
      {section("研发伦理与风险治理", b.ethicsAndRiskGovernance)}
      {section("重要学术与机构研究", b.researchHighlights)}
      {section("比较与趋势", [...b.comparisonFacts, ...b.analyticalInferences])}
      <section>
        <h2>建议形成的研究问题</h2>
        <ul>
          {b.researchQuestions.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ul>
      </section>
      <section>
        <h2>推荐深读</h2>
        <ul>
          {reads.map((v) => (
            <li key={v.label}>
              {v.url ? (
                <a href={v.url} target="_blank" rel="noopener noreferrer">
                  {v.label} ↗
                </a>
              ) : (
                <span>{v.label}（原文未提供稳定链接）</span>
              )}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>APA 7参考文献建议</h2>
        <ol>
          {b.apaReferences.map((v) => (
            <li key={v.url}>
              <a href={v.url} target="_blank" rel="noopener noreferrer">
                {v.text} ↗
              </a>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
