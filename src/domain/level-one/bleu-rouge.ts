import { BleuRougeBid } from "../../../domain/rules/level-three/bleu-rouge-rule";

export interface BleuRougeForm {
  bids: Array<BleuRougeBid>;
}

export function getInitialForm(): BleuRougeForm {
  return {
    bids: [],
  };
}
