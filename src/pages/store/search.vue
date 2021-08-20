<template>
	<div id="goods-search">
		<public-header title="商品搜索"></public-header>
		<div class="content">
			<div class='search-header van-hairline--bottom'>
				<div class="search-content">
					<van-icon name="search"/>
					<input v-model="keyword" type="text" class="search-input" placeholder="请输入商品名称">
				</div>
				<div class="search-btn" @click="onSearch(true)">搜索</div>
			</div>
			<template v-if="records.page == 1">
				<div class='rmd-history' v-if="hotGoods && hotGoods.length > 0">
					<div class='search-rmd-wrap'>
						<div class='search-rmd-title '>
							<div class="van-hairline--bottom">热门搜索</div>
						</div>
						<div class='search-rmd'>
							<div v-for="(item, index) in hotGoods" @click="onSearch(true, item.title)" :key="'hot' + index">{{item.title}}</div>
						</div>
					</div>
				</div>
				<div class='rmd-history' v-if="searchHistory && searchHistory.length > 0">
					<div class='search-rmd-wrap'>
						<div class='search-rmd-title'>
							<div class="van-hairline--bottom">搜索历史</div>
							<div class='icon icon-delete' @click="onDelHistory"></div>
						</div>
						<div class='search-rmd'>
							<div v-for="(item, index) in searchHistory" @click="onSearch(true, item)" :key="'h' + index">{{item}}</div>
						</div>
					</div>
				</div>
			</template>
			<div class="goods-search-warp">
				<van-list
					v-model="records.loading"
					:finished="records.finished"
					@load="onSearch(false)"
					:offset="100"
					:immediate-check="false"
					v-if="!records.empty"
				>
					<div class="goods-list">
						<div class="goods-item van-hairline--bottom" v-for="goodsItem in records.data" :key="goodsItem.id">
							<div class="goods-thumb" @click="onDetail(goodsItem.id)">
								<img class="img-100" :src="goodsItem.thumb" alt="">
							</div>
							<div class="goods-info">
								<div class="w-100 ellipsis font-14 font-500" @click="onDetail(goodsItem.id)">{{goodsItem.title}}</div>
								<div class="c-gray flex font-12 margin-5-t" @click="onDetail(goodsItem.id)">
									<span>已售{{goodsItem.sailed}}</span>
									<span class="margin-15-l">赞{{goodsItem.comment_good}}</span>
								</div>
								<div class="svip-price-tips margin-5-t" v-if="goodsItem.svip_status == 1 && !goodsItem.discount_price">
									<div class="svip-price">
										<i class="icon icon-crownfill"></i>
										<span>{{goodsItem.discount}}折</span>
									</div>
									<div class="svip-activity">超级会员专享</div>
								</div>
								<div class="font-500 c-danger font-14 flex margin-5-t" @click="onDetail(goodsItem.id)">
									<span>¥{{goodsItem.price}}{{goodsItem.unitname_cn}}</span>
									<div class="flex margin-10-l" v-if="goodsItem.svip_status != 1 || goodsItem.discount_price > 0">
										<template v-if="goodsItem.discount">
											<van-icon name='tag'></van-icon>
											<span class="font-12">{{goodsItem.discount}}折 限{{goodsItem.max_buy_limit}}份 {{goodsItem.unitnum > 1 ? goodsItem.unitnum + '份起购' : ''}}</span>
										</template>
										<template v-else-if="goodsItem.unitnum > 1">
											<van-icon name='tag'></van-icon>
											<span class="font-12">{{goodsItem.unitnum}}份起购</span>
										</template>
									</div>
									<div class="flex margin-10-l" v-else-if="goodsItem.unitnum > 1">
										<van-icon name='tag'></van-icon>
										<span class="font-12">{{goodsItem.unitnum}}份起购</span>
									</div>
								</div>
								<div class="goods-operation">
									<goods-handle
										:goods="goodsItem"
										:optionId="0"
										from="detail"
									>
									</goods-handle>
								</div>
							</div>
						</div>
					</div>
				</van-list>
			</div>
			<div class="no-data" v-if="records.empty">
				<img src="static/img/order_no_con.png" alt="">
				<p>暂无相关商品，敬请期待</p>
			</div>
		</div>
		<!-- 购物车部分 -->
		<store-cart
			:show="!records.empty && records.page > 1"
			:store="store"
			:cart="cart"
			:pindan_id="pindan_id">
		</store-cart>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import GoodsHandle from '@/components/goodsHandle'
	import StoreCart from '@/components/storeCart'
	import {getData, getRecords} from "@/controller/funcCommon"
	import {mapState, mapMutations} from 'vuex'
	export default {
		data() {
			return {
				showPreLoading: true,
				records: {
					page: 1,
					psize: 10,
					loading: false,
					finished: false,
					empty: false,
					data:[]
				},
				cart: {
					num: 0,
				},
				store: {},
				hotGoods: [],
				keyword: '',
				searchHistory: [],
				activetabs: 0,
				showMoveDot: [],
			}
		},
		components: {
			PublicHeader,
			GoodsHandle,
			StoreCart

		},
		methods: {
			...mapMutations([
				'replaceStore', 'replaceCart'
			]),
			onSearch(force, keyword) {
				var that = this;
				that.records.loading = true;
				if(!keyword) {
					if(that.keyword) {
						var is_exist = that.searchHistory.indexOf(that.keyword);
						if(is_exist == -1) {
							that.searchHistory.push(that.keyword);
							that.util.setStorage('isearchHistory.goods.' + that.sid, that.searchHistory);
						}
					}

				} else {
					that.keyword = keyword;
				}
				if(!that.keyword) {
					that.util.$toast('请输入商品名称', '', 1000);
					return;
				}
				getRecords({
					vue: that,
					force: force,
					recordsName: 'goods',
					url: 'wmall/store/goods/search',
					data: {
						sid: that.sid,
						is_search: 1,
						keyword: that.keyword
					},
					success: function(res) {
						if(!that.records.empty) {
							that.store = res.store;
							that.cart = res.cart;
							that.replaceStore(res.store);
							that.replaceCart(res.cart.message.cart);
						}
					}
				})
			},
			onLoad() {
				var that = this;
				that.searchHistory = that.util.getStorage('isearchHistory.goods.' + that.istore.id);
				if(!that.searchHistory) {
					that.searchHistory = [];
				}
				getData({
					vue: that,
					url: 'wmall/store/goods/search',
					data: {
						sid: that.sid,
						is_search: 0
					},
					success: function(res) {
						that.hotGoods = res.hotGoods;
					}
				})
			},
			onDetail(goodsid) {
				this.$router.push(this.util.getUrl({path: 'pages/store/goodsDetail', query: {id: goodsid, sid: this.store.id, pindan_id: this.pindan_id}}));
			},
			onDelHistory() {
				this.$dialog.confirm({
					message: '确定清除历史记录吗'
				}).then((res) => {
					if (res == 'confirm') {
						this.util.removeStorage('isearchHistory.goods.' + this.sid);
						this.searchHistory = [];
					}
				})
			}
		},
		computed: {
			...mapState([
				'istore', 'icart'
			]),
		},
		created() {
			if(this.$route.query) {
				this.sid = this.$route.query.sid;
				this.pindan_id = 0;
				if(this.$route.query.pindan_id > 0) {
					this.pindan_id = this.$route.query.pindan_id;
				}
			}
		},
		mounted(){
			this.onLoad();
		}
	}
