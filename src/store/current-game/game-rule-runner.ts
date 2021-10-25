import { RuleRunner } from "../../../domain/rule-runner";
import { Rule } from "../../../domain/rules/rule";
import { SuiteRuleResolver } from "./resolvers/suite-rule-resolver";
import { ChouetteVeluteRuleResolver } from "./resolvers/chouette-velute-rule-resolver";
import { SiropRuleResolver } from "./resolvers/sirop-rule-resolver";
import { CulDeChouetteRule } from "../../../domain/rules/basic-rules/cul-de-chouette-rule";
import { SuiteRule } from "../../../domain/rules/basic-rules/suite-rule";
import { ChouetteVeluteRule } from "../../../domain/rules/basic-rules/chouette-velute-rule";
import { VeluteRule } from "../../../domain/rules/basic-rules/velute-rule";
import { AttrapeOiseauRule } from "../../../domain/rules/level-1/attrape-oiseau-rule";
import { SirotageRule } from "../../../domain/rules/level-1/sirotage-rule";
import { ChouetteRule } from "../../../domain/rules/basic-rules/chouette-rule";
import { NeantRule } from "../../../domain/rules/basic-rules/neant-rule";
import { GrelottineRuleResolver } from "./resolvers/grelottine-rule-resolver";
import { GrelottineRule } from "../../../domain/rules/basic-rules/grelottine-rule";
import { BevueRule } from "../../../domain/rules/basic-rules/bevue-rule";
import { SouffletteRule } from "../../../domain/rules/level-1/soufflette-rule";
import { SouffletteRuleResolver } from "./resolvers/soufflette-rule-resolver";
import { BleuRougeRuleResolver } from "./resolvers/bleu-rouge-rule-resolver";
import { BleuRougeRule } from "../../../domain/rules/level-3/bleu-rouge-rule";
import { CivetRule } from "../../../domain/rules/level-1/civet-rule";
import { CivetRuleResolver } from "./resolvers/civet-rule-resolver";

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
export const souffletteRuleResolver = new SouffletteRuleResolver();
export const civetRuleResolver = new CivetRuleResolver();
export const bleuRougeRuleResolver = new BleuRougeRuleResolver();

export enum RuleName {
  ATTRAPE_OISEAU,
  BEVUE,
  BLEU_ROUGE,
  CHOUETTE,
  CHOUETTE_VELUTE,
  CIVET,
  CUL_DE_CHOUETTE,
  GRELOTTINE,
  NEANT,
  SIROTAGE,
  SOUFFLETTE,
  SUITE,
  VELUTE,
}

export const BASIC_RULE_NAMES: Array<RuleName> = [
  RuleName.CUL_DE_CHOUETTE,
  RuleName.SUITE,
  RuleName.CHOUETTE_VELUTE,
  RuleName.VELUTE,
  RuleName.CHOUETTE,
  RuleName.NEANT,
  RuleName.GRELOTTINE,
  RuleName.BEVUE,
];

export const ALL_RULES_ORDERED: Array<{ name: RuleName; rule: Rule }> = [
  {
    name: RuleName.GRELOTTINE,
    rule: new GrelottineRule(grelottineRuleResolver),
  },
  { name: RuleName.CIVET, rule: new CivetRule(civetRuleResolver) },
  { name: RuleName.BEVUE, rule: new BevueRule() },
  { name: RuleName.CUL_DE_CHOUETTE, rule: new CulDeChouetteRule() },
  { name: RuleName.SUITE, rule: new SuiteRule(suiteRuleResolver) },
  {
    name: RuleName.CHOUETTE_VELUTE,
    rule: new ChouetteVeluteRule(chouetteVeluteRuleResolver),
  },
  { name: RuleName.VELUTE, rule: new VeluteRule() },
  { name: RuleName.BLEU_ROUGE, rule: new BleuRougeRule(bleuRougeRuleResolver) },
  {
    name: RuleName.ATTRAPE_OISEAU,
    rule: new AttrapeOiseauRule(siropRuleResolver),
  },
  { name: RuleName.SIROTAGE, rule: new SirotageRule(siropRuleResolver) },
  { name: RuleName.CHOUETTE, rule: new ChouetteRule() },
  {
    name: RuleName.SOUFFLETTE,
    rule: new SouffletteRule(souffletteRuleResolver),
  },
  { name: RuleName.NEANT, rule: new NeantRule() },
];
