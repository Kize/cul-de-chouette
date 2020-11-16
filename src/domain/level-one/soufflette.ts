export interface SouffletteForm {
  numberOfDiceRolls: 1 | 2 | 3;
  challengedPlayer?: string;
}

export function getInitialForm(): SouffletteForm {
  return {
    numberOfDiceRolls: 3,
  };
}
