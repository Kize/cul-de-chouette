<template>
  <div>
    <MenuAction
      label="Chouette"
      :options="6"
      @click="basicPlay($event, playTypes.CHOUETTE)"
    >
    </MenuAction>

    <MenuAction
      label="Velute"
      :options="[3, 4, 5, 6]"
      @click="basicPlay($event, playTypes.VELUTE)"
    ></MenuAction>

    <v-btn
      tile
      color="primary"
      outlined
      large
      class="ma-2"
      @click="showChouetteVeluteDialog = true"
    >
      Chouette Velute
    </v-btn>

    <MenuAction
      label="Cul de chouette"
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
      @click="showSuiteDialog = true"
      >Suite
    </v-btn>

    <v-btn
      tile
      color="primary"
      outlined
      large
      class="ma-2"
      @click="basicPlay($event, playTypes.NEANT)"
      >Néant
    </v-btn>

    <v-dialog v-model="showChouetteVeluteDialog" persistent max-width="800">
      <ChouetteVeluteDialogCard
        :current-player-name="currentPlayer.name"
        :player-names="playerNames"
        @cancel="showChouetteVeluteDialog = false"
        @confirm="playChouetteVelute($event)"
      >
      </ChouetteVeluteDialogCard>
    </v-dialog>

    <v-dialog v-model="showSuiteDialog" persistent max-width="800">
      <SuiteDialogCard
        :current-player-name="currentPlayer.name"
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
  @Prop() currentPlayer!: Player;
  @Prop() players!: Array<Player>;
  @Prop() playerNames!: Array<string>;
  @Prop() turnNumber!: number;
  readonly playTypes = HistoryLineType;

  showChouetteVeluteDialog = false;
  showSuiteDialog = false;

  @Emit()
  basicPlay(value: number, designation: HistoryLineType): HistoryLineAction {
    return {
      playerName: this.currentPlayer.name,
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
      playerName: this.currentPlayer.name,
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
      playerName: this.currentPlayer.name,
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
