<template>
  <v-dialog
    :value="grelottineResolverDialog.isVisible"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-form ref="formRef" v-model="isFormValid">
        <v-card color="yellow accent-4">
          <v-row align="center" class="mx-md-8 mx-4" dense no-gutters>
            <v-col cols="2" class="">
              <v-btn icon @click="cancel">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-col>
            <v-col md="7" cols="8" class="text-center">
              <v-toolbar-title>Défi de grelottine</v-toolbar-title>
            </v-col>
            <v-col md="3" cols="4" class="text-right py-0">
              <BevueMenuAction></BevueMenuAction>
            </v-col>
          </v-row>
        </v-card>

        <v-row class="mx-md-12 mx-6">
          <v-col cols="12" md="6">
            <v-card class="pa-4" outlined>
              <v-card-title>Conditions du défi</v-card-title>

              <v-row>
                <v-col md="6" cols="12">
                  <v-select
                    label="Grelottin"
                    :items="grelottinePlayerNames"
                    v-model="form.grelottinPlayer"
                    :rules="selectPlayerRules"
                    :hint="
                      form.grelottinPlayer
                        ? `Score: ${getPlayerScore(form.grelottinPlayer)}`
                        : ''
                    "
                    no-data-text="Aucun joueur n'a de grelottine ou un score suffisant"
                    persistent-hint
                    clearable
                    outlined
                    @change="setAmountToMax"
                  ></v-select>
                </v-col>

                <v-col md="6" cols="12">
                  <v-select
                    label="Joueur défié"
                    :items="grelottinePlayerNames"
                    v-model="form.challengedPlayer"
                    :rules="selectPlayerRules"
                    :hint="
                      form.challengedPlayer
                        ? `Score: ${getPlayerScore(form.challengedPlayer)}`
                        : ''
                    "
                    no-data-text="Aucun joueur n'a de grelottine ou un score suffisant"
                    persistent-hint
                    clearable
                    outlined
                    @change="setAmountToMax"
                  ></v-select>
                </v-col>
              </v-row>

              <v-row>
                <v-col md="6" cols="12">
                  <v-select
                    label="Défi"
                    :items="grelottineChallengeBets"
                    v-model="form.grelottinBet"
                    :rules="selectChallengeRules"
                    :hint="
                      form.grelottinBet
                        ? `Montant maximum possible: ${maxGrelottinePossibleAmount}`
                        : ''
                    "
                    persistent-hint
                    clearable
                    outlined
                    @change="setAmountToMax"
                  ></v-select>
                </v-col>
                <v-spacer></v-spacer>
                <v-col md="6" cols="12">
                  <v-text-field
                    label="Montant du défi"
                    type="number"
                    min="0"
                    step="1"
                    :rules="grelottineAmountRules"
                    v-model="form.gambledAmount"
                    clearable
                    outlined
                    rounded
                    append-outer-icon="mdi-upload-multiple"
                    @click:append-outer="setAmountToMax"
                  >
                  </v-text-field>
                </v-col>
                <v-spacer></v-spacer>
              </v-row>
            </v-card>
          </v-col>

          <v-col md="6" cols="12">
            <v-card class="pa-4" outlined>
              <v-card-title>
                <span>
                  Combinaison réalisée par le joueur défié
                  <span
                    v-if="form.challengedPlayer"
                    class="challenged-player-hint"
                  >
                    ({{ form.challengedPlayer }})
                  </span>
                </span>
              </v-card-title>
              <DiceRollInput v-model="diceForm"></DiceRollInput>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mx-md-12 mx-6" justify="end">
          <v-col cols="6" md="2">
            <v-btn :disabled="!isValidateButtonEnabled" @click="confirm"
              >Valider
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BevueMenuAction from "@/components/BevueMenuAction.vue";
import { GrelottineForm, ValidGrelottineForm } from "@/domain/grelottine";
import { mapGetters, mapState } from "vuex";
import {
  inputPositiveIntegerRules,
  inputRuleFunction,
  inputStrictlyPositiveIntegerRules,
  selectChallengeRules,
  selectNameRules,
} from "@/form-validation/form-validation-rules";
import { Player } from "@/domain/player";
import DiceRollInput from "@/components/dice/DiceRollInput.vue";
import { SelectItemsType, VForm } from "@/vuetify.interface";
import { DiceRoll } from "../../../../../domain/rules/dice-rule";
import {
  getMaxGrelottinePossibleAmount,
  GrelottineBet,
  GrelottineResolution,
} from "../../../../../domain/rules/basic-rules/grelottine-rule";
import { RulesState } from "@/store/current-game/difficulty-levels/rules.store";
import {
  DiceForm,
  getInitialDiceForm,
  isDiceFormValid,
} from "@/components/dice/dice-form";

