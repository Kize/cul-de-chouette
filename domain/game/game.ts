import { Player } from "../player";
import { GameStatus } from "../../src/store/current-game/current-game.interface";

export class Game {
  status: GameStatus;

  constructor(public name: string, public players: Array<Player>) {
    this.status = GameStatus.CREATION;
  }
}