</script>

<style>
	#goods-search .content{
		bottom: 50px;
	}
	#goods-search .search-header{
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
	#goods-search .search-header .search-content{
		width: 90%;
		height: 100%;
		border-radius: 40px;
		position: relative;
	}
	#goods-search .search-header .search-content .van-icon{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 30px;
		line-height: 28px;
		text-align: center;
		font-size: 14px;
	}
	#goods-search .search-header .search-content .search-input{
		width: 100%;
		height: 100%;
		line-height: 28px;
		border-radius: 40px;
		padding-left: 25px;
		box-sizing: border-box;
		background: #f2f2f2;
		font-size: 14px;
	}
	#goods-search .search-header .search-btn{
		font-size: 14px;
		color: #FF2D4B;
	}
	#goods-search .rmd-history{
		margin-bottom: 10px;
		background-color: #f5f5f5;
	}
	#goods-search .rmd-history .search-rmd-title{
		position: relative;
		padding-left: 15px;
		font-size: 15px;
		line-height: 38px;
		color: #656565;
		background: #fff;
	}
	#goods-search .rmd-history .search-rmd-title .icon{
		position: absolute;
		top: 0;
		right: 15px;
	}
	#goods-search .rmd-history .search-rmd{
		padding: 10px;
		background: #fff;
		overflow: hidden;
	}
	#goods-search .rmd-history .search-rmd div{
		display: inline-block;
		float: left;
		max-width: 187px;
		min-width: 58px;
		height: 31px;
		line-height: 31px;
		margin: 5px;
		padding: 0 16px;
		-webkit-box-sizing: border-box;
		-mox-box-sizing: border-box;
		box-sizing: border-box;
		-webkit-border-radius: 2px;
		-moz-border-radius: 2px;
		border-radius: 2px;
		border: 1px solid #ccc;
		color: #2f2f2f;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: center;
		font-size: 14px;
	}
	#goods-search .goods-search-warp{
		background-color: #fff;
	}
	#goods-search .goods-search-warp .goods-list .goods-item{
		position: relative;
		padding: 10px 15px;
		display: flex;
		flex-flow: row nowrap;
		align-items: flex-start;
		justify-content: space-between;
	}
	#goods-search .goods-item .goods-thumb{
		width: 56px;
		height: 56px;
		font-size: 0px;
		border-radius: 3px;
		overflow: hidden;
	}
	#goods-search .goods-item .goods-info{
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
		position: relative;
		width: 80%;
	}
	#goods-search .goods-item .goods-operation{
		position: absolute;
		bottom: 0;
		right: 0;
		min-width: 100px;
	}
	#goods-search .goods-item .goods-operation .foodop{
		right: 0;
		bottom: 0;
	}
	#goods-search .goods-item .discount{
		position:relative;
		background: linear-gradient(to right, rgba(253,111,99,1) , rgba(253,111,99,0.5));
		color:#fff!important;
		padding-left:10px;
		font-size: 12px;
		height: 12px;
		width: 100px;
		line-height: 12px;
	}

	#goods-search .goods-item .goods-info .svip-price-tips{
		display: flex;
		align-items: center;
		line-height: 1;
	}
	#goods-search .goods-item .goods-info .svip-price-tips .svip-price{
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
	#goods-search .goods-item .goods-info .svip-price-tips .svip-price span{
		padding-left: 3px;
	}
	#goods-search .goods-item .goods-info .svip-price-tips .svip-price .icon-crownfill{
		font-size: 11px;
	}
	#goods-search .goods-item .goods-info .svip-price-tips .svip-activity{
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
// src/pages/store/search.vue