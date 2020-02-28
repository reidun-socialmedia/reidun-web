<template>
  <v-container>
    <v-card>
      <v-img width="1200" height="200"
             :src="loggedInUser.headerimg !== undefined ? loggedInUser.headerimg : 'defaultpost.jpg'"/>
      <v-card-title style="position:relative; z-index: 1; top: -50px; ">
        <v-avatar style="width: 6rem; height: 6rem; margin-right: 0.2rem" @mouseenter="editIcon = true" @mouseleave="editIcon = false">
          <v-img  :src="'/media/avatar/'+loggedInUser.avatar.path">
            <v-btn style="margin: 1rem" v-show="editIcon" icon @click="avatarChangeDialog = true">
              <v-icon>edit</v-icon>
            </v-btn>
          </v-img>
        </v-avatar>
        <p style="position:relative; top: 1rem">{{loggedInUser.firstname + " " + loggedInUser.lastname}}</p>
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
          <v-card>
            <v-card-title>your wall</v-card-title>
          </v-card>
        </v-tab-item>
        <v-tab-item value="tab-about">
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

        <v-tab-item value="tab-friends">
          <v-card>
            <v-card-title>your friends</v-card-title>
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
          </v-card>
        </v-tab-item>

      </v-tabs>
    </v-card>
    <v-dialog
      v-model="avatarChangeDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Change Avatar</v-card-title>

        <v-card-text>
          <p>Upload a image file, png, gif, jpg</p>
          <v-file-input
            label="Choose image"
            v-model="imageFile"
            show-size
            accept=".png,.gif,.jpg,.jfif"
            :rules="imageRules"
          ></v-file-input>

        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="avatarChangeDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="changeAvatar(imageFile)"
          >
            Save Avatar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex";

  export default {
    name: "me",
    data() {
      return {
        editIcon: false,
        avatarChangeDialog: false,
        imageRules: [
          v => !!v || 'Image file is required'
        ],
        imageFile: null,
        userFriends: []
      }
    },
    methods: {
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
      go: function (action) {
        this.$router.push({
          path: action
        })
      },
      async changeAvatar(avatarFile) {
        const formData = new FormData();
        formData.append("userid", this.loggedInUser.id)
        formData.append("image", avatarFile);
        let self = this;
        try {
          await this.$axios.post('user/changeavatar', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })
          this.avatarChangeDialog = false
          self.setSnackColor("success");
          self.setSnack("You have successfully changed avatar, however you need to reload page or login again to see effect");
        } catch (e) {
          self.setSnackColor("error");
          self.setSnack(e.response.data.message);
        }
      },
      ...mapMutations({
        setSnack: 'snackbar/setSnack',
        setSnackTop: 'snackbar/setSnackTop',
        setSnackColor: 'snackbar/setSnackColor'
      }),
      onFileChange(e) {
        this.imageFile = e.target.files || e.dataTransfer.files;
      },
     async getUserFriends(userid) {
        await this.$axios.get('/friends/all/' + userid).then(res => {
          this.userFriends = res.data.data
        }).catch(error => {

        })
      }
    },
    beforeMount() {
      this.getUserFriends(this.loggedInUser.id)

    },
    computed: {
      ...mapGetters(['isAuthenticated', 'loggedInUser']),

    }
  }
</script>

<style scoped>

</style>
