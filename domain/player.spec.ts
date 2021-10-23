import { getCurrentPlayerName, Player } from "./player";
import { GameLineType } from "../src/domain/history";

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
