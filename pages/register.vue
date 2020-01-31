<template>
  <v-container>
    <v-row>
      <v-col>
        <h1>
          Reidun - register
        </h1>
        <v-card style="padding: 1rem">
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-text-field
              v-model="firstName"
              :rules="firstnameRules"
              label="first name"
              required
            />
            <v-text-field
              v-model="lastName"
              label="last name"
              :rules="lastnameRules"
              required
            />
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
            />
            <v-text-field
              v-model="newPassword"
              :rules="passwordRules"
              label="Password"
              :type="'password'"
              required
            />
            <v-text-field
              v-model="repeatPassword"
              :rules="[passwdRepeatRules]"
              label="Repeat password"
              :type="'password'"
              required
            />
            <v-select
              :items="genders"
              item-value="genders.value"
              item-text="text"
              @change="setChoice"
              :rules="[v => !!v || 'Item is required']"
              label="Gender"
              requried
            />
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="birthdate"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="birthdate"
                  label="bithdate"
                  prepend-icon="today"
                  readonly
                  v-on="on"
                />
              </template>
              <v-date-picker v-model="birthdate" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(birthdate)">OK</v-btn>
              </v-date-picker>
            </v-menu>
            <v-btn
              color="primary"
              class="mr-4"
              :disabled="!valid"
              @click="register"
            >
              register
            </v-btn>
            <v-btn
              color="dark"
              class="mr-4"
              nuxt
              to="/login"
            >
              back
            </v-btn>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import {mapMutations} from "vuex";

  export default {
    layout: 'guestlayout',
    data: () => ({
      valid: true,
      firstName:'',
      lastName:'',
      email: '',
      gender:'',
      newPassword: '',
      repeatPassword:'',
      error: null,
      passwordRules:[
        v => !!v || 'Password is required'
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2}|aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|local)$/.test(v) || 'E-mail must be valid',
      ],
      firstnameRules:[
        v => !!v || 'First name is required',

      ],
      lastnameRules:[
        v => !!v || 'Last name is required',

      ],
      birthdate: new Date().toISOString().substr(0, 10),
      menu: false,
      genders:[
        { text:'Male',value:"male" },
        { text:'Female',value:"female" },
        { text:'Other',value:"other" },

      ]
    }),

    methods: {
      setChoice(choice){
        this.gender = choice
      },
      validate () {
        return !!this.$refs.form.validate();
      },
      async register() {
        let self = this;
              let data = {
                firstname: this.firstName,
                lastname: this.lastName,
                email: this.email,
                gender: this.gender,
                birthday: this.birthdate,
                password: this.newPassword
              }
              await this.$axios.post('/user/register', data).then( res => {
                self.setSnackColor("success");
                self.setSnack("registered successfully");

              }).catch( error => {
                self.setSnackColor("error");
                self.setSnack("Something went wrong")
              })

      },
      ...mapMutations({
        setSnack: 'snackbar/setSnack',
        setSnackTop: 'snackbar/setSnackTop',
        setSnackColor: 'snackbar/setSnackColor'
      }),
    },
    computed:{
      passwdRepeatRules() {
        return () => (this.repeatPassword === this.newPassword) || 'Password must match'
      },
    }
  }
</script>

<style scoped>

</style>
