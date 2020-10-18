import { Module } from "vuex";
import { RootState } from "@/store/app.state";
import {
  LevelOneState,
  LevelOneStoreModule
} from "@/store/current-game/difficulty-levels/level-one.store";

export interface RulesState {
  levelOne: LevelOneState;
}

export const RulesStoreModule: Module<RulesState, RootState> = {
  namespaced: true,
  modules: {
    levelOne: LevelOneStoreModule
  },
  state(): RulesState {
    return {} as RulesState;
  },
  getters: {
    getRules(state): RulesState {
      return state;
    }
  }
};
