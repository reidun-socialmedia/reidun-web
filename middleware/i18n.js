export default function ({ isHMR, app, store, route, params, error, redirect }) {
  const defaultLocale = app.i18n.fallbackLocale
  // If middleware is called from hot module replacement, ignore it
  if (isHMR) return

  if(route.query.lang === undefined){
    if(!process.server){
      if(localStorage.userSpecLang === undefined){
        localStorage.userSpecLang = ''
      }
      if(localStorage.userSpecLang !== ''){
        store.commit('SET_LANG',  localStorage.userSpecLang)
        app.i18n.locale = localStorage.userSpecLang
      }else if(localStorage.userSpecLang === ''){
        store.commit('SET_LANG', navigator.language)
        app.i18n.locale = store.state.locale
      }

    }
  }else{
    const locale = route.query.lang || defaultLocale
    if (store.state.locales.indexOf(locale) === -1) {
      return error({ message: 'This page could not be found.', statusCode: 404 })
    }
    store.commit('SET_LANG', locale)
    // Set locale from the query string '?lang='**''
    app.i18n.locale = store.state.locale
  }

}
