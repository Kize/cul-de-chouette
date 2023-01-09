import { Player } from "../player";
import { GameStatus } from "../../src/store/current-game/current-game.interface";
import { GameEvent, History } from "../history/history";
import { RuleRunner } from "../rule-runner/rule-runner";
import { Rule } from "../rule-runner/rules/rule";
import { UnknownGameContext } from "../rule-runner/game-context-event";

export class Game {
  status: GameStatus;
  history: History;
  players: Array<Player>;
  ruleRunner: RuleRunner;

  constructor(public name: string, players: Array<Player>) {
    this.status = GameStatus.IN_GAME;
    this.players = [...players];
    this.history = new History();
    this.ruleRunner = new RuleRunner([]);
  }

  resumeGame(events: Array<GameEvent>, rules: Array<Rule>): void {
    this.history.resumeHistory(events);
    this.updateRules(rules);
  }

  updateRules(rules: Array<Rule>): void {
    this.ruleRunner = new RuleRunner(rules);
  }

  getCurrentPlayer(): Player {
    if (this.players.length === 0) {
      throw new Error("no players defined");
    }

    const playersWithTurnsNumbers = this.players.map((player) => ({
      player,
      numberOfTurnsPlayed: this.history.getNumberOfTurnsPlayed(player),
    }));

    const currentPlayer = playersWithTurnsNumbers.find(
      (playerWrapper, index, array) => {
        if (index === 0) {
          return false;
        }

        return (
          playerWrapper.numberOfTurnsPlayed <
          array[index - 1].numberOfTurnsPlayed
        );
      }
    )?.player;

    return currentPlayer ?? this.players[0];
  }

  getNumberOfTurns(): number {
    if (this.players.length === 0) {
      return 0;
    }

    const turnNumbersPerPlayer = this.players.map((player) =>
      this.history.getNumberOfTurnsPlayed(player)
    );

    if (turnNumbersPerPlayer[0] === 0) {
      return 1;
    }

    if (
      turnNumbersPerPlayer[0] ===
      turnNumbersPerPlayer[turnNumbersPerPlayer.length - 1]
    ) {
      return turnNumbersPerPlayer[0] + 1;
    }

    return turnNumbersPerPlayer[0];
  }

  async doSomething(context: UnknownGameContext): Promise<void> {
    if (this.status !== GameStatus.IN_GAME) {
      return;
    }

    await this.ruleRunner.handleGameEvent(context);

    this.checkEndGame();
  }

  private checkEndGame(): void {
    const playerScores = this.players.map((player) =>
      this.history.getPlayerScore(player)
    );

    const maxScore = Math.max(...playerScores);
    if (maxScore >= 343) {
      this.status = GameStatus.FINISHED;
    }
  }
}
