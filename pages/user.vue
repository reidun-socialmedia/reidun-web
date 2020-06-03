<template>
  <v-container>
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
    <v-card v-if="this.user.firstname === undefined">
      <v-card-title>
        error
      </v-card-title>
      <v-card>user could not be found!</v-card>
    </v-card>

    <v-card v-else-if="this.user.firstname !== undefined">
      <v-img width="1200" height="200"
             :src="this.user.headerimg !== undefined ? this.user.headerimg : 'defaultpost.jpg'"/>
      <v-card-title style="position:relative; z-index: 1; top: -50px;">
        <v-avatar @click="avatarModal = true" style="width: 6rem; height: 6rem; margin-right: 1rem">
          <v-img :src="'/media/avatar/'+this.user.avatar.path"/>
        </v-avatar>
        <p style="position:relative; top: 1rem">{{this.user.firstname + " " + this.user.lastname}}</p>
        <v-spacer></v-spacer>
        <div class="buttons">
          <v-btn
            v-if="user.privacy.who_can_add === 'friends_of_friends'"
          >
            pls add friends of friend function
          </v-btn>
          <v-btn
            v-if="user.privacy.who_can_add === 'everyone'  && relation.status === undefined"
            @click="addFriend(user.id)"

          >
            <v-icon>mdi-person-add</v-icon>
            {{this.$t("user_page.friend_request_buttons.add_friend")}}
          </v-btn>
          <v-btn
            v-else-if="user.privacy.who_can_add === 'everyone' && relation.status === 0 && relation.last_action_user_id === loggedInUser.id"
            @click="cancelFriendRequest(user.id)"
            color="error"
          >
            <v-icon>mdi-person-add</v-icon>
            {{this.$t("user_page.friend_request_buttons.cancel_request")}}
          </v-btn>
          <v-btn
            v-else-if="user.privacy.who_can_add === 'everyone' && relation.status === 0 && relation.last_action_user_id !== loggedInUser.id"
            @click="acceptFriendRequest(user.id)"
            color="primary"
          >
            {{this.$t("user_page.friend_request_buttons.accept_request")}}
          </v-btn>

          <v-btn
            v-if="user.privacy.who_can_add === 'everyone' && relation.status === 0 && relation.last_action_user_id !== loggedInUser.id"
            color="error"
            @click="denyFriendRequest(user.id)"
          >
            {{this.$t("user_page.friend_request_buttons.cancel_request")}}
          </v-btn>
          <v-menu offset-y bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                v-on="on"
              >
                <v-icon>
                  more_vert
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>
                  {{this.$t("user_page.user_menu.block")}}
                </v-list-item-title>
              </v-list-item>
              <v-list-item @click="removeFriend(user.id)" v-if="relation.status === 1">
                <v-list-item-title>
                  {{this.$t("user_page.user_menu.remove_friend")}}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

        </div>
      </v-card-title>
      <v-tabs
        fixed-tabs

      >
        <v-tab
          href="#tab-wall"
        >
          {{this.$t("user_page.tab_menu.wall")}}
        </v-tab>
        <v-tab
          href="#tab-about"
        >
          {{this.$t("user_page.tab_menu.about")}}
        </v-tab>
        <v-tab
          href="#tab-friends"
        >
          {{this.$t("user_page.tab_menu.friends")}}
        </v-tab>

        <v-tab-item
          value="tab-wall"
        >
          <div v-if="this.user.privacy.profile_privacy === 'everyone' ||  relation.status === 1 ">
            <v-card>
              <v-card-title>{{formatString(this.$t("user_page.Wall.title"),[this.user.firstname])}}</v-card-title>
            </v-card>
            <v-row>
              <v-col>
                <v-card v-if="userFiles.length === 0">
                  <v-card-title>
                    {{this.$t("user_page.Wall.files_posted")}}
                  </v-card-title>
                  <v-card-text>{{formatString(this.$t("user_page.Wall.no-files"),[this.user.firstname])}}</v-card-text>
                </v-card>
                <v-card v-if="userFiles.length !== 0">
                  <v-card-title>
                    {{formatString(this.$t("user_page.Wall.files_posted"),[this.user.firstname])}}
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
                <v-card>
                  <v-card-title>posts</v-card-title>
                  <v-list style="margin-top: 1rem; overflow-y: scroll">


                    <v-skeleton-loader
                      type="card, text, actions, card-avatar"
                      v-if="!finishedLoading"
                      loading
                    ></v-skeleton-loader>
                    <v-card
                      v-if="user.privacy.profile_privacy === 'everyone' || (user.privacy.profile_privacy === 'friends' && relation.status === 1)"
                      onmouseenter="this.style.background = '#2b2b2a'"
                      onmouseleave="this.style.background = ''"
                      style="margin-top: 1rem; margin-bottom: 1rem"
                      v-bind:key="post.id"
                      :id="posts.id"
                      v-for="post in posts"
                    >
                      <v-card-title>
                        <v-avatar>
                          <v-img v-if="post.poster" :src="`/media/avatar/${post.poster.avatar.path}`"/>
                        </v-avatar>
                        <nuxt-link style="color: white; text-decoration: none; margin-right: 1rem; margin-left: 1rem"
                                   :to="'/user?id='+post.poster.id">{{post.poster.firstname + " " +
                          post.poster.lastname}}
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
          <v-card v-else-if="this.user.privacy.profile_privacy !== 'everyone' ||  relation.status !== 1 ">
            <v-card-title>{{this.user.firstname + "'s"}} wall</v-card-title>
            <v-card-text>
              {{formatString(this.$t("user_page.Wall.not_friends_message"),[this.user.firstname])}}
            </v-card-text>
          </v-card>
        </v-tab-item>
        <v-tab-item value="tab-about">
          <v-card v-if="this.user.privacy.profile_privacy === 'everyone'  || relation.status === 1">
            <v-card-title>{{formatString(this.$t("user_page.About.title"),[this.user.firstname])}}</v-card-title>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon>email</v-icon>
                  {{this.$t("user_page.About.info.email")}}
                </v-list-item-title>
                <v-list-item-subtitle>{{this.user.email}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon>{{getGenderIcon(this.user.gender) }}</v-icon>
                  {{this.$t("user_page.About.info.gender")}}
                </v-list-item-title>
                <v-list-item-subtitle>{{this.user.gender}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  <v-icon>today</v-icon>
                  {{this.$t("user_page.About.info.birthday")}}
                </v-list-item-title>
                <v-list-item-subtitle>{{this.user.birthday}}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

          </v-card>
          <v-card v-else-if="this.user.privacy.profile_privacy !== 'everyone'  ||  relation.status !== 1">
            <v-card-title>{{formatString(this.$t("user_page.About.title"),[this.user.firstname])}}</v-card-title>
            <v-card-text>
              {{formatString(this.$t("user_page.About.not_friends_message"),[this.user.firstname])}}
            </v-card-text>
          </v-card>
        </v-tab-item>

        <v-tab-item value="tab-friends">
          <v-card v-if="this.user.privacy.profile_privacy === 'everyone'  ||  (this.user.privacy.profile_privacy === 'friends' && relation.status === 1)">
            <v-card-title>{{formatString(this.$t("user_page.Friends.title"),[this.user.firstname])}}</v-card-title>
            <v-list v-if="Object.keys(this.userFriends).length > 0">
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

            <v-card-text v-else>
              {{formatString(this.$t("user_page.Friends.user_no_friends"),[this.user.firstname])}}
            </v-card-text>

          </v-card>

          <v-card v-else-if="this.user.privacy.profile_privacy !== 'everyone'  ||  relation.status !== 1">
            <v-card-title>{{formatString(this.$t("user_page.Friends.title"),[this.user.firstname])}}</v-card-title>
            <v-card-text>
              {{formatString(this.$t("user_page.Friends.not_friends_message"),[this.user.firstname])}}
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
    import twemoji from 'twemoji'
    import moment from 'moment'
    import axios from "../.nuxt/axios";

    export default {
        name: "user",
        data() {
            return {
                user: {},
                relation: {},
                avatarModal: false,
                userAvatars: [],
                userFriends: [],
                page: 1,
                dialog: false,
                overlayImg: '',
                posts: [],
                finishedLoading: false,
                userFiles: []
            }
        },
        methods: {
            checkMutualFriends(){

                axios.post('/friends/relation',{targetUserIds:this.userFriends}).then(res => {

                })
            },
            async getUser(userId) {

                await this.$axios.get('/user/' + userId).then(res => {
                    this.user = res.data.data
                    console.log(this.user)
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
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'NEW_FRIEND_REQUEST', {
                        sender: this.loggedInUser,
                        targetUserId: targetUserId
                    })
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
                    if (res.status === 204){
                        this.getUser(this.$route.query.id)
                        this.getUserAvatars(this.$route.query.id)

                        this.relation = {}
                    }
                    else {
                        this.getUser(id)
                        this.getUserAvatars(id)
                        this.getUserPostFiles(id)
                    }
                    this.getUserPosts(id)
                    this.getUserFriends(id);


                }).catch(error => {

                })

            },
            async getUserPosts(userid) {
                await this.$axios.get('/post/user/' + userid).then(res => {
                    this.posts = res.data.data
                    console.log(this.posts)
                    this.finishedLoading = true
                }).catch(error => {

                })
            },
            async getUserAvatars(userId) {
                await this.$axios.get('/users/avatars/' + userId).then(res => {
                    this.userAvatars = res.data.avatars
                }).catch(error => {
                })
            },
            async getUserFriends(id) {
                await this.$axios.get('/friends/all/' + id).then(res => {
                    console.log()
                    this.userFriends = res.data.data
                }).catch(error => {

                })
            },
            async getUserPostFiles(id) {
                await this.$axios.get('/post/user/files/' + id).then(res => {
                    this.userFiles = res.data.data
                }).catch(error => {

                })
            },
            async acceptFriendRequest(userId) {
                let self = this;
                let data = {
                    senderId: userId,

                }
                await this.$axios.post('/friends/request/accept', data).then(res => {
                    self.setSnackColor("success");
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'ACCEPTED_INCOMING_REQUEST', {
                        sender: this.loggedInUser,
                        targetUserId: userId
                    })
                    self.setSnack("Accepted friend request");

                }).catch(error => {
                    self.setSnackColor("error");
                    self.setSnack("Something went wrong")
                })
            },
            async denyFriendRequest(id) {
                let self = this;
                let data = {
                    userId: id,
                }
                await this.$axios.post('/friends/request/deny', data).then(res => {
                    self.setSnackColor("success");
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'DENIED_INCOMING_REQUEST', {
                        sender: this.loggedInUser,
                        targetUserId: id
                    })
                    self.setSnack("Denied friend request");

                }).catch(error => {
                    self.setSnackColor("error");
                    self.setSnack("Something went wrong")
                })
            },
            cancelFriendRequest: async function (id) {
                let self = this;
                let data = {
                    userId: id,
                }
                await this.$axios.delete('/friends/request/cancel',
                    {
                        data: data
                    }
                ).then(res => {
                    self.setSnackColor("success");
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'CANCELLED_INCOMING_REQUEST', {
                        sender: this.loggedInUser,
                        targetUserId: id
                    })
                    self.setSnack("cancelled friend request");

                }).catch(error => {
                    self.setSnackColor("error");
                    self.setSnack("Something went wrong")
                })
            },
            removeFriend: async function (userID) {
                let self = this;
                let data = {
                    userId: userID,
                }
                await this.$axios.delete('/friend/delete',
                    {
                        data: data
                    }
                ).then(res => {
                    self.setSnackColor("success");
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'DELETED_FRIEND', {
                        sender: this.loggedInUser,
                        targetUserId: userID
                    })
                    self.setSnack("Denied friend request");

                }).catch(error => {
                    self.setSnackColor("error");
                    self.setSnack(error.message)
                })
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

            getFormattedDate(date) {
                return moment(date).locale(this.userLocale).fromNow()

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
            formatString(string, variables){
                return vsprintf(string,variables)
            }

        },
        watch: {
            '$route.query.id': function (id) {
                this.user = []
                this.relation = {}
                this.checkUser(this.$route.query.id)
            },
        },
        mounted() {
            this.$ws.$on('FRIEND_REQUEST_ACCEPTED', (e) => this.getRelationWithLoggedInUser(this.$route.query.id))
            this.$ws.$on('FRIEND_REQUEST_DENIED', (e) => this.getRelationWithLoggedInUser(this.$route.query.id))
            this.$ws.$on('FRIEND_REQUEST_CANCELLED', (e) => this.getRelationWithLoggedInUser(this.$route.query.id))
            this.$ws.$on('DELETED_FRIEND', (e) => this.getRelationWithLoggedInUser(this.$route.query.id))
            this.$ws.$on('SENT_REQUEST', (e) => this.getRelationWithLoggedInUser(this.$route.query.id))
            this.$ws.$on('POST_LIKED', (e) =>   this.getUserPosts(this.$route.query.id))
            this.$ws.$on('POST_UNLIKED', (e) => this.getUserPosts(this.$route.query.id))
            this.$ws.$on('POST_DISLIKED', (e) => this.getUserPosts(this.$route.query.id))
            this.$ws.$on('POST_UNDISLIKED', (e) => this.getUserPosts(this.$route.query.id))


        },
        beforeMount() {
            this.checkUser(this.$route.query.id)
        },

        computed: {
            ...mapGetters(['isAuthenticated', 'loggedInUser',"userLocale"]),

        }
    }
</script>

<style scoped>
  .buttons {
    position: relative;
    top: 1rem;
  }
</style>
