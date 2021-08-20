<template>
	<div id="searchResult">

		<public-header title="搜索结果"></public-header>
		<div class="content">
			<div class='search-header van-hairline--bottom'>
				<div class="search-content">
					<van-icon name="search"/>
					<input type="text" class="search-input" placeholder="请输入商家或商品名称" v-model="keyword">
				</div>
				<div class="search-btn" @click="onSearch">搜索</div>
			</div>
			<div class="diy-waimai-store-box" v-if="stores.length > 0">
				<div class="waimai-store-item-list">
					<div class="waimai-store-item border-1px-tb" v-for="(item, index) in stores" :key="index">
						<div class="mian-content-box">
							<div class="content-left border-1px">
								<router-link class="item-image" :to="util.getUrl({path: item.url})">
									<img :src="item.logo">
									<div class="store-label" v-if="item.label > 0">
										<div class="label" :style="{'background-color': item.label_color}">{{item.label_cn}}</div>
									</div>
								</router-link>
							</div>
							<div class="content-right">
								<router-link :to="util.getUrl({path: item.url})">
									<div class="item-name-wrap">
										<div class="item-name">{{item.title}}</div>
									</div>
									<div class="delivery-tip" v-if="item.rest_reserve_cn">{{item.rest_reserve_cn}}</div>
									<div class="item-score-time">
										<div class="item-score-sale">
											<div class="item-star-box">
												<van-rate v-model="item.score" :size="12" disabled-color="#ff2d4b" disabled />
											</div>
											<div class="item-sale">月售 {{item.sailed}}</div>
										</div>
										<div class="time-distance">
											<div class="avg_delivery_time">{{item.distance}}km</div>
											<div class="line">|</div>
											<div class="avg_distance">{{item.delivery_time}}分钟</div>
										</div>
									</div>
									<div class="item-min-delivery">
										<div class="item-min-delivery-left">
											<!-- <div>起送价￥{{item.send_price}}</div>
											<div class="line">|</div>
											<div>配送费￥{{item.delivery_price}}</div> -->
										</div>
										<div class="item-min-delivery-right">{{item.delivery_title}}</div>
									</div>
								</router-link>
								<div class="discount-box" v-if="item.activity && item.activity.num > 0" @click="onToggleDiscount(index)">
									<div class="toggle">
										<div class="icon " :class="{'icon-fold': item.activity.is_show_all, 'icon-unfold': !item.activity.is_show_all}" v-if="item.activity && item.activity.num > 2"></div>
									</div>
									<div class="single-line" v-for="(activityItem, activityIndex) in item.activity.items" v-if="activityIndex < 2 || (item.activity.is_show_all && activityIndex >= 2)" :key="activityIndex">
										<img class="discount-icon" :src="'static/img/' + activityItem.type + '_b.png'">
										<div class="discount-text">{{activityItem.title}}</div>
									</div>
								</div>
								<div class='goods-list' v-if="item.goods && item.goods.length > 0">
									<router-link tag="div" class='goods-item border-1px-t' :to="util.getUrl({path: '/pages/store/goodsDetail?sid=' + item.id + '&id=' + goodsItem.id})" v-for="(goodsItem,goodsIndex) in item.goods" :key="goodsIndex"
									v-if="goodsIndex < 1 || (item.goods_is_show_all && goodsIndex >= 1)">
										<div class='goods-name active flex-lr'>
											<span >{{goodsItem.title}}</span>
											<div class='goods-price'>¥{{goodsItem.price}}</div>
										</div>
										<div class='goods-sold'>月售 {{goodsItem.sailed}}</div>
									</router-link>
								</div>
							</div>
						</div>
						<div class='load-more border-1px-t' v-if="item.goods && item.goods.length > 1" @click="onToggleGoods(index)">
							<template v-if="!item.goods_is_show_all">展开其他{{item.goods_num}}个商品</template>
							<template v-else>收起</template>
							 <div class='icon' :class="{'icon-fold': item.goods_is_show_all, 'icon-unfold': !item.goods_is_show_all}"></div>
						</div>
					</div>
				</div>
			</div>
			<!-- 没有合适的商户 -->
			<div class='no-result'v-else>
				<div class='img'>
					<div class='icon icon-store'></div>
				</div>
				<div class='text'>抱歉,没有找到合适的商户</div>
			</div>
			<load type="loaded" text="猜你喜欢" bgcolor="#f5f5f5" v-if="recommendStores.length > 0"></load>
			<div class="diy-waimai-store-box" v-if="recommendStores.length > 0">
				<div class="waimai-store-item-list">
					<div class="waimai-store-item border-1px-tb" v-for="(item, index) in recommendStores" :key="index">
						<div class="mian-content-box">
							<div class="content-left border-1px">
								<router-link class="item-image" :to="util.getUrl({path: item.url})">
									<img :src="item.logo">
									<div class="store-label" v-if="item.label > 0">
										<div class="label" :style="{'background-color': item.label_color}">{{item.label_cn}}</div>
									</div>
								</router-link>
							</div>
							<div class="content-right">
								<router-link :to="util.getUrl({path: item.url})">
									<div class="item-name-wrap">
										<div class="item-name">{{item.title}}</div>
									</div>
									<div class="item-score-time">
										<div class="item-score-sale">
											<div class="item-star-box">
												<van-rate v-model="item.score" :size="12" disabled-color="#ff2d4b" disabled />
											</div>
											<div class="item-sale">月售 {{item.sailed}}</div>
										</div>
										<div class="time-distance">
											<div class="avg_delivery_time">{{item.distance}}km</div>
											<div class="line">|</div>
											<div class="avg_distance">{{item.delivery_time}}分钟</div>
										</div>
									</div>
									<div class="item-min-delivery">
										<div class="item-min-delivery-left">
											<!-- <div>起送价￥{{item.send_price}}</div>
											<div class="line">|</div>
											<div>配送费￥{{item.delivery_price}}</div> -->
										</div>
										<div class="item-min-delivery-right">{{item.delivery_title}}</div>
									</div>
								</router-link>
								<div class="discount-box" v-if="item.activity.num > 0">
									<div class="single-line" v-for="(activityItem, activityIndex) in item.activity.items" :key="activityIndex">
										<img class="discount-icon" :src="'static/img/' + activityItem.type + '_b.png'">
										<div class="discount-text">{{activityItem.title}}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<transition name="van-fade">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import load from '@/components/load'
	export default {
		data() {
			return {
				keyword: '',
				stores: [],
				recommendStores: [],
				activityHeight: false,
				showPreLoading: true
			}
		},
		components: {
			PublicHeader,
			load
		},
		methods: {
			onLoad() {
				if(this.showPreLoading == false) {
					this.$toast.loading({
						duration: 0,
						mask: true,
						forbidClick: true,
						loadingType: 'spinner',
					})
				}
				let key = this.$route.query.key ? this.$route.query.key : '';
				if(this.keyword) {
					key = this.keyword;
					this.stores = [];
					this.recommendStores = [];
				}
				let params = {
					key: key,
				};
				this.util.request({
					url: 'wmall/home/hunt/search',
					data: params
				}).then((res) => {

					this.showPreLoading = false;
					this.$toast.clear();
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message)
						return;
					}
					this.stores = [...this.stores, ...result.message.stores];
					this.recommendStores = [...this.recommendStores, ...result.message.recommendStores];
				})
			},
			onSearch() {
				if(!this.keyword) {
					return false;
				}
				this.onLoad();
			},
			onToggleDiscount(index) {
				this.stores[index].activity.is_show_all = !this.stores[index].activity.is_show_all;
			},
			onToggleGoods(index) {
				this.stores[index].goods_is_show_all = !this.stores[index].goods_is_show_all;
			}
		},
		mounted () {
			this.onLoad();
		},
	}
