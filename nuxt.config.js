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
  ],
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
    baseURL: process.env.NODE_ENV !== 'production' ? 'http://localhost/api' : 'http://localhost/api'
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {url: 'user/login', method: 'post', propertyName:'data.token'},
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
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
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
