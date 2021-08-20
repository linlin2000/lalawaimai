<template>
	<div id="kanjia-detail">
		<public-header title="商品详情"></public-header>
		<div class="content">
			<transition name="danmu-fade" mode="out-in" v-if="danmu.item && danmu.item.nickname">
				<div class="order-danmu" :class="{'opacity-0': !danmu.show}">
					<div class="flex">
						<img class="thumb" :src="danmu.item.avatar" alt="">
						<span class="info">{{danmu.item.nickname}}  {{danmu.item.time}}购买了此商品</span>
					</div>
				</div>
			</transition>
			<div class="goods-info padding-15-lr padding-15-t bg-default">
				<van-swipe loop class="thumbs" :autoplay="3000" v-if="activity.thumbs && activity.thumbs.length > 0" indicator-color="#ff2d4b">
					<van-swipe-item v-for="(item, index) in activity.thumbs" :key="index">
						<img :src="item" />
					</van-swipe-item>
				</van-swipe>
				<div class="thumb" v-else>
					<img class="img-100" :src="activity.thumb" alt="">
					<div class="end-bg" v-if="activity.status == 3">
						<img src="static/img/end.png" alt="">
					</div>
				</div>
				<div class="title">【邀请好友帮忙砍价】{{activity.name}}</div>
				<div class="flex-lr van-hairline--bottom padding-15-b">
					<div class="flex-lr">
						<div class="flex">
							<div class="c-danger font-16 font-bold">¥{{activity.price}}</div>
							<div class="c-gray font-12 line-through margin-5-l">¥{{activity.oldprice}}</div>
						</div>
					</div>
					<div class="flex" v-if="activity.status == 1">
						<span class="c-gray font-12 margin-5-r">距结束</span>
						<count-down :endTime="activity.endtime"></count-down>
					</div>
				</div>
				<div class="padding-15-tb flex-lr font-12 c-gray">
					<div class="take-info-item">
						<i class="icon icon-browse"></i>
						<span>{{activity.total_looknum}}人浏览</span>
					</div>
					<div class="take-info-item text-center van-hairline--left van-hairline--right">
						<i class="icon icon-share"></i>
						<span>{{activity.total_sharenum}}人分享</span>
					</div>
					<div class="take-info-item text-right">
						<i class="icon icon-friend font-15"></i>
						<span>{{activity.total_joinnum}}人参与</span>
					</div>
				</div>
			</div>
			<div class="margin-10-t bg-default" v-if="take_status == 1">
				<div class="progress">
					<span class="max-price margin-5-r font-13 padding-15-l">¥{{activity.oldprice}}</span>
					<div class="progress-inner">
						<div class="now-price" :style="{left: member_takeinfo.per_price + '%'}">现价¥{{member_takeinfo.price}}</div>
						<div class="bar">
							<div class="bar-inner" :style="{width: member_takeinfo.per_price + '%'}"></div>
						</div>
					</div>
					<span class="min-price c-danger margin-5-l font-13 padding-15-r">¥{{activity.price}}</span>
				</div>
				<div class="flex-lr font-12 padding-15-lr padding-15-b padding-10-t">
					<p>目前{{member_takeinfo.helper.length}}位好友帮忙砍价，已砍掉¥{{member_takeinfo.has_bargain}}，还需砍¥{{member_takeinfo.still_bargain}}</p>
					<div class="flex c-gray" v-if="member_takeinfo.helper.length > 0" @click="onToggleHelpStatus">
						查看详情 <i class="icon icon-unfold"></i>
					</div>
				</div>
				<div class="helper-list padding-15-lr padding-10-tb van-hairline--top" v-if="member_takeinfo.helper.length > 0 && helpStatus">
					<div class="helper-item flex-lr" :class="{'margin-10-t': index > 0}" v-for="(item, index) in member_takeinfo.helper" :key="index">
						<div class="flex">
							<div class="avatar">
								<img class="img-100" :src="item.avatar" alt="">
							</div>
							<div class="margin-10-l">
								<div class="font-14 ">{{item.nickname}}</div>
								<div class="font-12 c-gray margin-5-t">{{item.createtime_cn}}</div>
							</div>
						</div>
						<div class="flex">
							<div class="icon-axe margin-5-r"></div>
							<div class="c-gray font-14 margin-5-l">帮您砍掉¥{{item.bargainprice}}</div>
						</div>
					</div>
				</div>
			</div>
			<div class="margin-10-t padding-15-l bg-default">
				<div class="flex-lr padding-15-tb padding-15-r font-14 van-hairline--bottom">
					<div class="font-14">适用门店</div>
				</div>
				<div class="padding-15-tb padding-15-r flex-lr">
					<div class="font-14 store-info">
						<div class="margin-10-b w-100 ellipsis">{{store.title}}</div>
						<div class="flex c-gray w-100" @click="util.jsLocation({lat: store.location_x, lng: store.location_y});">
							<i class="icon icon-location margin-5-r font-15"></i>
							<p class="ellipsis">{{store.address}}</p>
						</div>
					</div>
					<i class="icon icon-telephone icon-telephone-circle"  @click="util.jsUrl('tel:' + store.telephone)"></i>
				</div>
			</div>
			<div class="margin-10-t padding-15-l bg-default">
				<div class="flex-lr padding-15-tb padding-15-r font-14 van-hairline--bottom">
					<div class="font-14">活动规则</div>
				</div>
				<div class="padding-15-tb padding-15-r richtext" v-html="activity.activity_rules"></div>
			</div>
			<div class="margin-10-t padding-15-l bg-default">
				<div class="flex-lr padding-15-tb padding-15-r font-14 van-hairline--bottom">
					<div class="font-14">商品详情</div>
				</div>
				<div class="padding-15-tb padding-15-r richtext" v-html="activity.detail"></div>
			</div>
			<comment
				:comment = "comment.data"
			    @onLoadingComment = "onComment"
			>
			</comment>
			<ul class="right-btn">
				<router-link tag="li" class="btn-item" :to="util.getUrl({path: '/gohome/pages/poster/index', query: {goods_id: id, type: 'kanjia'}})">
					<span>生成</span><span>海报</span>
				</router-link>
				<li class="btn-item" @click="onComplain" v-if="util.isWeixin()">投诉</li>
			</ul>
		</div>
		<van-goods-action>
			<van-goods-action-mini-btn icon="shop" text="店铺" @click="util.jsUrl('gohome/pages/haodian/detail?sid=' + store.id)" />
			<van-goods-action-mini-btn :class="{favorite: activity.is_favor}" :icon="activity.is_favor ? 'favor_fill_light' : 'favor1'" :text="activity.is_favor ? '已收藏' : '收藏'" @click="onFavor()" />
			<van-goods-action-mini-btn icon="share" text="分享" @click="zhezhaoShow = !zhezhaoShow"/>
			<template v-if="activity.status == 1">
				<template v-if="activity.total != 0">
					<template v-if="take_status == 0">
						<van-goods-action-big-btn class="btn-share" text="立即参与" primary @click="onParticipate" />
					</template>
					<template v-else-if="take_status == 1">
						<van-goods-action-big-btn @click="util.jsUrl('/gohome/pages/kanjia/order/create?activityid=' + activity.id)" class="btn-buy" text="现价购买" v-if="member_takeinfo.now_price_buy == 1" />
						<van-goods-action-big-btn @click="util.jsUrl('/gohome/pages/kanjia/order/create?activityid=' + activity.id)" class="btn-share" text="立即下单" primary v-if="member_takeinfo.price == activity.price" />
						<van-goods-action-big-btn @click="util.jsUrl('/gohome/pages/kanjia/share?activityid=' + activity.id + '&uid=' + member_takeinfo.uid)" class="btn-share" text="找人帮砍" primary v-else />
					</template>
				</template>
				<template v-else>
					<van-goods-action-big-btn class="van-button--disabled" text="商品已抢光" primary />
				</template>
			</template>
			<template v-else-if="activity.status == 2">
				<van-goods-action-big-btn class="van-button--disabled" text="活动未开始" primary />
			</template>
			<template v-else-if="activity.status == 3">
				<van-goods-action-big-btn class="van-button--disabled" text="活动已结束" primary />
			</template>
		</van-goods-action>
		<transition name="van-fade">
			<div class="share-zhezhao" @click="zhezhaoShow = !zhezhaoShow" v-if="zhezhaoShow">
				<img src="static/img/share-layer.png" alt="">
			</div>
		</transition>
		<van-popup v-model="bargain_success" class="popup-success">
			<div class="popup-content">
				<div class="img-wrap">
					<img class="w-100" src="static/img/bargain_success.png" alt="">
				</div>
				<p class="success-tip" style="color: #F1C90A;">恭喜您砍价成功</p>
				<ul class="font-14 margin-15-tb line-12">
					<li>亲友们合力帮您砍到最低价</li>
					<li>立即购买吧~</li>
				</ul>
				<div class="success-btn" @click="util.jsUrl('/gohome/pages/kanjia/order/create?activityid=' + activity.id)">立即购买</div>
			</div>
			<div class="icon icon-close" @click="bargain_success = !bargain_success"></div>
		</van-popup>
		<failed-tips v-if="black_member.status" :failedTips="failedTips"></failed-tips>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import CountDown from '@/components/countDown'
	import {getData, setData} from "@/controller/funcCommon"
	import Comment from '@/components/comment'
	import {onToggleFavor, onShowDanmu, onGetComment} from "../controller/gohome.js"
	export default {
		components: {
			PublicHeader,
			CountDown,
			Comment
		},
		data() {
			return {
				id: 0,
				activity: {
					status: 0,
					is_favor: false,
					thumbs: []
				},
				comment: {
					page: 2,
					psize: 8,
					data: []
				},
				store: {},
				take_status: 0,
				member_takeinfo: {
					helper: []
				},
				showPreLoading: true,
				helpStatus: false,
				zhezhaoShow: false,
				danmus: [],
				danmu: {
					index: 0,
					item: {},
					show: false
				},
				bargain_success: false,
				black_member: {
					status: false
				},
				failedTips: {
					type: 'message',
					tips: '',
					btnText: '关闭',
					link: '/pages/home/index'
				},
			}
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'kanjia/activity/detail',
					data: {
						id: that.id,
						page: 1,
						psize: that.comment.psize
					},
					autoAssign: true,
					variable: 'activity',
					success: (res) => {
						that.store = Object.assign(that.store, res.store);
						that.take_status = res.take_status;
						that.member_takeinfo = Object.assign(that.member_takeinfo, res.member_takeinfo);
						if(that.activity.status == 1 && that.activity.total != 0 && that.member_takeinfo.price == that.activity.price) {
							that.bargain_success = true;
						}
						that.comment.data = res.comment;
						that.danmus = res.danmu;
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
						setTimeout(function() {
							if(that.danmus) {
								that.onToggleDanmu();
								setInterval(function() {
									that.onToggleDanmu();
								}, 5000);
							}
						}, 5000);
					},
					fail: function(res) {
						if(res.errno == -1000) {
							var black_member = res.message.black_member;
							that.black_member = black_member;
							that.failedTips.tips = black_member.tip;
							return;
						}
					}
				})
			},
			onToggleHelpStatus() {
				if(!this.member_takeinfo.helper.length) {
					return;
				}
				this.helpStatus = !this.helpStatus;
			},
			onParticipate() {
				var that = this;
				if(that.take_status == 1) {
					return;
				}
				setData({
					vue: that,
					url: 'kanjia/activity/create',
					data: {
						activityid: that.id,
					},
					success: (res) => {
						let uid = res;
						that.util.$toast('参与成功', that.util.getUrl({path: '/gohome/pages/kanjia/share', query: {activityid: that.activity.id, uid: uid}}), 1000)
					}
				});
			},
			onFavor() {
				onToggleFavor({
					vue: this,
					goods_id: this.activity.id,
					type: 'kanjia',
					target: 'activity'
				})
			},
			onToggleDanmu() {
				onShowDanmu({
					vue: this
				})
			},
			onComment() {
				onGetComment({
					vue: this,
					type: 'kanjia',
					id: this.id
				})
			},
			onComplain() {
				this.util.setStorage('complainUrl', window.location.href);
				this.$router.push(this.util.getUrl({path: '/gohome/pages/complain/index'}));
			},
		},
		mounted() {
			if(this.$route.query && this.$route.query.id > 0) {
				this.id = this.$route.query.id;
			}
			this.onLoad();
		}
	}
