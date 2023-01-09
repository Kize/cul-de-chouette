import { DieValue } from "../../../domain/rule-runner/rules/dice-rule";
import { SiropBid } from "../../../domain/rule-runner/rules/level-1/sirotage-rule.types";

export interface SiropForm {
  playerWhoMakeAttrapeOiseau?: string;
  bids: Array<SiropBid>;
  lastDieValue: DieValue | 0;
}
