<template>
  <v-dialog
    v-if="civetResolverDialog.isVisible"
    :value="civetResolverDialog.isVisible"
    persistent
    max-width="75%"
  >
    <MainDialogCard
      :title="`${civetResolverDialog.playerName} utilise son civet !`"
      :is-confirm-button-enabled="isResolutionReady"
      @cancel="cancel"
      @confirm="confirm"
    >
      <v-container fluid>
        <v-form ref="formRef" v-model="isFormValid">
          <v-card class="mb-4" outlined>
            <v-card-title class="py-2">Annonce:</v-card-title>
            <v-card-text class="pb-0">
              <v-row>
                <v-col md="3" cols="12" class="mx-md-auto">
                  <v-select
                    label="Combinaison"
                    v-model="form.playerBet"
                    :items="civetBets"
                    :rules="rulesOfSelectChallengeInput"
                  ></v-select>
                </v-col>

                <v-col md="6" cols="12">
                  <AmountInput
                    v-model="form.betAmount"
                    :min="1"
                    :max="102"
                  ></AmountInput>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-form>

        <v-card outlined>
          <v-card-title class="py-2 headline">
            <span>Jet de dés:</span>

            <v-divider vertical class="mx-6"></v-divider>

            <v-btn
              color="green lighten-1"
              rounded
              outlined
              v-if="isVerdierEnabled"
              :disabled="!isVerdierApplicable"
              @click="startVerdier"
            >
              <b>Verdier</b>
            </v-btn>
          </v-card-title>
          <v-card-text class="pb-0">
            <DiceRollInput v-model="diceForm"></DiceRollInput>
          </v-card-text>
        </v-card>
      </v-container>
    </MainDialogCard>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters, mapState } from "vuex";
import { VForm } from "../../../../vuetify.interface";
import { DieValue } from "../../../../../domain/rules/dice-rule";
import {
  CivetBet,
  CivetResolution,
} from "../../../../../domain/rules/level-1/civet-rule";
import { CivetForm, getInitialForm } from "../../../../domain/level-1/civet";
import { isVerdierApplicable } from "../../../../../domain/rules/level-3/verdier-rule";
import { rulesOfSelectChallengeInput } from "../../../../form-validation/form-validation-rules";
import MainDialogCard from "../../../../components/MainDialogCard.vue";
import BevueMenuAction from "../../../../components/BevueMenuAction.vue";
import DiceRollInput from "../../../../components/dice/DiceRollInput.vue";
import {
  DiceForm,
  isDiceFormValid,
} from "../../../../components/dice/dice-form";
import AmountInput from "../../../../components/AmountInput.vue";

@Component({
  components: {
    AmountInput,
    DiceRollInput,
    BevueMenuAction,
    MainDialogCard,
  },
  computed: {
    ...mapState("currentGame/dialogs", ["civetResolverDialog"]),
    ...mapState("currentGame/rules", ["isVerdierEnabled"]),
    ...mapGetters("currentGame", ["playerNames"]),
  },
})
export default class CivetResolverDialog extends Vue {
  readonly rulesOfSelectChallengeInput = rulesOfSelectChallengeInput;

  readonly isVerdierEnabled!: boolean;
  readonly civetResolverDialog!: { isVisible: boolean; playerName: string };
  readonly playerNames!: Array<string>;

  diceForm: DiceForm = [0, 0, 0];
  form: CivetForm = getInitialForm();
  isFormValid = true;

  get civetBets(): Array<CivetBet> {
    return Object.values(CivetBet);
  }

  get isResolutionReady(): boolean {
    return this.isFormValid && isDiceFormValid(this.diceForm);
  }

  get isVerdierApplicable(): boolean {
    return isVerdierApplicable(this.diceForm) && this.isFormValid;
  }

  cancel(): void {
    this.resetForms();

    this.$store.dispatch("currentGame/play/cancelCivet");
  }

  confirm(): void {
    if (this.isFormValid && isDiceFormValid(this.diceForm)) {
      const resolution: CivetResolution = {
        isVerdier: false,
        diceRoll: [...this.diceForm],
        playerBet: this.form.playerBet!,
        betAmount: this.form.betAmount,
      };
      this.resetForms();
      this.$store.dispatch("currentGame/play/resolveCivet", resolution);
    }
  }

  startVerdier(): void {
    if (this.isVerdierApplicable) {
      const resolution: CivetResolution = {
        isVerdier: true,
        diceValues: this.diceForm.filter(
          (dieValue) => dieValue === 2 || dieValue === 4 || dieValue === 6
        ) as unknown as [DieValue, DieValue],
        playerBet: this.form.playerBet!,
        betAmount: this.form.betAmount,
      };
      this.resetForms();
      this.$store.dispatch("currentGame/play/resolveCivet", resolution);
    }
  }

  private resetForms(): void {
    this.diceForm = [0, 0, 0];
    this.form = getInitialForm();

    (this.$refs.formRef as VForm).reset();
  }
}
</script>

<style scoped lang="scss"></style>
