<template>
  <div v-if="loading" class="loading-page">
    <v-img src="static/favicon.png"></v-img>
    <h1>
      Reidun
    </h1>
    <h2>hey! reidun is loading!</h2>
    <v-icon>mdi-spin</v-icon>
  </div>
</template>

<script>
  export default {
    data: () => ({
      loading: false
    }),
    methods: {
      start () {
        this.loading = true
      },
      finish () {
        this.loading = false
      }
    }
  }
</script>

<style scoped>
  .loading-page {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.8);
    text-align: center;
    padding-top: 200px;
    font-size: 30px;
    font-family: sans-serif;
  }
</style>
