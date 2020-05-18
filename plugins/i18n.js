import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export default ({app, store}) => {
  app.i18n = new VueI18n({ //construction a new VueI18n
    locale: store.state.locale,
    fallbackLocale: 'en-us',
    messages: {
      //'locales' directory contains all the translations in the form of json files
      'sq': require('~/locales/sq/sq-AL.json'),
      'da': require('~/locales/da/da-DK.json'),
      'zh-cn':require('~/locales/zh-CN/zh-CN.json'),
      'de': require('~/locales/de/de-DE.json'),
      'en-uk': require('~/locales/en-GB/en-GB.json'),
      'en-us': require('~/locales/en-US/en-US.json'),
      'fr': require('~/locales/fr/fr-FR.json'),
      'nb': require('~/locales/nb/nb-NO.json'),
      'nl': require('~/locales/nl/nl-NL.json'),
      'nn': require('~/locales/nn-NO/nn-NO.json'),
      'sr': require('~/locales/sr/sr-SP.json'),
      'es': require('~/locales/es-ES/es-ES.json'),
      'se': require('~/locales/sv-SE/sv-SE.json'),
    }
  })
}
