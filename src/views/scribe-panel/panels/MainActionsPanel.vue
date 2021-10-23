<template>
  <div>
    <v-card outlined elevation="4" color="indigo lighten-5">
      <v-card-text>
        <v-row class="px-8 py-4">
          <v-btn
            color="primary"
            tile
            outlined
            x-large
            @click="showSloubiDialog = true"
          >
            <v-icon class="mr-4">mdi-account-cowboy-hat</v-icon>
            Chante-Sloubi !
          </v-btn>

          <v-btn
            class="ml-4"
            color="yellow accent-4"
            x-large
            @click="openGrelottine"
          >
            <v-icon class="mr-4">mdi-bell-alert-outline</v-icon>
            Défi Grelottine !
          </v-btn>
        </v-row>

        <v-row class="px-8 py-4">
          <v-btn x-large outlined color="blue-grey" @click="removeLastEvent">
            <v-icon class="mr-4">mdi-undo</v-icon>
            Annuler la dernière action
          </v-btn>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showSloubiDialog" persistent max-width="800">
      <SloubiDialogCard
        :player-names="playerNames"
        :sloubi-score="sloubiScore"
        :current-player-name="currentPlayer.name"
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
import { Component, Prop, Vue } from "vue-property-decorator";
import BevueMenuAction from "@/components/BevueMenuAction.vue";
import { SloubiActionPayload } from "@/store/current-game/current-game.interface";
import { Player } from "../../../../domain/player";
import { mapGetters } from "vuex";
import SloubiDialogCard from "@/views/scribe-panel/dialogs/SloubiDialogCard.vue";
import GrelottineDialogCard from "@/views/scribe-panel/dialogs/rule-resolvers/GrelottineResolverDialog.vue";

@Component({
  components: {
    BevueMenuAction,
    SloubiDialogCard,
    GrelottineDialogCard,
  },
  computed: {
    ...mapGetters("currentGame", ["playerNames", "sloubiScore"]),
  },
})
export default class MainActionsPanel extends Vue {
  @Prop() currentPlayer!: Player;

  showSloubiDialog = false;

  errorSnackBar = {
    text: "",
    display: false,
  };

  openGrelottine(): void {
    this.$store.dispatch("currentGame/play/startGrelottineChallenge");
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

  removeLastEvent(): void {
    this.$store.dispatch("currentGame/play/cancelLastEvent");
  }
}
</script>

<style scoped lang="scss"></style>
