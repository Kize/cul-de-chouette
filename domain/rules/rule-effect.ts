export type RuleEffects = Array<RuleEffect>;

export interface RuleEffect {
  playerName: string;
  score: number;
  event: RuleEffectEvent;
}

export enum RuleEffectEvent {
  NEANT = "Néant",
  BEVUE = "Bévue",
  CHOUETTE = "Chouette",
  VELUTE = "Velute",
  SUITE = "Suite",
  CHOUETTE_VELUTE_NOT_CLAIMED = "Chouette velute non clammée",
  CUL_DE_CHOUETTE = "Cul de chouette",
  SLOUBI = "Sloubi",
  SOUFFLETTE = "Soufflette",
  SIROP_BET_WON = "Pari de Sirotage gagné",
  CHOUETTE_VELUTE_WON = "Chouette velute gagnée",
  CHOUETTE_VELUTE_LOST = "Chouette velute perdue",
  GRELOTTINE_CHALLENGE_WON = "Défi de grelottine gagné",
  GRELOTTINE_CHALLENGE_LOST = "Défi de grelottine perdu",
  ATTRAPE_OISEAU_WON = "Attrape-oiseau gagné",
  ATTRAPE_OISEAU_LOST = "Attrape-oiseau perdu",
  SIROP_BET_LOST = "Pari de Sirotage perdu",
  SIROP_BET_WON_BUT_NOT_CLAIMED = "Pari de Sirotage gagné mais pas clamé",
  SIROP_WON = "Sirop gagné",
  SIROP_LOST = "Sirop perdu",
  REMOVE_GRELOTTINE = "Grelottine supprimée",
  ADD_GRELOTTINE = "Grelottine ajoutée",
}

export enum NotImplementedHistoryLineType {
  POULETTE = "La poulette",
  CIVET = "Le civet",
  GRAINES = "Graines",
  ARTICHETTE = "Artichette",
  CONTRE_SIROP = "Contre-sirop",
  SIROP_JEANNOT = "Sirop-Jeannot",
  CIVET_DOUBLE = "Civet doublé",
  PASSE_GRELOT = "Passe-grelot",
  RIGODON = "Rigodon",
  CUL_DE_CHOUETTE_DOUBLE = "Cul de chouette doublé",
  BLEU_ROUGE = "Bleu-rouge",
  PELICAN = "Pélican",
  VERDIER = "Verdier",
  ACHAT = "Achat",
  DOUBLE_ACHAT = "Double Achat",
  JARRET = "Jarret",
  FLAN = "Flan",
}
