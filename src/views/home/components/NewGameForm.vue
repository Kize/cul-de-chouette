<template>
  <v-form ref="form" lazy-validation>
    <h2>Créer une partie</h2>

    <v-card>
      <v-card-title class="headline"> Détails de la partie</v-card-title>

      <v-card-text>
        <v-text-field
          v-model="gameName"
          label="Nom de la partie"
          required
          append-icon="mdi-close"
          @click:append="clearGameName"
        ></v-text-field>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title class="headline">Liste des joueurs</v-card-title>

      <v-card-text>
        <div v-for="(player, index) of playerNames" :key="index">
          <v-text-field
            v-model="playerNames[index]"
            :label="'Joueur ' + (index + 1)"
            required
            append-icon="mdi-close"
            @click:append="removePlayer(index)"
          ></v-text-field>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn color="primary" @click="addPlayer">Ajouter un joueur</v-btn>
      </v-card-actions>
    </v-card>

    <v-btn color="success" class="mr-4" @click="createGame">
      Créer une partie
    </v-btn>
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

  clearGameName(): void {
    this.gameName = "";
  }

  removePlayer(index: number): void {
    this.playerNames.splice(index, 1);
  }

  addPlayer(): void {
    this.playerNames.push("");
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
