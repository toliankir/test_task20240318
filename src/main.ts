import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { store } from './store';
import { router } from './router';
import VueCookies from 'vue-cookies'
import mitt from 'mitt';

const emitter = mitt();
const app = createApp(App);

app.use(router);
app.use(store);
app.use(VueCookies)

app.config.globalProperties.emitter = emitter;

app.mount('#app');
