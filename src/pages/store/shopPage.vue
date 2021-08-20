<template>
	<div id="shop-page">
		<public-header title="活动详情"></public-header>
		<div class="content">
			<div class="banner">
				<img :src="shopPageItem.thumb">
			</div>
			<div class="goods-list">
				<div class="col-50 goods-item van-hairline--right van-hairline--bottom" v-for="goodsItem in goods">
					<div class="goods-info">
						<router-link class="avatar" :to="util.getUrl({path: '/pages/store/goodsDetail', query: {id: goodsItem.id, sid: store.id, pindan_id: pindan_id}})">
							<div class="discount" v-if="(goodsItem.svip_status != 1 || goodsItem.discount_price > 0) && goodsItem.discount > 0">
								<div>
									<div class="icon icon-tag"></div> {{goodsItem.discount}}折 限{{goodsItem.max_buy_limit}}份
								</div>
							</div>
							<img :src="goodsItem.thumb">
						</router-link>
						<div class="goods-name">{{goodsItem.title}}</div>
						<div class="svip-price-tips" v-if="goodsItem.svip_status == 1 && !goodsItem.discount_price">
							<div class="svip-price">
								<span class="ellipsis">{{goodsItem.discount}}折</span>
							</div>
							<div class="svip-activity ellipsis">超级会员专享</div>
						</div>
						<div class="solid" v-else>
							已售{{goodsItem.sailed}} <div>赞{{goodsItem.comment_good}}</div>
						</div>
						<div class="price">
							¥<div>{{goodsItem.price}}</div>
						</div>
						<div class="old-price" v-if="goodsItem.old_price">￥{{goodsItem.old_price}}</div>
						<div class="goods-unitnum" v-if="goodsItem.unitnum > 1">
							<div>{{goodsItem.unitnum}}份起购</div>
						</div>
						<goods-handle
							:goods="goodsItem"
							:optionId="0"
							from="shopPageList">
						</goods-handle>
					</div>
				</div>
				<div style="clear:both"></div>
			</div>
		</div>
		<store-cart
			:show="1"
			:store="store"
			:cart="cart"
			:pindan_id="pindan_id">
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
				store: {
					is_rest: 0,
					data: {
						shopPage: {
						}
					}
				},
				status: {
					cart_show: true
				},
				shopPageItem: {},
				goods: [],
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
				if(!this.$route.query.sid || !this.$route.query.shopPageKey) {
					this.$toast('参数错误');
					return false;
				}
				this.sid = this.$route.query.sid;
				this.shopPageKey = this.$route.query.shopPageKey;
				this.util.request({
					url: 'wmall/store/goods/shopPage',
					data: {
						sid: this.sid,
						shopPageKey: this.shopPageKey,
					}
				}).then((res) => {
					this.preLoading = false;
					let result = res.data.message;
					if(result.errno) {
						return;
					}
					this.cart = result.message.cart.message.cart;
					this.replaceCart(this.cart);
					this.store = result.message.store;
					this.replaceStore(this.store);
					this.shopPageItem = result.message.store.data.shopPage[this.shopPageKey];
					this.goods = [...this.goods, ...result.message.goods];
				})
			}
		},

		computed: {
			...mapState([
				'istore', 'icart',
			])
		},
		created(){
			this.query = this.$route.query;
			if(this.query) {
				this.pindan_id = 0;
				if(this.query.pindan_id > 0) {
					this.pindan_id = this.query.pindan_id;
				}
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#shop-page .content{
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
	}
	#shop-page .content::-webkit-scrollbar{
		display: none;
	}
	#shop-page .content .foodop{
		right: 0;
		bottom: 0;
	}
	#shop-page .content  .banner{
		width: 100%;
		height: 120px;
	}
	#shop-page .content  .banner img{
		display: inline-block;
		width: 100%;
		height: 100%;
	}
	#shop-page .goods-list{
		background: #fff;
		padding-bottom: 20px;
	}
	#shop-page .goods-list .goods-item{
		padding: 20px;
		float: left;
		box-sizing: border-box;
		width: 50%;
		display: inline-block;
	}
	#shop-page .goods-list .goods-item .goods-info{
		position: relative;
	}
	#shop-page .goods-list .goods-item .avatar{
		display: inline-block;
		width: 100%;
		height: 120px;
		position: relative;
	}
	#shop-page .goods-list .goods-item .goods-info .discount{
		position:absolute;
		bottom:0;
		left:0;
		right:0;
		background: linear-gradient(to right, rgba(253,111,99,1) , rgba(253,111,99,0.1));
		color:#fff!important;
		padding-left:10px;
		font-size: 12px;
		height: 22px;
		line-height: 22px;
	}
	#shop-page .goods-list .goods-item .avatar img{
		display: inline-block;
		width: 100%;
		height: 100%;
	}
	#shop-page .goods-list .goods-item .goods-name{
		font-size: 16px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 5px;
		line-height: 25px;
	}
	#shop-page .goods-list .goods-item .description{
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #606060;
		height: 22px;
	}
	#shop-page .goods-list .goods-item .solid{
		font-size: 12px;
		color: #B8B8B8;
		line-height: 20px;
	}
	#shop-page .goods-list .goods-item .solid div{
		display: inline-block;
		margin-left: 5px;
	}
	#shop-page .goods-list .goods-item .price{
		color: #FA4F3F;
		font-size: 14px;
		margin-top: 5px;
		line-height: 20px;
		display: inline-block;
	}
	#shop-page .goods-list .goods-item .price div{
		display: inline-block;
		font-size: 20px;
		font-weight: bold;
		line-height: 20px;
	}
	#shop-page .goods-list .goods-item .old-price{
		display: inline-block;
		font-size: 12px;
		text-decoration: line-through;
		color: #8C8C8C;
		font-weight: normal;
	}
	#shop-page .goods-list .goods-item .goods-unitnum{
		display: inline-block;
		font-size: 12px;
		color: #f45044;
	}
	#shop-page .goods-list .goods-item .discount{
		font-size: 12px;
		color: #f45044;
		height: 22px;
	}
	#shop-page .goods-list .goods-item .svip-price-tips{
		display: flex;
		align-items: center;
		line-height: 1;
	}
	#shop-page .goods-list .goods-item .svip-price-tips .svip-price{
		display: flex;
		align-items: center;
		background-color: #302d22;
		padding: 1px 5px;
		border-top-left-radius: 2px;
		border-bottom-left-radius: 2px;
		color: #fff2bd;
		font-size: 11px;
		border: 1px solid #302d22;
		border-right: none;
	}
	#shop-page .goods-list .goods-item .goods-info .svip-price-tips{
		margin: 0px 0 4px;
	}
	#shop-page .goods-list .goods-item .goods-info .svip-price-tips .svip-price{
		padding: 1px 0px;
	}
	#shop-page .goods-list .goods-item .svip-price-tips .svip-price span{
		padding-left: 3px;
	}
	#shop-page .goods-list .goods-item .svip-price-tips .svip-price .icon-crownfill{
		font-size: 11px;
	}
	#shop-page .goods-list .goods-item .svip-price-tips .svip-activity{
		background-color: #fff2bd;
		color: #1c1a13;
		border: 1px solid #aca275;
		border-left: none;
		border-top-right-radius: 2px;
		border-bottom-right-radius: 2px;
		font-size: 11px;
		padding: 1px 0;
	}

</style>


// WEBPACK FOOTER //
// src/pages/store/shopPage.vue