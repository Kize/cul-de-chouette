export interface PlayableBid {
  type: BidType;
  isPlayable: boolean;
}

export interface SiropBid {
  playerName: string;
  playerBid: BidType;
  isBidValidated: boolean;
}

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

export const SIROTAGE_BID_TYPES = [
  BidType.BEAU_SIROP,
  BidType.COUCHE_SIROP,
  BidType.LINOTTE,
  BidType.ALOUETTE,
  BidType.FAUVETTE,
  BidType.MOUETTE,
  BidType.BERGERONNETTE,
  BidType.CHOUETTE,
];
export const dieValueToBidType = new Map([
  [1, BidType.LINOTTE],
  [2, BidType.ALOUETTE],
  [3, BidType.FAUVETTE],
  [4, BidType.MOUETTE],
  [5, BidType.BERGERONNETTE],
  [6, BidType.CHOUETTE],
]);
