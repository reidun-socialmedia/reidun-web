<template>
  <v-app
    :dark="setTheme"
    :style="{background: $vuetify.theme.themes[getTheme].background}"
  >
    <v-navigation-drawer
      id="mobile-navigation-drawer"
      v-model="mobileDrawer"
      app
      v-if="this.$vuetify.breakpoint.smAndDown"
      :style="{background: $vuetify.theme.themes[getTheme].drawerBackground}"
    >
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <v-img :src="'/media/avatar/'+loggedInUser.avatar.path"/>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>
              {{ loggedInUser.firstname + " " + loggedInUser.lastname }}
            </v-list-item-title>
            <v-list-item-subtitle>
              {{ this.loggedInUser.email }}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-divider vertical>

        </v-divider>

        <v-list-item
          v-for="(item, i) in mobileDrawerItems"
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
      <v-footer
        absolute
      >
        <v-spacer></v-spacer>
        <v-btn @click="logout" v-on="on" icon>
          <v-icon>exit_to_app</v-icon>
        </v-btn>
      </v-footer>
    </v-navigation-drawer>

    <v-navigation-drawer
      v-model="drawer"
      id="navigation-drawer"
      clipped
      app
      v-if="this.$vuetify.breakpoint.mdAndUp"
      :style="{background: $vuetify.theme.themes[getTheme].drawerBackground}"
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
      :style="{background: $vuetify.theme.themes[getTheme].appBarBackground + ' !important'}"

      clipped-left
    >
      <!--<v-btn icon v-if="this.$vuetify.breakpoint.smAndDown" @click="$router.back()"
             :disabled="this.$route.path === '/' || this.$route.path === '/home'">
        <v-icon>
          keyboard_arrow_left
        </v-icon>
      </v-btn>-->
      <v-avatar v-if="this.$vuetify.breakpoint.smAndDown" @click="mobileDrawer = true">
        <v-img :src="'/media/avatar/'+loggedInUser.avatar.path"/>
      </v-avatar>
      <v-toolbar-title
        @click="go('/')"
        v-if="$vuetify.breakpoint.mdAndUp"
        style="cursor: pointer"
        onmouseover="this.style.color = 'red'"
        onmouseleave="this.style.color = ''"
        v-text="title"
      />
      <v-spacer/>
      <v-spacer/>

      <v-spacer/>

      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-text-field
            class="d-none d-lg-block"
            v-model="searchInput"
            solo
            dense
            :label="$t('default_layout.search_bar.label')"
            v-on="on"
            style="margin-top: 1.5rem"
          />
        </template>
        <v-list v-if="users.length !== 0" :loading="isLoading">
          <v-list-item

            v-for="(item, index) in users.slice(0, 5)"
            :key="index"
            @click="go('/user?id='+item.id)"
          >
            <v-list-item-title>{{ item.firstname + " " + item.lastname }}</v-list-item-title>
            <v-list-item-avatar>
              <v-img :src="'/media/avatar/'+item.avatar.path"></v-img>
            </v-list-item-avatar>
          </v-list-item>
        </v-list>
        <v-card v-else>
          <v-card-text>{{ this.$t('default_layout.search_bar.no_results') }}</v-card-text>
        </v-card>
      </v-menu>
      <v-spacer/>
      <v-toolbar-title
        @click="go('/')"
        v-if="$vuetify.breakpoint.smAndDown"
        style="cursor: pointer"
        onmouseover="this.style.color = 'red'"
        onmouseleave="this.style.color = ''"
        v-text="title"
      />
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
            {{ this.$t('default_layout.friend_requests.no_friend_requests') }}
          </v-list-item>
          <v-list-item
            v-if="friendRequests.length !== 0"
            v-for="(item, index) in friendRequests"
            :key="index"
          >
            <v-list-item-title>
              {{
                formatString($t('default_layout.friend_requests.friend_request_title'),
                  [item.sender.firstname])
              }}
            </v-list-item-title>
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
              :content="notificationCount"
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
            {{ this.$t('default_layout.notifications.no_notifications') }}
          </v-list-item>
          <v-list-item
            v-for="(n,i) in notifications"
            :key="i"
            :style="{background:n.is_read === 0 ? '#6d8dc2':''}"
            v-else
          >
            <v-list-item-avatar>
              <v-img :src="'/media/avatar/'+n.sender.avatar.path"></v-img>
            </v-list-item-avatar>
            <v-list-item-title>{{ getMessage(n.type, n.sender.firstname) }}</v-list-item-title>
            <v-btn @click="ReadNotification(n.id)" text>
              {{ $t('notifications_page_mobile.markAsRead') }}
            </v-btn>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-divider
        vertical
        class="d-none d-lg-block"
        dark
      />
      <v-menu
        v-if="$vuetify.breakpoint.mdAndUp"
        offset-y bottom>

        <template v-slot:activator="{ on }">

          <v-btn
            text
            style="margin-left: 1rem; width: auto; height: auto"
            v-on="on">
            <v-avatar style="margin-right: .2rem">
              <v-img :src="'/media/avatar/'+loggedInUser.avatar.path"/>
            </v-avatar>
            <p style="margin-left: 1rem; margin-bottom: 0;">
              {{ loggedInUser.firstname + " " + loggedInUser.lastname }}</p>
          </v-btn>

        </template>
        <v-list>
          <v-list-item

            v-for="(item, index) in profilemenuitems"
            :key="index"
            @click="go(item.action)"
          >
            <v-list-item-title>
              <v-icon>{{ item.icon }}</v-icon>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item>
          <v-list-item
            @click="logout"
          >
            <v-list-item-title>
              <v-icon>exit_to_app</v-icon>
              {{ $t("default_layout.profile_drop_menu.Logout.title") }}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container>
        <nuxt/>
        <snackbar></snackbar>
      </v-container>
    </v-main>

    <div class="chatBox">
      <chat-friend-list :friends-online="this.onlineFriends" style="width: 20rem">

      </chat-friend-list>
    </div>


    <v-bottom-navigation
      v-model="bottomNav"
      v-if="$vuetify.breakpoint.smAndDown"
      :style="{background: $vuetify.theme.themes[getTheme].buttomNavbackground}"
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
import chatFriendList from "../components/chatFriendList";
import WsSubscriptions from '../assets/WsSubscriptions'


