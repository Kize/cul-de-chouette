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
  challengedPlayerScore: number;
  amount: number;
  isChallengePassed: boolean;
}

export interface GrelottineActionPayload {
  challenge: GrelottineChallenges;
  grelottin: string;
  challengedPlayer: string;
  challengedPlayerScore: number;
  amount: number;
  isChallengePassed: boolean;
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
