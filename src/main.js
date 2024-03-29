// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import VueLazyload from 'vue-lazyload'
import titleMixin from './mixins/titleMixin'
import VueMeta from 'vue-meta'

Vue.use(VueMeta)
Vue.mixin(titleMixin) // not working on page navigation

Vue.use(VueLazyload, {
  observer: true,
  loading: '/static/img/blank-profile-picture.png',
  error: '/static/img/placeholder-image.png', // https://stackoverflow.com/a/47677814
})
Vue.config.productionTip = false;

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  router,
  components: { App },
  render: (h) => {
    return h(App)
  },
  mounted () {
    // You'll need this for renderAfterDocumentEvent.
    document.dispatchEvent(new Event('render-event'))
  }
})
// .$mount('#app')

/* document.addEventListener('DOMContentLoaded', function () {
  // this assumes App.vue template root element has `id="app"
  app.$mount('#app')
}); */
