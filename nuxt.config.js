const colors = require('vuetify/es5/util/colors').default
const dotenv = require('dotenv');
dotenv.config();


module.exports = {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  head: {
    titleTemplate: '%s - Reidun' ,
    title: 'Reidun',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' },
      { hid: 'description', name: 'description', content: 'A Open Source Social Media' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      {rel:'stylesheet', href:"https://fonts.googleapis.com/css?family=Material+Icons" }

    ]
  },

  /*
  ** Customize the progress-bar color
  */
  /*
  ** Global CSS
  */
  css: [
    '~/assets/global.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
<<<<<<< HEAD

    { src:'~/plugins/vue-ws'},
    { src:'~/plugins/i18n.js'},
    { src:'~/plugins/VueNativeNotification.js'},
    { src:'~/plugins/vue-sanitize.js'}
=======
    '~/plugins/vue-ws',
    '~/plugins/i18n.js',

>>>>>>> parent of 3872e91... added Sanitize and regex on URL on all coments an and posts.
  ],
  router: {
    middleware: ['i18n']
  },
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'

  ],
  axios: {
    baseURL: process.env.NODE_ENV !== 'production' ? `http://${process.env.development_ip}/api` :  `https://${process.env.production_ip}/api`
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: 'user/login', method: 'post', propertyName:'data.token'},
          user: { url: 'user', method: 'get', propertyName: 'data' },
          logout: false
        }
      }
    }
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {

        dark: {
          background: '#212121',
          appBarBackground: '#e3314c',
          drawerBackground: '#2c2c2c',
          buttomNavbackground:'#2c2c2c',
          primary: '#e91e63',
          secondary: '#6d6d6d',
          accent: '#009688',
          error: '#f44336',
          warning: '#ff9800',
          info: '#607d8b',
          success: '#4caf50'
        },
        light: {
          background: '#eaeaea',
          appBarBackground: '#e3314c',
          drawerBackground: '#dbdbdb',
          buttomNavbackground:'#dbdbdb',
          primary: '#e91e63',
          secondary: '#6d6d6d',
          accent: '#009688',
          error: '#f44336',
          warning: '#ff9800',
          info: '#607d8b',
          success: '#4caf50'
           },
        }
    },
    defaultAssets: {
      font: true,
      icon: 'mdi',
    },
    icons: {
      iconfont: 'mdi',

    }
  },
  server: {
    port: process.env.server_port, // default: 3000
    host: process.env.server_ip // default: localhost
  },

  /*
  ** Build configuration
  */
  build: {

    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
