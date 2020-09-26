<template>
  <v-card>
    <!--    HEADER-->
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="cancel">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Défi de grelottine</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-container class="mt-n3 mr-16 pr-16">
          <BevueMenuAction :player-names="playerNames"></BevueMenuAction>
        </v-container>
        <v-btn dark text @click="confirm">Valider la grelottine</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-container>
      <v-row>
        <v-col cols="6">
          <v-select
            label="Grelottin"
            :items="playerNames"
            v-model="form.grelottin"
            outlined
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-select
            label="Joueur défié"
            :items="playerNames"
            v-model="form.challengedPlayer"
            outlined
          ></v-select>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="6">
          <v-select
            label="Défi"
            :items="challenges"
            v-model="form.challenge"
            outlined
          ></v-select>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="2">
          <v-text-field
            label="Montant du défi"
            v-model="form.amount"
            outlined
            rounded
            type="number"
          >
          </v-text-field>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="2">
          <v-text-field
            label="Résultat par le joueur défié"
            v-model="form.challengedPlayerScore"
            outlined
            rounded
            type="number"
          >
          </v-text-field>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-checkbox
          label="Défi réussi"
          class="big-checkbox"
          v-model="form.isChallengeCompleted"
          :ripple="false"
        ></v-checkbox>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import BevueMenuAction from "@/components/BevueMenuAction.vue";

export enum GrelottineChallenges {
  CHOUETTE = "Chouette",
  VELUTE = "Velute",
  CUL_DE_CHOUETTE = "Cul de chouette",
  CHOUETTE_VELUTE = "Chouette-velute",
  SIROP_GRELOT = "Sirop-grelot"
}

export interface GrelottineForm {
  grelottin: string;
  challengedPlayer: string;
  challengedPlayerScore: number;
  challenge: GrelottineChallenges;
  amount: number;
  isChallengeCompleted: boolean;
}

@Component({
  components: { BevueMenuAction }
})
export default class GrelottineDialogCard extends Vue {
  @Prop() playerNames!: Array<string>;

  challenges = Object.values(GrelottineChallenges);
  form: Partial<GrelottineForm> = {};

  @Emit()
  cancel(): void {
    this.form = {};
  }

  @Emit()
  confirm(): GrelottineForm {
    return { ...this.form } as GrelottineForm; //TODO: handle validation !!!
  }
}
</script>

<style scoped>
.big-checkbox >>> label {
  font-size: 2rem;
  margin-left: 1rem;
}

.big-checkbox >>> i {
  font-size: 3rem;
}
</style>
