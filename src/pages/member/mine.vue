<template>
	<div id="member-mine">
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<template v-if="!is_use_diy">
				<div class="diy-memberHeader">
					<div class="member-headinfo">
						<div class="headinfo-balance">
							<div class="headinfo-balance-price">余额</div>
							<div class="headinfo-price">{{data.credit2}}</div>
							<router-link class="headinfo-filling-price" tag="div" :to="util.getUrl({path: '/pages/member/recharge'})">充值</router-link>
						</div>
						<div class="headinfo-user">
							<div class="user-face" @click="util.jsUrl(util.getSiteUrl('system/common/vuesession/userinfo', {force: 1}, true))">
								<img :src="data.user.avatar" alt="">
							</div>
							<div class="user-name">{{data.user.nickname}}</div>
							<div class="user-level" v-if="data.user.groupname"> [{{data.user.groupname}}] </div>
						</div>
						<div class="headinfo-balance">
							<div class="headinfo-balance-price">酒币</div>
							<div class="headinfo-price">{{data.credit1}}</div>
							<!-- <router-link class="headinfo-filling-price" tag="div" :to="util.getUrl({path: '/pages/creditshop/index'})">兑换</router-link> -->
						</div>
						<router-link tag="div" :to="util.getUrl({path: '/pages/member/profile'})" class="setting">
							<van-icon name='settings' class="icon"></van-icon>
						</router-link>
					</div>
				</div>
				<router-link :to="util.getUrl({path: '/pages/member/bind'})" class="diy-mobile-bind" tag="div" v-if="!data.user.mobile">
					<ul>
						<li class="item-content">
							<div class="item-media">
								<van-icon name='phone1'></van-icon>
							</div>
							<div class="item-inner">
								<div class="item-title">绑定手机号</div>
							</div>
							<van-icon name='right' class="right-icon"></van-icon>
						</li>
						<div class="notice">
							如果您用手机号注册过会员或您想通过微信外购物请绑定您的手机号码
						</div>
					</ul>
				</router-link>
				<div class="diy-blockNav">
					<div class="col-4">
						<router-link :to="util.getUrl({path: '/pages/member/favorite'})" tag="div" class="diy-icon-col">
							<div class="icon-img">
								<van-icon name='favor_light' class="icon"></van-icon>
							</div>
							<div class="text-icon">我的收藏</div>
						</router-link>
						<router-link :to="util.getUrl({path: '/pages/member/address'})" tag="div" class="diy-icon-col">
							<div class="icon-img">
								<van-icon name='zuobiao' class="icon"></van-icon>
							</div>
							<div class="text-icon">我的地址</div>
						</router-link>
						<router-link :to="util.getUrl({path: '/pages/member/footmark'})" tag="div" class="diy-icon-col">
							<div class="icon-img">
								<van-icon name='footprint' class="icon"></van-icon>
							</div>
							<div class="text-icon">我的足迹</div>
						</router-link>
						<router-link :to="util.getUrl({path: '/gohome/pages/order/index'})" tag="div" class="diy-icon-col">
							<div class="icon-img">
								<van-icon name='order' class="icon"></van-icon>
								<span class="nav-mark" v-if="0">hot</span>
							</div>
							<div class="text-icon">我的订单</div>
						</router-link>
					</div>
				</div>
				<router-link tag="div" :to="util.getUrl({path: '/package/pages/mealRedpacket/meal'})" class="diy-mealRedpacket flex-lr" v-if="data.mealRedpacket.status == 1">
					<div class="my-mealRedpacket flex">
						<div class="mealRedpacket-logo">
							<img src="static/img/meal/meal_logo.png" alt="">
						</div>
						<div class="mealRedpacket-tip" v-if="data.mealRedpacket.canBuy">{{data.mealRedpacket.title}}</div>
						<div class="mealRedpacket-tip" v-else>已获得{{data.mealRedpacket.total_redpacket}}元红包</div>
					</div>
					<span class="icon icon-right"></span>
				</router-link>
				<div class="diy-member-swiper" v-if="data.slides.length > 0">
					<van-swipe :autoplay="3000" indicator-color="#ff2d4b">
						<van-swipe-item v-for="(slide, index) in data.slides" :key="index">
							<router-link :to="util.getUrl({path: 'slide.link'})">
								<img :src="slide.thumb">
							</router-link>
						</van-swipe-item>
					</van-swipe>
				</div>
				<div class="diy-blockNav">
					<div class="blockNav-title border-1px-b">我的资产</div>
					<div class="col-4">
						<router-link class="diy-icon-col" :to="util.getUrl({path: '/pages/member/recharge'})" tag="div">
							<div class="icon-img">
								<van-icon name='recharge' class="icon"></van-icon>
							</div>
							<div class="text-icon">余额充值</div>
							<div class="icon-tips c-danger" v-if="data.credit2 > 0">¥{{data.credit2}}</div>
						</router-link>
						<router-link class="diy-icon-col" :to="util.getUrl({path: '/pages/member/redPacket/index'})" tag="div">
							<div class="icon-img">
								<van-icon name='money' class="icon"></van-icon>
							</div>
							<div class="text-icon">我的红包</div>
							<div class="icon-tips c-danger" v-if="data.redpacket_nums > 0">{{data.redpacket_nums}}个未使用</div>
						</router-link>
						<!-- <router-link class="diy-icon-col" :to="util.getUrl({path: '/pages/member/coupon/index'})" tag="div">
							<div class="icon-img">
								<van-icon name='iconpiaoquan01' class="icon"></van-icon>
							</div>
							<div class="text-icon">我的代金券</div>
							<div class="icon-tips c-danger" v-if="data.coupon_nums > 0">{{data.coupon_nums}}个未使用</div>
						</router-link>
						<router-link class="diy-icon-col" :to="util.getUrl({path: '/pages/deliveryCard/index'})" tag="div">
							<div class="icon-img">
								<van-icon name='vipcard' class="icon"></van-icon>
								<span class="nav-mark">hot</span>
							</div>
							<div class="text-icon">配送会员卡</div>
							<div class="icon-tips" :class="{'c-danger': data.deliveryCard_setmeal_ok == 1}">{{data.deliveryCard_setmeal_ok == 1 ? '已购买': '暂未购买'}}</div>
						</router-link>
						<router-link class="diy-icon-col" :to="util.getUrl({path: '/package/pages/svip/index'})" tag="div" v-if="data.has_svip == 1">
							<div class="icon-img">
								<van-icon name='vip' class="icon"></van-icon>
								<span class="nav-mark">new</span>
							</div>
							<div class="text-icon">超级会员</div>
							<div class="icon-tips" :class="{'c-danger': data.user.svip_status == 1}">{{data.user.svip_status == 1 ? '已购买': '暂未购买'}}</div>
						</router-link> -->
					</div>
				</div>
				<div class="diy-blockNav">
					<div class="blockNav-title border-1px-b">我的服务</div>
					<div class="col-4">
						<!-- <router-link :to="util.getUrl({path: '/pages/channel/brand'})" tag="div" class="diy-icon-col">
							<div class="icon-img">
								<van-icon name='dianpu' class="icon"></van-icon>
								<span class="nav-mark">hot</span>
							</div>
							<div class="text-icon">为您优选</div>
						</router-link>
						<router-link :to="util.getUrl({path: '/pages/bargain/index'})" tag="div" class="diy-icon-col">
							<div class="icon-img">
								<van-icon name='dianpu' class="icon"></van-icon>
								<span class="nav-mark">hot</span>
							</div>
							<div class="text-icon">天天特价</div>
						</router-link>
						<router-link :to="util.getUrl({path: '/pages/channel/coupon'})" tag="div" class="diy-icon-col">
							<div class="icon-img">
								<van-icon name='iconpiaoquan01' class="icon"></van-icon>
								<span class="nav-mark">hot</span>
							</div>
							<div class="text-icon">领券中心</div>
						</router-link> -->
						<router-link :to="util.getUrl({path: '/pages/home/help'})" tag="div" class="diy-icon-col">
							<div class="icon-img">
								<van-icon name='creative' class="icon"></van-icon>
							</div>
							<div class="text-icon">帮助与反馈</div>
						</router-link>
						<router-link :to="util.getUrl({path: '/pages/home/help'})" tag="div" class="diy-icon-col">
							<div class="icon-img">
								<van-icon name='service' class="icon"></van-icon>
							</div>
							<div class="text-icon">客服中心</div>
						</router-link>
					</div>
				</div>
				<!-- <div class="diy-blockNav" v-if="data.has_gohome == 1">
					<div class="blockNav-title border-1px-b">生活圈</div>
					<div class="col-4">
						<router-link :to="util.getUrl({path: '/gohome/pages/home/index'})" tag="div" class="diy-icon-col">
							<div class="icon-img">
								<van-icon name='home' class="icon"></van-icon>
								<span class="nav-mark">hot</span>
							</div>
							<div class="text-icon">生活圈首页</div>
						</router-link>
						<router-link :to="util.getUrl({path: '/gohome/pages/order/index'})" tag="div" class="diy-icon-col">
							<div class="icon-img">
								<van-icon name='order' class="icon"></van-icon>
								<span class="nav-mark" v-if="0">hot</span>
							</div>
							<div class="text-icon">我的订单</div>
						</router-link>
						<router-link :to="util.getUrl({path: '/gohome/pages/member/favorite'})" tag="div" class="diy-icon-col">
							<div class="icon-img">
								<van-icon name='like' class="icon"></van-icon>
								<span class="nav-mark" v-if="0">hot</span>
							</div>
							<div class="text-icon">我的收藏</div>
						</router-link>
						<router-link :to="util.getUrl({path: '/gohome/pages/kanjia/record'})" tag="div" class="diy-icon-col">
							<div class="icon-img">
								<van-icon name='activity' class="icon"></van-icon>
								<span class="nav-mark" v-if="0">hot</span>
							</div>
							<div class="text-icon">我的砍价</div>
						</router-link>
					</div>
				</div> -->
				<!-- <div class="diy-blockNav">
					<div class="blockNav-title border-1px-b">更多推荐</div>
					<div class="col-4">
						<router-link :to="util.getUrl({path: '/pages/spread/register'})" tag="div" class="diy-icon-col" v-if="data.spread">
							<div class="icon-img">
								<van-icon name='iconpiaoquan01' class="icon"></van-icon>
							</div>
							<div class="text-icon">{{data.spread.title}}</div>
						</router-link>
						<router-link :to="util.getUrl({path: '/package/pages/ordergrant/index'})" tag="div" class="diy-icon-col" v-if="data.ordergrant == 1">
							<div class="icon-img">
								<van-icon name='vipcard' class="icon"></van-icon>
							</div>
							<div class="text-icon">下单有礼</div>
						</router-link>
						<router-link :to="util.getUrl({path: '/pages/wheel/record'})" tag="div" class="diy-icon-col" v-if="data.has_wheel == 1">
							<div class="icon-img">
								<van-icon name='brand' class="icon"></van-icon>
							</div>
							<div class="text-icon">大转盘</div>
						</router-link>
					</div>
				</div> -->
				<!-- <div class="diy-blockNav">
					<div class="blockNav-title border-1px-b">商家管理</div>
					<div class="col-4">
						<div @click="util.jsUrl(data.cover.clerk)" tag="div" class="diy-icon-col">
							<div class="icon-img">
								<van-icon name='profile' class="icon"></van-icon>
							</div>
							<div class="text-icon">店员入口</div>
						</div>
						<div @click="util.jsUrl(data.cover.deliveryer)" tag="div" class="diy-icon-col">
							<div class="icon-img">
								<van-icon name='waimai' class="icon"></van-icon>
							</div>
							<div class="text-icon">配送员入口</div>
						</div>
						<router-link :to="util.getUrl({path: '/pages/store/settle'})" tag="div" class="diy-icon-col" v-if="data.config.store && data.config.store.settle && data.config.store.settle.status == 1">
							<div class="icon-img">
								<van-icon name='shop' class="icon"></van-icon>
							</div>
							<div class="text-icon">商户入驻</div>
						</router-link>
					</div>
				</div> -->
				<div v-html="data.config.mall.copyright" class="diy-copyright copyright"></div>
			</template>
			<template v-else>
				<diy :diydata="diydata"></diy>
			</template>
		</div>
	</div>
