import { createWebHashHistory, createRouter } from 'vue-router'

import TimerView from './TimerView.vue'
import AboutView from './AboutView.vue'
import TimerViewFront from './TimerViewFront.vue'
import NotFoundComponent from './NotFoundComponent.vue'

const routes = [
  { path: '/', component: AboutView },
  { path: '/about', component: AboutView },
  { path: '/old-timer', component: TimerView },
  { path: '/timer', component: TimerViewFront },
  { path: '/:pathMatch(.*)', component: NotFoundComponent}
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router