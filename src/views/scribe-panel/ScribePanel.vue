<template>
  <div class="scribe-panel">
    <h1 class="mb-6">
      <span>Gestion des scores - {{ gameName }}</span>

      <v-btn class="float-right mr-10" @click="showSloubiDialog = true">
        Chante-Sloubi !
      </v-btn>
    </h1>

    <v-row class="mb-6" no-gutters>
      <v-col
        v-for="player in players"
        :key="player.name"
        :cols="getColumnSize()"
      >
        <v-card
          class="pa-3 mx-1"
          tile
          outlined
          :color="
            canPlayerPlay(player.name) ? 'blue lighten-3' : 'blue lighten-5'
          "
        >
          <v-card-title class="headline">
            <span>{{ player.name }}</span>
            <v-divider vertical class="mx-6"></v-divider>
            <span>Score: {{ getPlayerScore(player.name) }}</span>

            <v-spacer></v-spacer>

            <v-chip small color="primary" v-if="player.hasGrelottine"
              >Grelottine
            </v-chip>
          </v-card-title>

          <MainActionsPanel :player="player"></MainActionsPanel>
          <MainPlayPanel :player="player"></MainPlayPanel>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="showSloubiDialog" persistent max-width="800">
      <v-card>
        <v-card-title class="headline"
          >Ajouter un joueur avec le Chante-Sloubi:
        </v-card-title>

        <v-card-text>
          <v-row>
            <v-col cols="5">
              <v-text-field
                v-model="sloubiForm.name"
                label="Nom du nouveau joueur"
                :rules="rules"
                clearable
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="3">
              <v-text-field
                v-model="sloubiForm.score"
                label="Score du Sloubi"
                type="number"
                clearable
              ></v-text-field>
            </v-col>
            <v-spacer></v-spacer>
          </v-row>

          <v-row>
            <v-col cols="3">
              <v-select
                :items="getPlayerNames()"
                label="Joueur précédent"
                clearable
                v-model="sloubiForm.previousPlayer"
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="showSloubiDialog = false">
            Annuler
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="playSloubi"
            :disabled="!sloubiForm.name"
          >
            Ajouter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="errorSnackBar.display" :timeout="3000">
      {{ errorSnackBar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="blue"
          text
          v-bind="attrs"
          @click="errorSnackBar.display = false"
        >
          Okay
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import {
  GameStatus,
  SloubiActionPayload
} from "@/store/current-game/current-game.interface";
import { mapGetters } from "vuex";
import MainActionsPanel from "./components/MainActionsPanel.vue";
import MainPlayPanel from "./components/MainPlayPanel.vue";
import { Player } from "@/domain/player";

@Component({
  components: { MainPlayPanel, MainActionsPanel },
  computed: {
    ...mapGetters("currentGame", [
      "gameName",
      "gameStatus",
      "players",
      "canPlayerPlay",
      "getPlayerScore"
    ])
  }
})
export default class ScribePanel extends Vue {
  sloubiForm: SloubiActionPayload = {
    name: "",
    score: 0
  };
  showSloubiDialog = false;
  rules = [
    (v: string) => (v?.length > 0 && v?.length <= 10) || "10 caractères max."
  ];
  errorSnackBar = {
    text: "",
    display: false
  };
  players!: Array<Player>;

  @Watch("gameStatus")
  onGameStatusChange(newStatus: GameStatus): void {
    console.log("hey", newStatus);
    switch (newStatus) {
      case GameStatus.CREATION:
        this.$router.push("/");
        break;
      case GameStatus.FINISHED:
        window.confirm("La partie est finie !");
        this.$store.dispatch("currentGame/handleEndGame");
        break;
    }
  }

  getColumnSize(): number {
    const playersNumber = this.players.length;
    return Math.ceil(12 / playersNumber);
  }

  getPlayerNames(): Array<string> {
    return this.players.map(player => player.name);
  }

  async playSloubi(): Promise<void> {
    try {
      await this.$store.dispatch("currentGame/sloubi", { ...this.sloubiForm });
      this.sloubiForm = {
        name: "",
        previousPlayer: undefined,
        score: 0
      };

      this.showSloubiDialog = false;
    } catch (error) {
      this.errorSnackBar.text = error.message;
      this.errorSnackBar.display = true;
    }
  }
}
</script>

<style lang="scss">
.control .icon.is-clickable {
  pointer-events: initial;
}
</style>
