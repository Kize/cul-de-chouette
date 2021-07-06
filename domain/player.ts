import { HistoryLine } from "@/domain/history";

export interface Player {
  name: string;
  history: Array<HistoryLine>;
}

export function getNextPlayer(
  players: Array<Player>,
  currentPlayerName: string
): string {
  const nextPlayer = players.find((player, index) => {
    return players[index - 1]?.name === currentPlayerName;
  });

  return nextPlayer ? nextPlayer.name : players[0].name;
}

export function getPreviousPlayer(
  players: Array<Player>,
  currentPlayerName: string
): string {
  const previousPlayer = players.find((player, index) => {
    return players[index + 1]?.name === currentPlayerName;
  });

  return previousPlayer
    ? previousPlayer.name
    : players[players.length - 1].name;
}

export function getPreviousTurnNumberFromPreviousPlayer(
  players: Array<Player>,
  previousPlayerName: string,
  currentTurnNumber: number
): number {
  return previousPlayerName === players[players.length - 1].name
    ? currentTurnNumber - 1
    : currentTurnNumber;
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
