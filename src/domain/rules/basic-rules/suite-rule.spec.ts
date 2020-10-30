import { SuiteRule } from "@/domain/rules/basic-rules/suite-rule";

describe("isApplicableToDiceRoll", () => {
  it("returns true if dice follows each others", () => {
    const rule = new SuiteRule();

    expect(rule.isApplicableToDiceRoll([1, 3, 2])).toBe(true);
  });

  it("returns false dice don't follow each other", () => {
    const rule = new SuiteRule();

    expect(rule.isApplicableToDiceRoll([1, 3, 6])).toBe(false);
  });
});
