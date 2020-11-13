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
          <v-card
            color="blue-grey lighten-5"
            v-for="(operation, index) in form.operations"
            :key="index"
            rounded
            class="py-2 mb-2"
          >
            <v-row>
              <v-col md="3" cols="12" class="px-4 py-0 mt-3">
                <v-select
                  dense
                  label="Opération"
                  v-model="operation.designation"
                  :items="lineTypes"
                  :rules="selectLineTypeRules"
                  prepend-icon="mdi-note-text-outline"
                ></v-select>
              </v-col>

              <v-col md="3" cols="12" class="px-4 py-0 mt-3">
                <v-select
                  dense
                  label="Nom du joueur"
                  v-model="operation.playerName"
                  :items="playerNames"
                  :rules="selectNameRules"
                  prepend-icon="mdi-account"
                ></v-select>
              </v-col>

              <v-col md="6" cols="12" class="px-4 py-0">
                <v-row justify="center" align="center">
                  <v-col md="4" cols="12" class="py-0">
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

                  <v-col md="3" cols="6" class="py-0">
                    <v-checkbox
                      dense
                      label="Tour ?"
                      v-model="operation.shouldDisplayTurnNumber"
                    ></v-checkbox>
                  </v-col>
                  <v-col md="4" cols="6" class="py-0">
                    <v-btn
                      small
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
          </v-card>

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
import {
  AllHistoryLineTypes,
  GodModLineType,
  HistoryLineType,
  NotImplementedHistoryLineType,
} from "@/domain/history";
import {
  requiredAmountInputRules,
  selectLineTypeRules,
  selectNameRules,
} from "@/form-validation/form-validation-rules";
import {
  AddOperationLinesActionPayload,
  OperationLineActionPayload,
} from "@/store/current-game/current-game.interface";
import { sortStrings } from "@/domain/sort";

interface OperationLineForm {
  playerName?: string;
  designation?: AllHistoryLineTypes;
  amount?: number;
  shouldDisplayTurnNumber?: boolean;
}

interface AddOperationLinesForm {
  operations: Array<OperationLineForm>;
  shouldHandleEndTurn: boolean;
}

function getInitialForm(): AddOperationLinesForm {
  return {
    operations: [{ designation: GodModLineType.GOD_MOD }],
    shouldHandleEndTurn: false,
  };
}

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
    shouldDisplayTurnNumber: line.shouldDisplayTurnNumber || false,
  };
}

@Component({
  components: {
    MainDialogCard,
  },
  computed: {
    ...mapGetters("currentGame", ["playerNames"]),
  },
})
export default class PlayersBanner extends Vue {
  readonly selectNameRules = selectNameRules;
  readonly selectLineTypeRules = selectLineTypeRules;
  readonly requiredAmountInputRules = requiredAmountInputRules;

  showDialog = false;
  isFormValid = true;

  form: AddOperationLinesForm = getInitialForm();

  get lineTypes(): Array<string> {
    const implementedLineTypes = Object.values(HistoryLineType);
    const notImplementedLineTypes = Object.values(
      NotImplementedHistoryLineType
    );
    const godModLineTypes = Object.values(GodModLineType);

    implementedLineTypes.sort(sortStrings);
    notImplementedLineTypes.sort(sortStrings);

    return [
      ...godModLineTypes,
      ...implementedLineTypes,
      ...notImplementedLineTypes,
    ];
  }

  addEmptyOperation(): void {
    this.form.operations.push({ designation: GodModLineType.GOD_MOD });
  }

  removeLine(index: number): void {
    this.form.operations.splice(index, 1);
  }

  cancel(): void {
    this.showDialog = false;
    this.form = getInitialForm();
  }

  confirm(): void {
    const payload: AddOperationLinesActionPayload = {
      shouldHandleEndTurn: this.form.shouldHandleEndTurn,
      operations: this.form.operations.map(lineFormToLineActionPayload),
    };

    this.$store.dispatch("currentGame/addOperations", payload);
    this.showDialog = false;
    this.form = getInitialForm();
  }
}
</script>

<style scoped lang="scss"></style>
