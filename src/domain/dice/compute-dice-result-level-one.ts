import { HistoryLineType } from "@/domain/history";
import { DiceForm } from "@/domain/dice/compute-dice-result";
import { LevelOneState } from "@/store/current-game/difficulty-levels/level-one.store";

function isSoufflette([dieIndex1, dieIndex2, dieIndex3]: DiceForm): boolean {
  const values = [dieIndex1 + 1, dieIndex2 + 1, dieIndex3 + 1].sort();

  return values[0] === 1 && values[1] === 2 && values[2] === 4;
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
