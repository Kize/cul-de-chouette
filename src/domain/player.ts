import { HistoryLine } from "@/domain/history";

export interface Player {
  name: string;
  history: Array<HistoryLine>;
  hasGrelottine: boolean;
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

export function byName(name: string) {
  return (player: Player) => {
    return player.name === name;
  };
}

export const selectNameRules = [
  (name?: string) => (name && name.length > 1) || "Le joueur est requis"
];
