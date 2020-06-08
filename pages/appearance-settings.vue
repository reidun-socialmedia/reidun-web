<template>
  <appereance-details></appereance-details>
</template>

<script>

  import {mapGetters} from "vuex";
  import appereanceDetails from "../components/appereance-cmp"
  export default {
    name: "appearance-settings",
      components:{appereanceDetails}
  }
</script>

<style scoped>

</style>
