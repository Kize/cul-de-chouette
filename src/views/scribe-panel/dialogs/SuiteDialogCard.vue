<template>
  <v-card>
    <v-card-title>
      Sélection du joueur ayant perdu sur la suite de "{{ currentPlayerName }}"
    </v-card-title>

    <v-card-text>
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
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="grey darken-2" text @click="cancel">
        Annuler
      </v-btn>
      <v-btn
        color="green darken-1"
        text
        @click="confirm"
        :disabled="!isFormValid"
      >
        Valider
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { selectNameRules } from "@/domain/player";

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

function isInteger(number: number): boolean {
  return number % 1 === 0;
}

@Component({
  components: {}
})
export default class SuiteDialogCard extends Vue {
  @Prop(String) currentPlayerName!: string;
  @Prop() playerNames!: Array<string>;

  form: SuiteForm = { ...INITIAL_FORM };
  isFormValid = true;

  selectNameRules = selectNameRules;
  inputNumberRules = [
    (num: number) =>
      (num >= 1 && isInteger(num)) || "Ce champ doit être un entier positif"
  ];

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
