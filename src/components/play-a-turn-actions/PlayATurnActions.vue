<template>
  <div>
    <MenuAction
      label="Chouette"
      :disabled="!areActionsEnabled()"
      :options="6"
      @click="basicPlay($event, playTypes.CHOUETTE)"
    >
    </MenuAction>

    <MenuAction
      label="Velute"
      :disabled="!areActionsEnabled()"
      :options="[4, 5, 6]"
      @click="basicPlay($event, playTypes.VELUTE)"
    ></MenuAction>

    <MenuAction
      label="Cul de chouette"
      :disabled="!areActionsEnabled()"
      :options="6"
      @click="basicPlay($event, playTypes.CUL_DE_CHOUETTE)"
    >
    </MenuAction>

    <v-btn
      tile
      color="primary"
      outlined
      large
      class="ma-2"
      :disabled="!areActionsEnabled()"
      @click="showChouetteVeluteDialog = true"
    >
      Chouette Velute
    </v-btn>

    <v-btn
      tile
      color="primary"
      outlined
      large
      class="ma-2"
      :disabled="!areActionsEnabled()"
      @click="showSuiteDialog = true"
      >Suite
    </v-btn>

    <v-btn
      tile
      color="grey darken-4"
      outlined
      large
      class="ma-2"
      :disabled="!areActionsEnabled()"
      @click="basicPlay($event, playTypes.NEANT)"
      >Néant
    </v-btn>

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
} from "@/components/play-a-turn-actions/ChouetteVeluteDialogCard.vue";
import SuiteDialogCard, {
  SuiteForm
} from "@/components/play-a-turn-actions/SuiteDialogCard.vue";

@Component({
  components: { SuiteDialogCard, ChouetteVeluteDialogCard, MenuAction }
})
export default class PlayATurnActions extends Vue {
  @Prop() currentPlayerName!: string;
  @Prop() players!: Array<Player>;
  @Prop() playerNames!: Array<string>;
  @Prop() turnNumber?: number;
  @Prop() disabled?: boolean;
  readonly playTypes = HistoryLineType;

  showChouetteVeluteDialog = false;
  showSuiteDialog = false;

  areActionsEnabled(): boolean {
    return !this.disabled;
  }

  @Emit()
  basicPlay(value: number, designation: HistoryLineType): HistoryLineAction {
    return {
      playerName: this.currentPlayerName,
      designation,
      value,
      turnNumber: this.turnNumber
    };
  }

  @Emit()
  playChouetteVelute(
    form: ChouetteVeluteForm
  ): ChouetteVeluteHistoryLineAction {
    const action: ChouetteVeluteHistoryLineAction = {
      playerName: this.currentPlayerName,
      designation: HistoryLineType.CHOUETTE_VELUTE,
      value: form.value,
      shoutingPlayers: form.playerNames,
      turnNumber: this.turnNumber
    };

    this.showChouetteVeluteDialog = false;
    return action;
  }

  @Emit()
  playSuite(form: SuiteForm): SuiteHistoryLineAction {
    const action: SuiteHistoryLineAction = {
      playerName: this.currentPlayerName,
      designation: HistoryLineType.SUITE,
      multiplier: form.multiplier,
      loosingPlayerName: form.loosingPlayerName,
      isVelute: form.isVelute,
      turnNumber: this.turnNumber
    };

    this.showSuiteDialog = false;
    return action;
  }
}
</script>

<style scoped lang="scss"></style>
