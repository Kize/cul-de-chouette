<template>
  <div style="height: 100%">
    <v-card outlined elevation="4" color="indigo lighten-5" min-height="100%">
      <v-card-text>
        <v-row class="px-8 py-4">
          <v-alert dense elevation="4" shaped text type="info">
            {{ message }}
          </v-alert>
        </v-row>

        <v-row class="px-8 py-4">
          <v-col cols="12" md="6" class="main-actions__button-container">
            <v-btn
              x-large
              outlined
              block
              color="blue-grey"
              @click="removeLastEvent"
            >
              <v-icon class="mr-4">mdi-undo</v-icon>
              Annuler la dernière action
            </v-btn>
          </v-col>

          <v-col cols="12" md="6" class="main-actions__button-container">
            <v-btn
              x-large
              tile
              block
              color="yellow accent-4"
              @click="openGrelottine"
            >
              <v-icon class="mr-4">mdi-bell-alert-outline</v-icon>
              Défi Grelottine !
            </v-btn>
          </v-col>

          <v-col cols="12" md="6" class="main-actions__button-container">
            <v-btn
              x-large
              tile
              block
              color="primary"
              @click="showSloubiDialog = true"
            >
              <v-icon class="mr-4">mdi-account-cowboy-hat</v-icon>
              Chante-Sloubi !
            </v-btn>
          </v-col>

          <v-col cols="12" md="6" class="main-actions__button-container">
            <v-btn
              x-large
              block
              tile
              color="success"
              @click="openOperationLinesDialog"
            >
              <v-icon class="mr-2">mdi-text-box-plus</v-icon>
              Ajouter des opérations
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-dialog v-model="showSloubiDialog" persistent max-width="800">
      <SloubiDialogCard
        :player-names="playerNames"
        :sloubi-score="sloubiScore"
        :current-player-name="currentPlayer.name"
        @cancel="showSloubiDialog = false"
        @confirm="playSloubi($event)"
      >
      </SloubiDialogCard>
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

    <AddOperationLinesDialog></AddOperationLinesDialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import BevueMenuAction from "@/components/BevueMenuAction.vue";
import { SloubiActionPayload } from "@/store/current-game/current-game.interface";
import { Player } from "../../../../domain/player";
import { mapGetters } from "vuex";
import SloubiDialogCard from "@/views/scribe-panel/dialogs/SloubiDialogCard.vue";
import GrelottineDialogCard from "@/views/scribe-panel/dialogs/rule-resolvers/GrelottineResolverDialog.vue";
import AddOperationLinesDialog from "@/views/scribe-panel/components/AddOperationLinesDialog.vue";
import { GameLineType, HistoryLineApply } from "@/domain/history";
import { RuleEffectEvent } from "../../../../domain/rules/rule-effect";

@Component({
  components: {
    BevueMenuAction,
    SloubiDialogCard,
    GrelottineDialogCard,
    AddOperationLinesDialog,
  },
  computed: {
    ...mapGetters("currentGame", [
      "playerNames",
      "sloubiScore",
      "lastEventLines",
    ]),
  },
})
export default class MainActionsPanel extends Vue {
  @Prop() currentPlayer!: Player;
  lastEventLines!: Array<HistoryLineApply>;

  showSloubiDialog = false;

  errorSnackBar = {
    text: "",
    display: false,
  };

  get message(): string | undefined {
    return this.lastEventLines
      .filter((line) => line.designation !== GameLineType.PLAY_TURN)
      .map<string>(historyLineToMessage)
      .join(" / ");
  }

  openGrelottine(): void {
    this.$store.dispatch("currentGame/play/startGrelottineChallenge");
  }

  async playSloubi(form: SloubiActionPayload): Promise<void> {
    try {
      await this.$store.dispatch("currentGame/sloubi", form);
      this.showSloubiDialog = false;
    } catch (error) {
      this.errorSnackBar.text = error.message;
      this.errorSnackBar.display = true;
    }
  }

  openOperationLinesDialog(): void {
    this.$store.commit(
      "currentGame/dialogs/setAddOperationLinesDialogIsVisible",
      true
    );
  }

