<template>
  <v-card>
    <v-card-title>Es-tu sûr d'annuler la partie ?</v-card-title>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn x-large class="px-6" @click="cancel"> Retour en jeu </v-btn>
      <v-btn x-large class="px-6" color="success" @click="confirm">
        Nouvelle partie
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Vue } from "vue-property-decorator";

@Component({})
export default class CancelGameDialogCard extends Vue {
  @Emit()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cancel(): void {}

  @Emit()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  confirm(): void {}
}
</script>

<style scoped lang="scss"></style>
