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
          <privacy-details></privacy-details>
        </v-tab-item>
        <v-tab-item
          value="appearance"
        >
          <appereance-details></appereance-details>
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
  import accountDetails from "../components/account-cmp";

  import privacyDetails from "../components/privacy-cmp"
  import appereanceDetails from "../components/appereance-cmp"
  export default {
    name: "settings",

      components:{ accountDetails,privacyDetails,appereanceDetails },


  }
</script>

<style scoped>

</style>
