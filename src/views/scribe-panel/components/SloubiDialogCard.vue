<template>
  <v-card>
    <v-card-title class="headline"
      >Ajouter un joueur avec le Chante-Sloubi:
    </v-card-title>

    <v-card-text>
      <v-row>
        <v-col cols="5">
          <v-text-field
            v-model="form.name"
            label="Nom du nouveau joueur"
            :rules="rules"
            clearable
          ></v-text-field>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="3">
          <v-text-field
            v-model="form.score"
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
            :items="playerNames"
            label="Joueur précédent"
            clearable
            v-model="form.previousPlayer"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" text @click="cancel">
        Annuler
      </v-btn>
      <v-btn
        color="green darken-1"
        text
        @click="confirm"
        :disabled="!form.name"
      >
        Ajouter
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { SloubiActionPayload } from "@/store/current-game/current-game.interface";

@Component({
  components: {}
})
export default class SloubiDialogCard extends Vue {
  @Prop(String) currentPlayerName!: string;
  @Prop() playerNames!: Array<string>;

  form: SloubiActionPayload = {
    name: "",
    score: 0
  };
  readonly rules = [
    (v: string) => (v?.length > 0 && v?.length <= 10) || "10 caractères max."
  ];

  @Emit()
  cancel(): void {
    this.form = {
      name: "",
      score: 0
    };
  }

  @Emit()
  confirm(): SloubiActionPayload {
    return { ...this.form };
  }
}
</script>

<style scoped lang="scss"></style>
