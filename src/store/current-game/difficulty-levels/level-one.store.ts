/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import { RootState } from "@/store/app.state";

export interface LevelOneState {
  isSouffletteEnabled: boolean;
  isSiropEnabled: boolean;
  isAttrapeOiseauEnabled: boolean;
  isBleuRougeEnabled: boolean;
}

export const LevelOneStoreModule: Module<LevelOneState, RootState> = {
  namespaced: true,
  state(): LevelOneState {
    return {
      isSouffletteEnabled: false,
      isSiropEnabled: false,
      isAttrapeOiseauEnabled: false,
      isBleuRougeEnabled: false,
    };
  },
  mutations: {
    setIsSouffletteEnabled(state, isEnabled: boolean): void {
      state.isSouffletteEnabled = isEnabled;
    },
    setIsSiropEnabled(state, isEnabled: boolean): void {
      state.isSiropEnabled = isEnabled;
    },
    setIsAttrapeOiseauEnabled(state, isEnabled: boolean): void {
      state.isAttrapeOiseauEnabled = isEnabled;
    },
    setIsBleuRougeEnabled(state, isEnabled: boolean): void {
      state.isBleuRougeEnabled = isEnabled;
    },
  },
  actions: {},
};
