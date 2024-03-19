import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { store } from './store';
import { router } from './router';
import VueCookies from 'vue-cookies'

const app = createApp(App);

app.use(router);
app.use(store);
app.use(VueCookies)

app.mount('#app');
