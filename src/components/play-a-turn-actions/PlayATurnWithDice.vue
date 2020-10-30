<template>
  <div>
    <v-row>
      <v-col v-for="dieNumber in 3" :key="dieNumber" md="2" cols="4">
        <DieCard
          v-model="diceForm[dieNumber - 1]"
          :is-selected="false"
          :is-cul="dieNumber === 3"
        >
        </DieCard>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-right">
        <v-btn
          color="green darken-1"
          text
          @click="confirm"
          :disabled="isConfirmButtonDisabled"
        >
          Valider
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MenuAction from "@/components/MenuAction.vue";
import ChouetteVeluteDialogCard from "@/components/play-a-turn-actions/dialogs/ChouetteVeluteDialogCard.vue";
import SouffletteDialogCard from "@/components/play-a-turn-actions/dialogs/SouffletteDialogCard.vue";
import DieCard from "@/components/play-a-turn-actions/DieCard.vue";
import { DiceForm, isDiceFormValid } from "@/domain/dice/compute-dice-result";

function getInitialDiceForm(): DiceForm {
  return [0, 0, 0];
}

@Component({
  components: {
    DieCard,
    SouffletteDialogCard,
    ChouetteVeluteDialogCard,
    MenuAction,
  },
})
export default class PlayATurnWithDice extends Vue {
  diceForm: DiceForm = getInitialDiceForm();

  get isConfirmButtonDisabled(): boolean {
    return !isDiceFormValid(this.diceForm);
  }

  confirm(): void {
    if (isDiceFormValid(this.diceForm)) {
      this.$emit("confirm", this.diceForm);
    }
  }
}
</script>

<style scoped lang="scss"></style>
