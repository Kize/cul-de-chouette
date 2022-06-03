import {
  computeNegativeScoresSum,
  computePositiveScoresSum,
  getCurrentPlayerName,
  Player,
} from "./player";
import { GameLineType } from "../src/domain/history";
import { RuleEffectEvent } from "./rules/rule-effect";

describe("getCurrentPlayerName", () => {
  it("returns the first player when no one has played", () => {
    const players: Array<Player> = [
      { name: "Alban", history: [] },
      { name: "Delphin", history: [] },
      { name: "Luc", history: [] },
    ];
    const currentPlayerName = getCurrentPlayerName(players);

    expect(currentPlayerName).toBe("Alban");
  });

  it("returns the first player when the last player has played", () => {
    const players: Array<Player> = [
      {
        name: "Alban",
        history: [
          { eventId: "", designation: GameLineType.PLAY_TURN, amount: 0 },
        ],
      },
      {
        name: "Delphin",
        history: [
          { eventId: "", designation: GameLineType.PLAY_TURN, amount: 0 },
        ],
      },
      {
        name: "Luc",
        history: [
          { eventId: "", designation: GameLineType.PLAY_TURN, amount: 0 },
        ],
      },
    ];
    const currentPlayerName = getCurrentPlayerName(players);

    expect(currentPlayerName).toBe("Alban");
  });

  it("returns the second player when the first player has played its second turn", () => {
    const players: Array<Player> = [
      {
        name: "Alban",
        history: [
          { eventId: "", designation: GameLineType.PLAY_TURN, amount: 0 },
          { eventId: "", designation: GameLineType.PLAY_TURN, amount: 0 },
        ],
      },
      {
        name: "Delphin",
        history: [
          { eventId: "", designation: GameLineType.PLAY_TURN, amount: 0 },
        ],
      },
      {
        name: "Luc",
        history: [
          { eventId: "", designation: GameLineType.PLAY_TURN, amount: 0 },
        ],
      },
    ];
    const currentPlayerName = getCurrentPlayerName(players);

    expect(currentPlayerName).toBe("Delphin");
  });
});

describe("computePositiveScoresSum", () => {
  it("returns 50 when the user gained two sirop bets, and has a Bevue", () => {
    const player: Player = {
      name: "Alban",
      history: [
        {
          eventId: "",
          amount: 25,
          designation: RuleEffectEvent.SIROP_BET_WON,
        },
        {
          eventId: "",
          amount: 25,
          designation: RuleEffectEvent.SIROP_BET_WON,
        },
        {
          eventId: "",
          amount: -5,
          designation: RuleEffectEvent.BEVUE,
        },
      ],
    };

    const result = computePositiveScoresSum(player);

    expect(result).toBe(50);
  });
});

describe("computeNegativeScoresSum", () => {
  it("returns -10 when the user has 2 Bevue and a sirop bet won", () => {
    const player: Player = {
      name: "Alban",
      history: [
        {
          eventId: "",
          amount: 25,
          designation: RuleEffectEvent.SIROP_BET_WON,
        },
        {
          eventId: "",
          amount: -5,
          designation: RuleEffectEvent.BEVUE,
        },
        {
          eventId: "",
          amount: -5,
          designation: RuleEffectEvent.BEVUE,
        },
      ],
    };

    const result = computeNegativeScoresSum(player);

    expect(result).toBe(-10);
  });
});
