import { CivetBet } from "../../../domain/rules/level-1/civet-rule";

export interface CivetForm {
  playerName?: string;
  betAmount: number;
  playerBet?: CivetBet;
}

export function getInitialForm(): CivetForm {
  return {
    betAmount: 102,
  };
}
