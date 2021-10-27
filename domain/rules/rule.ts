import { RuleEffects } from "./rule-effect";
import { GameContextWrapper, UnknownGameContext } from "../game-context-event";

export interface Rule {
  name: Rules;
  isApplicableToGameContext: (context: UnknownGameContext) => boolean;
  applyRule: (
    context: GameContextWrapper
  ) => RuleEffects | Promise<RuleEffects>;
}

export enum Rules {
  BEVUE = "Bévue",
  NEANT = "Néant",
  CHOUETTE = "Chouette",
  SUITE = "Suite",
  VELUTE = "Velute",
  CUL_DE_CHOUETTE = "Cul de Chouette",
  GRELOTTINE = "Grelottine",
  CHOUETTE_VELUTE = "Chouette-Velute",
  CIVET = "Civet",
  SIROP = "Sirop",
  ATTRAPE_OISEAU = "Attrape-oiseau",
  ARTICHETTE = "Artichette",
  BLEU_ROUGE = "Bleu-Rouge",
  SOUFFLETTE = "Soufflette",
}
