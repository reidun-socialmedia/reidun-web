import Vue from "vue"
import Ws from '@adonisjs/websocket-client'
import WsPlugin from 'adonis-vue-websocket'
Vue.use(WsPlugin, { adonisWS: Ws })
