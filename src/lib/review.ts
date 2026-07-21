import { z } from "zod";

export const submissionStatuses = ["pending", "needs_revision", "approved", "rejected", "published"] as const;
export type SubmissionStatus = (typeof submissionStatuses)[number];
const transitions: Record<SubmissionStatus, SubmissionStatus[]> = { pending: ["approved", "needs_revision", "rejected"], needs_revision: ["pending"], approved: ["published"], rejected: [], published: ["published"] };
export const canTransition = (from: SubmissionStatus, to: SubmissionStatus) => transitions[from].includes(to);
export const submissionSchema = z.object({ titleOriginal: z.string().min(3), titleZh: z.string().optional(), summary: z.string().min(10), sourceUrl: z.url().refine((url) => /^https?:/.test(url)), verificationStatus: z.enum(["verified_primary", "verified_secondary", "partially_verified", "unverified"]), recordType: z.enum(["policy", "academic_article", "research_report", "working_paper", "preprint", "official_statement", "standard", "news_background"]) });
export const normalizeDoi = (value: string) => value.trim().toLowerCase().replace(/^doi:\s*/, "").replace(/^https?:\/\/(dx\.)?doi\.org\//, "").replace(/\s+/g, "");
