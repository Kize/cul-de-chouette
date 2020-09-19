<template>
  <div class="new-game-form">
    <h2>Créer d'une partie</h2>

    <!--GAME INFO-->
    <h3>Détails de la partie</h3>

    <!--GAME NAME FIELD-->
    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Nom de la partie</label>
      </div>
      <div class="field-body">
        <div class="field is-expanded">
          <div class="field has-addons">
            <div class="control is-expanded">
              <input
                :class="{
                  input: true,
                  'is-danger': !gameName.length
                }"
                type="text"
                v-model="gameName"
              />
            </div>
            <div class="control">
              <button class="button" @click="clearGameName">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <p v-if="!gameName.length" class="help is-danger">
            Le nom de la partie est requis.
          </p>
        </div>
      </div>
    </div>

    <!--PLAYERS-->
    <h3>Liste des joueurs</h3>
    <div
      v-for="(player, index) of playerNames"
      :key="index"
      class="field is-horizontal"
    >
      <div class="field-label is-normal">
        <label :for="'playerName' + index" class="label"
          >Joueur {{ index + 1 }}</label
        >
      </div>
      <div class="field-body">
        <div class="field is-expanded">
          <div class="field has-addons">
            <div class="control is-expanded">
              <input
                :class="{ input: true }"
                type="text"
                v-model="playerNames[index]"
              />
            </div>
            <div class="control">
              <button class="button" @click="removePlayer(index)">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-grouped is-grouped-centered">
      <div class="control">
        <button class="button is-info" @click="addPlayer">
          Ajouter un joueur
        </button>
      </div>
      <div class="control">
        <button class="button is-primary" @click="createGame">
          Créer la partie
        </button>
      </div>
    </div>
  </div>
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
