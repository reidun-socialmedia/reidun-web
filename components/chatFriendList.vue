<template>
  <v-expansion-panels mandatory >
    <v-expansion-panel>
      <v-expansion-panel-header disable-icon-rotate expand-icon=""  style="height:4rem; background-color: #e3314c !important;"><v-card-title>Friends</v-card-title></v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list>
          <!--   <v-list-item v-for="(friend, i) of friendsOnline">

             </v-list-item>-->
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>

</template>

<script>
export default {
  name: "chatFriendList",
  props: ["friendsOnline"],
  data(){
    return{
      chatFriendListExpand:false
    }
  },
  computed:{
    getSize(){
      if(this.chatFriendListExpand){
        return '20rem';
      }else{
        return '1px';
      }
    }
  },
}
</script>

<style scoped>

</style>
