<template>
  <div>
      <account-details></account-details>
  </div>


</template>

<script>
  import {mapGetters, mapMutations} from "vuex";
  import  accountDetails from "../components/account-details"
    export default {
      name: "account-settings",
      components:{accountDetails},
      data(){
          return{

          }
      },

    }
</script>

<style scoped>

</style>
