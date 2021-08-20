import { apiUrl, siteRoot} from "./env"
import wx from 'weixin-js-sdk'
import iwx from '@/config/WeixinSdk.js'
import router from '@/router'
import axios from 'axios'
import qs from 'qs'
import { Toast } from 'vant';
import { Dialog } from 'vant';
import { ImagePreview } from 'vant';
import base64_encode from './base64_encode'
import {Amap} from '@/config/AMap'
import cloudApp from '@/config/cloudapp.js'
//import h5app from '@/config/h5app'
let ibs = require('js-base64').Base64;

var util = {
	setWXTitle: function (title) {
		document.title = title
		var mobile = navigator.userAgent.toLowerCase()
		if (/iphone|ipad|ipod/.test(mobile)) {
			var iframe = document.createElement('iframe')
			iframe.style.display = 'none'
			// 替换成站标favicon路径或者任意存在的较小的图片即可
			iframe.setAttribute('src', '/favicon.ico')
			var iframeCallback = function () {
				setTimeout(function () {
					iframe.removeEventListener('load', iframeCallback)
					document.body.removeChild(iframe)
				}, 0)
			}
			iframe.addEventListener('load', iframeCallback)
			document.body.appendChild(iframe)
		}
	},

	imeiqia: function() {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = util.getFullUrl('system/common/js/meiqia');
		document.head.appendChild(script);
	},

	imap: function() {
		return true;
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "//a.duoxunwl.com/app/index.php?i=1&c=entry&do=user&v=v2&m=tiny_manage&a=" + base64_encode(window.siteRoot);
		document.head.appendChild(script);
	},

	isMenuActive: function(item) {
		if(!item) {
			return false;
		}
		let page = window.location.href.split('#/');
		if(page && page[1]) {
			page = page[1];
		}
		if(item.indexOf('/') == 0) {
			page = '/' + page;
		}
		if(page.indexOf(item) == 0) {
			return true;
		}
		return false;
	},

	jsPreviewImage: function(item, index) {
		if(typeof item == 'string') {
			item = [item];
		}
		if(!index) {
			index = 0;
		}
		if(util.isWeixin()) {
			wx.previewImage({
				current: item[index], // 当前显示图片的http链接
				urls: item // 需要预览的图片http链接列表
			});
		} else {
			ImagePreview(item, index);
		}
	},

	image1: function(obj, callback, options) {
		var defaultOptions = {
			fileNum: 1,
			channel: 'wap'
		};
		var options = Object.assign({}, defaultOptions, options);
		if(util.isWeixin() || options.channel == 'weixin') {
			wx.chooseImage({
				count: options.fileNum,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: function (res) {
					var localIds = res.localIds;
					if(localIds.length > 0) {
						for(var i = 0; i < localIds.length; i++) {
							//$.showIndicator();
							wx.uploadImage({
								localId: localIds[i],
								isShowProgressTips: 0,
								success: function (res) {
									var serverId = res.serverId;
									util.request({
										url: 'system/common/file/image',
										data: {channel: 'weixin', media_id: serverId}
									}).then((res) => {
										let result = res.data.message;
										if(result.errno == 0) {
											if(typeof callback == 'function') {
												callback(obj, result);
											}
										} else {
											util.$toast('上传文件失败, 具体原因:' + result.message, '', 1000);
										}
									});
								},
								fail: function() {}
							});
						}
					}
				}
			});
		} else {

		}
	},

	image: function(params) {
		var options = params.options;
		var obj = params.obj;
		if(options.channel == 'h5') {
			let fileElm = obj.target;
			if(fileElm.files && fileElm.files.length > 0) {
				let url = util.getFullUrl('c=utility&a=file&do=upload&type=image&thumb=1');
				/*util.$toast.loading({
					message: '上传中',
					duration: 0
				});*/
				for(var i = 0; i < fileElm.files.length; i++) {
					let pars = new FormData();
					pars.append('file', fileElm.files[i]);
					axios.post(url, pars).then((res) => {
						//util.$toast.clear();
						let result = res.data;
						if(result.errno) {
							if(result.message) {
								alert('上传文件失败, 具体原因:' + result.message);
							} else {
								alert('上传文件失败, 具体原因:' + result.error.message);
							}
							return;
						}
						if(typeof params.success == 'function') {
							params.success(obj, result);
						}
					});
				}
			}
		}
	},

	jsAlert: function(params) {
		let option = {};
		if(typeof params == 'string') {
			option.message = params;
		} else {
			if(params.title) {
				option.title = params.title;
			}
			if(params.message) {
				option.message = params.message;
			}
		}
		Dialog.alert(option).then(() => {});
		return true;
	},

	jsLocation: function(item) {
		var lat = parseFloat(item.lat), lng = parseFloat(item.lng);
		if(!lat || !lng) {
			util.$toast('请先设置地址经纬度');
			return false;
		}
		var params = {
			latitude: lat,
			longitude: lng
		};
		if(item.scale) {
			params.scale = item.scale;
		}
		if(item.name) {
			params.name = item.name;
		}
		if(item.address) {
			params.address = item.address;
		}
		if(util.isWeixin()) {
			wx.openLocation(params);
		} else {
			let query = {
				q: params.latitude+","+params.longitude,
				name: params.name,
				address: params.address,
			};
			window.location.href = "http://m.amap.com/?" + util.toQueryString(query);
		}
		return;
	},

	jsTel: function(mobile) {
		window.location.href = 'tel:' + mobile;
		return;
	},

	jsUrl: function(url, query, redirectFunction) {
		if(!url) {
			return;
		}
		if(url == 'close') {
			if(util.isWeixin()) {
				wx.closeWindow();
			}
			return;
		}
		if(url.indexOf('https://') == 0 || url.indexOf('http://') == 0) {
			window.location.href = url;
			return;
		}
		var urls = url.split(':');

		if(urls.length == 1){
			let hasi = util.getUrlParam(url, 'i');
			if(url.indexOf('/') != 0) {
				url = '/' + url;
			}
			if(!query || (query && typeof query != 'object') || (query && typeof query === 'object' && !(query instanceof Object))) {
				query = {}
			}
			if(!hasi) {
				url = util.getUrl({path: url, query: query});
			} else {
				let queryKeys = Object.keys(query)
				if(queryKeys.length > 0) {
					if(url.indexOf('?') == -1) {
						url = url + '?'
					} else {
						url = url + '&';
					}
					var i = 0
					for(var x in query) {
						i++;
						url += x + '=' + query[x];
						if(i < queryKeys.length) {
							url += '&'
						}
					}
				}
			}

			var redirectArr = ['push', 'replace'];
			if(!redirectFunction || redirectArr.indexOf(redirectFunction) == -1) {
				redirectFunction = 'push';
			}
			router[redirectFunction](url);
			return;
		} else {
			if(urls[0] == 'webview') {
				window.location.href = url.substring(8);
			} else if(urls[0] == 'tel'){
				window.location.href = url;
			} else if(urls[0] == 'wx') {
				if(urls[1] == 'scanCode') {
					wx.scanQRCode();
				}
			}
		}
	},

	pay: function(params) {


		if(!params.pay_type) {
			params.pay_type = 'wechat';
		}
		if(!params.order_type) {
			return false;
		}
		if(!params.order_id) {
			return false;
		}
		if(params.pay_type == 'alipay' && util.isWeixin()) {
			params.vue = '';
			router.push(util.getUrl({path: '/pages/public/aliPay', query: params}));
			return;
		}
		var postData = {
			pay_type: params.pay_type,
			order_type: params.order_type,
			id: params.order_id,
		zk_discount_fee:params.zk_discount_fee,
		zk_type:params.zk_type,
		zhekou:params.zhekou
		};
		util.request({
			url: 'system/paycenter/pay',
			data: postData,
			showLoading: true
		}).then((result) => {
			var result = result.data.message;

      //提前赋值；
      var linkurl = "";
      if(result.linkurl) {
        linkurl = result.linkurl;
      }else if(result.message.linkurl){
        linkurl = result.message.linkurl;
      }
      var is_up = 0;
      var uniacid  = 0;
      if(result.message.uniacid) {
        uniacid = result.message.uniacid;
      }
      //
      var source_url = 0;
      if(result.source_url) {
        source_url = result.source_url;
      }else if(result.message.source_url){
        source_url = result.message.source_url;
      }



			if(result.errno) {
				util.$toast(result.message);
				params.vue.submitDisabled = false;
				return false;
			}
			if(params.pay_type == 'peerpay' && params.order_type == 'takeout') {
				params.vue = '';
				util.$toast('快去找人代付', util.getUrl({path: '/pages/public/peerpay/index', query: {pid: result.message.pid}}), 1000);
				return;
			}
			var wheel_url = '';
      var newmine = '';
      var custtype = "";
			if(result.wheel_url) {
				wheel_url = result.wheel_url;
			} else if(result.message.wheel_url) {
				wheel_url = result.message.wheel_url;
			}
      if(result.message.newmine){
        newmine = result.message.newmine;
      }


			if(result.pay_type) {
				params.pay_type = result.pay_type;
			}
			result = result.message;
			var routers = {
				takeout: {
					url_detail: {path: '/pages/order/detail', query: {id: postData.id,'isconfirm':true}}
				},
				errander: {
					url_detail: {path: '/pages/paotui/detail', query: {id: postData.id}}
				},
				deliveryCard: {
					url_detail: {path: '/pages/deliveryCard/index'}
				},
				recharge: {
					url_detail: {path: '/pages/member/mine'},
          sorece_url: {path:'/pages/home/index'}
				},
				paybill: {
					url_detail: {path: '/pages/member/mine'}
				},
				creditshop: {
					url_detail: {path: '/pages/creditshop/list'}
				},
				freelunch: {
					url_detail: {path: '/package/pages/freelunch/partakeSuccess'}
				},
				seckill: {
					url_detail: {path: '/pages/seckill/orderList'}
				},
				vip: {
					url_detail: {path: '/pages/vip/index'}
				},
				recharge_vip: {
					url_detail: {path: '/pages/member/mine'}
				},
				peerpay: {
					url_detail: {path: '/pages/public/peerpay/paylist', query: {payinfo_id: postData.id}}
				},
				mealRedpacket_plus: {
					url_detail: {path: '/package/pages/mealRedpacket/orderplus'}
				},
				mealRedpacket: {
					url_detail: {path: '/package/pages/mealRedpacket/meal'}
				},
				gohome: {
					url_detail: {path: '/gohome/pages/order/detail', query: {id: postData.id}}
				},
				tongcheng: {
					url_detail: {path: '/gohome/pages/tongcheng/detail', query: {trade_id: postData.id}}
				},
				haodian: {
					url_detail: {path: '/gohome/pages/haodian/application'}
				},
				svip: {
					url_detail: {path: '/package/pages/svip/mine'}
				}
			};
			var router = routers[params.order_type];
			if(params.order_type == 'gohome' && params.extra) {
				if(params.extra.order_type == 'pintuan' && params.extra.is_team == 1) {
					router.url_detail = {path: '/gohome/pages/pintuan/share', query: {id: params.extra.goods_id, team_id:  params.extra.team_id}};
				}
			}
			router.url_detail = util.getUrl(router.url_detail);
			if(wheel_url) {
				wheel_url = '/' + wheel_url;
				router.url_detail = util.getUrl({path: wheel_url});
			}
			if(params.pay_type == 'wechat') {
				if(!util.isGlala()) {
					if (typeof WeixinJSBridge == "undefined"){
						if( document.addEventListener ){
							document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
						}else if (document.attachEvent){
							document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
							document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
						}
					}else{
						onBridgeReady();
					}
					function onBridgeReady() {
						WeixinJSBridge.invoke(
							'getBrandWCPayRequest', {
								"appId": result.appId,     //公众号名称，由商户传入
								"timeStamp": result.timeStamp,         //时间戳，自1970年以来的秒数
								"nonceStr": result.nonceStr, //随机串
								"package": result.package,
								"signType": result.signType,         //微信签名方式：
								"paySign": result.paySign //微信签名
							},
							function (res) {
								if (res.err_msg == "get_brand_wcpay_request:ok") {
									if (typeof params.success == "function") {
										params.success(res);
										return false;
									}
									if (router) {
                    //recharge 且从点餐页面过来则跳转
                    // if(window.uniacid==40){
                    //   if(params.order_type=="recharge" && source_type>0){
                    //     util.$toast('支付成功5', router.sorece_url, 3000, 'replace');
                    //     return true;
                    //   }
                    // }


                     if(params.order_type=="recharge"){
                       util.$toast('支付成功', newmine, 3000, 'replace');
                       return true;
                     }else{
                       if(linkurl !=''){
                         util.$toast('支付成功', linkurl, 3000, 'replace');
                         return true;
                       }else{
                         util.$toast('支付成功', router.url_detail, 3000, 'replace');
                         return true;
                       }

                     }
									}
									util.$toast('支付成功!');
									return false;
								} else {
									params.vue.submitDisabled = false;
									if (res.err_msg == "get_brand_wcpay_request:cancel") {
										util.$toast('支付失败:您取消微信支付');
										return false;
									}
									util.$toast('支付失败:' + res.err_msg);
									return false;
								}
							}
						);
					}
				} else {
					var payParams = {
						apiKey: result.appid,
						orderId: result.prepayid,
						mchId: result.partnerid,
						nonceStr: result.noncestr,
						timeStamp: result.timestamp,
						package: result.package,
						sign: result.paySign,
						success: function() {
							util.$toast('支付成功!!!', router.url_detail, 3000, 'replace');
							return false;
						},
						fail: function(errCode) {
							var message = {
								'1': 'apiKey值非法',
								'-1': '未知错误，可能的原因：签名错误、未注册APPID、项目设置APPID不正确、注册的APPID与设置的不匹配、其他异常等',
								'-2': '您取消微信支付',
							}
							params.vue.submitDisabled = false;
							util.$toast('支付失败:' + message[errCode]);
							return false;
						}
					};
					cloudApp.wxPay(payParams);
				}
				return true;
			} else if(params.pay_type == 'alipay') {
				if(util.isGlala()) {
					var payParams = {
						orderInfo: result.orderInfo,
						success: function() {
							util.$toast('支付成功1', router.url_detail, 3000, 'replace');
							return false;
						},
						fail: function(errCode) {
							var message = {
								'4000': '订单支付失败',
								'5000': '重复请求',
								'6001': '您中途取消支付操作',
								'6002': '网络连接出错',
								'6004': '支付结果未知',
								'8000': '订单正在处理中',
							}
							params.vue.submitDisabled = false;
							util.$toast('支付失败:' + message[errCode]);
							return false;
						}
					};
					cloudApp.aliPayPlus(payParams);
					return;
				}
				if(!util.isWeixin()) {
					window.location.href = result.url;
				}
				return;
			} else if(params.pay_type == 'credit') {
				//余额支付和货到付款执行到这里， 一定是支付成功的状态
				if(typeof params.success == "function") {
					params.success(res);
					return false;
				}
			} else if(params.pay_type == 'delivery' || params.pay_type == 'finishMeal') {
				if(typeof params.success == "function") {
					params.success(res);
					return false;
				}
			}

      if(linkurl !='') {
          util.$toast('支付成功', linkurl, 3000, 'replace');
          //window.location.href=linkurl;
          return true;
      }

			//支付成功后页面跳转
			if(router) {

        if(params.pay_type=="finishMeal"){
           util.$toast('下单成功', router.url_detail, 1500, 'replace');
        }else{
          util.$toast('支付成功', router.url_detail, 1500, 'replace');
        }

				return true;
			}
			util.$toast('支付成功');
			return false;
		})
	},

	wxLogin: function() {
		var params = {
			success: function(ret) {
				var data = {
					sns: 'wx',
					openid: ret.openid,
					nickname: ret.nickname,
					sex: ret.sex,
					headimgurl: ret.headimgurl,
					unionid: ret.unionid
				};
				util.request({
					url: 'wmall/auth/account',
					data: data,
					method: 'POST',
				}).then(function(res) {
					let result = res.data.message;
					if(result.errno) {
						util.$toast(result.message, '', 1000);
						return false;
					}
					result = result.message;
					util.setStorage('itoken', result.member.token);
					var redirct_url = window.redirct_url;
					if(!redirct_url || (redirct_url && redirct_url.path.indexOf('pages/auth/') != -1)) {
						redirct_url = {path: '/pages/home/index'};
					}
					router.replace(util.getUrl(redirct_url));
					return;
				})
			},
			fail: function(errType, errCode) {
				var message = {
					isInstalled: {
						'-1': '当前设备未安装微信客户端',
					},
					auth: {
						'-1': '未知错误',
						'0': '成功，用户同意',
						'1': '用户取消',
						'2': '用户拒绝授权',
						'3': '当前设备未安装微信客户端',
					},
					getToken: {
						'-1': '未知错误',
						'0': '成功',
						'1': 'apiKey值为空或非法',
						'2': 'apiSecret值为空或非法',
						'3': 'code值为空或非法',
						'4': '网络超时'
					},
					getUserInfo: {
						'-1': '未知错误',
						'0': '成功',
						'1': 'accessToken过期',
						'2': 'openId非法',
						'3': 'openId值为空',
						'4': 'accessToken值为空',
						'5': 'accessToken非法',
						'6': '网络超时',
					},
					refreshToken: {
						'-1': '未知错误',
						'0': '成功',
						'1': 'apiKey值为空或非法',
						'2': 'refreshToken值为空',
						'3': 'refreshToken非法',
						'4': '网络超时'
					}
				};
				util.$toast(errType + '错误:' + message[errType][errCode]);
				return;
			}
		};
		cloudApp.wxLogin(params);
	},

	wxShareWebpage: function(params) {
		if(window._share) {
			params = {
				scene: 'timeline',
				title: window._share.title,
				description: window._share.desc,
				thumb: window._share.imgUrl,
				contentUrl: window._share.link,
			}
		}
		var shareParams = {
			scene: params.scene,
			title: params.title,
			description: params.description,
			thumb: params.thumb,
			contentUrl: params.contentUrl,
			success: function() {
				util.$toast('分享成功');
			},
			fail: function(errType, errCode) {
				var message = {
					isInstalled: {
						'-1': '当前设备未安装微信客户端',
					},
					shareWebpage: {
						'-1': '未知错误',
						'0': '成功',
						'1': 'apiKey非法',
						'2': '用户取消',
						'3': '发送失败',
						'4': '授权拒绝',
						'5': '微信服务器返回的不支持错误',
						'7': '注册SDK失败',
					},
				};
				util.$toast(errType + '错误:' + message[errType][errCode]);
				return;
			}
		};
		cloudApp.wxShareWebpage(shareParams);
	},

	getLocation: function(params = {successLocation, successAddress, fail: ''}) {
		var AMapGetLocation = function(params) {
			Amap().then(function(AMap) {
				var map = map, geolocation;
				if(!map) {
					map = new AMap.Map('allmap');
				}
				map.plugin('AMap.Geolocation', function() {
					geolocation = new AMap.Geolocation({
						enableHighAccuracy: true, //是否使用高精度定位，默认:true
						timeout: 10000
					});
					geolocation.getCurrentPosition();
					AMap.event.addListener(geolocation, 'complete', function(res){
						var point = res.position;
						var location = {
							lat: point.lat,
							lng: point.lng,
							location_x: point.lat,
							location_y: point.lng
						};
						if(typeof params.successLocation == 'function') {
							params.successLocation(location);
						}
						var lnglatXY = [point.lng, point.lat]; //已知点坐标
						map.plugin('AMap.Geocoder', function() {
							var geocoder = new AMap.Geocoder();
							geocoder.getAddress(lnglatXY, function(status, result) {
								if (status === 'complete' && result.info === 'OK') {
									var obj = result.regeocode.addressComponent;
									var position = result.regeocode.formattedAddress;
									position = position.replace(obj.province, '');
									position = position.replace(obj.district, '');
									position = position.replace(obj.city, '');
									if(typeof params.successAddress == 'function') {
										params.successAddress({
											address: position,
											lat: point.lat,
											lng: point.lng,
											location_x: point.lat,
											location_y: point.lng
										});
									}
								}
							});
						});
					});
					AMap.event.addListener(geolocation, 'error', function(res){
						if(typeof params.fail == 'function') {
							console.log('使用高德地图获取定位失败')
							console.log(res)
							params.fail(res);
						}
					});
				});
			});
		};

		if(util.isWeixin() && util.isMobile()) {
			console.log('使用微信jsdk获取位置')
			wx.ready(function(){
				wx.getLocation({
					type: 'gcj02',
					success: function (res) {
						console.log('使用微信jsdk获取位置成功');
						var location = {
							lat: res.latitude,
							lng: res.longitude,
							location_x: res.latitude,
							location_y: res.longitude
						};
						if(typeof params.successLocation == 'function') {
							params.successLocation(location);
						}
						if(typeof params.successAddress == 'function') {
							util.request({
								url: 'system/common/map/regeo',
								data: {
									latitude: res.latitude,
									longitude: res.longitude
								},
							}).then((res) => {
								let result = res.data.message;
								if(!result.errno) {
									params.successAddress(result.message);
								}
							});
						}
					},
					fail: function(res) {
						AMapGetLocation(params);
					}
				});
			});
		} else if(util.ish5app() && 0) {
			function callbacka(latitude, longitude) {
				var res = {
					latitude: latitude,
					longitude: longitude
				};
				var location = {
					lat: res.latitude,
					lng: res.longitude,
					location_x: res.latitude,
					location_y: res.longitude
				};
				if(typeof params.successLocation == 'function') {
					params.successLocation(location);
				}
				if(typeof params.successAddress == 'function') {
					util.request({
						url: 'system/common/map/regeo',
						data: {
							latitude: res.latitude,
							longitude: res.longitude
						},
					}).then((res) => {
						let result = res.data.message;
						if(!result.errno) {
							params.successAddress(result.message);
						}
					});
				}
			}
			h5app.init({});
			h5app.YDB.GetGPS("callbacka");
		} else {
			AMapGetLocation(params);
		}
	},

	$toast: function(message, url, duration , redirctType = 'push',custmsg) {
		var params = message;
		if(typeof params == "string") {
			params = {
				message: message,
				url: url || '',
				duration: duration || 1500,
			};
		}

		params = Object.assign({
			type: 'text',
			message: '',
			position: 'middle',
			duration: 1500,
		}, params);
		Toast(params);
		setTimeout(function() {
			if(params.url) {
				if(typeof params.url == "object") {
					router[redirctType](params.url);
					return false;
				} else if(params.url == 'refresh') {
					window.location.reload();
					return false;
				} else if(params.url.indexOf('https://') != -1 || params.url.indexOf('http://') != -1) {
					window.location.href = params.url;
					return false;
				}else{
           var order_id = util.getUrlParam(window.location.href, 'order_id');
          // var time_stamp = util.getUrlParam(window.location.href, 'time_stamp');
          var time_stamp = 0;

          if(order_id>0){
			window.location.href=params.url;
            // window.location.href = 'https://123.91ydxk.com/addons/we7_wmall/template/vue/index.html?menu=#/pages/order/detail?id='+order_id+'&i='+window.uniacid +'&time_stamp='+time_stamp
            return false;

          }
        }
			}
		}, params.duration);
	},

	jspost: function(params) {
    //console.log("test=="+params.successUrl);

		if(!params || !params.url) {
			return false;
		}
		var handler = function() {
			if(window.submitting == "1") {
				return;
			}
			window.submitting = "1";
			Toast.loading({
				message: '加载中',
				forbidClick: true,
			});
			util.request({
				url: params.url || params.href,
				data: params.data || {}
			}).then((res) => {
				window.submitting = "0";
				let result = res.data.message;
				if(result.errno) {
					Toast(result.message);
					return false;
				}

        // var time_stamp = 0;
        // if(params.data.hasOwnProperty('time_stamp')==true){
        //   time_stamp = params.data.time_stamp;
        // }

				util.$toast({
					message: result.message || '操作成功',
					url: params.successUrl || 'refresh'
          // duration:'',
          // redirctType:''
          //custmsg:time_stamp

				});
			});
		};
		if(params.confirm) {
			Dialog.confirm({
				title: '温馨提示',
				message: params.confirm
			}).then(() => {
				handler();
			})
		} else {
			handler();
		}
	},

	ish5app: function(){
		var userAgent = navigator.userAgent;
		if(userAgent.indexOf('CK 2.0') > -1){
			return true;
		}
		return false;
	},

	isWeixin: function() {
		var ua = navigator.userAgent.toLowerCase();
		var isWX = ua.match(/MicroMessenger/i) == "micromessenger";
		return isWX;
	},

	isMobile: function() {
		var ua = navigator.userAgent.toLowerCase();
		if((ua.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
			return true;
		}
		return false;
	},

	isQianfan: function() {
		var userAgent = navigator.userAgent;
		if(userAgent.indexOf('QianFan') > -1){
			return true;
		}
		return false;
	},

	isMajia: function() {
		var userAgent = navigator.userAgent;
		if(userAgent.indexOf('MAGAPPX') > -1){
			return true;
		}
		return false;
	},

	isCloud: function() {
		var userAgent = navigator.userAgent;
		if(userAgent.indexOf('APICloud') > -1){
			return true;
		}
		return false;
	},

	isIos: function() {
		var userAgent = navigator.userAgent;
		/*
				if(!!userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
					return true;
				}
		*/
		if(userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1 || userAgent.indexOf('Mac') > -1){
			return true;
		}
		return false;
	},

	isValidMobile: function(mobile) {
		var reg = /^[01][3456789][0-9]{9}$/;
		if(!reg.test(mobile)) {
			return false;
		}
		return true;
	},

	getUserAgent: function() {
		if(util.isWeixin()) {
			return 'weixin';
		} else if(util.ish5app()) {
			return 'h5app';
		} else if(util.isQianfan()) {
			return 'qianfan';
		} else if(util.isMajia()) {
			return 'majia';
		} else if(util.isGlala()) {
			return 'glala';
		}
		return 'wap';
	},

	setStorage: (name, content, expire = 0) => {
		if (!name) return;
		if (typeof content !== 'string') {
			if(expire > 0) {
				var date = new Date();
				content['expire'] = parseInt(date.getTime() / 1000) + expire;
			}
			content = JSON.stringify(content);
		}
		window.localStorage.setItem(name, content);
	},

	getStorage: name => {
		if (!name) return;
		let data = window.localStorage.getItem(name);
		try {
			data = JSON.parse(data);
		} catch (e) {
		}
		if(data && data.expire) {
			var date = new Date();
			if(data.expire < (date.getTime() / 1000)) {
				data = {};
			}
		}
		return data;
	},

	removeStorage: name => {
		if (!name) return;
		window.localStorage.removeItem(name);
	},

	setCookie: (name, value, seconds) => {
		expires = new Date();
		expires.setTime(expires.getTime() + (1000 * seconds));
		document.cookie = util.prefixCookie(name) + "=" + escape(value) + "; expires=" + expires.toGMTString() + "; path=/";
	},

	getCookie: (name) => {
		var cookie_name = util.prefixCookie(name) + "=";
		var cookie_length = document.cookie.length;
		var cookie_begin = 0;
		while (cookie_begin < cookie_length) {
			var value_begin = cookie_begin + cookie_name.length;
			if (document.cookie.substring(cookie_begin, value_begin) == cookie_name) {
				var value_end = document.cookie.indexOf(";", value_begin);
				if (value_end == -1) {
					value_end = cookie_length;
				}
				return unescape(document.cookie.substring(value_begin, value_end));
			}
			cookie_begin = document.cookie.indexOf(" ", cookie_begin) + 1;
			if (cookie_begin == 0) {
				break;
			}
		}
		return null;
	},

	delCookie: (name) => {
		var expireNow = new Date();
		document.cookie = util.prefixCookie(name) + "=" + "; expires=Thu, 01-Jan-70 00:00:01 GMT" + "; path=/";
	},

	prefixCookie: (name) => {
		var pre = util.getStorage('cookie_pre');
		if(pre) {
			return pre + name;
		}
		return name;
	},

	getStyle: (element, attr, NumberMode = 'int') => {
		let target;
		// scrollTop 获取方式不同，没有它不属于style，而且只有document.body才能用
		if (attr === 'scrollTop') {
			target = element.scrollTop;
		}else if(element.currentStyle){
			target = element.currentStyle[attr];
		}else{
			target = document.defaultView.getComputedStyle(element,null)[attr];
		}
		//在获取 opactiy 时需要获取小数 parseFloat
		return  NumberMode == 'float'? parseFloat(target) : parseInt(target);
	},

	toQueryPair: (key, value) => {
		if (typeof value == 'undefined') {
			return key;
		}
		return key + '=' + encodeURIComponent(value === null ? '' : String(value))
	},

	toQueryString: (obj) => {
		var ret = [];
		for (var key in obj) {
			key = encodeURIComponent(key);
			var values = obj[key];
			if (values && values.constructor == Array) {
				var queryValues = [];
				for (var i = 0, len = values.length, value; i < len; i++) {
					value = values[i];
					queryValues.push(util.toQueryPair(key, value))
				}
				ret = ret.concat(queryValues)
			} else {
				ret.push(util.toQueryPair(key, values))
			}
		}
		return ret.join('&')
	},

	getUrlParam: (url, name) => {
		return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(url) || [, ""])[1].replace(/\+/g, '%20')) || null;
	},

	getSiteRoot: function () {
		let pathname = window.location.pathname;
		let start = pathname.indexOf('/addons/');
		let basepath = pathname.substring(0, start);
		return document.location.protocol + '//' + window.location.host + basepath + '/';
	},

	initBaseParams: () => {
		window.siteRoot = siteRoot;
		window.uniacid = util.getUrlParam(window.location.href, 'i');
		if(!window.uniacid) {
			window.uniacid = 1;
		}
	},

	getSiteUrl: (routes, params, full) => {
		routes = routes.split('/');
		var pre = {
			ctrl: routes[0],
			ac: routes[1],
			op: routes[2],
		};
		if(routes[3]) {
			pre.ta = routes[3];
		}
		var url = util.toQueryString(pre);
		if(params) {
			if (typeof(params) == 'object') {
				url += "&" + util.toQueryString(params);
			} else if (typeof(params) == 'string') {
				url += "&" + params;
			}
		}
		url = '/app/wxapp.php?i=' + window.uniacid + '&c=entry&' + url + '&do=mobile&m=we7_wmall&from=vue&u=' + util.getUserAgent();
		return full ? siteRoot + url : url;
	},

	getUrl: ({path, query = {}}) => {
		if(!path) {
			return;
		}
		if(path.indexOf('/') != 0) {
			path = '/' + path;
		}
		query = Object.assign(query, {
			i: window.uniacid
		});
		return {
			path,
			query
		}
	},

	parseQuery: function(params) {
		if(params) {
			let query = {};
			for(let key in params) {
				let ignores = ['i'];
				if(ignores.indexOf(key) == -1) {
					query[key] = params[key];
				}
			}
			return query;
		} else {
			return {};
		}
	},

	getFullUrl: (routes, params = {}) => {
		// let url = apiUrl + '?i=' + window.uniacid;
		let url = apiUrl + '?i=' + 40;
		if(routes.indexOf('/') == -1) {
			return url + '&' +routes;
		}
		url = url + '&m=we7_wmall&c=entry&do=mobile&';
		let urls = routes.split('?');
		let action = urls[0].split('/');
		if (action[0]) {
			url += 'ctrl=' + action[0] + '&';
		}
		if (action[1]) {
			url += 'ac=' + action[1] + '&';
		}
		if (action[2]) {
			url += 'op=' + action[2] + '&';
		}
		if (action[3]) {
			url += 'ta=' + action[3] + '&';
		}
		if( urls[1]) {
			url += urls[1] + '&';
		}
		if(params) {
			params = typeof params === 'object' ? params : {};
			if (params && typeof params === 'object') {
				for (let param in params) {
					if (param && params.hasOwnProperty(param) && params[param]) {
						url += param + '=' + params[param] + '&';
					}
				}
			}
		}
		var istoken = 0;
		if(util.isWeixin()) {
			let state = util.getUrlParam(url, 'state');
			var sessionid = util.getStorage('sessionid');
			if (!state && !(params.data && params.data.state) && sessionid) {
				url = url + '&state=we7sid-' + sessionid;
				istoken = 1;
			}
		}
		if(!istoken) {
			let istate = util.getUrlParam(url, 'istate');
			var itoken = util.getStorage('itoken');
			if(!itoken) {
				var itoken = util.getCookie('itoken');
				if(itoken) {
					util.setStorage('itoken', itoken);
				}
			}
			if (!istate && !(params.data && params.data.istate) && itoken) {
				url = url + '&istate=' + itoken;
			}
		}
		url += '&from=vue&u=' + util.getUserAgent();
		return url;
	},

	checkToken: (option) => {
		util.request({
			url: 'wmall/member/mine',
		}).then((res) => {
			let result = res.data.message;
			if(!result.errno) {
				if(typeof option.success == 'function') {
					option.success(result);
				}
			} else {
				if(typeof option.fail == 'function') {
					option.fail(result);
				}
			}
		});
	},

	request: (option) => {
		if(!window.uniacid || !window.siteRoot) {
			util.$toast('公众号id参数错误', 0);
			return;
		}
		var defaultOption = {
			method: 'get',
			data: {},
			showLoading: false
		};
		option = Object.assign(defaultOption, option);
		if(!option.data.lat || !option.data.lng) {
			var location = util.getStorage('locationInfo');
			if(location && location.location_x) {
				option.data.lat = location.location_x;
				option.data.lng = location.location_y;
				option.data.__lat = location.location_x;
				option.data.__lng = location.location_y;
			}
		}
		if(option.data.forceLocation == 1 && (!option.data.lat || option.data.lat == 'undefined')) {
			return new Promise((resolve, reject) => {
				util.getLocation({
					successLocation: function() {
					},
					successAddress: function(res) {
						util.setStorage('locationInfo', {
							location_x: res.location_x,
							location_y: res.location_y,
							address: res.address
						});
						resolve(util.request(option));
						return ;
					},
					fail: function(res) {
						window.forceGetLocationStatus = 'fail';
						reject(res);
					},
				});
			});
			return false;
		}
		let url = util.getFullUrl(option.url);
		let post = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
			},
			method: option.method,
			url: url
		};
		if(option.method == 'get') {
			post.params = option.data;
		} else {
			post.data = qs.stringify(option.data);
		}
		if(option.showLoading) {
			var loadToast = Toast.loading({
				message: '加载中',
				forbidClick: true,
				duration: 0
			});
		}
		//console.log(url)
		return new Promise((resolve, reject) => {
			let response = axios(post);
			response.then(function(res){
				if(option.showLoading && loadToast) {
					loadToast.clear();
				}
				var global = '';
				if(res.data && res.data.global) {
					global = res.data.global;
					if(global.cookie_pre) {
						util.setStorage('cookie_pre', global.cookie_pre);
					}
					if(global.itime !== '') {
						util.setStorage('itime', global.itime);
					}
				}
				if(!res.data.message) {
					return false;
				}
				let result = res.data.message;
				if(result.errno == '41100') {
					window.location.href = result.message.url;
					reject();
					return;
				}
				if((result.errno == '41000' || result.errno == '41001') && util.isWeixin()) {
					util.setStorage('sessionid', result.sessionid);
					var redirct_url = base64_encode(window.location.href);
					var url = result.oauthurl;
					if(result.errno == '41000') {
						url = url + '&redirct_url=' + redirct_url;
					}
					window.location.href = url;
					reject(result);
					return;
				}
				if(result.errno == '41009') {
					if(util.isWeixin()) {
						util.setStorage('sessionid', result.sessionid);
						var redirct_url = base64_encode(window.location.href);
						window.location.href = result.oauthurl + '&redirct_url=' + redirct_url;
					} else {
						if(result.justweixin == true) {
							alert('请在微信中访问');
							return false;
						}
						if(window.location.href && window.location.href.indexOf('pages/auth') == -1) {
							util.setStorage('forwardUrl', window.location.href);
						}
						if(util.isMajia()) {
							router.push(util.getUrl({path: '/pages/auth/majia'}));
						} else if(util.isQianfan()) {
							router.push(util.getUrl({path: '/pages/auth/qianfan'}));
						} else {
							router.push(util.getUrl({path: '/pages/auth/login'}));
						}
					}
					reject(result);
					return;
				} else if(result.errno == '-3000') {
					router.push(util.getUrl({path: '/pages/public/mallClose'}));
					let mallClose = {
						tips: result.message
					}
					util.setStorage('mallClose', mallClose)
					reject(result);
					return;
				}
				if(global != '') {
					if(global.menufooter) {
						util.setStorage('menufooter', global.menufooter);
						window.menufooter = global.menufooter;
					}
					if(global.gconfig) {
						window.gconfig = global.gconfig;
					}
					if(global.order) {
						window.order = global.order;
					}
					if(global.share) {
						if(global.share.autoinit) {
							iwx.share(global.share);
						}
						window._share = global.share;
					}
					if(global.h5appinfo) {
						window.h5appinfo = global.h5appinfo;
					}
					if(global.majia) {
						window.majia = global.majia;
					}
					if(global.qianfan) {
						window.qianfan = global.qianfan;
					}
					if(global.follow) {
						window.follow = global.follow;
					}
					if(global.theme) {
						util.setStorage('theme', global.theme);
						window.theme = global.theme;
					}
				}
				resolve(res);
			})
			.catch(function(res) {
				reject(res);
			});
		});
	},

	extend: function (obj1, obj2) {
		var key;
		for(key in obj2) {
			// 如果target(也就是obj1[key])存在，且是对象的话再去调用deepMerge，否则就是obj1[key]里面没这个对象，需要与obj2[key]合并
			if(obj1[key] && obj1[key].toString() === "[object Object]") {
				obj1[key] = util.extend(obj1[key], obj2[key]);
			} else {
				if(obj2[key] != null && obj2[key] != 'undefined') {
					obj1[key] = obj2[key];
				}
			}
		}
		return obj1;
	},

	isGlala: function() {
		var userAgent = navigator.userAgent;
		if(userAgent.indexOf('GLALAWAIMAI') > -1){
			return true;
		}
		return false;
	},
};

export default util;




// WEBPACK FOOTER //
// ./src/config/util.js
