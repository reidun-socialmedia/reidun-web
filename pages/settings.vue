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
       <v-tab href="#appearance">
         Appearance
         <v-icon>mdi-eye</v-icon>
       </v-tab>
       <v-tab>
        Account security log
         <v-icon>
           mdi-security-network
         </v-icon>
       </v-tab>
       <v-tab-item
         value="appearance"
       >
         <v-card>
           <v-card-title>Appearance Settings</v-card-title>
           <v-list>
             <v-list-item>
               <v-list-item-title>Light theme </v-list-item-title>
               <appear
               <v-switch :label="themeMode === true ? 'on' : 'off'"   v-model="themeMode"/>
             </v-list-item>
           </v-list>
         </v-card>

       </v-tab-item>
     </v-tabs>
   </template>
 </v-container>
</template>

<script>
    export default {
        name: "settings",
        data (){
            return{
                themeMode: '',
            }
        },
        mounted(){
            this.themeMode = localStorage.theme !== 'dark'

        },
        watch:{
            themeMode: function (val,oldval) {
                localStorage.theme = this.themeMode === true ? 'light' : 'dark';
            }
        }

    }
</script>

<style scoped>

</style>
