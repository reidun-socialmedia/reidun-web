<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header
        disable-icon-rotate expand-icon=""
        style="height:4rem; background-color: #e3314c !important;">
        Chat
        <v-spacer></v-spacer>
        <v-badge v-if="this.friendsonline" :value="this.friendsonline.size">
        </v-badge>
      </v-expansion-panel-header>
      <v-expansion-panel-content style="padding: 0 !important;" class="chat-friend-list-content">
        <v-card style="height: 20rem">
          <v-card-title>
            <v-text-field @focus="searching = !searching" label="search">

            </v-text-field>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item v-if="this.friendsonline.size !== 0" v-for="(friend, i) of this.friendsonline" :key="i">
                <v-list-item-title>
                  {{ friend.user.firstname }} {{ friend.user.lastname }}
                </v-list-item-title>
                <v-list-item-avatar>
                  <v-img :src="'/media/avatar/'+friend.user.avatar.path">

                  </v-img>
                </v-list-item-avatar>
                <v-list-item-icon>
                  <div v-if="friend.user.status.status = 1" class="user-online"></div>
                  <div v-else class="user-offline"></div>
                </v-list-item-icon>
              </v-list-item>
              <v-list-item v-else>
                You have no friends online
              </v-list-item>
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
  props: ["friendsonline"],
  data() {
    return {
      chatFriendListExpand: false,
      searchQuery: "",
      searching: false,
    }
  },
  mounted() {
    console.info(this.friendsonline)
  },
  computed: {

    search() {
      return this.friendsonline.filter(friend => friend.firstname = this.searchQuery)
    }


  },
}
</script>

<style scoped>
.user-online {
  border-radius: 1rem;
  background: #818181;
}

.user-offline {
  border: #818181 solid 1px;
  border-radius: 1rem;
}


</style>
