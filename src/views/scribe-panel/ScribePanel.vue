<template>
  <div>
    <v-row class="mx-2">
      <v-col lg="4" md="10" sm="12">
        <h1 class="headline">Gestion des scores - {{ name }}</h1>
      </v-col>
      <v-col>
        <RulesButton></RulesButton>
      </v-col>
      <v-col>
        <router-link :to="currentGameHistoryRoutePath">
          <v-btn tile color="grey darken-3" dark>
            <v-icon class="mr-2" small>mdi-table-large</v-icon>
            Afficher l'historique
          </v-btn>
        </router-link>
      </v-col>
      <v-col>
        <v-btn tile @click="showCancelGameDialog = true" color="red lighten-4">
          <v-icon class="mr-2">mdi-close-circle-outline</v-icon>
          Annuler la partie
        </v-btn>
      </v-col>
    </v-row>

    <PlayersBanner
      :players="players"
      @start-civet="playCivet($event)"
    ></PlayersBanner>

    <v-row>
      <v-col lg="6" md="12" sm="12">
        <MainActionsPanel
          :currentPlayer="getCurrentPlayer()"
        ></MainActionsPanel>
      </v-col>

      <v-col lg="6" md="12" sm="12">
        <CurrentPlayerPanel
          :currentPlayer="getCurrentPlayer()"
        ></CurrentPlayerPanel>
      </v-col>
    </v-row>

    <SuiteResolverDialog></SuiteResolverDialog>
    <ChouetteVeluteResolverDialog></ChouetteVeluteResolverDialog>
    <GrelottineResolverDialog></GrelottineResolverDialog>
    <SouffletteResolverDialog></SouffletteResolverDialog>
    <SiropResolverDialog></SiropResolverDialog>
    <CivetResolverDialog></CivetResolverDialog>
    <BleuRougeResolverDialog></BleuRougeResolverDialog>
    <ArtichetteResolverDialog></ArtichetteResolverDialog>
    <VerdierResolverDialog></VerdierResolverDialog>

    <v-dialog v-model="showEndGameDialog" persistent max-width="1000">
      <EndGameDialogCard
        :scoreboard="scoreboard"
        @confirm="endGame"
      ></EndGameDialogCard>
    </v-dialog>

    <v-dialog v-model="showCancelGameDialog" persistent max-width="450">
      <CancelGameDialogCard
        @cancel="showCancelGameDialog = false"
        @confirm="cancelCurrentGame"
      >
      </CancelGameDialogCard>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { GameStatus } from "@/store/current-game/current-game.interface";
import { mapGetters, mapState } from "vuex";
import { ROUTES } from "@/router";
import { Player } from "../../../domain/player";
import { GameContextEvent } from "../../../domain/rule-runner/game-context-event";
import RulesButton from "@/components/RulesButton.vue";
import PlayersBanner from "@/views/scribe-panel/components/PlayersBanner.vue";
import CurrentPlayerPanel from "@/views/scribe-panel/panels/CurrentPlayerPanel.vue";
import MainActionsPanel from "@/views/scribe-panel/panels/MainActionsPanel.vue";
import EndGameDialogCard from "@/views/scribe-panel/dialogs/EndGameDialogCard.vue";
import CancelGameDialogCard from "@/views/scribe-panel/dialogs/CancelGameDialogCard.vue";
import SuiteResolverDialog from "@/views/scribe-panel/dialogs/rule-resolvers/SuiteResolverDialog.vue";
import ChouetteVeluteResolverDialog from "@/views/scribe-panel/dialogs/rule-resolvers/ChouetteVeluteResolverDialog.vue";
import SiropResolverDialog from "@/views/scribe-panel/dialogs/rule-resolvers/SiropResolverDialog.vue";
import GrelottineResolverDialog from "@/views/scribe-panel/dialogs/rule-resolvers/GrelottineResolverDialog.vue";
import SouffletteResolverDialog from "@/views/scribe-panel/dialogs/rule-resolvers/SouffletteResolverDialog.vue";
import CivetResolverDialog from "@/views/scribe-panel/dialogs/rule-resolvers/CivetResolverDialog.vue";
import BleuRougeResolverDialog from "@/views/scribe-panel/dialogs/rule-resolvers/BleuRougeResolverDialog.vue";
import ArtichetteResolverDialog from "@/views/scribe-panel/dialogs/rule-resolvers/ArtichetteResolverDialog.vue";
import VerdierResolverDialog from "@/views/scribe-panel/dialogs/rule-resolvers/VerdierResolverDialog.vue";

@Component({
  components: {
    VerdierResolverDialog,
    ArtichetteResolverDialog,
    BleuRougeResolverDialog,
    SouffletteResolverDialog,
    CivetResolverDialog,
    GrelottineResolverDialog,
    SiropResolverDialog,
    SuiteResolverDialog,
    ChouetteVeluteResolverDialog,
    RulesButton,
    CancelGameDialogCard,
    EndGameDialogCard,
    CurrentPlayerPanel,
    MainActionsPanel,
    PlayersBanner,
  },
  computed: {
    ...mapState("currentGame", ["name", "status", "players"]),
    ...mapState("currentGame/rules", ["isCivetEnabled"]),

    ...mapGetters("currentGame", [
      "currentPlayerName",
      "getPlayerScore",
      "playerNames",
      "scoreboard",
      "hasCivet",
    ]),
  },
})
export default class ScribePanel extends Vue {
  players!: Array<Player>;
  currentPlayerName!: string;
  hasCivet!: (playerName: string) => boolean;
  readonly isCivetEnabled!: boolean;
  readonly currentGameHistoryRoutePath = ROUTES.CURRENT_GAME_HISTORY.path;

  showEndGameDialog = false;
  showCancelGameDialog = false;

  @Watch("status")
  onGameStatusChange(newStatus: GameStatus): void {
    switch (newStatus) {
      case GameStatus.CREATION:
        this.$router.push("/");
        break;
      case GameStatus.FINISHED:
        this.showEndGameDialog = true;
        break;
    }
  }

  getCurrentPlayer(): Player {
    return this.players.filter(
      (player) => player.name === this.currentPlayerName
    )[0];
  }

  playCivet(playerName: string): void {
    if (!this.isCivetEnabled) {
      console.error(
        "La règle du civet n'est pas active, cette action est impossible."
      );
      return;
    }

    if (!this.hasCivet(playerName)) {
      console.error(
        `${playerName} n'a pas de civet, cette action est impossible.`
      );
      return;
    }

    this.$store.dispatch("currentGame/play/playATurn", {
      event: GameContextEvent.CIVET_BET,
    });
  }

  endGame(): void {
    this.showEndGameDialog = false;
    this.$store.dispatch("currentGame/handleEndGame");
  }

  cancelCurrentGame(): void {
    this.showCancelGameDialog = false;
    this.$store.dispatch("currentGame/nextGame");
  }
}
</script>

<style lang="scss">
.control .icon.is-clickable {
  pointer-events: initial;
}
</style>
