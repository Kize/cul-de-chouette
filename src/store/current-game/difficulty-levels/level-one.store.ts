import { Module } from "vuex";
import { RootState } from "@/store/app.state";

export interface LevelOneState {
  isSouffletteEnabled: boolean;
}

export const LeveLOneStoreModule: Module<LevelOneState, RootState> = {
  namespaced: true,
  state(): LevelOneState {
    return {
      isSouffletteEnabled: false
    };
  },
  mutations: {
    setIsSouffletteEnabled(state, isEnabled: boolean): void {
      state.isSouffletteEnabled = isEnabled;
    }
  }
};
