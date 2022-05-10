import { GameLineType, HistoryLine } from "@/domain/history";
import { Player } from "../../../domain/player";

export type HistoryView = Array<CurrentGameHistoryLine>;

type CurrentHistoryLine = Omit<HistoryLine, "eventId">;

export interface CurrentGameHistoryLine {
  eventId: string;
  playerHistories: Array<Array<CurrentHistoryLine>>;
}

export function getHistoryView(
  events: Array<string>,
  players: Array<Player>
): HistoryView {
  return events.map<CurrentGameHistoryLine>((eventId) => {
    return {
      eventId,
      playerHistories: players.map((player) => {
        return player.history
          .filter((line) => line.eventId === eventId)
          .map<CurrentHistoryLine>((line) => {
            return {
              amount: line.amount,
              designation: line.designation,
            };
          });
      }),
    };
  });
}
