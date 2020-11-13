import {HistoryLineAction, HistoryLineType, SuiteHistoryLineAction,} from "@/domain/history";
import {GrelottineBet} from "../../domain/rules/basic-rules/grelottine-rule";
import {DiceRoll} from "../../domain/rules/dice-rule";


export interface GrelottineForm {
  grelottinPlayer?: string;
  challengedPlayer?: string;
  grelottinBet?: GrelottineBet;
  gambledAmount: number;
}

export type ValidGrelottineForm = Required<GrelottineForm>

export function isGrelottineChallengeSuccessful(
  challenge: GrelottineBet,
  action: HistoryLineAction
): boolean {
  const suiteAction = action as SuiteHistoryLineAction;

  switch (action.designation) {
    case HistoryLineType.CHOUETTE:
      return challenge === GrelottineBet.CHOUETTE;
    case HistoryLineType.VELUTE:
      return challenge === GrelottineBet.VELUTE;
    case HistoryLineType.CUL_DE_CHOUETTE:
      return challenge === GrelottineBet.CUL_DE_CHOUETTE;
    case HistoryLineType.CHOUETTE_VELUTE:
      return challenge === GrelottineBet.CHOUETTE_VELUTE;
    case HistoryLineType.SUITE:
      return challenge === GrelottineBet.VELUTE && suiteAction.isVelute;
  }

  return false;
}
