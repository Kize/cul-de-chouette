import { DieValue } from "../../../domain/rules/dice-rule";
import { SiropBid } from "../../../domain/rules/level-1/sirotage-rule.types";

export interface SiropForm {
  playerWhoMakeAttrapeOiseau?: string;
  bids: Array<SiropBid>;
  lastDieValue: DieValue | 0;
}
