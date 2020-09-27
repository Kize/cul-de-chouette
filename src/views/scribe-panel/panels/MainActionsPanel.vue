<template>
  <v-card outlined elevation="4" color="indigo lighten-5">
    <v-card-text>
      <BevueMenuAction></BevueMenuAction>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import BevueMenuAction from "@/components/BevueMenuAction.vue";

@Component({
  components: { BevueMenuAction }
})
export default class MainActionsPanel extends Vue {}
</script>

<style scoped lang="scss"></style>
