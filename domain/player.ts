import { GameLineType, HistoryLine } from "@/domain/history";

export interface Player {
  name: string;
  history: Array<HistoryLine>;
}

export function computePlayerScore(
  player: Player,
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

export function byName(name: string): (p: Player) => boolean {
  return (player: Player) => {
    return player.name === name;
  };
}

export function getCurrentPlayerName(players: Array<Player>): string {
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
  player: Player
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
