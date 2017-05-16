import Vue from 'vue'
import Router from 'vue-router'
import VLoginIndex from '../components/login_index/login_index.vue'
import VHomeIndex from '../components/home_index/home_index.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      component: VLoginIndex
    },
    {
      path: '/home',
      component: VHomeIndex
    }
  ]
})
