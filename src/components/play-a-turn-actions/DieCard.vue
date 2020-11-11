<template>
  <v-btn-toggle
    :value="value"
    @change="changeDieValue"
    active-class="active-die"
    :class="{
      'cul-die': isCul,
      'chouette-die': !isCul,
      'vertical-die': !isHorizontal,
    }"
  >
    <v-btn
      class="die-face pa-0"
      :class="isCul ? 'cul-die' : 'chouette-die'"
      v-for="dieValue in 6"
      :key="dieValue"
      :value="dieValue"
    >
      <v-icon size="72" class="dice-icon"
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

  & > .v-btn.v-btn.v-size--default.die-face {
    border-color: #bdbdbd !important;
    border-width: 2px;
    border-radius: 6px;
    height: 56px;
    width: 56px;
  }
}

.v-btn-toggle > .v-btn.v-btn--active.active-die {
  transform: scale(1.25);
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
