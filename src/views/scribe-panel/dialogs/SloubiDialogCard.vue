<template>
  <MainDialogCard
    title="Ajouter un joueur avec le Chante-Sloubi"
    confirm-button-label="Ajouter"
    :is-confirm-button-enabled="isFormValid && isSloubiScoreValid()"
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
            outlined
            rounded
            :rules="newPlayerNameRules"
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="3">
          <v-text-field
            label="Score du Sloubi"
            type="number"
            v-model="sloubiScore"
            disabled
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
      </v-row>

      <v-row>
        <v-col cols="5">
          <v-select
            label="Joueur précédent"
            clearable
            v-model="form.previousPlayer"
            :items="playerNames"
          ></v-select>
        </v-col>
        <v-spacer></v-spacer>

        <v-col col="3">
          <v-checkbox
            label="Sloubi réussi"
            v-model="form.isSloubiCompleted"
          ></v-checkbox>
        </v-col>

        <v-spacer></v-spacer>
      </v-row>
    </v-form>
  </MainDialogCard>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { SloubiActionPayload } from "@/store/current-game/current-game.interface";
import MainDialogCard from "@/components/MainDialogCard.vue";
import { newPlayerNameRules } from "@/domain/form-validation-rules";

const INITIAL_FORM: SloubiActionPayload = {
  name: "",
  isSloubiCompleted: false
};

@Component({
  components: { MainDialogCard }
})
export default class SloubiDialogCard extends Vue {
  @Prop(String) currentPlayerName!: string;
  @Prop(Number) sloubiScore!: number;
  @Prop() playerNames!: Array<string>;

  form: SloubiActionPayload = { ...INITIAL_FORM };
  isFormValid = true;

  isSloubiScoreValid(): boolean {
    return this.sloubiScore <= 228;
  }

  readonly newPlayerNameRules = newPlayerNameRules;

  @Emit()
  cancel(): void {
    this.form = { ...INITIAL_FORM };
    (this.$refs.formRef as VForm).resetValidation();
  }

  @Emit()
  confirm(): SloubiActionPayload {
    return { ...this.form };
  }
}
</script>

<style scoped lang="scss"></style>
