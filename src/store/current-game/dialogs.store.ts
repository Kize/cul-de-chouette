/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import { RootState } from "@/store/app.state";
import {
  PlayableBid,
  SiropResolutionPayload,
} from "../../../domain/rules/level-one/sirotage-rule";
import { DieValue } from "../../../domain/rules/dice-rule";
import { SouffletteResolutionPayload } from "../../../domain/rules/level-one/soufflette-rule";
import { SuiteResolutionPayload } from "../../../domain/rules/basic-rules/suite-rule";
import { ChouetteVeluteResolutionPayload } from "../../../domain/rules/basic-rules/chouette-velute-rule";
import { CivetResolutionPayload } from "../../../domain/rules/level-one/civet-rule";

export interface DialogsState {
  suiteResolverDialog: {
    isVisible: boolean;
    playerName: string;
  };
  chouetteVeluteResolverDialog: {
    isVisible: boolean;
    playerName: string;
  };

  siropResolverDialog: {
    isVisible: boolean;
    playerName: string;
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
  civetResolverDialog: {
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
        playerName: "",
      },
      chouetteVeluteResolverDialog: {
        isVisible: false,
        playerName: "",
      },
      siropResolverDialog: {
        isVisible: false,
        playerName: "",
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
      civetResolverDialog: {
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
    setCivetResolverIsVisible(state, isVisible): void {
      state.civetResolverDialog.isVisible = isVisible;
    },
    setBleuRougeResolverIsVisible(state, isVisible): void {
      state.bleuRougeResolverDialog.isVisible = isVisible;
    },
    setSiropResolverPayload(
      state,
      { playerName, playableBids, chouetteValue }: SiropResolutionPayload
    ): void {
      state.siropResolverDialog.playerName = playerName;
      state.siropResolverDialog.playableBids = playableBids;
      state.siropResolverDialog.chouetteValue = chouetteValue;
    },
    setSouffletteResolverPayload(
      state,
      { playerName }: SouffletteResolutionPayload
    ): void {
      state.souffletteResolverDialog.playerName = playerName;
    },
    setCivetResolverPayload(
      state,
      { playerName }: CivetResolutionPayload
    ): void {
      state.civetResolverDialog.playerName = playerName;
    },
    setSuiteResolverPayload(
      state,
      { playerName }: SuiteResolutionPayload
    ): void {
      state.suiteResolverDialog.playerName = playerName;
    },
    setChouetteVeluteResolverPayload(
      state,
      { playerName }: ChouetteVeluteResolutionPayload
    ): void {
      state.chouetteVeluteResolverDialog.playerName = playerName;
    },
  },
  actions: {
    openSuiteResolver({ commit }, payload: SuiteResolutionPayload): void {
      commit("setSuiteResolverPayload", payload);
      commit("setSuiteResolverIsVisible", true);
    },
    closeSuiteResolver({ commit }): void {
      commit("setSuiteResolverIsVisible", false);
    },

    openChouetteVeluteResolver(
      { commit },
      payload: ChouetteVeluteResolutionPayload
    ): void {
      commit("setChouetteVeluteResolverPayload", payload);
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

    openCivetResolver({ commit }, payload: CivetResolutionPayload): void {
      commit("setCivetResolverIsVisible", true);
      commit("setCivetResolverPayload", payload);
    },
    closeCivetResolver({ commit }): void {
      commit("setCivetResolverIsVisible", false);
    },

    openBleuRougeResolver({ commit }): void {
      commit("setBleuRougeResolverIsVisible", true);
    },
    closeBleuRougeResolver({ commit }): void {
      commit("setBleuRougeResolverIsVisible", false);
    },
  },
};
