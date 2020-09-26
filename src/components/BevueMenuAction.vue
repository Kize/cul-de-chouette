<template>
  <div>
    <MenuAction
      label="Bévue"
      :disabled="false"
      :options="playerNames"
      @click="applyBevue($event)"
    >
    </MenuAction>

    <v-snackbar v-model="snackBarDisplay" :timeout="3000">
      Une bévue a été appliquée pour {{ playerNameBevue }}

      <template v-slot:action="{ attrs }">
        <v-btn color="blue" v-bind="attrs" @click="snackBarDisplay = false">
          Okay
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MenuAction from "@/components/MenuAction.vue";
import { mapGetters } from "vuex";

@Component({
  components: { MenuAction },
  computed: {
    ...mapGetters("currentGame", ["playerNames"])
  }
})
export default class BevueMenuAction extends Vue {
  readonly playerNames!: Array<string>;

  snackBarDisplay = false;
  playerNameBevue = "";

  applyBevue(playerName: string): void {
    this.playerNameBevue = playerName;
    this.$store.dispatch("currentGame/applyBevue", playerName);

    this.snackBarDisplay = true;
  }
}
</script>

<style scoped lang="scss"></style>
