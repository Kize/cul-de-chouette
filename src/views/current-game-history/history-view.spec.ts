import { getHistoryView } from "@/views/current-game-history/history-view";
import { Player } from "../../../domain/player";
import { RuleEffectEvent } from "../../../domain/rules/rule-effect";

describe("getHistoryView", () => {
  it("returns an history view", () => {
    const players: Array<Player> = [
      {
        name: "Alban",
        history: [
          { eventId: "42", amount: 0, designation: RuleEffectEvent.BEVUE },
          {
            eventId: "12",
            amount: -25,
            designation: RuleEffectEvent.SIROP_BET_LOST,
          },
        ],
      },
      {
        name: "Jules",
        history: [
          {
            eventId: "27",
            amount: 90,
            designation: RuleEffectEvent.CUL_DE_CHOUETTE,
          },
          {
            eventId: "12",
            amount: -25,
            designation: RuleEffectEvent.SIROP_BET_LOST,
          },
        ],
      },
      {
        name: "Delphin",
        history: [
          {
            eventId: "12",
            amount: 100,
            designation: RuleEffectEvent.SIROP_WON,
          },
          {
            eventId: "12",
            amount: 25,
            designation: RuleEffectEvent.SIROP_BET_WON,
          },
        ],
      },
    ];

    const historyView = getHistoryView(["42", "27", "12"], players);

    expect(historyView).toEqual([
      {
        eventId: "42",
        playerHistories: [
          [
            {
              amount: 0,
              designation: "Bévue",
            },
          ],
          [],
          [],
        ],
      },
      {
        eventId: "27",
        playerHistories: [
          [],
          [
            {
              amount: 90,
              designation: "Cul de chouette",
            },
          ],
          [],
        ],
      },
      {
        eventId: "12",
        playerHistories: [
          [
            {
              amount: -25,
              designation: "Pari de Sirotage perdu",
            },
          ],
          [
            {
              amount: -25,
              designation: "Pari de Sirotage perdu",
            },
          ],
          [
            {
              amount: 100,
              designation: "Sirotage gagné",
            },
            {
              amount: 25,
              designation: "Pari de Sirotage gagné",
            },
          ],
        ],
      },
    ]);
  });
});
