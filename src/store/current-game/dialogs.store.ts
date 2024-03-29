/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import { RootState } from "@/store/app.state";
import { SiropResolutionPayload } from "../../../domain/rules/level-1/sirotage-rule";
import { DieValue } from "../../../domain/rules/dice-rule";
import { SouffletteResolutionPayload } from "../../../domain/rules/level-1/soufflette-rule";
import { SuiteResolutionPayload } from "../../../domain/rules/basic-rules/suite-rule";
import { ChouetteVeluteResolutionPayload } from "../../../domain/rules/basic-rules/chouette-velute-rule";
import { CivetResolutionPayload } from "../../../domain/rules/level-1/civet-rule";
import { PlayableBid } from "../../../domain/rules/level-1/sirotage-rule.types";
import { ArtichetteResolutionPayload } from "../../../domain/rules/level-2/artichette-rule";
import { VerdierResolutionPayload } from "../../../domain/rules/level-3/verdier-rule";

export interface DialogsState {
  addOperationLinesDialog: {
    isVisible: boolean;
  };
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
  artichetteResolverDialog: {
    isVisible: boolean;
    playerName: string;
  };
  verdierResolverDialog: {
    isVisible: boolean;
    playerName: string;
    diceValues: [DieValue, DieValue];
  };
}

export const DialogsStoreModule: Module<DialogsState, RootState> = {
  namespaced: true,
  state(): DialogsState {
    return {
      addOperationLinesDialog: {
        isVisible: false,
      },
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
      artichetteResolverDialog: {
        isVisible: false,
        playerName: "",
      },
      verdierResolverDialog: {
        isVisible: false,
        playerName: "",
        diceValues: [1, 1],
      },
    };
  },
  getters: {},
  mutations: {
    setAddOperationLinesDialogIsVisible(state, isVisible): void {
      state.addOperationLinesDialog.isVisible = isVisible;
    },
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
    setArtichetteResolverIsVisible(state, isVisible): void {
      state.artichetteResolverDialog.isVisible = isVisible;
    },
    setVerdierResolverIsVisible(state, isVisible): void {
      state.verdierResolverDialog.isVisible = isVisible;
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
    setArtichetteResolverPayload(
      state,
      { playerName }: ArtichetteResolutionPayload
    ): void {
      state.artichetteResolverDialog.playerName = playerName;
    },
    setVerdierResolverPayload(
      state,
      { playerName, diceValues }: VerdierResolutionPayload
    ): void {
      state.verdierResolverDialog.playerName = playerName;
      state.verdierResolverDialog.diceValues = diceValues;
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

    openArtichetteResolver(
      { commit },
      payload: ArtichetteResolutionPayload
    ): void {
      commit("setArtichetteResolverPayload", payload);
      commit("setArtichetteResolverIsVisible", true);
    },
    closeArtichetteResolver({ commit }): void {
      commit("setArtichetteResolverIsVisible", false);
    },

    openVerdierResolver({ commit }, payload: VerdierResolutionPayload): void {
      commit("setVerdierResolverPayload", payload);
      commit("setVerdierResolverIsVisible", true);
    },
    closeVerdierResolver({ commit }): void {
      commit("setVerdierResolverIsVisible", false);
    },
  },
};
