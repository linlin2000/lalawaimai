export function Amap() {
	return new Promise(function (resolve, reject) {
		window.initMap = function () {
			resolve(AMap);
		}
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "//webapi.amap.com/maps?v=1.4.1&key=550a3bf0cb6d96c3b43d330fb7d86950&callback=initMap";
		script.onerror = reject;
		document.head.appendChild(script);
	})
}


// WEBPACK FOOTER //
// ./src/config/AMap.js