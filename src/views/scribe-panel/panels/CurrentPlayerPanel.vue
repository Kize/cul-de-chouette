<template>
  <v-card outlined elevation="4" color="indigo lighten-5">
    <v-card-title class="headline">
      <span>{{ currentPlayer.name }}</span>
      <v-divider vertical class="mx-6"></v-divider>
      <span>Score: {{ getPlayerScore(currentPlayer.name) }}</span>
      <v-divider vertical class="mx-6"></v-divider>
      <span>Tour: {{ turnNumber }}</span>
    </v-card-title>

    <v-card-text>
      <DiceRollInput v-model="diceForm"></DiceRollInput>
    </v-card-text>

    <v-card-actions class="d-flex justify-end pb-8 pr-12">
      <v-btn color="success" :disabled="!isFormValid" @click="basicPlay">
        Valider
      </v-btn>
    </v-card-actions>
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
import { DiceRoll } from "../../../../domain/rules/dice-rule";

@Component({
  components: {
    DiceRollInput,
    MenuAction,
  },
  computed: {
    ...mapState("currentGame", ["players", "turnNumber"]),
    ...mapGetters("currentGame/rules", ["rules"]),
    ...mapGetters("currentGame", [
      "isCurrentPlayer",
      "playerNames",
      "getPlayerScore",
    ]),
  },
})
export default class CurrentPlayerPanel extends Vue {
  @Prop() currentPlayer!: Player;

  diceForm: DiceForm = getInitialDiceForm();

  get isFormValid(): boolean {
    return isDiceFormValid(this.diceForm);
  }

  basicPlay(): void {
    if (isDiceFormValid(this.diceForm)) {
      const diceRoll: DiceRoll = [...this.diceForm];
      this.diceForm = getInitialDiceForm();
      this.$store.dispatch("currentGame/play/playATurn", diceRoll);
    }
  }
}
</script>

<style scoped lang="scss"></style>
