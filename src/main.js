// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import FastClick from 'fastclick'
import loading from '@/components/loading'
import failedTips from '@/components/failedTips'
// import PublicFooter from '@/components/footer'
import store from './store'
import router from './router'
import Vant from 'vant'
import { Lazyload } from 'vant';
import 'vant/lib/index.css'
import 'vant/lib/icon/local.css'
import util from '@/config/util'
import wx from '@/config/WeixinSdk.js'
import VueClipboard from 'vue-clipboard2'
import "babel-polyfill"
//rem引入：引入文件后，查看页面的html节点，是否有被自动添加 font-size。
//import '@/config/rem'



// /*let VConsole = require('../node_modules/vconsole/dist/vconsole.min');
// let vConsole = new VConsole();//初始化
// Vue.use(vConsole);//设为全局*/



Vue.use(require('vue-wechat-title'))
Vue.use(Vant)
Vue.use(Lazyload, {
	lazyComponent: true,
	loading: '',
})
Vue.use(VueClipboard)

Vue.component('iloading', loading);
Vue.component('failedTips', failedTips);

Vue.config.productionTip = false
Vue.prototype.util = util
Vue.prototype.wx = wx
Vue.prototype.isWeixin = util.isWeixin();
Vue.prototype.theme = util.getStorage('theme');

Vue.prototype.util.initBaseParams();
Vue.prototype.wx.init();


//com js
import comjs from "../comfun/com.js";
Vue.prototype.comjs = comjs

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: { App },
	template: '<App/>'
})





// WEBPACK FOOTER //
// ./src/main.js
