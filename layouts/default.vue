<template>
  <v-app
    :dark="setTheme"
  >
    <v-navigation-drawer
      v-model="drawer"
      id="navigation-drawer"
      clipped
      app
      :expand-on-hover="expandOnHover"
      mini-variant
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      app
      clipped-left
    >

      <v-toolbar-title
        @click="go('/')"
        style="cursor: pointer"
        onmouseover="this.style.color = 'red'"
        onmouseleave="this.style.color = ''"
        v-text="title"
      />
      <v-spacer/>
      <v-spacer/>
      <v-spacer/>
      <v-autocomplete
        class="d-none d-lg-block"
        v-model="model"
        :items="searchItems"
        :loading="isLoading"
        :search-input.sync="search"
        filled
        solo
        dense
        rounded
        no-data
        @change="go('/user?id='+getitemvalue)"
        hide-selected
        item-text="firstname"
        item-value="id"
        label="Search users"
        return-object
        style="margin-top: 1.5rem"
      />
      <v-spacer/>
      <v-menu offset-y bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            class="d-none d-lg-block"
            style="margin-right: 1rem"
            v-on="on"
            text
          >
            <v-badge
              :content="friendRequests.length"
              :value="friendRequests.length"
              color="red"
              overlap
            >
              <v-icon>mdi-account-plus</v-icon>
            </v-badge>
          </v-btn>
        </template>
          <v-list>
            <v-list-item v-if="friendRequests.length === 0"
            >
              no friend requests
            </v-list-item>
            <v-list-item
              v-if="friendRequests.length !== 0"
              v-for="(item, index) in friendRequests"
              :key="index"
            >
              <v-list-item-title>{{ item.sender.firstname + " sent you a friend request" }}</v-list-item-title>
              <v-list-item-action>
                <v-btn
                  color="success"
                  icon
                  @click="acceptFriendRequest(item.sender.id)"
                >
                  <v-icon>mdi-check</v-icon>
                </v-btn>
              </v-list-item-action>
             <v-list-item-action>
              <v-btn
                color="error"
                icon
                @click="denyFriendRequest(item.sender.id)"
              >
                <v-icon>mdi-cancel</v-icon>
              </v-btn>
             </v-list-item-action>
            </v-list-item>
          </v-list>

      </v-menu>
      <v-menu offset-y bottom>
        <template v-slot:activator="{ on }">
          <v-btn
            class="d-none d-lg-block"
            style="margin-right: 1rem"
            v-on="on"
            text
          >
            <v-badge
              :value="notificationCount"
              color="red"
              overlap
            >
              <v-icon>mdi-bell</v-icon>
            </v-badge>
          </v-btn>

        </template>
        <v-list>
          <v-list-item v-if="notificationCount === 0"
          >
            no notifications
          </v-list-item>
          <v-list-item
            v-if="notificationCount !== 0"
            v-for="(item, index) in notifications"
            :key="index"
          >
            <v-list-item-title>{{ item.sender.firstname + " " + getMessage(item.type) }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-divider
        vertical
        dark
      />
      <v-menu offset-y bottom>
        <template v-slot:activator="{ on }">

          <v-btn
            color="primary"
            text
            style="margin-left: 1rem; width: auto; height: auto"
            v-on="on">
            <v-avatar style="margin-right: .2rem">
              <v-img :src="'/media/avatar/'+loggedInUser.avatar.path"/>
            </v-avatar>
            <p style="margin-left: 1rem; margin-bottom: 0;">{{loggedInUser.firstname + " " + loggedInUser.lastname}}</p>
          </v-btn>

        </template>
        <v-list>
          <v-list-item

            v-for="(item, index) in profilemenuitems"
            :key="index"
            @click="go(item.action)"
          >
            <v-list-item-title>
              <v-icon>{{item.icon}}</v-icon>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="logout"
          >
            <v-list-item-title>
              <v-icon>exit_to_app</v-icon>
              Logout
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-content>
      <v-container>
        <nuxt/>
        <snackbar></snackbar>
      </v-container>
    </v-content>
    <v-bottom-navigation
      v-model="bottomNav"
      class="d-lg-none"
      fixed
    >
      <v-btn @click="go('/')" value="Home">
        <v-icon>mdi-newspaper</v-icon>
      </v-btn>

      <v-btn @click="go('/search')" value="Search">
        <v-icon>search</v-icon>
      </v-btn>

      <v-btn @click="go('/notifications')"
             value="notifications">
        <v-badge
          :content="notificationCount"
          :value="notificationCount"
          color="red"
          overlap
        >
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex'
    import Snackbar from "../components/Snackbar";
    import {EventBus} from '../assets/event-bus';
    import WsSubscriptions from '../assets/WsSubscriptions'


    export default {

        middleware: "auth",
        components: {
            Snackbar
        },
        data() {
            return {
                title: 'Reidun',
                bottomNav: 'recent',
                drawer: null,
                expandOnHover: true,
                searchInput: '',
                descriptionLimit: 60,
                isLoading: false,
                model: null,
                search: null,
                users: [],
                items: [
                    {
                        icon: 'home',
                        title: 'Home',
                        to: '/'
                    },
                ],
                notifications: [],
                friendRequests: [],

                profilemenuitems: [
                    {icon: 'account_box', title: ' Account', action: "/me"},
                    {icon: 'settings', title: ' Settings', action: "/settings"},


                ],
                notificationCount: 0,
                friendRequestCount: 0
            }
        },
        watch: {
            search(val) {
                if (val === '') return;
                // Items have already been loaded
                if (this.users.length > 0) return

                // Items have already been requested
                if (this.isLoading) return

                this.isLoading = true

                let token = this.$auth.getToken('local')

                // Lazily load input items
                this.$axios.get('/users/search', {headers: {Authorization: `${token}`}, params: {q: val}}).then(res => {
                    this.users = res.data.data

                }).catch(error => {

                }).finally(() => (this.isLoading = false))
            },
        },
        beforeCreate() {
            console.log("%cHold Up!", "color: red; font-size:40px")
            console.log("%cPasting suspicious code in here could give attackers access to your account.", "color: red; font-size: 30px")
            console.log("%cunless you understand exactly what you are doing, close this window and stay safe.", "color: red; font-size: 30px")

        },
        beforeMount(){
            this.getNotifications()
            this.getFriendRequest()
            this.getUnreadNotifications()
            WsSubscriptions(this.loggedInUser.id)

        },
        mounted() {
            this.$ws.$on('disconnect', (e) => this.onDisconnect(e))
            this.$ws.$on('FRIEND_REQUEST_ACCEPTED', (e) => this.getFriendRequest(this.loggedInUser.id))
            this.$ws.$on('FRIEND_REQUEST_DENIED', (e) => this.getFriendRequest(this.loggedInUser.id))
            this.$ws.$on('FRIEND_REQUEST_CANCELLED', (e) => this.getFriendRequest(this.loggedInUser.id))
            this.$ws.$on('SENT_REQUEST', (e) => this.getFriendRequest(this.loggedInUser.id))

            EventBus.$on('theme-changed', response => {
                this.$vuetify.theme.dark = localStorage.theme === 'light';
            });
        },
        methods: {
            async logout() {
                await this.$auth.logout();
                this.$ws.disconnect()
                this.$router.push('/login')
            },
            ...mapMutations({
                setSnack: 'snackbar/setSnack',
                setSnackTop: 'snackbar/setSnackTop',
                setSnackColor: 'snackbar/setSnackColor'
            }),
            async onDisconnect(e) {
                await this.$axios.get('/user').then(res =>{
                    if(!res.data){
                        this.logout()
                    }
                }).catch(err =>{
                    this.logout()
                })
            },
            async getUnreadNotifications(){
                await this.$axios.get('/notifications/unread').then(res =>{
                        this.notificationCount = res.data.notification_count

                }).catch(err =>{
                    this.notificationCount = 0
                })
            },
            async getNotifications() {
                await this.$axios.get('/notifications/all').then(res =>{
                    if(!res.data){
                        this.notifications = res.data.data
                    }
                }).catch(err =>{

                })
            },
            async acceptFriendRequest(senderId) {
                let self = this;
                let data = {
                    senderId: senderId,
                }
                await this.$axios.post('/friends/request/accept', data).then(res => {
                    self.setSnackColor("success");
                    this.$ws.$emitToServer("event:default", 'ACCEPTED_INCOMING_REQUEST', {sender: this.loggedInUser.id, targetUserId: senderId})
                    self.setSnack("Accepted friend request");

                }).catch(error => {
                    self.setSnackColor("error");
                    self.setSnack("Something went wrong")
                })
            },
            async denyFriendRequest(senderId) {
                let self = this;
                let data = {
                    senderId: senderId,
                }

                await this.$axios.post('/friends/request/deny', data).then(res => {
                    self.setSnackColor("success");
                    this.$ws.$emitToServer("event:default", 'DENIED_INCOMING_REQUEST', {sender: this.loggedInUser.id, targetUserId: senderId})
                    self.setSnack("Denied friend request");

                }).catch(error => {
                    self.setSnackColor("error");
                    self.setSnack("Something went wrong")
                })
            },
            go: function (action) {
                this.$router.push({
                    path: action
                })
            },
            getFriendRequest: async function () {
                await this.$axios.get('/friends/request/all').then(res => {
                        this.friendRequests = res.data.data

                }).catch(err => {
                    this.friendRequests = []
                    console.log(err)
                })
            },
            getMessage(type) {
                switch (type) {
                    case 'POST_LIKED':
                        return 'liked your post'
                    case 'POST_DISLIKED':
                        return 'disliked your post'
                }
            },

        },
        computed: {
            setTheme() {
                if (localStorage.theme === 'light') {
                    return (this.$vuetify.theme.dark = false);
                } else {
                    return (this.$vuetify.theme.dark = true);
                }
            },
            getitemvalue() {
                return this.model.id
            },
            searchItems() {
                return this.users
            },
            ...mapGetters(['isAuthenticated', 'loggedInUser']),

        }
    }
</script>
<style scoped>


</style>