</script>

<style>
	@import "../../../static/css/diy.css";
	#searchResult .content{
		position: absolute;
		top: 46px;
		left: 0;
		right: 0px;
		bottom: 0px;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		overflow-y: auto;
		background-color: #f5f5f5;
		padding-bottom: 10px;
	}
	#searchResult .content::-webkit-scrollbar {
		display: none;
	}
	#searchResult .content::-webkit-scrollbar {
		width: 0px;
		height: 0px;
	}
	#searchResult .search-header{
		background-color: #fff;
		width: 100%;
		height: 50px;
		box-sizing: border-box;
		padding:10px;
		display:flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
	}
	#searchResult .search-header .search-content{
		width: 90%;
		height: 100%;
		border-radius: 40px;
		position: relative;
	}
	#searchResult .search-header .search-content .van-icon{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 30px;
		line-height: 28px;
		text-align: center;
		font-size: 14px;
	}
	#searchResult .search-header .search-content .search-input{
		width: 100%;
		height: 100%;
		line-height: 28px;
		border-radius: 40px;
		padding-left: 25px;
		box-sizing: border-box;
		background: #f2f2f2;
		font-size: 14px;
	}
	#searchResult .search-header .search-btn{
		font-size: 14px;
		color: #FF2D4B;
	}
	/* 没有合适的商户 */
	#searchResult .content .no-result{
		background-color: #fff;
		font-size: 14px;
		text-align: center;
		padding-top: 15px;
		padding-bottom: 10px;
		color: #656565;
		margin-bottom: 10px;
		line-height: 25px;
	}
	#searchResult .content .no-result .img .icon{
		font-size: 20px;
	}
	#searchResult .content .no-result .text{
		margin-top: 3px;
	}
	#searchResult .content .goods-list{
		margin-top: 5px;
		margin-right: 10px;
		line-height: 22px;
	}
	#searchResult .content .goods-list .goods-item{
		padding: 8px 0;
	}
	#searchResult .content .goods-list .goods-item .goods-name{
		position: relative;
		font-size: 16px;
		color: #656565;
	}
	#searchResult .content .goods-list .goods-item .goods-name.active{
		color: #ff2d4b;
	}
	#searchResult .content .goods-list .goods-item .goods-name span{
		display: inline-block;
		width: 70%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	#searchResult .content .goods-list .goods-item .goods-name .goods-price{
		display: inline-block;
		position: absolute;
		right: 0;
		top: 50%;
		transform: translate(0, -50%);
		font-size: 14px;
	}
	#searchResult .content .goods-list .goods-item .goods-sold{
		font-size: 12px;
		color: #656565;
	}
	#searchResult .content .load-more{
		text-align: center;
		padding-top: 8px;
		font-size: 14px;
	}
	#searchResult .content .load-more .icon{
		font-size: 12px;
	}
	#searchResult .waimai-store-item{
		margin-bottom: 10px;
		background-color: #fff;
	}
	#searchResult .waimai-store-item:last-child{
		margin-bottom: 0;
	}
	#searchResult .waimai-store-item-list{
		background-color: #f5f5f5;
	}
	#searchResult .content .discount-box{
		font-size: 11px;
		color: #898989;
		position: relative;
		margin-right: 10px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/home/searchResult.vue