<template>
  <v-container>
    <h1 class="headline mb-2">
      <v-row no-gutters justify="space-between">
        <v-col>Le cul de chouette</v-col>
        <v-col class="text-right">
          <RulesButton></RulesButton>
        </v-col>
      </v-row>
    </h1>

    <v-expansion-panels accordion hover>
      <v-expansion-panel>
        <v-expansion-panel-header>
          <h2>Description</h2>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <p class="mb-2">
            Cette application permet de simplifier la vie du scribe lors d'une
            partie de Cul de Chouette. Elle suit les règles érigées par
            l'amicale lilloise du cul de chouette. Toute les règles ne sont pas
            encore forcément implémentées, cela va venir.
          </p>

          <p class="mb-0">
            Vous pouvez ici débuter une partie, veuillez sélectionner les
            paramètres de la partie. Concernant les joueurs, l'ordre
            d'inscription déterminera l'ordre de jeu. <br />
            Il est donc <b>important</b> de déterminer l'ordre des joueurs avant
            de le renseigner dans l'application. Le premier joueur inscrit
            <b>sera</b> le premier joueur a commencé.
          </p></v-expansion-panel-content
        >
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import RulesButton from "@/components/RulesButton.vue";

@Component({
  components: { RulesButton }
})
export default class Intro extends Vue {}
</script>

<style scoped lang="scss"></style>
