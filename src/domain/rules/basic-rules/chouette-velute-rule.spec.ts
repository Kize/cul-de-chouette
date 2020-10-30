import { ChouetteVeluteRule } from "@/domain/rules/basic-rules/chouette-velute-rule";

describe("isApplicableToDiceRoll", () => {
  it("returns true if two dice have the same value and those two dice sum equals the third one", () => {
    const rule = new ChouetteVeluteRule();

    expect(rule.isApplicableToDiceRoll([1, 1, 2])).toBe(true);
  });

  it("returns false otherwise", () => {
    const rule = new ChouetteVeluteRule();

    expect(rule.isApplicableToDiceRoll([2, 2, 3])).toBe(false);
  });
});
