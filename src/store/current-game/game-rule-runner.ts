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
import { GrelottineRuleResolver } from "@/store/current-game/resolver/grelottine-rule-resolver";
import { GrelottineRule } from "../../../domain/rules/basic-rules/grelottine-rule";
import { BevueRule } from "../../../domain/rules/basic-rules/bevue-rule";

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
export const grelottineRuleResolver = new GrelottineRuleResolver();

export enum RuleName {
  CUL_DE_CHOUETTE,
  SUITE,
  CHOUETTE_VELUTE,
  VELUTE,
  ATTRAPE_OISEAU,
  SIROTAGE,
  CHOUETTE,
  NEANT,
  GRELOTTINE,
  BEVUE,
}

export const ALL_RULES_ORDERED: Array<{ name: RuleName; rule: Rule }> = [
  {
    name: RuleName.GRELOTTINE,
    rule: new GrelottineRule(grelottineRuleResolver),
  },
  { name: RuleName.BEVUE, rule: new BevueRule() },
  { name: RuleName.CUL_DE_CHOUETTE, rule: new CulDeChouetteRule() },
  { name: RuleName.SUITE, rule: new SuiteRule(suiteRuleResolver) },
  {
    name: RuleName.CHOUETTE_VELUTE,
    rule: new ChouetteVeluteRule(chouetteVeluteRuleResolver),
  },
  { name: RuleName.VELUTE, rule: new VeluteRule() },
  {
    name: RuleName.ATTRAPE_OISEAU,
    rule: new AttrapeOiseauRule(siropRuleResolver),
  },
  { name: RuleName.SIROTAGE, rule: new SirotageRule(siropRuleResolver) },
  { name: RuleName.CHOUETTE, rule: new ChouetteRule() },
  { name: RuleName.NEANT, rule: new NeantRule() },
];
