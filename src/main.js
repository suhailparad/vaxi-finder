import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import vuetify from './plugins/vuetify'
import moment from 'moment'

Vue.prototype.moment = moment
Vue.config.productionTip = false

Vue.use(VueAxios, axios)

Vue.use(require('vue-moment'));

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
