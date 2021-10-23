<template>
  <div>
    <Intro />
    <NewGameForm />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Intro from "@/views/home/components/Intro.vue";
import NewGameForm from "@/views/home/components/NewGameForm.vue";

@Component({
  components: { NewGameForm, Intro },
})
export default class Home extends Vue {}
</script>

<style lang="scss"></style>
