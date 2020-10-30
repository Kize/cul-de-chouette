import { SouffletteRule } from "@/domain/rules/level-one/soufflette-rule";

describe("isApplicableToDiceRoll", () => {
  it("returns true if dice make a 4, 2, 1 combination", () => {
    const rule = new SouffletteRule();

    expect(rule.isApplicableToDiceRoll([1, 4, 2])).toBe(true);
  });

});
