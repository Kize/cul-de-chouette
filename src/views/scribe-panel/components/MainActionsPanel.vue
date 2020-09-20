<template>
  <v-card tile class="mb-2">
    <v-card-text class="pa-1">
      <v-btn
        tile
        color="primary"
        outlined
        large
        class="ma-2"
        @click="applyBevue"
        >Bévue</v-btn
      >

      <v-btn tile color="primary" outlined large class="ma-2"
        >Défi Grelottine
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Player } from "@/domain/player";

@Component({})
export default class MainActionsPanel extends Vue {
  @Prop() player!: Player;

  applyBevue(): void {
    this.$store.dispatch("currentGame/applyBevue", this.player.name);
  }
}
</script>

<style scoped lang="scss"></style>
