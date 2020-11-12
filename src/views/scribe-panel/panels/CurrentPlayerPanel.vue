<template>
  <v-card outlined elevation="4" color="indigo lighten-5">
    <v-card-title class="headline">
      <span>{{ currentPlayer.name }}</span>
      <v-divider vertical class="mx-6"></v-divider>
      <span>Score: {{ getPlayerScore(currentPlayer.name) }}</span>
      <v-divider vertical class="mx-6"></v-divider>
      <span>Tour: {{ turnNumber }}</span>

      <v-spacer></v-spacer>

      <v-chip small color="primary" v-if="currentPlayer.hasGrelottine"
        >Grelottine
      </v-chip>
    </v-card-title>

    <v-card-text>
      <PlayATurnWithDice @confirm="basicPlay"></PlayATurnWithDice>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Player } from "@/domain/player";
import MenuAction from "@/components/MenuAction.vue";
import { mapGetters, mapState } from "vuex";
import PlayATurnWithDice from "@/components/play-a-turn-actions/PlayATurnWithDice.vue";
import { DiceRoll } from "../../../../domain/rules/dice-rule";

@Component({
  components: {
    PlayATurnWithDice,
    MenuAction,
  },
  computed: {
    ...mapState("currentGame", ["players", "turnNumber"]),
    ...mapGetters("currentGame/rules", ["getRules"]),
    ...mapGetters("currentGame", [
      "isCurrentPlayer",
      "playerNames",
      "getPlayerScore",
    ]),
  },
})
export default class CurrentPlayerPanel extends Vue {
  @Prop() currentPlayer!: Player;

  basicPlay(diceRoll: DiceRoll): void {
    this.$store.dispatch("currentGame/play/playATurn", diceRoll);
  }
}
</script>

<style scoped lang="scss"></style>
