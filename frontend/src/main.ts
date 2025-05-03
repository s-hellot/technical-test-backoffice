import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import VuelidatePlugin from '@vuelidate/core'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

createApp(App)
    .use(router)
    .use(VuelidatePlugin)
    .mount('#app')
