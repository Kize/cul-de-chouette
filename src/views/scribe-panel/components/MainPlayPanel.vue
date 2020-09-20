<template>
  <v-card tile class="mb-2">
    <v-card-text class="pa-1">
      <MenuAction label="Chouette" :options="6" @click="playChouette">
      </MenuAction>

      <MenuAction
        label="Velute"
        :options="[3, 4, 5, 6]"
        @click="playVelute"
      ></MenuAction>

      <MenuAction
        label="Chouette Velute"
        :options="[2, 4, 6]"
        @click="playChouetteVelute"
      >
      </MenuAction>

      <MenuAction
        label="Cul de chouette"
        :options="6"
        @click="playCulDeChouette"
      >
      </MenuAction>

      <v-btn tile color="primary" outlined large class="ma-2" @click="playSuite"
        >Suite
      </v-btn>

      <v-btn tile color="primary" outlined large class="ma-2" @click="playNeant"
        >Néant</v-btn
      >
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { HistoryLineAction, HistoryLineType } from "@/domain/history";
import { Player } from "@/domain/player";
import MenuAction from "@/components/MenuAction.vue";

@Component({
  components: { MenuAction }
})
export default class MainPlayPanel extends Vue {
  @Prop(Player) player!: Player;

  playChouette(value: number): void {
    const action: HistoryLineAction = {
      playerName: this.player.name,
      designation: HistoryLineType.CHOUETTE,
      value
    };
    this.$store.dispatch("currentGame/playATurn", action);
  }

  playVelute(value: number): void {
    const action: HistoryLineAction = {
      playerName: this.player.name,
      designation: HistoryLineType.VELUTE,
      value
    };
    this.$store.dispatch("currentGame/playATurn", action);
  }

  playCulDeChouette(value: number): void {
    const action: HistoryLineAction = {
      playerName: this.player.name,
      designation: HistoryLineType.CUL_DE_CHOUETTE,
      value
    };
    this.$store.dispatch("currentGame/playATurn", action);
  }

  playNeant(): void {
    const action: HistoryLineAction = {
      playerName: this.player.name,
      designation: HistoryLineType.NEANT,
      value: 0
    };
    this.$store.dispatch("currentGame/playATurn", action);
  }

  // TODO: handle multiplayer errors on this one.
  playChouetteVelute(value: number): void {
    const action: HistoryLineAction = {
      playerName: this.player.name,
      designation: HistoryLineType.CHOUETTE_VELUTE,
      value
    };
    this.$store.dispatch("currentGame/playATurn", action);
  }

  playSuite(): void {
    window.alert("Pas codée encore :/");
  }
}
</script>

<style scoped lang="scss"></style>
