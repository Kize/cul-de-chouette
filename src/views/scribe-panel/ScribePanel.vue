<template>
  <div class="scribe-panel">
    <v-row>
      <v-col cols="6">
        <h1 class="mb-2">Gestion des scores - {{ name }}</h1>
      </v-col>
      <v-col cols="2">
        <v-btn>
          Afficher l'historique
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-row justify="end"></v-row>
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

@Component({
  components: {
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
