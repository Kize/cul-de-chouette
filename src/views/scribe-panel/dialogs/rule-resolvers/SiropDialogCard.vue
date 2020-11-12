<template>
  <v-dialog :value="siropResolverDialog.isVisible" persistent max-width="75%">
    <v-card>
      <v-card-title class="px-12">
        <span>
          <b class="sirop-title">Sirotage</b> <br />
          {{ currentPlayerName }} a réalisé une chouette de
          {{ siropResolverDialog.chouetteValue }}
        </span>

        <v-spacer></v-spacer>
        <BevueMenuAction></BevueMenuAction>
        <v-btn color="grey darken-2" text @click="cancel">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="isFormValid">
          <v-card class="sirop-actions-card mb-4" outlined>
            <v-card-title class="py-2">Actions:</v-card-title>
            <v-card-text class="pb-0">
              <v-row dense>
                <v-col md="3" cols="12">
                  <v-btn large @click="confirmNotSirote">Aucun sirotage</v-btn>
                </v-col>
                <v-col md="8" cols="12">
                  <v-select
                    v-if="getRules.levelOne.isAttrapeOiseauEnabled"
                    label="Joueur ayant fait un attrape-oiseau"
                    v-model="form.playerWhoMakeAttrapeOiseau"
                    clearable
                    outlined
                    :items="getFilteredPlayerNames()"
                  ></v-select>

                  <p v-else>
                    L'attrape-oiseau n'est pas activé pour cette partie
                  </p>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card class="mb-4" outlined>
            <v-card-title class="py-2">Annonces:</v-card-title>
            <v-card-text class="pb-0">
              <v-row dense>
                <v-col v-for="playerName in playerNames" :key="playerName">
                  <v-select
                    :label="playerName"
                    :rules="selectNameRules"
                    clearable
                    outlined
                    rounded
                    :items="playableBidTypes"
                    @change="registerPlayerBet(playerName, $event)"
                  ></v-select>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card class="mb-4" outlined>
            <v-card-title class="py-2">Résultat du dé siroté:</v-card-title>
            <v-card-text>
              <v-row justify="center" dense>
                <DieCard v-model="form.lastDieValue" is-horizontal></DieCard>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card class="bet-validation-card mb-4" outlined>
            <v-card-title class="py-2">Validation des annonces:</v-card-title>
            <v-card-text class="pb-0">
              <v-row dense>
                <v-col v-for="bid in form.bids" :key="bid.playerName">
                  <v-checkbox
                    :label="bid.playerName + ' a crié \'Sirop Gagnant\' !'"
                    v-model="bid.isBidValidated"
                    :disabled="!canPlayerValidateBid(bid.playerBid)"
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
              @click="confirmSirote"
              :disabled="!isValidButtonActive"
            >
              {{
                form.playerWhoMakeAttrapeOiseau
                  ? "Valider l'Attrape-Oiseau"
                  : "Valider le Sirop"
              }}
            </v-btn>
          </v-card-actions>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MainDialogCard from "@/components/MainDialogCard.vue";
import { RulesState } from "@/store/current-game/difficulty-levels/rules.store";
import BevueMenuAction from "@/components/BevueMenuAction.vue";
import { isBidValid, SiropForm } from "@/domain/level-one/sirop";
import DieCard from "@/components/play-a-turn-actions/DieCard.vue";
import { SelectItemsType, SelectItemValue, VForm } from "@/vuetify.interface";
import {
  BidType,
  PlayableBid,
} from "../../../../../domain/rules/level-one/sirotage-rule";
import { selectNameRules } from "@/form-validation/form-validation-rules";
import { mapGetters, mapState } from "vuex";
import { DialogsState } from "@/store/current-game/dialogs.store";
import { AttrapeOiseauResolution } from "../../../../../domain/rules/level-one/attrape-oiseau-rule";

