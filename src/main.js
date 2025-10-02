import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import mitt from 'mitt'
import { i18n } from './i18n'
import './assets/main.css'

const emitter = mitt()
const app = createApp(App)

app.provide('emitter', emitter)

app.use(router)
app.use(i18n)
app.mount('#app')