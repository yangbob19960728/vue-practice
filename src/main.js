import Vue from 'vue';

import axios from 'axios';
import VueAxios from 'vue-axios';
import 'bootstrap';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/vue-loading.css';
import App from './App.vue';
import router from './router';
import './bus';
import currencyFilter from './filters/currency';
Vue.config.productionTip = false;


axios.defaults.withCredentials = true;

Vue.use(VueAxios, axios);
// Vue.use(VeeValidate);
Vue.component('Loading',Loading)

Vue.filter('currency',currencyFilter)
router.beforeEach((to,from,next)=>{
  if(to.meta.requiresAuth){
    const api = process.env.VUE_APP_APIPATH + 'api/user/check';
    const vm = this;
    axios.post(api).then((response) => {
    if(response.data.success){
      next();
    }else{
      next({
        path:'/login'
      })
    }
    })
  }else{
    next();
  }
  
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
