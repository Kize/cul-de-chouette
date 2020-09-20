<template>
  <v-form ref="form" lazy-validation>
    <h2>Créer une partie</h2>

    <v-card color="grey lighten-3" class="my-4" tile>
      <v-card-title class="headline"> Détails de la partie</v-card-title>

      <v-card-text>
        <v-text-field
          v-model="gameName"
          label="Nom de la partie"
          required
          clearable
        ></v-text-field>
      </v-card-text>
    </v-card>

    <v-card color="grey lighten-3" class="my-4">
      <v-card-title class="headline">
        <span>Liste des joueurs - de 2 à 6 joueurs</span>
      </v-card-title>

      <v-card-text class="pb-0">
        <v-row>
          <v-col cols="3" v-for="(player, index) of playerNames" :key="index">
            <v-text-field
              v-model="playerNames[index]"
              :label="'Joueur ' + (index + 1)"
              required
              clearable
              outlined
              :rules="rules"
              counter
              dense
              :append-outer-icon="
                canRemovePlayer() ? 'mdi-trash-can' : undefined
              "
              @click:append-outer="removePlayer(index)"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          class="mb-n8 mr-4"
          color="primary"
          fab
          right
          @click="addPlayer"
          :disabled="!canAddPlayer()"
        >
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-row class="pt-8">
      <v-spacer></v-spacer>
      <v-btn color="success" class="mr-4" @click="createGame">
        Créer une partie
      </v-btn>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { StartGameData } from "@/store/current-game/current-game.interface";

@Component({
  components: {}
})
export default class NewGameForm extends Vue {
  gameName = `Partie du ${new Date().toLocaleString("FR-fr").split(" à ")[0]}`;
  playerNames: Array<string> = ["", "", ""];
  rules = [v => v.length <= 10 || "10 caractères max."];

  canRemovePlayer(): boolean {
    return this.playerNames.length > 2;
  }

  canAddPlayer(): boolean {
    return this.playerNames.length < 6;
  }

  removePlayer(index: number): void {
    if (this.canRemovePlayer()) {
      this.playerNames.splice(index, 1);
    }
  }

  addPlayer(): void {
    if (this.canAddPlayer()) {
      this.playerNames.push("");
    }
  }

  getList(): string {
    return JSON.stringify(this.playerNames);
  }

  async createGame(): Promise<void> {
    const data: StartGameData = {
      gameName: this.gameName,
      playerNames: this.playerNames
    };

    try {
      await this.$store.dispatch("currentGame/startGame", data);
      await this.$router.push("/scribe-panel");
    } catch (error) {
      window.alert(error.message);
    }
  }
}
</script>

<style lang="scss">
.control .icon.is-clickable {
  pointer-events: initial;
}
</style>
