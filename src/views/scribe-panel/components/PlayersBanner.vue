<template>
  <v-banner>
    <v-row>
      <v-col
        lg="2"
        md="12"
        sm="12"
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
          <v-card-title class="d-flex justify-space-around">
            <span>{{ player.name }}</span>
            <v-divider vertical class="mx-6"></v-divider>
            <span>Score: {{ getPlayerScore(player.name) }}</span>
          </v-card-title>

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
  </v-banner>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Player } from "@/domain/player";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("currentGame", ["isCurrentPlayer", "getPlayerScore"])
  }
})
export default class PlayersBanner extends Vue {
  @Prop() players!: Array<Player>;
}
</script>

<style scoped lang="scss"></style>
