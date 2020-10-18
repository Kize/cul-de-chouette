import { Module } from "vuex";
import {
  AddOperationLinesActionPayload,
  CurrentGameState,
  GameStatus,
  NewGameForm,
  SavedCurrentGame,
  Scoreboard,
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
import { RulesStoreModule } from "@/store/current-game/difficulty-levels/rules.store";

export const CurrentGameStoreModule: Module<CurrentGameState, RootState> = {
  namespaced: true,
  modules: {
    play: MainPlayableActionsStoreModule,
    rules: RulesStoreModule
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
    sloubiScore(state, getters): number {
      const [bestScore, secondBestScore] = state.players
        .map(player => ({
          name: player.name,
          score: getters.getPlayerScore(player.name)
        }))
        .sort((p1, p2) => p2.score - p1.score)
        .slice(0, 2)
        .map(p => p.score);

      return Math.trunc(
        ((bestScore - secondBestScore) * state.turnNumber) / 10
      );
    },
    scoreboard(state, getters): Scoreboard {
      return state.players
        .map(player => {
          return {
            playerName: player.name,
            score: getters["getPlayerScore"](player.name)
          };
        })
        .sort((p1, p2) => p2.score - p1.score);
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
      state.turnNumber = newGame.turnNumber;
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
        "rules/levelOne/setIsSouffletteEnabled",
        form.levelOne.isSouffletteEnabled
      );

      await dispatch("saveGameToLocalStorage");
    },
    resumeGame({ commit }, currentGame: SavedCurrentGame): void {
      commit("setGame", currentGame);
      commit(
        "rules/levelOne/setIsSouffletteEnabled",
        currentGame.rules.levelOne
          ? currentGame.rules.levelOne.isSouffletteEnabled
          : false
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
    handleEndGame({ state, commit, dispatch }, storage = localStorage): void {
      const game: CurrentGameState = { ...state };
      const history: Array<CurrentGameState> = JSON.parse(
        storage.getItem("games") || "[]"
      );

      history.push(game);
      storage.setItem("games", JSON.stringify(history));

      dispatch("nextGame");
    },
    nextGame({ commit }, storage = localStorage): void {
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
    addOperations(
      { dispatch, commit, state },
      actionPayload: AddOperationLinesActionPayload
    ): void {
      actionPayload.operations.forEach(operation => {
        const apply: HistoryLineApply = {
          designation: operation.designation,
          playerName: operation.playerName,
          amount: operation.amount,
          turnNumber: operation.shouldDisplayTurnNumber
            ? state.turnNumber
            : undefined
        };

        commit("addHistoryLine", apply);
      });

      if (actionPayload.shouldHandleEndTurn) {
        dispatch("handleEndTurn");
      } else {
        dispatch("checkEndGame");
      }
    },
    async sloubi(
      { state, commit, dispatch, getters },
      sloubi: SloubiActionPayload
    ): Promise<void> {
      if (state.players.length > 5) {
        throw new Error("Le jeu n'autorise que 6 joueurs dans une partie.");
      }

      if (state.players.map(player => player.name).includes(sloubi.name)) {
        throw new Error("Le nom de ce joueur est déjà pris.");
      }

      const sloubiAmount = sloubi.isSloubiCompleted
        ? Math.trunc(getters["sloubiScore"] * 1.5)
        : getters["sloubiScore"];

      const player: Player = {
        name: sloubi.name,
        history: [
          {
            designation: HistoryLineType.SLOUBI,
            amount: sloubiAmount,
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
