<template>
  <v-app :dark="setTheme" :style="{background: $vuetify.theme.themes[getTheme].background}" >
    <v-main>
      <v-container>
        <nuxt/>
        <Snackbar />
      </v-container>
    </v-main>
    <v-footer>
      <v-row>
        <v-col>

          <v-card
          >
            <v-card-title>
              Policies
            </v-card-title>
            <v-card-text>
              <nuxt-link to="/tos">Terms of Service</nuxt-link>
              <nuxt-link to="/privacy-policy">Privacy Policy</nuxt-link>
            </v-card-text>

          </v-card>
        </v-col>
        <v-col>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>
              Socials
            </v-card-title>
            <v-card-text>
              <v-btn href="https://github.com/reidun-socialmedia"  style="width: 2rem; height: 2rem" target="_blank" icon>
                <v-img style="width: 2rem; height: 2rem"   src="/Github-Mark-32px.png"></v-img>
              </v-btn>
              <v-btn href="https://twitter.com/reidun_socialmedia" style="width: 2rem; height: 2rem" target="_blank" icon>
                <v-img style="width: 2rem; height: 2rem"  src="/Twitter_Social_Icon_Circle_Color.png"></v-img>
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-footer>
    <v-banner style="z-index: 30" color="primary" sticky v-if="showPrompt" two-line>

        You can add reidun to your homescreen on mobile or on desktop
      <template v-slot:actions>
        <v-btn text color="deep-purple accent-4">Action</v-btn>
        <v-btn text color="deep-purple accent-4">Action</v-btn>
      </template>
    </v-banner>
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
            dark:false,
            showPrompt:false
          }
       },
      mounted() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
          // Prevent the mini-infobar from appearing on mobile
          e.preventDefault();
          // Stash the event so it can be triggered later.
          deferredPrompt = e;
          // Update UI notify the user they can install the PWA
          this.showPrompt = true
        });
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
          if(this.theme.value === "dark"){
            this.dark = true
          }else{
            this.dark = false
          }
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
