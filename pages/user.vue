<template>
  <v-container>
    <v-card v-if="this.user.firstname === undefined" >
      <v-card-title>
        error
      </v-card-title>
      <v-card>user could not be found!</v-card>
    </v-card>

    <v-card v-else-if="this.user.firstname !== undefined">
      <v-img width="1200" height="200" :src="this.user.headerimg !== undefined ? this.user.headerimg : 'defaultpost.jpg'"/>
      <v-card-title>
        <v-avatar style="border: cornflowerblue solid 1px; margin-right: 1rem">
          <v-img :src="'/media/avatar/'+this.user.path"/>
        </v-avatar>{{this.user.firstname + " " + this.user.lastname}}
      <v-spacer></v-spacer>
      <v-btn
        v-if="user.who_can_add === 'everyone'"
        @click="addFriend(user.user_id)"

      >
        <v-icon>mdi-person-add</v-icon> add friend
      </v-btn></v-card-title>
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
          <v-card v-if="this.user.profile_privacy !== 'friends'">
            <v-card-title>{{this.user.firstname + "'s"}} wall</v-card-title>
          </v-card>
          <v-card v-else>
            <v-card-title>{{this.user.firstname + "'s"}} wall</v-card-title>
            <v-card-text>
              You need to be friends with {{this.user.firstname}} to view his/her/their wall
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item  value="tab-about">
          <v-card v-if="this.user.profile_privacy !== 'friends'">
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
          <v-card v-else>
            <v-card-title>About {{this.user.firstname}}</v-card-title>
            <v-card-text>
              You need to be friends with {{this.user.firstname}} to view his/her/their information
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item  value="tab-friends">
          <v-card v-if="this.user.profile_privacy !== 'friends'">
            <v-card-title>{{user.firstname+"'s "}}friends</v-card-title>
          </v-card>

        <v-card v-else>
          <v-card-title>{{user.firstname+"'s "}}friends</v-card-title>
          <v-card-text>
            You need to be friends with {{this.user.firstname}} to view his/her/their friends
          </v-card-text>
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
      getUser(userId){
        let token = this.$auth.getToken('local')

        this.$axios.get('/users/'+userId,{ headers: { Authorization: `${token}` }}).then( res => {
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
      },
      addFriend(targetId){

      },
      checkUser(userId){
        if(userId === this.loggedInUser.user_id){
          this.$router.push({
            path:'/me'
          })
        }else{

        }
      }
    },
    watch: {
      '$route.query.id': function (id) {
        this.user = []
        this.checkUser(this.$route.query.id)
        this.getUser(this.$route.query.id)
        //this.getRelationWithLoggedInUser(this.$route.query.id)


      }
    },
    mounted() {
    },
    beforeMount() {
          this.checkUser(this.$route.query.id)
          this.getUser(this.$route.query.id)
          //this.getRelationWithLoggedInUser(this.$route.query.id)

    },
    computed:{
      ...mapGetters(['isAuthenticated', 'loggedInUser']),

    }
  }
</script>

<style scoped>

</style>
