<template>
  <div class="current-game-history">
    <v-row class="mx-2">
      <v-col lg="6" md="8" sm="12">
        <h1 class="headline">Historique de la partie - {{ name }}</h1>
      </v-col>
      <v-col>
        <router-link :to="scribePanelRoutePath">
          <v-btn tile> Revenir à la partie en cours </v-btn>
        </router-link>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        lg="3"
        md="4"
        sm="6"
        cols="12"
        v-for="player in players"
        :key="player.name"
      >
        <v-card>
          <v-card-title>
            {{ player.name }} - Score: {{ getPlayerScore(player.name) }}
          </v-card-title>

          <v-card-text>
            <v-list>
              <v-list-item
                v-for="(line, lineIndex) in player.history"
                :key="lineIndex"
              >
                <v-list-item-action
                  v-text="getPlayerScoreAtLine(player, lineIndex)"
                ></v-list-item-action>

                <v-list-item-content>
                  <v-list-item-title
                    v-text="line.designation"
                  ></v-list-item-title>
                  <v-list-item-subtitle
                    v-text="line.amount"
                  ></v-list-item-subtitle>
                </v-list-item-content>

                <v-list-item-action
                  v-text="line.turnNumber"
                ></v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
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
    ...mapState("currentGame", ["name", "players"]),
    ...mapGetters("currentGame", ["getPlayerScore"]),
  },
})
export default class CurrentGameHistory extends Vue {
  readonly players!: Array<Player>;
  readonly scribePanelRoutePath = ROUTES.SCRIBE_PANEL.path;

  getPlayerScoreAtLine(player: Player, lineIndex: number): number {
    return computePlayerScore(player, lineIndex);
  }
}
</script>

<style lang="scss"></style>
