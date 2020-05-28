export const getters = {
  isAuthenticated(state) {
    return state.auth.loggedIn
  },

  loggedInUser(state) {
    return state.auth.user
  },
  userLocale(state) {
    return state.locale
  },

}

export const state = () => ({
  counter: 0,
  locales: ['sq', 'da', 'zh-cn','de', 'en-uk', 'en-us', 'fr', 'nb' , 'nl', 'nn', 'ja', 'sr', 'se','es'],
  locale: 'en-us',
})

export const mutations = {
  SET_LANG (state, locale) {
    if (state.locales.indexOf(locale) !== -1) {
      state.locale = locale
    }

  },
  UpdateUser (state,user) {
     state.auth.user = user;
  }
}


