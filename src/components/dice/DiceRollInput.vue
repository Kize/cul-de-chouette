<template>
  <div>
    <div
      class="die-container"
      v-for="(dieNumber, dieIndex) in 3"
      :key="dieNumber"
    >
      <DieCard
        v-model="diceForm[dieIndex]"
        @input="$emit('input', diceForm)"
        :is-cul="dieNumber === 3"
        is-horizontal
        size="xl"
      >
      </DieCard>
    </div>
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

<style scoped lang="scss">
.die-container {
  margin-top: 1.5rem;
}
</style>
