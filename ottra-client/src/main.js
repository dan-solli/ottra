import Vue from 'vue'
import Vuetify, { VIcon, VSnackbar, VBtn } from 'vuetify/lib'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'

import 'vuetify/dist/vuetify.min.css'


Vue.use(Vuetify)

const vuetify_opts = {
	components: {
		VIcon, VSnackbar, VBtn
	},
	icons: {
	  iconfont: 'md',
	}
}

import VueGeolocation from 'vue-browser-geolocation';

import Vuelidate from 'vuelidate'
import VuelidateErrorExtractor, { templates } from 'vuelidate-error-extractor'
import FormGroup from "./components/FormGroup.vue";
import FormSummary from "./components/FormSummary.vue";

import VueTour from 'vue-tour'
import VuetifyToast from 'vuetify-toast-snackbar'
import VueLogger from 'vuejs-logger'

const isProduction = process.env.NODE_ENV === 'production'

require('vue-tour/dist/vue-tour.css')

Vue.config.productionTip = false

Vue.use(VueGeolocation)

Vue.use(Vuelidate)
Vue.use(VuelidateErrorExtractor, { 
	i18n: 'validation',
	i18nAttributes: {
		__default: "validation.attributes"
	}
})
Vue.component("FormGroup", FormGroup);
Vue.component("FormSummary", FormSummary);
Vue.component('FormWrapper', templates.FormWrapper)

Vue.use(VueTour)

Vue.use(VuetifyToast, {
	x: 'center',
	timeout: 4000,
	queueable: true,
	showClose: true
})

Vue.use(VueLogger, {
	isEnabled: true,
/*	
	logLevel: isProduction ? 'error' : 'debug',
	stringifyArguments: true,
	showLogLevel: true,
	showMethodName: true,
	separator: '|',
	showConsoleColors: true
*/	
})

router.beforeEach((to, from, next) => {
	
	console.log("main.js: Entering router.beforeEach")
	
	if (to.matched.some(record => record.meta.noAuthRequired)) {
		console.log("main.js: router.beforeEach: Route requires no authentication")
		next()
	}	else {
		console.log("main.js: router.beforeEach: Route requires authentication")
		next()
/*		
		Promise.all([ store.dispatch("checkAuth") ])
		.then(function() {
			
			console.log("main.js: router.beforeEach: checkAuth success.")
			
			next()
		})
		.catch(function(error) {
			
			console.log("main.js: router.beforeEach: checkAuth failed, somehow")
			console.log("main.js: router.beforeEach: Redirecting to /login")
			
			next({
				path: '/login',
				query: { redirect: to.fullPath }
			})
		})
*/		
	}
});

new Vue({
  router,
  store,
  i18n,
  vuetify: new Vuetify(vuetify_opts),
  render: h => h(App)
}).$mount('#app')



