<template>
  <MainDialogCard
    :title="`Défi de soufflette lancé par ${currentPlayerName}`"
    :is-confirm-button-enabled="isFormValid"
    confirm-button-label="4 - 2 - 1 !"
    @cancel="cancel"
    @confirm="winChallenge"
  >
    <v-form ref="formRef" v-model="isFormValid">
      <v-row dense>
        <v-col md="2" cols="12">
          <v-btn large @click="noChallenge">Aucun défi</v-btn>
        </v-col>
        <v-col md="6" cols="12">
          <v-select
            label="Joueur défié"
            v-model="form.challengedPlayer"
            :rules="selectNameRules"
            clearable
            outlined
            :items="getFilteredPlayerNames()"
          ></v-select>
        </v-col>
        <v-col md="4" cols="12" align="center">
          <v-btn-toggle v-model="form.diceThrowsNumber" mandatory>
            <span class="button-toggle-label grey--text">
              Nombre de lancés:
            </span>

            <v-btn :value="1">1</v-btn>

            <v-btn :value="2">2</v-btn>

            <v-btn :value="3">3</v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-form>

    <span class="subtitle-1">Combinaison réalisée sur le dernier lancé:</span>

    <PlayATurnWithDice
      :players="players"
      :player-names="playerNames"
      :current-player-name="form.challengedPlayer"
      :disabled="!isFormValid || form.diceThrowsNumber !== 3"
      @basic-play="looseChallenge"
      @play-chouette-velute="looseChallenge"
      @play-suite="looseChallenge"
    >
    </PlayATurnWithDice>
  </MainDialogCard>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import MainDialogCard from "@/components/MainDialogCard.vue";
import { Player } from "@/domain/player";
import { selectNameRules } from "@/domain/form-validation-rules";
import { HistoryLineAction, HistoryLineType } from "@/domain/history";
import { SouffletteActionPayload, SouffletteForm } from "@/domain/soufflette";

const INITIAL_FORM: SouffletteForm = {
  isChallenge: true,
  diceThrowsNumber: 1
};

@Component({
  components: {
    PlayATurnWithDice: () =>
      import("@/components/play-a-turn-actions/PlayATurnWithDice.vue"),
    MainDialogCard
  }
})
export default class SouffletteDialogCard extends Vue {
  @Prop() currentPlayerName!: string;
  @Prop() players!: Array<Player>;
  @Prop() playerNames!: Array<string>;
  @Prop() turnNumber?: number;

  form: SouffletteForm = { ...INITIAL_FORM };
  isFormValid = true;

  readonly selectNameRules = selectNameRules;

  getFilteredPlayerNames(): Array<string> {
    return this.playerNames.filter(name => name !== this.currentPlayerName);
  }

  looseChallenge(action: HistoryLineAction): void {
    this.form.challengedPlayerAction = action;

    this.confirm();
  }

  noChallenge(): void {
    this.form.isChallenge = false;
    this.confirm();
  }

  winChallenge(): void {
    if (this.form.challengedPlayer) {
      this.form.challengedPlayerAction = {
        playerName: this.form.challengedPlayer,
        designation: HistoryLineType.SOUFFLETTE,
        value: 0
      };

      this.confirm();
    }
  }

  @Emit()
  cancel(): void {
    this.form = { ...INITIAL_FORM };
    (this.$refs.formRef as VForm).resetValidation();
  }

  @Emit()
  confirm(): SouffletteActionPayload {
    const form = { ...this.form };

    this.form = { ...INITIAL_FORM };
    (this.$refs.formRef as VForm).resetValidation();

    return {
      isChallenge: form.isChallenge,
      challengerName: this.currentPlayerName,
      diceThrowsNumber: form.diceThrowsNumber,
      challengedPlayer: form.challengedPlayer,
      challengedPlayerAction: form.challengedPlayerAction
    };
  }
}
</script>

<style scoped lang="scss">
.button-toggle-label {
  position: absolute;
  margin-top: -1.7rem;
}
</style>
