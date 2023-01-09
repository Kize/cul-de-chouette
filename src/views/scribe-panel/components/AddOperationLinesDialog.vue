<template>
  <v-dialog
    v-model="addOperationLinesDialog.isVisible"
    persistent
    fullscreen
    transition="dialog-bottom-transition"
  >
    <MainDialogCard
      title="Ajouter des opérations à des joueurs"
      confirm-button-label="Confirmer les opérations"
      :is-confirm-button-enabled="true"
      @cancel="closeDialog"
      @confirm="confirm"
    >
      <v-row justify="center" align="center">
        <v-checkbox
          label="Faire avancer le tour de jeu"
          v-model="shouldHandleEndTurn"
        ></v-checkbox>
      </v-row>

      <v-form ref="formRef" class="mt-4">
        <v-card
          :color="index % 2 === 0 ? 'blue lighten-5' : 'teal lighten-5'"
          v-for="(operation, index) in lineOperations"
          :key="index"
          rounded
          class="mx-lg-12 mx-6 py-2 mb-8"
        >
          <v-row justify="space-around">
            <v-col md="auto" cols="12">
              <v-select
                label="Nom du joueur"
                v-model="operation.playerName"
                :items="playerNames"
                prepend-icon="mdi-account"
              ></v-select>
            </v-col>

            <v-col md="3" cols="12">
              <v-select
                v-model="operation.options"
                :items="optionItems"
                label="Options"
                multiple
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
          </v-row>
        </v-card>
      </v-form>
    </MainDialogCard>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters, mapState } from "vuex";
import AmountInput from "../../../components/AmountInput.vue";
import MainDialogCard from "../../../components/MainDialogCard.vue";
import {
  AllHistoryLineTypes,
  GodModLineType,
} from "../../../../domain/history/history-line";
import {
  AddOperationLinesActionPayload,
  OperationLineActionPayload,
} from "@/store/current-game/current-game.interface";
import { RuleEffectEvent } from "../../../../domain/rule-runner/rules/rule-effect";

interface OperationLineForm {
  playerName: string;
  designation: AllHistoryLineTypes;
  amount: number;
  options: Array<RuleEffectEvent>;
}

@Component({
  components: {
    AmountInput,
    MainDialogCard,
  },
  computed: {
    ...mapState("currentGame/dialogs", ["addOperationLinesDialog"]),
    ...mapGetters("currentGame", ["playerNames"]),
  },
})
export default class AddOperationLinesDialog extends Vue {
  readonly playerNames!: Array<string>;
  readonly optionItems = [
    RuleEffectEvent.ADD_GRELOTTINE,
    RuleEffectEvent.REMOVE_GRELOTTINE,
    RuleEffectEvent.ADD_CIVET,
    RuleEffectEvent.REMOVE_CIVET,
    RuleEffectEvent.ADD_JARRET,
    RuleEffectEvent.REMOVE_JARRET,
  ];

  addOperationLinesDialog!: { isVisible: boolean };

  shouldHandleEndTurn = false;
  lineOperations: Array<OperationLineForm> = [];

  @Watch("addOperationLinesDialog.isVisible")
  updateIsVisible(): void {
    this.shouldHandleEndTurn = false;
    this.lineOperations = this.getNewLineOperations();
  }

  closeDialog(): void {
    this.$store.commit(
      "currentGame/dialogs/setAddOperationLinesDialogIsVisible",
      false
    );
  }

  confirm(): void {
    const payload: AddOperationLinesActionPayload = {
      shouldHandleEndTurn: this.shouldHandleEndTurn,
      operations: this.lineOperations.reduce<Array<OperationLineActionPayload>>(
        (operations, currentLine) => {
          const mainLineActionPayload: Array<OperationLineActionPayload> = [];
          if (currentLine.amount) {
            mainLineActionPayload.push({
              playerName: currentLine.playerName,
              designation: currentLine.designation,
              amount: currentLine.amount,
            });
          }

          const optionActionPayloads =
            currentLine.options.map<OperationLineActionPayload>(
              (optionDesignation) => ({
                playerName: currentLine.playerName,
                designation: optionDesignation,
                amount: 0,
              })
            );

          return [
            ...operations,
            ...mainLineActionPayload,
            ...optionActionPayloads,
          ];
        },
        []
      ),
    };

    this.$store.dispatch("currentGame/addGodModOperations", payload);
    this.closeDialog();
  }

  private getNewLineOperations(): Array<OperationLineForm> {
    return this.playerNames.map<OperationLineForm>((playerName) => ({
      designation: GodModLineType.GOD_MOD,
      playerName,
      amount: 0,
      options: [],
    }));
  }
}
</script>

<style scoped lang="scss">
.amount-modifiers-label {
  font-size: 1.1rem;
}
</style>
