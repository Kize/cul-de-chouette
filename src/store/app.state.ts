import Vue from "vue";
import Vuex from "vuex";
import { CurrentGameStoreModule } from "@/store/current-game/current-game.store";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    currentGame: CurrentGameStoreModule
  }
});
