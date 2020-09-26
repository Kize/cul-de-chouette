function isInteger(number: number): boolean {
  return number % 1 === 0;
}

export const newPlayerNameRules = [
  (name?: string): boolean | string => {
    if (name === undefined) {
      return "Un prénom est requis";
    } else if (name.length < 2) {
      return "2 caractères minimum";
    } else if (name.length > 10) {
      return "10 caractères maximum.";
    }

    return true;
  }
];

export const selectNameRules = [
  (name?: string) => (name && name.length > 1) || "Le joueur est requis"
];

export const inputNumberRules = [
  (num: number) =>
    (num >= 1 && isInteger(num)) || "Ce champ doit être un entier positif"
];
