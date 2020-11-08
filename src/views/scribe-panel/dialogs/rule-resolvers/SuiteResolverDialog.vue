<template>
  <v-dialog :value="suiteResolverDialog.isVisible" persistent max-width="800">
    <MainDialogCard
      :title="`Sélection du joueur ayant perdu sur la suite de ${currentPlayerName}`"
      :is-confirm-button-enabled="isFormValid"
      @cancel="cancel"
      @confirm="confirm"
    >
      <v-form ref="formRef" v-model="isFormValid">
        <v-row justify="center" dense>
          <v-col md="10" cols="12">
            <v-select
              label="Joueur ayant perdu la suite"
              v-model="form.loosingPlayerName"
              :rules="selectNameRules"
              clearable
              outlined
              :items="playerNames"
              prepend-icon="mdi-account-outline"
            ></v-select>
          </v-col>
        </v-row>
        <v-row justify="space-around" dense>
          <v-col md="4" cols="12">
            <v-text-field
              type="number"
              min="1"
              step="1"
              label="Multiplicateur"
              v-model="form.multiplier"
              :rules="inputStrictlyPositiveIntegerRules"
              outlined
              dense
              prepend-icon="mdi-dice-multiple"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-form>
    </MainDialogCard>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MainDialogCard from "@/components/MainDialogCard.vue";
import {
  inputStrictlyPositiveIntegerRules,
  selectNameRules,
} from "@/form-validation/form-validation-rules";
import { VForm } from "@/vuetify.interface";
import { mapGetters, mapState } from "vuex";

export interface SuiteForm {
  multiplier: number;
  loosingPlayerName: string;
}

const INITIAL_FORM: SuiteForm = {
  loosingPlayerName: "",
  multiplier: 1,
};

@Component({
  components: { MainDialogCard },
  computed: {
    ...mapState("currentGame", ["currentPlayerName"]),
    ...mapState("currentGame/dialogs", ["suiteResolverDialog"]),
    ...mapGetters("currentGame", ["playerNames"]),
  },
})
export default class SuiteResolverDialog extends Vue {
  showDialog = false;
  currentPlayerName!: string;
  playerNames!: Array<string>;
  suiteResolverDialog!: { isVisible: boolean };

  form: SuiteForm = { ...INITIAL_FORM };
  isFormValid = true;

  readonly selectNameRules = selectNameRules;
  readonly inputStrictlyPositiveIntegerRules = inputStrictlyPositiveIntegerRules;

  cancel(): void {
    this.form = { ...INITIAL_FORM };
    (this.$refs.formRef as VForm).resetValidation();

    this.$store.dispatch("currentGame/play/cancelSuite");
  }

  confirm(): void {
    const form = { ...this.form };
    this.form = { ...INITIAL_FORM };
    (this.$refs.formRef as VForm).resetValidation();

    this.$store.dispatch("currentGame/play/resolveSuite", form);
  }
}
</script>

<style scoped lang="scss"></style>