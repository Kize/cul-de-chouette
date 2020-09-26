<template>
  <v-card
    class="pa-3 mx-1"
    tile
    outlined
    :color="isCurrentPlayer(player.name) ? 'blue lighten-3' : 'blue lighten-5'"
  >
    <v-card-title class="headline">
      <span>{{ player.name }}</span>
      <v-divider vertical class="mx-6"></v-divider>
      <span>Score: {{ getPlayerScore(player.name) }}</span>

      <v-spacer></v-spacer>

      <v-chip small color="primary" v-if="player.hasGrelottine"
        >Grelottine
      </v-chip>
    </v-card-title>

    <MainActionsPanel :player="player"></MainActionsPanel>
    <MainPlayPanel :player="player"></MainPlayPanel>
  </v-card>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { Player } from "@/domain/player";
import MainActionsPanel from "./panels/MainActionsPanel.vue";
import MainPlayPanel from "./panels/MainPlayPanel.vue";

@Component({
  components: {
    MainPlayPanel,
    MainActionsPanel
  },
  computed: {
    ...mapGetters("currentGame", ["isCurrentPlayer", "getPlayerScore"])
  }
})
export default class ScribePanel extends Vue {
  @Prop({ required: true }) player!: Player;
}
</script>
