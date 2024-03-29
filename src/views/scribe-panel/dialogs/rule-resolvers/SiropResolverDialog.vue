<template>
  <v-dialog
    :value="siropResolverDialog.isVisible"
    persistent
    fullscreen
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-card-title class="px-12">
        <h2>
          <v-icon class="sirop-title-icon" color="success">
            mdi-bottle-soda-classic-outline
          </v-icon>
          <span class="sirop-title">Sirotage</span>
          - {{ siropResolverDialog.playerName }} a réalisé une chouette de
          {{ siropResolverDialog.chouetteValue }}
        </h2>

        <v-spacer></v-spacer>
        <v-btn large color="primary px-6 mr-6" @click="confirmNotSirote">
          Aucun sirotage
        </v-btn>
        <BevueMenuAction></BevueMenuAction>
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" v-model="isFormValid">
          <v-row justify="center">
            <v-col md="6" cols="18">
              <v-select
                class="attrape-oiseau-select"
                v-if="isAttrapeOiseauEnabled"
                label="Joueur ayant fait un attrape-oiseau"
                v-model="form.playerWhoMakeAttrapeOiseau"
                :items="otherPlayerNames"
                prepend-icon="mdi-hand-okay"
                clearable
                outlined
              ></v-select>

              <p v-else>L'attrape-oiseau n'est pas activé pour cette partie</p>
            </v-col>
          </v-row>

          <v-card class="mb-4" outlined>
            <v-card-title class="pt-1 pb-0">Annonces:</v-card-title>
            <v-card-text class="pb-0">
              <v-row dense>
                <v-col v-for="playerName in playerNames" :key="playerName">
                  <v-radio-group
                    class="py-0 my-0"
                    :label="playerName"
                    :rules="rulesOfSelectNameInput"
                    prepend-icon="mdi-account-outline"
                    @change="registerPlayerBet(playerName, $event)"
                  >
                    <v-radio
                      class="bid-option mb-3"
                      v-for="playableBidType in playableBidTypes"
                      :key="playableBidType.text"
                      :label="playableBidType.text"
                      :value="playableBidType.text"
                      :disabled="playableBidType.disabled"
                      off-icon="mdi-bird"
                      on-icon="mdi-owl"
                      active-class="selected-bet"
                    ></v-radio>
                  </v-radio-group>
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
                    v-if="canPlayerValidateBid(bid.playerBid)"
                    :label="bid.playerName + ' a crié \'Sirop Gagnant\' !'"
                    v-model="bid.isBidValidated"
                    color="success"
                  >
                  </v-checkbox>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <v-card-actions class="pr-6">
            <v-spacer></v-spacer>
            <v-btn x-large class="px-6 mr-3" @click="cancel"> Annuler</v-btn>
            <v-btn x-large color="primary px-6 mr-3" @click="confirmNotSirote">
              Aucun sirotage
            </v-btn>
            <v-btn
              x-large
              class="px-6"
              color="success"
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
import BevueMenuAction from "@/components/BevueMenuAction.vue";
import { SiropForm } from "@/domain/level-1/sirop";
import DieCard from "@/components/dice/DieCard.vue";
import { SelectItemsType, SelectItemValue, VForm } from "@/vuetify.interface";
import { isPlayerBidClaimable } from "../../../../../domain/rules/level-1/sirotage-rule";
import { rulesOfSelectNameInput } from "@/form-validation/form-validation-rules";
import { mapGetters, mapState } from "vuex";
import { DialogsState } from "@/store/current-game/dialogs.store";
import { AttrapeOiseauResolution } from "../../../../../domain/rules/level-1/attrape-oiseau-rule";
import {
  BidType,
  PlayableBid,
} from "../../../../../domain/rules/level-1/sirotage-rule.types";

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
    MainDialogCard,
  },
  computed: {
    ...mapState("currentGame/dialogs", ["siropResolverDialog"]),
    ...mapState("currentGame/rules", ["isAttrapeOiseauEnabled"]),
    ...mapGetters("currentGame", ["playerNames", "turnNumber"]),
  },
})
export default class SiropResolverDialog extends Vue {
  readonly rulesOfSelectNameInput = rulesOfSelectNameInput;

  readonly playerNames!: Array<string>;
  readonly turnNumber?: number;
  readonly isAttrapeOiseauEnabled!: boolean;
  readonly siropResolverDialog!: DialogsState["siropResolverDialog"];

  form: SiropForm = getInitialForm();
  isFormValid = false;

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

  get otherPlayerNames(): Array<string> {
    return this.playerNames.filter(
      (name) => name !== this.siropResolverDialog.playerName
    );
  }

  get playableBidTypes(): Array<SelectItemsType<BidType>> {
    const items: Array<SelectItemsType<BidType>> =
      this.siropResolverDialog.playableBids.map((playableBid: PlayableBid) => {
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
      });

    return items;
  }

  canPlayerValidateBid(playerBidType: BidType): boolean {
    if (!this.form.lastDieValue) {
      return false;
    }

    if (!this.siropResolverDialog.chouetteValue) {
      throw new Error("The chouette value is mandatory");
    }

    return isPlayerBidClaimable(
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
    this.$store.dispatch("currentGame/play/resolveSirop", {
      isSirote: false,
    });
    this.resetForm();
  }

  confirmSirote(): void {
    const { lastDieValue, bids, playerWhoMakeAttrapeOiseau } = this.form;
    if (lastDieValue !== 0) {
      const resolution: AttrapeOiseauResolution = {
        isSirote: true,
        lastDieValue,
        playerWhoMakeAttrapeOiseau,
        bids: bids.map((bid) => ({ ...bid })),
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
  font-size: 2.2rem;
}

.sirop-title-icon {
  font-size: 3.5rem;
  transform: rotate(45deg);
  margin-top: -1rem;
}

.bet-validation-card,
.sirop-actions-card {
  min-height: 130px;
}

::v-deep.selected-bet label {
  color: #1976d2;
}

::v-deep.bid-option label {
  font-size: 1.5rem;
}

::v-deep.bid-option i {
  font-size: 1.75rem;
}

::v-deep.attrape-oiseau-select i.mdi-hand-okay {
  font-size: 2.5rem;
  margin-top: -0.5rem;
  margin-right: 0.5rem;
}
</style>
