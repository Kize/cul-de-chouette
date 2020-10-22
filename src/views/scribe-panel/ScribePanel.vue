<template>
  <div class="mx-4">
    <v-row class="mx-2">
      <v-col lg="4" md="10" sm="12">
        <h1 class="headline">Gestion des scores - {{ name }}</h1>
      </v-col>
      <v-col>
        <RulesButton></RulesButton>
      </v-col>
      <v-col>
        <AddOperationLinesButton></AddOperationLinesButton>
      </v-col>
      <v-col>
        <router-link :to="currentGameHistoryRoutePath">
          <v-btn tile>
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

    <PlayersBanner :players="players"></PlayersBanner>

    <v-row>
      <v-col lg="6" md="12" sm="12">
        <CurrentPlayerPanel
          :currentPlayer="getCurrentPlayer()"
        ></CurrentPlayerPanel>
      </v-col>

      <v-col lg="6" md="12" sm="12">
        <MainActionsPanel
          :currentPlayer="getCurrentPlayer()"
        ></MainActionsPanel>
      </v-col>
    </v-row>

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
import { Player } from "@/domain/player";
import PlayersBanner from "@/views/scribe-panel/components/PlayersBanner.vue";
import CurrentPlayerPanel from "@/views/scribe-panel/panels/CurrentPlayerPanel.vue";
import MainActionsPanel from "@/views/scribe-panel/panels/MainActionsPanel.vue";
import { ROUTES } from "@/router";
import AddOperationLinesButton from "@/views/scribe-panel/components/AddOperationLinesButton.vue";
import EndGameDialogCard from "@/views/scribe-panel/dialogs/EndGameDialogCard.vue";
import CancelGameDialogCard from "@/views/scribe-panel/dialogs/CancelGameDialogCard.vue";
import RulesButton from "@/components/RulesButton.vue";

@Component({
  components: {
    RulesButton,
    CancelGameDialogCard,
    EndGameDialogCard,
    AddOperationLinesButton,
    CurrentPlayerPanel,
    MainActionsPanel,
    PlayersBanner,
  },
  computed: {
    ...mapState("currentGame", [
      "currentPlayerName",
      "name",
      "status",
      "players",
    ]),

    ...mapGetters("currentGame", [
      "getPlayerScore",
      "playerNames",
      "scoreboard",
    ]),
  },
})
export default class ScribePanel extends Vue {
  players!: Array<Player>;
  currentPlayerName!: string;
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
