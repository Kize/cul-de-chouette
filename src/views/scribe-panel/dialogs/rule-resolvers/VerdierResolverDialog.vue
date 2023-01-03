<template>
  <v-dialog
    v-if="verdierResolverDialog.isVisible"
    :value="verdierResolverDialog.isVisible"
    persistent
    max-width="75%"
  >
    <MainDialogCard
      :title="`${verdierResolverDialog.playerName} a fait '${verdierResolverDialog.diceValues[0]} et ${verdierResolverDialog.diceValues[1]}', impliquant un Verdier !`"
      :is-confirm-button-enabled="isFormValid"
      @cancel="cancel"
      @confirm="confirm"
    >
      <v-container fluid>
        <v-card class="mb-4" outlined>
          <v-card-title class="py-2">Les verlinettes:</v-card-title>
          <v-card-text class="pb-0">
            <ul class="player-names-list">
              <li v-for="(playerName, index) in playerNames" :key="index">
                <v-checkbox
                  :key="index"
                  v-model="form.bettingPlayerNames"
                  :value="playerName"
                  :label="playerName"
                >
                </v-checkbox>
              </li>
            </ul>
          </v-card-text>
        </v-card>

        <v-card outlined>
          <v-card-title class="py-2">Le lancé du cul:</v-card-title>
          <v-card-text class="pb-0">
            <v-row justify="center" class="my-4">
              <DieCard
                v-model="verdierResolverDialog.diceValues[0]"
                is-horizontal
                disabled
              ></DieCard>
            </v-row>

            <v-row justify="center" class="my-4">
              <DieCard
                v-model="verdierResolverDialog.diceValues[1]"
                is-horizontal
                disabled
              ></DieCard>
            </v-row>

            <v-row justify="center" class="my-4">
              <DieCard v-model="form.lastDieValue" is-horizontal></DieCard>
            </v-row>
          </v-card-text>
        </v-card>
      </v-container>
    </MainDialogCard>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters, mapState } from "vuex";
import MainDialogCard from "../../../../components/MainDialogCard.vue";
import BevueMenuAction from "../../../../components/BevueMenuAction.vue";
import DieCard from "@/components/dice/DieCard.vue";
import { DialogsState } from "@/store/current-game/dialogs.store";
import { DieValue } from "../../../../../domain/rule-runner/rules/dice-rule";
import { VerdierResolution } from "../../../../../domain/rule-runner/rules/level-3/verdier-rule";

interface VerdierForm {
  bettingPlayerNames: Array<string>;
  lastDieValue?: DieValue;
}

@Component({
  components: {
    DieCard,
    BevueMenuAction,
    MainDialogCard,
  },
  computed: {
    ...mapState("currentGame/dialogs", ["verdierResolverDialog"]),
    ...mapGetters("currentGame", ["playerNames"]),
  },
})
export default class VerdierResolverDialog extends Vue {
  verdierResolverDialog!: DialogsState["verdierResolverDialog"];
  playerNames!: Array<string>;

  form: VerdierForm = { bettingPlayerNames: [] };

  get isFormValid(): boolean {
    return this.form.lastDieValue !== undefined;
  }

  cancel(): void {
    this.resetForms();

    this.$store.dispatch("currentGame/play/cancelVerdier");
  }

  confirm(): void {
    if (this.form.lastDieValue !== undefined) {
      const resolution: VerdierResolution = {
        bettingPlayerNames: [...this.form.bettingPlayerNames],
        lastDieValue: this.form.lastDieValue,
      };
      this.resetForms();
      this.$store.dispatch("currentGame/play/resolveVerdier", resolution);
    }
  }

  private resetForms(): void {
    this.form = { bettingPlayerNames: [] };
  }
}
</script>

<style scoped lang="scss"></style>
