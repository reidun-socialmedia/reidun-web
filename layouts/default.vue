<template>
  <v-app dark>
    <v-app-bar
      app
    >
      <v-toolbar-title @click="go('/')" style="cursor: pointer" onmouseover="this.style.color = 'red'" onmouseleave="this.style.color = ''" v-text="title" />
      <v-spacer />
        <v-text-field
          label="search"
          style="margin-top: 1rem; display: inline;"
        />
        <v-btn text style="display: inline;">
          <v-icon>search</v-icon>
        </v-btn>
      <v-spacer />
      <v-btn style="margin-right: 1rem" text><v-icon>notification_important</v-icon></v-btn>
      <v-divider
        vertical
        dark
      />
      <v-menu>
        <template v-slot:activator="{ on }">

          <v-btn
            color="primary"
            dark
            text
            style="margin-left: 1rem; width: auto; height: auto"
            v-on="on">
            <v-avatar>
              <v-img :src="loggedInUser.avatar !== undefined ? loggedInUser.avatar : 'account.svg'"/>
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
        </v-list>
        <v-list>
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
    ...mapGetters(['isAuthenticated', 'loggedInUser']),

  }
}
</script>
