<template>
  <v-app :dark="setTheme" :style="{background: $vuetify.theme.themes[theme].background}" >
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
          console.log("%c"+this.$t("default_layout.developer_console_warning.line_1"), "color: red; font-size:40px")
          console.log("%c"+this.$t("default_layout.developer_console_warning.line_2"), "color: red; font-size: 30px")
          console.log("%c"+this.$t("default_layout.developer_console_warning.line_3"), "color: red; font-size: 30px")
      },
        computed:{
                theme(){
                return (this.$vuetify.theme.dark) ? 'dark' : 'light'
            },
           setTheme() {
               if (localStorage.theme === 'light') {
                   return (this.$vuetify.theme.dark = false);
               } else {
                   return (this.$vuetify.theme.dark = true);
               }
           }
       },
        methods: {

        }
    }
</script>

<style scoped>

</style>
