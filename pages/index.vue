<template>
  <v-layout
    column
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
    <v-row>
      <v-col v-if="!this.$vuetify.breakpoint.mdAndDown">
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>
            <v-avatar style="margin-right: 0.2rem">
              <v-img :src="'/media/avatar/'+loggedInUser.avatar.path"/>
            </v-avatar>
            <p style="margin-left: 1rem; margin-bottom: 0;">{{loggedInUser.firstname + " " + loggedInUser.lastname}}</p>
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid">
              <v-textarea
                :label="this.formatString(this.$t('home_page.post_creation_card.greeting'), [loggedInUser.firstname])"
                v-model="postText"
                clearable
                counter
                maxlength="600"
                outlined
                single-line
                auto-grow
                no-resize
                :rules="postRules"

              >

              </v-textarea>
              <v-row>
                <v-col class="col-auto mr-auto" style="margin: 0 !important; padding: 0 1rem 1rem 1rem"   :key="index"
                       v-for="(f,index) in this.Files">
                  <v-card v-if="f.type.startsWith('video')">
                    <video style="width: 8rem; height: auto" :src="createUrl(f)" controls></video>

                    <v-btn @click="deleteFile(index)" icon>
                      <v-icon style="filter: drop-shadow(0px 0px 3px rgba(23,23,23,0.80));">mdi-delete</v-icon>
                    </v-btn>

                  </v-card>

                  <v-card
                    v-if="f.type.startsWith('image')"
                    style="width: 6rem; height: 6rem;">
                    <v-img style="width: 6rem; height: 6rem;" :src="createUrl(f)">
                      <v-btn @click="deleteFile(index)" style="margin-left: 4rem" icon>
                        <v-icon style="filter: drop-shadow(0px 0px 3px rgba(23,23,23,0.80));">mdi-delete</v-icon>
                      </v-btn>
                    </v-img>
                  </v-card>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <input
              type="file"
              style="display: none;"
              @change="onFileChange($event)"
              ref="imageUpload"
              accept=".png,.gif,.jpg,.jfif,.mp4"
            />
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <v-btn
                  v-on="on"
                  :disabled="ReachedLimit"
                  @click="$refs.imageUpload.click()"
                  icon
                >
                  <v-icon>mdi-image</v-icon>
                </v-btn>
              </template>
              <span>{{$t('home_page.post_creation_card.attach_file')}}</span>
            </v-tooltip>
            <twemoji-picker
              :emojiData="emojiDataAll"
              :emojiGroups="emojiGroups"
              @emojiUnicodeAdded="selectEmoji"
              :skinsSelection="false"
              :searchEmojisFeat="true"
              :searchEmojiPlaceholder="this.$t('emoji_picker.search_bar')"
              :searchEmojiNotFound="this.$t('emoji_picker.not_found')"
              :isLoadingLabel="this.$t('emoji_picker.loading')"
            ></twemoji-picker>
            <v-spacer>
            </v-spacer>
            <v-btn
              color="primary"
              :disabled="!valid"
              @click="createPost"
            >
              {{$t('home_page.post_creation_card.post_creation_button')}}
            </v-btn>
          </v-card-actions>

        </v-card>

        <v-list style="margin-top: 1rem;">

          <v-list-item>
            <v-list-item-title>{{$t('home_page.post_card.title')}}</v-list-item-title>
            <v-list-item-action>
              <v-menu
                :close-on-content-click="false"
                offset-y
                bottom
              >
                <template v-slot:activator="{ on }">
                  <v-btn v-on="on" icon>
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                </template>
                <v-list>

                  <!-- will figure out some other time -->
                  <v-list-item v-for="(item, index) in this.postSortSettings"  :key="index">
                    <v-list-item-title>{{item.name}}</v-list-item-title>
                    <v-list-item-action>
                      <v-radio @select="chooseSort(this.value)" value="true"></v-radio>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
          <v-skeleton-loader
            type="card, text, actions"
            v-if="!finishedLoading"
            loading
          ></v-skeleton-loader>
          <v-card onmouseenter="this.style.background = '#2b2b2a'" onmouseleave="this.style.background= ''"
                  style="margin-top: 1rem; margin-bottom: 1rem"  :id="posts.id"
                  v-for="(post,index) in posts" :key="index">
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
                     {{$t('home_page.post_card.post_menu.delete_post')}}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="post.poster.id === loggedInUser.id">
                    <v-list-item-title>
                      <v-icon>edit</v-icon>
                      {{$t('home_page.post_card.post_menu.edit_post')}}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item v-if="post.poster.id !== loggedInUser.id">
                    <v-list-item-title>   {{$t('home_page.post_card.post_menu.report')}} </v-list-item-title>
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
                  @click="dislikePost(post.id,post.poster.id)"
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
                  @click="likePost(post.id,post.poster.id)"
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
      </v-col>
      <v-col v-if="!this.$vuetify.breakpoint.mdAndDown"></v-col>

    </v-row>
  </v-layout>

</template>

