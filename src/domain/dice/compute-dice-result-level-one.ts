import { HistoryLineType } from "@/domain/history";
import { DiceForm } from "@/domain/dice/compute-dice-result";
import { LevelOneState } from "@/store/current-game/difficulty-levels/level-one.store";

function isSoufflette(diceForm: DiceForm): boolean {
  const sortedValues = [...diceForm].sort();

  return sortedValues[0] === 1 && sortedValues[1] === 2 && sortedValues[2] === 4;
}

export function computeLevelOneDiceResult(
  diceForm: DiceForm,
  { isSouffletteEnabled }: LevelOneState
): HistoryLineType | undefined {
  if (isSouffletteEnabled && isSoufflette(diceForm)) {
    return HistoryLineType.SOUFFLETTE;
  }

  return undefined;
}
