import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
	// mode: 'history',
	//base: '/addons/we7_wmall/',
	scrollBehavior (to, from, savedPosition) {
		if (savedPosition) {
			return savedPosition;
		} else {
			if (from.meta.keepAlive) {
				from.meta.savedPosition = document.body.scrollTop;
			}
			return { x: 0, y: to.meta.savedPosition || 0};
		}
	},
	routes: [
		{
			path: '/', //根目录
			name: 'index',
			redirect: '/pages/home/index',
		},
		{
			path: '/pages/home/index', //首页
			name: 'HomeIndex',
			meta: {
				keepAlive: true,
				title: '首页'
			},
			component: resolve => require(['@/pages/home/home'], resolve),
		},
		{
			path: '/pages/home/help', //帮助中心
			name: 'Help',
			meta: {
				title: '帮助中心'
			},
			component: resolve => require(['@/pages/home/help'], resolve),
		},
		{
			path: '/pages/home/category', //商户分类
			name: 'category',
			meta: {
				title: '全部商家'
			},
			component: resolve => require(['@/pages/home/category'], resolve),
		},
		{
			path: '/pages/member/mine', //会员中心
			name: 'mine',
			meta: {
				title: '会员中心'
			},
			component: resolve => require(['@/pages/member/mine'], resolve),
		},
		{
			path: '/pages/deliveryCard/index', //配送会员卡
			name: 'deliveryCardIndex',
			meta: {
				title: '配送会员卡'
			},
			component: resolve => require(['@/pages/deliveryCard/index'], resolve),
		},
		{
			path: '/pages/deliveryCard/power', //配送会员卡特权说明
			name: 'deliveryCardPower',
			meta: {
				title: '配送会员卡特权说明'
			},
			component: resolve => require(['@/pages/deliveryCard/power'], resolve),
		},
		{
			path: '/pages/deliveryCard/apply', //配送会员卡续费
			name: 'deliveryCardApply',
			meta: {
				title: '配送会员卡续费'
			},
			component: resolve => require(['@/pages/deliveryCard/apply'], resolve),
		},
		{
			path: '/pages/store/goods', //门店详情
			name: 'goods',
			meta: {
				title: '门店详情'
			},
			component: resolve => require(['@/pages/store/goods'], resolve),
		},
		{
			path: '/pages/store/comment', //门店评论
			name: 'storeComment',
			meta: {
				title: '门店评论'
			},
			component: resolve => require(['@/pages/store/comment'], resolve),
		},
		{
			path: '/pages/store/index', //门店信息
			name: 'storeIndex',
			meta: {
				title: '门店信息'
			},
			component: resolve => require(['@/pages/store/index'], resolve),
		},
		{
			path: '/pages/store/report', //举报商家
			name: 'storeReport',
			meta: {
				title: '举报商家'
			},
			component: resolve => require(['@/pages/store/report'], resolve),
		},
		{
			path: '/pages/store/goodsDetail', //商品详情
			name: 'goodsDetail',
			meta: {
				title: '商品详情'
			},
			component: resolve => require(['@/pages/store/goodsDetail'], resolve),
		},
		{
			path: '/pages/store/share', //分享门店
			name: 'storeShare',
			meta: {
				title: '分享门店'
			},
			component: resolve => require(['@/pages/store/share'], resolve),
		},
		{
			path: '/tangshi/pages/assign/assign', //门店排号
			name: 'storeAssign',
			meta: {
				title: '排队取号'
			},
			component: resolve => require(['@/pages/store/assign'], resolve),
		},
		{
			path: '/tangshi/pages/assign/assignDetail', //门店排号详情
			name: 'storeAssignDetail',
			meta: {
				title: '排队详情'
			},
			component: resolve => require(['@/pages/store/assignDetail'], resolve),
		},
		{
			path: '/pages/public/pay', //支付页面
			name: 'publicPay',
			meta: {
				title: '支付订单'
			},
			component: resolve => require(['@/pages/public/pay'], resolve),
		},
		{
			path: '/pages/store/shopPage', //门店海报页
			name: 'shopPage',
			meta: {
				title: '活动详情'
			},
			component: resolve => require(['@/pages/store/shopPage'], resolve),
		},
		{
			path: '/pages/member/redPacket/index', //我的红包
			name: 'redPacket',
			meta: {
				title: '我的红包'
			},
			component: resolve => require(['@/pages/member/redPacket/index'], resolve),
		},
		{
			path: '/pages/member/coupon/index', //我的代金券
			name: 'coupon',
			meta: {
				title: '我的代金券'
			},
			component: resolve => require(['@/pages/member/coupon/index'], resolve),
		},
		{
			path: '/pages/order/create', //订单确认页
			name: 'OrderCreate',
			meta: {
				title: '订单确认'
			},
			component: resolve => require(['@/pages/order/create'], resolve),
		},
		{
			path: '/pages/order/invoice', //新增发票信息
			name: 'orderInvoice',
			meta: {
				title: '新增发票信息'
			},
			component: resolve => require(['@/pages/order/invoice'], resolve),
		},
		{
			path: '/pages/order/note', //添加备注页
			name: 'OrderNote',
			meta: {
				title: '添加备注'
			},
			component: resolve => require(['@/pages/order/note'], resolve),
		},
		{
			path: '/pages/order/index', //订单列表页
			name: 'OrderIndex',
			meta: {
				title: '订单'
			},
			component: resolve => require(['@/pages/order/index'], resolve),
		},
		{
			path: '/pages/order/detail', //订单详情页
			name: 'OrderDetail',
			meta: {
				title: '订单详情'
			},
			component: resolve => require(['@/pages/order/detail'], resolve),
		},
		{
			path: '/pages/order/map', //订单实时定位页
			name: 'OrderMap',
			meta: {
				title: '订单实时定位'
			},
			component: resolve => require(['@/pages/order/map'], resolve),
		},
		{
			path: '/pages/order/comment', //订单评论
			name: 'OrderComment',
			meta: {
				title: '添加评论'
			},
			component: resolve => require(['@/pages/order/comment'], resolve),
		},
		{
			path: '/pages/order/refund', //退款进度
			name: 'OrderRefund',
			meta: {
				title: '退款进度'
			},
			component: resolve => require(['@/pages/order/refund'], resolve),
		},
		{
			path: '/pages/channel/coupon', //领券中心
			name: 'GetCoupon',
			meta: {
				title: '领券中心'
			},
			component: resolve => require(['@/pages/channel/coupon'], resolve),
		},
		{
			path: '/pages/channel/brand', //优选更多
			name: 'storeBrand',
			meta: {
				keepAlive: true,
				title: '为您优选'
			},
			component: resolve => require(['@/pages/channel/brand'], resolve),
		},
		{
			path: '/pages/member/recharge', //余额充值
			name: 'recharge',
			meta: {
				title: '余额充值'
			},
			component: resolve => require(['@/pages/member/recharge'], resolve),
		},
		{
			path: '/package/pages/ordergrant/index', //下单有礼
			name: 'ordergrantIndex',
			meta: {
				title: '下单有礼'
			},
			component: resolve => require(['@/pages/ordergrant/index'], resolve),
		},
		{
			path: '/package/pages/ordergrant/record', //下单有礼详细记录
			name: 'ordergrantRecord',
			meta: {
				title: '详细记录'
			},
			component: resolve => require(['@/pages/ordergrant/record'], resolve),
		},
		{
			path: '/package/pages/ordergrant/share', //下单有礼订单分享
			name: 'ordergrantShare',
			meta: {
				title: '订单分享'
			},
			component: resolve => require(['@/pages/ordergrant/share'], resolve),
		},
		{
			path: '/package/pages/ordergrant/detail', //下单有礼订单详情
			name: 'ordergrantDetail',
			meta: {
				title: '订单详情'
			},
			component: resolve => require(['@/pages/ordergrant/detail'], resolve),
		},
		{
			path: '/package/pages/ordergrant/refund', //订单退款
			name: 'ordergrantRefund',
			meta: {
				title: '订单退款'
			},
			component: resolve => require(['@/pages/ordergrant/refund'], resolve),
		},
		{
			path: '/pages/auth/login', //登录
			name: 'login',
			meta: {
				title: '登录'
			},
			component: resolve => require(['@/pages/auth/login'], resolve),
		},
		{
			path: '/pages/auth/majia', //登录
			name: 'majia',
			meta: {
				title: '登录'
			},
			component: resolve => require(['@/pages/auth/majia'], resolve),
		},
		{
			path: '/pages/auth/qianfan', //登录
			name: 'qianfan',
			meta: {
				title: '登录'
			},
			component: resolve => require(['@/pages/auth/qianfan'], resolve),
		},
		{
			path: '/pages/auth/register', //注册
			name: 'register',
			meta: {
				title: '注册'
			},
			component: resolve => require(['@/pages/auth/register'], resolve),
		},
		{
			path: '/pages/auth/forget', //忘记密码
			name: 'forget',
			meta: {
				title: '忘记密码'
			},
			component: resolve => require(['@/pages/auth/forget'], resolve),
		},
		{
			path: '/pages/spread/register', //推广员注册
			name: 'spreadRegister',
			meta: {
				title: '推广员注册'
			},
			component: resolve => require(['@/pages/spread/register'], resolve),
		},
		{
			path: '/pages/spread/index', //推广员首页
			name: 'spreadIndex',
			meta: {
				title: '推广员首页'
			},
			component: resolve => require(['@/pages/spread/index'], resolve),
		},
		{
			path: '/pages/spread/qrcode', //新推广海报
			name: 'spreadQrcode',
			meta: {
				title: '邀请二维码'
			},
			component: resolve => require(['@/pages/spread/qrcode'], resolve),
		},
		{
			path: '/pages/spread/commission', //推广佣金
			name: 'spreadCommission',
			meta: {
				title: '推广佣金'
			},
			component: resolve => require(['@/pages/spread/commission'], resolve),
		},
		{
			path: '/pages/spread/current', //佣金明细
			name: 'spreadCurrent',
			meta: {
				title: '佣金明细'
			},
			component: resolve => require(['@/pages/spread/current'], resolve),
		},
		{
			path: '/pages/spread/currentDetail', //佣金明细详情
			name: 'spreadCurrentDetail',
			meta: {
				title: '佣金明细详情'
			},
			component: resolve => require(['@/pages/spread/currentDetail'], resolve),
		},
		{
			path: '/pages/spread/getCash/application', //佣金提现
			name: 'spreadGetCashApplication',
			meta: {
				title: '推广员佣金提现'
			},
			component: resolve => require(['@/pages/spread/getCash/application'], resolve),
		},
		{
			path: '/pages/spread/getCash/index', //提现明细
			name: 'spreadGetCashIndex',
			meta: {
				title: '提现明细'
			},
			component: resolve => require(['@/pages/spread/getCash/index'], resolve),
		},
		{
			path: '/pages/spread/order', //推广订单
			name: 'spreadOrder',
			meta: {
				title: '推广订单'
			},
			component: resolve => require(['@/pages/spread/order'], resolve),
		},
		{
			path: '/pages/spread/detail', //推广订单
			name: 'spreadOrderDetail',
			meta: {
				title: '推广订单详情'
			},
			component: resolve => require(['@/pages/spread/detail'], resolve),
		},
		{
			path: '/pages/spread/down', //我的团队
			name: 'spreadDown',
			meta: {
				title: '我的团队'
			},
			component: resolve => require(['@/pages/spread/down'], resolve),
		},
		{
			path: '/pages/spread/poster', //推广二维码
			name: 'spreadPoster',
			meta: {
				title: '推广二维码'
			},
			component: resolve => require(['@/pages/spread/poster'], resolve),
		},
		{
			path: '/pages/spread/rank', //佣金排行
			name: 'spreadRank',
			meta: {
				title: '佣金排行榜'
			},
			component: resolve => require(['@/pages/spread/rank'], resolve),
		},
		{
			path: '/pages/home/location', //选择收货地址
			name: 'homeLocation',
			meta: {
				title: '选择收货地址'
			},
			component: resolve => require(['@/pages/home/location'], resolve),
		},
		{
			path: '/pages/store/paybill', //买单
			name: 'storePaybill',
			meta: {
				title: '买单'
			},
			component: resolve => require(['@/pages/store/paybill'], resolve),
		},
		{
			path: '/pages/creditshop/index', //酒币商城
			name: 'creditshopIndex',
			meta: {
				title: '酒币商城'
			},
			component: resolve => require(['@/pages/creditshop/index'], resolve),
		},
		{
			path: '/pages/creditshop/create', //酒币商城订单确认
			name: 'creditshopCreate',
			meta: {
				title: '酒币商城订单确认'
			},
			component: resolve => require(['@/pages/creditshop/create'], resolve),
		},
		{
			path: '/pages/creditshop/detail', //酒币商城兑换详情
			name: 'creditshopDetail',
			meta: {
				title: '酒币商城兑换详情'
			},
			component: resolve => require(['@/pages/creditshop/detail'], resolve),
		},
		{
			path: '/pages/creditshop/goods', //酒币商城商品
			name: 'creditshopGoods',
			meta: {
				title: '兑换商品'
			},
			component: resolve => require(['@/pages/creditshop/goods'], resolve),
		},
		{
			path: '/pages/creditshop/goodsDetail', //酒币商城商品详情
			name: 'creditshopgoodsDetail',
			meta: {
				title: '酒币商城商品详情'
			},
			component: resolve => require(['@/pages/creditshop/goodsDetail'], resolve),
		},
		{
			path: '/pages/creditshop/list', //酒币商城兑换列表
			name: 'creditshopList',
			meta: {
				title: '酒币商城兑换列表'
			},
			component: resolve => require(['@/pages/creditshop/list'], resolve),
		},
		{
			path: '/package/pages/freelunch/index', //霸王餐首页
			name: 'freeLunchIndex',
			meta: {
				title: '一元霸王餐'
			},
			component: resolve => require(['@/pages/freelunch/index'], resolve),
		},
		{
			path: '/package/pages/freelunch/mealcoupon', //霸王餐我的餐券
			name: 'freeLunchMealcoupon',
			meta: {
				title: '我的餐券'
			},
			component: resolve => require(['@/pages/freelunch/mealcoupon'], resolve),
		},
		{
			path: '/package/pages/freelunch/detail', //霸王餐参与详情
			name: 'freeLunchDetail',
			meta: {
				title: '参与详情'
			},
			component: resolve => require(['@/pages/freelunch/detail'], resolve),
		},
		{
			path: '/package/pages/freelunch/luckier', //霸王餐往期幸运星
			name: 'freeLunchLuckier',
			meta: {
				title: '往期幸运星'
			},
			component: resolve => require(['@/pages/freelunch/luckier'], resolve),
		},
		{
			path: '/package/pages/freelunch/partakeSuccess', //霸王餐参与成功
			name: 'freeLunchPartakeSuccess',
			meta: {
				title: '参与成功'
			},
			component: resolve => require(['@/pages/freelunch/partakeSuccess'], resolve),
		},
		{
			path: '/package/pages/freelunch/rule', //霸王餐活动规则
			name: 'freeLunchRule',
			meta: {
				title: '霸王餐活动规则'
			},
			component: resolve => require(['@/pages/freelunch/rule'], resolve),
		},
		{
			path: '/pages/superRedpacket/index', //分享红包
			name: 'superRedpacketIndex',
			meta: {
				title: '分享红包'
			},
			component: resolve => require(['@/pages/superRedpacket/index'], resolve),
		},
		{
			path: '/pages/superRedpacket/grant', //分享记录
			name: 'superRedpacketGrant',
			meta: {
				title: '分享记录'
			},
			component: resolve => require(['@/pages/superRedpacket/grant'], resolve),
		},

		{
			path: '/package/pages/shareRedpacket/index', //分享有礼
			name: 'shareRedpackIndex',
			meta: {
				title: '分享有礼'
			},
			component: resolve => require(['@/pages/shareRedpacket/index'], resolve),
		},
		{
			path: '/package/pages/shareRedpacket/invite', //分享有礼
			name: 'shareRedpacketInvite',
			meta: {
				title: '注册领奖'
			},
			component: resolve => require(['@/pages/shareRedpacket/invite'], resolve),
		},
		{
			path: '/package/pages/shareRedpacket/success', //分享有礼
			name: 'shareRedpacketSuccess',
			meta: {
				title: '领取分享有礼红包'
			},
			component: resolve => require(['@/pages/shareRedpacket/success'], resolve),
		},
		{
			path: '/package/pages/shareRedpacket/repeat', //分享有礼
			name: 'shareRedpacketRepeat',
			meta: {
				title: '分享有礼'
			},
			component: resolve => require(['@/pages/shareRedpacket/repeat'], resolve),
		},
		{
			path: '/pages/wheel/index', //幸运大转盘
			name: 'wheelIndex',
			meta: {
				title: '幸运大转盘'
			},
			component: resolve => require(['@/pages/wheel/index'], resolve),
		},
		{
			path: '/pages/wheel/record', //幸运大转盘 中奖纪录
			name: 'wheelRecord',
			meta: {
				title: '幸运大转盘中奖纪录'
			},
			component: resolve => require(['@/pages/wheel/record'], resolve),
		},
		{
			path: '/pages/member/address', //地址列表
			name: 'address',
			meta: {
				title: '我的地址'
			},
			component: resolve => require(['@/pages/member/address'], resolve),
		},
		{
			path: '/pages/member/addressPost', //地址编辑
			name: 'addressPost',
			meta: {
				title: '编辑地址'
			},
			component: resolve => require(['@/pages/member/addressPost'], resolve),
		},
		{
			path: '/pages/member/addressLocation', //地址编辑
			name: 'addressLocation',
			meta: {
				title: '新增收货地址'
			},
			component: resolve => require(['@/pages/member/addressLocation'], resolve),
		},
		{
			path: '/pages/bargain/index', //天天特价
			name: 'bargain',
			meta: {
				keepAlive: true,
				title: '天天特价'
			},
			component: resolve => require(['@/pages/bargain/index'], resolve),
		},
		{
			path: '/pages/home/search', //首页点击搜索跳转页面
			name: 'search',
			meta: {
				title: '搜索'
			},
			component: resolve => require(['@/pages/home/search'], resolve),
		},
		{
			path: '/pages/home/searchResult', //搜索结果
			name: 'searchResult',
			meta: {
				title: '搜索结果'
			},
			component: resolve => require(['@/pages/home/searchResult'], resolve),
		},
		{
			path: '/pages/store/home', //门店首页
			name: 'storeHome',
			meta: {
				title: '门店首页'
			},
			component: resolve => require(['@/pages/store/home'], resolve),
		},
		{
			path: '/pages/member/favorite', //我的收藏
			name: 'favorite',
			meta: {
				title: '我的收藏'
			},
			component: resolve => require(['@/pages/member/favorite'], resolve),
		},
		{
			path: '/pages/member/profile', //会员资料
			name: 'memberProfile',
			meta: {
				title: '会员资料'
			},
			component: resolve => require(['@/pages/member/profile'], resolve),
		},
		{
			path: '/pages/member/bind', //绑定手机
			name: 'memberBind',
			meta: {
				title: '绑定手机'
			},
			component: resolve => require(['@/pages/member/bind'], resolve),
		},
		{
			path: '/pages/member/profileUsername', //修改用户名
			name: 'memberProfileUsername',
			meta: {
				title: '修改用户名'
			},
			component: resolve => require(['@/pages/member/profileUsername'], resolve),
		},
		{
			path: '/pages/member/profilePassword', //修改密码
			name: 'memberProfilePassword',
			meta: {
				title: '修改密码'
			},
			component: resolve => require(['@/pages/member/profilePassword'], resolve),
		},
		{
			path: '/pages/member/footmark', //地址编辑
			name: 'footmark',
			meta: {
				title: '我的足迹'
			},
			component: resolve => require(['@/pages/member/footmark'], resolve),
		},
		{
			path: '/pages/order/cart', //购物车
			name: 'cart',
			meta: {
				title: '购物车'
			},
			component: resolve => require(['@/pages/order/cart'], resolve),
		},
		{
			path: '/tangshi/pages/reserve/index', //预定
			name: 'reserveIndex',
			meta: {
				title: '预定时间'
			},
			component: resolve => require(['@/pages/reserve/index'], resolve),
		},
		{
			path: '/tangshi/pages/reserve/yuding', //预定
			name: 'reserveYuding',
			meta: {
				title: '预定'
			},
			component: resolve => require(['@/pages/reserve/yuding'], resolve),
		},
		{
			path: '/tangshi/pages/reserve/create', //预定提交
			name: 'reserveCreate',
			meta: {
				title: '预定提交'
			},
			component: resolve => require(['@/pages/reserve/create'], resolve),
		},
		{
			path: '/tangshi/pages/reserve/goods', //预定商品
			name: 'reserveGoods',
			meta: {
				title: '预定商品'
			},
			component: resolve => require(['@/pages/reserve/goods'], resolve),
		},
		{
			path: '/tangshi/pages/reserve/goodsDetail', //预定商品
			name: 'reserveDoodsDetail',
			meta: {
				title: '商品详情'
			},
			component: resolve => require(['@/pages/reserve/goodsDetail'], resolve),
		},
		{
			path: '/tangshi/pages/reserve/note', //预定商品
			name: 'reserveNote',
			meta: {
				title: '添加备注'
			},
			component: resolve => require(['@/pages/reserve/note'], resolve),
		},
		{
			path: '/pages/paotui/index', //跑腿首页
			name: 'paotuiIndex',
			meta: {
				title: '随意购'
			},
			component: resolve => require(['@/pages/paotui/index'], resolve),
		},
		{
			path: '/pages/paotui/diy', //跑腿场景
			name: 'paotuiDiy',
			meta: {
				title: '跑腿场景'
			},
			component: resolve => require(['@/pages/paotui/diy'], resolve),
		},
		{
			path: '/pages/paotui/guide', //跑腿引导页
			name: 'paotuiGuide',
			meta: {
				title: '跑腿'
			},
			component: resolve => require(['@/pages/paotui/guide'], resolve),
		},
		{
			path: '/pages/paotui/order', //跑腿订单列表页
			name: 'paotuiOrder',
			meta: {
				title: '跑腿订单'
			},
			component: resolve => require(['@/pages/paotui/order'], resolve),
		},
		{
			path: '/pages/paotui/detail', //跑腿订单详情页
			name: 'paotuiOrderDetail',
			meta: {
				title: '订单详情'
			},
			component: resolve => require(['@/pages/paotui/detail'], resolve),
		},
		{
			path: '/pages/paotui/map', //跑腿订单实时定位页
			name: 'paotuiOrderMap',
			meta: {
				title: '订单实时定位'
			},
			component: resolve => require(['@/pages/paotui/map'], resolve),
		},
		{
			path: '/pages/paotui/location', //跑腿订单定位页
			name: 'paotuiLocation',
			meta: {
				title: '选择地址'
			},
			component: resolve => require(['@/pages/paotui/location'], resolve),
		},
		{
			path: '/pages/diy/index', //自定义页面
			name: 'diyIndex',
			meta: {
				title: ''
			},
			component: resolve => require(['@/pages/diy/index'], resolve),
		},
		{
			path: '/pages/home/notice', //公告详情
			name: 'homeNotice',
			meta: {
				title: '公告'
			},
			component: resolve => require(['@/pages/home/notice'], resolve),
		},
		{
			path: '/pages/public/alipay', //支付宝支付
			name: 'publicAlipay',
			meta: {
				title: '支付宝支付'
			},
			component: resolve => require(['@/pages/public/alipay'], resolve),
		},
		{
			path: '/pages/member/coupon/indexCopy', //我的代金券重做
			name: 'couponIndexCopy',
			meta: {
				title: '我的代金券重做'
			},
			component: resolve => require(['@/pages/member/coupon/indexCopy'], resolve),
		},
		{
			path: '/package/pages/svip/index', //超级会员
			name: 'svipIndex',
			meta: {
				title: '超级会员'
			},
			component: resolve => require(['@/pages/svip/index'], resolve),
		},
		{
			path: '/package/pages/svip/purchase', //超级会员购买
			name: 'svipPurchase',
			meta: {
				title: '超级会员购买'
			},
			component: resolve => require(['@/pages/svip/purchase'], resolve),
		},
		{
			path: '/package/pages/svip/redpacketCoupon', //超级会员红包券
			name: 'svipRedpacketCoupon',
			meta: {
				title: '超级会员红包券'
			},
			component: resolve => require(['@/pages/svip/redpacketCoupon'], resolve),
		},
		{
			path: '/package/pages/svip/mine', //超级会员个人中心
				name: 'svipMine',
			meta: {
				title: '超级会员个人中心'
			},
			component: resolve => require(['@/pages/svip/mine'], resolve),
		},
		{
			path: '/package/pages/svip/vipEnjoy', //会员专享
			name: 'svipvipEnjoy',
			meta: {
			title: '会员专享'
		},
			component: resolve => require(['@/pages/svip/vipEnjoy'], resolve),
		},
		{
			path: '/package/pages/svip/mission', //会员任务
			name: 'svipMission',
			meta: {
				title: '会员任务'
			},
			component: resolve => require(['@/pages/svip/mission'], resolve),
		},
		{
			path: '/package/pages/svip/missionList', //我的任务
			name: 'svipMissionList',
			meta: {
				title: '我的任务'
			},
			component: resolve => require(['@/pages/svip/missionList'], resolve),
		},
		{
			path: '/package/pages/svip/record', //奖励明细
				name: 'svipRecord',
			meta: {
				title: '奖励明细'
			},
			component: resolve => require(['@/pages/svip/record'], resolve),
		},
		{
			path: '/package/pages/svip/svipExchange', //兑换超级会员
			name: 'svipExchange',
			meta: {
				title: '兑换超级会员'
			},
			component: resolve => require(['@/pages/svip/svipExchange'], resolve),
		},
		{
			path: '/pages/store/settle', //商户入驻
			name: 'storeSettle',
			meta: {
				title: '商户入驻'
			},
			component: resolve => require(['@/pages/store/settle'], resolve),
		},
		{
			path: '/pages/store/application', //商户入驻完善商户信息
			name: 'storeApplication',
			meta: {
				title: '商户信息'
			},
			component: resolve => require(['@/pages/store/application'], resolve),
		},
		{
			path: '/package/pages/storebd/commission',
			name: 'storebdCommission',
			meta: {
				title: '推广佣金'
			},
			component: resolve => require(['@/pages/storebd/commission'], resolve),
		},
		{
			path: '/package/pages/storebd/getcash', //立即提现
			name: 'storebdGetcash',
			meta: {
				title: '立即提现'
			},
			component: resolve => require(['@/pages/storebd/getcash'], resolve),
		},
		{
			path: '/package/pages/storebd/getcashlog', //立即提现
			name: 'storebdGetcashLog',
			meta: {
				title: '提现明细'
			},
			component: resolve => require(['@/pages/storebd/getcashlog'], resolve),
		},
		{
			path: '/package/pages/storebd/current', //立即提现
			name: 'storebdCurrent',
			meta: {
				title: '账户明细'
			},
			component: resolve => require(['@/pages/storebd/current'], resolve),
		},
		{
			path: '/package/pages/storebd/store', //推广店铺
			name: 'storebdStorebdStore',
			meta: {
				title: '推广店铺'
			},
			component: resolve => require(['@/pages/storebd/store'], resolve),
		},
		{
			path: '/package/pages/storebd/index',
			name: 'storebdIndex',
			meta: {
				title: '店铺推广员'
			},
			component: resolve => require(['@/pages/storebd/index'], resolve),
		},
		{
			path: '/tangshi/pages/table/goods',
			name: 'tableGoods',
			meta: {
				title: '商品'
			},
			component: resolve => require(['@/pages/table/goods'], resolve),
		},
		{
			path: '/pages/table/goods',
			name: 'oldTableGoods',
			meta: {
				title: '商品'
			},
			component: resolve => require(['@/pages/table/goods'], resolve),
		},
		{
			path: '/pages/table/goods',
			meta: {
				title: '商品'
			},
			component: resolve => require(['@/pages/table/goodsOld'], resolve),
		},
		{
			path: '/tangshi/pages/table/goodsDetail',
			name: 'tableGoodsDetail',
			meta: {
				title: '商品详情'
			},
			component: resolve => require(['@/pages/table/goodsDetail'], resolve),
		},
		{
			path: '/tangshi/pages/table/create',
			name: 'tableCreate',
			meta: {
				title: '订单确认'
			},
			component: resolve => require(['@/pages/table/create'], resolve),
		},
		{
			path: '/tangshi/pages/table/note',
			name: 'tableNote',
			meta: {
				title: '订单备注'
			},
			component: resolve => require(['@/pages/table/note'], resolve),
		},
		{
			path: '/pages/vip/index',
			name: 'vipIndex',
			meta: {
				title: '自定义会员首页'
			},
			component: resolve => require(['@/pages/vip/index'], resolve),
		},
		{
			path: '/pages/vip/recharge',
			name: 'vipRecharge',
			meta: {
				title: '自定义会员充值'
			},
			component: resolve => require(['@/pages/vip/recharge'], resolve),
		},
		{
			path: '/pages/public/peerpay/index',
			name: 'peerpayIndex',
			meta: {
				title: '找人代付'
			},
			component: resolve => require(['@/pages/public/peerpay/index'], resolve),
		},
		{
			path: '/pages/public/peerpay/paylist',
			name: 'peerpayPaylist',
			meta: {
				title: '找人代付支付页'
			},
			component: resolve => require(['@/pages/public/peerpay/paylist'], resolve),
		},
		{
			path: '/pages/public/peerpay/payment',
			name: 'peerpayPayment',
			meta: {
				title: '我先付点'
			},
			component: resolve => require(['@/pages/public/peerpay/payment'], resolve),
		},
		{
			path: '/pages/public/dowload/appDelivery',
			name: 'dowloadAppDelivery',
			meta: {
				title: '配送员APP下载'
			},
			component: resolve => require(['@/pages/public/dowload/appDelivery'], resolve),
		},
		{
			path: '/pages/public/dowload/appManager',
			name: 'dowloadAppManager',
			meta: {
				title: '商户端APP下载'
			},
			component: resolve => require(['@/pages/public/dowload/appManager'], resolve),
		},
		{
			path: '/pages/public/dowload/appCustomer',
			name: 'dowloadAppCustomer',
			meta: {
				title: '顾客端APP下载'
			},
			component: resolve => require(['@/pages/public/dowload/appCustomer'], resolve),
		},
		{
			path: '/pages/public/dowload/appPlateform',// 平台管理端APP下载
			name: 'dowloadAppPlateform',
			meta: {
				title: '平台管理端APP下载'
			},
			component: resolve => require(['@/pages/public/dowload/appPlateform'], resolve),
		},
		{
			path: '/package/pages/mealRedpacket/meal', //套餐红包购买
			name: 'mealRedpacket',
			meta: {
				title: '套餐红包购买'
			},
			component: resolve => require(['@/pages/mealRedpacket/meal'], resolve),
		},
		{
			path: '/package/pages/mealRedpacket/ordermeal', //套餐红包购买记录
			name: 'mealRedpacketMealOrder',
			meta: {
				title: '购买记录'
			},
			component: resolve => require(['@/pages/mealRedpacket/ordermeal'], resolve),
		},
		{
			path: '/package/pages/mealRedpacket/plus', //套餐红包plus
			name: 'mealRedpacketPlus',
			meta: {
				title: '套餐红包Plus购买'
			},
			component: resolve => require(['@/pages/mealRedpacket/plus'], resolve),
		},
		{
			path: '/package/pages/mealRedpacket/orderplus', //套餐plus购买记录
			name: 'mealRedpacketPlusOrder',
			meta: {
				title: '套餐红包购买记录'
			},
			component: resolve => require(['@/pages/mealRedpacket/orderplus'], resolve),
		},
		{
			path: '/gohome/pages/kanjia/index',
			name: 'kanjiaIndex',
			meta: {
				title: '疯狂砍价'
			},
			component: resolve => require(['@/pages/gohome/kanjia/index'], resolve),
		},
		{
			path: '/gohome/pages/kanjia/category',
			name: 'kanjiaCategory',
			meta: {
				title: '疯狂砍价'
			},
			component: resolve => require(['@/pages/gohome/kanjia/category'], resolve),
		},
		{
			path: '/gohome/pages/kanjia/detail',
			name: 'kanjiaDetail',
			meta: {
				title: '商品详情'
			},
			component: resolve => require(['@/pages/gohome/kanjia/detail'], resolve),
		},
		{
			path: '/gohome/pages/kanjia/share',
			name: 'kanjiaShare',
			meta: {
				title: '砍价进行中'
			},
			component: resolve => require(['@/pages/gohome/kanjia/share'], resolve),
		},
		{
			path: '/gohome/pages/kanjia/record',
			name: 'kanjiaRecord',
			meta: {
				title: '砍价记录列表'
			},
			component: resolve => require(['@/pages/gohome/kanjia/record'], resolve),
		},
		{
			path: '/gohome/pages/order/index',// 砍抢团订单列表
			name: 'gohomeOrderList',
			meta: {
				title: '我的订单'
			},
			component: resolve => require(['@/pages/gohome/order/index'], resolve),
		},
		{
			path: '/gohome/pages/kanjia/order/create',
			name: 'kanjiaOrderCreate',
			meta: {
				title: '确认订单'
			},
			component: resolve => require(['@/pages/gohome/kanjia/order/create'], resolve),
		},
		{
			path: '/gohome/pages/order/detail',
			name: 'gohomeOrderDetail',
			meta: {
				title: '订单详情'
			},
			component: resolve => require(['@/pages/gohome/order/detail'], resolve),
		},
		{
			path: '/gohome/pages/member/favorite',
			name: 'gohomeFavorite',
			meta: {
				title: '我的收藏'
			},
			component: resolve => require(['@/pages/gohome/member/favorite'], resolve),
		},
		{
			path: '/gohome/pages/comment/comment',
			name: 'gohomeComment',
			meta: {
				title: '评价'
			},
			component: resolve => require(['@/pages/gohome/comment/comment'], resolve),
		},
		{
			path: '/gohome/pages/pintuan/category',
			name: 'pintuanCategory',
			meta: {
				title: '钜惠拼团'
			},
			component: resolve => require(['@/pages/gohome/pintuan/category'], resolve),
		},
		{
			path: '/gohome/pages/pintuan/index',
			name: 'pintuanIndex',
			meta: {
				title: '钜惠拼团'
			},
			component: resolve => require(['@/pages/gohome/pintuan/index'], resolve),
		},
		{
			path: '/gohome/pages/pintuan/detail',
			name: 'pintuanDetail',
			meta: {
				title: '商品详情'
			},
			component: resolve => require(['@/pages/gohome/pintuan/detail'], resolve),
		},
		{
			path: '/gohome/pages/pintuan/create',
			name: 'pintuanCreate',
			meta: {
				title: '拼团确认'
			},
			component: resolve => require(['@/pages/gohome/pintuan/create'], resolve),
		},
		{
			path: '/gohome/pages/pintuan/share',
			name: 'pintuanShare',
			meta: {
				title: '拼团进行中'
			},
			component: resolve => require(['@/pages/gohome/pintuan/share'], resolve),
		},
		{
			path: '/gohome/pages/poster/index',
			meta: {
				title: '商品海报'
			},
			component: resolve => require(['@/pages/gohome/poster/index'], resolve),
		},
		{
			path: '/gohome/pages/seckill/index',
			meta: {
				title: '超值抢购'
			},
			component: resolve => require(['@/pages/gohome/seckill/index'], resolve),
		},
		{
			path: '/gohome/pages/seckill/category',
			meta: {
				title: '超值抢购'
			},
			component: resolve => require(['@/pages/gohome/seckill/category'], resolve),
		},
		{
			path: '/gohome/pages/seckill/detail',
			meta: {
				title: '商品详情'
			},
			component: resolve => require(['@/pages/gohome/seckill/detail'], resolve),
		},
		{
			path: '/gohome/pages/seckill/order/create',
			meta: {
				title: '确认订单'
			},
			component: resolve => require(['@/pages/gohome/seckill/order/create'], resolve),
		},
		{
			path: '/gohome/pages/complain/index',
			meta: {
				title: '投诉'
			},
			component: resolve => require(['@/pages/gohome/complain/index'], resolve),
		},
		{
			path: '/gohome/pages/tongcheng/index',
			meta: {
				title: '同城信息'
			},
			component: resolve => require(['@/pages/gohome/tongcheng/index'], resolve),
		},
		{
			path: '/gohome/pages/tongcheng/category',
			meta: {
				title: '同城分类'
			},
			component: resolve => require(['@/pages/gohome/tongcheng/category'], resolve),
		},
		{
			path: '/gohome/pages/tongcheng/detail', //帖子详情
			meta: {
				title: '帖子详情'
			},
			component: resolve => require(['@/pages/gohome/tongcheng/detail'], resolve),
		},
		{
			path: '/gohome/pages/tongcheng/publish/index', //发布首页
			meta: {
				title: '发布信息'
			},
			component: resolve => require(['@/pages/gohome/tongcheng/publish/index'], resolve),
		},
		{
			path: '/gohome/pages/tongcheng/publish/post',
			meta: {
				title: '编辑帖子'
			},
			component: resolve => require(['@/pages/gohome/tongcheng/publish/post'], resolve),
		},
		{
			path: '/gohome/pages/tongcheng/publish/list',
			meta: {
				title: '我的发布'
			},
			component: resolve => require(['@/pages/gohome/tongcheng/publish/list'], resolve),
		},
		{
			path: '/gohome/pages/home/index',
			name: 'gohomeIndex',
			meta: {
				title: '生活圈'
			},
			component: resolve => require(['@/pages/gohome/home/index'], resolve),
		},
		{
			path: '/gohome/pages/tongcheng/publish/stick',
			meta: {
				title: '发布置顶'
			},
			component: resolve => require(['@/pages/gohome/tongcheng/publish/stick'], resolve),
		},
		{
			path: '/gohome/pages/tongcheng/search',
			meta: {
				title: '搜索'
			},
			component: resolve => require(['@/pages/gohome/tongcheng/search'], resolve),
		},
		{
			path: '/gohome/pages/tongcheng/searchResult',
			meta: {
				title: '搜索结果'
			},
			component: resolve => require(['@/pages/gohome/tongcheng/searchResult'], resolve),
		},
		{
			path: '/gohome/pages/haodian/index',
			meta: {
				title: '好店'
			},
			component: resolve => require(['@/pages/gohome/haodian/index'], resolve),
		},
		{
			path: '/gohome/pages/haodian/detail',
			meta: {
				title: '商户详情'
			},
			component: resolve => require(['@/pages/gohome/haodian/detail'], resolve),
		},
		{
			path: '/gohome/pages/haodian/application',
			meta: {
				title: '好店商户入驻'
			},
			component: resolve => require(['@/pages/gohome/haodian/application'], resolve),
		},
		{
			path: '/gohome/pages/haodian/settle',
			meta: {
				title: '申请入驻好店'
			},
			component: resolve => require(['@/pages/gohome/haodian/settle'], resolve),
		},
		{
			path: '/gohome/pages/haodian/search',
			meta: {
				title: '好店搜索'
			},
			component: resolve => require(['@/pages/gohome/haodian/search'], resolve),
		},
		{
			path: '/gohome/pages/haodian/searchResult',//筛选结果页
			meta: {
				title: '好店'
			},
			component: resolve => require(['@/pages/gohome/haodian/searchResult'], resolve),
		},
		{
			path: '/gohome/pages/haodian/category',//好店评价
			meta: {
				title: '好店分类'
			},
			component: resolve => require(['@/pages/gohome/haodian/category'], resolve),
		},
		{
			path: '/gohome/pages/haodian/comment',//好店评价
			meta: {
				title: '评价'
			},
			component: resolve => require(['@/pages/gohome/haodian/comment'], resolve),
		},
		{
			path: '/gohome/pages/yikatong/create', //一卡通会员开通
			meta: {
				title: '会员开通'
			},
			component: resolve => require(['@/pages/gohome/yikatong/create'], resolve),
		},
		{
			path: '/gohome/pages/yikatong/index', //一卡通首页
			meta: {
				title: '一卡通'
			},
			component: resolve => require(['@/pages/gohome/yikatong/index'], resolve),
		},
		{
			path: '/pages/store/search',
			meta: {
				title: '商品搜索'
			},
			component: resolve => require(['@/pages/store/search'], resolve),
		},
		{
			path: '/package/pages/iservice/index',
			meta: {
				title: '服务市场'
			},
			component: resolve => require(['@/pages/iservice/index'], resolve),
		},
		{
			path: '/package/pages/iservice/category',
			meta: {
				title: '服务分类'
			},
			component: resolve => require(['@/pages/iservice/category'], resolve),
		},
		{
			path: '/package/pages/iservice/detail',
			meta: {
				title: '服务详情'
			},
			component: resolve => require(['@/pages/iservice/detail'], resolve),
		},
		{
			path: '/package/pages/iservice/create',
			meta: {
				title: '订单确认'
			},
			component: resolve => require(['@/pages/iservice/create'], resolve),
		},
		{
			path: '/pages/store/pindan',
			name: 'storePindan',
			meta: {
				title: '拼单'
			},
			component: resolve => require(['@/pages/store/pindan'], resolve),
		},
		{
			path: '/pages/order/pindanbill',
			name: 'orderPindanBill',
			meta: {
				title: '拼单详情'
			},
			component: resolve => require(['@/pages/order/pindanbill'], resolve),
		},
		{
			path: '/pages/public/mallClose',
			name: 'mallClose',
			meta: {
				title: '平台关闭中'
			},
			component: resolve => require(['@/pages/public/mallClose'], resolve),
		},
		{
			path: '/pages/order/address',
			name: 'orderAddress',
			meta: {
				title: '修改收货信息'
			},
			component: resolve => require(['@/pages/order/address'], resolve),
		},
		{
			path: '/pages/order/op',
			name: 'orderOp',
			meta: {
				title: '修改订单信息'
			},
			component: resolve => require(['@/pages/order/op'], resolve),
		},
		{
			path: '/pages/order/zhunshibao',
			name: 'orderZhunshibao',
			meta: {
				title: '准时宝详情'
			},
			component: resolve => require(['@/pages/order/zhunshibao'], resolve),
		},
		{
			path: '/pages/order/opUpdate',
			name: 'orderOpUpdate',
			meta: {
				title: '修改订单信息'
			},
			component: resolve => require(['@/pages/order/opUpdate'], resolve),
		},
		{
			path: '/pages/home/allcategory',
			name: 'homeAllcategory',
			meta: {
				title: '全部分类'
			},
			component: resolve => require(['@/pages/home/allcategory'], resolve),
		},
	]
})



// WEBPACK FOOTER //
// ./src/router/index.js