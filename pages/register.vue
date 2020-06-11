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
          {{$t("register_page.title")}}
        </h1>
        <v-card style="padding: 1rem">
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-text-field
              v-model="firstName"
              :rules="firstnameRules"
              :label="this.$t('register_page.register_form.firstname_text_field.label')"
              required
            />
            <v-text-field
              v-model="lastName"
              :label="this.$t('register_page.register_form.lastname_text_field.label')"
              :rules="lastnameRules"
              required
            />
            <v-text-field
              v-model="email"
              :rules="emailRules"
              :label="this.$t('register_page.register_form.email_text_field.label')"
              required
            />
            <v-text-field
              v-model="newPassword"
              :rules="passwordRules"
              :label="this.$t('register_page.register_form.password_field.label')"
               type="password"
              required
            />
            <v-text-field
              v-model="repeatPassword"
              :rules="[passwdRepeatRules]"
              label="Repeat password"
              :label="this.$t('register_page.register_form.repeat_password_field.label')"
              type="password"
              required
            />
            <v-select
              :items="genders"
              item-value="value"
              item-text="text"
              @change="setChoice"
              :rules="[v => { !!v || this.$t('register_page.register_form.gender_selection.input_empty') }]"
              :label="this.$t('register_page.register_form.gender_selection.label')"
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
                  :label="$t('register_page.register_form.birthday.label')"
                  :rules="birthDayRules"
                  prepend-icon="event"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker :locale="userLocale"  :first-day-of-week="firstDayOfWeek" v-model="birthday" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">{{this.$t('register_page.register_form.birthday.dialog_buttons.cancel')}}</v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(birthday)">{{this.$t('register_page.register_form.birthday.dialog_buttons.ok')}}</v-btn>
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
  import {mapGetters, mapMutations} from "vuex";
    import moment from 'moment'
    //import XRegExp from 'xregexp'

    export default {
        layout: 'guestlayout',
        data () {
            return {
                valid: true,
                firstName: '',
                lastName: '',
                email: '',
                firstDayOfWeek:'',
                gender: '',
                newPassword: '',
                repeatPassword: '',
                birthday: '',
                error: null,
                slides: [
                {
                  title: this.$t('register_page.slide_show.page_1.title'),
                  description: this.$t('register_page.slide_show.page_1.text')
                },
                {
                  title: this.$t('register_page.slide_show.page_2.title'),
                  description: this.$t('register_page.slide_show.page_2.text')
                },
              ],
              passwordRules: [
                    v => {
                          return !!v || this.$t('register_page.register_form.password_field.input_empty')
                    }
                ],
                emailRules: [
                  v => {
                    return !!v || this.$t('register_page.register_form.email_text_field.input_empty')
                  },
                    v => {
                          return /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2}|aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|local|space|dk|de)$/.test(v)
                          || this.$t('register_page.register_form.email_text_field.email_not_valid')
                    }
                ],
                firstnameRules: [
                  v =>  {
                     return XRegExp('^\\p{L}*$').test(v) ||  this.$t('register_page.register_form.email_text_field.lastname_not_valid')

                  },
                  v => {
                    return !!v || this.$t('register_page.register_form.firstname_text_field.input_empty')
                  }

                ],
                lastnameRules: [
                  v =>  {
                    return XRegExp('^\\p{L}*$').test(v) ||  this.$t('register_page.register_form.email_text_field.lastname_not_valid')

                  },
                  v => {
                    return !!v || this.$t('register_page.register_form.lastname_text_field.input_empty')
                  }

                ],
                menu: false,
                genders: [
                    {
                        text: this.$t('register_page.register_form.gender_selection.genders.male'),
                        value: "male"
                    },
                    {
                        text:  this.$t('register_page.register_form.gender_selection.genders.female'),
                        value: "female"
                    },
                    {
                        text: this.$t('register_page.register_form.gender_selection.genders.other'),
                        value: "other"
                    },

                ],
                birthDayRules: [
                    v => { !!v ||  this.$t('register_page.register_form.birthday.input_empty') },
                    v => {
                        const checkingDate = moment(v)
                        const maxDate = moment().subtract(16, 'y').endOf('year')
                        const minDate = moment().subtract(100,'y').startOf('year')

                        if(checkingDate.isBetween(minDate, maxDate)){
                                return true
                            }else{
                                return this.$t('register_page.register_form.birthday.younger_than_16')
                            }
                    }
                ]
            }
        },
        mounted() {
          this.firstDayOfWeek = moment.localeData(this.userLocale).firstDayOfWeek();

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
          ...mapGetters(['isAuthenticated', 'loggedInUser',"userLocale"]),
          passwdRepeatRules() {
                return () => (this.repeatPassword === this.newPassword) || 'Password must match'
            },
        }
    }
</script>

<style scoped>

</style>
