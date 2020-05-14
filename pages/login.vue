<template>
  <v-container>
    <v-row>
      <v-col
        class="d-none d-lg-block"

      >
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
                  <v-col>
                    <v-card-title>{{ slide.title }}</v-card-title>
                    <v-card-text> {{ slide.description }}</v-card-text>
                  </v-col>


                </v-row>
              </v-card>
            </v-sheet>
          </v-carousel-item>
        </v-carousel>
      </v-col>
      <v-col>
        <h1>
          {{$t("login_page.title")}}
        </h1>
        <v-card style="padding: 1rem">
          <v-form
            ref="form"
            v-model="valid"
          >
            <v-text-field
              v-model="email"
              :rules="emailRules"
              :label="this.$t('login_page.login_form.email_text_field.label')"
              required
            />
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              :label="this.$t('login_page.login_form.password_field.label')"
              :type="'password'"
              required
            />
            <v-btn
              color="primary"
              class="mr-4"
              :disabled="!valid"
              @click="login"
            >
              {{$t('login_page.login_form.login_button.label')}}
            </v-btn>
            <v-btn
              color="dark"
              class="mr-4"
              nuxt
              to="/register"
            >
              {{$t('login_page.login_form.register_button.label')}}

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
        name: 'login',
        data() {
            return {
                valid: true,
                email: '',
                password: '',
                error: null,
                passwordRules: [
                    v => {
                        return !!v || this.$t('login_page.login_form.password_field.input_empty')
                    }
                ],
                emailRules: [
                    v => {
                        return !!v || this.$t('login_page.login_form.email_text_field.input_empty')
                    },
                    v => {
                        return /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+(?:[a-zA-Z]{2}|aero|asia|biz|cat|com|coop|edu|gov|info|int|jobs|mil|mobi|museum|name|net|org|pro|tel|travel|local)$/.test(v) || this.$t('login_page.login_form.email_text_field.email_not_valid')
                    },
                ],
                slides: [
                    {
                        title: this.$t('login_page.slide_show.page_1.title'),
                        description: this.$t('login_page.slide_show.page_1.text')
                    },
                    {
                        title: this.$t('login_page.slide_show.page_2.title'),
                        description: this.$t('login_page.slide_show.page_2.text')
                    },
                ],
            }

        },

        methods: {
            validate() {
                return !!this.$refs.form.validate();
            },
            async login() {
                let self = this;
                if (this.email !== "" || this.password !== "") {
                    if (this.validate()) {
                        try {
                            await this.$auth.loginWith('local', {
                                data: {
                                    email: this.email,
                                    password: this.password
                                }
                            })
                            this.$router.push('/')
                        } catch (e) {
                            self.setSnackColor("error");
                            self.setSnack(`${e.message}`);
                            if (e.response.data[0].field === 'email' || e.response.data[0].field === "password") {
                                self.setSnackColor("error");
                                self.setSnack('Email or password incorrect');
                            } else {
                                self.setSnackColor("error");
                                self.setSnack(`${e.response.data[0].message}`);
                            }

                        }
                    } else {
                        self.setSnackColor("error");
                        self.setSnack("Validation in fields failed");
                    }
                } else {
                    self.setSnackColor("error");
                    self.setSnack("Missing users details in fields");
                }


            },
            ...mapMutations({
                setSnack: 'snackbar/setSnack',
                setSnackTop: 'snackbar/setSnackTop',
                setSnackColor: 'snackbar/setSnackColor'
            })
        },


    }
</script>

<style scoped>

</style>
