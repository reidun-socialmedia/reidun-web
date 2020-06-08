<template>
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
            <v-select
              solo
              filled
              :items="profile_view_select"
              v-model="profilePrivacySetting"
              @change="changeProfilePrivacySetting"
              :label="$t('settings.privacy_tab.profile_privacy.label')"
              item-value="value"
              item-text="text"
              return-object
            >
            </v-select>
        </v-list-item-content>

      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
            {{$t("settings.privacy_tab.friend_request_privacy.title")}}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{$t("settings.privacy_tab.friend_request_privacy.description")}}
          </v-list-item-subtitle>
          <v-select
            solo
            filled
            :items="friend_request_select"
            v-model="friendRequestSetting"
            @change="changefriendRequestSetting"
            :label="$t('settings.privacy_tab.friend_request_privacy.label')"
            item-value="value"
            item-text="text"
            return-object
          >
          </v-select>
        </v-list-item-content>

      </v-list-item>
    </v-list>
  </v-card>
</template>

<script>
    import {mapGetters} from "vuex";
    import privacyDetails from "../components/privacy-cmp"
    export default {
      name: "privacy",
        components:{privacyDetails}

    }
</script>

<style scoped>

</style>
