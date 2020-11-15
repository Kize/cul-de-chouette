export interface SouffletteForm {
  isChallenge: boolean;
  diceThrowsNumber: 1 | 2 | 3;
  challengedPlayer?: string;
}

export function getInitialForm(): SouffletteForm {
  return {
    isChallenge: true,
    diceThrowsNumber: 3,
  };
}
