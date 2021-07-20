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
          <v-card-title class="py-2">Jet de dés:</v-card-title>
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
import MainDialogCard from "../../../../components/MainDialogCard.vue";
import { rulesOfSelectChallengeInput } from "../../../../form-validation/form-validation-rules";
import BevueMenuAction from "../../../../components/BevueMenuAction.vue";
import { VForm } from "../../../../vuetify.interface";
import DiceRollInput from "../../../../components/dice/DiceRollInput.vue";
import {
  DiceForm,
  isDiceFormValid,
} from "../../../../components/dice/dice-form";
import { mapGetters, mapState } from "vuex";
import { CivetForm, getInitialForm } from "../../../../domain/level-one/civet";
import AmountInput from "../../../../components/AmountInput.vue";
import {
  CivetBet,
  CivetResolution,
} from "../../../../../domain/rules/level-one/civet-rule";

@Component({
  components: {
    AmountInput,
    DiceRollInput,
    BevueMenuAction,
    MainDialogCard,
  },
  computed: {
    ...mapState("currentGame/dialogs", ["civetResolverDialog"]),
    ...mapGetters("currentGame", ["playerNames"]),
  },
})
export default class BleuRougeResolverDialog extends Vue {
  readonly rulesOfSelectChallengeInput = rulesOfSelectChallengeInput;

  civetResolverDialog!: { isVisible: boolean; playerName: string };
  playerNames!: Array<string>;

  diceForm: DiceForm = [0, 0, 0];
  form: CivetForm = getInitialForm();
  isFormValid = true;

  get civetBets(): Array<CivetBet> {
    return Object.values(CivetBet);
  }

  get isResolutionReady(): boolean {
    return this.isFormValid && isDiceFormValid(this.diceForm);
  }

  cancel(): void {
    this.resetForms();

    this.$store.dispatch("currentGame/play/cancelCivet");
  }

  confirm(): void {
    if (this.isFormValid && isDiceFormValid(this.diceForm)) {
      const resolution: CivetResolution = {
        diceRoll: [...this.diceForm],
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
