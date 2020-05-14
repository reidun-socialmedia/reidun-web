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
          <v-form v-model="authValid">
            <v-text-field
              :type="'password'"
              v-model="currentPassword"
              :rules="passwordRules"
              :label="this.$t('settings.account_settings_tab.password.security_dialog.password_input.label')"
              required
            >

            </v-text-field>
          </v-form>
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
            :disabled="!authValid"
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
       <v-form   v-model="passwordChangeValid">
           <v-text-field
               type="password"
               id="password"
               v-model="newPassword"
               :rules="[NewPasswordRules,passwordConfirmationRule]"
               :label="$t('settings.account_settings_tab.password.new_password_input.label')"
               :disabled="!passwordChange"
         >
         </v-text-field>
         <v-text-field
           type="password"
           id="repeat-password"
           v-model="repeatedPassword"
           :rules="[RepeatPasswordRules,passwordConfirmationRule]"
           :label="this.$t('settings.account_settings_tab.password.repeat_password_input.label')"
           :disabled="!passwordChange"></v-text-field>

         <v-btn @click="changePassword()" :disabled="!passwordChange || !passwordChangeValid">
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
  import {mapGetters, mapMutations} from "vuex";

    export default {
      name: "account-settings",

      data(){
          return{
             informationEdit:false,
             passwordChange:false,
             securityDialog:false,
             currentPassword: '',
             repeatedPassword:'',
             newPassword: '',
             passwordChangeValid:false,
             authValid:false,
             passwordRules:[
               v => {
                    return !!v || this.$t('settings.account_settings_tab.password.input_empty')
               },
             ],
             RepeatPasswordRules:[
              v => {
                return !!v || this.$t('settings.account_settings_tab.password.input_empty')
              },
            ],
             NewPasswordRules:[
              v => {
                return !!v || this.$t('settings.account_settings_tab.password.input_empty')
              },
            ],

          }
      },
      methods:{
        authoriseAction(){
          let data = {
            password: this.currentPassword
          }
          self = this
          this.$axios.post('/user/comparepassword',data).then(res => {
            this.securityDialog = false;
            this.passwordChange = true;
            this.currentPassword = ''

          }).catch(err => {
            self.setSnack(this.$t('settings.account_settings_tab.password.security_dialog.password_input.password_incorrect'))
            self.setSnackColor('error')
            this.currentPassword = ''

          })

        },
        changePassword(){
          let data = {
            first_name: this.loggedInUser.firstname,
            last_name: this.loggedInUser.lastname,
            gender: this.loggedInUser.gender,
            birthday: this.loggedInUser.birthday,
            email: this.loggedInUser.email,
            password: this.newPassword,

          }
          self = this
          this.$axios.patch('/user/update',data).then(res => {
            this.passwordChange = false;
            this.newPassword = ''
            this.repeatedPassword = ''


          }).catch(err => {
            self.setSnack(this.$t('snackbar.error_messages.password_change_failed'))
            self.setSnackColor('error')
            this.currentPassword = ''

          })
        },
        ...mapMutations({
          setSnack: 'snackbar/setSnack',
          setSnackTop: 'snackbar/setSnackTop',
          setSnackColor: 'snackbar/setSnackColor'
        }),
      },
      computed:{
        ...mapGetters(['isAuthenticated', 'loggedInUser',"userLocale"]),
        passwordConfirmationRule() {
          return () => (this.newPassword === this.repeatedPassword) || this.$t('settings.account_settings_tab.password.password_mismatch')
        },

      },

    }
</script>

<style scoped>

</style>