<script>
    import twemoji from 'twemoji'
    import moment from 'moment'
    import {mapGetters, mapMutations} from "vuex";
    import {TwemojiPicker} from '@kevinfaguiar/vue-twemoji-picker';
    import EmojiAllData from '@kevinfaguiar/vue-twemoji-picker/emoji-data/en/emoji-all-groups.json';
    import EmojiGroups from '@kevinfaguiar/vue-twemoji-picker/emoji-data/emoji-groups.json';
    import {compile} from "../.nuxt/utils";

    export default {
        components: {
            'twemoji-picker': TwemojiPicker
        },
        data() {
            return {
                valid: true,
                dialog: false,
                overlayImg: '',
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
                postText: '',
                postRules: [
                    v => { return !!v || this.$t('home_page.post_creation_card.input_empty') },
                ],
                imageRules: [
                    v => !!v || 'Image file is required'
                ],
                imageFile: null,
                url: null,
                posts: [],
                Files: [],
                ReachedLimit: false,
                showEmojiPicker: false,
                finishedLoading: false
            }
        },
        methods: {
            showOverlay(img) {
                this.dialog = !this.dialog
                this.overlayImg = img
            },
            onFileChange(e) {
                if (e.target.files[0]) {
                    this.Files.push(e.target.files[0]);
                }
            },
            createUrl(file) {
                let url;

                if (file.type.startsWith('video')) {
                    const blob = new Blob(
                        [file],
                        {"type": file.type});
                    url = URL.createObjectURL(blob);

                }
                url = URL.createObjectURL(file);
                return url
            },
            deleteFile(index) {
                this.Files.splice(index, 1)
            },
            selectEmoji(emoji) {
                this.postText += emoji
            },
            parseEmoji(input) {
                let parsed = twemoji.parse(input)
                return parsed
            },
            async createPost() {
                const today = new Date();
                const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
                const time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                const dateTime = date + ' ' + time;
                let self = this;

                if (this.Files.length !== 0) {
                    const formData = new FormData()
                    formData.append("poster", this.loggedInUser.id)
                    formData.append("text", this.postText)
                    formData.append("create_time", dateTime)

                    this.Files.forEach(function (value, i) {
                        formData.append("file_" + i, value)
                    });
                    await this.$axios.post('post/create', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    }).then(r => {
                        this.postText = ''
                        this.Files = []
                        this.isValid = false;
                        self.setSnackColor("success");
                        this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'POST_CREATE', {sender: this.loggedInUser})
                        self.setSnack(this.$t('snackbar.success_messages.post_created'));
                    }).catch((e) => {
                        self.setSnackColor("error");
                        self.setSnack(e.response.data.message);
                    })

                } else {
                    let Data = {
                        "poster": this.loggedInUser.id,
                        "text": this.postText,
                        "create_time": dateTime,
                    }
                    await this.$axios.post('post/create', Data).then(r => {

                        self.setSnackColor("success");
                        this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'POST_CREATE', {sender: this.loggedInUser})
                        this.postText = ''
                        this.isValid = false;
                        self.setSnack("You post has successfully been created");

                    }).catch(e => {
                        self.setSnackColor("error");
                        self.setSnack(e.response.data.message);
                    })
                }
            },
            ...mapMutations({
                setSnack: 'snackbar/setSnack',
                setSnackTop: 'snackbar/setSnackTop',
                setSnackColor: 'snackbar/setSnackColor'
            }),
            async getPosts() {
                await this.$axios.get('/posts/get').then(res => {
                    this.posts = res.data.data
                    this.finishedLoading = true

                }).catch(error => {
                    this.posts = []
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

                }).catch(error => {
                    self.setSnackColor("error");
                    self.setSnack("Your post could not be deleted!");
                })
            },
            getFormattedDate(date) {
              return moment(date).locale(this.userLocale).format('DD-MM-YYYY HH:mm') + " : " + moment(date).locale(this.userLocale).fromNow()

            },
            go: function (action) {
                this.$router.push({
                    path: action
                })
            },
            chooseSort(value) {

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
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'NEW_NOTIFICATION', {sender: this.loggedInUser, targetUserId: userId})
                    this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'POST_LIKED', {sender: this.loggedInUser, postId: postId})
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
            updateElement(arr, propName, propValue, newData) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i][propName] === propValue) {
                        arr[i] = newData
                    }
                }
            },
            async getPost(postId) {
                await this.$axios.get('/post/get?id=' + postId).then(res => {
                    return res.data.data
                }).catch(error => {

                })
            },
            formatString(string, variables){
                return vsprintf(string,variables)
            }

        },
        mounted() {
            this.getPosts();
            this.$ws.$on('NEW_POST', (e) => this.getPosts())
            this.$ws.$on('POST_DELETE', (e) => this.getPosts())
            this.$ws.$on('POST_LIKED', (e) => this.getPosts())
            this.$ws.$on('POST_UNLIKED', (e) => this.getPosts())
            this.$ws.$on('POST_DISLIKED', (e) => this.getPosts())
            this.$ws.$on('POST_UNDISLIKED', (e) => this.getPosts())

        },
        watch: {
            'Files.length':

                function (newVal, oldVal) {
                    if (newVal >= 4) {
                        this.ReachedLimit = true;
                    } else if (newVal >= 0 && newVal < 4) {
                        this.ReachedLimit = false;

                    }
                }
        }
        ,
        computed: {
            emojiDataAll() {
                return EmojiAllData;
            }
            ,
            emojiGroups() {
                return EmojiGroups;
            }
            ,
            ...mapGetters(['isAuthenticated', 'loggedInUser',"userLocale"]),


        }
    }
</script>

<style scoped>
  #img {
    width: 60rem;
    height: auto;
    object-fit: cover;

  }

  </style>
