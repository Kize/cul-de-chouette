/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import { RootState } from "@/store/app.state";
import { DieValue } from "../../../domain/rules/rule";
import {
  PlayableBid,
  SiropResolutionPayload,
} from "../../../domain/rules/level-one/sirotage-rule";

export interface DialogsState {
  suiteResolverDialog: {
    isVisible: boolean;
  };
  chouetteVeluteResolverDialog: {
    isVisible: boolean;
  };

  siropResolverDialog: {
    isVisible: boolean;
    chouetteValue?: DieValue;
    playableBids: Array<PlayableBid>;
  };
}

export const DialogsStoreModule: Module<DialogsState, RootState> = {
  namespaced: true,
  state(): DialogsState {
    return {
      suiteResolverDialog: {
        isVisible: false,
      },
      chouetteVeluteResolverDialog: {
        isVisible: false,
      },
      siropResolverDialog: {
        isVisible: false,
        chouetteValue: undefined,
        playableBids: [],
      },
    };
  },
  getters: {},
  mutations: {
    setSuiteResolverIsVisible(state, isVisible): void {
      state.suiteResolverDialog.isVisible = isVisible;
    },
    setChouetteVeluteResolverIsVisible(state, isVisible): void {
      state.chouetteVeluteResolverDialog.isVisible = isVisible;
    },
    setSiropResolverIsVisible(state, isVisible): void {
      state.siropResolverDialog.isVisible = isVisible;
    },
    setSiropResolverPayload(
      state,
      { playableBids, chouetteValue }: SiropResolutionPayload
    ): void {
      state.siropResolverDialog.playableBids = playableBids;
      state.siropResolverDialog.chouetteValue = chouetteValue;
    },
  },
  actions: {
    openSuiteResolver({ commit }): void {
      commit("setSuiteResolverIsVisible", true);
    },
    closeSuiteResolver({ commit }): void {
      commit("setSuiteResolverIsVisible", false);
    },
    openChouetteVeluteResolver({ commit }): void {
      commit("setChouetteVeluteResolverIsVisible", true);
    },
    closeChouetteVeluteResolver({ commit }): void {
      commit("setChouetteVeluteResolverIsVisible", false);
    },
    openSiropResolver({ commit }, payload: SiropResolutionPayload): void {
      commit("setSiropResolverIsVisible", true);
      commit("setSiropResolverPayload", payload);
    },
    closeSiropResolver({ commit }): void {
      commit("setSiropResolverIsVisible", false);
    },
  },
};
