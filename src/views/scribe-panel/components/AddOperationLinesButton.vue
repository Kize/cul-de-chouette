<template>
  <span>
    <v-btn @click="showDialog = true">
      <v-icon class="mr-2">mdi-text-box-plus</v-icon>
      Ajouter des opérations
    </v-btn>

    <v-dialog
      v-model="showDialog"
      persistent
      fullscreen
      transition="dialog-bottom-transition"
    >
      <MainDialogCard
        title="Ajouter des opérations à des joueurs"
        confirm-button-label="Confirmer les opérations"
        :is-confirm-button-enabled="true"
        @cancel="cancel"
        @confirm="confirm"
      >
        <v-row justify="center" align="center">
          <v-btn @click="addEmptyOperation" class="mr-8">
            Ajouter une opération
          </v-btn>

          <v-checkbox
            label="Faire avancer le tour de jeu"
            v-model="form.shouldHandleEndTurn"
          ></v-checkbox>
        </v-row>

        <v-form ref="formRef" v-model="isFormValid" class="mt-4">
          <v-card
            :color="index % 2 === 0 ? 'blue lighten-5' : 'teal lighten-5'"
            v-for="(operation, index) in form.operations"
            :key="index"
            rounded
            class="px-6 py-2 mb-2"
          >
            <v-row justify="space-between">
              <v-col md="1" cols="4">
                <v-checkbox
                  label="Tour ?"
                  v-model="operation.shouldDisplayTurnNumber"
                ></v-checkbox>
              </v-col>

              <v-col md="2" cols="8">
                <v-select
                  label="Nom du joueur"
                  v-model="operation.playerName"
                  :items="playerNames"
                  :rules="rulesOfSelectNameInput"
                  prepend-icon="mdi-account"
                  clearable
                ></v-select>
              </v-col>

              <v-col md="auto" cols="12">
                <AmountInput
                  :min="-343"
                  :max="343"
                  v-model="operation.amount"
                ></AmountInput>
              </v-col>

              <v-col md="auto" cols="12" class="pt-5">
                <v-btn
                  large
                  @click="removeLine(index)"
                  :disabled="form.operations.length === 1"
                >
                  <v-icon class="mr-1">mdi-trash-can-outline</v-icon>
                  Retirer la line
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-form>
      </MainDialogCard>
    </v-dialog>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import AmountInput from "../../../components/AmountInput.vue";
import MainDialogCard from "../../../components/MainDialogCard.vue";
import { AllHistoryLineTypes, GodModLineType } from "@/domain/history";
import {
  rulesOfAmountInput,
  rulesOfSelectLineTypeInput,
  rulesOfSelectNameInput,
} from "@/form-validation/form-validation-rules";
import {
  AddOperationLinesActionPayload,
  OperationLineActionPayload,
} from "@/store/current-game/current-game.interface";
import { sortStrings } from "@/domain/sort";
import {
  NotImplementedRuleEffectEvent,
  RuleEffectEvent,
} from "../../../../domain/rules/rule-effect";

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
    operations: [
      { designation: GodModLineType.GOD_MOD, amount: 0 },
      { designation: GodModLineType.GOD_MOD, amount: 0 },
      { designation: GodModLineType.GOD_MOD, amount: 0 },
      { designation: GodModLineType.GOD_MOD, amount: 0 },
    ],
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
    AmountInput,
    MainDialogCard,
  },
  computed: {
    ...mapGetters("currentGame", ["playerNames"]),
  },
})
export default class PlayersBanner extends Vue {
  readonly rulesOfSelectNameInput = rulesOfSelectNameInput;
  readonly rulesOfSelectLineTypeInput = rulesOfSelectLineTypeInput;
  readonly rulesOfAmountInput = rulesOfAmountInput;

  showDialog = false;
  isFormValid = true;

  form: AddOperationLinesForm = getInitialForm();

  get lineTypes(): Array<string> {
    const implementedLineTypes = Object.values(RuleEffectEvent);
    const notImplementedLineTypes = Object.values(
      NotImplementedRuleEffectEvent
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
      operations: this.form.operations
        .filter((line) => line.playerName && line.amount)
        .map(lineFormToLineActionPayload),
    };

    this.$store.dispatch("currentGame/addGodModOperations", payload);
    this.showDialog = false;
    this.form = getInitialForm();
  }
}
</script>

<style scoped lang="scss">
.amount-modifiers-label {
  font-size: 1.1rem;
}
</style>
