export type FeaturedItem = {
  id: string;
  type: "policy" | "research";
  title: string;
  summary: string;
  isPlaceholder: boolean;
};
export const featuredItems: FeaturedItem[] = [
  {
    id: "policy",
    type: "policy",
    title: "Featured policy",
    summary: "重要政策和监管文件将在审核后显示于此。",
    isPlaceholder: true,
  },
  {
    id: "research",
    type: "research",
    title: "Featured research",
    summary: "重要论文、研究报告和方法资源将在审核后显示于此。",
    isPlaceholder: true,
  },
];
export type GovernanceTool = {
  id: string;
  name: string;
  productName?: string;
  descriptionZh: string;
  url: string;
  providerType: "commercial" | "independent" | "unknown";
  accessType: "commercial" | "unknown";
  categories: string[];
  verificationStatus: "user_provided";
};
export const governanceTools: GovernanceTool[] = [
  {
    id: "aosphere",
    name: "AoSphere",
    productName: "AI Regulation & Governance Module",
    descriptionZh: "面向AI监管与治理信息检索的商业工具模块。",
    url: "https://www.aosphere.com/products/data-privacy/rulefinder-data-privacy/ai-regulation-governance-module/",
    providerType: "commercial",
    accessType: "commercial",
    categories: ["Regulatory intelligence"],
    verificationStatus: "user_provided",
  },
  {
    id: "ai-governance-online",
    name: "AI Governance Online",
    descriptionZh: "提供中文AI治理信息与相关资源的独立平台。",
    url: "https://www.ai-governance.online/cn",
    providerType: "independent",
    accessType: "unknown",
    categories: ["Governance information"],
    verificationStatus: "user_provided",
  },
  {
    id: "delight",
    name: "Delight AI",
    productName: "Trust OS",
    descriptionZh: "面向可信AI与治理工作流程的私营部门工具入口。",
    url: "https://delight.ai/trust-os",
    providerType: "commercial",
    accessType: "commercial",
    categories: ["Trust and governance operations"],
    verificationStatus: "user_provided",
  },
  {
    id: "trustai",
    name: "TrustAI",
    descriptionZh: "提供可信AI、治理或相关服务信息的平台。",
    url: "https://trustai.com.tw/",
    providerType: "unknown",
    accessType: "unknown",
    categories: ["Trustworthy AI"],
    verificationStatus: "user_provided",
  },
];
