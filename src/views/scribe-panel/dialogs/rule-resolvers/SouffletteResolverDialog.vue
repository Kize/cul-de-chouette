<template>
  <v-dialog
    :value="souffletteResolverDialog.isVisible"
    persistent
    max-width="75%"
  >
    <MainDialogCard
      :title="'Défi de soufflette lancé par ' + currentPlayerName"
      :is-confirm-button-enabled="isValidButtonActive"
      @cancel="cancel"
      @confirm="confirm"
    >
      <v-container fluid>
        <v-form ref="formRef" v-model="isFormValid">
          <v-row>
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
                :items="filteredPlayerNames"
              ></v-select>
            </v-col>
            <v-col md="4" cols="12" align="center">
              <span class="button-toggle-label grey--text">
                Nombre de lancés:
              </span>
              <v-btn-toggle
                v-model="form.diceThrowsNumber"
                mandatory
                color="blue accent-4"
                tile
              >
                <v-btn :value="1"><b>1</b></v-btn>

                <v-btn :value="2"><b>2</b></v-btn>

                <v-btn :value="3"><b>3</b></v-btn>
              </v-btn-toggle>
            </v-col>
          </v-row>
        </v-form>

        <span class="subtitle-1"
          >Combinaison réalisée sur le dernier lancé:</span
        >
        <DiceRollInput v-model="diceForm"></DiceRollInput>
      </v-container>
    </MainDialogCard>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MainDialogCard from "@/components/MainDialogCard.vue";
import { Player } from "@/domain/player";
import { selectNameRules } from "@/form-validation/form-validation-rules";
import { getInitialForm, SouffletteForm } from "@/domain/soufflette";
import { RulesState } from "@/store/current-game/difficulty-levels/rules.store";
import BevueMenuAction from "@/components/BevueMenuAction.vue";
import { VForm } from "@/vuetify.interface";
import DiceRollInput from "@/components/dice/DiceRollInput.vue";
import { DiceForm, isDiceFormValid } from "@/components/dice/dice-form";
import { mapGetters, mapState } from "vuex";
import { SouffletteResolution } from "../../../../../domain/rules/level-one/soufflette-rule";

@Component({
  components: {
    DiceRollInput,
    BevueMenuAction,
    MainDialogCard,
  },
  computed: {
    ...mapState("currentGame/rules", ["rules"]),
    ...mapState("currentGame/dialogs", ["souffletteResolverDialog"]),
    ...mapState("currentGame", ["players", "currentPlayerName", "rules"]),
    ...mapGetters("currentGame", ["playerNames"]),
  },
})
export default class SouffletteResolverDialog extends Vue {
  souffletteResolverDialog!: { isVisible: boolean };
  currentPlayerName!: string;
  players!: Array<Player>;
  playerNames!: Array<string>;
  rules!: RulesState;
  turnNumber?: number;

  diceForm: DiceForm = [0, 0, 0];
  form: SouffletteForm = getInitialForm();
  isFormValid = true;

  readonly selectNameRules = selectNameRules;

  get filteredPlayerNames(): Array<string> {
    return this.playerNames.filter((name) => name !== this.currentPlayerName);
  }

  get isValidButtonActive(): boolean {
    return this.isFormValid && isDiceFormValid(this.diceForm);
  }

  noChallenge(): void {
    this.form.isChallenge = false;
    this.confirm();
  }

  cancel(): void {
    this.resetForms();
    this.$store.dispatch("currentGame/play/cancelSoufflette");
  }

  confirm(): void {
    if (this.form.challengedPlayer && isDiceFormValid(this.diceForm)) {
      const resolution: SouffletteResolution = {
        isChallenge: this.form.isChallenge,
        challengedPlayer: this.form.challengedPlayer,
        diceThrowsNumber: this.form.diceThrowsNumber,
        diceRoll: [...this.diceForm],
      };

      this.resetForms();
      this.$store.dispatch("currentGame/play/resolveSoufflette", resolution);
    }
  }

  private resetForms(): void {
    this.diceForm = [0, 0, 0];
    this.form = getInitialForm();

    (this.$refs.formRef as VForm).resetValidation();
  }
}
</script>

<style scoped lang="scss">
.button-toggle-label {
  position: absolute;
  margin-top: -1.7rem;
}
</style>
