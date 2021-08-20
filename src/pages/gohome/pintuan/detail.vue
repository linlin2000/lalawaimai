<template>
	<div id="pintuan-detail">
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
				<van-swipe class="thumbs" :autoplay="5000" v-if="detail.thumbs && detail.thumbs.length > 0" indicator-color="#ff2d4b">
					<van-swipe-item v-for="(image, index) in detail.thumbs" :key="index">
						<img :src="image" alt="">
					</van-swipe-item>
				</van-swipe>
				<div class="thumb" v-else>
					<img class="img-100" :src="detail.thumb" alt="">
				</div>
				<ul class="right-btn">
					<router-link tag="li" class="btn-item" :to="util.getUrl({path: '/gohome/pages/poster/index', query: {goods_id: id, type: 'pintuan'}})">
						<span>生成</span><span>海报</span>
					</router-link>
				</ul>
				<div class="title">【{{detail.peoplenum}}人团】{{detail.name}}</div>
				<div class="flex-lr van-hairline--bottom padding-15-b">
					<div class="flex-lr">
						<div class="flex">
							<div class="c-danger font-16 font-bold">¥{{detail.price}}</div>
							<div class="c-gray font-12 line-through margin-5-l">¥{{detail.oldprice}}</div>
						</div>
					</div>
					<div class="flex" v-if="detail.status == 1">
						<span class="font-12 c-gray margin-5-r">距结束</span>
						<count-down :endTime="detail.endtime"></count-down>
					</div>
					<div class="flex" v-else-if="detail.status == 2">
						<span class="font-12 c-gray margin-5-r">距开始</span>
						<count-down :endTime="detail.starttime"></count-down>
					</div>
				</div>
				<div class="padding-15-tb flex-lr font-12 c-gray">
					<div class="take-info-item">
						<i class="icon icon-browse"></i>
						<span>{{detail.total_looknum}}人浏览</span>
					</div>
					<div class="take-info-item text-center van-hairline--left van-hairline--right">
						<i class="icon icon-share"></i>
						<span>{{detail.total_sharenum}}人分享</span>
					</div>
					<div class="take-info-item text-right">
						<i class="icon icon-friend font-15"></i>
						<span>{{detail.falesailed_total}}人参与</span>
					</div>
				</div>
			</div>
			<div class="margin-10-t padding-15-l bg-default">
				<div class="flex-lr padding-15-tb padding-15-r font-14 van-hairline--bottom">
					<div class="font-14">拼团规则</div>
				</div>
				<div class="padding-15-tb padding-15-r flex-lr">
					<div class="step flex">
						<span class="step-number">1</span>
						<ul class="c-gray font-12">
							<li class="margin-5-b">选择商品</li>
							<li>付款开团/参团</li>
						</ul>
					</div>
					<div class="step flex">
						<span class="step-number">2</span>
						<ul class="c-gray font-12">
							<li class="margin-5-b">邀请好友</li>
							<li>邀请好友支付参团</li>
						</ul>
					</div>
					<div class="step flex">
						<span class="step-number">3</span>
						<ul class="c-gray font-12">
							<li class="margin-5-b">组团成功发货</li>
							<li>失败退款</li>
						</ul>
					</div>
				</div>
			</div>
			<div class="margin-10-t padding-15-l bg-default" v-if="teams">
				<div class="flex-lr padding-15-tb padding-15-r font-14 van-hairline--bottom">
					<div class="font-14">待成团</div>
				</div>
				<div class="wait-list padding-15-r padding-15-b">
					<van-row class="wait-item flex-lr" v-for="(item, index) in teams" :key="'t' + index">
						<van-col span="9" class="flex">
							<div class="user-avatar">
								<img class="img-100" :src="item.avatar" alt="">
							</div>
							<div class="nickname ellipsis">{{item.nickname}}</div>
						</van-col>
						<van-col span="15" class="flex-lr" >
							<ul class="font-12 padding-10-l" >
								<li class="c-danger">还差{{item.team_num - item.takepart_num}}人成团</li>
								<li class="c-gray margin-5-t flex" v-if="item.overtime">
									还剩<count-down :endTime="item.overtime"></count-down>结束
								</li>
							</ul>
							<span class="btn-take" @click="onJoinTeam(item.id, '', item.uid)" v-if="detail.status == 1 && detail.total != 0">去参团</span>
							<span class="btn-take" v-else>敬请关注</span>
						</van-col>
					</van-row>
				</div>
			</div>
			<div class="margin-10-t padding-15-l bg-default">
				<div class="flex-lr padding-15-tb padding-15-r font-14 van-hairline--bottom">
					<div class="font-14">适用门店</div>
					<van-icon name="arrow" class="c-gray"></van-icon>
				</div>
				<div class="padding-15-tb padding-15-r flex-lr" v-if="detail.store">
					<div class="font-14 store-info">
						<div class="margin-10-b w-100 ellipsis">{{detail.store.title}}</div>
						<div class="flex c-gray w-100" @click="util.jsLocation({lat: detail.store.location_x, lng: detail.store.location_y, address: detail.store.address})"> 
							<i class="icon icon-location margin-5-r font-15"></i>
							<p class="ellipsis">{{detail.store.address}}</p>
						</div>
					</div>
					<i class="icon icon-telephone icon-telephone-circle" @click="util.jsTel(detail.store.telephone)"></i>
				</div>
			</div>
			<div class="margin-10-t padding-15-l bg-default">
				<div class="flex-lr padding-15-tb padding-15-r font-14 van-hairline--bottom">
					<div class="font-14">商品详情</div>
				</div>
				<div class="padding-15-tb padding-15-r richtext" v-html="detail.detail"></div>
			</div>
			<div class="margin-10-t padding-15-l bg-default" v-if="0">
				<div class="flex-lr padding-15-tb padding-15-r font-14 van-hairline--bottom">
					<div class="font-14">购买须知</div>
				</div>
				<div class="padding-15-tb padding-15-r richtext">
					富文本
				</div>
			</div>
			<comment
				:comment = "comment.data"
			    @onLoadingComment = "onComment"
			>
			</comment>
			<div class="margin-10-t bg-default">
				<div class="padding-15-l">
					<div class="flex-lr padding-15-tb padding-15-r font-14 van-hairline--bottom">
						<div class="font-14">更多优惠商品</div>
						<van-icon name="arrow" class="c-gray"></van-icon>
					</div>
				</div>
				<div class="activity-list">
					<div class="activity-item" v-for="(item, index) in more_activity" :key="'m' + index">
						<router-link tag="div" class="item-inner" :to="util.getUrl({path: '/gohome/pages/pintuan/detail', query: {id: item.id}})">
							<div class="thumb">
								<img class="img-100" :src="item.thumb" alt="">
							</div>
							<div class="goods-title">{{item.name}}</div>
							<div class="flex-lr">
								<div class="flex">
									<span class="c-danger font-500 font-15 margin-5-r">¥{{item.price}}</span>
									<div class="c-gray line-through font-12">¥{{item.oldprice}}</div>
								</div>
								<div class="c-gray font-12">已售{{item.falesailed_total}}份</div>
							</div>
						</router-link>
					</div>
				</div>
			</div>
		</div>
		<van-goods-action>
			<van-goods-action-mini-btn icon="shop" text="店铺" @click="util.jsUrl('gohome/pages/haodian/detail?sid=' + detail.store.id)"/>
			<van-goods-action-mini-btn :class="{favorite: detail.is_favor}" :icon="detail.is_favor ? 'favor_fill_light' : 'favor1'" :text="detail.is_favor ? '已收藏' : '收藏'" @click="onFavor()" />
			<van-goods-action-mini-btn icon="share" text="分享" @click="zhezhaoShow = !zhezhaoShow" />
			<template v-if="detail.status == 2">
				<van-goods-action-big-btn class="btn-share">
					<div>活动尚未开始</div>
				</van-goods-action-big-btn>
			</template>
			<template v-else-if="detail.status == 3">
				<van-goods-action-big-btn class="btn-share">
					<div>活动已经结束</div>
				</van-goods-action-big-btn>
			</template>
			<template v-else-if="detail.status == 1">
				<template v-if="detail.total == 0">
					<van-goods-action-big-btn class="btn-share">
						<div>商品已被抢完了</div>
					</van-goods-action-big-btn>
				</template>
				<template v-else>
					<van-goods-action-big-btn class="btn-buy" v-if="detail.aloneprice > 0" :to="util.getUrl({path: '/gohome/pages/pintuan/create', query: {id: id}})">
						<div>¥{{detail.aloneprice}}</div>
						<div>单独购买</div>
					</van-goods-action-big-btn>
					<van-goods-action-big-btn class="btn-share" @click="onJoinTeam(0, 'start')" >
						<div>¥{{detail.price}}</div>
						<div>发起拼团</div>
					</van-goods-action-big-btn>
				</template>
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
	import CountDown from '@/components/countDown'
	import Comment from '@/components/comment'
	import {getData, setData} from "@/controller/funcCommon"
	import {onToggleFavor, onShowDanmu, onGetComment} from "../controller/gohome.js"
	export default {
		components: {
			PublicHeader,
			CountDown,
			Comment
		},
		data() {
			return {
				showPreLoading: true,
				zhezhaoShow: false,
				star: 3,
				detail: {},
				more_activity: {},
				teams: {},
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
			onLoad(id) {
				var that = this;
				if(id) {
					that.id = id;
				}
				getData({
					vue: that,
					url: 'pintuan/index/detail',
					data: {
						id: that.id,
						page: 1,
						psize: that.comment.psize
					},
					success: function(res) {
						that.detail = res.detail;
						that.more_activity = res.more_activity;
						that.teams = res.teams;
						that.record = res.record;
						that.comment.data = res.comment;
						that.danmus = res.danmu;
						var shareData = window._share;
						if(shareData) {
							shareData.success = function() {
								that.util.request({
									url: 'gohome/common/share',
									data: {id: that.id, type: 'pintuan'}
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

			onJoinTeam(teamId, type, team_uid) {
				if(type == 'start') {
					if(this.record && this.record.id) {
						this.util.$toast('您已参与了该团，请等待本次团购结束后在进行开团', this.util.getUrl({path: '/gohome/pages/pintuan/share', query: {id: this.id, team_id: this.record.team_id}}), 1000);
						return false;
					}
					this.$router.push(this.util.getUrl({path: '/gohome/pages/pintuan/create', query: {id: this.id, is_team: '1'}}));
					return;
				}
				if(this.record && this.record.team_id > 0) {
					this.util.$toast('您已参与了该团，请等待本次团购结束后在进行开团', this.util.getUrl({path: '/gohome/pages/pintuan/share', query: {id: this.id, team_id: this.record.team_id}}), 1000);
					return;
				}
				this.$router.push(this.util.getUrl({path: '/gohome/pages/pintuan/create', query: {id: this.id, team_id: teamId}}));
			},
			onFavor() {
				onToggleFavor({
					vue: this,
					goods_id: this.detail.id,
					type: 'pintuan',
					target: 'detail'
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
					type: 'pintuan',
					id: this.id
				})
			}
		},
		created() {
			if(this.$route.query && this.$route.query.id > 0) {
				this.id = this.$route.query.id
			}
		},
		mounted(){
			this.onLoad();
		},
		watch: {
			'$route' (to, from) {
				this.showPreLoading = true;
				if(this.$route.query && this.$route.query.id > 0) {
					this.id = this.$route.query.id
				}
				this.$refs.content.scrollTop = 0;
				this.onLoad();
			}
		}
	}
</script>

<style>
	#pintuan-detail .content{
		bottom: 50px;
	}
	#pintuan-detail .van-goods-action .van-icon{
		font-size: 18px;
	}
	#pintuan-detail .van-goods-action .van-goods-action-mini-btn.favorite{
		color: #ff2d4b;
	}
	#pintuan-detail .van-goods-action .btn-buy, #pintuan-detail .van-goods-action .btn-share{
		line-height: 1.2;
		font-size: 14px;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
	}
	#pintuan-detail .van-goods-action .btn-buy{
		background: -webkit-linear-gradient(left, #FFBC2D, #FF9B2C);
		background: -o-linear-gradient(right, #FFBC2D, #FF9B2C);
		background: -moz-linear-gradient(right, #FFBC2D, #FF9B2C);
		background: linear-gradient(to right, #FFBC2D , #FF9B2C);
	}
	#pintuan-detail .van-goods-action .btn-share, #pintuan-detail .wait-item .btn-take{
		background: -webkit-linear-gradient(left, #FD6131, #FE0000);
		background: -o-linear-gradient(right, #FD6131, #FE0000);
		background: -moz-linear-gradient(right, #FD6131, #FE0000);
		background: linear-gradient(to right, #FD6131 , #FE0000);
	}
	#pintuan-detail .goods-info .thumb{
		width: 100%;
		max-height: 162px;
		font-size: 0px;
		border-radius: 3px;
		overflow: hidden;
		position: relative;
	}
	#pintuan-detail .goods-info .thumb img{
		width: 100%;
		max-height: 162px;
	}
	#pintuan-detail .goods-info .thumbs img{
		width: 100%;
		max-height: 162px;
	}
	#pintuan-detail .goods-info .title{
		font-size: 14px;
		padding: 8px 0;
		line-height: 1.3;
		font-weight: 500;
	}
	#pintuan-detail .goods-info .timer span{
		background-color: #ff2d4b;
		color: #fff;
		font-size: 12px;
		padding: 3px 3px;
		border-radius: 3px;
		margin: 0 3px;
	}
	#pintuan-detail .goods-info .take-info-item{
		width: 33.3333%;
	}
	#pintuan-detail .store-info{
		width: 85%;
	}
	#pintuan-detail .richtext{
		width: 100%;
		overflow-x: hidden;
	}
	#pintuan-detail .richtext img{
		max-width: 100%;
	}
	#pintuan-detail .avatar img{
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
	#pintuan-detail .basic{
		padding-left: 10px;
		flex: 1;
	}
	#pintuan-detail .comment{
		margin-left: 60px;
	}
	#pintuan-detail .comment .text{
		font-size: 13px;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		overflow: hidden;
	}
	#pintuan-detail .comment .thumbs img{
		height: 60px;
		border-radius: 3px;
	}
	#pintuan-detail .comment .thumbs{
		position: relative;
	}
	#pintuan-detail .comment .thumbs .van-col{
		font-size: 0px;
	}
	#pintuan-detail .comment .thumbs-num{
		position: absolute;
		right: 5px;
		bottom: 0;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
		font-size: 10px;
		padding: 2px 5px;
	}

	#pintuan-detail .activity-list{
		padding: 7.5px;
		background-color: #fff;
		display: flex;
		flex-flow: row wrap;
		align-items: center;
	}
	#pintuan-detail .activity-list .activity-item{
		width: 50%;
		padding: 7.5px;
	}
	#pintuan-detail .activity-item .thumb{
		width: 100%;
		height: 162px;
		font-size: 0px;
		border-radius: 3px;
		overflow: hidden;
		position: relative;
	}
	#pintuan-detail .activity-item .goods-title{
		font-size: 14px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		line-height: 1.2;
		margin: 8px 0;
		height: 33px;
	}
	#pintuan-detail .step .step-number{
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
	#pintuan-detail .wait-item{
		background-color: #eee;
		margin-top: 15px;
		padding: 15px;
	}
	#pintuan-detail .wait-item .user-avatar{
		width: 40px;
		height: 40px;
		border-radius: 50%;
		overflow: hidden;
	}
	#pintuan-detail .wait-item .nickname{
		flex: 1;
		font-size: 14px;
		padding-left: 10px;
	}
	#pintuan-detail .wait-item .btn-take{
		padding: 6px 12px;
		border-radius: 30px;
		color: #fff;
		font-size: 13px;
	}
	/*弹幕样式*/
	#pintuan-detail .content .order-danmu{
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
	#pintuan-detail .content .order-danmu img{
		border-radius: 100%;
		height: 30px;
		width: 30px;
		margin-right: 5px;
	}
	#pintuan-detail .content .order-danmu span{
		display: inline-block;
		font-size: 14px;
	}
	#pintuan-detail .content .order-danmu .info{
		width: 180px;
		white-space:nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-right: 5px;
	}
	#pintuan-detail .content .order-danmu.opacity-0{
		opacity: 0!important;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/pintuan/detail.vue