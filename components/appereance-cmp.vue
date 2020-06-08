<template>
  <v-card>
    <v-card-title>{{$t("settings.appearance_settings_tab.title")}}</v-card-title>
    <v-list>
      <v-list-item>
        <v-list-item-title>{{$t("settings.appearance_settings_tab.theme_setting.dark_theme_setting.title")}}
        </v-list-item-title>
        <v-select
          @change="changeTheme"
          :items="Themes"
          :label="this.$t('settings.appearance_settings_tab.theme_setting.dark_theme_setting.title') "
          v-model="themeMode"
          hide-details
          item-text="text"
          item-value="value"
          return-object

        />
      </v-list-item>
      <v-list-item>
        <v-list-item-title>
          {{$t('settings.appearance_settings_tab.theme_setting.Display_language_setting.title')}}
          <v-list-item-subtitle style="margin-top: 0.4rem">
            <a title="Crowdin" target="_blank" href="https://crowdin.com/project/reidun"><img
              src="https://badges.crowdin.net/reidun/localized.svg"></a>
          </v-list-item-subtitle>
        </v-list-item-title>
        <v-list-item-action>
          <v-select
            :items="languages"
            @change="changeLang"
            label="Language"
            v-model="userSpecifiedLang"
            item-text="text"
            item-value="value"
            return-object
          />
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
    import {mapGetters, mapMutations} from "vuex";

    export default {
        name: "appereance-details",
        data() {
            return {
                themeMode: {},
                userSpecifiedLang: '',

                Themes: [
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.dark_theme_setting.dark'),
                        value: 'dark'
                    },
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.dark_theme_setting.light'),
                        value: 'light'
                    },
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.dark_theme_setting.System_theme'),
                        value: 'systemTheme'
                    }
                ],
                languages: [
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.Display_language_setting.display_language_select.albanian'),
                        value: "sq"
                    },
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.Display_language_setting.display_language_select.danish'),
                        value: "da"
                    },
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.Display_language_setting.display_language_select.chinese'),
                        value: "zh-cn"
                    },
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.Display_language_setting.display_language_select.dutch'),
                        value: "nl"
                    },
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.Display_language_setting.display_language_select.english-uk'),
                        value: "en-uk"
                    },
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.Display_language_setting.display_language_select.english-us'),
                        value: "en-us"
                    },
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.Display_language_setting.display_language_select.french'),
                        value: "fr"
                    },
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.Display_language_setting.display_language_select.german'),
                        value: "de"
                    },
                    {
                        text:this.$t('settings.appearance_settings_tab.theme_setting.Display_language_setting.display_language_select.japanese'),
                        value: 'ja'
                    },
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.Display_language_setting.display_language_select.norwegian-bokmal'),
                        value: "nb"
                    },
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.Display_language_setting.display_language_select.norwegian-nynorsk'),
                        value: "nn",

                    },
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.Display_language_setting.display_language_select.serbian'),
                        value: "sr"
                    },
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.Display_language_setting.display_language_select.spanish'),
                        value: "sr"
                    },
                    {
                        text: this.$t('settings.appearance_settings_tab.theme_setting.Display_language_setting.display_language_select.swedish'),
                        value: "se"
                    }

                ]


            }
        },
        mounted(){

            if (localStorage.theme !== undefined) {
                this.themeMode = JSON.parse(localStorage.theme);
            } else {
                this.themeMode = {}
            }
            this.userSpecifiedLang = this.languages.filter((item) => {return item.value === this.userLocale})[0]

            this.languages.sort(function (a, b) {
                if (a.text < b.text) {
                    return -1;
                }
                if (a.text > b.text) {
                    return 1;
                }
                return 0;
            })
        },
        methods: {
            async changeTheme(item) {
                localStorage.theme = JSON.stringify(item)
                this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'theme-changed', JSON.stringify(item));
            },

            changeLang(item) {

                localStorage.userSpecLang = item.value
                this.languages.sort(function (a, b) {
                    if (a.text < b.text) {
                        return -1;
                    }
                    if (a.text > b.text) {
                        return 1;
                    }
                    return 0;
                })

                this.$store.commit('SET_LANG', item.value)
                this.$root.$i18n.locale = item.value

            },
            ...mapMutations({
                setSnack: 'snackbar/setSnack',
                setSnackTop: 'snackbar/setSnackTop',
                setSnackColor: 'snackbar/setSnackColor'
            })
        },
        computed:{
            ...mapGetters(['isAuthenticated', 'loggedInUser',"userLocale"]),

        }



    }
</script>

<style scoped>

</style>