</script>

<style>
	#kanjia-detail .popup-success{
		width: 70%;
		background-color: transparent;
		text-align: center;
		overflow-y: inherit;
	}
	#kanjia-detail .popup-success .popup-content{
		background-color: #fff;
		width: 100%;
		text-align: center;
		border-radius: 5px;
		padding-bottom: 20px;
		padding-top: 50px;
		position: relative;
	}
	#kanjia-detail .popup-success .success-tip{
		color: #F1C90A;
	}
	#kanjia-detail .popup-success .popup-content .img-wrap{
		position: absolute;
		z-index: 1;
		width: 210px;
		height: 90px;
		left: 50%;
		top: 0px;
		transform: translate3d(-50%, -50%, 0);
		font-size: 0px;
	}
	#kanjia-detail .popup-success .success-btn{
		width: 70%;
		margin: 0 auto;
		border-radius: 5px;
		background-color: #ff2d4b;
		color: #fff;
		padding: 10px 0;
		font-size: 14px;
	}
	#kanjia-detail .popup-success .icon-close{
		font-size: 16px;
		color: #fff;
		width: 28px;
		height: 28px;
		border-radius: 50%;
		border: 1px solid #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		margin: 15px auto 0;
	}
	#kanjia-detail .content{
		bottom: 50px;
	}
	#kanjia-detail .van-goods-action .van-icon{
		font-size: 18px;
	}
	#kanjia-detail .van-goods-action .van-goods-action-mini-btn.favorite{
		color: #ff2d4b;
	}
	#kanjia-detail .van-goods-action .btn-buy{
		background: -webkit-linear-gradient(left, #FFBC2D, #FF9B2C);
		background: -o-linear-gradient(right, #FFBC2D, #FF9B2C);
		background: -moz-linear-gradient(right, #FFBC2D, #FF9B2C);
		background: linear-gradient(to right, #FFBC2D , #FF9B2C);
	}
	#kanjia-detail .van-goods-action .btn-share{
		background: -webkit-linear-gradient(left, #FD6131, #FE0000);
		background: -o-linear-gradient(right, #FD6131, #FE0000);
		background: -moz-linear-gradient(right, #FD6131, #FE0000);
		background: linear-gradient(to right, #FD6131 , #FE0000);
	}

	#kanjia-detail .goods-info .thumb{
		width: 100%;
		max-height: 162px;
		font-size: 0px;
		border-radius: 3px;
		overflow: hidden;
		position: relative;
	}
	#kanjia-detail .goods-info  .thumbs img{
		width: 100%;
		max-height: 162px;
	}
	#kanjia-detail .goods-info .thumb .end-bg{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#kanjia-detail .goods-info .thumb .end-bg img{
		width: 150px;
	}
	#kanjia-detail .goods-info .title{
		font-size: 14px;
		padding: 8px 0;
		line-height: 1.3;
		font-weight: 500;
	}
	#kanjia-detail .goods-info .btn{
		color: #fff;
		font-size: 14px;
		padding: 8px 10px;
		border-radius: 3px;
	}
	#kanjia-detail .goods-info .btn.btn-detail{
		background: -webkit-linear-gradient(left, #FC6030, #FF0101);
		background: -o-linear-gradient(right, #FC6030, #FF0101);
		background: -moz-linear-gradient(right, #FC6030, #FF0101);
		background: linear-gradient(to right, #FC6030 , #FF0101);
	}
	#kanjia-detail .goods-info .btn.btn-end{
		background-color: #959595;
	}
	#kanjia-detail .goods-info .avatar-list{
		margin-left: 20px;
	}
	#kanjia-detail .goods-info .avatar-list img{
		width: 18px;
		height: 18px;
		border-radius: 50%;
		margin-left: -10px;
	}
	#kanjia-detail .goods-info .avatar-list img:first-child{
		margin-left: 0;
	}
	#kanjia-detail .goods-info .timer span{
		background-color: #ff2d4b;
		color: #fff;
		font-size: 12px;
		padding: 3px 3px;
		border-radius: 3px;
		margin: 0 3px;
	}
	#kanjia-detail .goods-info .take-info-item{
		width: 33.3333%;
	}
	#kanjia-detail .progress{
		display: flex;
		flex-flow: row nowrap;
		align-items: flex-end;
		justify-content: space-between;
		font-size: 14px;
		padding-top: 15px;
	}
	#kanjia-detail .progress .progress-inner{
		width: 70%;
		height: 43px;
		position: relative;
		flex:1;
	}
	#kanjia-detail .progress .progress-inner .bar{
		position: absolute;
		bottom: 1px;
		left: 0;
		right: 0;
		height: 10px;
		background-color: #FED4D5;
		border-radius: 20px;
		overflow: hidden;
	}
	#kanjia-detail .progress .progress-inner .bar .bar-inner{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		background: -webkit-linear-gradient(left, #FD6131, #FE0000);
		background: -o-linear-gradient(right, #FD6131, #FE0000);
		background: -moz-linear-gradient(right, #FD6131, #FE0000);
		background: linear-gradient(to right, #FD6131 , #FE0000);
	}
	#kanjia-detail .progress .progress-inner .now-price{
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
	#kanjia-detail .progress .progress-inner .now-price:before{
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
	#kanjia-detail .helper-list .helper-item .avatar{
		width: 40px;
		height: 40px;
		border-radius: 50%;
		overflow: hidden;
	}
	#kanjia-detail .store-info{
		width: 85%;
	}
	#kanjia-detail .richtext{
		width: 100%;
		overflow-x: hidden;
	}
	#kanjia-detail .richtext img{
		max-width: 100%;
	}
	/*弹幕样式*/
	#kanjia-detail .content .order-danmu{
		height: 34px;
		width: 250px;
		border-radius: 34px;
		position: fixed;
		top: 120px;
		left: 10px;
		z-index: 1000;
		padding: 2px;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
		color: #fff;
		overflow: hidden;
		background: #26ce61;
		display: flex;
		box-sizing: border-box;
		transition: opacity .5s;
	}
	#kanjia-detail .content .order-danmu img{
		border-radius: 100%;
		height: 30px;
		width: 30px;
		margin-right: 5px;
	}
	#kanjia-detail .content .order-danmu span{
		display: inline-block;
		font-size: 14px;
	}
	#kanjia-detail .content .order-danmu .info{
		width: 180px;
		white-space:nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-right: 5px;
	}
	#kanjia-detail .content .order-danmu.opacity-0{
		opacity: 0!important;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/kanjia/detail.vue