<template>
  <v-layout
    column
  >
    <v-row>
      <v-col>

      </v-col>
      <v-col>
        <v-card>
          <v-card-title>
            <v-avatar>
              <v-img :src="loggedInUser.avatar !== undefined ? loggedInUser.avatar : 'account.svg'"/>
            </v-avatar>
            {{loggedInUser.firstname + " " + loggedInUser.lastname}}
          </v-card-title>
          <v-card-text>
           <v-form v-model="valid">
            <v-textarea
              :label="'hello, ' + loggedInUser.firstname +', what\'s happening today?'"
              clearable
              counter
              auto-grow
              no-resize
              :rules="postRules"

            >
            </v-textarea>
           </v-form>
          </v-card-text>
          <v-card-actions>
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
      </v-col>
      <v-col>

      </v-col>
    </v-row>
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
        <v-card style="margin-top: 1rem" :id="posts.id" v-for="post in posts" >
          <v-card-title>
            <v-avatar>
              <v-img :src="post.avatar"/>
            </v-avatar>
            {{post.username}}
          </v-card-title>
          <v-card-subtitle>
            <p>{{post.posted}}</p>
          </v-card-subtitle>
          <v-card-text>
            {{post.text}}
            <v-img   @click="showOverlay(post.image)" height="200" width="400" v-if="post.image !== ''" :src="post.image">
            </v-img>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <v-btn
              color="primary"
              icon
            >
              <v-icon>thumb_down_alt</v-icon>
            </v-btn>
            <v-btn
              color="primary"
              icon
            >
              <v-icon>thumb_up_alt</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col></v-col>

    </v-row>
  </v-layout>
</template>

<script>

  import {mapGetters} from "vuex";

  export default {
    data() {
      return {
        valid: true,
        dialog: false,
        overlayImg: '',
        postRules:[
          v => !!v || 'Cannot be empty!',
          v => !!v && v.length <= 600 || 'Can\'t be greater than 600 characters!'
        ],
        posts: [
          {
            username: "default",
            avatar: "account.svg",
            text: "hello world",
            image:'',
            posted: "10-10-2019",
            likes: "10",
            comments: [],
          },
          {
            username: "default",
            avatar: "account.svg",
            text: "december!",
            image:"defaultpost.jpg",
            posted: "10-12-2019",
            likes: "5",
            comments: [],
          },{
            username: "default",
            avatar: "account.svg",
            text: "hello again",
            image:"defaultpost2.jpg",
            posted: "10-12-2019",
            likes: "5",
            comments: [],
          }
        ]


      }
    },
    methods:{
      showOverlay(img){
        this.dialog = !this.dialog
        this.overlayImg = img
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
