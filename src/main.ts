import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import VueApexCharts from 'vue3-apexcharts'

import debounce from './directives/debounceDirective'
import App from './App.vue'
import router from './router'
import { Icon } from '@iconify/vue'

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)
app.use(pinia)
app.use(router)
app.component('Apexchart', VueApexCharts)
app.component('Iconify', Icon)
app.directive('debounce', (el, binding) => debounce(el, binding))
app.mount('#app')
