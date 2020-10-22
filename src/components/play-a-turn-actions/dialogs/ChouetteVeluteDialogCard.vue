<template>
  <MainDialogCard
    :title="`${currentPlayerName} a fait une Chouette Velute`"
    confirm-button-label="Confirmer la chouette velute"
    :is-confirm-button-enabled="isFormValid"
    @cancel="cancel"
    @confirm="confirm"
  >
    <v-form ref="formRef" v-model="isFormValid">
      <p>Sélectionner les joueurs ayant disputer la Chouette Velute:</p>
      <ul class="player-names-list">
        <li v-for="(playerName, index) in playerNames" :key="index">
          <v-checkbox
            :key="index"
            v-model="form.playerNames"
            :value="playerName"
            :label="playerName"
            :rules="selectPlayersRules"
            :hide-details="index !== playerNames.length - 1"
          >
          </v-checkbox>
        </li>
      </ul>
    </v-form>
  </MainDialogCard>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import MainDialogCard from "@/components/MainDialogCard.vue";
import { VForm } from "@/vuetify.interface";

export interface ChouetteVeluteForm {
  playerNames: Array<string>;
}

const INITIAL_FORM: ChouetteVeluteForm = {
  playerNames: [],
};

@Component({
  components: { MainDialogCard },
})
export default class ChouetteVeluteDialogCard extends Vue {
  @Prop(String) currentPlayerName!: string;
  @Prop() playerNames!: Array<string>;

  readonly selectPlayersRules = [
    (names: Array<string>): true | string =>
      names.length > 0 || "Au moins un joueur est requis",
  ];

  form: ChouetteVeluteForm = { ...INITIAL_FORM };
  isFormValid = false;

  @Emit()
  cancel(): void {
    this.form = { ...INITIAL_FORM };
    (this.$refs.formRef as VForm).resetValidation();
  }

  @Emit()
  confirm(): ChouetteVeluteForm {
    const form: ChouetteVeluteForm = {
      playerNames: [...this.form.playerNames],
    };

    this.form = { ...INITIAL_FORM };
    (this.$refs.formRef as VForm).resetValidation();

    return form;
  }
}
</script>

<style scoped lang="scss">
.player-names-list li {
  padding: 0;
  list-style: none;
}
</style>
