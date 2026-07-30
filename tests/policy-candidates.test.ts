import { describe, expect, it } from "vitest";
import {
  normalizePolicyTitle,
  normalizePolicyUrl,
  pendingPolicyCandidates,
} from "@/data/baseline/policy-candidates";
describe("policy candidate diff", () => {
  it("normalizes bilingual AI titles", () =>
    expect(normalizePolicyTitle("《Artificial Intelligence Framework》")).toBe(
      normalizePolicyTitle("AI Framework"),
    ));
  it("removes tracking without changing target", () =>
    expect(normalizePolicyUrl("https://example.com/p?a=1&utm_source=x#z")).toBe(
      "https://example.com/p?a=1",
    ));
  it("keeps candidates idempotent and pending", () => {
    expect(new Set(pendingPolicyCandidates.map((x) => x.id)).size).toBe(
      pendingPolicyCandidates.length,
    );
    expect(
      pendingPolicyCandidates.every((x) => x.reviewStatus === "pending_review"),
    ).toBe(true);
  });
  it("does not promote bills or consultations", () => {
    expect(
      pendingPolicyCandidates.find((x) => x.id === "us-adppa")?.legalStatus,
    ).toBe("legislative_proposal");
    expect(
      pendingPolicyCandidates.find((x) => x.id === "sg-ai-risk-consultation")
        ?.legalStatus,
    ).toBe("public_consultation");
  });
  it("keeps year-only dates as years", () =>
    expect(
      pendingPolicyCandidates.every(
        (x) => !(x as unknown as { publicationDate?: string }).publicationDate,
      ),
    ).toBe(true));
});

import { approvePolicyCandidate } from "@/data/baseline/policy-candidates";
describe("policy approval", () => {
  it("converts a pending verified candidate into an approved record", () => {
    const result = approvePolicyCandidate(pendingPolicyCandidates[0]);
    expect(result.reviewStatus).toBe("approved");
    expect(result.id).toBe(`policy-${pendingPolicyCandidates[0].id}`);
    expect(result.sourceUrl).toMatch(/^https:/);
  });
  it("is deterministic for repeated approval", () =>
    expect(approvePolicyCandidate(pendingPolicyCandidates[0])).toEqual(
      approvePolicyCandidate(pendingPolicyCandidates[0]),
    ));
});
