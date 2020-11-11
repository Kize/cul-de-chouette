import {
  BidType,
  SiropBid,
} from "../../../domain/rules/level-one/sirotage-rule";
import { DieValue } from "../../../domain/rules/rule";

export interface SiropForm {
  playerWhoMakeAttrapeOiseau?: string;
  bids: Array<SiropBid>;
  lastDieValue: DieValue | 0;
}

export interface SiropActionPayload {
  isSirote: boolean;
  playerWhoMakeAttrapeOiseau?: string;
  bids: Array<SiropBid>;
  lastDieValue: DieValue;
}

// TODO DAU : use the domain rule
export function isBidValid(
  chouetteValue: DieValue,
  bidType: BidType,
  dieValue: DieValue
): boolean {
  switch (bidType) {
    case BidType.COUCHE_SIROP:
    case BidType.FILE_SIROP:
      return false;
    case BidType.BEAU_SIROP:
      return chouetteValue === dieValue;
    case BidType.LINOTTE:
      return dieValue === 1;
    case BidType.ALOUETTE:
      return dieValue === 2;
    case BidType.FAUVETTE:
      return dieValue === 3;
    case BidType.MOUETTE:
      return dieValue === 4;
    case BidType.BERGERONNETTE:
      return dieValue === 5;
    case BidType.CHOUETTE:
      return dieValue === 6;
    default:
      return false;
  }
}
