<template>
  <v-card tile class="mb-2">
    <v-card-text class="pa-1">
      <MenuAction
        :disabled="cannotPlay()"
        label="Chouette"
        :options="6"
        @click="basicPlay($event, playTypes.CHOUETTE)"
      >
      </MenuAction>

      <MenuAction
        :disabled="cannotPlay()"
        label="Velute"
        :options="[3, 4, 5, 6]"
        @click="basicPlay($event, playTypes.VELUTE)"
      ></MenuAction>

      <v-btn
        :disabled="cannotPlay()"
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
        :disabled="cannotPlay()"
        label="Cul de chouette"
        :options="6"
        @click="basicPlay($event, playTypes.CUL_DE_CHOUETTE)"
      >
      </MenuAction>

      <v-btn
        :disabled="cannotPlay()"
        tile
        color="primary"
        outlined
        large
        class="ma-2"
        @click="playSuite"
        >Suite
      </v-btn>

      <v-btn
        :disabled="cannotPlay()"
        tile
        color="primary"
        outlined
        large
        class="ma-2"
        @click="basicPlay($event, playTypes.NEANT)"
        >Néant
      </v-btn>
    </v-card-text>
    <v-dialog v-model="showChouetteVeluteDialog" persistent max-width="800">
      <ChouetteVeluteDialogCard
        :current-player-name="player.name"
        :player-names="playerNames()"
        @cancel="showChouetteVeluteDialog = false"
        @confirm="playChouetteVelute($event)"
      >
      </ChouetteVeluteDialogCard>
    </v-dialog>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  ChouetteVeluteHistoryLineAction,
  HistoryLineAction,
  HistoryLineType
} from "@/domain/history";
import { Player } from "@/domain/player";
import MenuAction from "@/components/MenuAction.vue";
import { mapGetters } from "vuex";
import ChouetteVeluteDialogCard, {
  ChouetteVeluteForm
} from "@/views/scribe-panel/components/ChouetteVeluteDialogCard.vue";

@Component({
  components: { ChouetteVeluteDialogCard, MenuAction },
  computed: {
    ...mapGetters("currentGame", ["canPlayerPlay", "players"])
  }
})
export default class MainPlayPanel extends Vue {
  @Prop(Player) player!: Player;
  readonly playTypes = HistoryLineType;
  showChouetteVeluteDialog = false;

  cannotPlay(): boolean {
    return !this.canPlayerPlay(this.player.name);
  }

  playerNames(): Array<string> {
    return this.players.map(player => player.name);
  }

  basicPlay(value: number, designation: HistoryLineType): void {
    const action: HistoryLineAction = {
      playerName: this.player.name,
      designation,
      value
    };
    this.$store.dispatch("currentGame/playATurn", action);
  }

  playChouetteVelute(form: ChouetteVeluteForm): void {
    const action: ChouetteVeluteHistoryLineAction = {
      playerName: this.player.name,
      designation: HistoryLineType.CHOUETTE_VELUTE,
      value: form.value,
      shoutingPlayers: form.playerNames
    };
    this.$store.dispatch("currentGame/playATurn", action);
    this.showChouetteVeluteDialog = false;
  }

  playSuite(): void {
    window.alert("Pas codée encore :/");
  }
}
</script>

<style scoped lang="scss"></style>
