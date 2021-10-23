<template>
  <v-dialog
    :value="souffletteResolverDialog.isVisible"
    persistent
    max-width="75%"
  >
    <MainDialogCard
      :title="
        'Défi de soufflette lancé par ' + souffletteResolverDialog.playerName
      "
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
                :rules="rulesOfSelectNameInput"
                clearable
                outlined
                :items="otherPlayerNames"
              ></v-select>
            </v-col>
            <v-col md="4" cols="12" align="center">
              <span class="button-toggle-label grey--text">
                Nombre de lancés:
              </span>
              <v-btn-toggle
                v-model="form.numberOfDiceRolls"
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
import { Player } from "../../../../../domain/player";
import { rulesOfSelectNameInput } from "@/form-validation/form-validation-rules";
import { getInitialForm, SouffletteForm } from "@/domain/level-one/soufflette";
import { RulesState } from "@/store/current-game/rules.store";
import BevueMenuAction from "@/components/BevueMenuAction.vue";
import { VForm } from "@/vuetify.interface";
import DiceRollInput from "@/components/dice/DiceRollInput.vue";
import { DiceForm, isDiceFormValid } from "@/components/dice/dice-form";
import { mapGetters, mapState } from "vuex";
import { SouffletteResolution } from "../../../../../domain/rules/level-one/soufflette-rule";
import { DialogsState } from "@/store/current-game/dialogs.store";

@Component({
  components: {
    DiceRollInput,
    BevueMenuAction,
    MainDialogCard,
  },
  computed: {
    ...mapState("currentGame/dialogs", ["souffletteResolverDialog"]),
    ...mapState("currentGame", ["players"]),
    ...mapGetters("currentGame", ["playerNames"]),
  },
})
export default class SouffletteResolverDialog extends Vue {
  souffletteResolverDialog!: DialogsState["souffletteResolverDialog"];
  players!: Array<Player>;
  playerNames!: Array<string>;
  rules!: RulesState;
  turnNumber?: number;

  diceForm: DiceForm = [0, 0, 0];
  form: SouffletteForm = getInitialForm();
  isFormValid = true;

  readonly rulesOfSelectNameInput = rulesOfSelectNameInput;

  get otherPlayerNames(): Array<string> {
    return this.playerNames.filter(
      (name) => name !== this.souffletteResolverDialog.playerName
    );
  }

  get isValidButtonActive(): boolean {
    return this.isFormValid && isDiceFormValid(this.diceForm);
  }

  noChallenge(): void {
    const resolution: SouffletteResolution = {
      isChallenge: false,
    };

    this.resetForms();
    this.$store.dispatch("currentGame/play/resolveSoufflette", resolution);
  }

  cancel(): void {
    this.resetForms();
    this.$store.dispatch("currentGame/play/cancelSoufflette");
  }

  confirm(): void {
    if (this.form.challengedPlayer && isDiceFormValid(this.diceForm)) {
      const resolution: SouffletteResolution = {
        isChallenge: true,
        challengedPlayer: this.form.challengedPlayer,
        numberOfDiceRolls: this.form.numberOfDiceRolls,
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
