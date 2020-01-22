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
            {{loggedInUser.firstname + " " + loggedInUser.lastname}}
          </v-card-title>
          <v-card-text>

            <v-textarea
              label="what's happening today?"
            >

            </v-textarea>

          </v-card-text>
          <v-card-actions>
            <v-spacer>
            </v-spacer>
            <v-btn>
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
      style="height: inherit; width: inherit"
      scrollable
    >
      <v-card>
         <v-card-title>
           <v-btn
             icon
             @click="dialog = false"
           >
             <v-icon>close</v-icon>
           </v-btn>
         </v-card-title>
        <v-card-text>
          <v-img id="img" :src="overlayImg"/>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-row>
      <v-col>
      </v-col>
      <v-col v-for="post in posts">
        <v-card>
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
            >
              action
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
        dialog: false,
        overlayImg: '',
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
    #img{
      width: 100%;
      height: 100%;
    }
</style>
