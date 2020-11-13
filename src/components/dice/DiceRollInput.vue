<template>
  <div>
    <v-row>
      <v-col
        v-for="(dieNumber, dieIndex) in 3"
        :key="dieNumber"
        md="2"
        cols="4"
      >
        <DieCard
          v-model="diceForm[dieIndex]"
          @input="$emit('input', diceForm)"
          :is-cul="dieNumber === 3"
        >
        </DieCard>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from "vue-property-decorator";
import DieCard from "@/components/dice/DieCard.vue";
import { DiceForm } from "@/components/dice/dice-form";

@Component({
  components: {
    DieCard,
  },
})
export default class DiceRollInput extends Vue {
  @PropSync("value") diceForm!: DiceForm;
}
</script>

<style scoped lang="scss"></style>
