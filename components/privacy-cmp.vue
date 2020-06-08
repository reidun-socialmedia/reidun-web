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
</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "privacy-details",
        data(){
            return{
                profilePrivacySetting:"",
                friendRequestSetting:"",
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
        mounted() {
            this.friendRequestSetting = this.friend_request_select.filter((item) =>  {return item.value === this.loggedInUser.privacy.who_can_add})[0]

            this.profilePrivacySetting = this.profile_view_select.filter((item) =>  {return item.value === this.loggedInUser.privacy.profile_privacy})[0]



        },
        methods:{
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
            }
        },
        computed:{
            ...mapGetters(['isAuthenticated', 'loggedInUser',"userLocale"]),
        }
    }
</script>

<style scoped>

</style>
