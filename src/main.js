import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import i18n from './lang'
import '@/assets/styles/global.scss'
import '@/assets/styles/icon.css'
import '@/assets/fonts/daysOne.css'
// import './mock' （mockjs 不支持 blob 下载，请使用 devServer 代替）
import './utils/boost'
import './utils/create-api'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
