import Vue from 'vue';
import 'normalize.css';
import router from './router/router';
import App from '@/app.vue';
// element-ui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/scss/index.scss'
import '@/assets/iconfont/iconfont.css'
import '@/register/'
import storage from "@/helper/storage"

Vue.use(ElementUI)
Vue.config.productionTip = false
Vue.config.devtools = true
new Vue({
    el: '#app',
    router,
    render: h => h(App)
});