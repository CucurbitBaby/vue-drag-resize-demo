import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store'
import * as svgicon from 'vue-svgicon'
import App from './App.vue'
import 'reset-css'


Vue.use(ElementUI)

Vue.use(svgicon, {
  tagName: 'svgicon'
})


Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
