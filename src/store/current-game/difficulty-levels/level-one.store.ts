/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import { RootState } from "@/store/app.state";

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
      // TODO DAU : add the form to active rule
      isSiropEnabled: true,
      isAttrapeOiseauEnabled: true,
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
  },
  actions: {},
};
