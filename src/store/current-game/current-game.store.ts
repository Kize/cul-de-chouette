import { Module } from "vuex";
import {
  CurrentGameState,
  GameStatus,
  SloubiActionPayload,
  StartGameData
} from "@/store/current-game/current-game.interface";
import { byName, getNextPlayer, Player } from "@/domain/player";
import {
  BasicHistoryLineAction,
  getAmount,
  HistoryLine,
  HistoryLineAction,
  HistoryLineApply,
  HistoryLineType,
  isActionChouetteVelute,
  mapHistoryActionToApply
} from "@/domain/history";
import { RootState } from "@/store/app.state";

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
    },
    getHighestPlayer(state, getters): Player {
      return [...state.players].sort((a: Player, b: Player) => {
        return getters.getPlayerScore(a) - getters.getPlayerScore(b);
      })[0];
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
    addPlayer(
      state,
      { player, previousPlayer }: { player: Player; previousPlayer?: string }
    ): void {
      const indexToInsert = !previousPlayer
        ? state.players.length
        : state.players.findIndex(byName(previousPlayer)) + 1;

      state.players.splice(indexToInsert, 0, {
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
    async startGame({ commit, dispatch }, data: StartGameData): Promise<void> {
      const playerNames = data.playerNames.filter(name => name.length > 0);

      const hasOnlyUniqueNames =
        [...new Set(playerNames)].length === playerNames.length;

      if (!hasOnlyUniqueNames) {
        throw new Error("Chaque joueur doit avoir un nom unique.");
      }

      if (playerNames.length < 2) {
        throw new Error("Il faut 2 joueurs minimum pour commencer une partie.");
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
    async sloubi(
      { state, commit, dispatch },
      sloubi: SloubiActionPayload
    ): Promise<void> {
      if (state.currentPlayerName !== state.players[0].name) {
        throw new Error("Le sloubi ne peut être tenté qu'en début de tour.");
      }

      if (state.players.length > 5) {
        throw new Error("Le jeu n'autorise que 6 joueurs dans une partie.");
      }

      if (state.players.map(player => player.name).includes(sloubi.name)) {
        throw new Error("Le nom de ce joueur est déjà pris.");
      }

      const player: Player = {
        name: sloubi.name,
        history: [
          { designation: HistoryLineType.SLOUBI, amount: Number(sloubi.score) }
        ],
        hasGrelottine: false
      };

      commit("addPlayer", { player, previousPlayer: sloubi.previousPlayer });

      await dispatch("saveGameToLocalStorage");
    },
    resumeGame({ commit }, currentGame: CurrentGameState): void {
      commit("setGame", currentGame);
    },
    handleEndTurn({ state, commit, dispatch, getters }): void {
      const highestPlayer = getters.getHighestPlayer;
      const isGameFinished = getters.getPlayerScore(highestPlayer.name) >= 343;
      console.log(highestPlayer.name, isGameFinished);
      if (isGameFinished) {
        commit("setGameStatus", GameStatus.FINISHED);
      } else {
        commit(
          "setCurrentPlayerName",
          getNextPlayer(state.players, state.currentPlayerName!)
        );

        dispatch("saveGameToLocalStorage");
      }
    },
    handleEndGame({ state, commit }, storage = localStorage): void {
      const game: CurrentGameState = {
        name: state.name,
        status: GameStatus.FINISHED,
        players: state.players
      };
      const history: Array<CurrentGameState> = JSON.parse(
        storage.getItem("games") || "[]"
      );

      history.push(game);
      storage.setItem("games", JSON.stringify(history));

      const nextGame: CurrentGameState = {
        status: GameStatus.CREATION,
        name: "",
        players: []
      };
      storage.setItem("currentGame", JSON.stringify(nextGame));
      commit("setGame", nextGame);
    },
    saveGameToLocalStorage({ state }, storage = localStorage): void {
      storage.setItem("currentGame", JSON.stringify(state));
    },
    playATurn({ state, commit, dispatch }, action: HistoryLineAction): void {
      if (state.currentPlayerName !== action.playerName) {
        return;
      }

      if (isActionChouetteVelute(action)) {
        if (action.shoutingPlayers.length === 1) {
          const newAction: BasicHistoryLineAction = {
            playerName: action.shoutingPlayers[0],
            designation: HistoryLineType.CHOUETTE_VELUTE,
            value: action.value
          };
          commit("addHistoryLine", mapHistoryActionToApply(newAction));
        } else {
          action.shoutingPlayers.forEach(playerName => {
            const apply: HistoryLineApply = {
              playerName,
              designation: HistoryLineType.CHOUETTE_VELUTE,
              amount: -getAmount(HistoryLineType.CHOUETTE_VELUTE, action.value)
            };
            commit("addHistoryLine", apply);
          });
        }
      } else {
        commit("addHistoryLine", mapHistoryActionToApply(action));
      }

      dispatch("handleEndTurn");
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
