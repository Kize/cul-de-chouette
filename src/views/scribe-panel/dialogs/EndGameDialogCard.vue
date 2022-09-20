<template>
  <v-card>
    <v-card-title>La partie est terminée !</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Position</th>
                  <th class="text-left">Joueur</th>
                  <th class="text-left"><b>Score</b></th>
                  <th class="text-left">Somme positive</th>
                  <th class="text-left">Somme négative</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(player, index) in scoreboard" :key="index">
                  <td>{{ index }}</td>
                  <td>{{ player.playerName }}</td>
                  <td>
                    <b>{{ player.score }}</b>
                  </td>
                  <td>{{ player.positiveScoresSum }}</td>
                  <td>{{ player.negativeScoresSum }}</td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>

        <v-col cols="6">
          <v-img
            contain
            max-height="250"
            src="https://thumbs.gfycat.com/MerryTameAlligator-max-1mb.gif"
          ></v-img>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn x-large class="px-6" color="success" @click="confirm">
        Nouvelle partie
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { Scoreboard } from "@/store/current-game/current-game.interface";

@Component({})
export default class EndGameDialogCard extends Vue {
  @Prop() scoreboard!: Scoreboard;

  @Emit()
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  confirm(): void {}
}
</script>

<style scoped lang="scss"></style>