const INITIAL_FORM: GrelottineForm = {
  gambledAmount: 0,
};

@Component({
  components: { DiceRollInput, BevueMenuAction },
  computed: {
    ...mapState("currentGame", ["players", "turnNumber"]),
    ...mapState("currentGame/dialogs", ["grelottineResolverDialog"]),
    ...mapGetters("currentGame/rules", ["rules"]),
    ...mapGetters("currentGame", [
      "currentPlayer",
      "getPlayerScore",
      "getPlayerScore",
      "playerNames",
    ]),
  },
})
export default class GrelottineResolverDialog extends Vue {
  readonly selectChallengeRules = selectChallengeRules;
  readonly inputPositiveIntegerRules = inputPositiveIntegerRules;

  readonly players!: Array<Player>;
  readonly rules!: RulesState;
  readonly getPlayerScore!: (name: string) => number;
  readonly grelottineResolverDialog!: { isVisible: boolean };

  diceForm: DiceForm = getInitialDiceForm();
  form: GrelottineForm = { ...INITIAL_FORM };
  isFormValid = true;

  get grelottinePlayerNames(): Array<string> {
    return this.players
      .filter(
        (player) => player.hasGrelottine && this.getPlayerScore(player.name) > 0
      )
      .map((player) => player.name);
  }

  get selectPlayerRules(): ReadonlyArray<inputRuleFunction> {
    return [
      ...selectNameRules,
      (): true | string => {
        if (this.form.grelottinPlayer === this.form.challengedPlayer) {
          return "Le grelottin ne peut pas être le joueur défié.";
        }
        return true;
      },
    ];
  }

  get grelottineChallengeBets(): Array<SelectItemsType<GrelottineBet>> {
    return Object.values(GrelottineBet).map((bet: GrelottineBet) => {
      const disabled =
        bet === GrelottineBet.SIROP_GRELOT &&
        !this.rules.levelOne.isSiropEnabled;

      return {
        text: bet,
        value: bet,
        disabled,
      };
    });
  }

  get isDiceFormValid(): boolean {
    return isDiceFormValid(this.diceForm);
  }

  get isValidateButtonEnabled(): boolean {
    return this.isFormValid && this.isDiceFormValid;
  }

  get grelottineAmountRules(): ReadonlyArray<inputRuleFunction> {
    const rules: Array<inputRuleFunction> = [
      ...inputStrictlyPositiveIntegerRules,
    ];

    const maxAmount = this.maxGrelottinePossibleAmount;
    const maxScoreRule = (n?: string): true | string => {
      if (Number(n) > Number(maxAmount)) {
        return `Le score ne peut pas supérieur à ${maxAmount}.`;
      }
      return true;
    };

    rules.push(maxScoreRule);

    return rules;
  }

  get maxGrelottinePossibleAmount(): number | undefined {
    if (this.lowestScore) {
      if (!this.form.grelottinBet) {
        return 0;
      }
      return getMaxGrelottinePossibleAmount(
        this.lowestScore,
        this.form.grelottinBet
      );
    }

    return undefined;
  }

  setAmountToMax(): void {
    if (this.maxGrelottinePossibleAmount) {
      this.form.gambledAmount = this.maxGrelottinePossibleAmount;
    }
  }

  confirm(): void {
    if (!this.isFormComplete(this.form) || !isDiceFormValid(this.diceForm)) {
      return;
    }

    const diceRoll: DiceRoll = [...this.diceForm];

    const resolution: GrelottineResolution = {
      gambledAmount: this.form.gambledAmount,
      grelottinBet: this.form.grelottinBet,
      challengedPlayer: this.form.challengedPlayer,
      grelottinPlayer: this.form.grelottinPlayer,
      diceRoll,
    };

    this.diceForm = getInitialDiceForm();
    (this.$refs.formRef as VForm).reset();

    this.$store.dispatch("currentGame/play/resolveGrelottine", resolution);
  }

  cancel(): void {
    this.form = { ...INITIAL_FORM };
    this.$store.dispatch("currentGame/play/cancelGrelottine");
    (this.$refs.formRef as VForm).reset();
  }

  private isFormComplete(form: GrelottineForm): form is ValidGrelottineForm {
    return this.isFormValid;
  }

  private get lowestScore(): number | undefined {
    if (this.form.grelottinPlayer && this.form.challengedPlayer) {
      const grelottinScore = this.getPlayerScore(this.form.grelottinPlayer);
      const challengedPlayerScore = this.getPlayerScore(
        this.form.challengedPlayer
      );

      return Math.min(grelottinScore, challengedPlayerScore);
    }

    return undefined;
  }
}
</script>

<style scoped>
.challenged-player-hint {
  color: #2962ff;
}
</style>
