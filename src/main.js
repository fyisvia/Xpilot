import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import mitt from 'mitt'
import './assets/main.css'

const emitter = mitt()
const app = createApp(App)

app.provide('emitter', emitter)

app.use(router)
app.mount('#app')
