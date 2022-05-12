/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Module } from "vuex";
import {
  AddOperationLinesActionPayload,
  CurrentGameState,
  GameStatus,
  NewGameForm,
  PLAYER_NAMES_LOCAL_STORAGE_KEY,
  SavedCurrentGame,
  Scoreboard,
  SloubiActionPayload,
} from "@/store/current-game/current-game.interface";
import {
  byName,
  computePlayerScore,
  getCurrentPlayerName,
  Player,
  toPlayerWithNumberOfTurnsPlayed,
} from "../../../domain/player";
import {
  GameLineType,
  getNewEventId,
  HistoryLine,
  HistoryLineApply,
} from "@/domain/history";
import { RootState } from "@/store/app.state";
import { MainPlayableActionsStoreModule } from "@/store/current-game/main-playable-actions.store";
import { RulesState, RulesStoreModule } from "@/store/current-game/rules.store";
import { DialogsStoreModule } from "@/store/current-game/dialogs.store";
import {
  ALL_RULES_ORDERED,
  BASIC_RULE_NAMES,
  gameRuleRunner,
} from "@/store/current-game/game-rule-runner";
import { RuleEffectEvent } from "../../../domain/rules/rule-effect";
import {
  getHistoryView,
  HistoryView,
} from "@/views/current-game-history/history-view";
import { Rules } from "../../../domain/rules/rule";

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
      events: [],
      players: [],
    };
  },
  getters: {
    getState(state): CurrentGameState {
      return state;
    },
    playerNames(state): Array<string> {
      return state.players.map((player) => player.name);
    },
    getPlayer(state) {
      return (playerName: string): Player | undefined => {
        return state.players.find(byName(playerName));
      };
    },
    currentPlayerName(state): string {
      return getCurrentPlayerName(state.players);
    },
    turnNumber(state, getters): number {
      const firstPlayer = state.players[0];
      const numberOfTurnsPlayed =
        toPlayerWithNumberOfTurnsPlayed(firstPlayer).numberOfTurnsPlayed;

      const currentPlayerName = getters.currentPlayerName;

      if (currentPlayerName === firstPlayer.name) {
        return numberOfTurnsPlayed + 1;
      }

      return numberOfTurnsPlayed;
    },
    isCurrentPlayer(state, getters) {
      return (playerName: string): boolean => {
        return playerName === getters.currentPlayerName;
      };
    },
    getPlayerScore(state, getters) {
      return (playerName: string): number => {
        const player = getters.getPlayer(playerName);
        if (!player) {
          return 0;
        }

        return computePlayerScore(player);
      };
    },
    hasGrelottine(state, getters) {
      return (playerName: string): boolean => {
        const player = getters.getPlayer(playerName);
        if (!player) {
          return false;
        }

        return player.history.reduce(
          (acc: boolean, historyLine: HistoryLine) => {
            if (historyLine.designation === RuleEffectEvent.ADD_GRELOTTINE) {
              return true;
            }
            if (historyLine.designation === RuleEffectEvent.REMOVE_GRELOTTINE) {
              return false;
            }
            return acc;
          },
          false
        );
      };
    },
    hasCivet(state, getters) {
      return (playerName: string): boolean => {
        const player = getters.getPlayer(playerName);
        if (!player) {
          return false;
        }

        return player.history.reduce(
          (acc: boolean, historyLine: HistoryLine) => {
            if (historyLine.designation === RuleEffectEvent.ADD_CIVET) {
              return true;
            }
            if (historyLine.designation === RuleEffectEvent.REMOVE_CIVET) {
              return false;
            }
            return acc;
          },
          false
        );
      };
    },
    hasJarret(state, getters) {
      return (playerName: string): boolean => {
        const player = getters.getPlayer(playerName);
        if (!player) {
          return false;
        }

        return player.history.reduce(
          (acc: boolean, historyLine: HistoryLine) => {
            if (historyLine.designation === RuleEffectEvent.ADD_JARRET) {
              return true;
            }
            if (historyLine.designation === RuleEffectEvent.REMOVE_JARRET) {
              return false;
            }
            return acc;
          },
          false
        );
      };
    },
    sloubiScore(state, getters): number {
      const [bestScore, secondBestScore] = state.players
        .map((player) => getters.getPlayerScore(player.name))
        .sort((score1, score2) => score2 - score1)
        .slice(0, 2);

      return Math.trunc(
        ((bestScore - secondBestScore) * getters.turnNumber) / 10
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
          { name: "", score: Number.MIN_SAFE_INTEGER }
        );
    },
    historyView(state): HistoryView {
      return getHistoryView(state.events, state.players);
    },
  },
  mutations: {
    setGame(state, newGame: CurrentGameState): void {
      state.status = newGame.status;
      state.name = newGame.name;
      state.events = newGame.events;
      state.players = newGame.players;
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
      });
    },
    addEvent(state, eventId: string): void {
      state.events.push(eventId);
    },
    removeEvent(state, eventId: string): void {
      state.events = state.events.filter((event) => event !== eventId);
    },
    addHistoryLine(state, apply: HistoryLineApply): void {
      const player = state.players.find(byName(apply.playerName));

      if (player) {
        player.history.push({ ...apply });
      }
    },
    removeHistoryLines({ players }, eventId: string): void {
      players.forEach((player) => {
        player.history = player.history.filter(
          (historyLine: HistoryLine) => historyLine.eventId !== eventId
        );
      });
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
        events: [],
        players: notEmptyPlayerNames.map((name) => ({
          name,
          history: [],
          hasGrelottine: false,
          hasJarret: false,
        })),
      };
      commit("setGame", newGame);
      dispatch("configureGameRules", rules);

      await dispatch("saveGameToLocalStorage");
    },
    configureGameRules({ commit }, payload: RulesState): void {
      const enabledRules = new Set(BASIC_RULE_NAMES);

      if (payload?.isSouffletteEnabled) {
        commit("rules/setIsSouffletteEnabled", true);
        enabledRules.add(Rules.SOUFFLETTE);
      } else {
        commit("rules/setIsSouffletteEnabled", false);
      }

      if (payload?.isSiropEnabled) {
        commit("rules/setIsSiropEnabled", true);
        enabledRules.add(Rules.SIROP);
      } else {
        commit("rules/setIsSiropEnabled", false);
      }

      if (payload?.isAttrapeOiseauEnabled) {
        commit("rules/setIsAttrapeOiseauEnabled", true);
        enabledRules.add(Rules.ATTRAPE_OISEAU);
      } else {
        commit("rules/setIsAttrapeOiseauEnabled", false);
      }

      if (payload?.isCivetEnabled) {
        commit("rules/setIsCivetEnabled", true);
        enabledRules.add(Rules.CIVET);
      } else {
        commit("rules/setIsAttrapeOiseauEnabled", false);
      }

      if (payload?.isArtichetteEnabled) {
        commit("rules/setIsArtichetteEnabled", true);
        enabledRules.add(Rules.ARTICHETTE);
      } else {
        commit("rules/setIsArtichetteEnabled", false);
      }

      if (payload?.isVerdierEnabled) {
        commit("rules/setIsVerdierEnabled", true);
        enabledRules.add(Rules.VERDIER);
      } else {
        commit("rules/setIsVerdierEnabled", false);
      }

      if (payload?.isBleuRougeEnabled) {
        commit("rules/setIsBleuRougeEnabled", true);
        enabledRules.add(Rules.BLEU_ROUGE);
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
        await dispatch("saveGameToLocalStorage");
      } else {
        await dispatch("saveGameToLocalStorage");
      }

      return isGameFinished;
    },
    async handleEndTurn(
      { commit, dispatch, getters },
      eventId: string
    ): Promise<void> {
      const isGameFinished = await dispatch("checkEndGame");

      if (!isGameFinished) {
        const playTurnHistoryLine: HistoryLineApply = {
          eventId,
          amount: 0,
          playerName: getters.currentPlayerName,
          designation: GameLineType.PLAY_TURN,
        };

        commit("addHistoryLine", playTurnHistoryLine);
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
        events: [],
        players: [],
      };
      storage.setItem("currentGame", JSON.stringify(nextGame));
      commit("setGame", nextGame);
    },
    saveGameToLocalStorage({ state }, storage = localStorage): void {
      storage.setItem("currentGame", JSON.stringify(state));
    },
    addGodModOperations(
      { dispatch, commit },
      actionPayload: AddOperationLinesActionPayload
    ): void {
      const eventId = getNewEventId();
      commit("addEvent", eventId);

      actionPayload.operations.forEach((operation) => {
        const apply: HistoryLineApply = {
          eventId,
          designation: operation.designation,
          playerName: operation.playerName,
          amount: operation.amount,
        };

        commit("addHistoryLine", apply);
      });

      if (actionPayload.shouldHandleEndTurn) {
        dispatch("handleEndTurn", eventId);
      } else {
        dispatch("checkEndGame");
      }
    },
    async sloubi(
      { state, commit, dispatch, getters },
      sloubi: SloubiActionPayload
    ): Promise<void> {
      const eventId = `Sloubi de ${sloubi.name}`;

      if (state.players.length > 7) {
        throw new Error("Le jeu n'autorise que 8 joueurs dans une partie.");
      }
      if (state.players.map((player) => player.name).includes(sloubi.name)) {
        throw new Error("Le nom de ce joueur est déjà pris.");
      }

      const sloubiAmount = sloubi.isSloubiCompleted
        ? Math.trunc(getters.sloubiScore * 1.5)
        : getters.sloubiScore;

      const playTurnNumber = toPlayerWithNumberOfTurnsPlayed(
        getters.getPlayer(sloubi.previousPlayer)
      ).numberOfTurnsPlayed;

      // eslint-disable-next-line prefer-spread
      const playTurnHistory = Array.apply(
        null,
        Array(playTurnNumber)
      ).map<HistoryLine>(() => ({
        designation: GameLineType.PLAY_TURN,
        amount: 0,
        eventId,
      }));

      const player: Player = {
        name: sloubi.name,
        history: [
          {
            eventId,
            designation: RuleEffectEvent.SLOUBI,
            amount: sloubiAmount,
          },
          ...playTurnHistory,
        ],
      };

      commit("addPlayer", { player, previousPlayer: sloubi.previousPlayer });
      dispatch("saveCurrentPlayerNames", [sloubi.name]);

      await dispatch("saveGameToLocalStorage");
    },
    saveCurrentPlayerNames(_, newPlayers: Array<string>): void {
      const existingPlayers: Array<string> = JSON.parse(
        window.localStorage.getItem(PLAYER_NAMES_LOCAL_STORAGE_KEY) || "[]"
      );

      const newPlayerNames = new Set([...newPlayers, ...existingPlayers]);
      const sortedPlayers = [...newPlayerNames].sort();

      window.localStorage.setItem(
        PLAYER_NAMES_LOCAL_STORAGE_KEY,
        JSON.stringify(sortedPlayers)
      );
    },
  },
};