const vsprintf = require('sprintf-js').vsprintf

export default {

  middleware: "auth",
  components: {
    Snackbar,
    chatFriendList,
  },
  data() {
    return {
      theme: {},
      dark: false,
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
      mobileDrawer: false,
      items: [
        {
          icon: 'home',
          title: this.$t("default_layout.navigation_drawer.Home.title"),
          to: '/'
        }
      ],
      mobileDrawerItems: [
        {
          icon: 'mdi-account-box',
          title: this.$t("default_layout.profile_drop_menu.account.title"),
          to: '/me'
        },
        {
          icon: 'settings',
          title: this.$t("default_layout.profile_drop_menu.Settings.title"),
          to: '/settings'
        },
      ],
      notifications: [],
      friendRequests: [],
      onlineFriends:[],
      profilemenuitems: [
        {icon: 'account_box', title: this.$t("default_layout.profile_drop_menu.account.title"), action: "/me"},
        {icon: 'settings', title: this.$t("default_layout.profile_drop_menu.Settings.title"), action: "/settings"},


      ],
      notificationCount: 0,
      friendRequestCount: 0,
    }
  },
  watch: {
    searchInput(newVal, oldVal) {
      this.isLoading = true
      if (newVal !== '') {
        this.$axios.get('/users/search', {params: {q: newVal}}).then(res => {
          this.users = res.data.data
        }).catch(error => {
          this.users = []
        }).finally(() => (this.isLoading = false))
      } else {
        this.users = []
      }
    }
  },
  created() {
    console.log("%c" + this.$t("default_layout.developer_console_warning.line_1"), "color: red; font-size:40px")
    console.log("%c" + this.$t("default_layout.developer_console_warning.line_2"), "color: red; font-size: 30px")
    console.log("%c" + this.$t("default_layout.developer_console_warning.line_3"), "color: red; font-size: 30px")

  },
  beforeMount() {
    this.getNotifications()
    this.getFriendRequest()
    this.getUnreadNotifications()
    this.getFriendsWithStatus(this.loggedInUser.id)
    WsSubscriptions(this.loggedInUser.id)

  },
  mounted() {

    this.$ws.$on('disconnect', (e) => this.onDisconnect(e))
    this.$ws.$on('FRIEND_REQUEST_ACCEPTED', (e) => this.getFriendRequest(this.loggedInUser.id))
    this.$ws.$on('FRIEND_REQUEST_DENIED', (e) => this.getFriendRequest(this.loggedInUser.id))
    this.$ws.$on('FRIEND_REQUEST_CANCELLED', (e) => this.getFriendRequest(this.loggedInUser.id))
    this.$ws.$on('SENT_REQUEST', (e) => this.getFriendRequest(this.loggedInUser.id))
    this.$ws.$on('fullNameChanged', (e) => this.changeFullName())
    this.$ws.$on('FRIEND_ONLINE', (message) => this.getFriendsWithStatus(this.loggedInUser.id))

    if (!localStorage.theme) {
      let defaultTheme = {
        text: 'System Theme',
        value: 'systemTheme'
      }
      localStorage.theme = JSON.stringify(defaultTheme)
    } else {
      this.theme = JSON.parse(localStorage.theme)
      if (this.theme.value === "dark") {
        this.dark = true
      } else {
        this.dark = false
      }

    }
    this.theme = JSON.parse(localStorage.theme)
    if (this.theme.value === 'systemTheme') {

      this.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        this.dark = e.matches
      });
    }
    this.$ws.$on('theme-changed', (e) => this.changeTheme(e))
  },
  methods: {
    async changeFullName() {
      await this.$axios.get('/user').then(res => {
        this.$store.commit('UpdateUser', res.data.data);
      }).catch(err => {

      })
    },
    async logout() {
      await this.$auth.logout();
      this.$ws.disconnect()
      await this.$router.push('/login')
    },
    ...mapMutations({
      setSnack: 'snackbar/setSnack',
      setSnackTop: 'snackbar/setSnackTop',
      setSnackColor: 'snackbar/setSnackColor'
    }),
    async onDisconnect(e) {
      await this.$axios.get('/user').then(res => {

      }).catch(err => {
        this.logout()
      })
    },
    async getUnreadNotifications() {
      await this.$axios.get('/notifications/unread').then(res => {
        this.notificationCount = res.data.notification_count

      }).catch(err => {
        this.notificationCount = 0
      })
    },
    async getNotifications() {
      await this.$axios.get('/notifications/all').then(res => {

        this.notifications = res.data.data

      }).catch(err => {

      })
    },
    async acceptFriendRequest(senderId) {
      let self = this;
      let data = {
        senderId: senderId,
      }
      await this.$axios.post('/friends/request/accept', data).then(res => {
        self.setSnackColor("success");
        this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'ACCEPTED_INCOMING_REQUEST', {
          sender: this.loggedInUser.id,
          targetUserId: senderId
        })
        self.setSnack("Accepted friend request");

      }).catch(error => {
        console.log(error);
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
        this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'DENIED_INCOMING_REQUEST', {
          sender: this.loggedInUser.id,
          targetUserId: senderId
        })
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
        console.log(this.friendRequests);
      }).catch(err => {
        this.friendRequests = []
      })
    },
    getMessage(type, name) {
      switch (type) {
        case 'POST_LIKED':
          return this.formatString(this.$t('default_layout.notifications.post_liked'), [name])
        case 'POST_DISLIKED':
          return this.formatString(this.$t('default_layout.notifications.post_disliked'), [name])
        case 'POST_COMMENTED':
          return this.formatString(this.$t('default_layout.notifications.post_commented'), [name])
      }
    },


    formatString(string, variables) {
      return vsprintf(string, variables)
    },

    async ReadNotification(notificationId) {

    },
    async changeTheme(e) {
      const theme = JSON.parse(localStorage.theme)
      switch (theme.value) {
        case 'dark':
          this.dark = true
          break;
        case 'light':
          this.dark = false
          break;
        case 'systemTheme':
          this.dark = window.matchMedia('(prefers-color-scheme: dark)').matches
          break;
      }
    },
    async getFriendsWithStatus(message) {
      try {
        const res = await this.$axios.$get("/friends/status")
        if (res.data.length !== 0) {
          console.log(res)
          this.onlineFriends = res.data;
        } else {
          this.onlineFriends = [];
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
  computed: {
    getTheme() {
      return (this.$vuetify.theme.dark) ? 'dark' : 'light'
    },
    setTheme() {
      return (this.$vuetify.theme.dark = this.dark)
    },
    getitemvalue() {
      return this.model.id
    },
    searchItems() {
      return this.users
    },
    getUserFriendListForChat(){
      return this.onlineFriends;
    },
    ...mapGetters(['isAuthenticated', 'loggedInUser', 'userLocale']),

  },

}
</script>
<style scoped>
.chatBox {
  position: fixed;
  bottom: 0;
  right: 0;
}

</style>
