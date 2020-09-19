import { ActionContext, Module } from 'vuex';
import { GameStatus, Player, StartGameData } from '@/store/current-game/current-game.interface';

export interface CurrentGameState {
  status: GameStatus;
  name: string;
  players: Array<Player>;
}

type CurrentGameActionContext = ActionContext<CurrentGameState, any>

export const CurrentGameStoreModule: Module<CurrentGameState, any> = {
  namespaced: true,
  state(): CurrentGameState {
    return {
      status: GameStatus.CREATION,
      name: '',
      players: [],
    };
  },
  getters: {
    gameName(state): string {
      return state.name;
    },
    gameStatus(state): GameStatus {
      return state.status;
    },
  },
  mutations: {
    setGame(state, newGame: CurrentGameState): void {
      state.status = newGame.status;
      state.name = newGame.name;
      state.players = newGame.players;
    },
    setGameStatus(state, status: GameStatus): void {
      state.status = status;
    },
    addPlayer(state, player: Player): void {
      state.players.push({
        name: player.name,
        history: player.history,
      });
    },
  },
  actions: {
    async startGame({ commit, dispatch }: CurrentGameActionContext, data: StartGameData): Promise<void> {
      const playerNames = data.playerNames.filter(name => name.length > 0);

      if (playerNames.length < 3) {
        throw new Error('Il faut 3 joueurs minimum pour commencer une partie.');
      }

      const newGame: CurrentGameState = {
        status: GameStatus.IN_GAME,
        name: data.gameName,
        players: data.playerNames.map(name => ({ name, history: [] })),
      };

      commit('setGame', newGame);
      await dispatch('saveGameToLocalStorage');
    },
    resumeGame({ commit, dispatch }, currentGame: CurrentGameState): void {
      commit('setGame', currentGame);
    },
    saveGameToLocalStorage({ state }, storage = localStorage): void {
      storage.setItem('currentGame', JSON.stringify(state));
    },
  },
};
