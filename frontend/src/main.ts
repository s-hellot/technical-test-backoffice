import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import VuelidatePlugin from '@vuelidate/core'
import 'bootstrap/dist/css/bootstrap.min.css';

createApp(App)
    .use(router)
    .use(VuelidatePlugin)
    .mount('#app')
