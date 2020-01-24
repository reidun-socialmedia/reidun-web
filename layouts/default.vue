<template>
  <v-app :dark="setTheme">
    <v-navigation-drawer
      v-model="drawer"

      fixed
      clipped
      app
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
    >
      <v-toolbar-title @click="go('/')" style="cursor: pointer" onmouseover="this.style.color = 'red'" onmouseleave="this.style.color = ''" v-text="title" />
      <v-spacer />
      <v-spacer/>
      <v-spacer/>
      <v-text-field
          label="search"
          style="margin-top: 1rem; display: inline;"
        />

        <v-btn text style="display: inline;">
          <v-icon>search</v-icon>
        </v-btn>
      <v-spacer />

      <v-menu>
        <template v-slot:activator="{ on }">
          <v-btn
            style="margin-right: 1rem"
            v-on="on"
            text>
            <v-badge
              :content="notifications.length"
              :value="notifications.length"
              color="green"
              overlap
            >
              <v-icon>notification_important</v-icon>
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
      goLight: false,
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
