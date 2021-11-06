/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import { RootState } from "@/store/app.state";

export interface RulesState {
  isSouffletteEnabled: boolean;
  isSiropEnabled: boolean;
  isAttrapeOiseauEnabled: boolean;
  isCivetEnabled: boolean;
  isArtichetteEnabled: boolean;
  isVerdierEnabled: boolean;
  isBleuRougeEnabled: boolean;
}

export const RulesStoreModule: Module<RulesState, RootState> = {
  namespaced: true,
  state(): RulesState {
    return {} as RulesState;
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
    setIsCivetEnabled(state, isEnabled: boolean): void {
      state.isCivetEnabled = isEnabled;
    },
    setIsVerdierEnabled(state, isEnabled: boolean): void {
      state.isVerdierEnabled = isEnabled;
    },
    setIsBleuRougeEnabled(state, isEnabled: boolean): void {
      state.isBleuRougeEnabled = isEnabled;
    },
    setIsArtichetteEnabled(state, isEnabled: boolean): void {
      state.isArtichetteEnabled = isEnabled;
    },
  },
};
