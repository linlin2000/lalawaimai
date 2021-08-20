<template>
	<div id="goods-detail">
		<public-header title="商品详情" textcolor="#fff"></public-header>
		<div class="content">
			<div class="goods-img">
				<img :src="goodsActive.thumb_" alt="" v-if="goodsActive.slides && !goodsActive.slides.length">
				<van-swipe :autoplay="3000" indicator-color="#ff2d4b" v-else>
					<van-swipe-item v-for="(item, index) in goodsActive.slides" :key="index">
						<img :src="item" alt="">
					</van-swipe-item>
				</van-swipe>
			</div>
			<div class="goods-name">{{goodsActive.title}}</div>
			<div class="sell-info">已售{{goodsActive.sailed}}&nbsp;&nbsp;好评{{goodsActive.comment_good}}</div>
			<div class="goods-num">
				<van-row>
					<van-col span="12" class="price">¥ <span class="fee">{{goodsActive.price}}</span><span class="goods-unitnum" v-if="goodsActive.unitnum > 1">{{goodsActive.unitnum}}份起购</span></van-col>
					<goods-handle
						:goods="goodsActive"
						:optionId="0"
						from="detail"
						type="reserve">
					</goods-handle>
				</van-row>
			</div>
			<div class="goods-evaluate">商品评价</div>
			<div class="praise text-center">
				好评率
				<span class="rate">{{goodsActive.comment_good_percent}}</span>
				<span class="num">(共{{goodsActive.comment_total}}人评价)</span>
			</div>
			<div class="progress">
				<div class="progress-bar">
					<div class="progress-active" :style="{width: goodsActive.comment_good_percent}"></div>
				</div>
			</div>
			<div class="goods-desc">商品描述</div>
			<div class="goods-desc-con" v-html="goodsActive.description">
			</div>
			<div class="tips">
				温馨提示: 图片仅供参考,请以实物为准;<br>
				高峰时段及恶劣天气,请提前下单
			</div>
		</div>
		<!--进入店铺-->
		<router-link class="into-store" tag="div" :to="util.getUrl({path: '/pages/store/goods', query: {sid: store.id}})">
			进入店铺
		</router-link>
		<!-- 购物车部分 -->
		<store-cart
			:show="true"
			:store="store"
			from="reserve"
			:table_category="table_category">
		</store-cart>
		<transition name="loading">
			<iloading v-if="preLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	import PublicHeader from '@/components/header'
	import StoreCart from '@/components/storeCart'
	import GoodsHandle from '@/components/goodsHandle'
	export default {
		data() {
			return {
				preLoading: true,
				cart: {},
				store: {},
				goodsActive: {},
				table_category: {}
			}
		},
		components: {
			PublicHeader,
			StoreCart,
			GoodsHandle
		},
		methods: {
			...mapMutations([
				'replaceStore', 'replaceCart'
			]),

			onLoad() {
				if(!this.$route.query.sid) {
					this.$toast('参数错误');
					return false;
				} else {
					this.sid = this.$route.query.sid
				}
				if(!this.$route.query.id) {
					this.$toast('参数错误');
					return false;
				} else {
					this.id = this.$route.query.id;
				}
				this.util.request({
					url: 'wmall/store/reserve/detail',
					data: {
						sid: this.sid,
						id: this.id,
						table_cid: this.$route.query.table_cid
					}
				}).then((res) => {
					this.preLoading = false;
					let result = res.data.message;
					if(result.errno) {
						return;
					}
					result = result.message;
					var goodsActive = result.goodsDetail;
					this.goodsActive = goodsActive;
					this.table_category = result.table_category;
					this.cart = result.cart.message.cart;
					this.store = result.store;
					this.replaceStore(result.store);
					this.replaceCart(result.cart.message.cart);
				})
			},
		},

		computed: {
			...mapState([
				'istore', 'icart',
			])
		},

		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#goods-detail .content{
		position: absolute;
		top: 46px;
		left: 0;
		right: 0;
		bottom: 50px;
		overflow-y: auto;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		color: #6d6d72;
		padding-bottom: 20px;
	}
	#goods-detail .content::-webkit-scrollbar{
		display: none;
	}
	#goods-detail .content .goods-img{
		margin: 15px;
	}
	#goods-detail .content .goods-img .van-swipe{
		width: 100%;
	}
	#goods-detail .content .goods-img img{
		max-width: 100%;
		max-height: 300px;
		display: block;
		margin: 0 auto;
	}
	#goods-detail .content .goods-name {
		padding: 10px 15px 0 15px;
		font-size: 18px;
		color: #333;
		line-height: 30px;
	}
	#goods-detail .content .sell-info{
		color: #ccc;
		font-size: 12px;
		padding: 0 15px;
		line-height: 20px;
	}
	#goods-detail .goods-num {
		padding: 15px 15px 0 15px;
		line-height: 25px;
		position: relative;
	}
	#goods-detail .goods-num .foodop{
		right: 15px;
		bottom: 0;
	}
	#goods-detail .goods-num .price{
		color: #ef1e15;
		font-size: 16px;
	}
	#goods-detail .goods-num .price .fee{
		font-size: 22px;
	}
	#goods-detail .goods-num .goods-unitnum{
		margin-left: 5px;
		padding: 0 5px;
		font-size: 12px;
		border: 1px solid #ef1e15;
	}
	#goods-detail .goods-num .operate-num .icon-plus {
		background: linear-gradient(to right,#FF930F,#FF5E4E);
		font-size: 16px;
		color: #fff;
		display: inline-block;
		height: 28px;
		width: 28px;
		line-height: 28px;
		text-align: center;
		border-radius: 100%;
	}
	#goods-detail .goods-num .operate-num .icon-minus {
		background: #fff;
		font-size: 16px;
		color: #ff2d4b;
		display: inline-block;
		height: 28px;
		width: 28px;
		line-height: 28px;
		text-align: center;
		border: 1px solid #ff2d4b;
		border-radius: 100%;
	}
	#goods-detail .goods-num .goods-detail-plus.no-sail {
		font-size: 10px;
		color: #888;
	}
	#goods-detail .goods-num .select-spec {
		display: inline-block;
		height: 28px;
		line-height: 28px!important;
		font-size: 12px;
		color: #fff;
		background: linear-gradient(to right,#FF930F,#FF5E4E);
		border-radius: 28px;
		padding: 0 8px;
	}
	#goods-detail .content .goods-evaluate,#goods-detail .content .goods-desc{
		margin: 12px 0;
		position: relative;
		text-align: center;
		color: #333;
	}
	#goods-detail .content .goods-evaluate:before,#goods-detail .content .goods-desc:before {
		left: 0;
		top: 50%;
		margin-top: -1px;
	}
	#goods-detail .content .goods-evaluate:after,#goods-detail .content .goods-desc:after {
		right: 0;
	}
	#goods-detail .content .goods-evaluate:before,#goods-detail .content .goods-desc:before,#goods-detail .content .goods-evaluate:after,#goods-detail .content .goods-desc:after {
		content: "";
		width: 30%;
		height: 1px;
		border-top: 1px solid #ddd;
		position: absolute;
		top: 50%;
		margin-top: -1px;
	}
	#goods-detail .content .praise{
		line-height: 25px;
	}
	#goods-detail .content .praise .rate {
		color: #ef1e15;
	}
	#goods-detail .content .praise .num {
		font-size: 12px;
		color: #ccc;
		margin-left: 10px;
	}
	#goods-detail .content .progress{
		padding: 10px 15px;
	}
	#goods-detail .content .progress .progress-bar{
		height: 20px;
		border-radius: 20px;
		background: #E6E6E6;
		position: relative;
		overflow: hidden;
	}
	#goods-detail .content .progress .progress-bar .progress-active {
		height: 100%;
		background: #ff2d4b;
	}
	#goods-detail .content .goods-desc-con {
		padding: 0 15px;
		font-size: 14px;
	}
	#goods-detail .content .tips{
		padding: 0 15px;
		line-height: 25px;
		font-size: 14px;
		margin-top: 10px;
	}
	/*进入店铺*/
	#goods-detail .into-store{
		position:fixed;
		right:10px;
		bottom:100px;
		width:50px;
		height:50px;
		border-radius:100px;
		background: rgba(0,0,0,0.4);
		color:#fff;
		font-size:13px;
		text-align:center;
		box-sizing:border-box;
		padding:10px;
		display:flex;
		align-items:center;
		line-height: 1.5;
	}
</style>


// WEBPACK FOOTER //
// src/pages/reserve/goodsDetail.vue