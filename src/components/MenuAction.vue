<template>
  <v-menu offset-y>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        tile
        dark
        color="primary"
        large
        class="ma-2"
        v-bind="attrs"
        v-on="on"
        >{{ label }}
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="value in options"
        :key="value"
        @click="chooseOption(value)"
      >
        <v-list-item-title>{{ value }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({})
export default class MenuAction extends Vue {
  @Prop(String) label!: string;
  @Prop() options!: Array<string> | number;

  chooseOption(option: string): void {
    this.$emit("click", option);
  }
}
</script>

<style scoped lang="scss"></style>
