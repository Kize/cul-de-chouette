import { BleuRougeBid } from "../../../domain/rules/level-3/bleu-rouge-rule";

export interface BleuRougeForm {
  bids: Array<BleuRougeBid>;
}

export function getInitialForm(): BleuRougeForm {
  return {
    bids: [],
  };
}
