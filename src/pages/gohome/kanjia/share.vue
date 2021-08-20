<template>
	<div id="kanjia-share">
		<div class="content">
			<div class="top-logo">
				<img class="w-100" src="static/img/kanjia_share_top.jpg" alt="">
			</div>
			<div class="bottom">
				<div class="flex padding-15-l c-white margin-10-b" v-if="activity.status == 1">
					<span class="font-12 margin-5-r">距结束</span>
					<count-down :endTime="activity.endtime"></count-down>
				</div>
				<div class="margin-15-lr margin-15-b padding-15 bg-default radius-3">
					<div class="flex-lr">
						<div class="avatar">
							<img class="img-100" :src="takeinfo.avatar" alt="">
						</div>
						<div class="user-info">
							<div class="font-12 margin-5-b">{{takeinfo.nickname}}</div>
							<div class="font-500">我正在{{activity.price}}元抢这件商品，快来帮帮我吧!</div>
						</div>
					</div>
					<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/kanjia/detail', query: {id: activityid}})" class="bg-gray padding-15 radius-3 margin-15-t flex-lr">
						<div class="goods-thumb">
							<img class="img-100" :src="activity.thumb" alt="">
						</div>
						<div class="goods-info">
							<ul class="">
								<li class="font-500" v-if="activity.store">{{activity.store.title}}</li>
								<li class="margin-5-t">{{activity.name}}</li>
							</ul>
							<div class="flex">
								<div class="c-danger font-15 font-500 margin-5-r">¥{{activity.price}}</div>
								<div class="c-gray font-13 line-through">¥{{activity.oldprice}}</div>
							</div>
						</div>
					</router-link>
					<template v-if="takeinfo.status == 1">
						<div class="progress margin-15-t">
							<div class="progress-inner">
								<div class="now-price" :style="{left: takeinfo.per_price + '%'}">现价¥{{takeinfo.price}}</div>
								<div class="bar">
									<div class="bar-inner" :style="{width: takeinfo.per_price + '%'}"></div>
								</div>
							</div>
							<div class="flex-lr font-14 margin-5-t">
								<div>¥{{activity.oldprice}}</div>
								<div class="c-danger">¥{{activity.price}}</div>
							</div>
						</div>
					</template>
					<template v-else-if="takeinfo.status == 2">
						<div class="kanjia-success">
							<img src="static/img/kanjia_success.png" alt="">
						</div>
					</template>
					<div class="btn-group margin-15-t flex-center" v-if="self == 1">
						<div class="btn-item he margin-10-lr" @click="zhezhaoShow = !zhezhaoShow">找人帮砍</div>
						<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/kanjia/order/create', query: {activityid: activityid}})" class="btn-item he margin-10-lr" v-if="takeinfo.now_price_buy == 1">当前价格购买</router-link>
						<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/kanjia/order/create', query: {activityid: activityid}})" class="btn-item he margin-10-lr" v-else-if="takeinfo.price == activity.price">立即下单</router-link>
					</div>
					<div class="btn-group margin-15-t flex-lr" v-else-if="self == 0">
						<div class="btn-item he" v-if="takeinfo.status == 1" @click="onBargain">帮TA砍价</div>
						<div class="btn-item he" v-if="takeinfo.status == 1" @click="zhezhaoShow = !zhezhaoShow">帮TA分享</div>
						<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/kanjia/detail', query: {id: activityid}})" class="btn-item me" >我也要抢</router-link>
					</div>
				</div>
				<div class="margin-15 bg-default rank">
					<ul class="flex-lr rank-title">
						<li :class="{active: rankType == 'helper'}" @click="onToggleRank('helper')">帮砍团</li>
						<li :class="{active: rankType == 'rank'}" @click="onToggleRank('rank')">排行榜</li>
					</ul>
					<div class="padding-15-lr padding-15-b" v-if="rankType == 'helper'">
						<template v-if="takeinfo.helper && takeinfo.helper.length > 0">
							<div class="rank-item margin-15-t flex-lr" v-for="(item, index) in takeinfo.helper" :key="index">
								<div class="avatar">
									<img class="img-100" :src="item.avatar" alt="">
								</div>
								<div class="user-info flex-lr padding-10-f">
									<ul>
										<li class="margin-5-b">{{item.nickname}}</li>
										<li class="font-12 c-gray">{{item.createtime_cn}}</li>
									</ul>
									<div class="flex">
										<div class="icon-axe margin-5-r"></div>
										<div class="c-danger">砍掉 ¥{{item.bargainprice}}</div>
									</div>
								</div>
							</div>
						</template>
						<template v-else>
							<div class="margin-15-t text-center font-14 c-gray">
								暂时没有人帮忙砍价哦~
							</div>
						</template>
					</div>
					<div class="padding-15-lr padding-15-b" v-else-if="rankType == 'rank'">
						<template v-if="rank.length > 0">
							<div class="rank-item margin-15-t flex-lr" v-for="(item, index) in rank" :key="index">
								<div class="avatar">
									<img class="img-100" :src="item.avatar" alt="">
								</div>
								<div class="user-info flex-lr padding-10-f">
									<ul>
										<li class="margin-5-b">{{item.nickname}}</li>
										<li class="font-12 c-gray">{{item.createtime_cn}}</li>
									</ul>
									<div class="flex">
										<div class="icon-axe margin-5-r"></div>
										<div class="c-danger">砍掉 ¥{{item.bargainprice}}</div>
									</div>
								</div>
							</div>
						</template>
						<div class="margin-15-t text-center font-14 c-gray" v-else>
							没有人登榜哦~
						</div>
					</div>
				</div>
				<template v-if="more.length > 0">
					<div class="margin-15-t c-white text-center font-14">更多活动</div>
					<div class="activity-list">
						<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/kanjia/detail', query: {id: item.id}})" class="activity-item" v-for="(item, index) in more" :key="item.id">
							<div class="item-inner">
								<div class="thumb">
									<img class="img-100" :src="item.thumb" alt="">
								</div>
								<div class="goods-title">{{item.name}}</div>
								<div class="flex-lr">
									<div class="flex">
										<span class="c-danger font-500 font-15 margin-5-r">¥{{item.price}}</span>
										<div class="c-gray line-through font-12">¥{{item.oldprice}}</div>
									</div>
									<div class="c-gray font-12">已售{{item.sailed}}份</div>
								</div>
							</div>
						</router-link>
					</div>
				</template>
			</div>
		</div>
		<van-popup v-model="bargainSuccessPopup" class="popup-remind">
			<div class="remind-tip">
				<p>恭喜! 你成功帮</p>
				<p class="c-danger w-100 ellipsis">{{takeinfo.nickname}}</p>
				<p>砍掉了</p>
				<div class="c-danger">
					<span class="font-20">¥</span>
					<span class="cut-price">{{bargainprice}}</span>
				</div>
			</div>
			<div class="remind-close" @click="onTogglePopup">我知道了</div>
		</van-popup>
		<transition name="van-fade">
			<div class="share-zhezhao" @click="zhezhaoShow = !zhezhaoShow" v-if="zhezhaoShow">
				<img src="static/img/share-layer.png" alt="">
			</div>
		</transition>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import CountDown from '@/components/countDown'
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
			CountDown
		},
		data() {
			return {
				activityid: 0,
				uid: 0,
				activity: {},
				takeinfo: {
					helper: []
				},
				rank: [],
				self: 1,
				more: [],
				rankType: 'helper',
				bargainSuccessPopup: false,
				bargainprice: 0,
				showPreLoading: true,
				zhezhaoShow: false,
			}
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'kanjia/activity/share',
					data: {
						activityid: that.activityid,
						uid: that.uid,
						page: 1,
						psize: 6,
					},
					success: (res) => {
						that.activity = Object.assign(that.activity, res.activity);
						that.takeinfo = Object.assign(that.takeinfo, res.takeinfo);
						that.rank = [...res.rank];
						that.self = res.self;
						that.more = [...res.more];
						var shareData = window._share;
						if(shareData) {
							shareData.success = function() {
								that.util.request({
									url: 'gohome/common/share',
									data: {id: that.id, type: 'kanjia'}
								}).then((res) => {})
							}
						}
						that.wx.share(shareData);
					}
				})
			},
			onToggleRank(type) {
				if(type == this.rankType) {
					return;
				}
				this.rankType = type;
			},
			onTogglePopup() {
				this.bargainSuccessPopup = !this.bargainSuccessPopup;
			},
			onBargain() {
				var that = this;
				setData({
					vue: that,
					url: 'kanjia/activity/bargain',
					data: {
						activityid: that.activityid,
						uid: that.uid,
					},
					success: (res) => {
						let record = res;
						that.bargainprice = record.bargainprice;
						that.takeinfo.price = record.afterprice;
						that.takeinfo.per_price = (that.activity.oldprice - that.takeinfo.price) / (that.activity.oldprice - that.activity.price) * 100;
						that.takeinfo.helper.push(record);
						that.onTogglePopup();
					}
				})
			}
		},
		mounted() {
			if(this.$route.query && this.$route.query.activityid) {
				this.activityid = this.$route.query.activityid;
			}
			if(this.$route.query && this.$route.query.uid) {
				this.uid = this.$route.query.uid;
			}
			this.onLoad();
		}
	}
