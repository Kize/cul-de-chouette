import { HistoryLine } from "@/domain/history";

export interface Player {
  name: string;
  history: Array<HistoryLine>;
  hasGrelottine: boolean;
  hasJarret: boolean;
}

export function getNextPlayer(
  players: Array<Player>,
  lastPlayerName: string
): string {
  const nextPlayer = players.find((player, index) => {
    return players[index - 1]?.name === lastPlayerName;
  });

  return nextPlayer ? nextPlayer.name : players[0].name;
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
