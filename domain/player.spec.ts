import { getNextPlayer, Player } from "./player";

describe("getNextPlayer", () => {
  it("returns the second player when the first one has just played", () => {
    const players: Array<Player> = [
      { name: "player 1", history: [] },
      { name: "player 2", history: [] },
      { name: "player 3", history: [] },
    ];

    const nextPlayerName = getNextPlayer(players, "player 1");

    expect(nextPlayerName).toBe("player 2");
  });

  it("returns the first player when the last one has just played", () => {
    const players: Array<Player> = [
      { name: "player 1", history: [] },
      { name: "player 2", history: [] },
      { name: "player 3", history: [] },
    ];

    const nextPlayerName = getNextPlayer(players, "player 3");

    expect(nextPlayerName).toBe("player 1");
  });
});
