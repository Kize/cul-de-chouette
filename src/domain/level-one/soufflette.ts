export interface SouffletteForm {
  diceThrowsNumber: 1 | 2 | 3;
  challengedPlayer?: string;
}

export function getInitialForm(): SouffletteForm {
  return {
    diceThrowsNumber: 3,
  };
}
