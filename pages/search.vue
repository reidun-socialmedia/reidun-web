<template>
  <v-card>
    <v-card-title>search for users</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="searchInput"
        filled
        solo
        dense
        rounded
        no-data
        @keypress="search()"
        label="Search users"
      />
     <v-card
      flat
     >
       <v-list
        v-scroll
       >
           <v-list-item
             v-for="(user, i) in users"
             :key="i"
             @click="go('/user?id='+user.id)"
           >
             <v-list-item-icon>
               <v-avatar>
                 <v-img :src="user.path"></v-img>
               </v-avatar>
             </v-list-item-icon>
             <v-list-item-content>
               <v-list-item-title v-text="user.firstname + ' ' + user.lastname"></v-list-item-title>
             </v-list-item-content>
           </v-list-item>
      </v-list>
     </v-card>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: "search",
    data() {
      return {
        searchInput: '',
        users:[]
      }
    },
    methods: {
      async search() {
        let token = this.$auth.getToken('local')
        this.$axios.get('/user/search',{ headers: { Authorization: `${token}` }, params: { q: this.searchInput}}).then( res => {
          this.users = res.data.data

        }).catch( error => {

        })

      },
      go: function (action) {
        this.$router.push({
          path: action
        })
      },
    }
  }
</script>

<style scoped>

</style>
