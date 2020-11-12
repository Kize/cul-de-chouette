/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import { SuiteResolution } from "../../../domain/rules/basic-rules/suite-rule";
import { HistoryLineApply } from "@/domain/history";
import { ChouetteVeluteResolution } from "../../../domain/rules/basic-rules/chouette-velute-rule";
import { RootState } from "@/store/app.state";
import { AttrapeOiseauResolution } from "../../../domain/rules/level-one/attrape-oiseau-rule";
import {
  chouetteVeluteRuleResolver,
  gameRuleRunner,
  siropRuleResolver,
  suiteRuleResolver,
} from "@/store/current-game/game-rule-runner";
import { DiceRoll } from "../../../domain/rules/dice-rule";
import { RuleEffects, RuleEffetType } from "../../../domain/rules/rule-effect";
import {
  GameContext,
  GameContextEvent,
  GameContextEventType,
} from "../../../domain/game-context-event";

type MainPlayableState = Record<string, unknown>;

export const MainPlayableActionsStoreModule: Module<
  MainPlayableState,
  RootState
> = {
  namespaced: true,
  actions: {
    async playATurn(
      { rootGetters, commit, dispatch, rootState },
      diceRoll: DiceRoll
    ): Promise<void> {
      const gameContext: GameContext = {
        currentPlayerName: rootState.currentGame!.currentPlayerName,
        diceRoll,
      };

      const gameContextEvent: GameContextEvent = {
        type: GameContextEventType.PLAY_TURN,
        gameContext,
      };

      let ruleEffects: RuleEffects;
      try {
        ruleEffects = await gameRuleRunner
          .getRunner()
          .handleDiceRoll(gameContextEvent);
      } catch (e) {
        if (e) {
          console.error(e);
        }

        return;
      }

      ruleEffects.forEach((ruleEffect) => {
        const gameTurnNumber = rootState.currentGame!.turnNumber;
        switch (ruleEffect.type) {
          case RuleEffetType.ADD_GRELOTTINE:
            commit("currentGame/addGrelottine", ruleEffect.playerName, {
              root: true,
            });
            return;
          case RuleEffetType.CHANGE_SCORE: {
            const turnNumber =
              gameContext.currentPlayerName === ruleEffect.playerName
                ? gameTurnNumber
                : undefined;

            const apply: HistoryLineApply = {
              playerName: ruleEffect.playerName,
              amount: ruleEffect.score,
              designation: ruleEffect.designation,
              turnNumber,
            };

            commit("currentGame/addHistoryLine", apply, {
              root: true,
            });
            return;
          }
        }
      });

      dispatch("currentGame/handleEndTurn", undefined, { root: true });
    },
    resolveSuite({ commit }, suiteResolution: SuiteResolution): void {
      suiteRuleResolver.resolve(suiteResolution);
    },
    cancelSuite(): void {
      suiteRuleResolver.reject();
    },
    resolveChouetteVelute(
      { commit },
      chouetteVeluteResolution: ChouetteVeluteResolution
    ): void {
      chouetteVeluteRuleResolver.resolve(chouetteVeluteResolution);
    },
    cancelChouetteVelute(): void {
      chouetteVeluteRuleResolver.reject();
    },
    resolveSirop(
      { commit },
      attrapeOiseauResolution: AttrapeOiseauResolution
    ): void {
      siropRuleResolver.resolve(attrapeOiseauResolution);
    },
    cancelSirop(): void {
      siropRuleResolver.reject();
    },
  },
};
