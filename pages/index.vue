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
      <v-img id="img" :src="overlayImg"/>

    </v-dialog>
    <v-row>
      <v-col>
      </v-col>
      <v-col>
        <v-card>
          <v-card-title>
            <v-avatar style="margin-right: 0.2rem">
              <v-img :src="'/media/avatar/'+loggedInUser.avatar.path"/>
            </v-avatar>
            {{loggedInUser.firstname + " " + loggedInUser.lastname}}
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid">
              <v-textarea
                :label="'hello, ' + loggedInUser.firstname +', what\'s happening today?'"
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
                <v-col class="col-auto mr-auto" style="margin: 0 !important; padding: 0 1rem 1rem 1rem"
                       v-for="(f,index) in this.Files">
                  <video style="width: 8rem; height: auto" v-if="f.type.startsWith('video')" :src="createUrl(f)" controls>

                  </video>
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
              <span>Attach file</span>
            </v-tooltip>
            <v-menu offset-y :close-on-content-click='false'>
              <VEmojiPicker @select="selectEmoji"/>
              <template v-slot:activator="{ on }">
                <v-btn v-on="on" icon>
                  🙂
                </v-btn>

              </template>
            </v-menu>
            <v-spacer>
            </v-spacer>
            <v-btn
              color="primary"
              :disabled="!valid"
            >
              post
            </v-btn>
          </v-card-actions>

        </v-card>


        <v-card style="margin-top: 1rem;" v-bind:key="post.id" :id="posts.id" v-for="post in posts">
          <v-card-title style="display: inline">
            <v-avatar>
              <v-img :src="post.avatar"/>
            </v-avatar>
            {{post.username}}
          </v-card-title>
          <v-card-subtitle style="display: inline;">
            {{post.posted}}
          </v-card-subtitle>
          <v-card-text>
            {{post.text}}
            <v-img @click="showOverlay(post.image)" height="200" width="400" v-if="post.image !== ''" :src="post.image">
            </v-img>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn
              color="error"
              icon
            >
              <v-icon>thumb_down_alt</v-icon>
            </v-btn>
            <v-btn
              color="success"
              icon
            >
              <v-icon>thumb_up_alt</v-icon>
            </v-btn>
            {{post.likes}}
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col></v-col>

    </v-row>
  </v-layout>

</template>

<script>
  import twemoji from 'twemoji'
  import VEmojiPicker from 'v-emoji-picker';
  import {mapGetters} from "vuex";

  export default {
    components: {
      VEmojiPicker
    },
    data() {
      return {
        valid: true,
        dialog: false,
        overlayImg: '',
        postText: '',
        postRules: [
          v => !!v || 'Cannot be empty!',
          v => !!v && v.length <= 600 || 'Can\'t be greater than 600 characters!'
        ],
        imageRules: [
          v => !!v || 'Image file is required'
        ],
        imageFile: null,
        url: null,
        posts: [
          {
            username: "default",
            avatar: "account.png",
            text: "hello world",
            image: '',
            posted: "10-10-2019",
            likes: "10",
            comments: [],
          },
          {
            username: "default",
            avatar: "account.png",
            text: "december!",
            image: "defaultpost.jpg",
            posted: "10-12-2019",
            likes: "5",
            comments: [],
          }, {
            username: "default",
            avatar: "account.png",
            text: "hello again",
            image: "defaultpost2.jpg",
            posted: "10-12-2019",
            likes: "5",
            comments: [],
          }
        ],

        Files: [],
        ReachedLimit: false,
        showEmojiPicker: false,
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
          console.log(e.target.files[0])
        }

      },
      createUrl(file) {
        let url;

        if(file.type.startsWith('video')){
          const blob = new Blob(
            [file],
            {"type" : file.type});
          url = URL.createObjectURL(blob);

        }
        url = URL.createObjectURL(file);
        console.log(url)
        return url
      },
      deleteFile(index) {
        this.Files.splice(index, 1)
      },
      selectEmoji(emoji) {
        this.postText += emoji.data
      },
      parseEmoji(input) {
        let parsed = twemoji.parse(input)
        console.log(parsed)
         return parsed
      }
    },
    watch: {
      'Files.length': function (newVal, oldVal) {
        if (newVal >= 4) {
          this.ReachedLimit = true;
        } else if (newVal >= 0 && newVal < 4) {
          console.log(newVal)
          this.ReachedLimit = false;

        }
      }
    },
    computed: {
      ...mapGetters(['isAuthenticated', 'loggedInUser']),

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
