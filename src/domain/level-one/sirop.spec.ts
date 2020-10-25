import { BidType, isBidValid } from "@/domain/level-one/sirop";

describe("isBidValid", () => {
  test("Bid Couche-sirop ==> invalid", () => {
    expect(isBidValid(0, BidType.COUCHE_SIROP, 0)).toBe(false);
  });

  test("Bid File-sirop ==> invalid", () => {
    expect(isBidValid(0, BidType.FILE_SIROP, 0)).toBe(false);
  });

  test("Chouette 6 | Bid Linotte | Die 4 ==> invalid bid", () => {
    expect(isBidValid(6, BidType.LINOTTE, 4)).toBe(false);
  });

  test("Chouette 6 | Bid Beau-sirop | Die 4 ==> invalid bid", () => {
    expect(isBidValid(6, BidType.BEAU_SIROP, 4)).toBe(false);
  });

  test("Chouette 6 | Bid Beau-sirop | Die 6 ==> valid bid", () => {
    expect(isBidValid(6, BidType.BEAU_SIROP, 6)).toBe(true);
  });

  test("Chouette not 4 | Bid Mouette | Die 4 ==> valid bid", () => {
    expect(isBidValid(6, BidType.MOUETTE, 4)).toBe(true);
  });
});
