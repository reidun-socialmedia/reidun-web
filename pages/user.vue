<template>
  <v-container>
    <v-card v-if="this.user.firstname === undefined">
      <v-card-title>
        error
      </v-card-title>
      <v-card>user could not be found!</v-card>
    </v-card>

    <v-card v-else-if="this.user.firstname !== undefined">
      <v-img width="1200" height="200"
             :src="this.user.headerimg !== undefined ? this.user.headerimg : 'defaultpost.jpg'"/>
      <v-card-title  style="position:relative; z-index: 1; top: -50px;">
        <v-avatar @click="avatarModal = true" style="width: 6rem; height: 6rem; margin-right: 1rem">
          <v-img :src="'/media/avatar/'+this.user.avatar.path"/>
        </v-avatar>
        <p style="position:relative; top: 1rem">{{this.user.firstname + " " + this.user.lastname}}</p>
        <v-spacer></v-spacer>
        <div class="buttons">
        <v-btn
          v-if="user.privacy.who_can_add === 'everyone' && relation.status === undefined"
          @click="addFriend(user.id)"

        >
          <v-icon>mdi-person-add</v-icon>
          add friend
        </v-btn>
        <v-btn
          v-else-if="user.privacy.who_can_add === 'everyone' && relation.status === 0 && relation.last_action_user_id === loggedInUser.id"
          @click="cancelFriendRequest(user.id)"
          color="error"
        >
          <v-icon>mdi-person-add</v-icon>
          cancel friend request
        </v-btn>
        <v-btn
          v-else-if="user.privacy.who_can_add === 'everyone' && relation.status === 0 && relation.last_action_user_id !== loggedInUser.id"
          @click="acceptFriendRequest(user.id)"
          color="primary"
        >
          accept friend request
        </v-btn>
          <v-btn
            v-if="user.privacy.who_can_add === 'everyone' && relation.status === 0 && relation.last_action_user_id !== loggedInUser.id"
            color="error"
            @click="denyFriendRequest(user.id)"
          >
            Deny friend request
          </v-btn>
        <v-btn icon>
           <v-icon>
             more_vert
           </v-icon>
        </v-btn>
        </div>
      </v-card-title>
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
        <v-card v-if="this.user.privacy.profile_privacy === 'everyone' ||  relation.status === 1 ">
            <v-card-title>{{this.user.firstname + "'s"}} wall</v-card-title>
          </v-card>
          <v-card v-else-if="this.user.privacy.profile_privacy !== 'everyone' ||  relation.status !== 1 ">
            <v-card-title>{{this.user.firstname + "'s"}} wall</v-card-title>
            <v-card-text>
              You need to be friends with {{this.user.firstname}} to view his/her/their wall
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item value="tab-about">
          <v-card v-if="this.user.privacy.profile_privacy === 'everyone'  || relation.status === 1">
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
          <v-card v-else-if="this.user.privacy.profile_privacy !== 'everyone'  ||  relation.status !== 1">
            <v-card-title>About {{this.user.firstname}}</v-card-title>
            <v-card-text>
              You need to be friends with {{this.user.firstname}} to view his/her/their information
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item value="tab-friends">
          <v-card v-if="this.user.privacy.profile_privacy === 'everyone'  ||  relation.status === 1">
            <v-card-title>{{user.firstname+"'s "}}friends</v-card-title>
            <v-list>
            <v-list-item
              v-for="(friend, i) in userFriends"
              :key="i"
              @click="go('/user?id='+friend.user.id)"
            >
              <v-list-item-icon>
                <v-avatar>
                  <v-img :src="'/media/avatar/'+friend.user.avatar.path"/>
                </v-avatar>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title v-text="friend.user.firstname + ' ' + friend.user.lastname"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            </v-list>
          </v-card>

          <v-card v-else-if="this.user.privacy.profile_privacy !== 'everyone'  ||  relation.status !== 1">
            <v-card-title>{{user.firstname+"'s "}}friends</v-card-title>
            <v-card-text>
              You need to be friends with {{this.user.firstname}} to view his/her/their friends
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs>
    </v-card>
    <v-dialog
      v-model="avatarModal"
      max-width="800"
    >
      <v-card>
        <v-carousel>
          <v-carousel-item
            v-for="(item,i) in userAvatars"
            :key="i"
            :src="'/media/avatar/'+item.path"
            reverse-transition="fade-transition"
            transition="fade-transition"
          ></v-carousel-item>
        </v-carousel>

      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex";

  export default {
    name: "user",
    data() {
      return {
        user: {},
        relation: {},
        avatarModal: false,
        userAvatars: [],
        userFriends:[],
        page:1
      }
    },
    methods: {
      async getUser(userId) {
        let token = this.$auth.getToken('local')

        await this.$axios.get('/user/' + userId).then(res => {
          this.user = res.data.data
        }).catch(error => {

        })
      },
      getGenderIcon(sentGender) {
        switch (sentGender) {
          case 'Male':
            return 'mdi-gender-male'
          case "Female":
            return 'mdi-gender-female'
          case "other":
            return 'mdi-gender-transgender'
          default:
            return 'mdi-account-question'

        }
      },
      async addFriend(targetUserId) {
        let self = this;
        let data = {
          targetUserId: targetUserId,
          senderId: this.loggedInUser.id,
        }
        await this.$axios.post('/friends/request/send', data).then(res => {
          self.setSnackColor("success");
          self.setSnack("Sent friend request");

        }).catch(error => {
          self.setSnackColor("error");
          self.setSnack("Something went wrong")
        })

      },
      checkUser(userId) {
        if (userId === this.loggedInUser.id) {
          this.$router.push({
            path: '/me'
          })
        } else {
          this.getRelationWithLoggedInUser(this.$route.query.id)
        }
      },
      async getRelationWithLoggedInUser(id) {
        let token = this.$auth.getToken('local')
        let data = {
          targetUserId: id,
          senderId: this.loggedInUser.user_id,
        }
        await this.$axios.post('/friends/relation', data).then(res => {
          this.relation = res.data.data
          this.getUserAvatars(this.$route.query.id)
          this.getUserFriends(this.$route.query.id)
        }).catch(error => {
          this.getUser(this.$route.query.id)

        })

      },
      async getUserAvatars(userId) {
        await this.$axios.get('/users/avatars/' + userId).then(res => {
          this.userAvatars = res.data.avatars
          console.log(res.data.avatars)
        }).catch(error => {
          console.log(error)
        })
      },
      async getUserFriends(id) {
        await this.$axios.get('/friends/all/' + id).then(res => {
          this.userFriends = res.data.data
        }).catch(error => {

        })
      },
      async acceptFriendRequest(userId) {
        let self = this;
        let data = {
          userId: userId,
        }
        await this.$axios.post('/friends/request/accept', data).then(res => {
          self.setSnackColor("success");
          self.setSnack("Accepted friend request");

        }).catch(error => {
          self.setSnackColor("error");
          self.setSnack("Something went wrong")
        })
      },
      async denyFriendRequest(id) {
      },
      async cancelFriendRequest(id) {

      },
      go: function (action) {
        this.$router.push({
          path: action
        })
      },
      ...mapMutations({
        setSnack: 'snackbar/setSnack',
        setSnackTop: 'snackbar/setSnackTop',
        setSnackColor: 'snackbar/setSnackColor'
      }),



    },
    watch: {
      '$route.query.id': function (id) {
        this.user = []
        this.relation = {}
        this.checkUser(this.$route.query.id)



      },
    },
    mounted() {
    },
    beforeMount() {
      this.checkUser(this.$route.query.id)


    },

    computed: {
      ...mapGetters(['isAuthenticated', 'loggedInUser']),

    }
  }
</script>

<style scoped>
  .buttons{
    position: relative;
    top:1rem;
  }
</style>
