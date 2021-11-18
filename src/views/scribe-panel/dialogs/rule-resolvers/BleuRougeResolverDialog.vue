<template>
  <v-dialog
    :value="bleuRougeResolverDialog.isVisible"
    persistent
    max-width="75%"
  >
    <MainDialogCard
      title="Un bleu-rouge !"
      :is-confirm-button-enabled="isResolutionReady"
      @cancel="cancel"
      @confirm="confirm"
    >
      <v-container fluid>
        <v-form ref="formRef" v-model="isFormValid">
          <v-card class="mb-4" outlined>
            <v-card-title class="py-2">Annonces:</v-card-title>
            <v-card-text class="pb-0">
              <v-row dense>
                <v-col v-for="playerName in playerNames" :key="playerName">
                  <v-select
                    :label="playerName"
                    :rules="rulesOfSelectNameInput"
                    clearable
                    outlined
                    rounded
                    :items="getPlayableBetValues(playerName)"
                    @change="registerPlayerBet(playerName, $event)"
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
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
import { rulesOfAmountInput } from "@/form-validation/form-validation-rules";
import BevueMenuAction from "@/components/BevueMenuAction.vue";
import { SelectItemsType, VForm } from "@/vuetify.interface";
import DiceRollInput from "@/components/dice/DiceRollInput.vue";
import { DiceForm, isDiceFormValid } from "@/components/dice/dice-form";
import { mapGetters, mapState } from "vuex";
import {
  BleuRougeBetValue,
  BleuRougeResolution,
} from "../../../../../domain/rules/level-3/bleu-rouge-rule";
import { BleuRougeForm, getInitialForm } from "@/domain/level-3/bleu-rouge";

@Component({
  components: {
    DiceRollInput,
    BevueMenuAction,
    MainDialogCard,
  },
  computed: {
    ...mapState("currentGame/dialogs", ["bleuRougeResolverDialog"]),
    ...mapState("currentGame", ["players"]),
    ...mapGetters("currentGame", ["playerNames", "currentPlayerName"]),
  },
})
export default class BleuRougeResolverDialog extends Vue {
  readonly rulesOfSelectNameInput = rulesOfAmountInput;

  bleuRougeResolverDialog!: { isVisible: boolean };
  currentPlayerName!: string;
  playerNames!: Array<string>;

  diceForm: DiceForm = [0, 0, 0];
  form: BleuRougeForm = getInitialForm();
  isFormValid = true;

  getPlayableBetValues(playerName: string): Array<SelectItemsType<number>> {
    return [...Array(16)].map((_, index) => {
      const betValue = index + 3;

      const isBetValueAlreadySelectedByAnotherPlayer = !!this.form.bids.find(
        (bid) => bid.bet === betValue && bid.playerName !== playerName
      );

      return {
        text: `${betValue}`,
        value: betValue,
        disabled: isBetValueAlreadySelectedByAnotherPlayer,
      };
    });
  }

  get isResolutionReady(): boolean {
    return this.isFormValid && isDiceFormValid(this.diceForm);
  }

  registerPlayerBet(playerName: string, bet: BleuRougeBetValue): void {
    const existingPlayerBetInForm = this.form.bids.find(
      (bid) => bid.playerName === playerName
    );

    if (existingPlayerBetInForm) {
      existingPlayerBetInForm.bet = bet;
    } else {
      this.form.bids.push({
        playerName,
        bet,
      });
    }
  }

  cancel(): void {
    this.resetForms();
    this.$store.dispatch("currentGame/play/cancelBleuRouge");
  }

  confirm(): void {
    if (this.isFormValid && isDiceFormValid(this.diceForm)) {
      const resolution: BleuRougeResolution = {
        diceRoll: [...this.diceForm],
        bids: this.form.bids.map((bid) => ({ ...bid })),
      };

      this.resetForms();
      this.$store.dispatch("currentGame/play/resolveBleuRouge", resolution);
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
