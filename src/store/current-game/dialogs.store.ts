import { Module } from "vuex";
import { RootState } from "@/store/app.state";

export interface DialogsState {
  suiteResolverDialog: {
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
    };
  },
  getters: {},
  mutations: {
    setSuiteResolverIsVisible(state, isVisible): void {
      state.suiteResolverDialog.isVisible = isVisible;
    },
  },
  actions: {
    openSuiteResolver({ commit }): void {
      commit("setSuiteResolverIsVisible", true);
    },
  },
};
