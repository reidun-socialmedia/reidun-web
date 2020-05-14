const colors = require('vuetify/es5/util/colors').default

module.exports = {
  mode: 'spa',
  /*
  ** Headers of the page
  */
  loading: '~/components/loading-page.vue',

  head: {
    titleTemplate: '%s - Reidun' ,
    title: 'Reidun',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
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
    '~/plugins/vue-ws',
    '~/plugins/i18n.js',

  ],
  router: {
    middleware: ['i18n']
  },
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth'

  ],
  axios: {
    baseURL: process.env.NODE_ENV !== 'production' ? `http://192.168.1.11/api` :  `http://192.168.1.11/api`
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
