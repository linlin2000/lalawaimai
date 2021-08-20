<template>
	<div id="seckill-detail">
		<public-header title="商品详情"></public-header>
		<div class="content" ref="content">
			<transition name="danmu-fade" mode="out-in" v-if="danmu.item && danmu.item.nickname">
				<div class="order-danmu" :class="{'opacity-0': !danmu.show}">
					<div class="flex">
						<img class="thumb" :src="danmu.item.avatar" alt="">
						<span class="info">{{danmu.item.nickname}} {{danmu.item.time}}购买了此商品</span>
					</div>
				</div>
			</transition>
			<div class="goods-info padding-15-lr padding-15-t bg-default">
				<van-swipe loop class="thumbs" :autoplay="3000" v-if="goods.thumbs && goods.thumbs.length > 0" indicator-color="#ff2d4b">
					<van-swipe-item v-for="(item, index) in goods.thumbs" :key="index">
						<img :src="item" />
					</van-swipe-item>
				</van-swipe>
				<div class="thumb" v-else>
					<img class="img-100" :src="goods.thumb" alt="">
					<div class="end-bg" v-if="goods.status == 3">
						<img src="static/img/end.png" alt="">
					</div>
				</div>
				<ul class="right-btn">
					<router-link tag="li" class="btn-item" :to="util.getUrl({path: '/gohome/pages/poster/index', query: {goods_id: id, type: 'seckill'}})">
						<span>生成</span><span>海报</span>
					</router-link>
				</ul>
				<div class="title">【限时抢购】{{goods.store.title}} {{goods.name}}</div>
				<div class="flex-lr van-hairline--bottom padding-15-b">
					<div class="flex-lr">
						<div class="flex">
							<div class="c-danger font-16 font-bold">¥{{goods.price}}</div>
							<div class="c-gray font-12 line-through margin-5-l">¥{{goods.oldprice}}</div>
						</div>
					</div>
					<span class="c-gray font-12">已售{{goods.sailed}}份</span>
					<div class="flex" v-if="goods.status == 1 && goods.total != 0">
						<span class="font-12 c-gray margin-5-r">距结束</span>
						<count-down :endTime="goods.endtime" v-if="goods.endtime"></count-down>
					</div>
				</div>
				<div class="padding-15-tb flex-lr font-12 c-gray">
					<div class="take-info-item">
						<i class="icon icon-browse"></i>
						<span>{{goods.total_looknum}}人浏览</span>
					</div>
					<div class="take-info-item text-center van-hairline--left van-hairline--right">
						<i class="icon icon-share"></i>
						<span>{{goods.total_sharenum}}人分享</span>
					</div>
					<div class="take-info-item text-right">
						<i class="icon icon-friend font-15"></i>
						<span>{{goods.sailed}}人参与</span>
					</div>
				</div>
			</div>
			<div class="margin-10-t padding-15-l bg-default">
				<div class="flex-lr padding-15-tb padding-15-r font-14 van-hairline--bottom">
					<div class="font-14">抢购流程</div>
				</div>
				<div class="padding-15-tb padding-15-r flex-lr">
					<div class="step flex">
						<span class="step-number">1</span>
						<ul class="c-gray font-12">
							<li class="margin-5-b">选择商品</li>
							<li>点击立即购买</li>
						</ul>
					</div>
					<div class="step flex">
						<span class="step-number">2</span>
						<ul class="c-gray font-12">
							<li class="margin-5-b">付款完成</li>
							<li>在订单页选择使用</li>
						</ul>
					</div>
					<div class="step flex">
						<span class="step-number">3</span>
						<ul class="c-gray font-12">
							<li class="margin-5-b">出示核销码</li>
							<li>请工作人员验证</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="margin-10-t padding-15-l bg-default">
				<div class="flex-lr padding-15-tb padding-15-r font-14 van-hairline--bottom">
					<div class="font-14">适用门店</div>
					<van-icon name="arrow" class="c-gray" v-if="0"></van-icon>
				</div>
				<div class="padding-15-tb padding-15-r flex-lr">
					<div class="font-14 store-info">
						<div class="margin-10-b w-100 ellipsis">{{goods.store.title}}</div>
						<div class="flex c-gray w-100" @click="util.jsLocation({lat: goods.store.location_x, lng: goods.store.location_y});">
							<i class="icon icon-location margin-5-r font-15"></i>
							<p class="ellipsis">{{goods.store.address}}</p>
						</div>
					</div>
					<i class="icon icon-telephone icon-telephone-circle" @click="util.jsUrl('tel:' + goods.store.telephone)"></i>
				</div>
			</div>
			<div class="margin-10-t padding-15-l bg-default">
				<div class="flex-lr padding-15-tb padding-15-r font-14 van-hairline--bottom">
					<div class="font-14">商品详情</div>
				</div>
				<div class="padding-15-tb padding-15-r richtext" v-html="goods.description"></div>
			</div>
			<div class="margin-10-t padding-15-l bg-default">
				<div class="flex-lr padding-15-tb padding-15-r font-14 van-hairline--bottom">
					<div class="font-14">购买须知</div>
				</div>
				<div class="padding-15-tb padding-15-r richtext" v-html="goods.buy_note"></div>
			</div>
			<comment
				:comment = "comment.data"
			    @onLoadingComment = "onComment"
			>
			</comment>
			<div class="margin-10-t bg-default" v-if="recommend.length > 0">
				<div class="padding-15-l">
					<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/seckill/index'})" class="flex-lr padding-15-tb padding-15-r font-14 van-hairline--bottom">
						<div class="font-14">更多优惠商品</div>
						<van-icon name="arrow" class="c-gray"></van-icon>
					</router-link>
				</div>
				<div class="activity-list">
					<div class="activity-item" v-for="(item, index) in recommend" :key="index">
						<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/seckill/detail', query: {id: item.id}})" class="item-inner" >
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
						</router-link>
					</div>
				</div>
			</div>
		</div>
		<van-goods-action>
			<van-goods-action-mini-btn icon="shop" text="店铺" @click="util.jsUrl('gohome/pages/haodian/detail?sid=' + goods.store.id)" />
			<van-goods-action-mini-btn :class="{favorite: goods.is_favor}" :icon="goods.is_favor ? 'favor_fill_light' : 'favor1'" :text="goods.is_favor ? '已收藏' : '收藏'" @click="onFavor" />
			<van-goods-action-mini-btn icon="share" text="分享" @click="zhezhaoShow = !zhezhaoShow"/>
			<template v-if="goods.status == 1">
				<van-goods-action-big-btn class="btn-buy" text="立即抢购" v-if="goods.total != 0" @click="util.jsUrl('/gohome/pages/seckill/order/create?goods_id=' + goods.id)" />
				<van-goods-action-big-btn class="van-button--disabled" text="已抢光" v-else />
			</template>
			<template v-if="goods.status == 2">
				<van-goods-action-big-btn class="van-button--disabled" text="活动未开始" />
			</template>
			<template v-if="goods.status == 3">
				<van-goods-action-big-btn class="van-button--disabled" text="活动已结束"/>
			</template>
		</van-goods-action>
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
	import Comment from '@/components/comment'
	import CountDown from '@/components/countDown'
	import {getData, setData} from "@/controller/funcCommon"
	import {onToggleFavor, onShowDanmu, onGetComment} from "../controller/gohome.js"
	export default {
		components: {
			PublicHeader,
			Comment,
			CountDown
		},
		data() {
			return {
				id: 0,
				goods: {
					name: '',
					thumb: '',
					endtime: 0,
					store: {},
					is_favor: false,
					buy_note: '',
					description: '',
					total_looknum: 0,
					total_sharenum: 0,
					thumbs: []
				},
				recommend: [],
				showPreLoading: true,
				zhezhaoShow: false,
				danmus: [],
				danmu: {
					index: 0,
					item: {},
					show: false
				},
				comment: {
					page: 2,
					psize: 8,
					data: []
				},
			}
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'seckill/goods/detail',
					data: {
						id: that.id,
					},
					autoAssign: true,
					variable: 'goods',
					success: (res) => {
						let recommend = res.recommend;
						that.recommend = [...that.recommend, ...recommend];
						that.comment.data = res.comment;
						that.danmus = res.danmu;
						var shareData = window._share;
						if(shareData) {
							shareData.success = function() {
								that.util.request({
									url: 'gohome/common/share',
									data: {id: that.id, type: 'seckill'}
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
					}
				})
			},
			onFavor() {
				onToggleFavor({
					vue: this,
					goods_id: this.goods.id,
					type: 'seckill',
					target: 'goods'
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
					type: 'seckill',
					id: this.id
				})
			},
		},
		mounted() {
			if(this.$route.query && this.$route.query.id > 0) {
				this.id = this.$route.query.id;
			}
			this.onLoad();
		},
		watch: {
			// 对路由变化作出响应...
			'$route' (to, from) {
				this.showPreLoading = true;
				this.goods = {
					name: '',
					thumb: '',
					endtime: 0,
					store: {}
				};
				this.recommend = [];
				if(this.$route.query.id) {
					this.id = this.$route.query.id;
				}
				this.$refs.content.scrollTop = 0;
				this.onLoad();
			}
		},
	}
</script>

<style>
	#seckill-detail .content{
		bottom: 50px;
	}
	#seckill-detail .van-goods-action .van-icon{
		font-size: 18px;
	}
	#seckill-detail .van-goods-action .van-icon{
		font-size: 18px;
	}
	#seckill-detail .van-goods-action .van-goods-action-mini-btn.favorite{
		color: #ff2d4b;
	}
	#seckill-detail .van-goods-action .btn-buy{
		background: -webkit-linear-gradient(left, #FD6131, #FE0000);
		background: -o-linear-gradient(right, #FD6131, #FE0000);
		background: -moz-linear-gradient(right, #FD6131, #FE0000);
		background: linear-gradient(to right, #FD6131 , #FE0000);
	}
	#seckill-detail .goods-info .thumb{
		width: 100%;
		max-height: 162px;
		font-size: 0px;
		border-radius: 3px;
		overflow: hidden;
		position: relative;
	}
	#seckill-detail .goods-info .thumb .end-bg{
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
	#seckill-detail .goods-info .thumb .end-bg img{
		width: 150px;
	}
	#seckill-detail .goods-info  .thumbs img{
		width: 100%;
		max-height: 162px;
	}
	#seckill-detail .goods-info .title{
		font-size: 14px;
		padding: 8px 0;
		line-height: 1.3;
		font-weight: 500;
	}
	#seckill-detail .goods-info .timer span{
		background-color: #ff2d4b;
		color: #fff;
		font-size: 12px;
		padding: 3px 3px;
		border-radius: 3px;
		margin: 0 3px;
	}
	#seckill-detail .goods-info .take-info-item{
		width: 33.3333%;
	}
	#seckill-detail .store-info{
		width: 85%;
	}
	#seckill-detail .richtext{
		width: 100%;
		overflow-x: hidden;
	}
	#seckill-detail .richtext img{
		max-width: 100%;
	}
	#seckill-detail .activity-list{
		padding: 7.5px;
		background-color: #fff;
		display: flex;
		flex-flow: row wrap;
		align-items: center;
	}
	#seckill-detail .activity-list .activity-item{
		width: 50%;
		padding: 7.5px;
	}
	#seckill-detail .activity-item .thumb{
		width: 100%;
		height: 162px;
		font-size: 0px;
		border-radius: 3px;
		overflow: hidden;
		position: relative;
	}
	#seckill-detail .activity-item .goods-title{
		font-size: 14px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		line-height: 1.2;
		margin: 8px 0;
		height: 33px;
	}
	#seckill-detail .step .step-number{
		width: 16px;
		height: 16px;
		border-radius: 50%;
		margin-right: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #000;
		color: #fff;
		font-size: 10px;
	}
	/*弹幕样式*/
	#seckill-detail .content .order-danmu{
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
	#seckill-detail .content .order-danmu img{
		border-radius: 100%;
		height: 30px;
		width: 30px;
		margin-right: 5px;
	}
	#seckill-detail .content .order-danmu span{
		display: inline-block;
		font-size: 14px;
	}
	#seckill-detail .content .order-danmu .info{
		width: 180px;
		white-space:nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-right: 5px;
	}
	#seckill-detail .content .order-danmu.opacity-0{
		opacity: 0!important;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/seckill/detail.vue