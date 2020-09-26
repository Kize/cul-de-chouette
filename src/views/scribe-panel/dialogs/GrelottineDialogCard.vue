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
        <v-row>
          <v-col cols="6">
            <v-select
              label="Grelottin"
              :items="grelottinePlayers"
              v-model="form.grelottin"
              :rules="getSelectPlayerRules()"
              :hint="
                form.grelottin ? `Score: ${getPlayerScore(form.grelottin)}` : ''
              "
              persistent-hint
              clearable
              outlined
              @change="setAmountToMax"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select
              label="Joueur défié"
              :items="grelottinePlayers"
              v-model="form.challengedPlayer"
              :rules="getSelectPlayerRules()"
              :hint="
                form.challengedPlayer
                  ? `Score: ${getPlayerScore(form.challengedPlayer)}`
                  : ''
              "
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
              v-model="form.amount"
              clearable
              outlined
              rounded
              append-outer-icon="mdi-upload-multiple"
              @click:append-outer="setAmountToMax"
            >
            </v-text-field>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="2">
            <v-text-field
              label="Résultat du joueur défié"
              type="number"
              min="0"
              step="1"
              v-model="form.challengedPlayerScore"
              :rules="inputPositiveIntegerRules"
              outlined
              rounded
            >
            </v-text-field>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-checkbox
            label="Défi réussi"
            class="big-checkbox"
            v-model="form.isChallengePassed"
            :ripple="false"
          ></v-checkbox>
        </v-row>

        <v-row justify="end">
          <v-btn color="success" @click="confirm" :disabled="!isFormValid">
            Valider la grelottine
          </v-btn>
        </v-row>
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
import { mapGetters } from "vuex";
import {
  inputPositiveIntegerRules,
  inputStrictlyPositiveIntegerRules,
  selectChallengeRules,
  selectNameRules
} from "@/domain/form-validation-rules";

const INITIAL_FORM: GrelottineForm = {
  amount: 0,
  challengedPlayerScore: 0,
  isChallengePassed: false
};

@Component({
  components: { BevueMenuAction },
  computed: {
    ...mapGetters("currentGame", ["grelottinePlayers", "getPlayerScore"])
  }
})
export default class GrelottineDialogCard extends Vue {
  readonly challenges = Object.values(GrelottineChallenges);
  readonly selectChallengeRules = selectChallengeRules;
  readonly inputPositiveIntegerRules = inputPositiveIntegerRules;

  readonly getPlayerScore!: (name: string) => number;

  form: GrelottineForm = { ...INITIAL_FORM };
  isFormValid = true;

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
    this.form.amount = this.getMaxGrelottinePossibleAmount();
  }

  cancel(): void {
    this.form = { ...INITIAL_FORM };
    this.close();
  }

  confirm(): void {
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
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  close(): void {}

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

<style scoped>
.big-checkbox >>> label {
  font-size: 2rem;
  margin-left: 1rem;
}

.big-checkbox >>> i {
  font-size: 3rem;
}
</style>
