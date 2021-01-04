/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import { RootState } from "@/store/app.state";
import {
  PlayableBid,
  SiropResolutionPayload,
} from "../../../domain/rules/level-one/sirotage-rule";
import { DieValue } from "../../../domain/rules/dice-rule";
import { SouffletteResolutionPayload } from "../../../domain/rules/level-one/soufflette-rule";

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
  grelottineResolverDialog: {
    isVisible: boolean;
  };
  souffletteResolverDialog: {
    isVisible: boolean;
    playerName: string;
  };
  bleuRougeResolverDialog: {
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
      siropResolverDialog: {
        isVisible: false,
        chouetteValue: undefined,
        playableBids: [],
      },
      grelottineResolverDialog: {
        isVisible: false,
      },
      souffletteResolverDialog: {
        isVisible: false,
        playerName: "",
      },
      bleuRougeResolverDialog: {
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
    setSiropResolverIsVisible(state, isVisible): void {
      state.siropResolverDialog.isVisible = isVisible;
    },
    setGrelottineResolverIsVisible(state, isVisible): void {
      state.grelottineResolverDialog.isVisible = isVisible;
    },
    setSouffletteResolverIsVisible(state, isVisible): void {
      state.souffletteResolverDialog.isVisible = isVisible;
    },
    setBleuRougeResolverIsVisible(state, isVisible): void {
      state.bleuRougeResolverDialog.isVisible = isVisible;
    },
    setSiropResolverPayload(
      state,
      { playableBids, chouetteValue }: SiropResolutionPayload
    ): void {
      state.siropResolverDialog.playableBids = playableBids;
      state.siropResolverDialog.chouetteValue = chouetteValue;
    },
    setSouffletteResolverPayload(
      state,
      { playerName }: SouffletteResolutionPayload
    ): void {
      state.souffletteResolverDialog.playerName = playerName;
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
    openGrelottineResolver({ commit }): void {
      commit("setGrelottineResolverIsVisible", true);
    },
    closeGrelottineResolver({ commit }): void {
      commit("setGrelottineResolverIsVisible", false);
    },
    openSouffletteResolver(
      { commit },
      payload: SouffletteResolutionPayload
    ): void {
      commit("setSouffletteResolverIsVisible", true);
      commit("setSouffletteResolverPayload", payload);
    },
    closeSouffletteResolver({ commit }): void {
      commit("setSouffletteResolverIsVisible", false);
    },
    openBleuRougeResolver({ commit }): void {
      commit("setBleuRougeResolverIsVisible", true);
    },
    closeBleuRougeResolver({ commit }): void {
      commit("setBleuRougeResolverIsVisible", false);
    },
  },
};
