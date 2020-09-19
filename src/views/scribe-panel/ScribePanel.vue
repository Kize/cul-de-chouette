<template>
  <div class="scribe-panel">
    <h1>Scribe Panel</h1>
    <h2>{{ gameName }}</h2>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { GameStatus } from "@/store/current-game/current-game.interface";

@Component({
  components: {}
})
export default class ScribePanel extends Vue {
  get gameName(): string {
    return this.$store.getters["currentGame/gameName"];
  }

  get gameStatus(): GameStatus {
    return this.$store.getters["currentGame/gameStatus"];
  }

  @Watch("gameStatus")
  onGameStatusChange(newStatus: GameStatus): void {
    console.log("hey", newStatus);
    switch (newStatus) {
      case GameStatus.CREATION:
        this.$router.push("/");
        break;
      case GameStatus.FINISHED:
        window.alert("La partie est finie !");
        break;
    }
  }
}
</script>

<style lang="scss">
.control .icon.is-clickable {
  pointer-events: initial;
}
</style>
