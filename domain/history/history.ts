import {
  AllHistoryLineTypes,
  GameLineType,
  getNewEventId,
} from "./history-line";
import { Player } from "../player";

interface HistoryLine {
  player: Player;
  designation: AllHistoryLineTypes;
  amount: number;
}

interface GameEvent {
  id: string;
  historyLines: Array<HistoryLine>;
}

export class History {
  events: Array<GameEvent>;

  constructor() {
    this.events = [];
  }

  getPlayerScore(player: Player): number {
    return getPlayerScoreFromEvents(this.events, player);
  }

  getPlayerScoreAtEvent(player: Player, eventId: string): number {
    const index = this.events.findIndex((event) => event.id === eventId);

    return getPlayerScoreFromEvents(this.events.slice(0, index + 1), player);
  }

  getNumberOfTurnsPlayed(player: Player): number {
    return this.events.reduce((numberOfTurnsPlayed: number, event) => {
      const numberOfTurnsPlayedInEvent = event.historyLines.reduce(
        (sum: number, line) => {
          if (
            line.player.id === player.id &&
            line.designation === GameLineType.PLAY_TURN
          ) {
            return sum + 1;
          }
          return sum;
        },
        0
      );

      return numberOfTurnsPlayed + numberOfTurnsPlayedInEvent;
    }, 0);
  }

  addEvent(historyLines: Array<HistoryLine>): string {
    const event: GameEvent = {
      id: getNewEventId(),
      historyLines,
    };

    this.events.push(event);

    return event.id;
  }

  cancelEvent(id: string): void {
    this.events = this.events.filter((event) => event.id !== id);
  }

  cancelLastEvent(): void {
    if (this.events.length > 0) {
      this.cancelEvent(this.events[this.events.length - 1].id);
    }
  }
}

function getPlayerScoreFromEvents(
  events: Array<GameEvent>,
  player: Player
): number {
  return events.reduce((sum: number, event) => {
    const historyLinesSum = event.historyLines.reduce(
      (subSum: number, line) => {
        if (line.player.id === player.id) {
          return subSum + line.amount;
        }
        return subSum;
      },
      0
    );

    return sum + historyLinesSum;
  }, 0);
}
