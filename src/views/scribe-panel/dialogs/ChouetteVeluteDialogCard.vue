<template>
  <v-card>
    <v-card-title>
      Application de la Chouette Velute du joueur "{{ currentPlayerName }}"
    </v-card-title>

    <v-card-text>
      <v-row justify="center" dense>
        <v-col cols="10">
          <v-select
            label="Joueurs ayant disputé la chouette velute"
            v-model="form.playerNames"
            clearable
            multiple
            chips
            outlined
            :items="playerNames"
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center" dense>
        <v-col cols="4">
          <v-select
            label="Valeur de la chouette velute"
            v-model="form.value"
            outlined
            dense
            :items="[2, 4, 6]"
          ></v-select>
        </v-col>
      </v-row>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn color="green darken-1" text @click="cancel">
        Annuler
      </v-btn>
      <v-btn color="green darken-1" text @click="confirm">
        Confirmer la chouette velute
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

export interface ChouetteVeluteForm {
  value: number;
  playerNames: Array<string>;
}

const INITIAL_FORM: ChouetteVeluteForm = {
  value: 2,
  playerNames: []
};

@Component({
  components: {}
})
export default class ChouetteVeluteDialogCard extends Vue {
  @Prop(String) currentPlayerName!: string;
  @Prop() playerNames!: Array<string>;

  form: ChouetteVeluteForm = { ...INITIAL_FORM };

  @Emit()
  cancel(): void {
    this.form = { ...INITIAL_FORM };
  }

  @Emit()
  confirm(): ChouetteVeluteForm {
    return { ...this.form };
  }
}
</script>

<style scoped lang="scss"></style>
