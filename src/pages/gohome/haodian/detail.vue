<template>
	<div id="haodian-detail">
		<public-header title="商户详情"></public-header>
		<div class="content">
			<!--幻灯片-->
			<div class="padding-10-lr padding-10-t bg-default" v-if="store.thumbs.length > 0">
				<van-swipe loop class="thumbs" indicator-color="#ff2d4b">
					<van-swipe-item :autoplay="3000" v-for="(item, index) in store.thumbs" :key="index" @click="util.jsUrl(item.url)">
						<img :src="item.image" />
					</van-swipe-item>
				</van-swipe>
			</div>
			<!--门店基本信息-->
			<div class="store-info bg-default font-14 flex-lr padding-10-lr padding-15-tb van-hairline--bottom">
				<div class="store-logo">
					<img class="img-100" :src="store.logo" alt="">
				</div>
				<div class="info-inner">
					<div class="w-100 flex">
						<div class="store-title font-15 font-500 ellipsis">{{store.title}}</div>
						<ul class="flex">
							<li class="store-tag" v-if="store.haodian_cid > 0">{{store.haodian_cid_cn}}</li>
							<li class="store-tag" v-if="store.haodian_child_id > 0">{{store.haodian_child_id_cn}}</li>
						</ul>
					</div>
					<div class="flex font-12">
						<van-rate v-model="store.haodian_score" :size="12" disabled-color="#ff2d4b" disabled />
						<span class="c-gray  margin-5-l">{{store.haodian_score}}分</span>
						<div class="flex margin-10-l">
							<i class="icon icon-hotfill c-danger"></i>
							<span class="c-gray">人气:{{store.click}}</span>
						</div>
					</div>
					<div class="flex c-gray font-12">
						<i class="icon icon-time"></i>
						<span class="margin-5-l">营业时间: {{store.business_hours_cn}}</span>
					</div>
					<div class="flex c-gray font-12 store-address">
						<i class="icon icon-location"></i>
						<span class="margin-5-l ellipsis">{{store.address}}</span>
					</div>
					<div class="store-other c-danger flex ">
						<i class="font-20 icon icon-taxi border-1px-r padding-5-r" @click="util.jsLocation({lat: store.location_x, lng: store.location_y});"></i>
						<i class="font-20 icon icon-phone padding-5-l" @click="util.jsUrl('tel:' + store.telephone)"></i>
					</div>
				</div>
			</div>
			<ul class="store-feature bg-default font-14 padding-10-lr padding-15-t padding-5-b" v-if="store.haodian_tags.length > 0">
				<li class="feature-item flex" v-for="(item, index) in store.haodian_tags" :key="index">
					<i class="icon icon-tag font-14 c-danger margin-5-r"></i>
					<span>{{item}}</span>
				</li>
			</ul>
			<!--优惠券-->
			<div class="store-coupon margin-10-t padding-10-t bg-default" v-if="coupon.coupons.length > 0 || coupon.record.length > 0">
				<div class="activity-header ">店铺优惠券</div>
				<div class="coupon-list padding-5-b">
					<div class="coupon-item flex-lr" v-if="coupon.can_collect == 1">
						<div class="left">
							<div class="c-danger font-500">{{coupon.title}}</div>
							<div class="c-gray margin-10-t font-12">满{{coupon.coupons[0].condition}}元可用</div>
							<div class="c-gray margin-10-t font-12">限{{coupon.endtime_cn}}前领取</div>
						</div>
						<div class="right">
							<span class="font-18 font-bold c-danger">¥{{coupon.coupons[0].discount}}</span>
							<div class="btn-take" @click="getCoupon">立即领取</div>
						</div>
					</div>
					<template v-if="coupon.record.length > 0">
						<div class="coupon-item flex-lr" v-for="item in coupon.record" :key="item.id">
							<div class="left">
								<div class="c-danger font-500">{{item.title}}</div>
								<div class="c-gray margin-10-t font-12">满{{item.condition}}元可用</div>
								<div class="c-gray margin-10-t font-12">限{{item.endtime_cn}}前使用</div>
							</div>
							<div class="right">
								<span class="font-18 font-bold c-danger">¥{{item.discount}}</span>
								<div class="c-danger margin-10-t">已领取</div>
							</div>
						</div>
					</template>
				</div>
			</div>

			<!--砍价-->
			<div class="haodian-kanjia bg-default margin-10-t padding-10-t" v-if="kanjia.length > 0">
				<div class="activity-header">
					本店砍价
					<div class="more" @click="util.jsUrl('/gohome/pages/kanjia/index?sid=' + sid)">
						更多
						<div class="icon icon-arrow-right"></div>
					</div>
				</div>
				<div class="activity-list">
					<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/kanjia/detail', query: {id: item.id}})" class="activity-item" v-for="(item, index) in kanjia" :key="index">
						<div class="item-inner">
							<div class="thumb">
								<img class="img-100" :src="item.thumb" alt="">
							</div>
							<div class="goods-title">{{item.name}}</div>
							<div class="flex">
								<span class="c-danger font-500 font-15">¥{{item.price}}</span>
								<div class="c-gray line-through font-12">¥{{item.oldprice}}</div>
								<div class="discount">{{item.discount}}折</div>
							</div>
						</div>
					</router-link>
				</div>
			</div>
			<!--抢购-->
			<div class="haodian-seckill bg-default margin-10-t padding-10-t" v-if="seckill.length > 0">
				<div class="activity-header">
					本店抢购
					<div class="more" @click="util.jsUrl('/gohome/pages/seckill/index?sid=' + sid)">
						更多
						<div class="icon icon-arrow-right"></div>
					</div>
				</div>
				<div class="activity-list" >
						<div class="activity-item bg-default padding-10 van-hairline--bottom" v-for="(item, index) in seckill" :key="index">
							<div class="flex-lr">
								<div class="thumb">
									<img class="img-100" :src="item.thumb" alt="">
								</div>
								<div class="info">
									<div class="font-14 w-100">
										<p>{{item.name}}</p>
									</div>
									<div class="flex-lr-bottom w-100">
										<div class="price-bar">
											<div class="flex">
												<span class="font-500 font-15 margin-5-r">¥{{item.price}}</span>
												<div class="c-gray line-through font-12" >¥{{item.oldprice}}</div>
												<div class="discount">{{item.discount}}折</div>
											</div>
											<div class="bar">
												<div class="bar-inner" :style="{width: item.sailed_percent + '%'}"></div>
												<div class="bar-text">已抢{{item.sailed}}份</div>
											</div>
										</div>
										<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/seckill/detail', query: {id: item.id}})" class="btn btn-detail">去抢购</router-link>
									</div>
								</div>
							</div>
					</div>
				</div>
			</div>
			<!--拼团-->
			<div class="haodian-pintuan bg-default margin-10-t padding-10-t" v-if="pintuan.length > 0">
				<div class="activity-header">
					本店拼团
					<div class="more" @click="util.jsUrl('/gohome/pages/pintuan/index?sid=' + sid)">
						更多
						<div class="icon icon-arrow-right"></div>
					</div>
				</div>
				<div class="activity-list">
					<div class="activity-item" v-for="(item, index) in pintuan" :key="item.id">
						<div class="item-inner">
							<div class="thumb">
								<img class="img-100" :src="item.thumb" alt="">
								<div class="mark">
									{{item.peoplenum}}人团
								</div>
							</div>
							<div class="goods-title">{{item.name}}</div>
							<div class="flex">
								<span class="font-500 font-15 margin-5-r">¥{{item.price}}</span>
								<div class="c-gray line-through font-12" >¥{{item.oldprice}}</div>
								<div class="discount">{{item.discount}}折</div>
							</div>
							<div class="flex-lr margin-10-t">
								<div class="bar">
									<div class="bar-inner" :style="{width: item.sailed_percent + '%'}"></div>
									<div class="bar-text">已售{{item.falesailed_total}}份</div>
								</div>
								<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/pintuan/detail', query: {id: item.id}})" class="btn btn-detail" >拼团</router-link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!--商户详情和评价-->
			<div class="detail-comment bg-default margin-10-t">
				<div class="tab-group van-hairline--bottom">
					<div class="tab-item" :class="{active: detailOrComment == 'detail'}" @click="onToggleDetailOrComment('detail')">商户详情</div>
					<div class="tab-item" :class="{active: detailOrComment == 'comment'}" @click="onToggleDetailOrComment('comment')">用户评价</div>
				</div>
				<div class="richtext" v-if="detailOrComment == 'detail'" v-html="store.description"></div>
				<template v-else-if="detailOrComment == 'comment'">
					<van-list
							v-model="comment.loading"
							:finished="comment.loaded"
							@load="onGetComment"
							:offset="100"
							:immediate-check="false"
							class="comment-list"
							v-if="!comment.empty"
					>
						<div class="comment-item padding-15-tb padding-10-lr van-hairline--bottom" v-for="(item, index) in comment.data" :key="item.id">
							<div class="consumer-info flex-lr">
								<div class="avatar">
									<img class="img-100" src="http://wx.qlogo.cn/mmopen/lgicrYyMHFv8ZSaWRtQjcpbHDotWhy159lhJqQUTO0QbkB2FBaC9n4bO3eQhpIeX9lx4lYCpGiaAqnUXVzkXZmFVqiaHM4DC9HH/132" alt="">
								</div>
								<div class="basic flex-lr">
									<div>
										<div class="font-14">{{item.username}}</div>
										<div class="c-gray font-12 margin-5-t">{{item.addtime_cn}}</div>
									</div>
									<van-rate v-model="item.store_service" :size="13" disabled-color="#ff2d4b" disabled/>
								</div>
							</div>
							<div class="comment-item">
								<div class="text">{{item.note}}</div>
								<van-row class="thumbs margin-10-t" gutter="10" v-if="item.thumbs.length > 0 ">
									<van-col span="6" v-for="(img, index) in item.thumbs" :key="index" v-if="index < 4">
										<div  @click="util.jsPreviewImage(item.thumbs, index)">
											<img class="w-100" :src="img" alt="">
										</div>
									</van-col>
									<div class="thumbs-num">共{{item.thumbs.length}}张</div>
								</van-row>
							</div>
						</div>
						<div class="loaded" v-if="comment.loaded">
							<div class="loaded-tips" >没有更多了</div>
						</div>
					</van-list>
					<div class="no-data-simple" v-else>
						<span class="icon icon-cry"></span>
						<span>暂无评价~</span>
					</div>
				</template>
			</div>
		</div>
		<van-goods-action>
			<van-goods-action-mini-btn icon="comment" text="评价" @click="onComment" />
			<van-goods-action-mini-btn :class="{favorite: store.is_favorite}" :icon="store.is_favorite ? 'favor_fill_light' : 'favor1'" :text="store.is_favorite ? '已收藏' : '收藏'"  @click="onFavor(store.id)" />
			<van-goods-action-mini-btn icon="share" text="分享" @click="zhezhaoShow = !zhezhaoShow"/>
			<van-goods-action-big-btn class="btn-share" text="联系商家" @click="util.jsUrl('tel:' + store.telephone)" primary />
		</van-goods-action>
		<transition name="van-fade">
			<div class="share-zhezhao" @click="zhezhaoShow = !zhezhaoShow" v-if="zhezhaoShow">
				<img src="static/img/share-layer.png" alt="">
			</div>
		</transition>
		<transition name="van-fade">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>

