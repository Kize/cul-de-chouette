<template>
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
                  v-model="form.grelottin"
                  :rules="selectPlayerRules"
                  :hint="
                    form.grelottin
                      ? `Score: ${getPlayerScore(form.grelottin)}`
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
                  :items="challenges"
                  v-model="form.challenge"
                  :rules="selectChallengeRules"
                  :hint="
                    form.challenge
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
        <v-col cols="12" md="6">
          <v-card class="pa-4" outlined>
            <v-card-title>
              Combinaison du joueur défié réalisée
              {{ isFormValid ? "" : " - (Renseigne les conditions du défi)" }}
            </v-card-title>
            <PlayATurnWithDice @confirm="playGrelottine"></PlayATurnWithDice>
          </v-card>
        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Vue } from "vue-property-decorator";
import BevueMenuAction from "@/components/BevueMenuAction.vue";
import {
  getMaxGrelottinePossibleAmount,
  GrelottineChallenges,
  GrelottineForm,
} from "@/domain/grelottine";
import { mapGetters, mapState } from "vuex";
import {
  inputPositiveIntegerRules,
  inputRuleFunction,
  inputStrictlyPositiveIntegerRules,
  selectChallengeRules,
  selectNameRules,
} from "@/form-validation/form-validation-rules";
import { Player } from "@/domain/player";
import PlayATurnWithDice from "@/components/play-a-turn-actions/PlayATurnWithDice.vue";
import { VForm } from "@/vuetify.interface";
import { DiceRoll } from "../../../../domain/rules/dice-rule";

const INITIAL_FORM: GrelottineForm = {
  gambledAmount: 0,
};

@Component({
  components: { PlayATurnWithDice, BevueMenuAction },
  computed: {
    ...mapState("currentGame", ["players", "turnNumber"]),
    ...mapGetters("currentGame/rules", ["getRules"]),
    ...mapGetters("currentGame", [
      "currentPlayer",
      "getPlayerScore",
      "getPlayerScore",
      "playerNames",
    ]),
  },
})
export default class GrelottineDialogCard extends Vue {
  readonly challenges = Object.values(GrelottineChallenges);
  readonly selectChallengeRules = selectChallengeRules;
  readonly inputPositiveIntegerRules = inputPositiveIntegerRules;

  readonly getPlayerScore!: (name: string) => number;
  players!: Array<Player>;

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
        if (this.form.grelottin === this.form.challengedPlayer) {
          return "Le grelottin ne peut pas être le joueur défié.";
        }
        return true;
      },
    ];
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
      return getMaxGrelottinePossibleAmount(
        this.lowestScore,
        this.form.challenge
      );
    }

    return undefined;
  }

  setAmountToMax(): void {
    if (this.maxGrelottinePossibleAmount) {
      this.form.gambledAmount = this.maxGrelottinePossibleAmount;
    }
  }

  playGrelottine(diceRoll: DiceRoll): void {
    console.log(diceRoll);
  }

  cancel(): void {
    this.form = { ...INITIAL_FORM };
    this.close();
  }

  @Emit()
  private close(): void {
    (this.$refs.formRef as VForm).reset();
  }

  private get lowestScore(): number | undefined {
    if (this.form.grelottin && this.form.challengedPlayer) {
      const grelottinScore: number = this.getPlayerScore(this.form.grelottin);
      const challengedPlayerScore: number = this.getPlayerScore(
        this.form.challengedPlayer
      );

      return Math.min(grelottinScore, challengedPlayerScore);
    }

    return undefined;
  }
}
</script>

<style scoped></style>
