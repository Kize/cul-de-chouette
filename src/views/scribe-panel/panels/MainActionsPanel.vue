<template>
  <v-card tile class="mb-2">
    <v-card-text class="pa-1">
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
