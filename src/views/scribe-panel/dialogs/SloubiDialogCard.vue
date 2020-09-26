<template>
  <MainDialogCard
    title="Ajouter un joueur avec le Chante-Sloubi"
    confirm-button-label="Ajouter"
    :is-confirm-button-enabled="isFormValid"
    @cancel="cancel"
    @confirm="confirm"
  >
    <v-form ref="formRef" v-model="isFormValid">
      <v-row>
        <v-col cols="5">
          <v-text-field
            label="Nom du nouveau joueur"
            v-model="form.name"
            clearable
            :rules="newPlayerNameRules"
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="3">
          <v-text-field
            label="Score du Sloubi"
            type="number"
            min="1"
            step="1"
            v-model="form.score"
            :rules="inputStrictlyPositiveIntegerRules"
            clearable
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>

      <v-row>
        <v-col cols="3">
          <v-select
            label="Joueur précédent"
            clearable
            v-model="form.previousPlayer"
            :items="playerNames"
          ></v-select>
        </v-col>
      </v-row>
    </v-form>
  </MainDialogCard>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { SloubiActionPayload } from "@/store/current-game/current-game.interface";
import MainDialogCard from "@/components/MainDialogCard.vue";
import {
  inputStrictlyPositiveIntegerRules,
  newPlayerNameRules
} from "@/domain/form-validation-rules";

const INITIAL_FORM: SloubiActionPayload = {
  name: "",
  score: 1
};

@Component({
  components: { MainDialogCard }
})
export default class SloubiDialogCard extends Vue {
  @Prop(String) currentPlayerName!: string;
  @Prop() playerNames!: Array<string>;

  form: SloubiActionPayload = { ...INITIAL_FORM };
  isFormValid = true;

  readonly newPlayerNameRules = newPlayerNameRules;
  readonly inputStrictlyPositiveIntegerRules = inputStrictlyPositiveIntegerRules;

  @Emit()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  cancel(): void {}

  @Emit()
  confirm(): SloubiActionPayload {
    return { ...this.form };
  }
}
</script>

<style scoped lang="scss"></style>