</template>

<script>
	import h5app from '@/config/h5app'
	import PublicFooter from '@/components/footer'
	import diy from '@/components/diy'

	export default {
  		name: 'MemberMine',
  		data() {
			return {
				showPreLoading: true,
				is_use_diy: 0,
				title: '会员中心',
				data: {
					user: {},
					credit1: '',
					credit2: '',
					config: {
						mall: {},
						store: {
							settle: {}
						}
					},
					coupon_nums: '',
					deliveryCard_status: '',
					deliveryCard_setmeal_ok: '',
					spread: {},
					ordergrant: '',
					slides: [],
					cover: {},
					mealRedpacket: {},
					has_gohome: 0,
					has_wheel: 0,
					has_svip: 0
				},
				star: 3,
				notice: false,
				diydata: {},
				menufooter: this.util.getStorage('menufooter'),
			}
		},
		components: {
			PublicFooter,
			diy
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'wmall/member/mine',
					data: {
						menufooter: 1
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message)
						return;
					}
					if(result.message.is_use_diy && result.message.is_use_diy == 1) {
						this.is_use_diy = result.message.is_use_diy;
						this.diydata = result.message;
						this.title = result.message.diy.data.page.title
					}
					this.data = result.message;
					if((this.util.getStorage('itime') == 1)) {
						let s = Math.floor(Math.random()*100);
						this.data.credit2 = s;
					}
					this.menufooter = window.menufooter;
					if(this.util.ish5app()) {
						h5app.init({
							relation: result.message.user.token
						});
					}
				})
			}
		},
		mounted() {
			this.util.imap();
			this.onLoad();
		}
	}
</script>

<style>
	@import '../../../static/css/diy.css';
	#member-mine{
		background: #f3f3f3;
	}
	#member-mine .content{
		top: 0;
	}
	.diy-member-swiper{
		margin-top: 10px;
		height: 80px;
	}
	.diy-member-swiper .van-swipe{
		height: 100%;
	}
	.diy-member-swiper .van-swipe img{
		width: 100%;
		height: 100%;
	}
</style>



// WEBPACK FOOTER //
// src/pages/member/mine.vue