<template>
	<div id="bargain">
		<public-header title="天天特价"></public-header>
		<template v-if="!showLoading">
			<div class="content">
				<div class="activity-banner">
					<router-link tag="div" to="">
						<img :src="config.thumb" class="top-img">
					</router-link>
				</div>
				<van-list v-model="bargains.loading" :finished="bargains.finished" @load="onLoad" :offset="100" :immediate-check="false" v-if="bargains.goods.length > 0">
					<div class="diy-waimai-food-list-onerow-box" v-if="config.template == 1">
						<div class="item-list">
							<div class="goods-item" v-for="(goodsitem, index) in bargains.goods" :key="index" :class="{'border-1px-t': index != 0}">
								<div class="row item-wrapper">
									<div class="col-40 goods-img">
										<img v-lazy="{src: goodsitem.thumb, loading: lazyload_goods}">
										<div class="discount" v-if="goodsitem.discount > 0 && goodsitem.discount < 10">{{goodsitem.discount}}折</div>
									</div>
									<div class="col-60">
										<div class="goods-name">{{goodsitem.title}}</div>
										<div class="sale-num">已售:{{goodsitem.sailed}} 库存:{{goodsitem.discount_available_total}}</div>
										<div class="store-name">
											<div class="icon icon-shop"></div> {{goodsitem.store_title}}
										</div>
										<div class="price-buybtn">
											<div class="price-wrap">
												<div class="in-b now-price">￥{{goodsitem.discount_price}}</div>
												<div class="in-b old-price">￥{{goodsitem.price}}</div>
											</div>
											<router-link class="in-b buy-btn" :to="util.getUrl({path: '/pages/store/goodsDetail', query:{sid: goodsitem.sid, id: goodsitem.goods_id}})" v-if="goodsitem.is_in_business == 1">立即抢购</router-link>
											<div class="in-b buy-btn disabled" v-else>休息中</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<!--双列商品组-->
					<div class="diy-waimai-goods-list-box" v-else>
						<div class="box-list">
							<div class="box-item" v-for="goodsitem in bargains.goods">
								<div class="main-content-box">
									<div class="goods-image">
										<img v-lazy="{src: goodsitem.thumb, loading: lazyload_goods}">
										<div class="discount" v-if="goodsitem.discount > 0 && goodsitem.discount < 10">{{goodsitem.discount}}折</div>
									</div>
									<div class="goods-name">{{goodsitem.title}}</div>
									<div class="discount-soldnum">
										<div class="in-b sold-num">已售{{goodsitem.sailed}}</div>
										<div class="in-b praise">库存{{goodsitem.discount_available_total}}</div>
									</div>
									<div class="store-name">
										<div class="icon icon-shop"></div> {{goodsitem.store_title}}
									</div>
									<div class="price-buybtn">
										<div class="in-b price">
											<div class="now-price">￥{{goodsitem.discount_price}}</div>
											<div class="old-price">￥{{goodsitem.price}}</div>
										</div>
										<router-link class="in-b buy-btn" :to="util.getUrl({path: '/pages/store/goodsDetail', query:{sid: goodsitem.sid, id: goodsitem.goods_id}})" v-if="goodsitem.is_in_business == 1">立刻购买</router-link>
										<div class="in-b buy-btn disabled" v-else>休息中</div>
									</div>
								</div>
							</div>
							<div style="clear:both"></div>
						</div>
					</div>
				</van-list>
				<load type="loaded" text="暂时没有特价商品" bgcolor="#f5f5f5" v-else></load>
				<div class="activity-rule" v-if="config.agreement">
					<p class="activity-rule-title font-bold text-center">活动规则</p>
					<div class="activity-rule-content" v-html="config.agreement"></div>
				</div>
			</div>
		</template>
		<transition name="loading">
			<iloading v-show="showLoading"></iloading>
		</transition>
	</div>
</template>
<script>
	import PublicHeader from '@/components/header'
	import load from '@/components/load'
	import loading from '@/components/loading'
	export default {
		data() {
			return {
				bargains: {
					page: 1,
					psize: 10,
					finished: false,
					loading: false,
					goods: [],
				},
				config: {},
				showLoading: true,
				lazyload_goods:'',
			}
		},
		components: {
			PublicHeader,
			load,
			loading
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'bargain/index',
					data: {
						page: this.bargains.page,
						psize: this.bargains.psize
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message)
						return;
					}
					this.config = result.message.config;
					this.lazyload_goods = this.config.lazyload_goods;
					this.bargains.goods = [...this.bargains.goods, ...result.message.bargains];
					this.hideLoading();
					this.bargains.page++;
					this.bargains.loading = false;
					if(result.message.bargains.length < this.bargains.psize) {
						this.bargains.finished = true;
						return false;
					}
				})
			},
			hideLoading(){
				this.showLoading = false;
			},
		},
		mounted () {
			this.onLoad();
		},
	}
</script>
<style>
	@import '../../../static/css/diy.css';
	#bargain .content{
		position: absolute;
		top: 46px;
		left: 0;
		right: 0px;
		bottom: 0px;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		overflow-y: auto;
	}
	#bargain .content::-webkit-scrollbar {
		width: 0px;
		height: 0px;
	}
	#bargain .content .activity-banner .top-img{
		width:100%;
		max-height: 250px;
		margin-bottom: -1px;
	}
	#bargain .diy-waimai-food-list-onerow-box,#bargain .diy-waimai-goods-list-box{
		padding-bottom: 0;
	}
	#bargain .loading-enter-active, .loading-leave-active {
		transition: opacity .7s
	}
	#bargain .loading-enter, .loading-leave-active {
		opacity: 0
	}
	#bargain .diy-waimai-food-list-onerow-box{
		padding: 0;
		margin: 10px 0 0 0;
	}
	#bargain .diy-waimai-goods-list-box{
		background-color: #fff;
	}
	#bargain .activity-rule{
		margin: 10px;
		background-color: #fff;
		padding: 5px 15px;
	}
	#bargain .activity-rule-title{
		padding: 10px 0;
	}
	#bargain .activity-rule-content{
		padding: 15px 0;
		line-height: 1.5;
		color: #3d4145;
	}
</style>


// WEBPACK FOOTER //
// src/pages/bargain/index.vue