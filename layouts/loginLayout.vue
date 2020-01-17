<template>
  <v-app>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >

      <v-toolbar-title style="margin-left: 1rem">Reidun</v-toolbar-title>


    </v-app-bar>
    <v-content>
      <v-container>
        <nuxt/>
        <Snackbar />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
    import Snackbar from "../components/Snackbar";

    export default {
        middleware:"guest",
        components: {
            Snackbar
        },
        name: "loginLayout"
    }
</script>

<style scoped>

</style>
