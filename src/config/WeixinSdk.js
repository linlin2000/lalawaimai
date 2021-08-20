import util from '@/config/util'
import wx from 'weixin-js-sdk'

let readyStacks = [];
let isReady = false;
class SDK {
	static init(config = {}) {
		if(!config.apis) {
			config.apis = [
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'onMenuShareQQ',
				'onMenuShareQZone',
				'onMenuShareWeibo',
				'hideMenuItems',
				'showMenuItems',
				'hideAllNonBaseMenuItem',
				'showAllNonBaseMenuItem',
				'translateVoice',
				'startRecord',
				'stopRecord',
				'onRecordEnd',
				'playVoice',
				'pauseVoice',
				'stopVoice',
				'uploadVoice',
				'downloadVoice',
				'chooseImage',
				'previewImage',
				'uploadImage',
				'downloadImage',
				'getNetworkType',
				'openLocation',
				'getLocation',
				'hideOptionMenu',
				'showOptionMenu',
				'closeWindow',
				'scanQRCode',
				'chooseWXPay',
				'openProductSpecificView',
				'addCard',
				'chooseCard',
				'openCard'
			];
		}
		let pars = {};
		if(location.hash) {
			pars.url = location.href.slice(0, -location.hash.length);
		} else {
			pars.url = location.href;
		}
		util.request({
			url: 'system/common/jssdk',
			data: pars,
		}).then((res) => {
			let result = res.data.message;
			if(result.errno) {
				console.log('配置错误, 初始化微信JS接口失败:');
				console.log(result.message);
				return;
			} else {
				wx.ready(() => {
					if(config.shareData) {
						SDK.share(config.shareData);
					}
					if(config.hideOption === true) {
						wx.hideOptionMenu();
					}
					isReady = true;
					if(readyStacks.length > 0) {
						for(let cb of readyStacks) {
							cb();
						}
					}
				});
				result = result.message.jssdkconfig;
				wx.config({
					debug: result.debug || false,
					appId: result.appId,
					timestamp: parseInt(result.timestamp),
					nonceStr: result.nonceStr,
					signature: result.signature,
					jsApiList: config.apis.slice(0)
				});

				wx.error(function(res){
					if(result.debug) {
						//alert(JSON.stringify(res));
					}
					console.log('微信JSSDK初始化失败');
					console.log(res);
				});
				if(typeof callback == 'function') {
					callback();
				}
			}
		});
	}

	static share(shareData) {
		if(!shareData) {
			shareData = window.shareData;
		}
		let shareFunc = (extend) => {
			let obj = {
				title: shareData.title,
				link: shareData.link,
				imgUrl: shareData.imgUrl,
				success: () => {
					if(typeof shareData.success == 'function') {
						shareData.success();
					}
				},
				cancel: () => {
					if(typeof shareData.cancel == 'function') {
						shareData.cancel();
					}
				}
			};
			return Object.assign(obj, extend);
		};

		SDK.ready(function(){
/*
			wx.updateTimelineShareData(shareFunc({
				desc: shareData.desc,
				type: 'link',
				dataUrl: ''
			}));

			wx.updateAppMessageShareData(shareFunc({}));

*/
			wx.onMenuShareTimeline(shareFunc({}));
			wx.onMenuShareAppMessage(shareFunc({
				desc: shareData.desc,
				type: 'link',
				dataUrl: ''
			}));
			wx.onMenuShareQQ(shareFunc({
				desc: shareData.desc,
				type: 'link',
				dataUrl: ''
			}));
			wx.onMenuShareQZone(shareFunc({}));
		})
	}

	static ready(callback) {
		if(isReady) {
			wx.ready(callback);
		} else {
			readyStacks.push(callback);
		}
	}
};

export default SDK;



// WEBPACK FOOTER //
// ./src/config/WeixinSdk.js