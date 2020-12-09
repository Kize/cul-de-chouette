<template>
  <v-form ref="formRef" v-model="isFormValid">
    <h2>Créer une partie</h2>

    <v-card color="grey lighten-3" class="my-4" tile>
      <v-card-title class="headline"> Détails de la partie</v-card-title>

      <v-card-text>
        <v-text-field
          label="Nom de la partie"
          v-model="form.gameName"
          :rules="newGameNameNameRules"
          counter
          outlined
          shaped
          clearable
        ></v-text-field>

        <v-card>
          <v-card-title>
            Difficulté
            <v-icon>mdi-star</v-icon>
          </v-card-title>

          <v-card-text>
            <v-checkbox
              label="La soufflette"
              v-model="form.rules.isSouffletteEnabled"
            ></v-checkbox>
            <v-checkbox
              label="Le sirop"
              v-model="form.rules.isSiropEnabled"
              @change="changeSiropEnabled"
            ></v-checkbox>
            <v-checkbox
              label="L'attrape-oiseau"
              v-model="form.rules.isAttrapeOiseauEnabled"
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
              label="Le Bleu-Rouge"
              v-model="form.rules.isBleuRougeEnabled"
            ></v-checkbox>
          </v-card-text>
        </v-card>
      </v-card-text>
    </v-card>

    <v-card color="grey lighten-3" class="my-4">
      <v-card-title class="headline">
        <span>Liste des joueurs - de 2 à 8 joueurs</span>
      </v-card-title>

      <v-card-text class="pb-0">
        <v-row>
          <v-col
            lg="3"
            md="6"
            cols="12"
            v-for="(_, index) of form.playerNames"
            :key="index"
          >
            <v-text-field
              :label="'Joueur ' + (index + 1)"
              v-model="form.playerNames[index]"
              :rules="newPlayerNameRules"
              clearable
              outlined
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
  newPlayerNameRules,
} from "@/form-validation/form-validation-rules";
import { NewGameForm } from "@/store/current-game/current-game.interface";

@Component({})
export default class NewGameFormSection extends Vue {
  readonly newPlayerNameRules = newPlayerNameRules;
  readonly newGameNameNameRules = newGameNameNameRules;

  isFormValid = true;

  form: NewGameForm = {
    gameName: `Partie du ${new Date().toLocaleString("FR-fr").split(" à ")[0]}`,
    playerNames: ["", ""],
    rules: {
      isSouffletteEnabled: true,
      isSiropEnabled: true,
      isAttrapeOiseauEnabled: true,
      isBleuRougeEnabled: true,
    },
  };

  get isAttrapeOiseauDisabled(): boolean {
    return !this.form.rules.isSiropEnabled;
  }

  canRemovePlayer(): boolean {
    return this.form.playerNames.length > 2;
  }

  canAddPlayer(): boolean {
    return this.form.playerNames.length < 8;
  }

  removePlayer(index: number): void {
    if (this.canRemovePlayer()) {
      this.form.playerNames.splice(index, 1);
    }
  }

  changeSiropEnabled(newStatus: boolean): void {
    if (!newStatus) {
      this.form.rules.isAttrapeOiseauEnabled = false;
    }
  }

  addPlayer(): void {
    if (this.canAddPlayer()) {
      this.form.playerNames.push("");
    }
  }

  getList(): string {
    return JSON.stringify(this.form.playerNames);
  }

  async createGame(): Promise<void> {
    try {
      await this.$store.dispatch("currentGame/startGame", this.form);
      await this.$router.push(ROUTES.SCRIBE_PANEL.path);
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
