<template>
  <v-card outlined elevation="4" color="indigo lighten-5">
    <v-card-title class="headline">
      <span>Tour: {{ turnNumber }}</span>

      <v-divider vertical class="mx-6"></v-divider>

      <span>{{ currentPlayer.name }}</span>

      <v-divider vertical class="mx-6"></v-divider>

      <span class="text-decoration-underline">
        {{ getPlayerScore(currentPlayer.name) }} points
      </span>

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

    <v-card-text>
      <DiceRollInput v-model="diceForm" @input="basicPlay"></DiceRollInput>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Player } from "../../../../domain/player";
import MenuAction from "@/components/MenuAction.vue";
import { mapGetters, mapState } from "vuex";
import DiceRollInput from "@/components/dice/DiceRollInput.vue";
import {
  DiceForm,
  getInitialDiceForm,
  isDiceFormValid,
} from "@/components/dice/dice-form";
import { DiceRoll, DieValue } from "../../../../domain/rules/dice-rule";
import { GameContextEvent } from "../../../../domain/game-context-event";
import { StartVerdierPayload } from "@/store/current-game/main-playable-actions.store";

@Component({
  components: {
    DiceRollInput,
    MenuAction,
  },
  computed: {
    ...mapState("currentGame", ["players"]),
    ...mapState("currentGame/rules", ["isVerdierEnabled"]),
    ...mapGetters("currentGame", [
      "turnNumber",
      "isCurrentPlayer",
      "playerNames",
      "getPlayerScore",
    ]),
  },
})
export default class CurrentPlayerPanel extends Vue {
  @Prop() currentPlayer!: Player;

  readonly isVerdierEnabled!: boolean;

  diceForm: DiceForm = getInitialDiceForm();

  get isFormValid(): boolean {
    return isDiceFormValid(this.diceForm);
  }

  get isVerdierApplicable(): boolean {
    const numberOfValidDieValue = this.diceForm.reduce(
      (acc: number, dieFormValue) => {
        if (dieFormValue === 2 || dieFormValue === 4 || dieFormValue === 6) {
          return acc + 1;
        }

        return acc;
      },
      0
    );

    return numberOfValidDieValue > 1;
  }

  basicPlay(): void {
    // Delay the action to allow the dice animation to run
    setTimeout(() => {
      if (isDiceFormValid(this.diceForm)) {
        const diceRoll: DiceRoll = [...this.diceForm];
        this.diceForm = getInitialDiceForm();

        this.$store.dispatch("currentGame/play/playATurn", {
          event: GameContextEvent.DICE_ROLL,
          diceRoll,
        });
      }
    }, 200);
  }

  startVerdier(): void {
    if (this.isVerdierApplicable) {
      const verdierContext: StartVerdierPayload = {
        event: GameContextEvent.VERDIER,
        diceValues: this.diceForm.filter(
          (dieValue) => dieValue === 2 || dieValue === 4 || dieValue === 6
        ) as unknown as [DieValue, DieValue],
      };

      this.diceForm = getInitialDiceForm();
      this.$store.dispatch("currentGame/play/playATurn", verdierContext);
    }
  }
}
</script>

<style scoped lang="scss"></style>
