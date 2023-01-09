import { Game } from "./game";
import { Player } from "../player";

describe("getCurrentPlayerName", () => {
  it("throws an exception when there are no players", () => {
    const game = new Game("test", []);

    expect(() => {
      game.getCurrentPlayer();
    }).toThrowError("no players defined");
  });

  it("returns the name of the first player when the history is empty", () => {
    const game = new Game("test", [
      { id: "1", name: "Alban" },
      { id: "2", name: "Delphin" },
    ]);

    expect(game.getCurrentPlayer()).toEqual<Player>({ id: "1", name: "Alban" });
  });

  it("returns the name of the third player when the first two have played", () => {
    const alban = { id: "1", name: "Alban" };
    const delphin = { id: "2", name: "Delphin" };
    const jules = { id: "3", name: "Jules" };

    const game = new Game("test", [alban, delphin, jules]);

    game.history.getNumberOfTurnsPlayed = jest
      .fn()
      .mockImplementation((player: Player) => {
        if (player.id === "1" || player.id === "2") {
          return 1;
        }

        return 0;
      });

    expect(game.getCurrentPlayer()).toEqual<Player>(jules);
  });
});

describe("getNumberOfTurns", () => {
  it("returns 0 when there are no players", () => {
    const game = new Game("", []);

    expect(game.getNumberOfTurns()).toBe(0);
  });

  it("returns 1 when nobody has played yet", () => {
    const game = new Game("", [
      { id: "a", name: "Alban" },
      { id: "d", name: "Delphin" },
    ]);

    game.history.getNumberOfTurnsPlayed = jest.fn().mockReturnValue(0);

    expect(game.getNumberOfTurns()).toBe(1);
  });

  it("returns 1 when half of the players have played 1 time", () => {
    const game = new Game("", [
      { id: "a", name: "Alban" },
      { id: "d", name: "Delphin" },
      { id: "j", name: "Jules" },
      { id: "t", name: "Thibault" },
    ]);

    game.history.getNumberOfTurnsPlayed = jest
      .fn()
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(1)
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0);

    expect(game.getNumberOfTurns()).toBe(1);
  });

  it("returns 3 when all players have played 2 times", () => {
    const game = new Game("", [
      { id: "a", name: "Alban" },
      { id: "d", name: "Delphin" },
    ]);

    game.history.getNumberOfTurnsPlayed = jest
      .fn()
      .mockReturnValueOnce(2)
      .mockReturnValueOnce(2);

    expect(game.getNumberOfTurns()).toBe(3);
  });
});
