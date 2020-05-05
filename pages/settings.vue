<template>
  <div v-if="this.$vuetify.breakpoint.mdAndUp">
    <v-container>
      <v-tabs
        fixed-tabs
        vertical
        grow
        centered
        icons-and-text
      >
        <v-tab href="#account">
          {{$t('settings.settings_tab.account_details')}}
          <v-icon>
            mdi-account
          </v-icon>
        </v-tab>
        <v-tab>
          {{$t("settings.settings_tab.privacy")}}
          <v-icon>
            mdi-security
          </v-icon>
        </v-tab>
        <v-tab href="#appearance">
          {{$t("settings.settings_tab.appearance")}}
          <v-icon>mdi-eye</v-icon>
        </v-tab>
        <v-tab>
          {{$t("settings.settings_tab.account_security_log")}}
          <v-icon>
            mdi-security-network
          </v-icon>
        </v-tab>
        <v-tab-item
          value="account"
        >
          <v-card>
            <v-card-title>
              {{$t("settings.account_settings_tab.information.title")}}
            </v-card-title>
          </v-card>
        </v-tab-item>
        <v-tab-item
          value="appearance"
        >
          <v-card>
            <v-card-title>{{$t("settings.appearance_settings_tab.title")}}</v-card-title>
            <v-list>
              <v-list-item>
                <v-list-item-title>{{$t("settings.appearance_settings_tab.theme_setting.dark_theme_setting.title")}}
                </v-list-item-title>
                <v-switch @change="sendEvent($event)"
                          :label="themeMode === true ? this.$t('settings.appearance_settings_tab.theme_setting.dark_theme_setting.on') : this.$t('settings.appearance_settings_tab.theme_setting.dark_theme_setting.off') "
                          v-model="themeMode"/>
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
                    :items="languages.sort(function(a, b){
                     if(a.text < b.text) { return -1; }
                      if(a.text > b.text) { return 1; }
                      return 0;
                    })"
                    item-value="genders.value"
                    item-text="text"
                    @change="changeLang"
                    label="Language"
                    requried
                  />
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-container>
  </div>
    <v-navigation-drawer v-else-if="this.$vuetify.breakpoint.smAndDown" width="100%" permanent>
      <v-list>
        <v-list-item link to="/account-settings">
          <v-list-item-icon>
            <v-icon>
              mdi-account
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>{{$t('settings.settings_tab.account_details')}}</v-list-item-content>
          <v-list-item-icon>
            <v-icon>
              keyboard_arrow_right
            </v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item nuxt to="privacy-settings">
          <v-list-item-icon>
            <v-icon>
              mdi-security
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>{{$t("settings.settings_tab.privacy")}}</v-list-item-content>
          <v-list-item-icon>
            <v-icon>
              keyboard_arrow_right
            </v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item link to="/appearance-settings">
          <v-list-item-icon>
            <v-icon>mdi-eye</v-icon>
          </v-list-item-icon>
          <v-list-item-content> {{$t("settings.settings_tab.appearance")}}</v-list-item-content>
          <v-list-item-icon>
            <v-icon>keyboard_arrow_right</v-icon>
          </v-list-item-icon>
        </v-list-item>
        <v-list-item link to="security-log">
          <v-list-item-icon>
            <v-icon>
              mdi-security-network
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>{{$t("settings.settings_tab.account_security_log")}}</v-list-item-content>
          <v-list-item-icon>
            <v-icon>keyboard_arrow_right</v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
</template>

<script>
  import {EventBus} from '../assets/event-bus';

  export default {
    name: "settings",
    data() {
      return {
        themeMode: '',
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
            value: "zh"
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
    mounted() {
      this.themeMode = localStorage.theme !== 'light'

    },
    watch: {
      themeMode: function (val, oldval) {
        localStorage.theme = this.themeMode === true ? 'dark' : 'light';

      }
    },

    methods: {
      async sendEvent(e) {
        EventBus.$emit('theme-changed', this.themeMode);

      },
      changeLang(e) {
      }
    }
  }
</script>

<style scoped>

</style>
