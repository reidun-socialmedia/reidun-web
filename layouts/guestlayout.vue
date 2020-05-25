<template>
  <v-app :dark="setTheme" :style="{background: $vuetify.theme.themes[getTheme].background}" >
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
       data(){
          return{
            dark:false
          }
       },
      mounted() {
          console.log("%c"+this.$t("default_layout.developer_console_warning.line_1"), "color: red; font-size:40px")
          console.log("%c"+this.$t("default_layout.developer_console_warning.line_2"), "color: red; font-size: 30px")
          console.log("%c"+this.$t("default_layout.developer_console_warning.line_3"), "color: red; font-size: 30px")
        let defaultTheme = {
          text: 'System Theme',
          value: 'systemTheme'
        }
          this.theme = defaultTheme

        if (!localStorage.theme) {
          let defaultTheme = {
            text: 'System Theme',
            value: 'systemTheme'
          }
          localStorage.theme = JSON.stringify(defaultTheme)
        }else{
          this.theme = JSON.parse(localStorage.theme)

        }
        if (this.theme.value === 'systemTheme') {

          this.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
          window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            this.dark = e.matches
          });
        }
      },
        computed:{
          getTheme(){
                return (this.$vuetify.theme.dark) ? 'dark' : 'light'
            },
           setTheme() {
             return (this.$vuetify.theme.dark = this.dark);
           }
       },
        methods: {

        }
    }
</script>

<style scoped>

</style>
