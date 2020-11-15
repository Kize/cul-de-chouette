import { SiropBid } from "../../../domain/rules/level-one/sirotage-rule";
import { DieValue } from "../../../domain/rules/dice-rule";

export interface SiropForm {
  playerWhoMakeAttrapeOiseau?: string;
  bids: Array<SiropBid>;
  lastDieValue: DieValue | 0;
}
