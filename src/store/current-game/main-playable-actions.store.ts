/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import {
  DiceRoll,
  GameContext,
  RuleEffects,
  RuleEffetType,
} from "../../../domain/rules/rule";
import { CulDeChouetteRule } from "../../../domain/rules/basic-rules/cul-de-chouette-rule";
import {
  SuiteResolution,
  SuiteRule,
} from "../../../domain/rules/basic-rules/suite-rule";
import { SuiteRuleResolver } from "@/store/current-game/resolver/suite-rule-resolver";
import {
  BasicHistoryLineAction,
  ChouetteVeluteHistoryLineAction,
  getAmount,
  HistoryLineAction,
  HistoryLineApply,
  HistoryLineType,
  mapHistoryActionToApply,
  SuiteHistoryLineAction,
} from "@/domain/history";
import { RuleRunner } from "../../../domain/rule-runner";
import { NeantRule } from "../../../domain/rules/basic-rules/neant-rule";
import { VeluteRule } from "../../../domain/rules/basic-rules/velute-rule";
import {
  ChouetteVeluteResolution,
  ChouetteVeluteRule,
} from "../../../domain/rules/basic-rules/chouette-velute-rule";
import { ChouetteRule } from "../../../domain/rules/basic-rules/chouette-rule";
import { RootState } from "@/store/app.state";
import { ChouetteVeluteRuleResolver } from "@/store/current-game/resolver/chouette-velute-rule-resolver";
import {
  AttrapeOiseauResolution,
  AttrapeOiseauRule,
} from "../../../domain/rules/level-one/attrape-oiseau-rule";
import { SiropRuleResolver } from "@/store/current-game/resolver/sirop-rule-resolver";
import { SirotageRule } from "../../../domain/rules/level-one/sirotage-rule";

type MainPlayableState = Record<string, unknown>;

const suiteRuleResolver = new SuiteRuleResolver();
const chouetteVeluteRuleResolver = new ChouetteVeluteRuleResolver();
const siropRuleResolver = new SiropRuleResolver();

const ruleRunner = new RuleRunner([
  new CulDeChouetteRule(),
  new SuiteRule(suiteRuleResolver),
  new ChouetteVeluteRule(chouetteVeluteRuleResolver),
  new VeluteRule(),
  new AttrapeOiseauRule(siropRuleResolver),
  new SirotageRule(siropRuleResolver),
  new ChouetteRule(),
  new NeantRule(),
]);

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
      let ruleEffects: RuleEffects;
      try {
        ruleEffects = await ruleRunner.run(diceRoll, gameContext);
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
    cancelSuite({ commit }): void {
      suiteRuleResolver.reject();
    },
    resolveChouetteVelute(
      { commit },
      chouetteVeluteResolution: ChouetteVeluteResolution
    ): void {
      chouetteVeluteRuleResolver.resolve(chouetteVeluteResolution);
    },
    cancelChouetteVelute({ commit }): void {
      chouetteVeluteRuleResolver.reject();
    },

    resolveSirop(
      { commit },
      attrapeOiseauResolution: AttrapeOiseauResolution
    ): void {
      siropRuleResolver.resolve(attrapeOiseauResolution);
    },
    cancelSirop({ commit }): void {
      siropRuleResolver.reject();
    },

    // Still used by grelottine, should be removed later
    handleSuiteAction({ commit }, action: SuiteHistoryLineAction): void {
      const isCurrentPlayerTheLooser =
        action.loosingPlayerName === action.playerName;

      if (!isCurrentPlayerTheLooser) {
        const historyLineAction: HistoryLineAction = {
          playerName: action.loosingPlayerName,
          designation: HistoryLineType.SUITE,
          value: action.multiplier * 10,
        };
        commit(
          "currentGame/addHistoryLine",
          mapHistoryActionToApply(historyLineAction),
          { root: true }
        );
      }

      const value = isCurrentPlayerTheLooser ? action.multiplier * 10 : 0;
      const historyLineApply = mapHistoryActionToApply({
        playerName: action.playerName,
        designation: HistoryLineType.SUITE,
        value,
        turnNumber: action.turnNumber,
      });

      if (action.isVelute) {
        historyLineApply.amount += getAmount(HistoryLineType.VELUTE, 3);
      }

      commit("currentGame/addHistoryLine", historyLineApply, { root: true });
    },
    handleChouetteVeluteAction(
      { commit, rootGetters },
      action: ChouetteVeluteHistoryLineAction
    ): void {
      if (action.shoutingPlayers.length === 1) {
        const newAction: BasicHistoryLineAction = {
          playerName: action.shoutingPlayers[0],
          designation: HistoryLineType.CHOUETTE_VELUTE,
          value: action.value,
          turnNumber: rootGetters["currentGame/isCurrentPlayer"](
            action.shoutingPlayers[0]
          )
            ? action.turnNumber
            : undefined,
        };
        commit(
          "currentGame/addHistoryLine",
          mapHistoryActionToApply(newAction),
          { root: true }
        );
      } else {
        action.shoutingPlayers.forEach((playerName) => {
          const historyLineApply = mapHistoryActionToApply({
            playerName,
            designation: HistoryLineType.CHOUETTE_VELUTE,
            value: action.value,
            turnNumber: rootGetters["currentGame/isCurrentPlayer"](playerName)
              ? action.turnNumber
              : undefined,
          });

          historyLineApply.amount = -historyLineApply.amount;
          commit("currentGame/addHistoryLine", historyLineApply, {
            root: true,
          });
        });
      }

      if (!action.shoutingPlayers.includes(action.playerName)) {
        commit(
          "currentGame/addHistoryLine",
          mapHistoryActionToApply({
            playerName: action.playerName,
            designation: HistoryLineType.CHOUETTE_VELUTE,
            value: 0,
            turnNumber: action.turnNumber,
          }),
          { root: true }
        );
      }
    },
    handlePlayerLineAction(
      { commit, dispatch },
      lineAction: HistoryLineAction
    ): void {
      switch (lineAction.designation) {
        case HistoryLineType.CHOUETTE_VELUTE:
          dispatch("handleChouetteVeluteAction", lineAction);
          break;
        case HistoryLineType.SUITE:
          dispatch("handleSuiteAction", lineAction);
          break;
        default:
          commit(
            "currentGame/addHistoryLine",
            mapHistoryActionToApply(lineAction),
            { root: true }
          );
      }
    },
  },
};
