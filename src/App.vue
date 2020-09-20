<template>
  <v-app>
    <v-main>
      <v-container fluid class="px-2">
        <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { GameStatus } from "@/store/current-game/current-game.interface";
import { ROUTES } from "@/router";

@Component({})
export default class App extends Vue {
  async created(): Promise<void> {
    const currentRouteName = this.$route.name;
    const currentGame = JSON.parse(localStorage.getItem("currentGame") || "{}");

    let routeToGo = ROUTES.HOME.name;

    if (currentGame && currentGame.status === GameStatus.IN_GAME) {
      await this.$store.dispatch("currentGame/resumeGame", currentGame);
      routeToGo = ROUTES.SCRIBE_PANEL.name;
    }

    if (currentRouteName !== routeToGo) {
      await this.$router.push({ name: routeToGo });
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
