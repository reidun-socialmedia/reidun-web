<template>
  <div>
    <v-card>
      <v-card-title>
        {{$t('settings.account_settings_tab.title')}}
      </v-card-title>


      <!-- Password Verify           -->
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
                type="password"
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
              @click="hideSecurityDialog"
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

      <!-- information -->
      <v-card>
        <v-card-title>
          {{$t("settings.account_settings_tab.information.title")}}
          <v-spacer></v-spacer>
          <v-btn @click="showInformationEdit" icon :disabled="informationEdit">
            <v-icon>
              edit
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field v-model="firstName" :label="this.$t('register_page.register_form.firstname_text_field.label')"
                          :disabled="!informationEdit"></v-text-field>

            <v-text-field v-model="lastName" :label="this.$t('register_page.register_form.lastname_text_field.label')"
                          :disabled="!informationEdit"></v-text-field>

            <!-- Save and Cancel button for Information -->
            <v-btn :disabled="!informationEdit" @click="showSecurityDialog">
              {{$t("settings.account_settings_tab.password.buttons.save")}}
            </v-btn>
            <v-btn @click="cancelEdit" :disabled="!informationEdit">
              {{$t("settings.account_settings_tab.password.buttons.cancel")}}
            </v-btn>
          </v-form>
        </v-card-text>
        <v-card-title>
          {{$t("settings.account_settings_tab.password.title")}}
          <v-spacer></v-spacer>
          <v-btn @click="showPasswordEdit" icon :disabled="passwordEdit">
            <v-icon>
              edit
            </v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <!--  -->
          <v-form v-model="passwordChangeValid">
            <v-text-field
              type="password"
              id="password"
              v-model="newPassword"

              :label="this.$t('settings.account_settings_tab.password.new_password_input.label')"
              :disabled="!passwordEdit"
            >
            </v-text-field>
            <v-text-field
              type="password"
              id="repeat-password"
              v-model="repeatedPassword"

              :label="this.$t('settings.account_settings_tab.password.repeat_password_input.label')"
              :disabled="!passwordEdit"></v-text-field>

            <v-btn @click="showSecurityDialog" :disabled="!passwordEdit || !passwordChangeValid">
              {{$t("settings.account_settings_tab.password.buttons.save")}}
            </v-btn>
            <v-btn @click="cancelEdit" :disabled="!passwordEdit">
              {{$t("settings.account_settings_tab.password.buttons.cancel")}}
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-card>
  </div>
</template>

<script>
  import {mapGetters, mapMutations} from "vuex";

  export default {
    name: "account-details",
    data() {
      return {
        informationEdit: false,
        passwordEdit: false,
        securityDialog: false,
        currentPassword: '',
        repeatedPassword: '',
        newPassword: '',
        passwordChangeValid: false,
        authValid: false,
        firstName: '',
        lastName: '',
        passwordRules: [
          v => {
            return !!v || this.$t('settings.account_settings_tab.password.input_empty')
          },
        ],
        RepeatPasswordRules: [
          v => {
            return !!v || this.$t('settings.account_settings_tab.password.input_empty')
          },
        ],
        NewPasswordRules: [
          v => {
            return !!v || this.$t('settings.account_settings_tab.password.input_empty')
          },
        ]
      }
    },
    mounted() {
      this.firstName = this.loggedInUser.firstname;
      this.lastName = this.loggedInUser.lastname;
    },
    methods: {
      authoriseAction() {

        let data = {
          first_name: this.firstName,
          last_name: this.lastName,
          gender: this.loggedInUser.gender,
          birthday: this.loggedInUser.birthday,
          email: this.loggedInUser.email,
          password: this.newPassword,
          passCheck: this.currentPassword,
          informationEdit: this.informationEdit
        }
        console.log(data);
        self = this
        this.$axios.patch('/user/update/requirePass', data).then(res => {
          this.passwordEdit = false;
          this.informationEdit = false;
          this.newPassword = '';
          this.repeatedPassword = '';
          this.securityDialog = false;
          this.$ws.$emitToServer(`event:${this.loggedInUser.id}`, 'fullNameChanged', {
            user: this.loggedInUser.id
          })
        }).catch(err => {
          self.setSnack(this.$t('snackbar.error_messages.password_change_failed'))
          self.setSnackColor('error')
          this.currentPassword = ''

        })
      },
      showSecurityDialog() {
        this.securityDialog = true;
      },
      hideSecurityDialog() {
        this.securityDialog = false;
      },
      cancelEdit() {
        this.informationEdit = false;
        this.passwordEdit = false;
        this.resetPasswordFields();
        this.resetInformationFields();
      },
      showInformationEdit() {
        this.informationEdit = true;
        this.passwordEdit = false;
        this.resetPasswordFields();
      },
      showPasswordEdit() {
        this.informationEdit = false;
        this.passwordEdit = true;
        this.resetInformationFields();

      },
      resetInformationFields() {
        this.firstName = this.loggedInUser.firstname;
        this.lastName = this.loggedInUser.lastname;
      },
      resetPasswordFields() {
        this.newPassword = '';
        this.repeatedPassword = '';
      },
      ...mapMutations({
        setSnack: 'snackbar/setSnack',
        setSnackTop: 'snackbar/setSnackTop',
        setSnackColor: 'snackbar/setSnackColor'
      })
    },

    computed: {
      ...mapGetters(['isAuthenticated', 'loggedInUser', "userLocale"])
      /*passwordConfirmationRule() {
          return () => (this.newPassword === this.repeatedPassword) || this.$t('settings.account_settings_tab.password.password_mismatch')
      },*/

    },
    watch: {
      newPassword: function (val) {
        if (val === this.repeatedPassword && val !== "") {
          this.passwordChangeValid = true;
        } else {
          this.passwordChangeValid = false;
          this.$t('settings.account_settings_tab.password.password_mismatch')
        }
      },
      repeatedPassword: function (val) {
        if (val === this.newPassword && val !== "") {
          this.passwordChangeValid = true;
        } else {
          this.passwordChangeValid = false;
          this.$t('settings.account_settings_tab.password.password_mismatch');

        }
      }
    }


  }
</script>

