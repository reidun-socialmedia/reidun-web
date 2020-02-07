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
        name: "loginLayout",
      mounted() {
        console.log("%cHold Up!", "color: red; font-size:40px")
        console.log("%cPasting suspicious code in here could give attackers access to your account.","color: red; font-size: 30px")
        console.log("%cunless you understand exactly what you are doing, close this window and stay safe.", "color: red; font-size: 30px")
      },
    }
</script>

<style scoped>

</style>
