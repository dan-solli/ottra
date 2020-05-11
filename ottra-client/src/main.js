import Vue from 'vue'
import Vuetify, { VIcon, VSnackbar, VBtn } from 'vuetify/lib'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import vuetify_sv from './locales/vuetify.sv'
import vuetify_en from 'vuetify/es5/locale/en'

import '@mdi/font/css/materialdesignicons.css' 
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.use(Vuetify)

const vuetify_opts = {
	components: {
		VIcon, VSnackbar, VBtn
	},
	icons: {
		iconfont: 'mdi',
	},
	lang: {
		locales: { vuetify_sv, vuetify_en },
		current: 'vuetify_' + (navigator.language.split('-')[0] || 'en'),
		t: (key, ...params) => i18n.t(key, params)
	}
}

import VueGeolocation from 'vue-browser-geolocation';

import Vuelidate from 'vuelidate'
import VuelidateErrorExtractor, { templates } from 'vuelidate-error-extractor'
import FormGroup from "./components/FormGroup.vue";
import FormSummary from "./components/FormSummary.vue";

import VueTour from 'vue-tour'
import VuetifyToast from 'vuetify-toast-snackbar'

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

Vue.use(require('vue-shortkey'))


router.beforeEach(async function(to, from, next) {
	if (to.meta.noAuthRequired) {
		next()
	}	else {
		if (await store.dispatch("getThisUser")) {
			next()
		} else {
			await store.dispatch("clearStore")
			next('/')
		}
	}
});

router.afterEach(async function(to, from) {
	// Is there a new mode, clear the old mode.
	// Is there a new view, clear the new view.

	// I have a strong feeling this should be on a lower level than global. 
	// Can the vuex store handle this by itself. It knows when it has a mode and it is changing.
	// Same with views. Perhaps not clear it willy-nilly without knowing if it has to be done or not.
	await store.dispatch('clearItems')
})

new Vue({
  router,
  store,
  i18n,
  vuetify: new Vuetify(vuetify_opts),
  render: h => h(App)
}).$mount('#app')

