import App from './App'

// Vue.prototype.$store = store

// #ifdef H5
import quill from "quill";
window.Quill = quill;
// #endif

// #ifndef VUE3
import Vue from 'vue'
import store from "./store/index.js"
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({

	store,
	...App
	// store
})
app.$mount()
// #endif

// #ifdef VUE3
import {
	createSSRApp
} from 'vue'
export function createApp() {
	const app = createSSRApp(App)
	return {
		app
	}
}
// #endif