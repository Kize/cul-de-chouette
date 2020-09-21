<template>
  <div class="scribe-panel">
    <v-row>
      <v-col cols="6">
        <h1 class="mb-6">Gestion des scores - {{ gameName }}</h1>
      </v-col>
      <v-col cols="2">
        <v-btn>
          Afficher l'historique
        </v-btn>
      </v-col>
      <v-col cols="4">
        <v-row justify="end">
          <v-btn class="mx-2 my-1">
            Défi Grelottine !
          </v-btn>
          <v-btn class="mx-2 my-1" @click="showSloubiDialog = true">
            Chante-Sloubi !
          </v-btn>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="mb-6" no-gutters>
      <v-col
        v-for="player in players"
        :key="player.name"
        :cols="getColumnSize()"
      >
        <v-card
          class="pa-3 mx-1"
          tile
          outlined
          :color="
            canPlayerPlay(player.name) ? 'blue lighten-3' : 'blue lighten-5'
          "
        >
          <v-card-title class="headline">
            <span>{{ player.name }}</span>
            <v-divider vertical class="mx-6"></v-divider>
            <span>Score: {{ getPlayerScore(player.name) }}</span>

            <v-spacer></v-spacer>

            <v-chip small color="primary" v-if="player.hasGrelottine"
              >Grelottine
            </v-chip>
          </v-card-title>

          <MainActionsPanel :player="player"></MainActionsPanel>
          <MainPlayPanel :player="player"></MainPlayPanel>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showSloubiDialog" persistent max-width="800">
      <SloubiDialogCard
        :player-names="playerNames"
        :current-player-name="currentPlayerName"
        @cancel="showSloubiDialog = false"
        @confirm="playSloubi($event)"
      >
      </SloubiDialogCard>
    </v-dialog>

    <v-snackbar v-model="errorSnackBar.display" :timeout="3000">
      {{ errorSnackBar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="errorSnackBar.display = false"
        >
          Okay
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import {
  GameStatus,
  SloubiActionPayload
} from "@/store/current-game/current-game.interface";
import { mapGetters } from "vuex";
import MainActionsPanel from "./components/MainActionsPanel.vue";
import MainPlayPanel from "./components/MainPlayPanel.vue";
import { Player } from "@/domain/player";
import SloubiDialogCard from "@/views/scribe-panel/components/SloubiDialogCard.vue";

@Component({
  components: { SloubiDialogCard, MainPlayPanel, MainActionsPanel },
  computed: {
    ...mapGetters("currentGame", [
      "gameName",
      "gameStatus",
      "players",
      "canPlayerPlay",
      "getPlayerScore",
      "currentPlayerName",
      "playerNames"
    ])
  }
})
export default class ScribePanel extends Vue {
  showSloubiDialog = false;
  errorSnackBar = {
    text: "",
    display: false
  };
  players!: Array<Player>;

  @Watch("gameStatus")
  onGameStatusChange(newStatus: GameStatus): void {
    console.log("hey", newStatus);
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

  getColumnSize(): number {
    const playersNumber = this.players.length;
    return Math.ceil(12 / playersNumber);
  }

  async playSloubi(form: SloubiActionPayload): Promise<void> {
    try {
      await this.$store.dispatch("currentGame/sloubi", form);
      this.showSloubiDialog = false;
    } catch (error) {
      this.errorSnackBar.text = error.message;
      this.errorSnackBar.display = true;
    }
  }
}
</script>

<style lang="scss">
.control .icon.is-clickable {
  pointer-events: initial;
}
</style>
