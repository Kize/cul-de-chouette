/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import { RootState } from "@/store/app.state";

export interface DialogsState {
  suiteResolverDialog: {
    isVisible: boolean;
  };
  chouetteVeluteResolverDialog: {
    isVisible: boolean;
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
  },
  actions: {
    openSuiteResolver({ commit }): void {
      commit("setSuiteResolverIsVisible", true);
    },
    openChouetteVeluteResolver({ commit }): void {
      commit("setChouetteVeluteResolverIsVisible", true);
    },
  },
};
