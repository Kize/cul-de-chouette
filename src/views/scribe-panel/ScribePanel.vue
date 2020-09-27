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
        <v-row justify="end">
          <v-btn class="mx-2 my-1" @click="showGrelottineDialog = true">
            Défi Grelottine !
          </v-btn>
          <v-btn class="mx-2 my-1" @click="showSloubiDialog = true">
            Chante-Sloubi !
          </v-btn>
        </v-row>
      </v-col>
    </v-row>

    <PlayersBanner :players="players"></PlayersBanner>

    <v-row>
      <v-col lg="6" md="12" sm="12">
        <CurrentPlayerPanel :player="getCurrentPlayer()"></CurrentPlayerPanel>
      </v-col>

      <v-col lg="6" md="12" sm="12">
        <MainActionsPanel :player="getCurrentPlayer()"></MainActionsPanel>
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

    <v-dialog
      v-model="showGrelottineDialog"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <GrelottineDialogCard
        @close="showGrelottineDialog = false"
      ></GrelottineDialogCard>
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
import { mapGetters, mapState } from "vuex";
import { Player } from "@/domain/player";
import SloubiDialogCard from "@/views/scribe-panel/dialogs/SloubiDialogCard.vue";
import GrelottineDialogCard from "@/views/scribe-panel/dialogs/GrelottineDialogCard.vue";
import PlayersBanner from "@/views/scribe-panel/components/PlayersBanner.vue";
import CurrentPlayerPanel from "@/views/scribe-panel/panels/CurrentPlayerPanel.vue";
import MainActionsPanel from "@/views/scribe-panel/panels/MainActionsPanel.vue";

@Component({
  components: {
    CurrentPlayerPanel,
    MainActionsPanel,
    PlayersBanner,
    GrelottineDialogCard,
    SloubiDialogCard
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
  showSloubiDialog = false;
  showGrelottineDialog = false;
  errorSnackBar = {
    text: "",
    display: false
  };
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
