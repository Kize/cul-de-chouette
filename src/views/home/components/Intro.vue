<template>
  <div>
    <h1>Le cul de chouette</h1>
    <v-card>
      <v-card-title class="headline">Description</v-card-title>

      <v-card-text>
        <p>
          Cette application permet de simplifier la vie du scribe lors d'une
          partie de Cul de Chouette. Elle suit les règles érigées par l'amicale
          lilloise du cul de chouette. Toute les règles ne sont pas encore
          forcément implémentées, cela va venir.
        </p>

        <p>
          Vous pouvez ici débuter une partie, veuillez sélectionner les
          paramètres de la partie. Concernant les joueurs, l'ordre d'inscription
          déterminera l'ordre de jeu. <br />
          Il est donc <b>important</b> de déterminer l'ordre des joueurs avant
          de le renseigner dans l'application. Le premier joueur inscrit
          <b>sera</b> le premier joueur a commencé.
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class Intro extends Vue {}
</script>

<style scoped lang="scss"></style>
