import { RuleRunner } from "../../../domain/rule-runner";
import { Rule, Rules } from "../../../domain/rules/rule";
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
import { ArtichetteRule } from "../../../domain/rules/level-2/artichette-rule";
import { ArtichetteRuleResolver } from "@/store/current-game/resolvers/artichette-rule-resolver";
import { VerdierRule } from "../../../domain/rules/level-3/verdier-rule";

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
export const artichetteRuleResolver = new ArtichetteRuleResolver();
export const verdierRuleResolver = new VerdierRuleResolver(); // TODO: create this and continue!

export const BASIC_RULE_NAMES: Array<Rules> = [
  Rules.CUL_DE_CHOUETTE,
  Rules.SUITE,
  Rules.CHOUETTE_VELUTE,
  Rules.VELUTE,
  Rules.CHOUETTE,
  Rules.NEANT,
  Rules.GRELOTTINE,
  Rules.BEVUE,
];

export const ALL_RULES_ORDERED: Array<{ name: Rules; rule: Rule }> = [
  { name: Rules.BEVUE, rule: new BevueRule() },
  {
    name: Rules.GRELOTTINE,
    rule: new GrelottineRule(grelottineRuleResolver),
  },
  { name: Rules.CIVET, rule: new CivetRule(civetRuleResolver) },
  { name: Rules.VERDIER, rule: new VerdierRule(verdierRuleResolver) },
  { name: Rules.CUL_DE_CHOUETTE, rule: new CulDeChouetteRule() },
  { name: Rules.SUITE, rule: new SuiteRule(suiteRuleResolver) },
  {
    name: Rules.CHOUETTE_VELUTE,
    rule: new ChouetteVeluteRule(chouetteVeluteRuleResolver),
  },
  { name: Rules.VELUTE, rule: new VeluteRule() },
  { name: Rules.BLEU_ROUGE, rule: new BleuRougeRule(bleuRougeRuleResolver) },
  { name: Rules.ARTICHETTE, rule: new ArtichetteRule(artichetteRuleResolver) },
  {
    name: Rules.ATTRAPE_OISEAU,
    rule: new AttrapeOiseauRule(siropRuleResolver),
  },
  { name: Rules.SIROP, rule: new SirotageRule(siropRuleResolver) },
  { name: Rules.CHOUETTE, rule: new ChouetteRule() },
  {
    name: Rules.SOUFFLETTE,
    rule: new SouffletteRule(souffletteRuleResolver),
  },
  { name: Rules.NEANT, rule: new NeantRule() },
];
