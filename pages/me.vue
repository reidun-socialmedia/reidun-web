<template>
  <div
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
      <v-img width="100%" height="200"  @mouseenter="editBanner = true"
             @mouseleave="editBanner = false"
             :src="'/media/user'+loggedInUser.banner.path">
        <v-btn style="margin: 2rem" v-show="editBanner" icon @click="bannerChangeDialog = true">
          <v-icon style="filter: drop-shadow(0px 0px 3px rgba(23,23,23,0.80));">edit</v-icon>
        </v-btn>

      </v-img>
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
          {{$t("session_user_page.tab_menu.wall")}}

        </v-tab>
        <v-tab
          href="#tab-about"

        >
          {{$t("session_user_page.tab_menu.about")}}


        </v-tab>
        <v-tab
          href="#tab-friends"
        >
         {{$t("session_user_page.tab_menu.friends")}}
        </v-tab>
        <v-tab-item
          value="tab-wall"
        >
          <div>
            <v-card>
              <v-card-title>{{$t("session_user_page.Wall.title")}}</v-card-title>
            </v-card>
            <v-row>
              <v-col v-if="this.$vuetify.breakpoint.mdAndUp">
                <v-card v-if="userFiles.length === 0">
                  <v-card-title>
                    {{$t("session_user_page.Wall.files_posted")}}
                  </v-card-title>
                  <v-card-text>{{$t("session_user_page.Wall.no-files")}}</v-card-text>
                </v-card>
                <v-card v-if="userFiles.length !== 0">
                  <v-card-title>
                    {{$t("session_user_page.Wall.files_posted")}}
                  </v-card-title>
                  <v-row>
                    <v-col class="col-auto mr-auto" style="margin: 0 !important; padding: 0 1rem 1rem 1rem"
                           :key="index"
                           v-for="(f,index) in userFiles">
                      <v-card
                        v-if="f.path.endsWith('.png') || f.path.endsWith('.jfif') || f.path.endsWith('.jpg') || f.path.endsWith('.jpeg') || f.path.endsWith('.gif')">
                        <v-img @click="showOverlay(f.path)" style="width: 6rem; height: 6rem"
                               :src="'/media/post/'+f.path"></v-img>

                      </v-card>
                      <v-card style="width: 20rem; height: auto" v-else-if="f.path.endsWith('.mp4')">
                        <video style="width: 20rem; height: auto" :src="'/media/post/'+f.path" controls></video>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
              <v-col>
                <div   v-if="this.$vuetify.breakpoint.smAndDown">
                  <v-card v-if="userFiles.length === 0">
                    <v-card-title>
                      {{$t("session_user_page.Wall.files_posted")}}
                    </v-card-title>
                    <v-card-text>{{$t("session_user_page.Wall.no-files")}}</v-card-text>
                  </v-card>
                  <v-card v-if="userFiles.length !== 0">
                    <v-card-title>
                      {{$t("session_user_page.Wall.files_posted")}}
                    </v-card-title>
                    <v-row>
                      <v-col class="col-auto mr-auto" style="margin: 0 !important; padding: 0 1rem 1rem 1rem"
                             :key="index"
                             v-for="(f,index) in userFiles">
                        <v-card
                          v-if="f.path.endsWith('.png') || f.path.endsWith('.jfif') || f.path.endsWith('.jpg') || f.path.endsWith('.jpeg') || f.path.endsWith('.gif')">
                          <v-img @click="showOverlay(f.path)" style="width: 6rem; height: 6rem"
                                 :src="'/media/post/'+f.path"></v-img>

                        </v-card>
                        <v-card style="width: 20rem; height: auto" v-else-if="f.path.endsWith('.mp4')">
                          <video style="width: 20rem; height: auto" :src="'/media/post/'+f.path" controls></video>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card>
                </div>
                <v-card>
                  <v-card-title>posts</v-card-title>
                  <v-list style="margin-top: 1rem; overflow-y: scroll">


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
                      :id="post.id"
                      v-for="post in Posts"
                    >
                      <v-card-title>
                        <v-avatar>
                          <v-img v-if="post.poster" :src="`/media/avatar/${post.poster.avatar.path}`"/>
                        </v-avatar>
                        <nuxt-link :class="[$vuetify.theme.dark ? 'theme--dark post-title' : 'theme--light post-title']"
                                   :to="'/user?id='+post.poster.id">{{post.poster.firstname + " " +
                          post.poster.lastname}}
                        </nuxt-link>
                        <span style="font-size: 0.8rem; color: #c7c5c7">
                             {{getFormattedDate(post.dateposted)}}
                          <span v-if="post.edited === 1">(Edited)</span>
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
                                {{$t("home_page.post_card.delete_post")}}
                              </v-list-item-title>
                            </v-list-item>
                            <v-list-item v-if="post.poster.id === loggedInUser.id">
                              <v-list-item-title>
                                <v-icon>edit</v-icon>
                                edit post
                              </v-list-item-title>
                            </v-list-item>
                            <v-list-item v-if="post.poster.id !== loggedInUser.id">
                              <v-list-item-title>{{$t("home_page.post_card.report")}}</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </v-card-title>

                      <v-card-text @click="go('/post?id='+post.id)">
                        <p v-html="parseEmoji(post.text)"></p>
                      </v-card-text>
                      <v-row v-if="post.post_files.length !== 0">
                        <v-col class="col-auto mr-auto" style="margin: 0 !important; padding: 0 1rem 1rem 1rem"
                               :key="index"
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
                        <div
                          v-if="post.dislikes.filter(function(e) { return e.user.id === loggedInUser.id; }).length === 0"
                        >
                          <v-btn
                            @click="dislikePost(post.id)"
                            icon
                          >
                            <v-icon>thumb_down_alt</v-icon>
                          </v-btn>
                          {{post.dislikes.length}}
                        </div>
                        <div
                          v-if="post.dislikes.filter(function(e) { return e.user.id === loggedInUser.id; }).length !== 0"
                        >
                          <v-btn
                            @click="undislikePost(post.id)"
                            icon
                            color="primary"
                          >
                            <v-icon>thumb_down_alt</v-icon>
                          </v-btn>
                          {{post.dislikes.length}}
                        </div>
                        <div
                          v-if="post.likes.filter(function(e) { return e.user.id === loggedInUser.id; }).length === 0"
                        >
                          <v-btn
                            icon
                            @click="likePost(post.id)"
                          >
                            <v-icon>thumb_up_alt</v-icon>
                          </v-btn>
                          {{post.likes.length}}
                        </div>
                        <div
                          v-if="post.likes.filter(function(e) { return e.user.id === loggedInUser.id; }).length !== 0"
                        >
                          <v-btn
                            icon
                            color="success"
                            @click="unlikePost(post.id)"
                          >
                            <v-icon>thumb_up_alt</v-icon>
                          </v-btn>
                          {{post.likes.length }}
                        </div>
                      </v-card-actions>
                    </v-card>
                  </v-list>
                </v-card>
              </v-col>

            </v-row>
          </div>
        </v-tab-item>
        <v-tab-item value="tab-about">
          <v-card>
            <v-card-title>{{$t('session_user_page.About.title')}}</v-card-title>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon>email</v-icon>
                  {{$t('session_user_page.About.info.email')}}
                </v-list-item-title>
                <v-list-item-subtitle>{{loggedInUser.email}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon>{{getGenderIcon(loggedInUser.gender) }}</v-icon>
                  {{$t('session_user_page.About.info.gender')}}
                </v-list-item-title>
                <v-list-item-subtitle>{{loggedInUser.gender}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon>today</v-icon>
                  {{$t('session_user_page.About.info.birthday')}}
                </v-list-item-title>
                <v-list-item-subtitle>{{loggedInUser.birthday}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

          </v-card>
        </v-tab-item>

        <v-tab-item value="tab-friends">
          <v-card>
            <v-card-title>{{this.$t('session_user_page.Friends.title')}}</v-card-title>
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
            <v-card-text v-else v-html="parseEmoji(this.$t('session_user_page.Friends.no-friends'))"></v-card-text>
          </v-card>
        </v-tab-item>

      </v-tabs>
    </v-card>

    <!-- Background -->
    <v-dialog
      v-model="bannerChangeDialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="headline">Change Banner</v-card-title>

        <v-card-text>
          <p>Upload a image file, png, gif, jpg</p>
          <v-file-input
            label="Choose image"
            v-model="bannerFile"
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
            @click="bannerChangeDialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="green darken-1"
            text
            @click="changeBanner(bannerFile)"
          >
            Save as Banner
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Avatar -->
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
  </div>
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
                editBanner: false,
                avatarChangeDialog: false,
                bannerChangeDialog: false,
                imageRules: [
                    v => !!v || 'Image file is required'
                ],
                imageFile: null,
                bannerFile: null,
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
                Posts: [],
                finishedLoading: false,
                userFiles: []

            }
        },
        methods: {
            async getUserPostFiles(id) {
                await this.$axios.get('/post/user/files/' + id).then(res => {
                    this.userFiles = res.data.data
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
                    }).then(res => {
                        this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'AVATAR_UPDATED', {sender: this.loggedInUser})
                        this.avatarChangeDialog = false
                        self.setSnackColor("success");
                        self.setSnack("You have successfully changed avatar");
                    })

                } catch (e) {
                    self.setSnackColor("error");
                    self.setSnack("Failed to change avatar");
                }
            },
            async changeBanner(bannerFile) {
                const formData = new FormData();
                formData.append("userid", this.loggedInUser.id)
                formData.append("image", bannerFile);
                let self = this;
                try {
                    await this.$axios.post('user/changebanner', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(res => {
                        this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'BANNER_UPDATED', {
                            sender: this.loggedInUser
                        })

                        this.bannerChangeDialog = false
                        self.setSnackColor("success");
                        self.setSnack("You have successfully changed banner");
                    })

                } catch (e) {
                    self.setSnackColor("error");
                    self.setSnack("Failed to change banner");
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
                return moment(date).locale(this.userLocale).fromNow()

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
                return twemoji.parse(input)
            },
            async likePost(postId,userId) {
                self = this
                const data = {
                    postId: postId,
                    userId: userId,
                    senderId: this.loggedInUser.id
                }
                await this.$axios.post('/post/like', data).then(res => {
                    self.setSnackColor("success");
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'POST_LIKED', {sender: this.loggedInUser, postId: postId})
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'NEW_NOTIFICATION', {sender: this.loggedInUser, targetUserId: userId})
                    self.setSnack("liked post");

                }).catch(error => {
                    self.setSnackColor("error");
                    self.setSnack("could not like post");
                })
            },
            async unlikePost(postId) {
                self = this
                await this.$axios.delete('/post/unlike', {
                    data: {
                        postId: postId,
                        userId: this.loggedInUser.id
                    }
                }).then(res => {
                    self.setSnackColor("success");
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'POST_UNLIKED', {sender: this.loggedInUser, postId: postId})
                    self.setSnack("un-liked post");

                }).catch(error => {
                    self.setSnackColor("error");
                    self.setSnack("could not un-like post");

                })
            },
            async dislikePost(postId,userId) {
                self = this
                const data = {
                    postId: postId,
                    userId: userId,
                    senderId: this.loggedInUser.id
                }
                await this.$axios.post('/post/dislike', data).then(res => {
                    self.setSnackColor("success");
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'POST_DISLIKED', {
                        sender: this.loggedInUser,
                        postId: postId
                    })
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'NEW_NOTIFICATION', {sender: this.loggedInUser, targetUserId: userId})
                    self.setSnack("disliked post");

                }).catch(error => {

                    self.setSnackColor("error");
                    self.setSnack("could not dislike post");

                })
            },
            async undislikePost(postId) {
                self = this
                const data = {
                    postId: postId,
                    userId: this.loggedInUser.id
                }
                await this.$axios.delete('/post/undislike', {
                    data: {
                        postId: postId,
                        userId: this.loggedInUser.id
                    }
                }).then(res => {
                    self.setSnackColor("success");
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'POST_UNDISLIKED', {
                        sender: this.loggedInUser,
                        postId: postId
                    })
                    self.setSnack("un-disliked post");

                }).catch(error => {
                    self.setSnackColor("error");
                    self.setSnack("could not un-dislike post");
                })
            },
            async getUser(){
                await this.$axios.get(`/user`).then(res => {

                    this.$store.commit('UpdateUser',res.data.data)
                })
            }
        },
        beforeMount() {
            this.getUserFriends(this.loggedInUser.id)
            this.getUserPostFiles(this.loggedInUser.id)
            this.getUserPosts(this.loggedInUser.id)

        },
        mounted(){
        this.$ws.$on('POST_LIKED', (e) => this.getUserPosts(this.loggedInUser.id))
        this.$ws.$on('POST_UNLIKED', (e) => this.getUserPosts(this.loggedInUser.id))
        this.$ws.$on('POST_DISLIKED', (e) => this.getUserPosts(this.loggedInUser.id))
        this.$ws.$on('POST_UNDISLIKED', (e) => this.getUserPosts(this.loggedInUser.id))
            this.$ws.$on('BANNER_UPDATED', (e) => this.getUser(this.loggedInUser.id))
            this.$ws.$on('AVATAR_UPDATED', (e) => this.getUser(this.loggedInUser.id))


        },
        computed: {
            ...mapGetters(['isAuthenticated', 'loggedInUser',"userLocale"]),

        }
    }
</script>

<style scoped>

</style>
