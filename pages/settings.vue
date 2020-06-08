<template>
  <div v-if="this.$vuetify.breakpoint.mdAndUp">
    <v-container>
      <v-tabs
        fixed-tabs
        vertical
        centered
        icons-and-text
      >
        <v-tab to="#account">
          {{$t('settings.settings_tab.account_details')}}
          <v-icon>
            mdi-account
          </v-icon>
        </v-tab>
        <v-tab to="#privacy">
          {{$t("settings.settings_tab.privacy")}}
          <v-icon>
            mdi-security
          </v-icon>
        </v-tab>
        <v-tab to="#appearance">
          {{$t("settings.settings_tab.appearance")}}
          <v-icon>mdi-eye</v-icon>
        </v-tab>
        <v-tab to="#security">
          {{$t("settings.settings_tab.account_security_log")}}
          <v-icon>
            mdi-security-network
          </v-icon>
        </v-tab>
        <v-tab-item
          value="account"
        >

        <account-details>
        </account-details>
        </v-tab-item>
        <v-tab-item  value="privacy">
          <v-card>
            <v-card-title>
              {{$t("settings.privacy_tab.title")}}
            </v-card-title>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>
                    {{$t("settings.privacy_tab.profile_privacy.title")}}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{$t("settings.privacy_tab.profile_privacy.description")}}
                  </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-select
                    :items="profile_view_select"
                    v-model="profilePrivacySetting"
                    @change="changeProfilePrivacySetting"
                    :label="$t('settings.privacy_tab.profile_privacy.label')"
                    item-value="value"
                    item-text="text"
                    return-object
                  >
                  </v-select>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                <v-list-item-title>
                  {{$t("settings.privacy_tab.friend_request_privacy.title")}}
                </v-list-item-title>
                <v-list-item-subtitle>
                  {{$t("settings.privacy_tab.friend_request_privacy.description")}}
                </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-select
                    :items="friend_request_select"
                    v-model="friendRequestSetting"
                    @change="changefriendRequestSetting"
                    :label="$t('settings.privacy_tab.friend_request_privacy.label')"
                    item-value="value"
                    item-text="text"
                    return-object
                  >
                  </v-select>
                </v-list-item-action>
              </v-list-item>
            </v-list>
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
  import {mapGetters, mapMutations} from "vuex";
  import accountDetails from "../components/account-details";
  export default {
    name: "settings",

      components:{ accountDetails },
    data() {
      return {
        themeMode: {},
        userSpecifiedLang: '',
        profilePrivacySetting:"",
        friendRequestSetting:"",
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

        ],
        profile_view_select:[
          {
            text:this.$t('settings.privacy_tab.profile_privacy.select_items.everyone'),
            value:"everyone"

          },
          {
            text:this.$t('settings.privacy_tab.profile_privacy.select_items.friends'),
            value:"friends"
          }
        ],
        friend_request_select:[
          {
            text:this.$t('settings.privacy_tab.friend_request_privacy.select_items.everyone'),
            value:"everyone"

          },
          {
            text:this.$t('settings.privacy_tab.friend_request_privacy.select_items.friends_of_friends'),
            value:"friends_of_friends"
          },
          {
            text:this.$t('settings.privacy_tab.friend_request_privacy.select_items.none'),
            value:"none"
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

      this.friendRequestSetting = this.friend_request_select.filter((item) =>  {return item.value === this.loggedInUser.privacy.who_can_add})[0]

      this.profilePrivacySetting = this.profile_view_select.filter((item) =>  {return item.value === this.loggedInUser.privacy.profile_privacy})[0]

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

        changeProfilePrivacySetting(item) {
            let data = {
                privacy_setting: item.value,

            }
            self = this
            this.$axios.patch('/users/privacy/profile/change', data).then(res => {


            }).catch(err => {


            })
        },
        changefriendRequestSetting(item) {


            let data = {
                privacy_setting: item.value,

            }
            self = this
            this.$axios.patch('/users/privacy/request/change', data).then(res => {


            }).catch(err => {


            })
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
