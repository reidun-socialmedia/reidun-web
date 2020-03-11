<template>
  <v-app :dark="setTheme">
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

      <v-toolbar-title @click="go('/')" style="cursor: pointer" onmouseover="this.style.color = 'red'"
                       onmouseleave="this.style.color = ''" v-text="title"/>
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

      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn
            class="d-none d-lg-block"
            style="margin-right: 1rem"
            v-on="on"
            text>
            <v-badge
              :content="notifications.length"
              :value="notifications.length"
              color="red"
              overlap
            >
              <v-icon>mdi-bell</v-icon>
            </v-badge>
          </v-btn>

        </template>
        <v-list>
          <v-list-item

            v-for="(item, index) in notifications"
            :key="index"
            @click="go(item.action)"
          >
            <v-list-item-title>{{ item.sender.firstname + " " + item.message }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-divider
        vertical
        dark
      />
      <v-menu>
        <template v-slot:activator="{ on }">

          <v-btn
            color="primary"
            text
            style="margin-left: 1rem; width: auto; height: auto"
            v-on="on">
            <v-avatar style="margin-right: .2rem">
              <v-img :src="'/media/avatar/'+loggedInUser.avatar.path"/>
            </v-avatar>
            {{ loggedInUser.firstname + " " +loggedInUser.lastname}}
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
          :content="notifications.length"
          :value="notifications.length"
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
  import {mapGetters} from 'vuex'
  import Snackbar from "../components/Snackbar";
  import {EventBus} from '../assets/event-bus';


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
        notifications: [
          {
            type: "friend",
            message: "sent you a friend request",
            sender: {
              userid: 'default',
              firstname: 'default'
            }
          }
        ],
        profilemenuitems: [
          {icon: 'account_box', title: ' Account', action: "/me"},
          {icon: 'settings', title: ' Settings', action: "/settings"},


        ],
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
    mounted() {
      EventBus.$on('theme-changed', response => {
        this.$vuetify.theme.dark = localStorage.theme === 'light';
        console.log(this.$vuetify.theme.dark)

      });
    },
    methods: {
      go: function (action) {
        this.$router.push({
          path: action
        })
      },
      async logout() {
        await this.$auth.logout();
        this.$router.push('/login')
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
