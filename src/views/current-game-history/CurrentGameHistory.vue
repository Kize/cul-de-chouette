<template>
  <div class="current-game-history">
    <v-row class="mx-2 pb-12">
      <v-col lg="6" md="8" sm="12">
        <h1 class="headline">Historique de la partie - {{ name }}</h1>
      </v-col>

      <v-col>
        <router-link :to="scribePanelRoutePath">
          <v-btn x-large>Revenir à la partie en cours</v-btn>
        </router-link>
      </v-col>

      <v-col>
        <v-btn x-large outlined color="blue-grey" @click="removeLastEvent">
          <v-icon class="mr-4">mdi-undo</v-icon>
          Annuler la dernière ligne
        </v-btn>
      </v-col>
    </v-row>

    <v-simple-table
      class="history-table mx-4 mb-0"
      fixed-header
      height="85vh"
      dense
    >
      <template v-slot:default>
        <thead>
          <tr>
            <th
              class="history-cell"
              v-for="playerName in playerNames"
              :key="playerName"
            >
              {{ playerName }}
              <span class="line-amount">
                {{ getPlayerScore(playerName) }} points
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="historyLine in historyView" :key="historyLine.eventId">
            <td
              class="history-cell"
              v-for="playerLines in historyLine.playerHistories"
              :key="playerLines"
            >
              <table class="line-table">
                <tr v-for="playerLine in playerLines" :key="playerLine">
                  <td class="pr-4">{{ playerLine.designation }}</td>
                  <td class="pl-4 text-right">
                    <span class="line-amount">
                      {{ playerLine.amount }} points
                    </span>
                  </td>
                </tr>
              </table>

              <!--INSERT PROGRESS HERE-->
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ROUTES } from "@/router";
import { mapGetters, mapState } from "vuex";
import { computePlayerScore, Player } from "../../../domain/player";

@Component({
  components: {},
  computed: {
    ...mapState("currentGame", ["name"]),
    ...mapGetters("currentGame", [
      "playerNames",
      "getPlayerScore",
      "historyView",
    ]),
  },
})
export default class CurrentGameHistory extends Vue {
  readonly scribePanelRoutePath = ROUTES.SCRIBE_PANEL.path;

  getPlayerScoreAtLine(player: Player, lineIndex: number): number {
    return computePlayerScore(player, lineIndex);
  }

  removeLastEvent(): void {
    this.$store.dispatch("currentGame/play/cancelLastEvent");
  }
}
</script>

<style lang="scss" scoped>
.line-amount {
  text-align: right;
  font-size: 1.2em;
  font-weight: bold;
}

.history-table {
  .line-table {
    width: 100%;
  }

  .history-cell {
    white-space: nowrap;

    &:first-child {
      padding-top: 8px;
    }

    &:not(:last-child) {
      border-right: 1px solid grey;
      //border-bottom: none !important;
    }
  }

  th.history-cell {
    font-size: 1.3em;
    border-bottom: 1px solid grey !important;

    .line-amount {
      color: #2962ff;
      padding-left: 1em;
    }
  }
}
</style>
