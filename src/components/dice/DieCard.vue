<template>
  <v-btn-toggle
    :value="value"
    @change="changeDieValue"
    active-class="active-die"
    :class="{
      'cul-die': isCul,
      'chouette-die': !isCul,
      'vertical-die': !isHorizontal,
      'die-m': isSizeM,
      'die-xl': !isSizeM,
    }"
  >
    <v-btn
      class="die-face pa-0"
      :class="isCul ? 'cul-die' : 'chouette-die'"
      v-for="dieValue in 6"
      :key="dieValue"
      :value="dieValue"
    >
      <v-icon :size="iconSize" class="dice-icon"
        >mdi-dice-{{ dieValue }}-outline
      </v-icon>
    </v-btn>
  </v-btn-toggle>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class DieCard extends Vue {
  @Prop(Number) value!: number;
  @Prop(Boolean) isCul!: number;
  @Prop(Boolean) isHorizontal?: boolean;
  @Prop({ type: String, default: "m" }) size?: "m" | "xl";

  get isSizeM(): boolean {
    return this.size === "m";
  }

  get iconSize(): string {
    return this.size === "m" ? "5.45rem" : "9.5rem";
  }

  changeDieValue(dieValue: number | undefined): void {
    this.$emit("input", dieValue || 0);
  }
}
</script>

<style scoped lang="scss">
.v-btn-toggle.vertical-die {
  flex-direction: column;
}

.v-btn-toggle {
  &.cul-die,
  &.chouette-die {
    background: none !important;
  }

  &.chouette-die > .v-btn.die-face i.dice-icon {
    color: #448aff;
  }

  &.cul-die > .v-btn.die-face i.dice-icon {
    color: #2962ff;
  }

  &.die > .v-btn.v-btn.v-size--default.die-face {
    border-color: #bdbdbd !important;
  }

  &.die-m > .v-btn.v-btn.v-size--default.die-face {
    border-width: 2px;
    border-radius: 6px;
    height: 4rem;
    width: 4rem;
    margin-right: 0.5rem;
  }

  &.die-xl > .v-btn.v-btn.v-size--default.die-face {
    border-width: 5px;
    border-radius: 10px;
    height: 7rem;
    width: 7rem;
    margin-right: 1rem;
  }
}

.v-btn-toggle > .v-btn.v-btn--active.active-die {
  transform: scale(1.2);
  z-index: 10;

  &.chouette-die {
    background-color: #448aff;

    i.dice-icon {
      color: #00e676;
    }
  }

  &.cul-die {
    background-color: #2962ff;

    i.dice-icon {
      color: #00c853;
    }
  }
}
</style>
