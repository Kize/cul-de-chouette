<template>
  <div class="scribe-panel">
    <h1>Gestion des scores - {{ gameName }}</h1>
    <v-row class="mb-6" no-gutters>
      <v-col
        v-for="player in players"
        :key="player.name"
        :cols="getColumnSize()"
      >
        <v-card
          class="pa-3"
          tile
          outlined
          :color="
            canPlayerPlay(player.name) ? 'blue lighten-3' : 'blue lighten-5'
          "
        >
          <v-card-title class="headline">
            <span>{{ player.name }} - {{ getPlayerScore(player.name) }}</span>

            <v-spacer></v-spacer>

            <v-chip small color="primary" v-if="player.hasGrelottine"
              >Grelottine</v-chip
            >
          </v-card-title>

          <MainActionsPanel :player="player"></MainActionsPanel>
          <MainPlayPanel :player="player"></MainPlayPanel>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { GameStatus } from "@/store/current-game/current-game.interface";
import { mapGetters } from "vuex";
import MainActionsPanel from "./components/MainActionsPanel.vue";
import MainPlayPanel from "./components/MainPlayPanel.vue";

@Component({
  components: { MainPlayPanel, MainActionsPanel },
  computed: {
    ...mapGetters("currentGame", [
      "gameName",
      "gameStatus",
      "players",
      "canPlayerPlay",
      "getPlayerScore"
    ])
  }
})
export default class ScribePanel extends Vue {
  @Watch("gameStatus")
  onGameStatusChange(newStatus: GameStatus): void {
    console.log("hey", newStatus);
    switch (newStatus) {
      case GameStatus.CREATION:
        this.$router.push("/");
        break;
      case GameStatus.FINISHED:
        window.alert("La partie est finie !");
        break;
    }
  }

  getColumnSize(): number {
    const playersNumer = this.players.length;

    switch (playersNumer) {
      case 3:
        return 4;
      case 4:
        return 3;
    }
  }
}
</script>

<style lang="scss">
.control .icon.is-clickable {
  pointer-events: initial;
}
</style>
