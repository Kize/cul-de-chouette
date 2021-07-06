<template>
  <v-card>
    <v-card-title>La partie est terminée !</v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-list>
            <v-subheader>Classements des joueurs</v-subheader>

            <v-list-item-group>
              <v-list-item v-for="(player, index) in scoreboard" :key="index">
                <v-list-item-icon>
                  <v-icon
                    v-text="`mdi-numeric-${index + 1}-circle-outline`"
                  ></v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ player.playerName }}</v-list-item-title>
                  <v-list-item-subtitle
                    >{{ player.score }}
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
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