</template>

<script>
	import PublicHeader from '@/components/header'
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader
		},
		data() {
			return {
				zhezhaoShow: false,
				detailOrComment: 'detail',
				store: {
					thumbs: [],
					haodian_tags: [],
					is_favorite: ''
				},
				coupon: {
					record: [],
					coupons: []
				},
				kanjia: [],
				pintuan: [],
				seckill: [],
				comment: {
					page: 1,
					psize: 5,
					empty: false,
					loaded: false,
					loading: false,
					data: []
				},
				sid: 0,
				can_comment: false,
				showPreLoading: true
			}
		},
		methods: {
			onToggleDetailOrComment(type) {
				this.detailOrComment = type;
			},
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'haodian/index/detail',
					data: {
						sid: that.sid,
						page: that.comment.page,
						psize: that.comment.psize
					},
					autoAssign: true,
					variable: 'store',
					success: (res) => {
						that.coupon = that.util.extend(that.coupon, res.coupon);
						that.kanjia = [...res.kanjia];
						that.pintuan = [...res.pintuan];
						that.seckill = [...res.seckill];
						that.can_comment = res.can_comment;
						that.comment.data = [...that.comment.data, ...res.comment];
						if(!that.comment.data.length) {
							that.comment.empty = true;
						}
						if(res.comment.length < that.comment.psize) {
							that.comment.loaded = true;
						}
						that.comment.page++;
					}
				})
			},
			onGetComment() {
				var that = this;
				getData({
					vue: that,
					url: 'haodian/index/comment',
					data: {
						sid: that.sid,
						page: that.comment.page,
						psize: that.comment.psize
					},
					success: (res) => {
						that.comment.data = [...that.comment.data, ...res.comment];
						if(!that.comment.data.length) {
							that.comment.empty = true;
						}
						if(res.comment.length < that.comment.psize) {
							that.comment.loaded = true;
						}
						that.comment.page++;
						that.comment.loading = false;
					}
				});
			},
			onFavor(sid) {
				var that = this;
				if(that.store.is_favorite) {
					var type = 'cancal';
				} else {
					var type = 'star';
				}
				setData({
					vue: that,
					url: 'wmall/member/op/favorite',
					data: {
						id: sid,
						type: type
					},
					success: () => {
						if(type == 'star') {
							this.$toast('添加收藏成功');
							this.store.is_favorite = 1;
						} else {
							this.$toast('取消收藏成功');
							this.store.is_favorite = 0;
						}
					}
				})
			},
			getCoupon() {
				var that = this;
				setData({
					vue: that,
					url: 'wmall/channel/coupon/get',
					data: {
						sid: that.sid,
					},
					message: '领取成功',
				})
			},
			onComment() {
				var that = this;
				if(!that.can_comment) {
					that.util.$toast('您已评论过，请勿重复评论');
				} else {
					that.util.jsUrl('/gohome/pages/haodian/comment?sid='+that.sid);
				}
			}
		},
		mounted() {
			if(this.$route.query && this.$route.query.sid) {
				this.sid = this.$route.query.sid;
			}
			this.onLoad();
		}
	}
