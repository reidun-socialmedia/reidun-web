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
    <v-row style="max-width: 100%">
      <v-col v-if="!this.$vuetify.breakpoint.mdAndDown"></v-col>
      <v-col>
        <v-card v-if="this.post.poster !== undefined" >
          <v-card-title>
            <v-avatar>
              <v-img v-if="this.post.poster" :src="`/media/avatar/${this.post.poster.avatar.path}`"/>
            </v-avatar>
            <nuxt-link :class="[this.$vuetify.theme.dark ? 'theme--dark post-title' : 'theme--light post-title']"
                       :to="'/user?id='+this.post.poster_id">{{this.post.poster.firstname + " " +
              this.post.poster.lastname}}
            </nuxt-link>
            <span style="font-size: 0.8rem; color: #c7c5c7">
                   {{getFormattedDate(this.post.dateposted)}}
              <span v-if="this.post.edited === 1">(Edited)</span>
        </span>
            <v-spacer>
            </v-spacer>


            <!-- delete and edit post -->
            <v-menu offset-y bottom>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon>
                  <v-icon>more_vert</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item v-if="post.poster.id === loggedInUser.id" @click="deletePost(post.id)">
                  <v-list-item-title>
                    <v-icon>mdi-delete</v-icon>
                    {{$t('post_page.post_card.post_menu.delete_post')}}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item v-if="post.poster.id === loggedInUser.id" @click="editPostState = true">
                  <v-list-item-title>
                    <v-icon>edit</v-icon>
                    {{$t('post_page.post_card.post_menu.edit_post')}}
                  </v-list-item-title>
                </v-list-item>
                <v-list-item v-if="post.poster.id !== loggedInUser.id">
                  <v-list-item-title>{{$t('post_page.post_card.post_menu.report')}}</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>

          </v-card-title>

          <v-card-text >
            <div v-if="!editPostState">
              <p v-html="parsePost(this.post.text)"></p>

            </div>
            <div v-else>
              <v-textarea

                v-model="editPostInput"

                counter
                maxlength="600"
                outlined
                single-line
                auto-grow
                no-resize
                :rules="postRules"

              >

              </v-textarea>
              <v-btn @click="saveEditedPost(post.id)">{{$t('post_page.post_card.save_button')}}</v-btn>
              <v-btn @click="cancelPostEdit()">{{$t('post_page.post_card.cancel_button')}}</v-btn>

            </div>
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
            <v-form v-model="isValid" ref="createCommentForm">
              <v-textarea
                :label="this.$t('post_page.comment_creation_card.comment_input.label')"
                v-model="commentContent"
                counter
                maxlength="255"
                outlined
                single-line
                :rules="commentRules"




              >
              </v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <twemoji-picker
              :emojiData="emojiDataAll"
              :emojiGroups="emojiGroups"
              @emojiUnicodeAdded="selectEmoji"
              :searchEmojisFeat="true"
              :searchEmojiPlaceholder="this.$t('emoji_picker.search_bar')"
              :searchEmojiNotFound="this.$t('emoji_picker.not_found')"
              :isLoadingLabel="this.$t('emoji_picker.comment_input.loading')"
            ></twemoji-picker>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="!isValid"
              @click="createComment()"
            >
              {{$t('post_page.comment_creation_card.create_button.label')}}
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card>
          <v-list v-if="this.Comments.length !== 0">
            <v-list-item>
              <v-list-item-title>

                {{$t('post_page.comment_creation_card.comment_input.label')}}

              </v-list-item-title>

            </v-list-item>
            <v-card style="margin-top: 1rem; margin-bottom: 1rem" :key="index"
                    v-for="(comment,index) in this.Comments" >
              <v-card-title>
                <v-avatar>
                  <v-img :src="'/media/avatar/'+comment.user.avatar.path"></v-img>
                </v-avatar>
                <p style="margin-left: 1rem; margin-right: 1rem">{{comment.user.firstname + " " +
                  comment.user.lastname}}</p>
                <span style="font-size: 0.8rem; color: #c7c5c7">
                   {{getFormattedDate(comment.dateposted)}}
                  <span v-if="comment.edited === 1">(Edited)</span>
               </span>


                <v-spacer></v-spacer>

                <!-- Delete and Edit Comment -->

                <v-menu offset-y bottom v-if="comment.user.id === loggedInUser.id">
                  <template v-slot:activator="{ on }">
                    <v-btn v-on="on" icon>
                      <v-icon>more_vert</v-icon>
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click="deleteComment(comment.id)">
                      <v-list-item-title>
                        <v-icon>mdi-delete</v-icon>
                        {{$t('post_page.comments_card.comment_menu.delete_comment')}}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="editChosenCommentId = comment.id, editCommentInputField = comment.comment_content">
                      <v-list-item-title>
                        <v-icon>edit</v-icon>
                        {{$t('post_page.comments_card.comment_menu.edit_comment')}}
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item v-if="comment.user.id !== loggedInUser.id">
                      <v-list-item-title>{{$t('post_page.comments_card.comment_menu.report_comment')}}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>

              </v-card-title>

              <v-card-text  v-if="editChosenCommentId !== comment.id" v-html="parsePost(comment.comment_content)"></v-card-text>
              <div v-else>
                <v-textarea

                  v-model="editCommentInputField"

                  counter
                  maxlength="255"
                  outlined
                  single-line
                  auto-grow
                  no-resize
                  :rules="commentRules"

                >

                </v-textarea>
                <v-btn @click="saveEditedComment(comment.id)">{{$t('post_page.post_card.save_button')}}</v-btn>
                <v-btn @click="cancelCommentEdit()">{{$t('post_page.post_card.cancel_button')}}</v-btn>
              </div>
            </v-card>
          </v-list>
          <v-card-text v-else>
            {{$t('post_page.comments_card.no_comments')}}
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
    import axios from "../.nuxt/axios";

    import XRegExp from 'xregexp'
    export default {
        name: "post",
        components: {

            'twemoji-picker': TwemojiPicker
        },
        data() {
            return {
                post: {},
                editChosenCommentId:'',
                editCommentInputField:'',
                editPostInput:'',
                editPostState: false,
                overlayImg: '',
                dialog: false,
                isValid: false,
                commentContent: '',
                commentRules: [
                    v =>{ return !!v || this.$t("post_page.comment_creation_card.comment_input.input_empty") }
                ],
                postRules: [
                    v => { return !!v || this.$t('home_page.post_creation_card.input_empty') },
                ],
                Comments: []
            }
        },
        mounted(){
            this.$ws.$on('POST_LIKED', (e) => this.getPost(this.$route.query.id))
            this.$ws.$on('POST_UNLIKED', (e) => this.getPost(this.$route.query.id))
            this.$ws.$on('POST_DISLIKED', (e) => this.getPost(this.$route.query.id))
            this.$ws.$on('POST_UNDISLIKED', (e) => this.getPost(this.$route.query.id))
            this.$ws.$on('POST_EDITED', (e) => this.getPost(this.$route.query.id))
            this.$ws.$on('COMMENT_CREATED', (e) => this.getComments(this.$route.query.id))
            this.$ws.$on('COMMENT_DELETED', (e) => this.getComments(this.$route.query.id))
            this.$ws.$on('COMMENT_EDITED', (e) => this.getComments(this.$route.query.id))
            console.log()


        },
        beforeMount() {
            this.getPost(this.$route.query.id)
        },
        methods: {
            deleteComment(commentId){

                console.log(commentId)
                let data = {
                    commentId:commentId
                }


                this.$axios.delete('/post/comments/delete',{data}).then(res => {
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'COMMENT_DELETE', {sender: this.loggedInUser})
                    self.setSnackColor("success");
                    self.setSnack("Your post has successfully been deleted");
                }).catch(error => {
                    self = this
                    self.setSnackColor("error");
                    self.setSnack("Your comment could not be deleted!");
                })
            },
            cancelCommentEdit(){
                this.editChosenCommentId = 'NoId';

            },
            saveEditedComment(commentId){

                let sanitizedComment = this.$sanitize(this.editCommentInputField)
                let data = {
                    commentId: commentId,
                    newText: sanitizedComment
                }


                this.$axios.patch('/post/comments/update',data).then(res => {
                    this.editChosenCommentId = 'NoId';

                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'COMMENT_EDIT', {sender: this.loggedInUser})

                }).catch(error => {
                    self = this
                    self.setSnackColor("error");
                    self.setSnack("Your comment could not be edited!");
                })
            },
            cancelPostEdit(){
                this.editPostInput = this.post.text;
                this.editPostState = false;
            },
            async saveEditedPost(postId){
                let sanitizedPost = this.$sanitize(this.editPostInput)
                let data = {
                    postId: postId,
                    userId: this.loggedInUser.id,
                    newText: sanitizedPost
                }

                await this.$axios.patch('/post/update',data).then(res => {
                    this.editPostState = false;
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'POST_EDIT', {sender: this.loggedInUser})

                }).catch(error => {
                    self = this
                    self.setSnackColor("error");
                    self.setSnack("Your post could not be edited!");

                })
            },
            async deletePost(postId) {
                self = this
                await this.$axios.delete('/post/delete', {
                    data: {
                        postId: postId
                    }
                }).then(res => {
                    self.setSnackColor("success");
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'POST_DELETE', {sender: this.loggedInUser})
                    self.setSnack("Your post has successfully been deleted");
                    this.$router.push({
                        path: '/'
                    })
                }).catch(error => {
                    console.log(error)
                    self.setSnackColor("error");
                    self.setSnack("Your post could not be deleted!");
                })
            },
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
                    this.editPostInput = this.post.text
                    this.getComments(postId)
                }).catch(error => {

                })
            },
            async getComments(postId) {
                await this.$axios.get('/post/comments/' + postId).then(res => {
                    this.Comments = res.data.data
                    console.log(this.Comments)

                }).catch(error => {
                    this.Comments = []
                })
            },
            getFormattedDate(date) {
                return moment(date).locale(this.userLocale).fromNow();

            },
            parseLink(input){
                let regex = XRegExp("(http|https)://([\\w_-]+(?:(?:\\.[\\w_-]+)+))([\\w.,@?^=%&:\/~+#-]*[\\w@?^=%&\/~+#-])");
                return XRegExp.replace(input,regex, (match) => {
                    return `<a target="_blank" href="${match}">${match}</a>`;
                },'all')
            },
            parseEmoji(input){
                return twemoji.parse(input)
            },
            parsePost(input){
                input = this.parseLink(input)
                input = this.parseEmoji(input)
                return input
            },
            async createComment() {
                self = this;
                const today = new Date();
                const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                const dateTime = date + ' ' + time;
                let sanitizedComment = this.$sanitize(this.commentContent)
                let data = {
                    'postId': this.$route.query.id,
                    'commentContent': sanitizedComment,
                    'userId': this.loggedInUser.id,
                    'datePosted': dateTime
                }
                await this.$axios.post('/post/comment/create', data).then(res => {
                    this.$refs.createCommentForm.reset()
                    self.setSnackColor("success");
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'COMMENT_CREATE', {sender: this.loggedInUser, postId: this.$route.query.id})
                    self.setSnack("You comment has successfully been created");
                }).catch(err => {
                    self.setSnackColor("error");
                    self.setSnack(err.response.data.message);
                })
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
                    this.$ws.$emitToServer("event:default", 'POST_LIKED', {sender: this.loggedInUser.id, targetUserId: userId})
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
                    userId: userId ,
                    senderId: this.loggedInUser.id
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
            ...mapGetters(['isAuthenticated', 'loggedInUser','userLocale']),

        }
    }
</script>

<style scoped></style>
