import Vue from 'vue'
import io from 'socket.io-client'
import Buefy from 'buefy'
import 'buefy/dist/buefy.css'
import axios from 'axios'

import App from '~/App.vue'
import router from '~/router'
import store from '~/vuex'
import { humanFileSize, hexAddr } from '~/lib/utils'

import 'material-design-icons/iconfont/material-icons.css'

import { ADD_DEVICE, REMOVE_DEVICE } from '~/vuex/types'

import WSRpc from '~/lib/wsrpc'

//
require('promise.prototype.finally').shim()
axios.defaults.baseURL = '/api'


Vue.use(WSRpc)
Vue.use(Buefy)
Vue.filter('filesize', humanFileSize)
Vue.filter('hex', hexAddr)


const v = new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
})

const socket = io('/devices', { path: '/msg' })
socket
  .on('DEVICE_REMOVE', (dev) => {
    store.commit(REMOVE_DEVICE, dev)
    v.$buefy.toast.open(`${dev.name} has been removed`)
  })
  .on('DEVICE_ADD', (dev) => {
    store.commit(ADD_DEVICE, dev)
    v.$buefy.toast.open(`New device ${dev.name} has been connected`)

    if (v.$route.name === 'welcome')
      v.$router.push({ name: 'apps', params: { device: dev.id }})
  })
  .on('warning', msg => v.$buefy.toast.open(msg))
