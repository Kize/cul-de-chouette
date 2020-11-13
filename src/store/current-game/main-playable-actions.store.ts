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
  grelottineRuleResolver,
  siropRuleResolver,
  suiteRuleResolver,
} from "@/store/current-game/game-rule-runner";
import { DiceRoll } from "../../../domain/rules/dice-rule";
import { RuleEffects, RuleEffectType } from "../../../domain/rules/rule-effect";
import {
  ChallengeGrelottineGameContext,
  GameContextEvent,
  PlayTurnGameContext,
  UnknownGameContext,
} from "../../../domain/game-context-event";
import { GrelottineResolution } from "../../../domain/rules/basic-rules/grelottine-rule";

type MainPlayableState = Record<string, unknown>;

export const MainPlayableActionsStoreModule: Module<
  MainPlayableState,
  RootState
> = {
  namespaced: true,
  actions: {
    async playATurn(
      { commit, dispatch, rootState },
      diceRoll: DiceRoll
    ): Promise<void> {
      const gameContext: PlayTurnGameContext = {
        event: GameContextEvent.PLAY_TURN,
        currentPlayerName: rootState.currentGame!.currentPlayerName,
        diceRoll,
      };

      await dispatch("handleGameEvent", gameContext);
      dispatch("currentGame/handleEndTurn", undefined, { root: true });
    },
    async startGrelottineChallenge({ dispatch }): Promise<void> {
      const grelottineContext: ChallengeGrelottineGameContext = {
        event: GameContextEvent.CHALLENGE_GRELOTTINE,
        runner: gameRuleRunner.getRunner(),
      };
      await dispatch("handleGameEvent", grelottineContext);
      await dispatch("currentGame/checkEndGame", null, { root: true});
    },

    async handleGameEvent(
      { commit, rootState },
      gameContext: UnknownGameContext
    ): Promise<void> {
      let ruleEffects: RuleEffects;
      try {
        ruleEffects = await gameRuleRunner
          .getRunner()
          .handleDiceRoll(gameContext);
      } catch (e) {
        const isCancelAResolution = !e;
        if (isCancelAResolution) {
          return;
        }
        throw e;
      }

      ruleEffects.forEach((ruleEffect) => {
        const gameTurnNumber = rootState.currentGame!.turnNumber;
        switch (ruleEffect.type) {
          case RuleEffectType.ADD_GRELOTTINE:
            commit("currentGame/addGrelottine", ruleEffect.playerName, {
              root: true,
            });
            return;
          case RuleEffectType.CHANGE_SCORE: {
            const turnNumber =
              rootState.currentGame!.currentPlayerName === ruleEffect.playerName
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
    },

    resolveSuite(_, suiteResolution: SuiteResolution): void {
      suiteRuleResolver.resolve(suiteResolution);
    },
    cancelSuite(): void {
      suiteRuleResolver.reject();
    },

    resolveGrelottine(_, grelottineResolution: GrelottineResolution): void {
      grelottineRuleResolver.resolve(grelottineResolution);
    },
    cancelGrelottine(): void {
      grelottineRuleResolver.reject();
    },

    resolveChouetteVelute(
      _,
      chouetteVeluteResolution: ChouetteVeluteResolution
    ): void {
      chouetteVeluteRuleResolver.resolve(chouetteVeluteResolution);
    },
    cancelChouetteVelute(): void {
      chouetteVeluteRuleResolver.reject();
    },
    resolveSirop(_, attrapeOiseauResolution: AttrapeOiseauResolution): void {
      siropRuleResolver.resolve(attrapeOiseauResolution);
    },
    cancelSirop(): void {
      siropRuleResolver.reject();
    },
  },
};