</script>

<style>
	#kanjia-share .popup-remind{
		width: 220px;
		height: 290px;
		background: url('../../../../static/img/kanjia_share_remind.png') no-repeat;
		background-size: 100% 100%;
	}
	#kanjia-share .remind-tip{
		width: 80%;
		margin: 60px auto 0;
		font-size: 13px;
		text-align: center;
		line-height: 1.4;
	}
	#kanjia-share .remind-tip .cut-price{
		font-size: 32px;
		font-weight: 500;
	}
	#kanjia-share .popup-remind .remind-close{
		display: inline-block;
		position: absolute;
		bottom: 10px;
		left: 50%;
		transform: translateX(-50%);
		padding: 8px 20px;
		border-radius: 100px;
		color: #fff;
		background: #D7C789;
		font-size: 14px;
	}
	#kanjia-share .top-logo{
		font-size: 0px;
	}
	#kanjia-share .content .bottom{
		background: url('../../../../static/img/kanjia_share_bottom.jpg') no-repeat;
		background-size: 100% 100%;
		padding-top: 15px;
	}
	#kanjia-share .timer span{
		background-color: #000;
		color: #fff;
		font-size: 12px;
		padding: 3px 3px;
		border-radius: 3px;
		margin: 0 3px;
	}
	#kanjia-share .avatar{
		width: 40px;
		height: 40px;
		border-radius: 50%;
		overflow: hidden;
		font-size: 0px;
	}
	#kanjia-share .user-info{
		flex: 1;
		padding-left: 10px;
		font-size: 14px;
	}
	#kanjia-share .goods-thumb{
		width: 80px;
		height: 80px;
		font-size: 0px;
		border-radius: 3px;
		overflow: hidden;
	}
	#kanjia-share .goods-info{
		flex: 1;
		padding-left: 10px;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
		height: 80px;
		font-size: 14px;
	}
	#kanjia-share .progress{
		margin: 0 15px;
	}
	#kanjia-share .progress .progress-inner{
		width: 100%;
		height: 43px;
		position: relative;
	}
	#kanjia-share .progress .progress-inner .bar{
		position: absolute;
		bottom: 1px;
		left: 0;
		right: 0;
		height: 10px;
		background-color: #FED4D5;
		border-radius: 20px;
		overflow: hidden;
	}
	#kanjia-share .progress .progress-inner .bar .bar-inner{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		background: -webkit-linear-gradient(left, #FD6131, #FE0000);
		background: -o-linear-gradient(right, #FD6131, #FE0000);
		background: -moz-linear-gradient(right, #FD6131, #FE0000);
		background: linear-gradient(to right, #FD6131 , #FE0000);
	}
	#kanjia-share .progress .progress-inner .now-price{
		position: absolute;
		bottom: 19px;
		background-color: #ff2d4b;
		border-radius: 3px;
		color: #fff;
		font-size: 12px;
		padding: 5px 10px;
		transform: translateX(-50%);
		min-width: 83px;
		text-align: center;
	}
	#kanjia-share .progress .progress-inner .now-price:before{
		content: "";
		display: block;
		border-width: 5px;
		position: absolute;
		bottom: -10px;
		left: 50%;
		transform: translateX(-50%);
		border-style: solid dashed dashed;
		border-color: #ff2d4b transparent transparent;
		font-size: 0;
		line-height: 0;
		z-index: 10;
	}
	#kanjia-share .kanjia-success img{
		width: 50%;
		display: block;
		margin: 15px auto 0;
	}
	#kanjia-share .btn-group .btn-item{
		font-size: 14px;
		padding: 8px 10px;
		border-radius: 5px;
		color: #fff;
	}
	#kanjia-share .btn-group .btn-item.he{
		background: -webkit-linear-gradient(left, #FD6131, #FE0000);
		background: -o-linear-gradient(right, #FD6131, #FE0000);
		background: -moz-linear-gradient(right, #FD6131, #FE0000);
		background: linear-gradient(to right, #FD6131 , #FE0000);
	}
	#kanjia-share .btn-group .btn-item.me{
		background: -webkit-linear-gradient(left, #FFBC2D, #FF9B2C);
		background: -o-linear-gradient(right, #FFBC2D, #FF9B2C);
		background: -moz-linear-gradient(right, #FFBC2D, #FF9B2C);
		background: linear-gradient(to right, #FFBC2D , #FF9B2C);
	}
	#kanjia-share .rank{
		border-radius: 3px;
		overflow: hidden;
	}
	#kanjia-share .rank-title li{
		width: 50%;
		padding: 15px 0;
		text-align: center;
		font-size: 14px;
		background-color: #f5f5f5;
	}
	#kanjia-share .rank-title li.active{
		color: #B3010D;
	}
	#kanjia-share .activity-list{
		padding: 7.5px;
		display: flex;
		flex-flow: row wrap;
		align-items: center;
	}
	#kanjia-share .activity-list .activity-item{
		width: 50%;
		padding: 7.5px;
	}
	#kanjia-share .activity-list .activity-item .item-inner{
		padding: 10px;
		background-color: #fff;
		border-radius: 3px;
	}
	#kanjia-share .activity-item .thumb{
		width: 100%;
		height: 150px;
		font-size: 0px;
		border-radius: 3px;
		overflow: hidden;
		position: relative;
	}
	#kanjia-share .activity-item .goods-title{
		font-size: 14px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		line-height: 1.2;
		margin: 8px 0;
		height: 33px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/kanjia/share.vue