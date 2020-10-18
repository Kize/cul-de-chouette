import {
  HistoryLineAction,
  HistoryLineType,
  SuiteHistoryLineAction
} from "@/domain/history";

export enum GrelottineChallenges {
  CHOUETTE = "Chouette",
  VELUTE = "Velute",
  CUL_DE_CHOUETTE = "Cul de chouette",
  CHOUETTE_VELUTE = "Chouette-velute",
  SIROP_GRELOT = "Sirop-grelot"
}

export interface GrelottineForm {
  challenge?: GrelottineChallenges;
  grelottin?: string;
  challengedPlayer?: string;
  challengedPlayerAction?: HistoryLineAction;
  gambledAmount: number;
}

export interface GrelottineActionPayload {
  challenge: GrelottineChallenges;
  grelottin: string;
  challengedPlayer: string;
  challengedPlayerAction: HistoryLineAction;
  gambledAmount: number;
}

export function getMaxGrelottinePossibleAmount(
  lowestScore: number,
  challenge?: GrelottineChallenges
): number {
  if (!challenge) {
    return 0;
  }

  let percentage = 0;
  switch (challenge) {
    case GrelottineChallenges.CHOUETTE:
      percentage = 0.33;
      break;
    case GrelottineChallenges.VELUTE:
      percentage = 0.25;
      break;
    case GrelottineChallenges.CUL_DE_CHOUETTE:
      percentage = 0.12;
      break;
    case GrelottineChallenges.CHOUETTE_VELUTE:
      percentage = 0.06;
      break;
    case GrelottineChallenges.SIROP_GRELOT:
      percentage = 0.03;
      break;
  }

  return Math.ceil(lowestScore * percentage);
}

export function isGrelottineChallengeSuccessful(
  challenge: GrelottineChallenges,
  action: HistoryLineAction
): boolean {
  const suiteAction = action as SuiteHistoryLineAction;

  switch (action.designation) {
    case HistoryLineType.CHOUETTE:
      return challenge === GrelottineChallenges.CHOUETTE;
    case HistoryLineType.VELUTE:
      return challenge === GrelottineChallenges.VELUTE;
    case HistoryLineType.CUL_DE_CHOUETTE:
      return challenge === GrelottineChallenges.CUL_DE_CHOUETTE;
    case HistoryLineType.CHOUETTE_VELUTE:
      return challenge === GrelottineChallenges.CHOUETTE_VELUTE;
    case HistoryLineType.SUITE:
      return challenge === GrelottineChallenges.VELUTE && suiteAction.isVelute;
  }

  return false;
}
