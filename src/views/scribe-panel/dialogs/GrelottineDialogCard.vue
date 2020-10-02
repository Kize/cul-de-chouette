<template>
  <v-card>
    <v-form ref="formRef" v-model="isFormValid">
      <v-toolbar color="yellow accent-4">
        <v-btn icon @click="cancel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Défi de grelottine</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-container class="mt-n3 mr-16">
            <BevueMenuAction></BevueMenuAction>
          </v-container>
        </v-toolbar-items>
      </v-toolbar>

      <v-container>
        <v-card class="pt-2 px-4 pb-4 mb-8" outlined>
          <v-card-title>Conditions du défi</v-card-title>

          <v-row>
            <v-col cols="6">
              <v-select
                label="Grelottin"
                :items="getGrelottinePlayerNames()"
                v-model="form.grelottin"
                :rules="getSelectPlayerRules()"
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
            <v-col cols="6">
              <v-select
                label="Joueur défié"
                :items="getGrelottinePlayerNames()"
                v-model="form.challengedPlayer"
                :rules="getSelectPlayerRules()"
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
            <v-col cols="6">
              <v-select
                label="Défi"
                :items="challenges"
                v-model="form.challenge"
                :rules="selectChallengeRules"
                :hint="
                  form.challenge
                    ? `Montant maximum possible: ${getMaxGrelottinePossibleAmount()}`
                    : ''
                "
                persistent-hint
                clearable
                outlined
                @change="setAmountToMax"
              ></v-select>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="2">
              <v-text-field
                label="Montant du défi"
                type="number"
                min="0"
                step="1"
                :rules="getGrelottineAmountRules()"
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

        <v-card class="pt-2 px-4 pb-4 mb-8" outlined>
          <v-card-title>
            Combinaison du joueur défié réalisée
            {{ isFormValid ? "" : " - (Renseigne les conditions du défi)" }}
          </v-card-title>
          <PlayATurnActions
            :current-player-name="form.challengedPlayer"
            :players="players"
            :player-names="playerNames"
            :disabled="!isFormValid"
            :is-soufflette-enabled="isSouffletteEnabled"
            @basic-play="setChallengedPlayerAction"
            @play-chouette-velute="setChallengedPlayerAction"
            @play-suite="setChallengedPlayerAction"
          ></PlayATurnActions>
        </v-card>
      </v-container>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Vue } from "vue-property-decorator";
import BevueMenuAction from "@/components/BevueMenuAction.vue";
import {
  getMaxGrelottinePossibleAmount,
  GrelottineActionPayload,
  GrelottineChallenges,
  GrelottineForm
} from "@/domain/grelottine";
import { mapGetters, mapState } from "vuex";
import {
  inputPositiveIntegerRules,
  inputStrictlyPositiveIntegerRules,
  selectChallengeRules,
  selectNameRules
} from "@/domain/form-validation-rules";
import PlayATurnActions from "@/components/play-a-turn-actions/PlayATurnActions.vue";
import { HistoryLineAction } from "@/domain/history";
import { Player } from "@/domain/player";

const INITIAL_FORM: GrelottineForm = {
  gambledAmount: 0
};

@Component({
  components: { PlayATurnActions, BevueMenuAction },
  computed: {
    ...mapState("currentGame", ["players", "turnNumber"]),
    ...mapState("currentGame/levelOne", ["isSouffletteEnabled"]),
    ...mapGetters("currentGame", [
      "currentPlayer",
      "getPlayerScore",
      "getPlayerScore",
      "playerNames"
    ])
  }
})
export default class GrelottineDialogCard extends Vue {
  readonly challenges = Object.values(GrelottineChallenges);
  readonly selectChallengeRules = selectChallengeRules;
  readonly inputPositiveIntegerRules = inputPositiveIntegerRules;

  readonly getPlayerScore!: (name: string) => number;
  players!: Array<Player>;

  form: GrelottineForm = { ...INITIAL_FORM };
  isFormValid = true;

  getGrelottinePlayerNames(): Array<string> {
    return this.players
      .filter(
        player => player.hasGrelottine && this.getPlayerScore(player.name) > 0
      )
      .map(player => player.name);
  }

  getSelectPlayerRules() {
    return [
      ...selectNameRules,
      (): boolean | string => {
        if (this.form.grelottin === this.form.challengedPlayer) {
          return "Le grelottin ne peut pas être le joueur défié.";
        }
        return true;
      }
    ];
  }

  getGrelottineAmountRules() {
    const rules: Array<(n: number) => boolean | string> = [
      ...inputStrictlyPositiveIntegerRules
    ];

    const maxAmount = this.getMaxGrelottinePossibleAmount();
    const maxScoreRule = (number: number): boolean | string => {
      if (number > maxAmount) {
        return `Le score ne peut pas supérieur à ${maxAmount}.`;
      }
      return true;
    };

    rules.push(maxScoreRule);

    return rules;
  }

  getMaxGrelottinePossibleAmount(): number {
    const lowestScore = this.getLowestScore();
    return getMaxGrelottinePossibleAmount(lowestScore, this.form.challenge);
  }

  setAmountToMax(): void {
    this.form.gambledAmount = this.getMaxGrelottinePossibleAmount();
  }

  setChallengedPlayerAction(action: HistoryLineAction): void {
    this.form.challengedPlayerAction = action;

    this.confirm();
  }

  cancel(): void {
    this.form = { ...INITIAL_FORM };
    this.close();
  }

  private confirm(): void {
    const grelottineActionPayload: GrelottineActionPayload = {
      ...(this.form as GrelottineActionPayload)
    };
    this.$store.dispatch(
      "currentGame/grelottineChallenge",
      grelottineActionPayload
    );

    this.form = { ...INITIAL_FORM };
    this.close();
  }

  @Emit()
  private close(): void {
    (this.$refs.formRef as VForm).reset();
  }

  private getLowestScore(): number {
    if (this.form.grelottin && this.form.challengedPlayer) {
      const grelottinScore: number = this.getPlayerScore(this.form.grelottin);
      const challengedPlayerScore: number = this.getPlayerScore(
        this.form.challengedPlayer
      );

      return Math.min(grelottinScore, challengedPlayerScore);
    }

    return 0;
  }
}
</script>

<style scoped></style>
