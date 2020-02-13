<template>
  <v-app dark>
    <v-card v-if="error.statusCode === 404">
      <v-card-title>{{ pageNotFound }}</v-card-title>
      <v-card-text>This page does not exist</v-card-text>
      <v-card-actions>
        <v-btn to="/">
          Home page
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-card v-else>
      <v-card-title>
        {{ otherError }}
      </v-card-title>
      <v-card-text>This is most likely an exception thrown in the webapp and not the system itself</v-card-text>
      <v-card-actions>
        <v-btn to="/">
          Home page
        </v-btn>
      </v-card-actions>
    </v-card>

  </v-app>
</template>

<script>
export default {
  layout: 'guestlayout',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head () {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  },
  data () {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred!'
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
