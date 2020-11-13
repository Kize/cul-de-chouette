import { GrelottineBet } from "../../domain/rules/basic-rules/grelottine-rule";

export interface GrelottineForm {
  grelottinPlayer?: string;
  challengedPlayer?: string;
  grelottinBet?: GrelottineBet;
  gambledAmount: number;
}

export type ValidGrelottineForm = Required<GrelottineForm>;
