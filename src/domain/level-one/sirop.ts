import { HistoryLineAction } from "@/domain/history";
import { DieValue } from "@/domain/dice/compute-dice-value";

export enum BidType {
  BEAU_SIROP = "Beau-sirop",
  COUCHE_SIROP = "Couche-sirop",
  FILE_SIROP = "File-sirop",
  LINOTTE = "Linotte",
  ALOUETTE = "Alouette",
  FAUVETTE = "Fauvette",
  MOUETTE = "Mouette",
  BERGERONNETTE = "Bergeronnette",
  CHOUETTE = "Chouette",
}

export interface SiropBid {
  playerName: string;
  designation: BidType;
  isBidValidated: boolean;
}

export interface SiropForm {
  attrapeOiseauPlayerName?: string;
  bids: Array<SiropBid>;
  siropDieValue: DieValue;
}

export interface SiropActionPayload {
  initialChouette: HistoryLineAction;
  isChouetteNotSirote: boolean;
  attrapeOiseauPlayerName?: string;
  bids: Array<SiropBid>;
  siropDieValue: DieValue;
}

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
