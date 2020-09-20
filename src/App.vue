<template>
  <v-app>
    <v-main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GameStatus } from "@/store/current-game/current-game.interface";

@Component({})
export default class App extends Vue {
  async created(): Promise<void> {
    const currentGame = JSON.parse(localStorage.getItem("currentGame") || "{}");

    if (currentGame && currentGame.status === GameStatus.IN_GAME) {
      await this.$store.dispatch("currentGame/resumeGame", currentGame);
      await this.$router.push("/scribe-panel");
    } else {
      // await this.$router.push("/");
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>
