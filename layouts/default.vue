<template>
  <v-app dark>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <div>
      <v-text-field>
      </v-text-field>
      </div>
      <v-spacer />
      <v-btn text><v-icon>notification_important</v-icon></v-btn>
      <v-divider
        vertical
        dark
      />
      <v-menu>
        <template v-slot:activator="{ on }">

          <v-btn
            left
            bottom
            color="primary"
            order-xl-last
            dark
            text
            v-on="on">
            <v-avatar/>
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
        {icon: 'account-box', title: ' Account', action: "/account"},
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
