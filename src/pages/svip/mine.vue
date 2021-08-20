<template>
	<div id="svip-mine">
		<public-header title="超级会员"></public-header>
		<public-footer :menufooter="menufooter" :preLoading="showPreLoading"></public-footer>
		<div class="content">
			<div class="svip-header">
				<div class="flex margin-10-b">
					<div class="avatar">
						<img :src="member.avatar" alt="">
					</div>
					<div class="margin-10-lr member-info">
						<div class="user-title">{{member.nickname}}</div>
						<div class="font-12 flex padding-5-t">
							<template v-if="0">
								<i class="icon icon-location"></i>
								<span>太原</span>
								<i class="icon icon-right"></i>
							</template>
							<span>{{member.svip_endtime_cn}} 到期 </span>
							<i class="icon icon-question1"></i>
						</div>
					</div>
					<router-link tag="div" :to="util.getUrl({path: '/package/pages/svip/purchase'})" class="pay-button">管理续费</router-link>
				</div>
				<div class="discounts-group">
					<div class="discounts-list flex">
						<div class="discounts-item">
							<div class="font-14">免费红包</div>
							<div class="num">
								<span>{{member.exchange_max}}</span>
								个
							</div>
							<router-link tag="div" :to="util.getUrl({path: '/package/pages/svip/redpacketCoupon'})" class="discounts-but">领取</router-link>
						</div>
						<div class="discounts-item">
							<div class="font-12">奖励金</div>
							<div class="num">
								<span>{{member.svip_credit1}}</span>
								个
							</div>
							<router-link tag="div" :to="util.getUrl({path: '/package/pages/svip/redpacketCoupon', query: {exchange_cost: 1}})" class="discounts-but">兑换</router-link>
						</div>
						<div class="discounts-item">
							<div class="font-12">已节省</div>
							<div class="num">
								<span>{{member.total_discount}}</span>
								元
							</div>
							<router-link tag="div" :to="util.getUrl({path: '/package/pages/svip/record'})" class="discounts-but">查看</router-link>
						</div>
					</div>
					<div class="notice">
						<div class="notice-group">
							<i class="icon icon-shengyin"></i>
							<span>每月可免费领取{{member.exchange_max}}个红包，本月已领取{{member.num_taked}}个</span>
						</div>
					</div>
				</div>
			</div>
			<div class="padding-15">
				<div class="svip-body" v-if="tasks && tasks.length > 0">
					<div class="margin-10-b flex-lr">
						<div class="font-16 font-bold">会员特属任务 <span class="font-14 c-gray"></span></div>
						<router-link tag="div" :to="util.getUrl({path: '/package/pages/svip/mission'})" class="font-14 c-gray">更多<i class="icon icon-right"></i></router-link>
					</div>
					<div class="mission-list">
						<div class="mission-item" v-for="item in tasks" :key="item.id">
							<div class="mission-left">
								<img :src="item.thumb" alt="">
							</div>
							<div class="mission-right flex-lr">
								<div class="activity-info">
									<div class="font-15 c-default">{{item.title}}</div>
									<div class="ellipsis">{{item.content}}</div>
									<div class="c-danger font-13 padding-5-b" v-if="0">这里是领取任务后展示任务奖励</div>
								</div>
								<div class="activity-price">
									<div class="c-danger font-13 padding-5-b">{{item.award_cn}}</div>
									<div class="activity-but" @click="onTakepartTask(item.id, item.button.link_type, item.button.link)">{{item.button.text}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="svip-body" v-if="redpackets && redpackets.length > 0">
					<div class="margin-10-b flex-lr">
						<div class="font-16 font-bold">会员专享红包</div>
						<router-link tag="div" :to="util.getUrl({path: '/package/pages/svip/redpacketCoupon'})"  class="font-14 c-gray">详情<i class="icon icon-right"></i></router-link>
					</div>
					<div class="redpacket-list flex">
						<div class="redpacket-item" v-for="(item, index) in redpackets" :key="item.id">
							<div class="redpacket-title">
								<div class="font-bold c-default price ellipsis">
									<i>¥</i>
									<span>{{item.discount}}</span>
								</div>
								<div class="info">
									<div class="font-14 ellipsis">{{item.title}}</div>
									<div class="font-12 c-gray ellipsis padding-5-t" v-if="item.condition == 0">无门槛</div>
									<div class="font-12 c-gray ellipsis padding-5-t" v-else-if="item.condition > 0">满{{item.condition}}元</div>
								</div>
							</div>
							<div class="redpacket-but" @click="onExchange(item.id)">领取</div>
						</div>
					</div>
				</div>
				<div class="svip-body">
					<div class="margin-10-b flex-lr">
						<div class="font-16 font-bold">会员特权</div>
						<div class="font-14 c-gray" @click="onTogglePopup">详情<i class="icon icon-right"></i></div>
					</div>
					<ul class="tequan-item">
						<li>
							<img src="static/img/svip-list-bg1.png" alt="">
							<span>专享红包</span>
						</li>
						<li>
							<img src="static/img/svip-list-bg2.png" alt="">
							<span>奖励金</span>
						</li>
						<li>
							<img src="static/img/svip-list-bg3.png" alt="">
							<span>专属客服</span>
						</li>
						<li>
							<img src="static/img/svip-list-bg4.png" alt="">
							<span>专属折扣</span>
						</li>
						<li>
							<img src="static/img/svip-list-bg5.png" alt="">
							<span>金币特权</span>
						</li>
					</ul>
				</div>
				<div class="svip-body" v-if="goods && goods.length > 0">
					<div class="margin-10-b flex-lr">
						<div class="font-16 font-bold">专享商品</div>
						<router-link tag="div" :to="util.getUrl({path: '/package/pages/svip/vipEnjoy'})" class="font-14 c-gray" >更多<i class="icon icon-right"></i></router-link>
					</div>
					<div class="goods-list">
						<div class="goods-item" v-for="(item, index) in goods" :key="item.id">
							<div class="flex-lr">
								<div class="goods-img">
									<img :src="item.thumb" alt="">
								</div>
								<div class="goods-info">
									<div>
										<div class="font-14 flex-lr c-gray">
											<div>{{item.store_title}}</div>
											<div>{{item.store_score}}分</div>
										</div>
										<div class="font-16 c-default padding-5-t">{{item.title}}</div>
										<div class="goods-discount">
											<i class="icon icon-crownfill font-12"></i>
											{{item.svip_discount}}折
										</div>
									</div>
									<div class="flex-lr">
										<div>
											<span class="font-14 c-danger">¥ <span class="font-20">{{item.svip_price}}</span></span>
											<span class="font-14 c-gray line-through">¥{{item.price}}</span>
										</div>
										<router-link tag="div" :to="util.getUrl({path: 'pages/store/goodsDetail', query: {sid: item.sid, id: item.id}})" class="goods-but">立即抢</router-link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<van-popup v-model="agreementShow" position="bottom" class="agreement-popup">
			<van-nav-bar class="border-0px" title="会员特权说明" @click-left="onTogglePopup" :style="{background: '#ff2d4b', color: '#fff' }">
				<van-icon name="left" :style="{color: '#fff'}" slot="left" class="font-20"></van-icon>
			</van-nav-bar>
			<div class="popup-content margin-10" v-html="agreement"></div>
		</van-popup>
	</div>
</template>

<script>
	import publicHeader from "@/components/header"
	import publicFooter from "@/components/footer"
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		components: {
			publicHeader,
			publicFooter
		},
		data() {
			return {
				member: {
					num_taked: 0,
					total_discount: 0,
				},
				redpackets: [],
				goods: [],
				tasks: [],
				islegal: false,
				menufooter: {},
				showPreLoading: true,
				agreement: '',
				agreementShow: false
			}
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'svip/mine',
					data: {
						menufooter: 1
					},
					success: (res) => {
						that.member = Object.assign(that.member, res.member);
						if(res.redpackets) {
							that.redpackets = [...res.redpackets];
						}
						if(res.goods) {
							that.goods = [...res.goods];
						}
						that.tasks = res.tasks;
						that.agreement = res.agreement;
						that.islegal = true;
					},
					fail: (res) => {
						if(res.errno == -2) {
							that.util.$toast(res.message, that.util.getUrl({path: '/package/pages/svip/index'}), 1500, 'replace')
						} else {
							that.util.$toast(res.message);
							return;
						}
					}
				})
			},
			onExchange(id) {
				var that = this;
				if(!that.islegal) {
					return;
				}
				that.islegal = false;
				setData({
					vue: that,
					url: 'svip/mine/exchange',
					data: {
						id: id,
						exchange_cost: -1
					},
					confirm: '确认领取该红包吗？',
					success: (res) => {
						that.util.$toast('领取成功');
						that.$set(that.member, 'num_taked', res.num_taked);
						that.$set(that.member, 'total_discount', res.total_discount);
						that.islegal = true;
					},
					fail: (res) => {
						that.util.$toast(res.message);
						that.islegal = true;
					},
					cancel: () => {
						that.islegal = true;
					}
				})
			},
			onTakepartTask(id, link_type, link) {
				var that = this;
				if(link_type == 1) {
					that.$router.push(that.util.getUrl({path: link}));
					return;
				}
				if(!that.islegal) {
					return;
				}
				that.islegal = false;
				setData({
					vue: that,
					url: 'svip/task/takepart',
					data: {id: id},
					success: function(res) {
						that.islegal = true;
						that.util.$toast(res, '', 1000);
						that.onLoad();
					},
					fail: (res) => {
						that.islegal = true;
						that.util.$toast(res.message, '', 1000);
					}
				});
			},
			onTogglePopup() {
				this.agreementShow = !this.agreementShow;
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#svip-mine #public-header .van-nav-bar{
		background-color: #14110f!important;
	}
	#svip-mine .svip-header{
		background-image: linear-gradient(-8deg,hsla(0,0%,93%,0),hsla(0,0%,92%,0) 25%,#14110f 25.1%,#14110f);
		background-size: 100% 70%;
		background-repeat: no-repeat;
		color: #e7b986;
		padding: 15px;
	}
	#svip-mine .svip-header .avatar{
		width: 40px;
		height: 40px;
	}
	#svip-mine .svip-header .avatar img{
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	#svip-mine .svip-header .user-title{
		font-size: 20px;
		font-weight: 500;
	}
	#svip-mine .svip-header .member-info{
		flex: 1;
	}
	#svip-mine .svip-header .member-info .icon-question1{
		padding-left: 3px;
		opacity: .6;
	}
	#svip-mine .svip-header .pay-button{
		background: none;
		border-radius: 50px;
		border: 1px solid #f2d499;
		color: #f2d499;
		font-size: 13px;
		padding: 4px 10px;
	}
	#svip-mine .svip-header .discounts-group{
		position: relative;
		margin-bottom: 10px;
		z-index: 1;
	}
	#svip-mine .svip-header .discounts-group .discounts-list{
		background-image: linear-gradient(90deg,#f5e3c1,#f2d499);
		color: rgba(64,33,10,.8);
		border-radius: 8px;
		box-shadow: 0 2px 4px 0 rgba(0,0,0,.03);
		background-color: #fff;
		padding: 10px;
		background-position: 50%;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}
	#svip-mine .svip-header .discounts-group .discounts-list:after{
		content: "";
		position: absolute;
		width: 0;
		height: 0;
		border: 5px solid transparent;
		border-bottom-color: #29211b;
		bottom: -1px;
		left: 45px;
	}
	#svip-mine .svip-header .discounts-group .discounts-list .discounts-item{
		padding-left: 10px;
		flex-direction: column;
		width: 33.333%;
		align-items: flex-start;
	}
	#svip-mine .svip-header .discounts-group .discounts-list .discounts-item .num{
		font-weight: 800;
		margin: 5px 0;
		font-size: 12px;
	}
	#svip-mine .svip-header .discounts-group .discounts-list .discounts-item .num span{
		font-size: 26px;
	}
	#svip-mine .svip-header .discounts-group .discounts-list .discounts-item .discounts-but{
		display: inline-block;
		padding: 3px 15px;
		border-radius: 50px;
		font-weight: 800;
		background-size: 110% 110%;
		min-width: 16vw;
		font-size: 14px;
		background-image: linear-gradient(90deg,#d2974f,#b27739);
		color: #fff;
	}
	#svip-mine .svip-header .discounts-group .notice{
		background-color: #29211b;
		position: absolute;
		width: 100%;
		height: 38px;
		left: 0;
		bottom: -20px;
		z-index: -1;
		border-radius: 0 0 8px 8px;
		border: 1px solid transparent;
		will-change: transform;
		animation: .2s slideDown ease-in-out;
	}
	#svip-mine .svip-header .discounts-group .notice .notice-group {
		color: #fff;
		margin-top: 17px;
		font-size: 13px;
		padding: 0 10px;
		line-height: 18px;
		display: flex;
		align-items: center
	}
	#svip-mine .svip-header .discounts-group .notice .notice-group .icon{
		color: #f2d499;
		padding-right: 5px;
	}
	#svip-mine .svip-body{
		border-radius: 8px;
		box-shadow: 0 2px 4px 0 rgba(0,0,0,.03);
		background-color: #fff;
		border: 1px solid rgba(0,0,0,.08);
		padding: 10px;
		background-position: 50%;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		height: 100%;
		overflow: hidden;
		margin-bottom: 15px;
	}
	#svip-mine .svip-body:last-child{
		margin-bottom: 0;
	}
	#svip-mine .svip-body .mission-item:last-child .mission-right,#svip-mine .svip-body .mission-item:last-child .mission-right{
		border: none;
	}
	#svip-mine .svip-body .mission-item{
		overflow: hidden;
		padding-top: 10px;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: flex-start;
	}
	#svip-mine .svip-body .mission-item .mission-left{
		padding-bottom: 15px;
	}
	#svip-mine .svip-body .mission-item .mission-left img{
		width: 36px;
		height: 36px;
	}
	#svip-mine .svip-body .mission-item .mission-right{
		width: 100%;
		padding-left: 10px;
		padding-bottom: 15px;
		border-bottom: 1px solid hsla(0,0%,93%,.5);
	}
	#svip-mine .svip-body .mission-item .activity-info{
		width: 70%;
		font-size: 12px;
		color: #999;
		line-height: 1.5;
	}
	#svip-mine .svip-body .mission-item .activity-price{
		width: 30%;
		text-align: center;
	}
	#svip-mine .svip-body .mission-item .activity-price .activity-but{
		display: inline-block;
		padding: 4px 15px;
		font-size: 13px;
		border-radius: 50px;
		color: #594519;
		background-image: linear-gradient(90deg,#faeaa7,#d4b96a);
		background-size: 110% 110%;
	}
	#svip-mine .svip-body .redpacket-list{
		overflow: hidden;
		height: 90px;
		overflow-x: auto;
	}
	#svip-mine .svip-body .redpacket-list .redpacket-item{
		flex-shrink: 0;
		color: #333;
		background-color: #fef9f0;
		flex-direction: column;
		margin-right: 4px;
		padding: 10px;
	}
	#svip-mine .svip-body .redpacket-list .redpacket-item .redpacket-title{
		display: flex;
		width: 100%;
		height: 30px;
	}
	#svip-mine .svip-body .redpacket-list .redpacket-item .redpacket-title .price{
		width: 40%;
		overflow: hidden;
	}
	#svip-mine .svip-body .redpacket-list .redpacket-item .redpacket-title .price i{
		font-style: normal;
		font-size: 12px;
		line-height: 17px;
		float: left;
	}
	#svip-mine .svip-body .redpacket-list .redpacket-item .redpacket-title .price span{
		margin-right: 5px;
		font-size: 32px;
		line-height: 30px;
	}
	#svip-mine .svip-body .redpacket-list .redpacket-item .redpacket-title .info{
		width: 60%;
	}
	#svip-mine .svip-body .redpacket-list .redpacket-item .redpacket-but{
		margin-top: 10px;
		width: 128px;
		height: 26px;
		line-height: 18px;
		background: #f2d499;
		padding: 4px 15px;
		font-size: 12px;
		border-radius: 50px;
		font-weight: 800;
		color: rgba(64,33,10,.8);
		background-size: 110% 110%;
		text-align: center;
	}
	#svip-mine .svip-body .vip-privilege{
		width: 325px;
		height: 64px;
	}
	#svip-mine .svip-body .goods-list .goods-item{
		margin-bottom: 15px;
	}
	#svip-mine .svip-body .goods-list .goods-item:last-child{
		margin-bottom: 0px;
	}
	#svip-mine .svip-body .goods-list .goods-img{
		width: 100px;
		height: 100px;
		margin-right: 10px;
		border: none;
	}
	#svip-mine .svip-body .goods-list .goods-img img{
		width: 100%;
		height: 100%;
	}
	#svip-mine .svip-body .goods-list .goods-info{
		display: flex;
		flex: 1;
		justify-content: space-between;
		flex-direction: column;
		height: 100px;
	}
	#svip-mine .svip-body .goods-list .goods-info .goods-discount{
		margin-top: 5px;
		height: 15px;
		line-height: 15px;
		width: 55px;
		background-color: #29211b;
		color: #ffefa6;
		font-size: 12px;
		border-radius: 3px;
		text-align: center;
	}
	#svip-mine .svip-body .goods-list .goods-info  .goods-but{
		padding: 4px 15px;
		font-size: 13px;
		border-radius: 50px;
		font-weight: 800;
		color: rgba(64,33,10,.8);
		background: #f2d499;
		background-size: 110% 110%;
	}
	#svip-mine .svip-body .tequan-item{
		display: flex;
		justify-content: space-between;
		padding: 7.5px;
		background-color: #fff;
	}
	#svip-mine .svip-body .tequan-item li{
		display: -webkit-flex;
		display: flex;
		-webkit-flex-direction: column;
		flex-direction: column;
		-webkit-align-items: center;
		align-items: center;
		-webkit-flex: 1;
		flex: 1;
	}
	#svip-mine .svip-body .tequan-item li img{
		display: block;
		width: 52.9px;
		height: 52.9px;
	}
	#svip-mine .svip-body .tequan-item li span{
		margin-top: 3px;
		color: #999;
		font-size: 12px;
		line-height: 16px;
	}
	#svip-mine .agreement-popup{
		height: 100%;
		width: 100%;
	}
	#svip-mine .agreement-popup .popup-content{
		word-wrap: break-word;
	}
</style>


// WEBPACK FOOTER //
// src/pages/svip/mine.vue