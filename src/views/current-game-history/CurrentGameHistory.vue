<template>
  <div class="current-game-history">
    <v-app-bar flat class="d-flex justify-center">
      <v-toolbar-title class="mr-8">
        Historique de la partie - {{ name }}
      </v-toolbar-title>
      <router-link :to="scribePanelRoutePath">
        <v-btn tile small>
          Revenir à la partie en cours
        </v-btn>
      </router-link>
    </v-app-bar>

    <v-container class="d-flex justify-center">
      <v-card v-for="player in players" :key="player.name" class="mx-4">
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

              <v-list-item-action v-text="line.turnNumber"></v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ROUTES } from "@/router";
import { mapGetters, mapState } from "vuex";
import { computePlayerScore, Player } from "@/domain/player";

@Component({
  components: {},
  computed: {
    ...mapState("currentGame", ["name", "players"]),
    ...mapGetters("currentGame", ["getPlayerScore"])
  }
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
