import { weeklyBrief20260727 as b } from "@/data/weekly/briefs";
export function WeeklyBriefPage() {
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
      {[
        ["治理与监管", b.governanceAndRegulation],
        ["国际竞争与合作", b.internationalCompetitionAndCooperation],
        ["研发伦理与风险治理", b.ethicsAndRiskGovernance],
        ["重要学术与机构研究", b.researchHighlights],
        ["比较与趋势", [...b.comparisonFacts, ...b.analyticalInferences]],
        [
          "推荐深读",
          [
            ...b.recommendedReading.officialPolicy,
            ...b.recommendedReading.institutionalResearch,
            ...b.recommendedReading.academicLiterature,
          ],
        ],
        ["APA 7参考文献建议", b.apaReferences],
      ].map(([t, x]) => (
        <section key={t as string}>
          <h2>{t as string}</h2>
          <ul>
            {(x as string[]).map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </section>
      ))}
      <section>
        <h2>检索范围、限制和未核验线索</h2>
        <p>{b.searchNotes.coverage}</p>
        <ul>
          {[...b.searchNotes.limitations, ...b.searchNotes.unverifiedLeads].map(
            (v) => (
              <li key={v}>{v}</li>
            ),
          )}
        </ul>
      </section>
    </main>
  );
}
