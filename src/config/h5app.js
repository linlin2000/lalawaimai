import util from '@/config/util'
var h5app = {
	init: function(params) {
		if(!window.h5appinfo) {
			window.h5appinfo = {};
		}
		h5app.shareinfo = params.share ? params.share : window.h5appinfo.share;
		h5app.relation = params.relation ? params.relation : window.h5appinfo.relation;
		h5app.payinfo = params.payinfo ? params.payinfo : window.h5appinfo.payinfo;
		h5app.backurl = params.backurl;
		h5app.initYDB();
		h5app.set();
		h5app.initOther();
	},

	initYDB: function() {
		window.YDB = h5app.YDB = new YDBOBJ();
	},

	initOther: function() {
		if(h5app.relation) {
			h5app.YDB.SetUserRelationForPush(h5app.relation);
		}
	},

	set: function() {
		//h5app.YDB.SetStatusBarStyle(0);
	},

	share: function() {
		if(!h5app.share) {
			util.$toast("分享参数错误");
			return;
		}
		h5app.YDB.Share(h5app.share.title, h5app.share.desc, h5app.share.imgUrl, h5app.share.link);
	},

	sns: function(sns) {
		if (sns == "wx") {
			util.$toast("正在呼起微信");
			h5app.YDB.WXLogin(0, util.getSiteUrl("wmall/auth/account/sns", {
				sns: "wx",
				forward: encodeURIComponent(h5app.backurl)
			}, true));
		} else if (sns == "qq") {
			util.$toast("正在呼起手机QQ");
			h5app.YDB.QQLogin(util.getSiteUrl("wmall/auth/account/sns", {
				sns: "qq",
				forward: encodeURIComponent(h5app.backurl)
			}, true));
		}
	},

	pay: function(app, ordersn, money, callback) {
		var ordersn = ordersn ? ordersn : h5app.payinfo.ordersn;
		var money = money ? money : h5app.payinfo.money;
		if(!h5app.payinfo || !h5app.payinfo.mallName) {
			util.$toast("支付信息不完善");
			return;
		}
		if(!ordersn) {
			util.$toast("订单号有误");
			return;
		}
		if(money <= 0) {
			util.$toast("支付金额有误");
			return;
		}
		if(app == "wechat") {
			util.$toast("正在呼起微信");
			h5app.YDB.SetWxpayInfo(h5app.payinfo.mallName, h5app.payinfo.desc, money, ordersn, h5app.payinfo.attach);
		}
		else if(app == "alipay") {
			util.$toast("正在呼起支付宝");
			if(h5app.payinfo.rsa_type == 'RSA') {
				h5app.YDB.SetAlipayInfo(h5app.payinfo.mallName, h5app.payinfo.attach, money, ordersn);
			} else {
				h5app.YDB.SetRSA2AlipayInfo(h5app.payinfo.mallName, h5app.payinfo.attach, money, ordersn);
			}
		}
		if(callback) {
			callback();
		}
	},
};

export default h5app


// WEBPACK FOOTER //
// ./src/config/h5app.js