<template>
  <v-container>
    <v-row>
      <v-col class="d-none d-lg-block">
        <v-carousel
          hide-delimiters
          continuous
          :show-arrows="false"
          :cycle="true"
        >
          <v-carousel-item
            v-for="(slide, i) in slides"
            :key="i"
          >
            <v-sheet
              height="100%"
            >
              <v-card>
                <v-row
                  class="fill-height"
                  align="center"
                  justify="center"
                >
                  <v-col><v-card-title>{{ slide.title }}</v-card-title><v-card-text> {{ slide.description }} </v-card-text></v-col>


                </v-row>
              </v-card>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-col>
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
              :return-value.sync="birthday"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="birthday"
                  label="birthdate"
                  :rules="birthDayRules"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="birthday" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(birthday)">OK</v-btn>
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
    import moment from 'moment'

    export default {
        layout: 'guestlayout',
        directives: {
            mask,
        },
        data: () => {
            return ({
                valid: true,
                firstName: '',
                lastName: '',
                email: '',
                gender: '',
                newPassword: '',
                repeatPassword: '',
                birthday: '',
                error: null,
                slides: [
                    { title:'Reidun', description: 'Free open source social media'},
                    { title:'Reidun on mobile', description: 'On the go? \n don\'t worry, download native version'},
                ],
                passwordRules: [
                    v => !!v || 'Password is required'
                ],
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2}|aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|local)$/.test(v) || 'E-mail must be valid',
                ],
                firstnameRules: [
                    v => !!v || 'First name is required',

                ],
                lastnameRules: [
                    v => !!v || 'Last name is required',

                ],
                menu: false,
                genders: [
                    {
                        text: 'Male',
                        value: "male"
                    },
                    {
                        text: 'Female',
                        value: "female"
                    },
                    {
                        text: 'Other',
                        value: "other"
                    },

                ],
                birthDayRules: [
                    v => !!v || 'Birthday cannot be empty',
                    v => {
                        const checkingDate = moment(v)
                        const maxDate = moment().subtract(16, 'y').endOf('year')
                        const minDate = moment('01-01-1945')
                            if(checkingDate.isBetween(minDate, maxDate)){
                                return true
                            }else{
                                return 'must be 16 or older'
                            }
                    }
                ]
            });
        },

        methods: {
            setChoice(choice) {
                this.gender = choice
            },
            validate() {
                return !!this.$refs.form.validate();
            },
            async register() {
                let self = this;
                let data = {
                    firstname: this.firstName,
                    lastname: this.lastName,
                    email: this.email,
                    gender: this.gender,
                    birthday: this.birthday,
                    password: this.newPassword
                }
                await this.$axios.post('/user/register', data).then(res => {
                    self.setSnackColor("success");
                    self.setSnack("registered successfully");
                    this.$router.push('/')

                }).catch(error => {
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
        computed: {
            passwdRepeatRules() {
                return () => (this.repeatPassword === this.newPassword) || 'Password must match'
            },
        }
    }
</script>

<style scoped>

</style>
