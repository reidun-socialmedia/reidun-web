<template>
  <v-app
    :dark="setTheme">
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
      <v-footer
        absolute
        color="transparent"
      >
        <v-divider></v-divider>
        <v-spacer></v-spacer>
        <v-switch :label="`Light`" style="margin-left: 8em" v-model="goLight"/>
      </v-footer>
    </v-navigation-drawer>
    <v-app-bar
      app
      clipped-left
    >

      <v-app-bar-nav-icon  class="d-lg-none" @click.stop="drawer = !drawer"/>
      <v-toolbar-title @click="go('/')" style="cursor: pointer" onmouseover="this.style.color = 'red'" onmouseleave="this.style.color = ''" v-text="title" />
      <v-spacer />
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
      <v-spacer />

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
            <v-avatar>
              <v-img :src="loggedInUser.avatar !== undefined ? loggedInUser.avatar : 'account.png'"/>
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
            <v-list-item-title><v-icon>{{item.icon}}</v-icon>{{ item.title }}</v-list-item-title>
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
        <nuxt />
      </v-container>
    </v-content>
    <v-bottom-navigation
      v-model="bottomNav"
      class="d-lg-none"
      fixed
    >
      <v-btn value="Home">
        <span>home</span>
        <v-icon>mdi-newspaper</v-icon>
      </v-btn>

      <v-btn value="Search">
        <span>search</span>
        <v-icon>search</v-icon>
      </v-btn>

      <v-btn value="notifications">
        <span>notifications</span>
        <v-badge
            :content="notifications.length"
            :value="notifications.length"
            color="red"
            overlap
          >
            <v-icon>mdi-bell</v-icon>
          </v-badge>
      </v-btn>
      <v-btn value='messages'>
        <span>messages</span>
        <v-icon>message</v-icon>
      </v-btn>
    </v-bottom-navigation>
  </v-app>
</template>

<script>
  import {mapGetters} from 'vuex'
  import Snackbar from "../components/Snackbar";
export default {
  middleware: "auth",
  components: {
    Snackbar
  },
  data () {
    return {
      title: 'Reidun',
      bottomNav: 'recent',
      drawer:true,
      expandOnHover: true,
      searchInput:'',
      goLight: false,
      descriptionLimit: 60,
      isLoading: false,
      model: null,
      search: null,
      users:[],
      items: [
        {
          icon: 'home',
          title: 'Home',
          to: '/'
        },
      ],
      notifications:[
        {
          type:"friend",
          message:"sent you a friend request",
          sender:{
            userid:'default',
            firstname:'default'
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
    search (val) {
      if(val === '') return;
      // Items have already been loaded
      if (this.users.length > 0) return

      // Items have already been requested
      if (this.isLoading) return

      this.isLoading = true

      let token = this.$auth.getToken('local')

      // Lazily load input items
       this.$axios.get('/user/search',{ headers: { Authorization: `${token}` }, params: { q: val}}).then( res => {
         this.users = res.data.data

      }).catch( error => {

      }).finally(() => (this.isLoading = false))
    },
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
  computed:{
    getitemvalue(){
      return this.model.id
    },
    searchItems () {
      return this.users
    },
    setTheme() {
      if (this.goLight === true) {
        return (this.$vuetify.theme.dark = false);
      } else {
        return (this.$vuetify.theme.dark = true);
      }
    },
    ...mapGetters(['isAuthenticated', 'loggedInUser']),

  }
}
</script>
<style scoped>


</style>
