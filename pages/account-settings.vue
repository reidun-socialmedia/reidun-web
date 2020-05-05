<template>
  <div>
    <v-card>
      <v-card-title>
        {{$t('settings.account_settings_tab.title')}}
      </v-card-title>
    </v-card>
    <v-dialog
      v-model="securityDialog"
      width="500"
    >
      <v-card>
        <v-card-title
          primary-title
        >
          {{$t('settings.account_settings_tab.password.security_dialog.title')}}
        </v-card-title>

        <v-card-text>
          {{$t('settings.account_settings_tab.password.security_dialog.text')}}
          <form>
            <v-text-field
              type="password"
              :label="'type password'"
            >

            </v-text-field>
          </form>
        </v-card-text>


        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="securityDialog = false"
          >
            {{$t('settings.account_settings_tab.password.buttons.cancel')}}
          </v-btn>
          <v-btn
            color="primary"
            text
            @click="authoriseAction()"
          >
            {{$t("settings.account_settings_tab.password.buttons.authorize")}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-card>
    <v-card-title>
      {{$t("settings.account_settings_tab.information.title")}}
      <v-spacer></v-spacer>
      <v-btn  @click="informationEdit = true" icon :disabled="informationEdit">
        <v-icon>
          edit
        </v-icon>
      </v-btn>
    </v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field :value="loggedInUser.firstname":label="this.$t('register_page.register_form.firstname_text_field.label')" :disabled="!informationEdit"></v-text-field>

          <v-text-field :value="loggedInUser.lastname" :label="this.$t('register_page.register_form.lastname_text_field.label')" :disabled="!informationEdit"></v-text-field>
          <v-btn :disabled="!informationEdit">
            {{$t("settings.account_settings_tab.password.buttons.save")}}
          </v-btn>
          <v-btn @click="informationEdit = false" :disabled="!informationEdit">
            {{$t("settings.account_settings_tab.password.buttons.cancel")}}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
    <v-card style="margin-top: 1rem">
      <v-card-title>
        {{$t("settings.account_settings_tab.password.title")}}
        <v-spacer></v-spacer>
        <v-btn  @click="securityDialog = true" icon :disabled="passwordChange">
          <v-icon>
            edit
          </v-icon>
        </v-btn>
      </v-card-title>
     <v-card-text>
       <v-form>
         <v-text-field type="password" id="password" :label="this.$t('settings.account_settings_tab.password.new_password_input.label')" :disabled="!passwordChange"></v-text-field>

         <v-text-field type="password" id="repeat-password"  :label="this.$t('settings.account_settings_tab.password.repeat_password_input.label')" :disabled="!passwordChange"></v-text-field>
         <v-btn :disabled="!passwordChange">
           {{$t("settings.account_settings_tab.password.buttons.save")}}
         </v-btn>
         <v-btn @click="passwordChange = false" :disabled="!passwordChange">
           {{$t("settings.account_settings_tab.password.buttons.cancel")}}
         </v-btn>
       </v-form>
     </v-card-text>
    </v-card>
  </div>


</template>

<script>
    import {mapGetters} from "vuex";

    export default {
        name: "account-settings",
      data(){
          return{
             informationEdit:false,
             passwordChange:false,
            securityDialog:false,
          }
      },
      methods:{
        authoriseAction(){
          this.securityDialog = false;
          this.passwordChange = true;
        }
      },
      computed:{
        ...mapGetters(['isAuthenticated', 'loggedInUser',"userLocale"]),

      }
    }
</script>

<style scoped>

</style>
