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
            <v-row justify="center">
              <v-col md="1" cols="4" class="ml-auto">
                <v-checkbox
                  label="Tour ?"
                  v-model="operation.shouldDisplayTurnNumber"
                ></v-checkbox>
              </v-col>

              <v-col md="2" cols="6">
                <v-select
                  label="Nom du joueur"
                  v-model="operation.playerName"
                  :items="playerNames"
                  :rules="rulesOfSelectNameInput"
                  prepend-icon="mdi-account"
                  clearable
                ></v-select>
              </v-col>

              <v-col md="2" cols="4" class="pt-5 ml-auto">
                <v-btn
                  large
                  text
                  outlined
                  @click="updateOperationAmount(operation, -10)"
                >
                  <span class="amount-modifiers-label">- 10</span>
                </v-btn>
                <v-btn
                  class="mx-1"
                  large
                  text
                  outlined
                  @click="updateOperationAmount(operation, -5)"
                >
                  <span class="amount-modifiers-label">- 5</span>
                </v-btn>
                <v-btn
                  large
                  text
                  outlined
                  @click="updateOperationAmount(operation, -1)"
                >
                  <span class="amount-modifiers-label">- 1</span>
                </v-btn>
              </v-col>
              <v-col md="1" cols="10">
                <v-text-field
                  type="number"
                  step="1"
                  label="Montant"
                  v-model="operation.amount"
                  :rules="rulesOfAmountInput"
                ></v-text-field>
              </v-col>
              <v-col md="2" cols="4" class="pt-5 mr-auto">
                <v-btn
                  large
                  text
                  outlined
                  @click="updateOperationAmount(operation, 1)"
                >
                  <span class="amount-modifiers-label">+ 1</span>
                </v-btn>
                <v-btn
                  large
                  text
                  outlined
                  class="mx-1"
                  @click="updateOperationAmount(operation, 5)"
                >
                  <span class="amount-modifiers-label">+ 5</span>
                </v-btn>
                <v-btn
                  large
                  text
                  outlined
                  @click="updateOperationAmount(operation, 10)"
                >
                  <span class="amount-modifiers-label">+ 10</span>
                </v-btn>
              </v-col>

              <v-col md="auto" cols="auto" class="pt-5">
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
import MainDialogCard from "@/components/MainDialogCard.vue";
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

  updateOperationAmount(operation: OperationLineForm, modifier: number): void {
    const actualAmount = operation.amount || 0;
    operation.amount = actualAmount + modifier;
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
  //font-weight: 600;
  font-size: 1.1rem;
}
</style>
