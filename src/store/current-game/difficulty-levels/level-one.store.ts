/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import { RootState } from "@/store/app.state";
import {
  GrelottineSouffletteActionPayload,
  SouffletteActionPayload,
} from "@/domain/level-one/soufflette";
import {
  BasicHistoryLineAction,
  getAmount,
  HistoryLineApply,
  HistoryLineType,
  mapHistoryActionToApply,
} from "@/domain/history";
import { GrelottineActionPayload } from "@/domain/grelottine";
import {
  BidType,
  isBidValid,
  SiropActionPayload,
  SiropBid,
} from "@/domain/level-one/sirop";
import { DieValue } from "@/domain/dice/compute-dice-value";

export interface LevelOneState {
  isSouffletteEnabled: boolean;
  isSiropEnabled: boolean;
  isAttrapeOiseauEnabled: boolean;
}

export const LevelOneStoreModule: Module<LevelOneState, RootState> = {
  namespaced: true,
  state(): LevelOneState {
    return {
      isSouffletteEnabled: false,
      isSiropEnabled: false,
      isAttrapeOiseauEnabled: false,
    };
  },
  mutations: {
    setLevelOneRules(state, rules: LevelOneState): void {
      state.isSouffletteEnabled = rules.isSouffletteEnabled;
      state.isSiropEnabled = rules.isSiropEnabled;
      state.isAttrapeOiseauEnabled = rules.isAttrapeOiseauEnabled;
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
    playSirop(
      { commit, dispatch, rootGetters, state },
      siropActionPayload: SiropActionPayload
    ): void {
      if (!state.isSiropEnabled) {
        throw new Error("Le sirop n'a pas été activé. Action impossible");
      }

      if (
        !state.isAttrapeOiseauEnabled &&
        siropActionPayload.attrapeOiseauPlayerName
      ) {
        throw new Error(
          "L'attrape-oiseau n'a pas été activé. Action impossible"
        );
      }

      if (siropActionPayload.isChouetteNotSirote) {
        dispatch(
          "currentGame/play/playATurn",
          siropActionPayload.initialChouette,
          {
            root: true,
          }
        );

        return;
      }

      if (siropActionPayload.attrapeOiseauPlayerName) {
        commit(
          "currentGame/addHistoryLine",
          mapHistoryActionToApply(siropActionPayload.initialChouette),
          { root: true }
        );

        const attrapeOiseauPayload: HandleSiropPayload = {
          playerName: siropActionPayload.attrapeOiseauPlayerName,
          chouetteValue: siropActionPayload.initialChouette.value,
          siropDieValue: siropActionPayload.siropDieValue,
          isAttrapeOiseau: true,
        };
        dispatch("handleSirop", attrapeOiseauPayload);
      } else {
        const siropPayload: HandleSiropPayload = {
          playerName: siropActionPayload.initialChouette.playerName,
          chouetteValue: siropActionPayload.initialChouette.value,
          siropDieValue: siropActionPayload.siropDieValue,
          turnNumber: siropActionPayload.initialChouette.turnNumber,
          isAttrapeOiseau: false,
        };
        dispatch("handleSirop", siropPayload);
      }

      const bidsPayload: HandleSiropBidsPayload = {
        chouetteValue: siropActionPayload.initialChouette.value,
        siropDieValue: siropActionPayload.siropDieValue,
        bids: siropActionPayload.bids,
      };

      dispatch("handleSiropBids", bidsPayload);

      dispatch("currentGame/handleEndTurn", null, { root: true });
    },
    handleSirop({ commit }, actionPayload: HandleSiropPayload): void {
      const isSiropWon =
        actionPayload.chouetteValue === actionPayload.siropDieValue;

      let amount: number;
      if (isSiropWon) {
        amount = getAmount(
          HistoryLineType.CUL_DE_CHOUETTE,
          actionPayload.chouetteValue
        );
      } else {
        amount = -getAmount(
          HistoryLineType.CHOUETTE,
          actionPayload.chouetteValue
        );
      }

      const apply: HistoryLineApply = {
        playerName: actionPayload.playerName,
        designation: actionPayload.isAttrapeOiseau
          ? HistoryLineType.ATTRAPE_OISEAU
          : HistoryLineType.SIROP,
        amount,
        turnNumber: actionPayload.turnNumber,
      };
      commit("currentGame/addHistoryLine", apply, { root: true });
    },
    handleSiropBids(
      { commit },
      { bids, chouetteValue, siropDieValue }: HandleSiropBidsPayload
    ): void {
      bids
        .filter(
          (bid) =>
            bid.designation !== BidType.COUCHE_SIROP &&
            bid.designation !== BidType.FILE_SIROP
        )
        .forEach((bid) => {
          const isCurrentBidValid = isBidValid(
            chouetteValue as DieValue,
            bid.designation,
            siropDieValue
          );

          let amount: number;
          if (isCurrentBidValid) {
            if (bid.isBidValidated) {
              amount = 25;
            } else {
              amount = 0;
            }
          } else {
            amount = -5;
          }

          const apply: HistoryLineApply = {
            playerName: bid.playerName,
            designation: HistoryLineType.SIROP_BID,
            amount,
          };
          commit("currentGame/addHistoryLine", apply, { root: true });
        });
    },
  },
};

interface HandleSiropPayload {
  playerName: string;
  chouetteValue: number;
  siropDieValue: DieValue;
  isAttrapeOiseau: boolean;
  turnNumber?: number;
}

interface HandleSiropBidsPayload {
  bids: Array<SiropBid>;
  chouetteValue: number;
  siropDieValue: DieValue;
}
