import Vue from "vue";
import Vuex from "vuex";
import { CurrentGameStoreModule } from "@/store/current-game/current-game.store";
import { CurrentGameState } from "@/store/current-game/current-game.interface";

Vue.use(Vuex);
export type RootState = {
  currentGame?: CurrentGameState;
};

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    currentGame: CurrentGameStoreModule,
  },
});
