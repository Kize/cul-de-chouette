import {
  DiceRoll,
  GameContext,
  Rule,
  RuleEffects,
  RuleEffetType,
} from "@/domain/rules/rule";

export class NeantRule implements Rule {
  isApplicableToDiceRoll(_: DiceRoll): boolean {
    return true;
  }

  applyRule(context: GameContext): RuleEffects {
    return [
      {
        type: RuleEffetType.ADD_GRELOTTINE,
        playerName: context.currentPlayerName,
      },
      {
        type: RuleEffetType.CHANGE_SCORE,
        playerName: context.currentPlayerName,
        score: 0,
      },
    ];
  }
}
