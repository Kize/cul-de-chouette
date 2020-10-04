import { Module } from "vuex";
import {
  CurrentGameState,
  GameStatus,
  NewGameForm,
  SavedCurrentGame,
  SloubiActionPayload
} from "@/store/current-game/current-game.interface";
import {
  byName,
  computePlayerScore,
  getNextPlayer,
  Player
} from "@/domain/player";
import {
  HistoryLineAction,
  HistoryLineApply,
  HistoryLineType,
  mapHistoryActionToApply
} from "@/domain/history";
import { RootState } from "@/store/app.state";
import {
  GrelottineActionPayload,
  isGrelottineChallengeSuccessful
} from "@/domain/grelottine";
import { MainPlayableActionsStoreModule } from "@/store/current-game/main-playable-actions.store";
import { LeveLOneStoreModule } from "@/store/current-game/difficulty-levels/level-one.store";

export const CurrentGameStoreModule: Module<CurrentGameState, RootState> = {
  namespaced: true,
  modules: {
    play: MainPlayableActionsStoreModule,
    levelOne: LeveLOneStoreModule
  },
  state(): CurrentGameState {
    return {
      status: GameStatus.CREATION,
      name: "",
      players: [],
      currentPlayerName: "",
      turnNumber: 1
    };
  },
  getters: {
    getState(state): CurrentGameState {
      return state;
    },
    playerNames(state): Array<string> {
      return state.players.map(player => player.name);
    },
    currentPlayer(state): Player {
      return state.players.find(
        player => player.name === state.currentPlayerName
      )!;
    },
    isCurrentPlayer(state) {
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

        return computePlayerScore(player);
      };
    },
    highestPlayer(state, getters): { name: string; score: number } {
      return state.players
        .map(player => ({
          name: player.name,
          score: getters.getPlayerScore(player.name)
        }))
        .reduce(
          (bestPlayer, currentPlayer) =>
            bestPlayer.score >= currentPlayer.score
              ? bestPlayer
              : currentPlayer,
          { name: "", score: -1 }
        );
    }
  },
  mutations: {
    setGame(state, newGame: CurrentGameState): void {
      state.status = newGame.status;
      state.name = newGame.name;
      state.players = newGame.players;
      state.currentPlayerName = newGame.currentPlayerName;
    },
    setGameStatus(state, status: GameStatus): void {
      state.status = status;
    },
    setCurrentPlayerName(state, name: string): void {
      state.currentPlayerName = name;
    },
    incrementTurnNumber(state): void {
      state.turnNumber += 1;
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
          amount: apply.amount,
          turnNumber: apply.turnNumber
        });
      }
    },
    addGrelottine(state, playerName: string): void {
      const player = state.players.find(byName(playerName));

      if (player) {
        player.hasGrelottine = true;
      }
    },
    removeGrelottine(state, playerName: string): void {
      const player = state.players.find(byName(playerName));

      if (player) {
        player.hasGrelottine = false;
      }
    }
  },
  actions: {
    async startGame({ commit, dispatch }, form: NewGameForm): Promise<void> {
      const playerNames = form.playerNames.filter(name => name.length > 0);

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
        name: form.gameName,
        players: playerNames.map(name => ({
          name,
          history: [],
          hasGrelottine: false
        })),
        currentPlayerName: playerNames[0],
        turnNumber: 1
      };

      commit("setGame", newGame);

      commit(
        "levelOne/setIsSouffletteEnabled",
        form.levelOne.isSouffletteEnabled
      );

      await dispatch("saveGameToLocalStorage");
    },
    resumeGame({ commit }, currentGame: SavedCurrentGame): void {
      commit("setGame", currentGame);
      commit(
        "levelOne/setIsSouffletteEnabled",
        currentGame.levelOne.isSouffletteEnabled
      );
    },
    async checkEndGame({ commit, getters, dispatch }): Promise<boolean> {
      const highestPlayer = getters.highestPlayer;
      const isGameFinished = highestPlayer.score >= 343;

      if (isGameFinished) {
        commit("setGameStatus", GameStatus.FINISHED);
      } else {
        await dispatch("saveGameToLocalStorage");
      }

      return isGameFinished;
    },
    async handleEndTurn({ state, commit, dispatch }): Promise<void> {
      const isGameFinished = await dispatch("checkEndGame");

      if (!isGameFinished) {
        const nextPlayerName = getNextPlayer(
          state.players,
          state.currentPlayerName!
        );

        commit("setCurrentPlayerName", nextPlayerName);

        if (nextPlayerName === state.players[0].name) {
          commit("incrementTurnNumber");
        }

        await dispatch("saveGameToLocalStorage");
      }
    },
    handleEndGame({ state, commit }, storage = localStorage): void {
      const game: CurrentGameState = {
        name: state.name,
        status: GameStatus.FINISHED,
        players: state.players,
        currentPlayerName: state.currentPlayerName,
        turnNumber: state.turnNumber
      };
      const history: Array<CurrentGameState> = JSON.parse(
        storage.getItem("games") || "[]"
      );

      history.push(game);
      storage.setItem("games", JSON.stringify(history));

      const nextGame: CurrentGameState = {
        status: GameStatus.CREATION,
        name: "",
        players: [],
        currentPlayerName: "",
        turnNumber: 1
      };
      storage.setItem("currentGame", JSON.stringify(nextGame));
      commit("setGame", nextGame);
    },
    saveGameToLocalStorage({ state }, storage = localStorage): void {
      storage.setItem("currentGame", JSON.stringify(state));
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
          {
            designation: HistoryLineType.SLOUBI,
            amount: Number(sloubi.score),
            turnNumber: state.turnNumber
          }
        ],
        hasGrelottine: false
      };

      commit("addPlayer", { player, previousPlayer: sloubi.previousPlayer });

      await dispatch("saveGameToLocalStorage");
    },
    async grelottineChallenge(
      { commit, dispatch },
      grelottineActionPayload: GrelottineActionPayload
    ): Promise<void> {
      const isChallengePassed = isGrelottineChallengeSuccessful(
        grelottineActionPayload.challenge,
        grelottineActionPayload.challengedPlayerAction
      );

      let winner: string, looser: string;
      if (isChallengePassed) {
        winner = grelottineActionPayload.challengedPlayer;
        looser = grelottineActionPayload.grelottin;
      } else {
        winner = grelottineActionPayload.grelottin;
        looser = grelottineActionPayload.challengedPlayer;
      }

      const winnerApply: HistoryLineApply = {
        playerName: winner,
        designation: HistoryLineType.GRELOTTINE_CHALLENGE,
        amount: grelottineActionPayload.gambledAmount
      };
      commit("addHistoryLine", winnerApply);

      const looserApply: HistoryLineApply = {
        playerName: looser,
        designation: HistoryLineType.GRELOTTINE_CHALLENGE,
        amount: -grelottineActionPayload.gambledAmount
      };
      commit("addHistoryLine", looserApply);

      dispatch(
        "currentGame/play/handlePlayerLineAction",
        grelottineActionPayload.challengedPlayerAction,
        { root: true }
      );
      commit("removeGrelottine", grelottineActionPayload.grelottin);

      await dispatch("checkEndGame");
    }
  }
};
