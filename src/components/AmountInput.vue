<template>
  <v-row align="center">
    <v-btn
      large
      text
      outlined
      @click="updateAmount(-10)"
      :disabled="amount === min"
    >
      <span class="amount-modifiers-label">- 10</span>
    </v-btn>
    <v-btn
      class="mx-1"
      large
      text
      outlined
      @click="updateAmount(-5)"
      :disabled="amount === min"
    >
      <span class="amount-modifiers-label">- 5</span>
    </v-btn>
    <v-btn
      large
      text
      outlined
      @click="updateAmount(-1)"
      :disabled="amount === min"
    >
      <span class="amount-modifiers-label">- 1</span>
    </v-btn>
    <v-col cols="2">
      <v-text-field
        label="Montant"
        type="number"
        step="1"
        :min="min"
        :max="max"
        v-model="amount"
        @change="$emit('input', parseInt($event))"
      ></v-text-field>
    </v-col>
    <v-btn
      large
      text
      outlined
      @click="updateAmount(1)"
      :disabled="amount === max"
    >
      <span class="amount-modifiers-label">+ 1</span>
    </v-btn>
    <v-btn
      large
      text
      outlined
      class="mx-1"
      @click="updateAmount(5)"
      :disabled="amount === max"
    >
      <span class="amount-modifiers-label">+ 5</span>
    </v-btn>
    <v-btn
      large
      text
      outlined
      @click="updateAmount(10)"
      :disabled="amount === max"
    >
      <span class="amount-modifiers-label">+ 10</span>
    </v-btn>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue } from "vue-property-decorator";

@Component({})
export default class AmountInput extends Vue {
  @PropSync("value", { required: true }) amount!: number;
  @Prop({ required: true }) min!: number;
  @Prop({ required: true }) max!: number;

  updateAmount(modifier: number): void {
    let value = this.amount + modifier;

    if (value < this.min) {
      value = this.min;
    }
    if (value > this.max) {
      value = this.max;
    }

    this.$emit("input", value);
  }
}
</script>

<style scoped lang="scss">
.amount-modifiers-label {
  font-size: 1.1rem;
}
</style>
