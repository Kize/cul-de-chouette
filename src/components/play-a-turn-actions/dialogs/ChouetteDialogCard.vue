<template>
  <v-card>
    <v-card-title>
      <span>
        {{ currentPlayerName }} a réalisé une chouette de {{ chouetteValue }}
      </span>

      <v-spacer></v-spacer>
      <BevueMenuAction></BevueMenuAction>
      <v-btn color="grey darken-2" text @click="cancel">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-card-title>

    <v-card-text>
      <v-form ref="formRef" v-model="isFormValid">
        <v-card class="mb-4" outlined>
          <v-card-title class="py-2">Actions:</v-card-title>
          <v-card-text class="pb-0">
            <v-row dense>
              <v-col md="3" cols="12">
                <v-btn large @click="noChallenge">Aucun sirotage</v-btn>
              </v-col>
              <v-col md="8" cols="12">
                <v-select
                  label="Joueur ayant fait un attrape-oiseau"
                  v-model="form.attrapeOiseauPlayerName"
                  clearable
                  outlined
                  :items="getFilteredPlayerNames()"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-4" outlined>
          <v-card-title class="py-2">Annonces:</v-card-title>
          <v-card-text class="pb-0">
            <v-row dense>
              <v-col v-for="bid in form.bids" :key="bid.playerName">
                <v-select
                  :label="bid.playerName"
                  v-model="bid.designation"
                  :rules="selectNameRules"
                  clearable
                  outlined
                  rounded
                  :items="getFilteredBidTypes()"
                ></v-select>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-4" outlined>
          <v-card-title class="py-2">Résultat du dé siroté:</v-card-title>
          <v-card-text>
            <v-row justify="center" dense>
              <DieCard v-model="form.siropDieValue" is-horizontal></DieCard>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="mb-4" outlined>
          <v-card-title class="py-2">Validation des annonces:</v-card-title>
          <v-card-text class="pb-0">
            <v-row dense>
              <v-col v-for="bid in form.bids" :key="bid.playerName">
                <v-checkbox
                  :label="bid.playerName + ' a crié \'Sirop Gagnant\' !'"
                  v-model="bid.isBidValidated"
                  :disabled="!canPlayerValidateBid(bid.designation)"
                  color="success"
                >
                </v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey darken-2" text @click="cancel"> Annuler</v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="validateSirop"
            :disabled="!isFormValid || !form.siropDieValue"
          >
            {{
              form.attrapeOiseauPlayerName
                ? "Valider l'Attrape-Oiseau"
                : "Valider le Sirop"
            }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import MainDialogCard from "@/components/MainDialogCard.vue";
import { selectNameRules } from "@/domain/form-validation-rules";
import { RulesState } from "@/store/current-game/difficulty-levels/rules.store";
import BevueMenuAction from "@/components/BevueMenuAction.vue";
import {
  BidType,
  isBidValid,
  SiropActionPayload,
  SiropForm,
} from "@/domain/level-one/sirop";
import DieCard from "@/components/play-a-turn-actions/DieCard.vue";
import { SelectItemsType, VForm } from "@/vuetify.interface";
import { DieValue } from "@/domain/dice/compute-dice-value";
import { HistoryLineType } from "@/domain/history";

function getInitialForm(playerNames: Array<string> = []): SiropForm {
  return {
    siropDieValue: 0,
    bids: playerNames.map((name) => ({
      playerName: name,
      designation: undefined!,
      isBidValidated: false,
    })),
  };
}

@Component({
  components: {
    DieCard,
    BevueMenuAction,
    PlayATurnWithDice: () =>
      import("@/components/play-a-turn-actions/PlayATurnWithDice.vue"),
    MainDialogCard,
  },
})
export default class SouffletteDialogCard extends Vue {
  @Prop() currentPlayerName!: string;
  @Prop() playerNames!: Array<string>;
  @Prop() rules!: RulesState;
  @Prop() chouetteValue!: DieValue;
  @Prop() turnNumber?: number;

  form: SiropForm = getInitialForm(this.playerNames);
  isFormValid = false;

  readonly selectNameRules = selectNameRules;

  getFilteredPlayerNames(): Array<string> {
    return this.playerNames.filter((name) => name !== this.currentPlayerName);
  }

  getFilteredBidTypes(): Array<SelectItemsType> {
    const items: Array<SelectItemsType> = Object.values(BidType).map(
      (type: BidType) => {
        let disabled;
        switch (type) {
          case BidType.COUCHE_SIROP:
            disabled = !!this.form.attrapeOiseauPlayerName;
            break;
          case BidType.FILE_SIROP:
            disabled = !this.form.attrapeOiseauPlayerName;
            break;
          case BidType.BEAU_SIROP:
            disabled = false;
            break;
          default:
            disabled = isBidValid(this.chouetteValue, type, this.chouetteValue);
        }

        return {
          text: type,
          value: type,
          disabled,
        };
      }
    );

    items.splice(3, 0, { divider: true });

    return items;
  }

  noChallenge(): void {
    const payload: SiropActionPayload = {
      initialChouette: {
        designation: HistoryLineType.CHOUETTE,
        playerName: this.currentPlayerName,
        value: this.chouetteValue,
        turnNumber: this.turnNumber,
      },
      ...this.form,
      isChouetteNotSirote: true,
    };
    this.confirm(payload);
  }

  validateSirop(): void {
    const payload: SiropActionPayload = {
      initialChouette: {
        designation: HistoryLineType.CHOUETTE,
        playerName: this.currentPlayerName,
        value: this.chouetteValue,
        turnNumber: this.turnNumber,
      },
      ...this.form,
      isChouetteNotSirote: false,
    };
    this.confirm(payload);
  }

  canPlayerValidateBid(type: BidType): boolean {
    if (!this.form.siropDieValue) {
      return false;
    }

    return isBidValid(this.chouetteValue, type, this.form.siropDieValue);
  }

  @Emit()
  cancel(): void {
    this.form = getInitialForm(this.playerNames);
    (this.$refs.formRef as VForm).resetValidation();
  }

  @Emit()
  confirm(actionPayload: SiropActionPayload): SiropActionPayload {
    this.form = getInitialForm(this.playerNames);
    (this.$refs.formRef as VForm).resetValidation();

    return actionPayload;
  }
}
</script>

<style scoped lang="scss"></style>
