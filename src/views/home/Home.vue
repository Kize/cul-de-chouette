<template>
  <v-row justify="center">
    <v-col md="8" cols="12" class="px-6">
      <Intro />
      <NewGameForm />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Intro from "@/views/home/components/Intro.vue";
import NewGameForm from "@/views/home/components/NewGameForm.vue";

@Component({
  components: { NewGameForm, Intro }
})
export default class Home extends Vue {}
</script>

<style lang="scss"></style>
