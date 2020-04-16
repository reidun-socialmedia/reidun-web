<template>
  <v-container
  >
    <v-dialog
      v-model="dialog"
      scrollable
    >
      <v-sheet>
        <v-btn
          icon
          @click="dialog = false"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-sheet>
      <v-img id="img" :src="'/media/post/'+overlayImg"/>

    </v-dialog>
    <v-card>
      <v-img width="1200" height="200"
             :src="loggedInUser.headerimg !== undefined ? loggedInUser.headerimg : 'defaultpost.jpg'"/>
      <v-card-title style="position:relative; z-index: 1; top: -50px; ">
        <v-avatar style="width: 6rem; height: 6rem; margin-right: 0.2rem" @mouseenter="editIcon = true"
                  @mouseleave="editIcon = false">
          <v-img :src="'/media/avatar/'+loggedInUser.avatar.path">
            <v-btn style="margin: 2rem" v-show="editIcon" icon @click="avatarChangeDialog = true">
              <v-icon style="filter: drop-shadow(0px 0px 3px rgba(23,23,23,0.80));">edit</v-icon>
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
          <v-row>
            <v-col>

            </v-col>
            <v-col>
              <v-list style="margin-top: 1rem;">

                <v-list-item>
                  <v-list-item-title>posts</v-list-item-title>
                </v-list-item>
                <v-skeleton-loader
                  type="card, text, actions, card-avatar"
                  v-if="!finishedLoading"
                  loading
                ></v-skeleton-loader>
                <v-card
                  onmouseenter="this.style.background = '#2b2b2a'"
                  onmouseleave="this.style.background = ''"
                  style="margin-top: 1rem; margin-bottom: 1rem"
                  v-bind:key="post.id"
                  :id="posts.id"
                  v-for="post in Posts"
                >
                  <v-card-title>
                    <v-avatar>
                      <v-img v-if="post.poster" :src="`/media/avatar/${post.poster.avatar.path}`"/>
                    </v-avatar>
                    <nuxt-link style="color: white; text-decoration: none; margin-right: 1rem; margin-left: 1rem"
                               :to="'/user?id='+post.poster.id">{{post.poster.firstname + " " + post.poster.lastname}}
                    </nuxt-link>
                    <span style="font-size: 0.8rem; color: #c7c5c7">
                   {{getFormattedDate(post.dateposted)}}
               </span>
                    <v-spacer>
                    </v-spacer>
                    <v-menu offset-y bottom>
                      <template v-slot:activator="{ on }">
                        <v-btn v-on="on" icon>
                          <v-icon>more_vert</v-icon>
                        </v-btn>
                      </template>
                      <v-list>
                        <v-list-item @click="deletePost(post.id)" v-if="post.poster.id === loggedInUser.id">
                          <v-list-item-title>
                            <v-icon>mdi-delete</v-icon>
                            delete post
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="post.poster.id === loggedInUser.id">
                          <v-list-item-title>
                            <v-icon>edit</v-icon>
                            edit post
                          </v-list-item-title>
                        </v-list-item>
                        <v-list-item v-if="post.poster.id !== loggedInUser.id">
                          <v-list-item-title>report post</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-card-title>

                  <v-card-text @click="go('/post?id='+post.id)">
                    <p v-html="parseEmoji(post.text)"></p>
                  </v-card-text>
                  <v-row v-if="post.post_files.length !== 0">
                    <v-col class="col-auto mr-auto" style="margin: 0 !important; padding: 0 1rem 1rem 1rem"
                           v-for="(f,index) in post.post_files">
                      <v-card
                        v-if="f.path.endsWith('.png') || f.path.endsWith('.jfif') || f.path.endsWith('.jpg') || f.path.endsWith('.jpeg') || f.path.endsWith('.gif')">
                        <v-img @click="showOverlay(f.path)" style="width: 12rem; height: 12rem"
                               :src="'/media/post/'+f.path"></v-img>

                      </v-card>
                      <v-card style="width: 20rem; height: auto" v-else-if="f.path.endsWith('.mp4')">
                        <video style="width: 20rem; height: auto" :src="'/media/post/'+f.path" controls></video>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-card-actions>

                    <v-spacer/>
                    <v-btn @click="go('/post?id='+post.id)" icon>
                      <v-icon>mdi-comment-text</v-icon>
                      {{post.comments}}
                    </v-btn>
                    <v-btn
                      color="error"
                      @click="likePost(id)"
                      icon
                    >
                      <v-icon>thumb_down_alt</v-icon>
                      {{post.likes.length}}
                    </v-btn>
                    <v-btn
                      color="success"
                      icon
                    >
                      <v-icon>thumb_up_alt</v-icon>
                      {{post.likes.length}}
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-list>
            </v-col>

          </v-row>
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
            <v-list v-if="userFriends.length !== 0">
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
            <v-card-text v-else> you don't have any friends</v-card-text>
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
    import twemoji from 'twemoji'
    import moment from 'moment'

    export default {
        name: "me",
        data: function () {
            return {
                editIcon: false,
                avatarChangeDialog: false,
                imageRules: [
                    v => !!v || 'Image file is required'
                ],
                imageFile: null,
                sorting: 'sort_by_date',
                postSortSettings: [
                    {
                        id: 'sort_by_date',
                        name: 'Sort by Date',
                        enabled: true,
                    },
                    {
                        id: 'sort_by_likes',
                        name: 'Sort by Likes',
                        enabled: false,
                    }
                ],
                userFriends: [],
                dialog: false,
                overlayImg: '',
                posts: [],
                browserLang: '',
                finishedLoading: false
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
                    self.setSnack("You have successfully changed avatar, however you need to reload page");
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
                    this.getUserPosts(userid)
                }).catch(error => {

                })
            },
            getFormattedDate(date) {
                return moment(date).locale(this.browserLang).fromNow()

            },
            getBrowserLang() {
                this.browserLang = navigator.language

            },
            async getUserPosts(userid) {
                await this.$axios.get('/post/user/' + userid).then(res => {
                    this.Posts = res.data.data
                    this.finishedLoading = true
                }).catch(error => {

                })
            },
            showOverlay(img) {
                this.dialog = !this.dialog
                this.overlayImg = img

            },
            parseEmoji(input) {
                let parsed = twemoji.parse(input)
                return parsed
            },
            async likePost(id) {
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
