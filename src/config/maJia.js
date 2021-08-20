export function maJia() {
	return new Promise(function (resolve, reject) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "//static.app1.magcloud.net/public/static/dest/js/libs/magjs-x.js";
		script.onerror = reject;
		script.onload = resolve;
		document.head.appendChild(script);
	})
}


// WEBPACK FOOTER //
// ./src/config/maJia.js