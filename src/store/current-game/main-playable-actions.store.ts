/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import { SuiteResolution } from "../../../domain/rules/basic-rules/suite-rule";
import { HistoryLineApply } from "@/domain/history";
import { ChouetteVeluteResolution } from "../../../domain/rules/basic-rules/chouette-velute-rule";
import { RootState } from "@/store/app.state";
import { AttrapeOiseauResolution } from "../../../domain/rules/level-one/attrape-oiseau-rule";
import {
  bleuRougeRuleResolver,
  chouetteVeluteRuleResolver,
  gameRuleRunner,
  grelottineRuleResolver,
  siropRuleResolver,
  souffletteRuleResolver,
  suiteRuleResolver,
} from "@/store/current-game/game-rule-runner";
import { DiceRoll } from "../../../domain/rules/dice-rule";
import {
  RuleEffectEvent,
  RuleEffects,
} from "../../../domain/rules/rule-effect";
import {
  ApplyBevueGameContext,
  ChallengeGrelottineGameContext,
  DiceRollGameContext,
  GameContextEvent,
  UnknownGameContext,
} from "../../../domain/game-context-event";
import { GrelottineResolution } from "../../../domain/rules/basic-rules/grelottine-rule";
import { SouffletteResolution } from "../../../domain/rules/level-one/soufflette-rule";
import { BleuRougeResolution } from "../../../domain/rules/level-three/bleu-rouge-rule";

type MainPlayableState = Record<string, unknown>;

export const MainPlayableActionsStoreModule: Module<
  MainPlayableState,
  RootState
> = {
  namespaced: true,
  actions: {
    async playATurn(
      { dispatch, rootState },
      diceRoll: DiceRoll
    ): Promise<void> {
      const gameContext: DiceRollGameContext = {
        event: GameContextEvent.DICE_ROLL,
        playerName: rootState.currentGame!.currentPlayerName,
        diceRoll,
        runner: gameRuleRunner.getRunner(),
      };

      try {
        await dispatch("handleGameEvent", gameContext);
        dispatch("currentGame/handleEndTurn", undefined, { root: true });
      } catch (e) {
        const isCancelAResolution = !e;
        if (isCancelAResolution) {
          return;
        }
        throw e;
      }
    },
    async startGrelottineChallenge({ dispatch }): Promise<void> {
      const grelottineContext: ChallengeGrelottineGameContext = {
        event: GameContextEvent.CHALLENGE_GRELOTTINE,
        runner: gameRuleRunner.getRunner(),
      };
      try {
        await dispatch("handleGameEvent", grelottineContext);
        await dispatch("currentGame/checkEndGame", null, { root: true });
      } catch (e) {
        const isCancelAResolution = !e;
        if (isCancelAResolution) {
          return;
        }
        throw e;
      }
    },

    async handleGameEvent(
      { commit, rootState },
      gameContext: UnknownGameContext
    ): Promise<void> {
      const ruleEffects: RuleEffects = await gameRuleRunner
        .getRunner()
        .handleDiceRoll(gameContext);

      ruleEffects.forEach((ruleEffect) => {
        const gameTurnNumber = rootState.currentGame!.turnNumber;
        const playerTurnNumber =
          rootState.currentGame!.currentPlayerName === ruleEffect.playerName
            ? gameTurnNumber
            : undefined;

        const apply: HistoryLineApply = {
          playerName: ruleEffect.playerName,
          amount: ruleEffect.score,
          designation: ruleEffect.event,
          turnNumber: playerTurnNumber,
        };

        commit("currentGame/addHistoryLine", apply, {
          root: true,
        });

        switch (ruleEffect.event) {
          case RuleEffectEvent.ADD_GRELOTTINE:
            commit("currentGame/addGrelottine", ruleEffect.playerName, {
              root: true,
            });
            break;
          case RuleEffectEvent.REMOVE_GRELOTTINE:
            commit("currentGame/removeGrelottine", ruleEffect.playerName, {
              root: true,
            });
            break;
          case RuleEffectEvent.ADD_JARRET:
            commit("currentGame/addJarret", ruleEffect.playerName, {
              root: true,
            });
            break;
        }
      });
    },
    async applyBevue({ dispatch }, playerWhoMadeABevue: string): Promise<void> {
      const bevueContext: ApplyBevueGameContext = {
        event: GameContextEvent.APPLY_BEVUE,
        playerWhoMadeABevue,
      };
      try {
        await dispatch("handleGameEvent", bevueContext);
        await dispatch("currentGame/checkEndGame", null, { root: true });
      } catch (e) {
        const isCancelAResolution = !e;
        if (isCancelAResolution) {
          return;
        }
        throw e;
      }
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

    resolveSoufflette(_, souffletteResolution: SouffletteResolution): void {
      souffletteRuleResolver.resolve(souffletteResolution);
    },
    cancelSoufflette(): void {
      souffletteRuleResolver.reject();
    },

    resolveBleuRouge(_, bleuRougeResolution: BleuRougeResolution): void {
      bleuRougeRuleResolver.resolve(bleuRougeResolution);
    },
    cancelBleuRouge(): void {
      bleuRougeRuleResolver.reject();
    },
  },
};
