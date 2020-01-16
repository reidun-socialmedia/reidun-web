<template>
  <v-container>
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
      ></v-text-field>
      <v-text-field
        v-model="password"
        :rules="passwordRules"
        label="Password"
        :type="'password'"
        required
      ></v-text-field>
      <v-btn
        color="success"
        class="mr-4"
        @click="login"
      >
        login
      </v-btn>
    </v-form>
  </v-container>
  </template>

<script>
    import Vue from "vue";
    import {mapMutations} from "vuex";

    export default {
        middleware: 'guest',
        layout: 'loginLayout',
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
                              self.setSnack(`${e.response.data[0].message}}`);
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
