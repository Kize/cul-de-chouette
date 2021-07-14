/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import { SuiteResolution } from "../../../domain/rules/basic-rules/suite-rule";
import { getTurnId, HistoryLineApply } from "@/domain/history";
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
import { RuleEffects } from "../../../domain/rules/rule-effect";
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
import {
  getPreviousPlayer,
  getPreviousTurnNumberFromPreviousPlayer,
} from "../../../domain/player";

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
        .handleGameEvent(gameContext);

      ruleEffects.forEach((ruleEffect) => {
        const gameTurnNumber = rootState.currentGame!.turnNumber;
        const playerTurnNumber =
          rootState.currentGame!.currentPlayerName === ruleEffect.playerName
            ? gameTurnNumber
            : undefined;

        const apply: HistoryLineApply = {
          turnId: getTurnId(
            rootState.currentGame!.turnNumber,
            rootState.currentGame!.currentPlayerName
          ),
          playerName: ruleEffect.playerName,
          amount: ruleEffect.score,
          designation: ruleEffect.event,
          turnNumber: playerTurnNumber,
        };

        commit("currentGame/addHistoryLine", apply, {
          root: true,
        });
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
    async cancelLastTurn({ rootState, commit, dispatch }): Promise<void> {
      const { turnNumber, currentPlayerName, players } = rootState.currentGame!;

      if (turnNumber === 1 && currentPlayerName === players[0].name) {
        return;
      }

      const previousPlayerName = getPreviousPlayer(players, currentPlayerName);
      const previousTurnNumber = getPreviousTurnNumberFromPreviousPlayer(
        players,
        previousPlayerName,
        turnNumber
      );

      commit(
        "currentGame/removeHistoryLines",
        getTurnId(previousTurnNumber, previousPlayerName),
        { root: true }
      );
      commit("currentGame/setCurrentPlayerName", previousPlayerName, {
        root: true,
      });

      if (previousTurnNumber !== turnNumber) {
        commit("currentGame/decrementTurnNumber", undefined, {
          root: true,
        });
      }

      await dispatch("currentGame/saveGameToLocalStorage", undefined, {
        root: true,
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
