<template>
  <v-card>
    <!--    HEADER-->
    <v-toolbar dark color="primary">
      <v-btn icon dark @click="cancel">
        <v-icon>mdi-close</v-icon>
      </v-btn>
      <v-toolbar-title>Défi de grelottine</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn dark text @click="confirm">Valider la grelottine</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <v-list three-line subheader>
      <v-subheader>User Controls</v-subheader>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";
import { SloubiActionPayload } from "@/store/current-game/current-game.interface";

@Component({
  components: {}
})
export default class GrelottineDialogCard extends Vue {
  @Prop() playerNames!: Array<string>;

  form: SloubiActionPayload = {
    name: "",
    score: 0
  };

  @Emit()
  cancel(): void {
    this.form = {
      name: "",
      score: 0
    };
  }

  @Emit()
  confirm(): SloubiActionPayload {
    return { ...this.form };
  }
}
</script>

<style scoped lang="scss"></style>
