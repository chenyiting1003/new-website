export type CandidateDecision =
  | "duplicate_exact"
  | "version_update"
  | "possible_duplicate"
  | "missing_verified"
  | "missing_unverified"
  | "excluded_non_policy";
export interface PolicyCandidate {
  id: string;
  jurisdiction: string;
  year: number;
  titleZh: string;
  titleOriginal?: string;
  normalizedTitle: string;
  issuingBody?: string;
  documentType: string;
  legalStatus: string;
  version?: string;
  sourceUrl?: string;
  normalizedUrl?: string;
  sourceQuality: "official_primary" | "missing";
  decision: CandidateDecision;
  reason: string;
  reviewStatus: "pending_review" | "manual_review" | "excluded";
  existingRecordId?: string;
}
export const normalizePolicyTitle = (value: string) =>
  value
    .replace(/[《》]/g, "")
    .replace(/artificial intelligence/gi, "ai")
    .replace(/人工智能/g, "ai")
    .replace(/[\s—–-]+/g, "")
    .toLowerCase();
export const normalizePolicyUrl = (value: string) => {
  const url = new URL(value);
  [...url.searchParams.keys()]
    .filter((k) => /^utm_|^(fbclid|gclid)$/i.test(k))
    .forEach((k) => url.searchParams.delete(k));
  url.hash = "";
  return url.toString();
};
const verified = [
  [
    "china-ai-plan",
    "中国内地",
    2017,
    "新一代人工智能发展规划",
    "国务院",
    "policy_plan",
    "adopted",
    "https://www.gov.cn/zhengce/content/2017-07/20/content_5211996.htm",
  ],
  [
    "china-governance-principles",
    "中国内地",
    2019,
    "新一代人工智能治理原则——发展负责任的人工智能",
    "国家新一代人工智能治理专业委员会",
    "governance_principles",
    "non_binding",
    "https://www.most.gov.cn/kjbgz/201906/t20190617_147107.html",
  ],
  [
    "china-deep-synthesis",
    "中国内地",
    2022,
    "互联网信息服务深度合成管理规定",
    "国家互联网信息办公室等",
    "regulation",
    "binding",
    "https://www.cac.gov.cn/2022-12/11/c_1672221949354811.htm",
  ],
  [
    "china-generative-ai",
    "中国内地",
    2023,
    "生成式人工智能服务管理暂行办法",
    "国家互联网信息办公室等",
    "interim_measures",
    "binding",
    "https://www.cac.gov.cn/2023-07/13/c_1690898327029107.htm",
  ],
  [
    "china-genai-security",
    "中国内地",
    2024,
    "生成式人工智能服务安全基本要求",
    "全国网络安全标准化技术委员会",
    "technical_standard",
    "standard",
    "https://std.samr.gov.cn/gb/search/gbDetailed?id=19BC8A952E4584E8E06397BE0A0AA28D",
  ],
  [
    "china-ai-security-1",
    "中国内地",
    2024,
    "人工智能安全治理框架1.0",
    "国家互联网信息办公室相关机构",
    "framework",
    "non_binding",
    "https://www.cac.gov.cn/2024-09/09/c_1727567886199789.htm",
  ],
  [
    "china-action-plan",
    "中国内地",
    2025,
    "全球人工智能治理行动计划",
    "中华人民共和国外交部",
    "international_initiative",
    "non_binding",
    "https://www.mfa.gov.cn/zyxw/202507/t20250726_11677803.shtml",
  ],
  [
    "hk-ethical-ai",
    "中国香港",
    2021,
    "人工智能伦理框架",
    "数字政策办公室",
    "framework",
    "non_binding",
    "https://www.digitalpolicy.gov.hk/en/our_work/data_governance/policies_standards/ethical_ai_framework/",
  ],
  [
    "hk-privacy-ai",
    "中国香港",
    2024,
    "人工智能：个人资料保护模范框架",
    "香港个人资料私隐专员公署",
    "framework",
    "non_binding",
    "https://www.pcpd.org.hk/english/resources_centre/publications/files/ai_protection_framework.pdf",
  ],
  [
    "hk-generative-guideline",
    "中国香港",
    2025,
    "香港生成式人工智能技术及应用指引",
    "数字政策办公室",
    "guideline",
    "non_binding",
    "https://www.digitalpolicy.gov.hk/tc/our_work/data_governance/policies_standards/ethical_ai_framework/doc/HK_Generative_AI_Technical_and_Application_Guideline_tc.pdf",
  ],
  [
    "us-algorithmic-accountability",
    "美国",
    2022,
    "2022年算法问责法案",
    "U.S. Congress",
    "bill",
    "legislative_proposal",
    "https://www.congress.gov/bill/117th-congress/senate-bill/3572",
  ],
  [
    "us-adppa",
    "美国",
    2022,
    "美国数据隐私和保护法案",
    "U.S. Congress",
    "bill",
    "legislative_proposal",
    "https://www.congress.gov/bill/117th-congress/house-bill/8152",
  ],
  [
    "nist-genai-profile",
    "美国",
    2024,
    "生成式人工智能风险管理框架描述文件",
    "NIST",
    "voluntary_framework",
    "voluntary_framework",
    "https://www.nist.gov/itl/ai-risk-management-framework",
  ],
  [
    "sg-genai-framework",
    "新加坡",
    2024,
    "Model AI Governance Framework for Generative AI: Fostering a Trusted Ecosystem",
    "AI Verify Foundation",
    "framework",
    "voluntary_framework",
    "https://aiverifyfoundation.sg/wp-content/uploads/2024/05/Model-AI-Governance-Framework-for-Generative-AI-May-2024-1-1.pdf",
  ],
  [
    "sg-ai-risk-consultation",
    "新加坡",
    2025,
    "Consultation Paper on Guidelines on Artificial Intelligence Risk Management",
    "Monetary Authority of Singapore",
    "consultation",
    "public_consultation",
    "https://www.mas.gov.sg/publications/consultations/2025/consultation-paper-on-guidelines-on-artificial-intelligence-risk-management",
  ],
  [
    "sg-agentic-framework",
    "新加坡",
    2026,
    "Model AI Governance Framework for Agentic AI",
    "IMDA",
    "framework",
    "voluntary_framework",
    "https://www.imda.gov.sg/-/media/imda/files/about/emerging-tech-and-research/artificial-intelligence/mgf-for-agentic-ai.pdf",
  ],
] as const;
export const pendingPolicyCandidates: PolicyCandidate[] = verified.map(
  ([
    id,
    jurisdiction,
    year,
    titleZh,
    issuingBody,
    documentType,
    legalStatus,
    sourceUrl,
  ]) => ({
    id,
    jurisdiction,
    year,
    titleZh,
    normalizedTitle: normalizePolicyTitle(titleZh),
    issuingBody,
    documentType,
    legalStatus,
    sourceUrl,
    normalizedUrl: normalizePolicyUrl(sourceUrl),
    sourceQuality: "official_primary",
    decision: "missing_verified",
    reason: "现有正式 fixtures 中无相同规范化标题或官方URL",
    reviewStatus: "pending_review",
  }),
);
export type CandidateReviewState = "pending_review" | "approved" | "rejected";
export interface ApprovedPolicyRecord {
  id: string;
  slug: string;
  titleZh: string;
  jurisdiction: string;
  issuingBody?: string;
  year: number;
  documentType: string;
  legalStatus: string;
  sourceUrl: string;
  verificationStatus: "verified_primary";
  reviewStatus: "approved";
}
export const approvePolicyCandidate = (
  candidate: PolicyCandidate,
): ApprovedPolicyRecord => {
  if (
    candidate.decision !== "missing_verified" ||
    candidate.reviewStatus !== "pending_review" ||
    !candidate.sourceUrl
  )
    throw new Error("Only source-backed pending candidates can be approved");
  return {
    id: `policy-${candidate.id}`,
    slug: candidate.id,
    titleZh: candidate.titleZh,
    jurisdiction: candidate.jurisdiction,
    issuingBody: candidate.issuingBody,
    year: candidate.year,
    documentType: candidate.documentType,
    legalStatus: candidate.legalStatus,
    sourceUrl: candidate.sourceUrl,
    verificationStatus: "verified_primary",
    reviewStatus: "approved",
  };
};
