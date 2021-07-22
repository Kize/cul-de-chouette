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
  },
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
  },
];

export const selectPlayersRules = [
  (value?: Array<string> | null): boolean | string => {
    if (value === undefined || value === null) {
      return false;
    }

    if (value.length < 2) {
      return "2 joueurs sont requis au minimum.";
    }

    if (value.length > 8) {
      return "Ne fonctionne qu'avec 8 joueurs au maximum pour le moment";
    }
    return true;
  },
];

function requiredPlayerNameRule(name?: string): true | string {
  return (name && name.length > 1) || "Le joueur est requis";
}

function requiredLineTypeRule(name?: string): true | string {
  return (name && name.length > 1) || "Le type d'opération est requis";
}

function requiredAmountRule(amount?: number): true | string {
  return (
    (amount !== undefined && amount !== null && isInteger(amount)) ||
    "Le montant est requis et doit être entier."
  );
}

export type inputRuleFunction = (n?: string) => true | string;

export const rulesOfSelectNameInput = [requiredPlayerNameRule];
export const rulesOfSelectLineTypeInput = [requiredLineTypeRule];
export const rulesOfAmountInput = [requiredAmountRule];
export const rulesOfSelectChallengeInput = [
  (name?: string): true | string =>
    (name && name.length > 1) || "Le défi est requis",
];

export const inputStrictlyPositiveIntegerRules = [
  (num?: string): true | string =>
    (Number(num) >= 1 && isInteger(Number(num))) ||
    "Ce champ doit être un entier positif",
];

export const positiveIntegerInputRules = [
  (num?: string): true | string =>
    (Number(num) >= 0 && isInteger(Number(num))) ||
    "Ce champ doit être un entier positif ou nul",
];
