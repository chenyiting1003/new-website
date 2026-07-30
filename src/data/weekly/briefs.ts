export type WeeklyBriefStatus =
  "draft" | "pending_review" | "needs_revision" | "approved" | "published";
export type UpdateKind =
  "new" | "updated" | "implementation" | "enforcement" | "analysis";
export type SourceCategory =
  | "official_policy"
  | "international_organization"
  | "research_institute"
  | "academic_literature";
export type LegalStatus =
  | "binding_in_force"
  | "adopted_not_in_force"
  | "draft"
  | "public_consultation"
  | "voluntary_framework"
  | "non_binding_statement"
  | "research_output"
  | "unknown";
export interface WeeklyBriefItem {
  id: string;
  slug: string;
  titleZh: string;
  actors: string[];
  jurisdictions: string[];
  governanceLevel: string;
  themes: string[];
  updateKind: UpdateKind;
  sourceCategory: SourceCategory;
  documentType: string;
  legalStatus: LegalStatus;
  publicationDate?: string;
  eventDate?: string;
  effectiveDate?: string;
  summary: string;
  significance: string;
  researchRelation?: string;
  controversyNote?: string;
  sourceUrl: string;
  sourceLabel: string;
  verificationStatus: "verified" | "partially_verified";
  recordId?: string;
  actorIds?: string[];
  countryIds?: string[];
  relationEvidenceIds?: string[];
  academicRecordId?: string;
}
const item = (
  id: string,
  titleZh: string,
  actors: string[],
  updateKind: UpdateKind,
  legalStatus: LegalStatus,
  date: string,
  summary: string,
  significance: string,
  sourceUrl: string,
  sourceLabel: string,
  verificationStatus: "verified" | "partially_verified" = "verified",
): WeeklyBriefItem => ({
  id,
  slug: id,
  titleZh,
  actors,
  jurisdictions: actors,
  governanceLevel: "国家或多边治理",
  themes: ["治理与监管"],
  updateKind,
  sourceCategory: sourceLabel.includes("联合国")
    ? "international_organization"
    : "official_policy",
  documentType: "政策或治理文件",
  legalStatus,
  publicationDate: date,
  summary,
  significance,
  sourceUrl,
  sourceLabel,
  verificationStatus,
});
export const weeklyBrief20260727 = {
  id: "weekly-2026-07-27",
  slug: "2026-07-27",
  issueDate: "2026-07-27",
  title: "AI治理政策周报",
  subtitle: "历史基线之后的首期增量周报",
  coverageStart: "2026-06-27",
  coverageEnd: "2026-07-27",
  status: "published" as WeeklyBriefStatus,
  coreChanges: [
    item(
      "un-dialogue",
      "联合国启动首届全球 AI 治理对话并建立科学评估机制",
      ["联合国"],
      "new",
      "non_binding_statement",
      "2026-07-01",
      "建立科学评估—政府间对话—能力建设的周期性安排。",
      "联合国 AI 治理由原则倡议转向周期性制度安排。",
      "https://www.un.org/independent-international-scientific-panel-ai/en/preliminary-report",
      "联合国科学小组初步报告",
      "partially_verified",
    ),
    item(
      "china-anthropomorphic-ai",
      "中国《人工智能拟人化互动服务管理暂行办法》生效",
      ["中国国家网信办等五部门"],
      "implementation",
      "binding_in_force",
      "2026-04-10",
      "规则针对陪伴、情感互动等拟人化 AI 服务。",
      "生成式 AI 规制进一步按应用形态和社会风险细分。",
      "https://www.cac.gov.cn/2026-04/10/c_1777558395023172.htm",
      "国家网信办",
    ),
    item(
      "eu-ai-omnibus",
      "欧盟通过 AI Act 简化修订并调整实施时间表",
      ["欧盟理事会", "欧洲议会"],
      "updated",
      "adopted_not_in_force",
      "2026-06-29",
      "推迟部分高风险系统规则并增加特定禁止规定。",
      "反映标准准备与竞争力压力下的实施调整。",
      "https://skribi.consilium.europa.eu/en/press/press-releases/2026/06/29/artificial-intelligence-council-gives-final-green-light-to-simplify-and-streamline-rules/",
      "欧盟理事会",
    ),
    item(
      "canada-transparency",
      "加拿大启动 AI 透明度公众咨询",
      ["加拿大政府"],
      "new",
      "public_consultation",
      "2026-07-23",
      "咨询涵盖生成内容、人机交互、事故和 agent 行为记录。",
      "透明度扩展到具有行动能力的 agent。",
      "https://www.canada.ca/en/innovation-science-economic-development/news/2026/07/government-of-canada-launches-public-consultation-on-ai-transparency.html",
      "加拿大政府",
    ),
    item(
      "ftc-accuracy",
      "美国 FTC 提出 AI 输出准确性政策声明草案",
      ["Federal Trade Commission"],
      "new",
      "draft",
      "2026-07-01",
      "拟议政策声明讨论未披露目的扭曲 AI 输出的消费者保护问题。",
      "体现消费者保护与联邦—州权限路径。",
      "https://www.ftc.gov/news-events/news/press-releases/2026/07/ftc-seeks-public-comment-policy-statement-addressing-ai-accuracy",
      "FTC",
      "partially_verified",
    ),
  ],
  governanceAndRegulation: [
    "欧盟、中国、加拿大、澳大利亚、美国和英国均出现监管或咨询进展。",
  ],
  internationalCompetitionAndCooperation: [
    "联合国普遍机制与成员制合作机制并存。",
  ],
  ethicsAndRiskGovernance: ["治理重心由一次性发布前审查转向持续性治理。"],
  researchHighlights: ["联合国科学小组初步报告构成本期重要共同证据基线。"],
  comparisonFacts: [
    "欧盟继续以横向硬法和实施工具为主。",
    "加拿大、澳大利亚和英国仍大量使用咨询、标准及部门治理。",
  ],
  analyticalInferences: ["全球治理可能形成多类机制并存格局。"],
  researchQuestions: ["AI agent透明度最低应包含哪些要素？"],
  recommendedReading: {
    officialPolicy: [
      {
        label: "欧盟 AI Omnibus 最终批准说明",
        url: "https://skribi.consilium.europa.eu/en/press/press-releases/2026/06/29/artificial-intelligence-council-gives-final-green-light-to-simplify-and-streamline-rules/",
      },
      {
        label: "中国人工智能拟人化互动服务管理暂行办法",
        url: "https://www.cac.gov.cn/2026-04/10/c_1777558395023172.htm",
      },
      {
        label: "加拿大 AI 透明度咨询",
        url: "https://www.canada.ca/en/innovation-science-economic-development/news/2026/07/government-of-canada-launches-public-consultation-on-ai-transparency.html",
      },
    ],
    institutionalResearch: [
      {
        label: "UN Preliminary Report",
        url: "https://www.un.org/independent-international-scientific-panel-ai/en/preliminary-report",
      },
      { label: "Stanford HAI mental health AI" },
      { label: "AI Now Friendly Fire" },
    ],
    academicLiterature: [
      {
        label: "Hasib与Eko",
        url: "https://doi.org/10.1007/s43681-026-01219-8",
      },
      { label: "Gan等", url: "https://doi.org/10.1007/s00146-026-03207-2" },
      { label: "Ramaswamy", url: "https://doi.org/10.1007/s10846-026-02413-w" },
    ],
  },
  apaReferences: [
    {
      text: "Council of the European Union. (2026, June 29). Artificial intelligence: Council gives final green light to simplify and streamline rules [Final legislative approval].",
      url: "https://skribi.consilium.europa.eu/en/press/press-releases/2026/06/29/artificial-intelligence-council-gives-final-green-light-to-simplify-and-streamline-rules/",
    },
    {
      text: "Cyberspace Administration of China. (2026, April 10). 人工智能拟人化互动服务管理暂行办法 [已公布，2026年7月15日起施行].",
      url: "https://www.cac.gov.cn/2026-04/10/c_1777558395023172.htm",
    },
    {
      text: "Federal Trade Commission. (2026, July 1). Proposed policy statement concerning the suppression of accuracy in artificial intelligence systems [Proposed policy statement].",
      url: "https://www.ftc.gov/news-events/news/press-releases/2026/07/ftc-seeks-public-comment-policy-statement-addressing-ai-accuracy",
    },
    {
      text: "Gan, K. C. J., Wilczek-Stronczek, B., & Papasava, A. (2026). Governing the algorithm: A conceptual review of strategic AI oversight in global corporations. AI & Society.",
      url: "https://doi.org/10.1007/s00146-026-03207-2",
    },
    {
      text: "Hasib, M., & Eko, L. (2026). Beyond ethics washing: Evaluating the responsiveness of US, EU, and UN AI governance to expert warnings. AI and Ethics, 6, Article 375.",
      url: "https://doi.org/10.1007/s43681-026-01219-8",
    },
    {
      text: "Independent International Scientific Panel on Artificial Intelligence. (2026). Preliminary report: Evidence-based assessment of opportunities, risks and impacts of AI.",
      url: "https://www.un.org/independent-international-scientific-panel-ai/en/preliminary-report",
    },
    {
      text: "Innovation, Science and Economic Development Canada. (2026, July 23). Enhancing trust in artificial intelligence through increased transparency [Public consultation].",
      url: "https://www.canada.ca/en/innovation-science-economic-development/news/2026/07/government-of-canada-launches-public-consultation-on-ai-transparency.html",
    },
    {
      text: "Ramaswamy, S. (2026). Intelligence as managed autonomy: Failure, escalation, and governance for agentic AI systems. Journal of Intelligent & Robotic Systems.",
      url: "https://doi.org/10.1007/s10846-026-02413-w",
    },
  ],
  searchNotes: {
    coverage: "2026-06-27至2026-07-27",
    sourceTypes: [
      "政府与监管机构",
      "国际组织",
      "科研机构与智库",
      "期刊及arXiv",
    ],
    limitations: ["不宣称完整无遗漏"],
    unverifiedLeads: [
      "联合国对话共同主席总结未稳定定位",
      "WAICO协定完整条款未定位",
    ],
  },
  createdAt: "2026-07-27T00:00:00Z",
  updatedAt: "2026-07-27T00:00:00Z",
  publishedAt: "2026-07-27T00:00:00Z",
};
