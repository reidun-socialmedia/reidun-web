<template>
 <v-container>
   <template>
     <v-tabs
       fixed-tabs
       vertical
       grow
       centered
       icons-and-text
       dark
     >
       <v-tab>
         Account details
         <v-icon>
           mdi-account-badge-horizontal-outline
         </v-icon>
       </v-tab>
       <v-tab>
         Privacy
         <v-icon>
           mdi-security
         </v-icon>
       </v-tab>
       <v-tab>
         Appearance
         <v-icon>mdi-eye</v-icon>
       </v-tab>
       <v-tab>
        Account security log
         <v-icon>
           mdi-security-network
         </v-icon>
       </v-tab>
     </v-tabs>
   </template>
 </v-container>
</template>

<script>
    export default {
        name: "settings"
    }
</script>

<style scoped>

</style>
