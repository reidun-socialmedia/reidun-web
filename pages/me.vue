<template>
  <v-container>
    <v-card>
      <v-img width="1200" height="200" :src="loggedInUser.headerimg !== undefined ? loggedInUser.headerimg : 'defaultpost.jpg'"/>
      <v-card-title>
        <v-avatar style="border: cornflowerblue solid 1px;">
        <v-img  :src="loggedInUser.avatar !== undefined ? loggedInUser.avatar : 'account.png'"/>
      </v-avatar>{{loggedInUser.firstname + " " + loggedInUser.lastname}}</v-card-title>
      <v-tabs
        fixed-tabs

      >
        <v-tab
          href="#tab-wall"
        >
          Wall
        </v-tab>
        <v-tab
          href="#tab-about"

        >
          About

        </v-tab>
        <v-tab
          href="#tab-friends"
        >
          Friends
        </v-tab>
        <v-tab-item
          value="tab-wall"
        >
          <v-card>
            <v-card-title>your wall</v-card-title>
          </v-card>
        </v-tab-item>
        <v-tab-item  value="tab-about">
          <v-card>
            <v-card-title>about you</v-card-title>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon>email</v-icon>
                  email
                </v-list-item-title>
                <v-list-item-subtitle>{{loggedInUser.email}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon>{{getGenderIcon(loggedInUser.gender) }}</v-icon>
                  gender
                </v-list-item-title>
                <v-list-item-subtitle>{{loggedInUser.gender}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon>today</v-icon>
                  birthday
                </v-list-item-title>
                <v-list-item-subtitle>{{loggedInUser.birthday}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

          </v-card>
        </v-tab-item>

        <v-tab-item  value="tab-friends">
          <v-card>
            <v-card-title>your friends</v-card-title>
          </v-card>
        </v-tab-item>

      </v-tabs>
    </v-card>
  </v-container></template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "me",
      methods:{
        getGenderIcon(sentGender){
          switch (sentGender) {
            case 'Male':
              return 'mdi-gender-male'
            case "Female":
              return 'mdi-gender-female'
            case "other":
              return 'mdi-gender-transgender'
            default: return 'mdi-account-question'

          }
        }
      },
      computed: {
        ...mapGetters(['isAuthenticated', 'loggedInUser']),

      }
    }
</script>

<style scoped>

</style>
