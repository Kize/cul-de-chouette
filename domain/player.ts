import { GameLineType, HistoryLine } from "./history/history-line";

export interface OldPlayerInterface {
  name: string;
  history: Array<HistoryLine>;
}

export interface Player {
  id: string;
  name: string;
}

export function computePlayerScore(
  player: OldPlayerInterface,
  lastLineIndex?: number
): number {
  const history =
    lastLineIndex === undefined
      ? player.history
      : player.history.slice(0, lastLineIndex + 1);

  return history.reduce((score: number, line: HistoryLine) => {
    return score + line.amount;
  }, 0);
}

export function computePositiveScoresSum(player: OldPlayerInterface): number {
  return player.history.reduce((sum: number, historyLine) => {
    if (historyLine.amount > 0) {
      return sum + historyLine.amount;
    }

    return sum;
  }, 0);
}

export function computeNegativeScoresSum(player: OldPlayerInterface): number {
  return player.history.reduce((sum: number, historyLine) => {
    if (historyLine.amount < 0) {
      return sum + historyLine.amount;
    }

    return sum;
  }, 0);
}

export function byName(name: string): (p: OldPlayerInterface) => boolean {
  return (player: OldPlayerInterface) => {
    return player.name === name;
  };
}

export function getCurrentPlayerName(
  players: Array<OldPlayerInterface>
): string {
  const currentPlayer = players
    .map(toPlayerWithNumberOfTurnsPlayed)
    .find((player, index, array) => {
      if (index === 0) {
        return false;
      }

      return player.numberOfTurnsPlayed < array[index - 1].numberOfTurnsPlayed;
    });

  if (currentPlayer) {
    return currentPlayer.name;
  }
  return players[0].name;
}

export function toPlayerWithNumberOfTurnsPlayed(
  player: OldPlayerInterface
): PlayerWithNumberOfTurnsPlayed {
  return {
    name: player.name,
    numberOfTurnsPlayed: player.history.reduce(
      (numberOfTurnsPlayed, historyLine) => {
        if (historyLine.designation === GameLineType.PLAY_TURN) {
          return ++numberOfTurnsPlayed;
        }
        return numberOfTurnsPlayed;
      },
      0
    ),
  };
}

interface PlayerWithNumberOfTurnsPlayed {
  name: string;
  numberOfTurnsPlayed: number;
}
