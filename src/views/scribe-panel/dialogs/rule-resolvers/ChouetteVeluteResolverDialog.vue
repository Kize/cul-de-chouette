<template>
  <v-dialog
    :value="chouetteVeluteResolverDialog.isVisible"
    persistent
    max-width="800"
  >
    <MainDialogCard
      :title="`${chouetteVeluteResolverDialog.playerName} a réalisé une Chouette Velute !`"
      confirm-button-label="Confirmer la chouette velute"
      :is-confirm-button-enabled="isFormValid"
      @cancel="cancel"
      @confirm="confirm"
    >
      <v-form ref="formRef" v-model="isFormValid">
        <p>Sélectionne les joueurs ayant disputés la Chouette Velute:</p>
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
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MainDialogCard from "@/components/MainDialogCard.vue";
import { VForm } from "@/vuetify.interface";
import { mapGetters, mapState } from "vuex";
import { DialogsState } from "@/store/current-game/dialogs.store";

export interface ChouetteVeluteForm {
  playerNames: Array<string>;
}

const INITIAL_FORM: ChouetteVeluteForm = {
  playerNames: [],
};

@Component({
  components: { MainDialogCard },
  computed: {
    ...mapState("currentGame/dialogs", ["chouetteVeluteResolverDialog"]),
    ...mapGetters("currentGame", ["playerNames"]),
  },
})
export default class ChouetteVeluteResolverDialog extends Vue {
  playerNames!: Array<string>;
  chouetteVeluteResolverDialog!: DialogsState["chouetteVeluteResolverDialog"];

  readonly selectPlayersRules = [
    (names: Array<string>): true | string =>
      names.length > 0 || "Au moins un joueur est requis",
  ];

  form: ChouetteVeluteForm = { ...INITIAL_FORM };
  isFormValid = false;

  cancel(): void {
    this.form = { ...INITIAL_FORM };
    (this.$refs.formRef as VForm).resetValidation();

    this.$store.dispatch("currentGame/play/cancelChouetteVelute");
  }

  confirm(): void {
    const form: ChouetteVeluteForm = {
      playerNames: [...this.form.playerNames],
    };

    this.form = { ...INITIAL_FORM };
    (this.$refs.formRef as VForm).resetValidation();

    this.$store.dispatch("currentGame/play/resolveChouetteVelute", form);
  }
}
</script>

<style scoped lang="scss">
.player-names-list li {
  padding: 0;
  list-style: none;
}
</style>
