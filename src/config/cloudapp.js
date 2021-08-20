import util from '@/config/util'
var cloudApp = {
	init: function() {
		let jpush_relation = util.getStorage('jpush_relation');
		if(jpush_relation && util.isCloud()) {
			setTimeout(function(){
				cloudApp.relation = jpush_relation;
				cloudApp.checkconnect();
				cloudApp.initAjpush();
				cloudApp.checkSmartUpdate();

			}, 1000);
		}
	},

	checkSmartUpdate: function() {
		api.addEventListener({
			name:'smartupdatefinish'
		}, function(ret, err){
			api.rebootApp();
		});
	},

	checkconnect: function() {
		api.addEventListener({
			name:'offline'
		}, function(ret, err){
			api.openFrame({
				name: 'frm_connect',
				url: 'widget://html/connect.html',
				bounces: true,
				rect: {
					x: 0,
					y: 0,
					w: 'auto',
					h: 'auto'
				}
			});
			return false;
		});

		if(api.connectType == 'none') {
			api.openFrame({
				name: 'frm_connect',
				url: 'widget://html/connect.html',
				bounces: true,
				rect: {
					x: 0,
					y: 0,
					w: 'auto',
					h: 'auto'
				}
			});
			return false;
		}

		api.addEventListener({
			name:'online'
		}, function(ret, err){
			api.closeFrame({
				name: 'frm_connect'
			});
			var url_cn = cloudApp.igetPrefs('url_cn');
			if(url_cn) {
				window.location.href = url_cn;
			}
		});
	},

	isHasModule: function(name) {
		var status = api.require(name);
		if(!status || status == 'undefined') {
			return false;
		}
		return true;
	},

	scanQRCode: function(params) {
		var FNScanner = api.require('FNScanner');
		FNScanner.open({
			autorotation: true
		}, function(ret, err) {
			if (ret) {
				if(ret.eventType == 'success') {
					if(typeof params.success == 'function') {
						params.success({
							content: ret.content
						});
					} else {
						if(ret.content.indexOf('https://') != -1 || ret.content.indexOf('http://') != -1) {
							window.location.href = ret.content;
						}
					}
				}
			} else {
				if(typeof params.fail == 'function') {
					params.fail({
						content: ret.content
					});
				} else {
					alert(JSON.stringify(ret))
				}
			}
		});
	},

	netAudioPlay: function(extra, times) {
		var netAudio = api.require('netAudio');
		if(times > 0) {
			netAudio.play({
				path: extra.resource
			}, function(ret) {
				if(ret.complete) {
					util.request({
						url: 'system/common/order/check',
						data: {
							id: extra.id,
							order_from: extra.order_from,
						},
					}).then((res) => {
						let result = res.data.message;
						if(!result.errno) {
							times--;
							cloudApp.netAudioPlay(extra, times);
						}
					});
				}
			});
		}
		return true;
	},

	speechRecognizerRead: function(extra, times) {
		var iflyRecognition = api.require('iflyRecognition');
		iflyRecognition.createUtility({
			android_appid: '5bd167ea',
			ios_appid: '5bd17b48',
		}, function(ret, err) {
			if(ret.status) {
			} else {
				api.alert({ msg: "创建讯飞失败" });
			}
		});
		if(times > 0) {
			iflyRecognition.read({
				readStr: extra.voice_text,
				speed: 60,
				volume: 100,
				voice: 'xiaoyan',
				rate: 16000
			}, function(ret, err) {
				if(ret.status) {
					if(ret.speakProgress == 100) {
						util.request({
							url: 'system/common/takeout/check',
							data: {
								id: extra.id || extra.order_id
							},
						}).then((res) => {
							let result = res.data.message;
							if(!result.errno) {
								times--;
								cloudApp.speechRecognizerRead(extra, times);
							}
						});
					}
				}
			});
		}
		return true;
	},

	play: function(extra) {
		var prefs = cloudApp.igetPrefs('phonic');
		if(!prefs) {
			prefs = {
				voice: 1,
				vibrate: 1,
				voice_type: 1,
				new: {
					times: 'loop',
				},
				refund: {
					times: 'loop',
				},
				remind: {
					times: 'loop',
				}
			};
		}
		if(prefs.vibrate) {
			api.notification({
				vibrate: [3000, 3000]
			});
		}
		let notify_type = extra.notify_type;
		if(prefs.voice) {
			var times = prefs[notify_type]['times'];
			if(times == 'loop') {
				times = 100;
			} else {
				times = 3;
			}
			var voice_type = prefs['voice_type'];
			if(voice_type == 1) {
				cloudApp.speechRecognizerRead(extra, times);
			} else {
				cloudApp.netAudioPlay(extra, times);
			}
		}
		return true;
	},

	initBle: function() {
		var ble = api.require('ble');
		ble.initManager(function(ret) {
			//alert(ret.state);
			if (ret.state == "poweredOn") {
				//api.alert({ msg: "初始化成功" });
			}
		});
		cloudApp.ble = ble;
	},

	aliPayPlus: function(params) {
		var aliPayPlus = api.require('aliPayPlus');
		aliPayPlus.payOrder({
			orderInfo: params.orderInfo,
		}, function(ret) {
			if (ret.code == 9000) {
				if (typeof params.success == "function") {
					params.success();
					return false;
				}
			} else {
				if(typeof params.fail == "function") {
					params.fail(ret.code);
					return;
				}
			}
		});
	},

	aliPayPlus2: function() {
		var aliPayPlus = api.require('aliPayPlus');
		aliPayPlus.config({
			appId: '2017080608063032',
			rsaPriKey: 'MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQCHarchrG2OPgoLHoEa7ihGM+FImUQ/z66IomALccHt3LkLEGOqN6ABVzhcUn6255dIguDj7NIJzZDuVkDIATWqKhdHof3R1o+FSIz4uqPKHEd2GhtFx6L/QRtaqFoitNMBXycl1VDFLfVBcY3+wheNCmnInf5x/DhEUp85THMmLicVBALSD0VXxh3WXP03sd5FssXo1Lga4sZR2C8ci5+FXR61NDJqV6uPgVjI5oNGbpp6toWALt+YrUjHF5wVHwV+UDcgX+G6/beXK8J8PfLchEKg5vbY/6XNHtPE2LOC1tlPvWgbRKR+ONwruv8OEE3XZN5IMRVFrACjb7k4VoOrAgMBAAECggEAInWIdnwvQMQOwDeZ+OVjwEGRcWz3DhnmOwS+1gqzo7jIKcWY5wbSo6SzReMENb0HJT+QxM9Nv4rc95lhUMPmCRA+7k6NjWlBClSk8uJjrZm2oZoRGJetpbDGqjIvBafoDfBNwPXgYNzKDUY9MPfpEE33D0MNLapWEyTHOch3gN5c0ec1sG6iJVG72giYIpjAVIOiNszIr/kWk+bHNCq065QE0s2UYOADbmcLxCKQoMmBWZthHqHgzw9+r9TO1mc7BEkbU5w+fsyF23Yv6G4WxQORVEBqV9doa+VcSS3LihcP9eM1DIunL/2XzkkaWA/CTkkXbKkUdfCKJCFW6X4aiQKBgQDEyl3J+jnWsNDWPaka/+qTwdPEvhJf/JPsz+diBmAJ47zhEZZB6cTwuMmG+IjKjeT2sQoAt8/jn6vN01cWD+h7JiOq92FiEV8u5hhU6Zaoclpla1119w2Jf2z2j1ok2TCMPuA8QrdAbXMazQfWMP7/sBSBB20QZQkq2GvcvywYfQKBgQCwKRe60jXiw5LB9XGFXCFSoabPhFRKA9jjWO8cZ0SqdSQkLOfNnnRcpEy7ZkIrzEqrhdBGLumL2ou3Gw6Z5WAGvKAsXLN+njqbitZP5BKOid9Y+5u7Dpa5oDzYNjbvrfQwSNRIyQ2KcntPAryLYWMeIvaw8pficjB5CP4yPTDtRwKBgESI1bEJ3CrQ2WpDfylQBzn+Puo959hV9o56uXKCFeBb1+PqZBIAf/313PmMhNdGI39mmL03RsdXTFYaTDH6yFRbLADWtquYsTV8HO01jKqNaL35bksvBx/jqOcVdadvnGC7ZQyXj4p4k6W50gjed3BEul9VXr5e8ZpiVO5EBe9hAoGBAK9k+r+ENSrG1wRPQOwrQvJnCRNtCg93rScPkWOSXofpgkaSf2n27pye6ddchV3eVipZXXnDk70vqBRz2CHag7WxcTk6Q206VdgwcBmzV9ab58lNG00vxVqk9G/B6wjRBmRc3yBpLhY+zg9pBhkwqeODpGOh5yAL2b9o+M9EpcZZAoGBAKRo3tPVkUs7itMbPf1SQT5xgJu3/QdfFBqODj+Ffu0AnUi+aZHpoGZ/KL7eTLc9Q4ShT8f6STcOQny608BJsJt61Ae2lRR63nl9bkFTEQjPbF2mtPJhKF4DLj9Vhvnxe67Ny4hTiF7Te0G9HRdnNsVdk5AmpF1ieyR4YY0m9HYd',
		}, function(ret, err) {
			if(!ret.status) {
				alert('支付宝配置错误码:' + err.code);
				return false;
			}
			aliPayPlus.pay({
				subject: '支付宝支付测试商品',
				body: '交易商品的简介',
				amount: '0.01',
				tradeNO: '20190311100112345678913',
				rsa2: true
			}, function(ret, err) {
				if(ret.code != 9000) {
					alert('支付宝支付结果错误码:' + ret.code);
					return false;
				}
				api.alert({
					title: '支付结果',
					msg: JSON.stringify(ret),
					buttons: ['确定']
				});
			});
		});
	},

	wxPay: function(params) {
		var wxPay = api.require('wxPay');
		if(!params) {
			return false;
		}
		wxPay.payOrder({
			apiKey: params.apiKey,
			orderId: params.orderId,
			mchId: params.mchId,
			nonceStr: params.nonceStr,
			timeStamp: params.timeStamp,
			package: params.package,
			sign: params.sign
		}, function(ret, err) {
			if (ret.status) {
				if (typeof params.success == "function") {
					params.success();
					return false;
				}
			} else {
				if(typeof params.fail == "function") {
					params.fail(err.code);
					return;
				}
			}
		});
	},

	wxPay2: function() {
		var wxPay = api.require('wxPay');
		wxPay.config({
			apiKey: '',
			mchId: '1515090771',
			partnerKey: 'rVadyDZj07jJLjj90DJeg7X8Abj0x9jR',
			notifyUrl: 'https://www.baidu.com'
		}, function(ret, err) {
			if (ret.status) {
				alert('配置商户支付参数成功');
				wxPay.pay({
					description: 'iPad mini 16G 白色',
					totalFee: '1',
					tradeNo: '1217752501201407033233368020',
					spbillCreateIP: '196.168.1.1',
					deviceInfo: '013467007045764',
					detail: 'iPad mini 16G 白色',
					attach: '说明',
					feeType: 'CNY',
					timeStart: '20190308091010',
					timeExpire: '20190408091010',
					goodsTag: 'WXG',
					productId: '12235413214070356458058',
					openId: util.getStorage('openId')
				}, function(ret, err) {
					if (ret.status) {
						alert('wxPayPay返回值:' + JSON.stringify(ret));
					} else {
						alert('wxPayPay错误号:' + err.code);
					}
				});
			} else {
				alert('wxPayConfig错误号:' + err.code);
			}
		});
	},

	wxLogin: function(params) {
		var wx = api.require('wx');
		wx.isInstalled(function(ret, err) {
			if(!ret.installed) {
				if(typeof params.fail == "function") {
					params.fail('isInstalled', -1);
				}
				return;
			}
			//获取code
			wx.auth({
				apiKey: ''
			}, function(ret, err) {
				if(!ret.status) {
					if(typeof params.fail == "function") {
						params.fail('auth', err.code);
					}
					return;
				}
				var code = ret.code;
				if(code) {
					//获取accessToken
					wx.getToken({
						apiKey: '',
						apiSecret: '',
						code: code
					}, function(ret, err) {
						if(!ret.status) {
							if(typeof params.fail == "function") {
								params.fail('getToken', err.code);
							}
							return;
						}
						var accessToken = ret.accessToken;
						var dynamicToken = ret.dynamicToken;
						var openId = ret.openId;
						//获取用户信息getUserInfo
						wx.getUserInfo({
							accessToken: accessToken,
							openId: openId
						}, function(ret, err) {
							if (ret.status) {
								if(typeof params.success == "function") {
									params.success(ret);
									return;
								}
							} else {
								var errorCode = err.code;
								if(errorCode != 1) {
									if(typeof params.fail == "function") {
										params.fail('getUserInfo', errorCode);
									}
									return;
								}
								if(errorCode == 1) {
									//刷新accessToken
									wx.refreshToken({
										apiKey: '',
										dynamicToken: dynamicToken
									}, function(ret, err) {
										if(!ret.status) {
											if(typeof params.fail == "function") {
												params.fail('refreshToken', err.code);
											}
											return;
										}
										//重新调用getUserInfo
										wx.getUserInfo({
											accessToken: ret.accessToken,
											openId: ret.openId
										}, function(ret, err) {
											if (ret.status) {
												if(typeof params.success == "function") {
													params.success(ret);
													return;
												}
											} else {
												if(typeof params.fail == "function") {
													params.fail('getUserInfo', err.code);
												}
												return;
											}
										});
									});
								}
							}
						});
					});
				}
			});
		});
	},

	wxShareWebpage: function(params) {
		var wx = api.require('wx');
		wx.isInstalled(function(ret, err) {
			if(!ret.installed) {
				if(typeof params.fail == "function") {
					params.fail('isInstalled', -1);
				}
				return;
			}
			wx.shareWebpage({
				apiKey: '',
				scene: params.scene,
				title: params.title,
				description: params.description,
				thumb: params.thumb,
				contentUrl: params.contentUrl
			}, function(ret, err) {
				if (ret.status) {
					if(typeof params.success == "function") {
						params.success();
					}
					return;
				} else {
					if(typeof params.fail == "function") {
						params.fail('shareWebpage', err.code);
					}
					return;
				}
			});
		});
	},

	initAjpush: function(){
		var ajpush = api.require('ajpush');
		ajpush.setBadge({
			badge:0
		});
		ajpush.init(function(ret) {
			if(ret && ret.status){}
		});
		//同步推送标签和别名
		var push_code = cloudApp.igetPrefs('push_code');
		if(cloudApp.relation && cloudApp.relation.code && (!push_code || (push_code && push_code != cloudApp.relation.code))) {
			var bindParams = {};
			if(cloudApp.relation.alias) {
				bindParams['alias'] = cloudApp.relation.alias;
			}
			if(cloudApp.relation.tags) {
				bindParams['tags'] = cloudApp.relation.tags;
			}
			ajpush.bindAliasAndTags(bindParams, function(ret, err) {
				var statusCode = ret.statusCode;
				if(statusCode == 0) {
					cloudApp.isetPrefs('push_code', cloudApp.relation.code);
				} else {
					alert("同步推送信息出错：" + statusCode);
				}
			});
		}

		ajpush.setListener(function(ret) {
			var extra = ret.extra;
			try {
				extra = JSON.parse(ret.extra);
			} catch(e) {}
			if(api.systemType == 'ios') {
				var ajpush = api.require('ajpush');
				ajpush.setBadge({
					badge:0
				});
			}
			cloudApp.play(extra);
		});

		api.addEventListener({
			name: 'appintent'
		}, function(ret, err) {
			if(ret && ret.appParam.ajpush) {
				var ajpush = ret.appParam.ajpush;
				try {
					var extra = JSON.parse(ajpush.extra);
				} catch(e) {
					var extra = ajpush.extra;
				}
				location.href = extra.url;
			}
		});

		api.addEventListener({
			name: 'noticeclicked'
		}, function(ret, err) {
			if(ret && ret.value) {
				var ajpush = api.require('ajpush');
				ajpush.setBadge({
					badge:0
				});
				var ajpush = ret.value;
				var extra = ajpush.extra;
				location.href = extra.url;
			}
		});
	},

	igetPrefs: function(key) {
		var keys = key.split('.');
		var data = '';
		if(keys.length == 1) {
			data = api.getPrefs({
				sync: true,
				key: key
			});
			try {
				data = JSON.parse(data);
			} catch(e) {}
		} else if(keys.length == 2) {
			var all = cloudApp.igetPrefs(keys[0]);
			if(all && all[keys[1]]) {
				data = all[keys[1]];
			}
		} else if(keys.length == 3) {
			var all = cloudApp.igetPrefs(keys[0]);
			if(all && all[keys[1]]) {
				data = all[keys[1]][keys[2]];
			}
		}
		return data;
	},

	isetPrefs: function(key, params) {
		var keys = key.split('.');
		if(keys.length == 1) {
			api.setPrefs({
				key: key,
				value: params
			});
		} else if(keys.length == 2) {
			var all = cloudApp.igetPrefs(keys[0]);
			if(!all) {
				all = {};
			}
			all[keys[1]] = params;
			api.setPrefs({
				key: keys[0],
				value: all
			});
		} else if(keys.length == 3) {
			var all = cloudApp.igetPrefs(keys[0]);
			if(!all) {
				all = {};
			}
			if(!all[keys[1]]) {
				all[keys[1]] = {};
			}
			all[keys[1]][keys[2]] = params;
			api.setPrefs({
				key: keys[0],
				value: all
			});
		}
		return true;
	}
};
export default cloudApp


// WEBPACK FOOTER //
// ./src/config/cloudapp.js