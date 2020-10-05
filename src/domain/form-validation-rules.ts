function isInteger(number: number): boolean {
  return number % 1 === 0;
}

export const newGameNameNameRules = [
  (name?: string | null): boolean | string => {
    if (name === undefined || name === null) {
      return "Un nom de partie est requis";
    } else if (name.length < 2) {
      return "2 caractères minimum";
    } else if (name.length > 50) {
      return "50 caractères maximum.";
    }

    return true;
  }
];

export const newPlayerNameRules = [
  (name?: string | null): boolean | string => {
    if (name === undefined || name === null) {
      return "Un prénom est requis";
    } else if (name.length < 2) {
      return "2 caractères minimum";
    } else if (name.length > 10) {
      return "10 caractères maximum.";
    }

    return true;
  }
];

function requiredPlayerNameRule(name?: string) {
  return (name && name.length > 1) || "Le joueur est requis";
}

function requiredLineTypeRule(name?: string) {
  return (name && name.length > 1) || "Le type d'opération est requis";
}

function requiredAmountRule(amount?: number) {
  return (
    (amount !== undefined && amount !== null && isInteger(amount)) ||
    "Le montant est requis et doit être entier."
  );
}

export const selectNameRules = [requiredPlayerNameRule];
export const selectLineTypeRules = [requiredLineTypeRule];
export const requiredAmountInputRules = [requiredAmountRule];

export const selectChallengeRules = [
  (name?: string) => (name && name.length > 1) || "Le défi est requis"
];

export const inputStrictlyPositiveIntegerRules = [
  (num: number) =>
    (num >= 1 && isInteger(num)) || "Ce champ doit être un entier positif"
];

export const inputPositiveIntegerRules = [
  (num: number) =>
    (num >= 0 && isInteger(num)) ||
    "Ce champ doit être un entier positif ou nul"
];
