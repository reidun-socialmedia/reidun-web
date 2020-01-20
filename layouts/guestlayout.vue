<template>
  <v-app>
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
