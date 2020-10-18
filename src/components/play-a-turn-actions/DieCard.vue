<template>
  <v-btn-toggle
    :value="value"
    @change="changeDieValue"
    :background-color="color"
    dark
    active-class="toto"
  >
    <v-btn :color="color" class="py-10" v-for="dieValue in 6" :key="dieValue">
      <v-icon size="56" class="dice-icon"
        >mdi-dice-{{ dieValue }}-outline</v-icon
      >
    </v-btn>
  </v-btn-toggle>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class DieCard extends Vue {
  @Prop(String) color!: string;
  @Prop(Number) value!: number;

  changeDieValue(dieValueIndex: number): void {
    this.$emit("input", dieValueIndex);
  }
}
</script>

<style scoped lang="scss">
.v-btn-toggle {
  flex-direction: column;
}

.v-btn-toggle > .v-btn.v-btn--active.toto i.dice-icon {
  color: #00e676;
}
</style>
