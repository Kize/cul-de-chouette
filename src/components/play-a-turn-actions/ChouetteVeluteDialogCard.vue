<template>
  <MainDialogCard
    :title="`Application de la Chouette Velute du joueur ${currentPlayerName}`"
    confirm-button-label="Confirmer la chouette velute"
    :is-confirm-button-enabled="isFormValid"
    @cancel="cancel"
    @confirm="confirm"
  >
    <v-form ref="formRef" v-model="isFormValid">
      <v-row justify="center" dense>
        <v-col cols="10">
          <v-select
            label="Joueurs ayant disputé la chouette velute"
            v-model="form.playerNames"
            :rules="selectPlayersRules"
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
    </v-form>
  </MainDialogCard>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import MainDialogCard from "@/components/MainDialogCard.vue";

export interface ChouetteVeluteForm {
  value: number;
  playerNames: Array<string>;
}

const INITIAL_FORM: ChouetteVeluteForm = {
  value: 2,
  playerNames: []
};

@Component({
  components: { MainDialogCard }
})
export default class ChouetteVeluteDialogCard extends Vue {
  @Prop(String) currentPlayerName!: string;
  @Prop() playerNames!: Array<string>;

  readonly selectPlayersRules = [
    (names: Array<string>) =>
      names.length > 0 || "Au moins un joueur est requis"
  ];

  form: ChouetteVeluteForm = { ...INITIAL_FORM };
  isFormValid = true;

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
