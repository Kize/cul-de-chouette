<template>
  <span>
    <v-btn @click="showDialog = true">
      <v-icon class="mr-2">mdi-text-box-plus</v-icon>
      Ajouter des opérations
    </v-btn>

    <v-dialog v-model="showDialog" persistent max-width="90%">
      <MainDialogCard
        title="Ajouter des opérations à des joueurs"
        confirm-button-label="Confirmer les opérations"
        :is-confirm-button-enabled="isFormValid"
        @cancel="cancel"
        @confirm="confirm"
      >
        <v-form ref="formRef" v-model="isFormValid" class="mt-4">
          <v-row v-for="(operation, index) in form.operations" :key="index">
            <v-col class="mx-5 px-4">
              <v-select
                dense
                label="Nom du joueur"
                v-model="operation.playerName"
                :items="playerNames"
                :rules="selectNameRules"
                prepend-icon="mdi-account"
              ></v-select>
            </v-col>

            <v-col class="mx-5 px-4">
              <v-select
                dense
                label="Opération"
                v-model="operation.designation"
                :items="lineTypes"
                :rules="selectLineTypeRules"
                prepend-icon="mdi-note-text-outline"
              ></v-select>
            </v-col>

            <v-col class="mx-5 px-4">
              <v-row justify="space-around" align="start">
                <v-col cols="3" class="pa-0">
                  <v-text-field
                    dense
                    type="number"
                    step="1"
                    label="Montant"
                    v-model="operation.amount"
                    :rules="requiredAmountInputRules"
                    prepend-icon="mdi-dice-multiple"
                  ></v-text-field>
                </v-col>

                <v-col cols="4" class="pa-0">
                  <v-checkbox
                    dense
                    class="pl-3 mt-1"
                    label="Afficher le tour"
                    v-model="operation.shouldDisplayTurnNumber"
                  ></v-checkbox>
                </v-col>
                <v-col cols="3" class="pa-0">
                  <v-btn
                    small
                    class="mt-1"
                    @click="removeLine(index)"
                    :disabled="form.operations.length === 1"
                  >
                    <v-icon class="mr-1">mdi-trash-can-outline</v-icon>
                    Retirer
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>

          <v-row justify="center" align="center">
            <v-btn @click="addEmptyOperation" class="mr-8">
              Ajouter une opération
            </v-btn>

            <v-checkbox
              label="Faire avancer le tour de jeu"
              v-model="form.shouldHandleEndTurn"
            ></v-checkbox>
          </v-row>
        </v-form>
      </MainDialogCard>
    </v-dialog>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import MainDialogCard from "@/components/MainDialogCard.vue";
import { HistoryLineType } from "@/domain/history";
import {
  requiredAmountInputRules,
  selectLineTypeRules,
  selectNameRules
} from "@/domain/form-validation-rules";
import {
  AddOperationLinesActionPayload,
  OperationLineActionPayload
} from "@/store/current-game/current-game.interface";

interface OperationLineForm {
  playerName?: string;
  designation?: HistoryLineType;
  amount?: number;
  shouldDisplayTurnNumber?: boolean;
}

interface AddOperationLinesForm {
  operations: Array<OperationLineForm>;
  shouldHandleEndTurn: boolean;
}

const INITIAL_FORM: AddOperationLinesForm = {
  operations: [{}],
  shouldHandleEndTurn: false
};

function lineFormToLineActionPayload(
  line: OperationLineForm
): OperationLineActionPayload {
  if (!line.playerName || !line.designation || line.amount === undefined) {
    throw new Error("Le formulaire n'aurait pas dû être validé !");
  }

  return {
    playerName: line.playerName,
    designation: line.designation,
    amount: Number(line.amount),
    shouldDisplayTurnNumber: line.shouldDisplayTurnNumber || false
  };
}

@Component({
  components: {
    MainDialogCard
  },
  computed: {
    ...mapGetters("currentGame", ["playerNames"])
  }
})
export default class PlayersBanner extends Vue {
  readonly selectNameRules = selectNameRules;
  readonly selectLineTypeRules = selectLineTypeRules;
  readonly requiredAmountInputRules = requiredAmountInputRules;

  readonly lineTypes = Object.values(HistoryLineType);

  showDialog = false;
  isFormValid = true;

  form = INITIAL_FORM;

  addEmptyOperation(): void {
    this.form.operations.push({});
  }

  removeLine(index: number): void {
    this.form.operations.splice(index, 1);
  }

  cancel(): void {
    this.showDialog = false;
  }

  confirm(): void {
    const payload: AddOperationLinesActionPayload = {
      shouldHandleEndTurn: this.form.shouldHandleEndTurn,
      operations: this.form.operations.map(lineFormToLineActionPayload)
    };

    this.$store.dispatch("currentGame/addOperations", payload);
    this.showDialog = false;
  }
}
</script>

<style scoped lang="scss"></style>
