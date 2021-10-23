<template>
  <v-form ref="formRef" v-model="isFormValid">
    <v-row>
      <v-col md="6" cols="12">
        <v-card color="grey lighten-3" tile>
          <v-card-title class="headline">Créer une partie</v-card-title>

          <v-card-text>
            <v-text-field
              label="Nom de la partie"
              v-model="form.gameName"
              :rules="newGameNameNameRules"
              counter
              outlined
              clearable
            ></v-text-field>

            <v-card class="mb-2">
              <v-card-title>
                Difficulté
                <v-icon>mdi-star</v-icon>
              </v-card-title>

              <v-card-text>
                <v-checkbox
                  dense
                  label="La soufflette"
                  v-model="form.rules.isSouffletteEnabled"
                ></v-checkbox>
                <v-checkbox
                  dense
                  label="Le sirop"
                  v-model="form.rules.isSiropEnabled"
                  @change="changeSiropEnabled"
                ></v-checkbox>
                <v-checkbox
                  dense
                  label="L'attrape-oiseau"
                  v-model="form.rules.isAttrapeOiseauEnabled"
                  :disabled="isAttrapeOiseauDisabled"
                ></v-checkbox>
                <v-checkbox
                  dense
                  label="Le civet"
                  v-model="form.rules.isCivetEnabled"
                  :disabled="isAttrapeOiseauDisabled"
                ></v-checkbox>
              </v-card-text>
            </v-card>

            <v-card>
              <v-card-title>
                Difficulté
                <v-icon>mdi-star</v-icon>
                <v-icon>mdi-star</v-icon>
                <v-icon>mdi-star</v-icon>
              </v-card-title>

              <v-card-text>
                <v-checkbox
                  dense
                  label="Le Bleu-Rouge"
                  v-model="form.rules.isBleuRougeEnabled"
                ></v-checkbox>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="6" cols="12">
        <v-card color="grey lighten-3">
          <v-card-title class="headline">
            <span>Liste des joueurs - de 2 à 8 joueurs</span>
          </v-card-title>

          <v-card-text class="pb-0">
            <v-row>
              <v-col>
                <v-combobox
                  label="Sélection des joueurs"
                  hint="Attention: l'ordre des joueurs est important !"
                  v-model="form.playerNames"
                  :items="savedPlayerNames"
                  :rules="selectPlayersRules"
                  cache-items
                  persistent-hint
                  multiple
                  deletable-chips
                  small-chips
                  outlined
                ></v-combobox>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="pt-8">
      <v-spacer></v-spacer>
      <v-btn
        color="success"
        class="mr-4"
        @click="createGame"
        :disabled="!isFormValid"
      >
        Créer une partie
      </v-btn>
    </v-row>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ROUTES } from "@/router";
import {
  newGameNameNameRules,
  selectPlayersRules,
} from "@/form-validation/form-validation-rules";
import { NewGameForm } from "@/store/current-game/current-game.interface";

const PLAYER_NAMES_LOCAL_STORAGE_KEY = "playerNames";

@Component({})
export default class NewGameFormSection extends Vue {
  readonly newGameNameNameRules = newGameNameNameRules;
  readonly selectPlayersRules = selectPlayersRules;

  get savedPlayerNames(): Array<string> {
    return JSON.parse(
      window.localStorage.getItem(PLAYER_NAMES_LOCAL_STORAGE_KEY) || "[]"
    );
  }

  isFormValid = true;

  form: NewGameForm = {
    gameName: `Partie du ${new Date().toLocaleString("FR-fr").split(" à ")[0]}`,
    playerNames: [],
    rules: {
      isSouffletteEnabled: true,
      isSiropEnabled: true,
      isAttrapeOiseauEnabled: true,
      isCivetEnabled: true,
      isBleuRougeEnabled: true,
    },
  };

  get isAttrapeOiseauDisabled(): boolean {
    return !this.form.rules.isSiropEnabled;
  }

  changeSiropEnabled(newStatus: boolean): void {
    if (!newStatus) {
      this.form.rules.isAttrapeOiseauEnabled = false;
      this.form.rules.isCivetEnabled = false;
    }
  }

  async createGame(): Promise<void> {
    try {
      await this.$store.dispatch("currentGame/startGame", this.form);
      this.saveCurrentPlayerNames(this.form.playerNames);

      await this.$router.push(ROUTES.SCRIBE_PANEL.path);
    } catch (error) {
      window.alert(error.message);
    }
  }

  saveCurrentPlayerNames(newPlayers: Array<string>): void {
    const newPlayerNames = new Set([...newPlayers, ...this.savedPlayerNames]);
    const sortedPlayers = [...newPlayerNames].sort();

    window.localStorage.setItem(
      PLAYER_NAMES_LOCAL_STORAGE_KEY,
      JSON.stringify(sortedPlayers)
    );
  }
}
</script>

<style lang="scss">
.control .icon.is-clickable {
  pointer-events: initial;
}
</style>