</script>

<style>
	#haodian-detail .content{
		padding-bottom: 50px;
	}
	#haodian-detail .van-goods-action{
		z-index: 100;
	}
	#haodian-detail .van-goods-action .van-icon{
		font-size: 18px;
	}
	#haodian-detail .van-goods-action .van-goods-action-mini-btn.favorite{
		color: #ff2d4b;
	}
	#haodian-detail .van-goods-action .btn-share{
		background: -webkit-linear-gradient(left, #FD6131, #FE0000);
		background: -o-linear-gradient(right, #FD6131, #FE0000);
		background: -moz-linear-gradient(right, #FD6131, #FE0000);
		background: linear-gradient(to right, #FD6131 , #FE0000);
	}
	#haodian-detail .thumbs img{
		width: 100%;
		max-height: 162px;
	}
	#haodian-detail .store-info{
		position: relative;
	}
	#haodian-detail .store-info .store-logo{
		width: 80px;
		height: 80px;
		font-size: 0px;
		border-radius: 5px;
		overflow: hidden;
	}
	#haodian-detail .store-info .info-inner{
		position: absolute;
		top: 15px;
		left: 100px;
		right: 10px;
		bottom: 15px;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
	}
	#haodian-detail .store-info .info-inner .store-title{
		max-width: 40%;
	}
	#haodian-detail .store-info .info-inner .store-tag{
		font-size: 12px;
		border: 1px solid #ff2d4b;
		color: #ff2d4b;
		padding: 2px 5px;
		border-radius: 3px;
		margin-left: 5px;
	}
	#haodian-detail .store-info .info-inner .store-address{
		max-width: 75%;
	}
	#haodian-detail .store-info .info-inner .store-other{
		position: absolute;
		right: 0px;
		bottom: 0px;
	}
	#haodian-detail .store-feature{
		display: flex;
		flex-flow: row wrap;
		align-items: center;
	}
	#haodian-detail .store-feature .feature-item{
		width: 25%;
		margin-bottom: 10px;
	}
	#haodian-detail .store-feature .feature-item:nth-child(4n-2), #haodian-detail .store-feature .feature-item:nth-child(4n-1){
		justify-content: center;
	}
	#haodian-detail .store-feature .feature-item:nth-child(4n) {
		justify-content: flex-end;
	}
	#haodian-detail .store-feature .feature-item .icon{
		width: 18px;
		height: 18px;
		border-radius: 3px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#haodian-detail .store-feature .feature-item span{
		max-width: 56px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	/*优惠券*/
	#haodian-detail .coupon-list .coupon-item{
		background: url('../../../../static/img/coupon_bg.png') no-repeat center center;
		background-size: 100% 100%;
		margin: 10px;
		font-size: 14px;
	}
	#haodian-detail .coupon-list .coupon-item .left{
		width: 72%;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
		padding: 15px 10px;
	}
	#haodian-detail .coupon-list .coupon-item .right{
		width: 28%;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
	}
	#haodian-detail .coupon-list .coupon-item .btn-take{
		background-color: #ff2d4b;
		color: #fff;
		border-radius: 50px;
		padding: 5px 10px;
		font-size: 12px;
		margin-top: 10px;
	}
	/*活动*/
	#haodian-detail .activity-header{
		font-weight: bold;
		position: relative;
		font-size: 15px;
		height: 30px;
		line-height: 30px;
		text-align: center;
	}
	#haodian-detail .activity-header .more{
		position: absolute;
		right: 10px;
		bottom: 0;
		line-height: 30px;
		color: #999;
		font-size: 12px;
		font-weight: normal;
	}
	#haodian-detail .activity-header .more .icon{
		margin-left: -5px;
		font-size: 12px;
	}
	#haodian-detail .haodian-kanjia .activity-list{
		white-space: nowrap;
		overflow-x: scroll;
		overflow-y: hidden;
		padding: 5px;
		background-color: #fff;
	}
	#haodian-detail .haodian-kanjia .activity-list .activity-item{
		display: inline-block;
		width: 30%;
		padding: 5px;
	}
	#haodian-detail .haodian-kanjia .activity-list .activity-item .thumb{
		width: 100%;
		height: 80px;
		font-size: 0px;
		border-radius: 3px;
		overflow: hidden;
		position: relative;
	}
	#haodian-detail .haodian-kanjia .activity-list .activity-item .thumb img{
		width: 100%;
		height: 100%;
	}
	#haodian-detail .haodian-kanjia .activity-list .activity-item .goods-title{
		white-space: normal;
		font-size: 14px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		line-height: 1.2;
		margin: 8px 0;
		height: 33px;
	}
	#haodian-detail .haodian-kanjia .activity-list .discount{
		position: relative;
		padding: 3px 3px 3px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		background-color: #FED4D5;
		color: #C51C33;
		margin-left: 10px;
	}
	#haodian-detail .haodian-kanjia .activity-list .discount:before{
		content: "";
		display: block;
		border-width: 8px;
		position: absolute;
		left: -8px;
		transform: translateX(-50%);
		border-style: solid dashed dashed;
		border-color:  transparent #FED4D5 transparent transparent   ;
		font-size: 0;
		line-height: 0;
		z-index: 10;
	}

	#haodian-detail .haodian-pintuan .activity-list{
		padding: 7.5px;
		background-color: #fff;
		display: flex;
		flex-flow: row wrap;
		align-items: center;
	}
	#haodian-detail .haodian-pintuan .activity-list .activity-item{
		width: 50%;
		padding: 7.5px;
	}
	#haodian-detail .haodian-pintuan .activity-item .thumb{
		width: 100%;
		height: 162px;
		font-size: 0px;
		border-radius: 3px;
		overflow: hidden;
		position: relative;
	}
	#haodian-detail .haodian-pintuan .thumb .mark{
		position: absolute;
		width: 44px;
		height: 28px;
		top: 0;
		left: 10px;
		padding-top: 4px;
		background: url('../../../../static/img/robot.png') no-repeat;
		background-size: 100% 100% ;
		color: #fff;
		font-size: 12px;
		text-align: center;
	}
	#haodian-detail .haodian-pintuan .activity-item .thumb .end-bg{
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
	#haodian-detail .haodian-pintuan .activity-item .thumb .end-bg img{
		width: 130px;
	}
	#haodian-detail .haodian-pintuan .activity-item .goods-title{
		font-size: 14px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		line-height: 1.2;
		margin: 8px 0;
	}
	#haodian-detail .haodian-pintuan .activity-item .btn{
		color: #fff;
		font-size: 14px;
		padding: 8px 5px;
		border-radius: 3px;
	}
	#haodian-detail .haodian-pintuan .activity-item .btn.btn-detail{
		background: -webkit-linear-gradient(left, #FC6030, #FF0101);
		background: -o-linear-gradient(right, #FC6030, #FF0101);
		background: -moz-linear-gradient(right, #FC6030, #FF0101);
		background: linear-gradient(to right, #FC6030 , #FF0101);
	}
	#haodian-detail .haodian-pintuan .activity-item .btn.btn-end{
		background-color: #959595;
	}
	#haodian-detail .haodian-pintuan .activity-item .discount{
		position: relative;
		padding: 2px 3px 2px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		background-color: #FED4D5;
		color: #C51C33;
		margin-left: 10px;
	}
	#haodian-detail .haodian-pintuan .activity-item .discount:before{
		content: "";
		display: block;
		border-width: 7px;
		position: absolute;
		left: -7px;
		transform: translateX(-50%);
		border-style: solid dashed dashed;
		border-color:  transparent #FED4D5 transparent transparent   ;
		font-size: 0;
		line-height: 0;
		z-index: 10;
	}
	#haodian-detail .haodian-pintuan .activity-item .bar{
		width: 60%;
		height: 14px;
		border-radius: 20px;
		background-color: #FED4D5;
		position: relative;
		margin-top: 10px;
		overflow: hidden;
	}
	#haodian-detail .activity-item .bar.bar-end{
		background-color: #959595;
	}
	#haodian-detail .activity-item .bar .bar-inner{
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		bottom: 0;
		border-radius: 20px;
		background: -webkit-linear-gradient(left, #FD6131, #FE0000);
		background: -o-linear-gradient(right, #FD6131, #FE0000);
		background: -moz-linear-gradient(right, #FD6131, #FE0000);
		background: linear-gradient(to right, #FD6131 , #FE0000);
	}
	#haodian-detail .activity-item .bar .bar-text{
		position: absolute;
		z-index: 2;
		top: 0;
		left: 0;
		bottom: 0;
		padding-left: 10px;
		display: flex;
		align-items: center;
		font-size: 10px;
		color: #fff;
		min-width: 80px;
	}

	#haodian-detail .haodian-seckill .activity-list .activity-item:last-child:after{
		display: none;
	}
	#haodian-detail .haodian-seckill .activity-list  .activity-item .thumb{
		position: relative;
		width: 100px;
		height: 100px;
		border-radius: 2px;
		overflow: hidden;
	}
	#haodian-detail .haodian-seckill .activity-list  .activity-item .btn{
		color: #fff;
		font-size: 14px;
		padding: 8px 5px;
		border-radius: 3px;
	}
	#haodian-detail .haodian-seckill .activity-list  .activity-item .btn.btn-detail{
		background: -webkit-linear-gradient(left, #FC6030, #FF0101);
		background: -o-linear-gradient(right, #FC6030, #FF0101);
		background: -moz-linear-gradient(right, #FC6030, #FF0101);
		background: linear-gradient(to right, #FC6030 , #FF0101);
	}
	#haodian-detail .haodian-seckill .activity-list  .activity-item .btn.btn-end{
		background-color: #959595;
	}
	#haodian-detail .haodian-seckill .activity-list  .activity-item .info{
		flex: 1;
		padding-left: 10px;
		height: 100px;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
	}
	#haodian-detail .haodian-seckill .activity-list  .activity-item .info .price-bar{
		width: 67%;
	}
	#haodian-detail .haodian-seckill .activity-list  .activity-item .info .discount{
		position: relative;
		padding: 3px 5px 3px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		background-color: #FED4D5;
		color: #C51C33;
		margin-left: 10px;
	}
	#haodian-detail .haodian-seckill .activity-list  .activity-item .info .discount:before{
		content: "";
		display: block;
		border-width: 8px;
		position: absolute;
		left: -8px;
		transform: translateX(-50%);
		border-style: solid dashed dashed;
		border-color:  transparent #FED4D5 transparent transparent   ;
		font-size: 0;
		line-height: 0;
		z-index: 10;
	}
	#haodian-detail .haodian-seckill .activity-list .activity-item .bar{
		width: 100%;
		height: 14px;
		border-radius: 20px;
		background-color: #FED4D5;
		position: relative;
		margin-top: 10px;
		overflow: hidden;
	}
	#haodian-detail .haodian-seckill .activity-list .activity-item .bar.bar-end{
		background-color: #959595;
	}
	#haodian-detail .haodian-seckill .activity-list .activity-item .bar .bar-inner{
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		bottom: 0;
		border-radius: 20px;
		background: -webkit-linear-gradient(left, #FD6131, #FE0000);
		background: -o-linear-gradient(right, #FD6131, #FE0000);
		background: -moz-linear-gradient(right, #FD6131, #FE0000);
		background: linear-gradient(to right, #FD6131 , #FE0000);
	}
	#haodian-detail .haodian-seckill .activity-list .activity-item .bar .bar-text{
		position: absolute;
		z-index: 2;
		top: 0;
		left: 0;
		bottom: 0;
		padding-left: 10px;
		display: flex;
		align-items: center;
		font-size: 10px;
		color: #fff;
		min-width: 80px;
	}

	/*商户详情和用户评价*/
	#haodian-detail .detail-comment .tab-group{
		position: relative;
		top: 0px;
	}
	#haodian-detail .detail-comment .richtext{
		padding: 10px;
	}
	#haodian-detail .detail-comment .richtext img{
		max-width: 100%;
	}

	#haodian-detail .comment-list .comment-item .avatar img{
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
	#haodian-detail .comment-list .comment-item .basic{
		padding-left: 10px;
		flex: 1;
	}
	#haodian-detail .comment-list .comment-item .comment-item{
		margin-left: 60px;
	}
	#haodian-detail .comment-list .comment-item .comment-item .text{
		font-size: 13px;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		overflow: hidden;
	}
	#haodian-detail .comment-list .comment-item .comment-item .thumbs img{
		height: 60px;
		border-radius: 3px;
	}
	#haodian-detail .comment-list .comment-item .comment-item .thumbs{
		position: relative;
	}
	#haodian-detail .comment-list .comment-item .comment-item .thumbs .van-col{
		font-size: 0px;
	}
	#haodian-detail .comment-list .comment-item .comment-item .thumbs-num{
		position: absolute;
		right: 5px;
		bottom: 0;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
		font-size: 10px;
		padding: 2px 5px;
	}
	#haodian-detail .comment-list .comment-item .comment-item .comment-tags{
		display: flex;
		flex-flow: row nowrap;
		align-items: flex-start;
	}
	#haodian-detail .comment-list .comment-item .comment-item .comment-tags .icon-tag{
		margin-top: 3px;
	}
	#haodian-detail .comment-list .comment-item .comment-item .tags-wrap{
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		line-height: 1.3;
	}
	#haodian-detail .comment-list .comment-item .no-comment{
		padding: 20px 15px 20px 0;
		text-align: center;
		background-color: #fff;
		color: #999;
		font-size: 14px;
	}
	#haodian-detail .comment-list .loaded-tips{
		background-color: #fff;
	}
	#haodian-detail .no-data-simple{
		text-align:center;
		font-size:14px;
		color:#999;
		padding:20px 0;
		width:100%;
		box-sizing:border-box;
	}
	#haodian-detail .no-data-simple .icon{
		margin-right:5px;
		font-size:18px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/haodian/detail.vue