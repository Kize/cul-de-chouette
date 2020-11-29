/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import {
  AddOperationLinesActionPayload,
  CurrentGameState,
  GameStatus,
  NewGameForm,
  SavedCurrentGame,
  Scoreboard,
  SloubiActionPayload,
} from "@/store/current-game/current-game.interface";
import {
  byName,
  computePlayerScore,
  getNextPlayer,
  Player,
} from "../../../domain/player";
import { HistoryLineApply } from "@/domain/history";
import { RootState } from "@/store/app.state";
import { MainPlayableActionsStoreModule } from "@/store/current-game/main-playable-actions.store";
import { RulesState, RulesStoreModule } from "@/store/current-game/rules.store";
import { DialogsStoreModule } from "@/store/current-game/dialogs.store";
import {
  ALL_RULES_ORDERED,
  gameRuleRunner,
  RuleName,
} from "@/store/current-game/game-rule-runner";
import { RuleEffectEvent } from "../../../domain/rules/rule-effect";

export const CurrentGameStoreModule: Module<CurrentGameState, RootState> = {
  namespaced: true,
  modules: {
    play: MainPlayableActionsStoreModule,
    rules: RulesStoreModule,
    dialogs: DialogsStoreModule,
  },
  state(): CurrentGameState {
    return {
      status: GameStatus.CREATION,
      name: "",
      players: [],
      currentPlayerName: "",
      turnNumber: 1,
    };
  },
  getters: {
    getState(state): CurrentGameState {
      return state;
    },
    playerNames(state): Array<string> {
      return state.players.map((player) => player.name);
    },
    currentPlayer(state): Player {
      return state.players.find(
        (player) => player.name === state.currentPlayerName
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
        .map((player) => getters.getPlayerScore(player.name))
        .sort((score1, score2) => score2 - score1)
        .slice(0, 2);

      return Math.trunc(
        ((bestScore - secondBestScore) * state.turnNumber) / 10
      );
    },
    scoreboard(state, getters): Scoreboard {
      return state.players
        .map((player) => {
          return {
            playerName: player.name,
            score: getters["getPlayerScore"](player.name),
          };
        })
        .sort((p1, p2) => p2.score - p1.score);
    },
    highestPlayer(state, getters): { name: string; score: number } {
      return state.players
        .map((player) => ({
          name: player.name,
          score: getters.getPlayerScore(player.name),
        }))
        .reduce(
          (bestPlayer, currentPlayer) =>
            bestPlayer.score >= currentPlayer.score
              ? bestPlayer
              : currentPlayer,
          { name: "", score: -1 }
        );
    },
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
        hasGrelottine: player.hasGrelottine,
        hasJarret: player.hasJarret,
      });
    },
    addHistoryLine(state, apply: HistoryLineApply): void {
      const player = state.players.find(byName(apply.playerName));

      if (player) {
        player.history.push({
          designation: apply.designation,
          amount: apply.amount,
          turnNumber: apply.turnNumber,
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
    },
    addJarret(state, playerName: string): void {
      const player = state.players.find(byName(playerName));

      if (player) {
        player.hasJarret = true;
      }
    },
  },
  actions: {
    async startGame(
      { commit, dispatch },
      { gameName, playerNames, rules }: NewGameForm
    ): Promise<void> {
      const notEmptyPlayerNames = playerNames.filter((name) => name.length > 0);

      const hasOnlyUniqueNames =
        [...new Set(notEmptyPlayerNames)].length === notEmptyPlayerNames.length;

      if (!hasOnlyUniqueNames) {
        throw new Error("Chaque joueur doit avoir un nom unique.");
      }

      const newGame: CurrentGameState = {
        status: GameStatus.IN_GAME,
        name: gameName,
        players: notEmptyPlayerNames.map((name) => ({
          name,
          history: [],
          hasGrelottine: false,
          hasJarret: false,
        })),
        currentPlayerName: notEmptyPlayerNames[0],
        turnNumber: 1,
      };
      commit("setGame", newGame);
      dispatch("configureGameRules", rules);

      await dispatch("saveGameToLocalStorage");
    },
    configureGameRules({ commit }, payload: RulesState): void {
      const enabledRules = new Set([
        RuleName.CUL_DE_CHOUETTE,
        RuleName.SUITE,
        RuleName.CHOUETTE_VELUTE,
        RuleName.VELUTE,
        RuleName.CHOUETTE,
        RuleName.NEANT,
        RuleName.GRELOTTINE,
        RuleName.BEVUE,
      ]);

      if (payload?.isSouffletteEnabled) {
        commit("rules/setIsSouffletteEnabled", true);
        enabledRules.add(RuleName.SOUFFLETTE);
      } else {
        commit("rules/setIsSouffletteEnabled", false);
      }

      if (payload?.isSiropEnabled) {
        commit("rules/setIsSiropEnabled", true);
        enabledRules.add(RuleName.SIROTAGE);
      } else {
        commit("rules/setIsSiropEnabled", false);
      }

      if (payload?.isAttrapeOiseauEnabled) {
        commit("rules/setIsAttrapeOiseauEnabled", true);
        enabledRules.add(RuleName.ATTRAPE_OISEAU);
      } else {
        commit("rules/setIsAttrapeOiseauEnabled", false);
      }

      if (payload?.isBleuRougeEnabled) {
        commit("rules/setIsBleuRougeEnabled", true);
        enabledRules.add(RuleName.BLEU_ROUGE);
      } else {
        commit("rules/setIsBleuRougeEnabled", false);
      }

      const rulesToEnable = ALL_RULES_ORDERED.filter(({ name }) =>
        enabledRules.has(name)
      ).map(({ rule }) => rule);

      gameRuleRunner.setRules(rulesToEnable);
    },
    resumeGame({ commit, dispatch }, currentGame: SavedCurrentGame): void {
      commit("setGame", currentGame);
      dispatch("configureGameRules", currentGame.rules);
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
    handleEndGame({ state, dispatch }, storage = localStorage): void {
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
        turnNumber: 1,
      };
      storage.setItem("currentGame", JSON.stringify(nextGame));
      commit("setGame", nextGame);
    },
    saveGameToLocalStorage({ state }, storage = localStorage): void {
      storage.setItem("currentGame", JSON.stringify(state));
    },
    addOperations(
      { dispatch, commit, state },
      actionPayload: AddOperationLinesActionPayload
    ): void {
      actionPayload.operations.forEach((operation) => {
        const apply: HistoryLineApply = {
          designation: operation.designation,
          playerName: operation.playerName,
          amount: operation.amount,
          turnNumber: operation.shouldDisplayTurnNumber
            ? state.turnNumber
            : undefined,
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

      if (state.players.map((player) => player.name).includes(sloubi.name)) {
        throw new Error("Le nom de ce joueur est déjà pris.");
      }

      const sloubiAmount = sloubi.isSloubiCompleted
        ? Math.trunc(getters["sloubiScore"] * 1.5)
        : getters["sloubiScore"];

      const player: Player = {
        name: sloubi.name,
        history: [
          {
            designation: RuleEffectEvent.SLOUBI,
            amount: sloubiAmount,
            turnNumber: state.turnNumber,
          },
        ],
        hasGrelottine: false,
        hasJarret: false,
      };

      commit("addPlayer", { player, previousPlayer: sloubi.previousPlayer });

      await dispatch("saveGameToLocalStorage");
    },
  },
};
