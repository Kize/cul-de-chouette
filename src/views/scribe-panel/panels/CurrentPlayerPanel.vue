<template>
  <v-card outlined elevation="4" color="indigo lighten-5">
    <v-card-title class="headline">
      <span>{{ currentPlayer.name }}</span>
      <v-divider vertical class="mx-6"></v-divider>
      <span>Score: {{ getPlayerScore(currentPlayer.name) }}</span>
      <v-divider vertical class="mx-6"></v-divider>
      <span>Tour: {{ turnNumber }}</span>

      <v-spacer></v-spacer>

      <v-chip small color="primary" v-if="currentPlayer.hasGrelottine"
        >Grelottine
      </v-chip>
    </v-card-title>

    <v-card-text>
      <PlayATurnActions
        :current-player-name="currentPlayer.name"
        :players="players"
        :player-names="playerNames"
        :turn-number="turnNumber"
        :is-soufflette-enabled="isSouffletteEnabled"
        @basic-play="basicPlay"
        @play-chouette-velute="playChouetteVelute"
        @play-suite="playSuite"
        @play-soufflette="playSoufflette"
      >
      </PlayATurnActions>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import {
  ChouetteVeluteHistoryLineAction,
  HistoryLineAction,
  SuiteHistoryLineAction
} from "@/domain/history";
import { Player } from "@/domain/player";
import MenuAction from "@/components/MenuAction.vue";
import { mapGetters, mapState } from "vuex";
import ChouetteVeluteDialogCard from "@/components/play-a-turn-actions/ChouetteVeluteDialogCard.vue";
import SuiteDialogCard from "@/components/play-a-turn-actions/SuiteDialogCard.vue";
import PlayATurnActions from "@/components/play-a-turn-actions/PlayATurnActions.vue";
import { SouffletteActionPayload } from "@/domain/soufflette";

@Component({
  components: {
    PlayATurnActions,
    SuiteDialogCard,
    ChouetteVeluteDialogCard,
    MenuAction
  },
  computed: {
    ...mapState("currentGame", ["players", "turnNumber"]),
    ...mapState("currentGame/levelOne", ["isSouffletteEnabled"]),
    ...mapGetters("currentGame", [
      "isCurrentPlayer",
      "playerNames",
      "getPlayerScore"
    ])
  }
})
export default class CurrentPlayerPanel extends Vue {
  @Prop() currentPlayer!: Player;

  basicPlay(action: HistoryLineAction): void {
    this.$store.dispatch("currentGame/play/playATurn", action);
  }

  playChouetteVelute(action: ChouetteVeluteHistoryLineAction): void {
    this.$store.dispatch("currentGame/play/playATurn", action);
  }

  playSuite(action: SuiteHistoryLineAction): void {
    this.$store.dispatch("currentGame/play/playATurn", action);
  }

  playSoufflette(actionPayload: SouffletteActionPayload): void {
    this.$store.dispatch("currentGame/levelOne/playSoufflette", actionPayload);
  }
}
</script>

<style scoped lang="scss"></style>
