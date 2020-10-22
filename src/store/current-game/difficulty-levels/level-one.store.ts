/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import { RootState } from "@/store/app.state";
import {
  GrelottineSouffletteActionPayload,
  SouffletteActionPayload,
} from "@/domain/soufflette";
import {
  BasicHistoryLineAction,
  HistoryLineApply,
  HistoryLineType,
  mapHistoryActionToApply,
} from "@/domain/history";
import { GrelottineActionPayload } from "@/domain/grelottine";

export interface LevelOneState {
  isSouffletteEnabled: boolean;
}

export const LevelOneStoreModule: Module<LevelOneState, RootState> = {
  namespaced: true,
  state(): LevelOneState {
    return {
      isSouffletteEnabled: false,
    };
  },
  mutations: {
    setIsSouffletteEnabled(state, isEnabled: boolean): void {
      state.isSouffletteEnabled = isEnabled;
    },
  },
  actions: {
    playSoufflette(
      { dispatch, rootGetters },
      actionPayload: SouffletteActionPayload
    ): void {
      actionPayload.turnNumber = rootGetters["currentGame/getState"].turnNumber;

      if (actionPayload.isChallenge) {
        dispatch("handleSouffletteChallenge", actionPayload);
        dispatch("currentGame/handleEndTurn", undefined, { root: true });
      } else {
        const lineAction: BasicHistoryLineAction = {
          designation: HistoryLineType.SOUFFLETTE,
          playerName: actionPayload.challengerName,
          value: 0,
          turnNumber: actionPayload.turnNumber,
        };
        dispatch("currentGame/play/playATurn", lineAction, { root: true });
      }
    },
    handleGrelottineSoufflette(
      { dispatch, commit },
      actionPayload: GrelottineSouffletteActionPayload
    ): void {
      const grelottineActionPayload: GrelottineActionPayload = {
        grelottin: actionPayload.grelottin,
        challengedPlayer: actionPayload.challengedPlayer,
        challenge: actionPayload.challenge,
        gambledAmount: actionPayload.gambledAmount,
        challengedPlayerAction: {
          designation: HistoryLineType.SOUFFLETTE,
          playerName: actionPayload.challengedPlayer,
          value: 0,
        },
      };

      dispatch("currentGame/grelottineChallenge", grelottineActionPayload, {
        root: true,
      });

      if (actionPayload.challengedPlayerActionPayload.isChallenge) {
        dispatch(
          "handleSouffletteChallenge",
          actionPayload.challengedPlayerActionPayload
        );
      } else {
        const lineAction: BasicHistoryLineAction = {
          designation: HistoryLineType.SOUFFLETTE,
          playerName:
            actionPayload.challengedPlayerActionPayload.challengerName,
          value: 0,
        };
        commit(
          "currentGame/addHistoryLine",
          mapHistoryActionToApply(lineAction),
          { root: true }
        );
      }

      dispatch("currentGame/saveGameToLocalStorage", undefined, { root: true });
      dispatch("currentGame/checkEndGame", undefined, { root: true });
    },
    handleSouffletteChallenge(
      { commit, dispatch },
      actionPayload: SouffletteActionPayload
    ): void {
      if (
        !actionPayload.challengedPlayer ||
        !actionPayload.challengedPlayerAction
      ) {
        throw new Error("Il manque des infos sur le joueur défié !");
      }

      let gambledAmount = 30;

      let winnerName: string, looserName: string;
      const hasChallengedPlayerWon =
        actionPayload.challengedPlayerAction.designation ===
        HistoryLineType.SOUFFLETTE;

      if (hasChallengedPlayerWon) {
        winnerName = actionPayload.challengedPlayer;
        looserName = actionPayload.challengerName;
        gambledAmount += 10 * (3 - actionPayload.diceThrowsNumber);
      } else {
        winnerName = actionPayload.challengerName;
        looserName = actionPayload.challengedPlayer;
      }

      const winnerApply: HistoryLineApply = {
        playerName: winnerName,
        designation: HistoryLineType.SOUFFLETTE,
        amount: gambledAmount,
        turnNumber:
          winnerName === actionPayload.challengerName
            ? actionPayload.turnNumber
            : undefined,
      };
      commit("currentGame/addHistoryLine", winnerApply, { root: true });

      const looserApply: HistoryLineApply = {
        playerName: looserName,
        designation: HistoryLineType.SOUFFLETTE,
        amount: -gambledAmount,
        turnNumber:
          looserName === actionPayload.challengerName
            ? actionPayload.turnNumber
            : undefined,
      };
      commit("currentGame/addHistoryLine", looserApply, { root: true });

      if (!hasChallengedPlayerWon) {
        dispatch(
          "currentGame/play/handlePlayerLineAction",
          actionPayload.challengedPlayerAction,
          { root: true }
        );
      }
    },
  },
};
