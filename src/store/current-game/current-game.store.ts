import { ActionContext, Module } from "vuex";
import {
  CurrentGameState,
  GameStatus,
  StartGameData
} from "@/store/current-game/current-game.interface";
import { byName, getNextPlayer, Player } from "@/domain/player";
import {
  HistoryLine,
  HistoryLineAction,
  HistoryLineApply,
  HistoryLineType,
  mapHistoryActionToApply
} from "@/domain/history";

type RootState = {};

type CurrentGameActionContext = ActionContext<CurrentGameState, RootState>;

export const CurrentGameStoreModule: Module<CurrentGameState, RootState> = {
  namespaced: true,
  state(): CurrentGameState {
    return {
      status: GameStatus.CREATION,
      name: "",
      players: []
    };
  },
  getters: {
    gameName(state): string {
      return state.name;
    },
    gameStatus(state): GameStatus {
      return state.status;
    },
    players(state): Array<Player> {
      return state.players;
    },
    currentPlayerName(state): string | undefined {
      return state.currentPlayerName;
    },
    canPlayerPlay(state) {
      return (playerName: string): boolean => {
        return playerName === state.currentPlayerName;
      };
    },
    getPlayerScore(state) {
      return (playerName: string): number => {
        const player = state.players.find(byName(playerName));
        if (!player) {
          return 0;
        }

        return player.history.reduce((score: number, line: HistoryLine) => {
          return score + line.amount;
        }, 0);
      };
    }
  },
  mutations: {
    setGame(state, newGame: CurrentGameState): void {
      state.status = newGame.status;
      state.name = newGame.name;
      state.players = newGame.players;
      state.currentPlayerName = newGame.currentPlayerName;
    },
    setCurrentPlayerName(state, name: string): void {
      state.currentPlayerName = name;
    },
    setGameStatus(state, status: GameStatus): void {
      state.status = status;
    },
    addPlayer(state, player: Player): void {
      state.players.push({
        name: player.name,
        history: player.history,
        hasGrelottine: player.hasGrelottine
      });
    },
    addHistoryLine(state, apply: HistoryLineApply): void {
      const player = state.players.find(byName(apply.playerName));

      if (player) {
        player.history.push({
          designation: apply.designation,
          amount: apply.amount
        });

        if (apply.designation === HistoryLineType.NEANT) {
          player.hasGrelottine = true;
        }
      }
    }
  },
  actions: {
    async startGame(
      { commit, dispatch }: CurrentGameActionContext,
      data: StartGameData
    ): Promise<void> {
      const playerNames = data.playerNames.filter(name => name.length > 0);

      const hasOnlyUniqueNames =
        [...new Set(playerNames)].length === playerNames.length;

      if (!hasOnlyUniqueNames) {
        throw new Error("Chaque joueur doit avoir un nom unique.");
      }

      if (playerNames.length < 3) {
        throw new Error("Il faut 3 joueurs minimum pour commencer une partie.");
      }

      const newGame: CurrentGameState = {
        status: GameStatus.IN_GAME,
        name: data.gameName,
        players: playerNames.map(name => ({
          name,
          history: [],
          hasGrelottine: false
        })),
        currentPlayerName: playerNames[0]
      };

      commit("setGame", newGame);
      await dispatch("saveGameToLocalStorage");
    },
    resumeGame({ commit }, currentGame: CurrentGameState): void {
      commit("setGame", currentGame);
    },
    saveGameToLocalStorage({ state }, storage = localStorage): void {
      storage.setItem("currentGame", JSON.stringify(state));
    },
    playATurn({ state, commit, dispatch }, action: HistoryLineAction): void {
      if (state.currentPlayerName === action.playerName) {
        commit("addHistoryLine", mapHistoryActionToApply(action));
        commit(
          "setCurrentPlayerName",
          getNextPlayer(state.players, action.playerName)
        );

        dispatch("saveGameToLocalStorage");
      }
    },
    applyBevue({ state, commit, dispatch }, playerName: string): void {
      const player = state.players.find(byName(playerName));
      if (player) {
        const action: HistoryLineAction = {
          playerName,
          value: 0,
          designation: HistoryLineType.BEVUE
        };
        commit("addHistoryLine", mapHistoryActionToApply(action));

        dispatch("saveGameToLocalStorage");
      } else {
        throw new Error(
          "La bévue n'a pas été appliquée. Le joueur n'a pas été trouvé"
        );
      }
    }
  }
};
