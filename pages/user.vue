<template>
  <v-container>
    <v-card v-if="this.user.length === 0" >
      <v-card-title>
        error
      </v-card-title>
      <v-card>user could not be found!</v-card>
    </v-card>
    <v-card v-else-if="this.user.length !== 0">
      <v-img width="1200" height="200" :src="this.user.headerimg !== undefined ? this.user.headerimg : 'defaultpost.jpg'"/>
      <v-card-title>
        <v-avatar style="border: cornflowerblue solid 1px;">
          <v-img  :src="this.user.avatar !== undefined ? this.user.avatar : 'account.png'"/>
        </v-avatar>{{this.user.firstname + " " + this.user.lastname}}</v-card-title>
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
            <v-card-title>{{this.user.firstname + "'s"}} wall</v-card-title>
          </v-card>
        </v-tab-item>
        <v-tab-item  value="tab-about">
          <v-card>
            <v-card-title>about {{this.user.firstname}}</v-card-title>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon>email</v-icon>
                  email
                </v-list-item-title>
                <v-list-item-subtitle>{{this.user.email}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon>{{getGenderIcon(this.user.gender) }}</v-icon>
                  gender
                </v-list-item-title>
                <v-list-item-subtitle>{{this.user.gender}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon>today</v-icon>
                  birthday
                </v-list-item-title>
                <v-list-item-subtitle>{{this.user.birthday}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

          </v-card>
        </v-tab-item>

        <v-tab-item  value="tab-friends">
          <v-card>
            <v-card-title>{{user.firstname+"'s "}}friends</v-card-title>
          </v-card>
        </v-tab-item>

      </v-tabs>
    </v-card>
  </v-container></template>

<script>
  import {mapGetters} from "vuex";

  export default {
    name: "me",
    data(){
      return{
        user:{}
      }
    },
    methods:{
      getUser(userid){
        let token = this.$auth.getToken('local')

        this.$axios.get('/users/'+userid,{ headers: { Authorization: `${token}` }}).then( res => {
          this.user = res.data.data

        }).catch( error => {

        })
      },
      getGenderIcon(sentGender){
        switch (sentGender) {
          case 'Male':
            return  'mdi-gender-male'
          case "Female":
            return 'mdi-gender-female'
          case "other":
            return 'mdi-gender-transgender'
          default: return 'mdi-account-question'

        }
      }
    },
    watch: {
      '$route.query.id': function (id) {
        this.user = []
        this.getUser(this.$route.query.id)

      }
    },
    beforeMount() {
          this.getUser(this.$route.query.id)
    },
  }
</script>

<style scoped>

</style>
