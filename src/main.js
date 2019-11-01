import Vue from 'vue'
import SmartTable from 'vuejs-smart-table'
import BootstrapVue from 'bootstrap-vue'
import App from './App.vue'
import '@aeternity/aepp-components/dist/aepp.fonts.css'
import '@aeternity/aepp-components/dist/aepp.components.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(SmartTable)
Vue.use(BootstrapVue)

new Vue({
  render: h => h(App),
}).$mount('#app')
