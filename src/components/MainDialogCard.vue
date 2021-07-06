<template>
  <v-card>
    <v-card-title>
      <h2>{{ title }}</h2>

      <v-spacer></v-spacer>

      <BevueMenuAction></BevueMenuAction>
    </v-card-title>

    <v-card-text>
      <slot></slot>
    </v-card-text>

    <v-card-actions class="pb-6 pr-6">
      <v-spacer></v-spacer>
      <v-btn x-large class="px-6 mr-3" @click="cancel"> Annuler</v-btn>
      <v-btn
        x-large
        class="px-6"
        color="success"
        @click="confirm"
        :disabled="!isConfirmButtonEnabled"
      >
        {{ getConfirmButtonLabel() }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import BevueMenuAction from "@/components/BevueMenuAction.vue";

@Component({
  components: { BevueMenuAction },
})
export default class MainDialogCard extends Vue {
  @Prop({ required: true, type: String }) title!: string;
  @Prop({ type: String }) confirmButtonLabel?: string;
  @Prop({ type: Boolean }) isConfirmButtonEnabled!: boolean;

  getConfirmButtonLabel(): string {
    return this.confirmButtonLabel || "Valider";
  }

  @Emit()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cancel(): void {}

  @Emit()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  confirm(): void {}
}
</script>

<style scoped lang="scss"></style>
