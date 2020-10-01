import { Module } from "vuex";
import {
  CurrentGameState,
  GameStatus,
  SloubiActionPayload,
  StartGameData
} from "@/store/current-game/current-game.interface";
import {
  byName,
  computePlayerScore,
  getNextPlayer,
  Player
} from "@/domain/player";
import {
  BasicHistoryLineAction,
  ChouetteVeluteHistoryLineAction,
  getAmount,
  HistoryLineAction,
  HistoryLineApply,
  HistoryLineType,
  mapHistoryActionToApply,
  SuiteHistoryLineAction
} from "@/domain/history";
import { RootState } from "@/store/app.state";
import {
  GrelottineActionPayload,
  isGrelottineChallengeSuccessful
} from "@/domain/grelottine";

export const CurrentGameStoreModule: Module<CurrentGameState, RootState> = {
  namespaced: true,
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
    playerNames(state): Array<string> {
      return state.players.map(player => player.name);
    },
    grelottinePlayers(state, getters): Array<string> {
      return state.players
        .filter(player => player.hasGrelottine)
        .filter(player => getters.getPlayerScore(player.name) > 0)
        .map(player => player.name);
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
    setCurrentPlayerName(state, name: string): void {
      state.currentPlayerName = name;
    },
    setGameStatus(state, status: GameStatus): void {
      state.status = status;
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

        if (apply.designation === HistoryLineType.NEANT) {
          player.hasGrelottine = true;
        }
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
        currentPlayerName: playerNames[0],
        turnNumber: 1
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
    resumeGame({ commit }, currentGame: CurrentGameState): void {
      commit("setGame", currentGame);
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
    playATurn({ state, commit, dispatch }, action: HistoryLineAction): void {
      if (state.currentPlayerName !== action.playerName) {
        return;
      }

      switch (action.designation) {
        case HistoryLineType.CHOUETTE_VELUTE:
          dispatch("handleChouetteVeluteAction", action);
          break;
        case HistoryLineType.SUITE:
          dispatch("handleSuiteAction", action);
          break;
        default:
          commit("addHistoryLine", mapHistoryActionToApply(action));
      }

      dispatch("handleEndTurn");
    },
    handleChouetteVeluteAction(
      { commit, getters },
      action: ChouetteVeluteHistoryLineAction
    ): void {
      if (action.shoutingPlayers.length === 1) {
        const newAction: BasicHistoryLineAction = {
          playerName: action.shoutingPlayers[0],
          designation: HistoryLineType.CHOUETTE_VELUTE,
          value: action.value,
          turnNumber: getters.isCurrentPlayer(action.shoutingPlayers[0])
            ? action.turnNumber
            : undefined
        };
        commit("addHistoryLine", mapHistoryActionToApply(newAction));
      } else {
        action.shoutingPlayers.forEach(playerName => {
          const historyLineApply = mapHistoryActionToApply({
            playerName,
            designation: HistoryLineType.CHOUETTE_VELUTE,
            value: action.value,
            turnNumber: getters.isCurrentPlayer(playerName)
              ? action.turnNumber
              : undefined
          });

          historyLineApply.amount = -historyLineApply.amount;
          commit("addHistoryLine", historyLineApply);
        });
      }

      if (!action.shoutingPlayers.includes(action.playerName)) {
        commit(
          "addHistoryLine",
          mapHistoryActionToApply({
            playerName: action.playerName,
            designation: HistoryLineType.CHOUETTE_VELUTE,
            value: 0,
            turnNumber: action.turnNumber
          })
        );
      }
    },
    handleSuiteAction({ commit }, action: SuiteHistoryLineAction): void {
      const isCurrentPlayerTheLooser =
        action.loosingPlayerName === action.playerName;

      if (!isCurrentPlayerTheLooser) {
        const historyLineAction: HistoryLineAction = {
          playerName: action.loosingPlayerName,
          designation: HistoryLineType.SUITE,
          value: action.multiplier * 10
        };
        commit("addHistoryLine", mapHistoryActionToApply(historyLineAction));
      }

      const value = isCurrentPlayerTheLooser ? action.multiplier * 10 : 0;
      const historyLineApply = mapHistoryActionToApply({
        playerName: action.playerName,
        designation: HistoryLineType.SUITE,
        value,
        turnNumber: action.turnNumber
      });

      if (action.isVelute) {
        historyLineApply.amount += getAmount(HistoryLineType.VELUTE, 3);
      }

      commit("addHistoryLine", historyLineApply);
    },
    async grelottineChallenge(
      { commit, dispatch },
      grelottineActionPayload: GrelottineActionPayload
    ): Promise<void> {
      switch (grelottineActionPayload.challengedPlayerAction.designation) {
        case HistoryLineType.CHOUETTE_VELUTE:
          dispatch(
            "handleChouetteVeluteAction",
            grelottineActionPayload.challengedPlayerAction
          );
          break;
        case HistoryLineType.SUITE:
          dispatch(
            "handleSuiteAction",
            grelottineActionPayload.challengedPlayerAction
          );
          break;
        default:
          commit(
            "addHistoryLine",
            mapHistoryActionToApply(
              grelottineActionPayload.challengedPlayerAction
            )
          );
      }

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

      commit("removeGrelottine", grelottineActionPayload.grelottin);

      await dispatch("checkEndGame");
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
