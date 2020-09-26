<template>
  <MainDialogCard
    :title="
      `Sélection du joueur ayant perdu sur la suite de ${currentPlayerName}`
    "
    :is-confirm-button-enabled="isFormValid"
    @cancel="cancel"
    @confirm="confirm"
  >
    <v-form ref="formRef" v-model="isFormValid">
      <v-row justify="center" dense>
        <v-col cols="10">
          <v-select
            label="Joueur ayant perdu la suite"
            v-model="form.loosingPlayerName"
            :rules="selectNameRules"
            clearable
            outlined
            :items="playerNames"
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="space-around" dense>
        <v-col cols="4">
          <v-text-field
            type="number"
            min="1"
            step="1"
            label="Multiplicateur"
            v-model="form.multiplier"
            :rules="inputNumberRules"
            outlined
            dense
          ></v-text-field>
        </v-col>

        <v-col cols="2">
          <v-checkbox
            class="mt-1"
            v-model="form.isVelute"
            label="Velute"
          ></v-checkbox>
        </v-col>
      </v-row>
    </v-form>
  </MainDialogCard>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import MainDialogCard from "@/components/MainDialogCard.vue";
import {
  inputNumberRules,
  selectNameRules
} from "@/domain/form-validation-rules";

export interface SuiteForm {
  multiplier: number;
  loosingPlayerName: string;
  isVelute: boolean;
}

const INITIAL_FORM: SuiteForm = {
  loosingPlayerName: "",
  multiplier: 1,
  isVelute: false
};

@Component({
  components: { MainDialogCard }
})
export default class SuiteDialogCard extends Vue {
  @Prop(String) currentPlayerName!: string;
  @Prop() playerNames!: Array<string>;

  form: SuiteForm = { ...INITIAL_FORM };
  isFormValid = true;

  readonly selectNameRules = selectNameRules;
  readonly inputNumberRules = inputNumberRules;

  @Emit()
  cancel(): void {
    this.form = { ...INITIAL_FORM };
  }

  @Emit()
  confirm(): SuiteForm {
    return { ...this.form };
  }
}
</script>

<style scoped lang="scss"></style>
