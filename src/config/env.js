/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 *
 */
let NODE_ENV = 'production'
let apiUrl = ''
let uniacid = 1
let pathname = window.location.pathname;
let start = pathname.indexOf('/addons/');
let basepath = pathname.substring(0, start);
// let siteRoot = window.location.protocol + '//' + window.location.host + basepath;
let siteRoot = 'https://123.91ydxk.com';
//let siteRootNohttps = siteRoot.replace('https://', 'http://');
if(NODE_ENV == 'development') {
	apiUrl = '/api';
}else if(NODE_ENV == 'production'){
	apiUrl = siteRoot + '/app/wxapp.php';
	//console.log(apiUrl)
}
window.siteRoot = siteRoot
export {
	apiUrl,
	siteRoot
}




// WEBPACK FOOTER //
// ./src/config/env.js
