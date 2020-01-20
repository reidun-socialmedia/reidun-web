<template>
  <v-container>
  <v-row>
    <v-col>
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
   <v-card style="padding: 1rem">
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
    <v-text-field
      v-model="email"
      :rules="emailRules"
      label="E-mail"
      required
    />
    <v-text-field
      v-model="password"
      :rules="passwordRules"
      label="Password"
      :type="'password'"
      required
    />
      <v-btn
        color="primary"
        class="mr-4"
        @click="login"
      >
        login
      </v-btn>
      <v-btn
        color="dark"
        class="mr-4"
        nuxt
        to="/register"
      >
        register
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
        data: () => ({
            valid: true,
            email: '',
            password: '',
            error: null,
            passwordRules:[
                v => !!v || 'Password is required'
            ],
            emailRules: [
                v => !!v || 'E-mail is required',
                v => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v) || 'E-mail must be valid',
            ],
          slides: [
            { title:'Reidun', description: 'Free open source social media'},
            { title:'Reidun on mobile', description: 'On the go? \n don\'t worry, download native version'},
          ],
        }),

        methods: {
            validate () {
                return !!this.$refs.form.validate();
            },
            async login() {
                let self = this;
                if(this.email !== "" || this.password !== ""){
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
                          console.log(e.response)
                            if (e.response.data[0].field === 'email' || e.response.data[0].field === "password" ) {
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
                }else{
                    self.setSnackColor("error");
                    self.setSnack("Missing user details in fields");
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
