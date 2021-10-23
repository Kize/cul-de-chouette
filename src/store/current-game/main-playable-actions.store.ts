/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import { SuiteResolution } from "../../../domain/rules/basic-rules/suite-rule";
import { getNewEventId, HistoryLineApply } from "@/domain/history";
import { ChouetteVeluteResolution } from "../../../domain/rules/basic-rules/chouette-velute-rule";
import { RootState } from "@/store/app.state";
import { AttrapeOiseauResolution } from "../../../domain/rules/level-one/attrape-oiseau-rule";
import {
  bleuRougeRuleResolver,
  chouetteVeluteRuleResolver,
  civetRuleResolver,
  gameRuleRunner,
  grelottineRuleResolver,
  siropRuleResolver,
  souffletteRuleResolver,
  suiteRuleResolver,
} from "@/store/current-game/game-rule-runner";
import { DiceRoll } from "../../../domain/rules/dice-rule";
import { RuleEffects } from "../../../domain/rules/rule-effect";
import {
  ApplyBevueGameContext,
  ChallengeGrelottineGameContext,
  GameContextEvent,
  UnknownGameContext,
} from "../../../domain/game-context-event";
import { GrelottineResolution } from "../../../domain/rules/basic-rules/grelottine-rule";
import { SouffletteResolution } from "../../../domain/rules/level-one/soufflette-rule";
import { BleuRougeResolution } from "../../../domain/rules/level-three/bleu-rouge-rule";
import { CivetResolution } from "../../../domain/rules/level-one/civet-rule";

type MainPlayableState = Record<string, unknown>;

export type PlayATurnPayload = PlayADiceRollPayload | PlayACivetPayload;

export interface PlayADiceRollPayload {
  event: GameContextEvent.DICE_ROLL;
  diceRoll: DiceRoll;
}

export interface PlayACivetPayload {
  event: GameContextEvent.CIVET_BET;
}

export const MainPlayableActionsStoreModule: Module<
  MainPlayableState,
  RootState
> = {
  namespaced: true,
  actions: {
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

    async playATurn(
      { dispatch, rootGetters },
      payload: PlayATurnPayload
    ): Promise<void> {
      let gameContext: UnknownGameContext;

      if (payload.event === GameContextEvent.DICE_ROLL) {
        gameContext = {
          event: GameContextEvent.DICE_ROLL,
          playerName: rootGetters["currentGame/currentPlayerName"],
          diceRoll: payload.diceRoll,
          runner: gameRuleRunner.getRunner(),
        };
      } else {
        gameContext = {
          event: payload.event,
          runner: gameRuleRunner.getRunner(),
          playerName: rootGetters["currentGame/currentPlayerName"],
        };
      }

      try {
        const eventId = await dispatch("handleGameEvent", gameContext);
        dispatch("currentGame/handleEndTurn", eventId, { root: true });
      } catch (e) {
        const isCancelAResolution = !e;
        if (isCancelAResolution) {
          return;
        }
        throw e;
      }
    },

    async handleGameEvent(
      { commit },
      gameContext: UnknownGameContext
    ): Promise<string> {
      const ruleEffects: RuleEffects = await gameRuleRunner
        .getRunner()
        .handleGameEvent(gameContext);

      const eventId = getNewEventId();
      commit("currentGame/addEvent", eventId, { root: true });

      ruleEffects.forEach((ruleEffect) => {
        const apply: HistoryLineApply = {
          eventId,
          playerName: ruleEffect.playerName,
          amount: ruleEffect.score,
          designation: ruleEffect.event,
        };

        commit("currentGame/addHistoryLine", apply, {
          root: true,
        });
      });

      return eventId;
    },

    async cancelLastTurn({ rootState, commit, dispatch }): Promise<void> {
      const { events } = rootState.currentGame!;

      if (events.length === 0) {
        return;
      }

      const eventToCancel = events[events.length - 1];
      commit("currentGame/removeEvent", eventToCancel, { root: true });
      commit("currentGame/removeHistoryLines", eventToCancel, { root: true });

      await dispatch("currentGame/saveGameToLocalStorage", undefined, {
        root: true,
      });
    },

    /* RESOLVERS actions*/
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

    resolveCivet(_, civetResolution: CivetResolution): void {
      civetRuleResolver.resolve(civetResolution);
    },
    cancelCivet(): void {
      civetRuleResolver.reject();
    },

    resolveBleuRouge(_, bleuRougeResolution: BleuRougeResolution): void {
      bleuRougeRuleResolver.resolve(bleuRougeResolution);
    },
    cancelBleuRouge(): void {
      bleuRougeRuleResolver.reject();
    },
  },
};
