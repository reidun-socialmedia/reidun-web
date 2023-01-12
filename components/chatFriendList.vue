<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header
        disable-icon-rotate expand-icon=""
        style="height:4rem; background-color: #e3314c !important;">
        Chat
        <v-spacer></v-spacer>
        <v-badge v-if="this.friendsOnline" :value="this.friendsOnline.size">
        </v-badge>
      </v-expansion-panel-header>
      <v-expansion-panel-content style="padding: 0 !important;" class="chat-friend-list-content">
        <v-card style="height: 20rem">
          <v-card-title>
            <v-text-field
              filled
              solo
              dense
              rounded
              @focus="searching = !searching"
              label="search">
            </v-text-field>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-if="friendsOnline.size !== 0" v-for="(friend, i) of friendsOnline" :key="i">
                <v-divider></v-divider>
                <v-list-item-avatar>
                  <v-img :src="'/media/avatar/'+friend.user.avatar.path">

                  </v-img>
                </v-list-item-avatar>
                <v-list-item-title>
                  {{ friend.user.firstname }} {{ friend.user.lastname }}
                </v-list-item-title>
                  <div v-if="friend.user.status.status === 1" class="status online"></div>
                  <div v-else class="status offline"></div>
              </v-list-item>
              <v-list-item v-else>
                You have no friends online
              </v-list-item>
              <v-divider></v-divider>
            </v-list>
          </v-card-text>
        </v-card>

      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>

</template>

<script>
export default {
  name: "chatFriendList",
  props: ["friendsOnline"],
  data() {
    return {
      chatFriendListExpand: false,
      searchQuery: "",
      searching: false,
    }
  },
  mounted() {
    console.log(this.friendsOnline)
  },
  computed: {
    search() {
      return this.friendsOnline.filter(friend => friend.firstname = this.searchQuery)
    }


  },
}
</script>

<style scoped>
.status.online {
  background: #00ac26;
}
.status.offline{
  background: #d40573;
}

.status {
  border-radius: 1rem;
  height: 1rem;
  width:1rem;
}


</style>
