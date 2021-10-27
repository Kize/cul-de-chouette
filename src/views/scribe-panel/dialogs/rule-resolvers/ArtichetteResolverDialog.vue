<template>
  <v-dialog
    :value="artichetteResolverDialog.isVisible"
    persistent
    max-width="800"
  >
    <v-card>
      <v-card-title>
        <h2>
          {{ artichetteResolverDialog.isVisible }} a réalisé une Artichette!
        </h2>

        <v-spacer></v-spacer>

        <BevueMenuAction></BevueMenuAction>
      </v-card-title>

      <v-card-text>
        <h3 class="pl-12">(Combinaison: 4, 4, 3)</h3>

        <v-row class="my-16" justify="space-around">
          <v-btn x-large class="px-6" color="primary" @click="confirm(true)">
            Raitournelle!
          </v-btn>

          <v-btn x-large class="px-6" color="warning" @click="confirm(false)">
            Artichette!
          </v-btn>
        </v-row>
      </v-card-text>

      <v-card-actions class="pb-6 pr-6">
        <v-spacer></v-spacer>
        <v-btn x-large class="px-6 mr-3" @click="cancel"> Annuler</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BevueMenuAction from "@/components/BevueMenuAction.vue";
import { mapState } from "vuex";
import { DialogsState } from "@/store/current-game/dialogs.store";
import { ArtichetteResolution } from "../../../../../domain/rules/level-2/artichette-rule";

@Component({
  components: { BevueMenuAction },
  computed: {
    ...mapState("currentGame/dialogs", ["artichetteResolverDialog"]),
  },
})
export default class ArtichetteResolverDialog extends Vue {
  artichetteResolverDialog!: DialogsState["artichetteResolverDialog"];

  cancel(): void {
    this.$store.dispatch("currentGame/play/cancelArtichette");
  }

  confirm(isRaitournelleClaimed: boolean): void {
    const resolution: ArtichetteResolution = {
      isRaitournelleClaimed,
    };

    this.$store.dispatch("currentGame/play/resolveArtichette", resolution);
  }
}
</script>

<style scoped lang="scss"></style>
