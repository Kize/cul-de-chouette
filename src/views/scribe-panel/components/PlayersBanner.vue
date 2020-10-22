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
        height="100%"
        :color="
          isCurrentPlayer(player.name)
            ? 'light-blue lighten-4'
            : 'light-blue lighten-5'
        "
      >
        <v-card-title>
          <v-row no-gutters>
            <v-col cols="6">
              <span>{{ player.name }}</span>
            </v-col>

            <v-col cols="6">
              <span>Score: {{ getPlayerScore(player.name) }}</span>
            </v-col>
          </v-row>
        </v-card-title>

        <v-row no-gutters>
          <v-col class="text-right mx-6">
            <v-btn
              color="red accent-4"
              dark
              rounded
              small
              @click="applyBevue(player)"
            >
              <v-icon class="mr-1" small>mdi-alert-circle-outline</v-icon>
              Bévue
            </v-btn>
          </v-col>
        </v-row>

        <v-card-text>
          <v-chip
            :color="player.hasGrelottine ? 'red' : 'dark darken-1'"
            outlined
            :disabled="!player.hasGrelottine"
          >
            <v-icon class="mr-1" small>mdi-bell-outline</v-icon>
            Grelottine
          </v-chip>
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Player } from "@/domain/player";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("currentGame", ["isCurrentPlayer", "getPlayerScore"]),
  },
})
export default class PlayersBanner extends Vue {
  @Prop() players!: Array<Player>;

  applyBevue(player: Player): void {
    this.$store.dispatch("currentGame/applyBevue", player.name);
  }
}
</script>

<style scoped lang="scss"></style>
