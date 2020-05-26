<template>
  <v-card>
    <v-card-title>{{$t('search_page_mobile.title')}}</v-card-title>
    <v-card-text>
      <v-text-field
        v-model="searchInput"
        filled
        solo
        dense
        no-data
        @change="search"
        :label="$t('search_page_mobile.search_bar.label')"
      />
     <v-card
      flat
     >
       <v-list
        v-scroll
        v-if="users.length !== 0"
       >
           <v-list-item
             v-for="(user, i) in users"
             :key="i"
             @click="go('/user?id='+user.id)"
           >
             <v-list-item-icon>
               <v-avatar>
                   <v-img :src="'/media/avatar/'+user.avatar.path"/>
               </v-avatar>
             </v-list-item-icon>
             <v-list-item-content>
               <v-list-item-title v-text="user.firstname + ' ' + user.lastname"></v-list-item-title>
             </v-list-item-content>
           </v-list-item>
      </v-list>
       <p v-else>
         {{$t('search_page_mobile.list_empty')}}
       </p>
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
        error:"",
        users:[]
      }
    },
    watch: {
      searchInput: function(val, oldVal) {
        this.search(val)
      }
    },
    methods: {
      async search(input) {
        let token = this.$auth.getToken('local')
        this.$axios.get('/users/search',{ params: { q: input}}).then( res => {
          this.users = res.data.data

        }).catch( error => {
            this.error = error.message
            this.users = []
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
