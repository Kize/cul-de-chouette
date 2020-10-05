<template>
  <div class="scribe-panel">
    <v-app-bar flat class="d-flex justify-center">
      <AddOperationLinesButton></AddOperationLinesButton>
      <v-toolbar-title class="mx-8">
        Gestion des scores - {{ name }}
      </v-toolbar-title>
      <router-link :to="currentGameHistoryRoutePath">
        <v-btn tile small>
          Afficher l'historique
        </v-btn>
      </router-link>
    </v-app-bar>

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

@Component({
  components: {
    AddOperationLinesButton,
    CurrentPlayerPanel,
    MainActionsPanel,
    PlayersBanner
  },
  computed: {
    ...mapState("currentGame", [
      "currentPlayerName",
      "name",
      "status",
      "players"
    ]),

    ...mapGetters("currentGame", ["getPlayerScore", "playerNames"])
  }
})
export default class ScribePanel extends Vue {
  players!: Array<Player>;
  currentPlayerName!: string;
  readonly currentGameHistoryRoutePath = ROUTES.CURRENT_GAME_HISTORY.path;

  @Watch("status")
  onGameStatusChange(newStatus: GameStatus): void {
    switch (newStatus) {
      case GameStatus.CREATION:
        this.$router.push("/");
        break;
      case GameStatus.FINISHED:
        window.confirm("La partie est finie !");
        this.$store.dispatch("currentGame/handleEndGame");
        break;
    }
  }

  getCurrentPlayer(): Player {
    return this.players.filter(
      player => player.name === this.currentPlayerName
    )[0];
  }
}
</script>

<style lang="scss">
.control .icon.is-clickable {
  pointer-events: initial;
}
</style>
