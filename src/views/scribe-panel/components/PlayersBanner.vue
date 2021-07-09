<template>
  <v-row>
    <v-col
      lg="3"
      md="4"
      sm="12"
      cols="12"
      v-for="player in players"
      :key="player.name"
    >
      <v-card
        class="pa-1"
        height="100%"
        :color="
          isCurrentPlayer(player.name)
            ? 'light-blue lighten-4'
            : 'light-blue lighten-5'
        "
      >
        <v-card-title class="mb-6">
          <v-row no-gutters>
            <v-col cols="auto" class="mr-auto">
              <h2>
                {{ player.name }} | {{ getPlayerScore(player.name) }} points
              </h2>
            </v-col>

            <v-col cols="auto">
              <v-btn
                color="red accent-4"
                dark
                rounded
                @click="applyBevue(player)"
              >
                <v-icon class="mr-1" small>mdi-alert-circle-outline</v-icon>
                Bévue
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>
          <v-row justify="space-between" class="mb-1 mx-1">
            <v-chip
              v-if="hasGrelottine(player.name)"
              color="red"
              outlined
              :disabled="!hasGrelottine(player.name)"
            >
              <v-icon class="mr-1" small>mdi-bell-outline</v-icon>
              Grelottine
            </v-chip>

            <v-chip
              v-if="hasCivet(player.name)"
              color="teal darken-4"
              outlined
              :disabled="!hasCivet(player.name)"
            >
              <v-icon class="mr-1" small>mdi-rabbit</v-icon>
              Civet
            </v-chip>

            <v-chip
              v-if="hasJarret(player.name)"
              color="brown darken-4"
              outlined
              :disabled="!hasJarret(player.name)"
            >
              <v-icon class="mr-1" small>mdi-arm-flex-outline</v-icon>
              Lance-bûches
            </v-chip>
          </v-row>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Player } from "../../../../domain/player";
import { mapGetters, mapState } from "vuex";

@Component({
  computed: {
    ...mapState("currentGame/rules", ["isBleuRougeEnabled"]),
    ...mapGetters("currentGame", [
      "isCurrentPlayer",
      "getPlayerScore",
      "hasGrelottine",
      "hasCivet",
      "hasJarret",
    ]),
  },
})
export default class PlayersBanner extends Vue {
  @Prop() players!: Array<Player>;
  readonly isBleuRougeEnabled!: boolean;

  applyBevue(player: Player): void {
    this.$store.dispatch("currentGame/play/applyBevue", player.name);
  }
}
</script>

<style scoped lang="scss"></style>
