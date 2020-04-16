<template>
  <v-layout>
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
    <v-row>
      <v-col v-if="!this.$vuetify.breakpoint.mdAndDown"></v-col>
      <v-col>
        <v-card v-if="this.post.poster !== undefined">
          <v-card-title>
            <v-avatar>
              <v-img v-if="this.post.poster" :src="`/media/avatar/${this.post.poster.avatar.path}`"/>
            </v-avatar>
            <nuxt-link style="color: white; text-decoration: none;  margin-right: 1rem; margin-left: 1rem"
                       :to="'/user?id='+this.post.poster_id">{{this.post.poster.firstname + " " +
              this.post.poster.lastname}}
            </nuxt-link>
            <span style="font-size: 0.8rem">
                   {{getFormattedDate(this.post.dateposted)}}
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
                <v-list-item v-if="post.poster.id === loggedInUser.id">
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

          <v-card-text>
            <p v-html="parseEmoji(this.post.text)"></p>
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
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <div
              v-if="post.dislikes.filter(function(e) { return e.user_id === loggedInUser.id; }).length === 0"
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
              v-if="post.dislikes.filter(function(e) { return e.user_id === loggedInUser.id; }).length !== 0"
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
              v-if="post.likes.filter(function(e) { return e.user_id === loggedInUser.id; }).length === 0"
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
              v-if="post.likes.filter(function(e) { return e.user_id === loggedInUser.id; }).length !== 0"
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
        <v-card>
          <v-card-text>
            <v-form v-model="isValid">
              <v-text-field
                label="type comment..."
                v-model="commentContent"
                :rules="commentRules"
              >
              </v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <twemoji-picker
              :emojiData="emojiDataAll"
              :emojiGroups="emojiGroups"
              @emojiUnicodeAdded="selectEmoji"
              :skinsSelection="false"
              :searchEmojisFeat="true"
              searchEmojiPlaceholder="Search here."
              searchEmojiNotFound="Emojis not found."
              isLoadingLabel="Loading..."
            ></twemoji-picker>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!isValid"
              @click="createComment()"
            >
              comment post
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card>
          <v-list v-if="this.Comments.length !== 0">
            <v-list-item>
              <v-list-item-title>
                Comments
              </v-list-item-title>
            </v-list-item>
            <v-card style="margin-top: 1rem; margin-bottom: 1rem" v-key="comment.id"
                    v-for="(comment,index) in this.Comments">
              <v-card-title>
                <v-avatar>
                  <v-img :src="'/media/avatar/'+comment.user.avatar.path"></v-img>
                </v-avatar>
                <p style="margin-left: 1rem; margin-right: 1rem">{{comment.user.firstname + " " +
                  comment.user.lastname}}</p>
                <span style="font-size: 0.8rem">
                   {{getFormattedDate(comment.dateposted)}}
               </span>
              </v-card-title>
              <v-card-text v-html="parseEmoji(comment.comment_content)">

              </v-card-text>
            </v-card>
          </v-list>
          <v-card-text v-else>
            No comments! be the first one to create one
          </v-card-text>
        </v-card>
      </v-col>
      <v-col v-if="!this.$vuetify.breakpoint.mdAndDown"></v-col>
    </v-row>
  </v-layout>
</template>

<script>
    import moment from 'moment'
    import twemoji from 'twemoji'
    import {TwemojiPicker} from '@kevinfaguiar/vue-twemoji-picker';
    import EmojiAllData from '@kevinfaguiar/vue-twemoji-picker/emoji-data/en/emoji-all-groups.json';
    import EmojiGroups from '@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json';
    import {mapGetters, mapMutations} from "vuex";

    export default {
        name: "post",
        components: {
            'twemoji-picker': TwemojiPicker
        },
        data() {
            return {
                post: {},
                overlayImg: '',
                dialog: false,
                browserLang: '',
                isValid: false,
                commentContent: '',
                commentRules: [
                    v => !!v || 'cannot be empty'
                ],
                Comments: []
            }
        },
        mounted(){
            this.$ws.$on('POST_LIKED', (e) => this.getPost(this.$route.query.id))
            this.$ws.$on('POST_UNLIKED', (e) => this.getPost(this.$route.query.id))
            this.$ws.$on('POST_DISLIKED', (e) => this.getPost(this.$route.query.id))
            this.$ws.$on('POST_UNDISLIKED', (e) => this.getPost(this.$route.query.id))
            this.$ws.$on('POST_EDIT', (e) => this.getPost(this.$route.query.id))
            this.$ws.$on('COMMENT_CREATED', (e) => this.getComments(this.$route.query.id))
            this.$ws.$on('COMMENT_DELETED', (e) => this.getComments(this.$route.query.id))
            this.$ws.$on('COMMENT_EDIT', (e) => this.getComments(this.$route.query.id))



        },
        beforeMount() {
            this.getPost(this.$route.query.id)
            this.getBrowserLang()
        },
        methods: {
            selectEmoji(emoji) {
                this.commentContent += emoji
            },
            showOverlay(img) {
                this.dialog = !this.dialog
                this.overlayImg = img
            },
            async getPost(postId) {
                await this.$axios.get('/post/get?id=' + postId).then(res => {
                    this.post = res.data.data
                    this.getComments(postId)
                }).catch(error => {

                })
            },
            async getComments(postId) {
                await this.$axios.get('/post/comments/' + postId).then(res => {
                    this.Comments = res.data.data

                }).catch(error => {
                    this.Comments = []
                })
            },
            getFormattedDate(date) {
                return moment(date).locale(this.browserLang).fromNow();

            },
            getBrowserLang() {
                this.browserLang = navigator.language

            },
            parseEmoji(input) {
                return twemoji.parse(input)
            },
            async createComment() {
                self = this;
                const today = new Date();
                const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                const dateTime = date + ' ' + time;

                let data = {
                    'postId': this.$route.query.id,
                    'commentContent': this.commentContent,
                    'userId': this.loggedInUser.id,
                    'datePosted': dateTime
                }
                await this.$axios.post('/post/comment/create', data).then(res => {
                    self.setSnackColor("success");
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'COMMENT_CREATE', {sender: this.loggedInUser, postId: this.$route.query.id})
                    self.setSnack("You comment has successfully been created");
                }).catch(err => {
                    self.setSnackColor("error");
                    self.setSnack(err.response.data.message);
                })
            },
            async likePost(postId,senderId) {
                self = this
                const data = {
                    postId: postId,
                    userId: this.loggedInUser.id,
                    senderId: senderId
                }
                await this.$axios.post('/post/like', data).then(res => {
                    self.setSnackColor("success");
                    this.$ws.$emitToServer("event:default", 'ACCEPTED_INCOMING_REQUEST', {sender: this.loggedInUser.id, targetUserId: senderId})
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
            async dislikePost(postId,senderId) {
                self = this
                const data = {
                    postId: postId,
                    userId: this.loggedInUser.id,
                    senderId: senderId
                }
                await this.$axios.post('/post/dislike', data).then(res => {
                    self.setSnackColor("success");
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'POST_DISLIKED', {
                        sender: this.loggedInUser,
                        postId: postId
                    })
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
            ...mapMutations({
                setSnack: 'snackbar/setSnack',
                setSnackTop: 'snackbar/setSnackTop',
                setSnackColor: 'snackbar/setSnackColor'
            }),
        },
        computed: {
            emojiDataAll() {
                return EmojiAllData;
            },
            emojiGroups() {
                return EmojiGroups;
            },
            ...mapGetters(['isAuthenticated', 'loggedInUser']),

        }
    }
</script>

<style scoped></style>
