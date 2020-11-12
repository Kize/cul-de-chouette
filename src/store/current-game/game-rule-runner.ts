import { RuleRunner } from "../../../domain/rule-runner";
import { Rule } from "../../../domain/rules/rule";
import { SuiteRuleResolver } from "@/store/current-game/resolver/suite-rule-resolver";
import { ChouetteVeluteRuleResolver } from "@/store/current-game/resolver/chouette-velute-rule-resolver";
import { SiropRuleResolver } from "@/store/current-game/resolver/sirop-rule-resolver";
import { CulDeChouetteRule } from "../../../domain/rules/basic-rules/cul-de-chouette-rule";
import { SuiteRule } from "../../../domain/rules/basic-rules/suite-rule";
import { ChouetteVeluteRule } from "../../../domain/rules/basic-rules/chouette-velute-rule";
import { VeluteRule } from "../../../domain/rules/basic-rules/velute-rule";
import { AttrapeOiseauRule } from "../../../domain/rules/level-one/attrape-oiseau-rule";
import { SirotageRule } from "../../../domain/rules/level-one/sirotage-rule";
import { ChouetteRule } from "../../../domain/rules/basic-rules/chouette-rule";
import { NeantRule } from "../../../domain/rules/basic-rules/neant-rule";

class GameRuleRunner {
  private ruleRunner = new RuleRunner([]);

  setRules(rules: Array<Rule>): void {
    this.ruleRunner = new RuleRunner(rules);
  }

  getRunner(): RuleRunner {
    return this.ruleRunner;
  }
}

export const gameRuleRunner = new GameRuleRunner();

export const suiteRuleResolver = new SuiteRuleResolver();
export const chouetteVeluteRuleResolver = new ChouetteVeluteRuleResolver();
export const siropRuleResolver = new SiropRuleResolver();

export enum RuleName {
  CulDeChouette,
  Suite,
  ChouetteVelute,
  Velute,
  AttrapeOiseau,
  Sirotage,
  Chouette,
  Neant,
}

export const ALL_RULES_ORDERED: Array<{ name: RuleName; rule: Rule }> = [
  { name: RuleName.CulDeChouette, rule: new CulDeChouetteRule() },
  { name: RuleName.Suite, rule: new SuiteRule(suiteRuleResolver) },
  {
    name: RuleName.ChouetteVelute,
    rule: new ChouetteVeluteRule(chouetteVeluteRuleResolver),
  },
  { name: RuleName.Velute, rule: new VeluteRule() },
  {
    name: RuleName.AttrapeOiseau,
    rule: new AttrapeOiseauRule(siropRuleResolver),
  },
  { name: RuleName.Sirotage, rule: new SirotageRule(siropRuleResolver) },
  { name: RuleName.Chouette, rule: new ChouetteRule() },
  { name: RuleName.Neant, rule: new NeantRule() },
];
