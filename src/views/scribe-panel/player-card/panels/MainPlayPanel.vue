<template>
  <v-card tile class="mb-2">
    <v-card-text class="pa-1">
      <MenuAction
        label="Chouette"
        :options="6"
        :disabled="!isCurrentPlayer(player.name)"
        @click="basicPlay($event, playTypes.CHOUETTE)"
      >
      </MenuAction>

      <MenuAction
        label="Velute"
        :options="[3, 4, 5, 6]"
        :disabled="!isCurrentPlayer(player.name)"
        @click="basicPlay($event, playTypes.VELUTE)"
      ></MenuAction>

      <v-btn
        tile
        color="primary"
        outlined
        large
        class="ma-2"
        :disabled="!isCurrentPlayer(player.name)"
        @click="showChouetteVeluteDialog = true"
      >
        Chouette Velute
      </v-btn>

      <MenuAction
        label="Cul de chouette"
        :options="6"
        :disabled="!isCurrentPlayer(player.name)"
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
        :disabled="!isCurrentPlayer(player.name)"
        >Suite
      </v-btn>

      <v-btn
        tile
        color="primary"
        outlined
        large
        class="ma-2"
        :disabled="!isCurrentPlayer(player.name)"
        @click="basicPlay($event, playTypes.NEANT)"
        >Néant
      </v-btn>
    </v-card-text>

    <v-dialog v-model="showChouetteVeluteDialog" persistent max-width="800">
      <ChouetteVeluteDialogCard
        :current-player-name="player.name"
        :player-names="playerNames"
        @cancel="showChouetteVeluteDialog = false"
        @confirm="playChouetteVelute($event)"
      >
      </ChouetteVeluteDialogCard>
    </v-dialog>

    <v-dialog v-model="showSuiteDialog" persistent max-width="800">
      <SuiteDialogCard
        :current-player-name="player.name"
        :player-names="playerNames"
        @cancel="showSuiteDialog = false"
        @confirm="playSuite"
      ></SuiteDialogCard>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  ChouetteVeluteHistoryLineAction,
  HistoryLineAction,
  HistoryLineType,
  SuiteHistoryLineAction
} from "@/domain/history";
import { Player } from "@/domain/player";
import MenuAction from "@/components/MenuAction.vue";
import { mapGetters, mapState } from "vuex";
import ChouetteVeluteDialogCard, {
  ChouetteVeluteForm
} from "@/views/scribe-panel/dialogs/ChouetteVeluteDialogCard.vue";
import SuiteDialogCard, {
  SuiteForm
} from "@/views/scribe-panel/dialogs/SuiteDialogCard.vue";

@Component({
  components: { SuiteDialogCard, ChouetteVeluteDialogCard, MenuAction },
  computed: {
    ...mapState("currentGame", ["players", "turnNumber"]),
    ...mapGetters("currentGame", ["isCurrentPlayer", "playerNames"])
  }
})
export default class MainPlayPanel extends Vue {
  @Prop() player!: Player;

  showChouetteVeluteDialog = false;
  showSuiteDialog = false;
  readonly playTypes = HistoryLineType;

  readonly players!: ReadonlyArray<Player>;
  readonly turnNumber!: number;

  basicPlay(value: number, designation: HistoryLineType): void {
    const action: HistoryLineAction = {
      playerName: this.player.name,
      designation,
      value,
      turnNumber: this.turnNumber
    };
    this.$store.dispatch("currentGame/playATurn", action);
  }

  playChouetteVelute(form: ChouetteVeluteForm): void {
    const action: ChouetteVeluteHistoryLineAction = {
      playerName: this.player.name,
      designation: HistoryLineType.CHOUETTE_VELUTE,
      value: form.value,
      shoutingPlayers: form.playerNames,
      turnNumber: this.turnNumber
    };
    this.$store.dispatch("currentGame/playATurn", action);
    this.showChouetteVeluteDialog = false;
  }

  playSuite(form: SuiteForm): void {
    const action: SuiteHistoryLineAction = {
      playerName: this.player.name,
      designation: HistoryLineType.SUITE,
      multiplier: form.multiplier,
      loosingPlayerName: form.loosingPlayerName,
      isVelute: form.isVelute,
      turnNumber: this.turnNumber
    };

    this.$store.dispatch("currentGame/playATurn", action);
    this.showSuiteDialog = false;
  }
}
</script>

<style scoped lang="scss"></style>
