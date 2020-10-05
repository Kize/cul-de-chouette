import { Module } from "vuex";
import { RootState } from "@/store/app.state";
import {
  BasicHistoryLineAction,
  ChouetteVeluteHistoryLineAction,
  getAmount,
  HistoryLineAction,
  HistoryLineType,
  mapHistoryActionToApply,
  SuiteHistoryLineAction
} from "@/domain/history";

export const MainPlayableActionsStoreModule: Module<
  Record<string, any>,
  RootState
> = {
  namespaced: true,
  actions: {
    playATurn(
      { rootGetters, commit, dispatch },
      lineAction: HistoryLineAction
    ): void {
      if (
        rootGetters["currentGame/getState"].currentPlayerName !==
        lineAction.playerName
      ) {
        return;
      }

      if (lineAction.designation === HistoryLineType.NEANT) {
        commit("currentGame/addGrelottine", lineAction.playerName, {
          root: true
        });
      }

      dispatch("handlePlayerLineAction", lineAction);
      dispatch("currentGame/handleEndTurn", undefined, { root: true });
    },
    handleSuiteAction({ commit }, action: SuiteHistoryLineAction): void {
      const isCurrentPlayerTheLooser =
        action.loosingPlayerName === action.playerName;

      if (!isCurrentPlayerTheLooser) {
        const historyLineAction: HistoryLineAction = {
          playerName: action.loosingPlayerName,
          designation: HistoryLineType.SUITE,
          value: action.multiplier * 10
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
        turnNumber: action.turnNumber
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
            : undefined
        };
        commit(
          "currentGame/addHistoryLine",
          mapHistoryActionToApply(newAction),
          { root: true }
        );
      } else {
        action.shoutingPlayers.forEach(playerName => {
          const historyLineApply = mapHistoryActionToApply({
            playerName,
            designation: HistoryLineType.CHOUETTE_VELUTE,
            value: action.value,
            turnNumber: rootGetters["currentGame/isCurrentPlayer"](playerName)
              ? action.turnNumber
              : undefined
          });

          historyLineApply.amount = -historyLineApply.amount;
          commit("currentGame/addHistoryLine", historyLineApply, {
            root: true
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
            turnNumber: action.turnNumber
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
    }
  }
};
