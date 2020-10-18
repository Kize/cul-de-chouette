<template>
  <div>
    <v-row>
      <v-col v-for="dieNumber in 3" :key="dieNumber" md="2" cols="4">
        <DieCard
          v-model="diceForm[dieNumber - 1]"
          color="blue-grey darken-2"
          :is-selected="false"
        >
        </DieCard>
      </v-col>
    </v-row>

    <v-row>
      <v-col class="text-right">
        <v-btn
          color="green darken-1"
          text
          @click="confirm"
          :disabled="isConfirmButtonDisabled()"
          >Valider
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog v-model="showChouetteVeluteDialog" persistent max-width="800">
      <ChouetteVeluteDialogCard
        :current-player-name="currentPlayerName"
        :player-names="playerNames"
        @cancel="showChouetteVeluteDialog = false"
        @confirm="playChouetteVelute($event)"
      >
      </ChouetteVeluteDialogCard>
    </v-dialog>

    <v-dialog v-model="showSuiteDialog" persistent max-width="800">
      <SuiteDialogCard
        :current-player-name="currentPlayerName"
        :player-names="playerNames"
        @cancel="showSuiteDialog = false"
        @confirm="playSuite"
      ></SuiteDialogCard>
    </v-dialog>

    <v-dialog
      v-if="getIsSouffletteEnabled()"
      v-model="showSouffletteDialog"
      persistent
      max-width="1200"
    >
      <SouffletteDialogCard
        :current-player-name="currentPlayerName"
        :players="players"
        :player-names="playerNames"
        :turn-number="turnNumber"
        @confirm="playSoufflette"
        @cancel="showSouffletteDialog = false"
      >
      </SouffletteDialogCard>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import {
  ChouetteVeluteHistoryLineAction,
  HistoryLineAction,
  HistoryLineType,
  SuiteHistoryLineAction
} from "@/domain/history";
import { Player } from "@/domain/player";
import MenuAction from "@/components/MenuAction.vue";
import ChouetteVeluteDialogCard, {
  ChouetteVeluteForm
} from "@/components/play-a-turn-actions/dialogs/ChouetteVeluteDialogCard.vue";
import SuiteDialogCard, {
  SuiteForm
} from "@/components/play-a-turn-actions/dialogs/SuiteDialogCard.vue";
import SouffletteDialogCard from "@/components/play-a-turn-actions/dialogs/SouffletteDialogCard.vue";
import { SouffletteActionPayload } from "@/domain/soufflette";
import DieCard from "@/components/play-a-turn-actions/DieCard.vue";
import {
  computeDiceResult,
  DiceForm,
  isDiceFormValid,
  isVelute
} from "@/domain/dice/compute-dice-result";
import { computeDiceValue } from "@/domain/dice/compute-dice-value";

@Component({
  components: {
    DieCard,
    SouffletteDialogCard,
    SuiteDialogCard,
    ChouetteVeluteDialogCard,
    MenuAction
  }
})
export default class PlayATurnWithDice extends Vue {
  @Prop() currentPlayerName!: string;
  @Prop() players!: Array<Player>;
  @Prop() playerNames!: Array<string>;
  @Prop() isSouffletteEnabled?: boolean;
  @Prop() turnNumber?: number;
  @Prop() disabled?: boolean;
  readonly playTypes = HistoryLineType;

  showChouetteVeluteDialog = false;
  showSuiteDialog = false;
  showSouffletteDialog = false;

  isFormValid = true;
  diceForm: DiceForm = [-1, -1, -1];

  isConfirmButtonDisabled(): boolean {
    return this.disabled || !isDiceFormValid(this.diceForm);
  }

  getIsSouffletteEnabled(): boolean {
    return !!this.isSouffletteEnabled;
  }

  confirm(): void {
    if (!isDiceFormValid(this.diceForm)) {
      console.warn("Damn, handle this !");
      return;
    }

    const type = computeDiceResult(this.diceForm);
    switch (type) {
      case HistoryLineType.CHOUETTE_VELUTE:
        this.showChouetteVeluteDialog = true;
        return;
      case HistoryLineType.SUITE:
        this.showSuiteDialog = true;
        return;
    }

    const value = computeDiceValue(this.diceForm, type);
    this.basicPlay(value, type);
  }

  @Emit()
  private basicPlay(
    value: number,
    designation: HistoryLineType
  ): HistoryLineAction {
    this.diceForm = [-1, -1, -1];

    return {
      playerName: this.currentPlayerName,
      designation,
      value,
      turnNumber: this.turnNumber
    };
  }

  @Emit()
  private playChouetteVelute(
    form: ChouetteVeluteForm
  ): ChouetteVeluteHistoryLineAction {
    const action: ChouetteVeluteHistoryLineAction = {
      playerName: this.currentPlayerName,
      designation: HistoryLineType.CHOUETTE_VELUTE,
      value: computeDiceValue(this.diceForm, HistoryLineType.CHOUETTE_VELUTE),
      shoutingPlayers: form.playerNames,
      turnNumber: this.turnNumber
    };

    this.diceForm = [-1, -1, -1];
    this.showChouetteVeluteDialog = false;

    return action;
  }

  @Emit()
  private playSuite(form: SuiteForm): SuiteHistoryLineAction {
    const action: SuiteHistoryLineAction = {
      playerName: this.currentPlayerName,
      designation: HistoryLineType.SUITE,
      multiplier: form.multiplier,
      loosingPlayerName: form.loosingPlayerName,
      isVelute: isVelute(this.diceForm),
      turnNumber: this.turnNumber
    };

    this.diceForm = [-1, -1, -1];
    this.showSuiteDialog = false;

    return action;
  }

  @Emit()
  private playSoufflette(
    actionPayload: SouffletteActionPayload
  ): SouffletteActionPayload {
    this.showSouffletteDialog = false;
    return actionPayload;
  }
}
</script>

<style scoped lang="scss"></style>