  removeLastEvent(): void {
    this.$store.dispatch("currentGame/play/cancelLastEvent");
  }
}

export function historyLineToMessage(line: HistoryLineApply): string {
  switch (line.designation) {
    case RuleEffectEvent.NEANT:
      return `${line.playerName} a fait un Néant. Il obtient une Grelottine.`;
    case RuleEffectEvent.BEVUE:
      return `${line.playerName} a pris une Bévue`;
    case RuleEffectEvent.SLOUBI:
      return `${line.playerName} a fait un Sloubi pour ${line.amount}`;

    case RuleEffectEvent.CUL_DE_CHOUETTE:
    case RuleEffectEvent.BLEU_ROUGE:
      return `${line.playerName} a fait un ${line.designation} pour ${line.amount}`;
    case RuleEffectEvent.VELUTE:
    case RuleEffectEvent.SUITE_VELUTE:
    case RuleEffectEvent.CHOUETTE:
    case RuleEffectEvent.ARTICHETTE:
      return `${line.playerName} a fait une ${line.designation} pour ${line.amount}`;

    case RuleEffectEvent.SOUFFLETTE_NO_CHALLENGE:
      return `${line.playerName} a fait une Soufflette`;
    case RuleEffectEvent.SOUFFLETTE_WON:
      return `${line.playerName} a gagné une Soufflette pour ${line.amount}`;
    case RuleEffectEvent.SOUFFLETTE_LOST:
      return `${line.playerName} a perdu une Soufflette pour ${line.amount}`;

    case RuleEffectEvent.SUITE:
      return `${line.playerName} a perdu une ${line.designation} pour ${line.amount}`;
    case RuleEffectEvent.CHOUETTE_VELUTE_WON:
      return `${line.playerName} a gagné une Chouette velute pour ${line.amount}`;
    case RuleEffectEvent.CHOUETTE_VELUTE_LOST:
      return `${line.playerName} a perdu une Chouette velute pour ${line.amount}`;
    case RuleEffectEvent.CHOUETTE_VELUTE_STOLEN:
      return `La Chouette velute a été volée à ${line.playerName}`;

    case RuleEffectEvent.SIROP_LOST:
      return `${line.playerName} a perdu un Sirotage pour ${line.amount}`;
    case RuleEffectEvent.SIROP_WON:
      return `${line.playerName} a gagné un Sirotage pour ${line.amount}`;
    case RuleEffectEvent.ATTRAPE_OISEAU_WON:
      return `${line.playerName} a gagné un Attrape-Oiseau pour ${line.amount}`;
    case RuleEffectEvent.ATTRAPE_OISEAU_LOST:
      return `${line.playerName} a perdu un Attrape-Oiseau pour ${line.amount}`;
    case RuleEffectEvent.SIROP_BET_LOST:
      return `${line.playerName} a perdu un pari de Sirotage pour ${line.amount}`;
    case RuleEffectEvent.SIROP_BET_WON:
      return `${line.playerName} a gagné un pari de Sirotage pour ${line.amount}`;
    case RuleEffectEvent.SIROP_BET_SKIPPED:
      return `${line.playerName} n'a pas parié`;
    case RuleEffectEvent.SIROP_BET_WON_BUT_NOT_CLAIMED:
      return `${line.playerName} n'a pas annoncé "Sirop Gagnant!"`;

    case RuleEffectEvent.ADD_CIVET:
    case RuleEffectEvent.REMOVE_CIVET:
    case RuleEffectEvent.CIVET_WON:
    case RuleEffectEvent.CIVET_LOST:
    case RuleEffectEvent.VERDIER_WON:
    case RuleEffectEvent.VERDIER_LOST:
    case RuleEffectEvent.ADD_JARRET:
    case RuleEffectEvent.REMOVE_JARRET:
    case RuleEffectEvent.BLEU_ROUGE_BET_WON:
      return `${line.designation} pour ${line.playerName}`;

    default:
      return `${JSON.stringify(line)}`;
  }
}
</script>

<style scoped lang="scss">
.main-actions__button-container {
  height: 10rem;

  .v-btn:not(.v-btn--round).v-size--x-large {
    height: 9rem;
  }
}
</style>
