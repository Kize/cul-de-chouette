import { BleuRougeBid } from "../../../domain/rule-runner/rules/level-3/bleu-rouge-rule";

export interface BleuRougeForm {
  bids: Array<BleuRougeBid>;
}

export function getInitialForm(): BleuRougeForm {
  return {
    bids: [],
  };
}
