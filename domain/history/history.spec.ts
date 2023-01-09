import { History } from "./history";
import { RuleEffectEvent } from "../rule-runner/rules/rule-effect";
import { GameLineType, GodModLineType } from "./history-line";

describe("getPlayerScore", () => {
  it("returns 0 when the player is not in the history yet", () => {
    const history = new History();

    history.events.push({
      id: "1",
      historyLines: [
        {
          designation: RuleEffectEvent.CUL_DE_CHOUETTE,
          player: { id: "d", name: "Delphin" },
          amount: 100,
        },
      ],
    });

    expect(history.getPlayerScore({ id: "a", name: "Alban" })).toBe(0);
  });

  it("returns 50 when the player has 3 scores updates, of 25, -5, 30", () => {
    const history = new History();

    history.events.push(
      {
        id: "1",
        historyLines: [
          {
            designation: RuleEffectEvent.CUL_DE_CHOUETTE,
            player: { id: "d", name: "Delphin" },
            amount: 100,
          },
        ],
      },
      {
        id: "2",
        historyLines: [
          {
            designation: GodModLineType.GOD_MOD,
            player: { id: "a", name: "Alban" },
            amount: 25,
          },
        ],
      },
      {
        id: "3",
        historyLines: [
          {
            designation: RuleEffectEvent.BEVUE,
            player: { id: "a", name: "Alban" },
            amount: -5,
          },
          {
            designation: RuleEffectEvent.GRELOTTINE_CHALLENGE_WON,
            player: { id: "a", name: "Alban" },
            amount: 30,
          },
          {
            designation: RuleEffectEvent.GRELOTTINE_CHALLENGE_LOST,
            player: { id: "d", name: "Delphin" },
            amount: -30,
          },
        ],
      }
    );

    expect(history.getPlayerScore({ id: "a", name: "Alban" })).toBe(50);
  });
});

describe("getPlayerScoreAtEvent", () => {
  it("returns 25 when called for the event 2", () => {
    const history = new History();

    history.events.push(
      {
        id: "1",
        historyLines: [
          {
            designation: RuleEffectEvent.CUL_DE_CHOUETTE,
            player: { id: "d", name: "Delphin" },
            amount: 100,
          },
        ],
      },
      {
        id: "2",
        historyLines: [
          {
            designation: GodModLineType.GOD_MOD,
            player: { id: "a", name: "Alban" },
            amount: 25,
          },
        ],
      },
      {
        id: "3",
        historyLines: [
          {
            designation: RuleEffectEvent.BEVUE,
            player: { id: "a", name: "Alban" },
            amount: -5,
          },
        ],
      }
    );

    expect(history.getPlayerScoreAtEvent({ id: "a", name: "Alban" }, "2")).toBe(
      25
    );
  });
});

describe("getNumberOfTurnsPlayed", () => {
  it("returns 0 when the player has not played yet", () => {
    const history = new History();

    history.events.push({
      id: "1",
      historyLines: [
        {
          designation: GameLineType.PLAY_TURN,
          player: { id: "3", name: "Jules" },
          amount: 0,
        },
      ],
    });

    expect(history.getNumberOfTurnsPlayed({ id: "a", name: "Alban" })).toBe(0);
  });
  it("returns 2 when the player has played 2 turns", () => {
    const history = new History();

    history.events.push(
      {
        id: "1",
        historyLines: [
          {
            designation: GameLineType.PLAY_TURN,
            player: { id: "a", name: "Alban" },
            amount: 0,
          },
        ],
      },
      {
        id: "1",
        historyLines: [
          {
            designation: GameLineType.PLAY_TURN,
            player: { id: "3", name: "Jules" },
            amount: 0,
          },
        ],
      },
      {
        id: "1",
        historyLines: [
          {
            designation: GameLineType.PLAY_TURN,
            player: { id: "a", name: "Alban" },
            amount: 0,
          },
        ],
      }
    );

    expect(history.getNumberOfTurnsPlayed({ id: "a", name: "Alban" })).toBe(2);
  });
});