function getInitialForm(): SiropForm {
  return {
    lastDieValue: 0,
    bids: [],
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
  computed: {
    ...mapState("currentGame", ["currentPlayerName", "turnNumber"]),
    ...mapState("currentGame/dialogs", ["siropResolverDialog"]),
    ...mapGetters("currentGame/rules", ["getRules"]),
    ...mapGetters("currentGame", ["playerNames"]),
  },
})
export default class SiropDialog extends Vue {
  currentPlayerName!: string;
  playerNames!: Array<string>;
  turnNumber?: number;
  rules!: RulesState;
  siropResolverDialog!: DialogsState["siropResolverDialog"];

  form: SiropForm = getInitialForm();
  isFormValid = false;

  readonly selectNameRules = selectNameRules;

  get isValidButtonActive(): boolean {
    const areAllPlayerSelectedBidsEnabled = this.form.bids.every((bid) =>
      this.playableBidTypes.some((selectItem) => {
        const playableBidType = selectItem as SelectItemValue<BidType>;
        return (
          playableBidType.value === bid.playerBid && !playableBidType.disabled
        );
      })
    );
    return (
      this.isFormValid &&
      this.form.lastDieValue !== 0 &&
      areAllPlayerSelectedBidsEnabled
    );
  }

  getFilteredPlayerNames(): Array<string> {
    return this.playerNames.filter((name) => name !== this.currentPlayerName);
  }

  get playableBidTypes(): Array<SelectItemsType<BidType>> {
    const items: Array<SelectItemsType<
      BidType
    >> = this.siropResolverDialog.playableBids.map(
      (playableBid: PlayableBid) => {
        let disabled;
        switch (playableBid.type) {
          case BidType.COUCHE_SIROP:
            disabled = !!this.form.playerWhoMakeAttrapeOiseau;
            break;
          case BidType.FILE_SIROP:
            disabled = !this.form.playerWhoMakeAttrapeOiseau;
            break;
          default:
            disabled = !playableBid.isPlayable;
        }
        return {
          text: playableBid.type,
          value: playableBid.type,
          disabled,
        };
      }
    );

    items.splice(3, 0, { divider: true });

    return items;
  }

  canPlayerValidateBid(playerBidType: BidType): boolean {
    if (!this.form.lastDieValue) {
      return false;
    }

    if (!this.siropResolverDialog.chouetteValue) {
      throw new Error("The chouette value is mandatory");
    }

    return isBidValid(
      this.siropResolverDialog.chouetteValue,
      playerBidType,
      this.form.lastDieValue
    );
  }

  registerPlayerBet(playerName: string, playerBid: BidType): void {
    const existingPlayerInForm = this.form.bids.find(
      (bid) => bid.playerName === playerName
    );
    if (existingPlayerInForm) {
      existingPlayerInForm.playerBid = playerBid;
    } else {
      this.form.bids.push({
        playerName,
        playerBid,
        isBidValidated: false,
      });
    }
  }

  cancel(): void {
    this.resetForm();
    this.$store.dispatch("currentGame/play/cancelSirop");
  }

  confirmNotSirote(): void {
    this.resetForm();
    this.$store.dispatch("currentGame/play/resolveSirop", {
      isSirote: false,
    });
  }

  confirmSirote(): void {
    const { lastDieValue, bids, playerWhoMakeAttrapeOiseau } = this.form;
    if (lastDieValue !== 0) {
      const resolution: AttrapeOiseauResolution = {
        isSirote: true,
        lastDieValue,
        playerWhoMakeAttrapeOiseau,
        bids,
      };
      this.resetForm();
      this.$store.dispatch("currentGame/play/resolveSirop", resolution);
    }
  }

  private resetForm() {
    this.form = getInitialForm();
    (this.$refs.formRef as VForm).reset();
  }
}
</script>

<style scoped lang="scss">
.sirop-title {
  font-size: 2rem;
}

.bet-validation-card,
.sirop-actions-card {
  min-height: 130px;
}
</style>
