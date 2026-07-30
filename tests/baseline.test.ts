import { describe, expect, it } from "vitest";
import {
  actors,
  baselineIssue,
  periods,
  records,
  relationships,
  themes,
} from "@/data/baseline";
describe("historical baseline", () => {
  it("keeps every record source-backed and assigned to a defined period", () => {
    for (const record of records) {
      expect(record.sourceUrl).toMatch(/^https:\/\//);
      expect(periods.some((period) => period.slug === record.period)).toBe(
        true,
      );
    }
  });
  it("uses data-derived homepage counts", () => {
    expect(records.length).toBeGreaterThan(0);
    expect(actors.length).toBe(18);
    expect(relationships.length).toBeGreaterThan(0);
    expect(
      records.filter((record) => record.kind === "学术研究").length,
    ).toBeGreaterThan(0);
  });
  it("defines the requested published baseline issue and five research themes", () => {
    expect(baselineIssue.slug).toBe("historical-baseline-2026");
    expect(themes).toHaveLength(5);
    expect(
      themes.find((theme) => theme.slug === "rd-ethics-social-risk")?.subthemes,
    ).toContain("公平与偏见");
  });
});
