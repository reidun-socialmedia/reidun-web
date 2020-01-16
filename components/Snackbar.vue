<template>
  <v-snackbar v-model="show" v-bind:color="color" :top="top">
    {{message}}
    <v-btn color="accent" text @click.native="show = false">Close</v-btn>
  </v-snackbar>
</template>

<script>
  import { mapMutations } from 'vuex'
  export default {
      data () {
          return {
              show: false,
              message: '',
              color: '',
              top: false,
          }
      },
      created: function() {
          this.$store.watch(state => state.snackbar.snack, () => {
              const msg = this.$store.state.snackbar.snack;
              if(msg !== ''){
                  this.message = this.$store.state.snackbar.snack;
                  this.show = true;
                  this.$store.commit('snackbar/setSnack', '');
              }
          });
          this.$store.watch(state => state.snackbar.top, () => {
              const tp = this.$store.state.snackbar.top;
              if(tp !== false){
                  console.log(tp)
                  this.top = this.$store.state.snackbar.top;
                  this.$store.commit('snackbar/setSnackTop', false);
              }
          });
          this.$store.watch(state => state.snackbar.color, () => {
             const clr = this.$store.state.snackbar.color;
             if(clr !== '' ){
                 this.color = this.$store.state.snackbar.color;
                 this.$store.commit('snackbar/setSnackColor', '');
             }
          });
      }
  }
</script>
