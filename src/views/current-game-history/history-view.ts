import {
  GameLineType,
  HistoryLine,
} from "../../../domain/history/history-line";
import { computePlayerScore, Player } from "../../../domain/player";

export type HistoryView = Array<CurrentGameHistoryLine>;

type CurrentHistoryLine = Omit<HistoryLine, "eventId"> & {
  currentTotal: number;
};

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
        return player.history.reduce(
          (history: Array<CurrentHistoryLine>, line, index) => {
            if (
              line.eventId !== eventId ||
              line.designation === GameLineType.PLAY_TURN
            ) {
              return history;
            }
            return [
              ...history,
              {
                amount: line.amount,
                designation: line.designation,
                currentTotal: computePlayerScore(player, index),
              },
            ];
          },
          []
        );
      }),
    };
  });
}
