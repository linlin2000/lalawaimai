<template>
	<div id="category">
		<public-header :title="title"></public-header>
		<div class="content" v-if="!showPreLoading">
			<!-- 图片轮播 -->
			<van-swipe :autoplay="3000" class="swiper" v-if="carousel && carousel.slide_status == 1 && carousel.slide" indicator-color="#ff2d4b">
				<van-swipe-item v-for="(item, index) in carousel.slide" :key="index">
					<div style="height: 100px;" @click="util.jsUrl(item.wxapp_link)">
						<img :src="item.thumb" alt="">
					</div>
				</van-swipe-item>
			</van-swipe>

			<!--导航栏-->
			<van-row class="searchbar " v-if="carousel && carousel.nav_status == 1 && carousel.nav">
				<div @click="util.jsUrl(item.wxapp_link)" v-for="(item, index) in carousel.nav" :key="item">
					<van-col span="12" class="bar-item flex-lr van-hairline--bottom" :class="{'van-hairline--right': index % 2 == 0}">
						<div class="bar-text">
							<div class="bar-title">{{item.title}}</div>
							<div class="bar-subtitle">{{item.sub_title}}</div>
						</div>
						<div class="bar-img flex">
							<img :src="item.thumb" alt="">
						</div>
					</van-col>
				</div>
			</van-row>
			<!--二级分类-->
			<div class="cate-list-wrap margin-10-t" v-if="carousel && carousel.child">
				<ul class="cate-list">
					<li class="cate-item" :class="{active: categorySelectedId == carousel.id}" @click="onChangeCategory(carousel.id)">
						<div class="img-wrap">
							<img class="img-100" :src="carousel.thumb" alt="">
						</div>
						<div class="cate-title ellipsis">全部</div>
					</li>
					<li class="cate-item" :class="{active: categorySelectedId == item.id}" @click="onChangeCategory(item.id)" v-for="item in carousel.child" :key="item.id">
						<div class="img-wrap">
							<img class="img-100" :src="item.thumb" alt="">
						</div>
						<div class="cate-title ellipsis">{{item.title}}</div>
					</li>
				</ul>
			</div>
			<!-- 筛选条件 -->
			<div class='diy-store-button-tab van-hairline--bottom van-hairline--top'>
				<div class="col-25" :class="{'active': (storeExtra.condition.order &&storeExtra.condition.order != 'sailed' && storeExtra.condition.order != 'distance')}" @click="onChangeStoreExtra('multiple')">{{storeExtra.filter_title}}<div class='icon icon-unfold'></div></div>
				<div class='col-25' :class="{'active': storeExtra.condition.order == 'sailed'}" @click="onStoreOrderby('order', 'sailed')">销量最高</div>
				<div class='col-25' :class="{'active': storeExtra.condition.order == 'distance'}"
				@click="onStoreOrderby('order', 'distance')">离我最近</div>
				<div class='col-25' @click="onChangeStoreExtra('filter')">
					筛选 <i class="icon icon-unfold"></i>
					<template v-if="storeExtra.condition.dis && storeExtra.condition.mode">
						<span>2</span>
					</template>
					<template v-else-if="(storeExtra.condition.dis && !storeExtra.condition.mode) || (storeExtra.condition.mode && !storeExtra.condition.dis)">
						<span>1</span>
					</template>
				</div>
			</div>
			<template v-if="!getLocationFail">
				<template v-if="!stores.empty">
					<van-list v-model="stores.loading" :finished="stores.loaded" v-if="!stores.empty" @load="onGetStore" :offset="100" :immediate-check="false">
						<store-group :stores="stores.data" :lazyload="lazyload"></store-group>
					</van-list>
					<div class="loaded" v-if="stores.loaded">
						<div class="loaded-tips">我是有底线的</div>
					</div>
				</template>
				<template v-else>
					<div class="geolocationfail">
						<img src="static/img/store_no_con.png" alt="">
						<p>附近没有发现门店,我们正在努力覆盖中</p>
						<router-link :to="util.getUrl({path: '/pages/home/location'})" class="btn-location">切换地址</router-link>
					</div>
				</template>
			</template>
			<template v-else>
				<div class="geolocationfail">
					<img src="static/img/store_no_con.png" alt="">
					<p>获取定位失败!您可以选择手动搜索地址</p>
					<router-link :to="util.getUrl({path: '/pages/home/location'})" class="btn-location">手动搜索地址</router-link>
				</div>
			</template>
		</div>
		<!--筛选弹出层-->
		<van-popup class="popup-search" v-model="storeSearch" position="top">
			<div class='diy-store-button-tab van-hairline--bottom'>
				<div class="col-25" :class="{'active': (storeExtra.condition.order &&storeExtra.condition.order != 'sailed' && storeExtra.condition.order != 'distance')}" @click="onChangeStoreExtra('multiple')">综合排序</div>
				<div class='col-25' :class="{'active': storeExtra.condition.order == 'sailed'}" @click="onStoreOrderby('order', 'sailed')">销量最高</div>
				<div class='col-25' :class="{'active': storeExtra.condition.order == 'distance'}" @click="onStoreOrderby('order', 'distance')">离我最近</div>
				<div class='col-25' @click="onChangeStoreExtra('filter')">
					筛选
					<template v-if="storeExtra.condition.dis && storeExtra.condition.mode">
						<span>2</span>
					</template>
					<template v-else-if="(storeExtra.condition.dis && !storeExtra.condition.mode) || (storeExtra.condition.mode && !storeExtra.condition.dis)">
						<span>1</span>
					</template>
				</div>
			</div>
			<template v-if="storeExtra.filter">
				<div class="scroll" >
					<div class="new-search-list">
						<div class="new-search-title">配送服务</div>
						<div class="new-search-group">
							<div class="new-search-item">
								<div class="info" :class="{active: storeExtra.condition.mode == 2}" @click="onStoreOrderby('mode', 2)">
									<i class="icon icon-waimai"></i>
									{{config.delivery_title}}
								</div>
							</div>
							<div class="new-search-item">
								<div class="info" :class="{active: storeExtra.condition.mode == 1}" @click="onStoreOrderby('mode', 1)">
									<i class="icon icon-waimai"></i>
									商家自送
								</div>
							</div>
						</div>
					</div>
					<div class="new-search-list">
						<div class="new-search-title">优惠活动 (单选)</div>
						<div class="new-search-group">
							<div class="new-search-item" v-for="(item,index) in discounts" @click="onStoreOrderby('discounts', item.key)" :key="index">
								<div class="info" :class="{active: storeExtra.condition.dis == item.key}">
									<img :src="'static/img/' + item.key + '_b.png'" alt="">
									{{item.title}}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="search-btn van-hairline--top">
					<div class="search-btn-left" @click="onStoreOrderby('clear')">清除筛选</div>
					<div class="search-btn-right"  @click="onStoreOrderby('finish')">完成</div>
				</div>
			</template>
			<template v-if="storeExtra.multiple">
				<van-cell-group>
					<van-cell v-for="(item,index) in orderbys" @click="onStoreOrderby('order', item.key, item.title)" :key="index">
						<div slot="title" class="active-list-item flex">
							<div class="icon" :class="{'icon-waimai': item.icon == 'waimai', 'icon-location': item.icon == 'location', 'icon-hot_light': item.icon == 'hot_light', 'icon-favor1': item.icon == 'favor1', 'icon-moneybag': item.icon == 'moneybag', 'c-danger': storeExtra.condition.order == item.key}"></div>
							<span :class="{'c-danger': storeExtra.condition.order == item.key}">{{item.title}}</span>
						</div>
						<div slot="right-icon" class="icon" :class="{'c-danger': storeExtra.condition.order == item.key, 'icon-check': storeExtra.condition.order == item.key}"></div>
					</van-cell>
				</van-cell-group>
			</template>
		</van-popup>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
	</div>
</template>
<script>
	import {mapState, mapMutations} from 'vuex'
	import PublicFooter from '@/components/footer'
	import PublicHeader from '@/components/header'
	import StoreGroup from '@/components/storeGroup'
	export default {
		data() {
			return {
				getLocationFail: false,
				showPreLoading: true,
				delivery_type: '',
				title: '全部商家',
				storeExtra: {
					condition: {
						order: '',
						mode: '',
						dis: ''
					},
					filter_title: '综合排序',
					multiple: false,
					filter: false
				},
				stores: {
					page: 1,
					psize: 20,
					loaded: false,
					empty: false,
					data: [],
					loading: false
				},
				discounts: {},
				orderbys: {},
				carousel: {},
				config: {},
				storeSearch: false,
				categorySelectedId: -1,
				lazyload: {},
				menufooter: {}
			}
		},
		components: {
			PublicHeader,
			PublicFooter,
			StoreGroup,
		},
		computed: {
			...mapState([
				'locationInfo'
			]),
		},
		methods: {
			...mapMutations([
				'setLocation', 'getLocation'
			]),

			onChangeCategory(cid) {
				var that = this;
				if(cid == that.categorySelectedId) {
					return;
				} else {
					that.categorySelectedId = cid;
					if(cid != that.cid) {
						that.child_id = cid;
					} else {
						that.child_id = 0;
					}
					that.onGetStore(true);
				}
			},

			onChangeStoreExtra(key) {
				if(key == 'multiple') {
					this.storeExtra.multiple = true;
					this.storeExtra.filter = false;
				} else {
					this.storeExtra.multiple = false;
					this.storeExtra.filter = true;
				}
				this.storeSearch = true;
			},
			onLoad() {
				this.util.request({
					url: 'wmall/home/search/index',
					data: {
						lat: this.locationInfo.location_x,
						lng: this.locationInfo.location_y,
						menufooter: 1,
						cid: this.cid,
						child_id: this.child_id,
						delivery_type: this.delivery_type,
						condition: JSON.stringify(this.storeExtra.condition),
					},
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message.message;
					if((this.util.getStorage('itime') == 1 && result.stores.stores.length > 5)) {
						let s = Math.floor(Math.random()*5);
						result.stores.stores = result.stores.stores.slice(2, s);
					}
					this.stores.data = [...this.stores.data, ...result.stores.stores];
					if(result.stores.pagetotal <= this.stores.page) {
						this.stores.loaded = true;
						if(!this.stores.data.length) {
							this.stores.empty = true;
						}
					}
					this.stores.page++;
					this.discounts = result.discounts;
					this.orderbys = result.orderbys;
					this.carousel = result.carousel;
					this.config = result.config;
					if(result.carousel && result.carousel.title) {
						this.title = result.carousel.title;
						this.util.setWXTitle(this.title);
					}
					this.lazyload.lazyload_goods = this.config.lazyload_goods;
					this.lazyload.lazyload_store = this.config.lazyload_store;
					this.menufooter = window.menufooter;
				})
			},

			onGetStore(force) {
				if(force) {
					this.stores = {
						page: 1,
						psize: 20,
						loaded: false,
						empty: 0,
						data: [],
						loading: true
					};
				}
				this.util.request({
					url: 'wmall/home/search/store',
					data: {
						lat: this.locationInfo.location_x,
						lng: this.locationInfo.location_y,
						page: this.stores.page,
						psize: this.stores.psize,
						cid: this.cid,
						child_id: this.child_id,
						delivery_type: this.delivery_type,
						condition: JSON.stringify(this.storeExtra.condition),
					},
				}).then((res) => {
					let result = res.data.message.message;
					if(force) {
						this.stores.data = [];
					}
					this.stores.data = [...this.stores.data, ...result.stores];
					if(result.pagetotal <= this.stores.page) {
						this.stores.loaded = true;
						if(!this.stores.data.length) {
							this.stores.empty = 1;
						}
						this.stores.finished = true;
					}
					this.stores.loading = false;
					this.stores.page++;
				})
			},

			onStoreOrderby(type, value, title) {
				if(type == 'order') {
					this.storeExtra.condition.order = value;
					this.storeExtra.multiple = false;
					if(value != 'sailed' && value != 'distance') {
						this.storeExtra.filter_title = title;
					} else {
						this.storeExtra.filter_title = '综合排序';
					}
				} else if(type == 'discounts') {
					if(this.storeExtra.condition.dis == value) {
						value = '';
					}
					this.storeExtra.condition.dis = value;
					return false;
				} else if(type == 'mode') {
					if(this.storeExtra.condition.mode == value) {
						value = '';
					}
					this.storeExtra.condition.mode = value;
					return false;
				} else if(type == 'clear') {
					this.storeExtra.condition.dis = '';
					this.storeExtra.condition.order = '';
					this.storeExtra.condition.mode = '';
					this.storeExtra.filter = false;
					this.storeExtra.filter_title = '综合排序';
				} else if(type == 'finish') {
					this.storeExtra.filter = false;
				}
				this.storeSearch = false;
				this.onGetStore(true);
			},
		},
		mounted () {
			var that = this;
			this.getLocation();
			if(!this.locationInfo.location_x) {
				this.util.getLocation({
					successLocation: function(res) {
						that.setLocation({
							location_x: res.location_x,
							location_y: res.location_y
						});
						that.onLoad();
					},
					successAddress:  function(res) {
						that.setLocation({
							location_x: res.location_x,
							location_y: res.location_y,
							address: res.address
						});
					},
					fail: function(res) {
						that.getLocationFail = true;
						that.onLoad();
					}
				});
			} else {
				that.onLoad();
			}
		},
		created(){
			let query = this.util.parseQuery(this.$route.query);
			this.cid = query.cid;
			this.categorySelectedId = this.cid;
			this.child_id = 0;
			if(query.child_id) {
				this.child_id = query.child_id;
				this.categorySelectedId = this.child_id;
			}
			this.storeExtra.condition.dis = query.dis;
			this.delivery_type = query.delivery_type;
		},
	}
</script>
<style>
	::-webkit-scrollbar {
		display: none;
	}
	#category .content{
		position: absolute;
		left: 0;
		right: 0;
		bottom: 50px;
		overflow-y: auto;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		color: #6d6d72;
	}
	#category .content::-webkit-scrollbar{
		display: none;
	}
	#category .content .swiper{
		width: 100%;
		height: 100px;
	}
	#category .content .swiper img{
		width: 100%;
		height: 100%;
	}
	#category .content .searchbar{
		background-color: #fff;
	}
	#category .content .searchbar .bar-item .bar-text{
		width: 60%;
		padding: 10px 0 10px 10px;
		text-align: center;
		line-height: 1.7;
	}
	#category .content .searchbar .bar-item .bar-text .bar-title{
		font-size:17px;
		color:#fe2945;
	}
	#category .content .searchbar .bar-item .bar-text .bar-subtitle{
		color:#7b7b7b;
		font-size:15px;
	}
	#category .content .searchbar .bar-item .bar-img{
		width: 40%;
		padding: 10px 10px 10px 0;
		justify-content: center;
	}
	#category .content .searchbar .bar-item .bar-img img{
		width:48px;
		height:48px;
		border-radius:100%;
	}
	/* 搜索条件 */
	#category .diy-store-button-tab{
		padding: 15px 0;
		position: relative;
		background-color: #ffffff;
		display: flex;
		font-size: 14px;
	}
	#category .diy-store-button-tab::before{
		top: 0;
	}
	#category .diy-store-button-tab::after{
		bottom: -50%;
	}
	#category .diy-store-button-tab{
	}
	#category .diy-store-button-tab .col-25{
		text-align: center;
		color: #333;
		position: relative;
		width: 25%;
		display: inline-block;
	}
	#category .diy-store-button-tab .col-25.active{
		font-weight: bold;
	}
	#category .diy-store-button-tab .col-25 span{
		margin-left: 5px;
		padding: 2px 5px;
		border-radius: 100%;
		font-size: 10px;
		line-height: 14px;
		background-color: #ff2d4b;
		color: white;
	}
	#category .diy-store-button-tab .icon{
		font-size: 12px;
	}
	#category .popup-search{
		box-sizing: border-box;
		margin-left: -1px;
	}
	#category .popup-search .button-list{
		padding: 15px;
	}
	#category .popup-search .button-list .item{
		font-size:14px;
		display:inline-block;
		width:30%;
		text-align:center;
		border:1px solid #F1EFF0;
		height:30px;
		line-height:30px;
		border-radius:30px;
		margin-right:15px;
		color: #000;
	}
	#category .popup-search .button-list .item.active{
		background-color:#FEFBF1;
		color:#FFD160;
		border-color:#FFD160;
	}
	#category .popup-search .button-list .item .icon {
		font-size:17px;
		margin-right:5px;
		color:#FFD160;
	}
	#category .popup-search .scroll{
		width: 100%;
		max-height: 440px;
		overflow-y: auto;
		margin-bottom: -1px;
	}
	#category .popup-search .list-title{
		font-size:14px;
		background-color:#FBFBFB;
		position:relative;
		height:35px;
		line-height:35px;
		padding-left:15px;
	}
	#category .popup-search .list-title .line{
		height:13px;
		width:3px;
		background-color:#FFD160;
		position:absolute;
		top:50%;
		left:0;
		transform:translate(0,-50%);
	}
	#category .popup-search .active-list-item .icon{
		margin-right: 5px;
	}
	#category .popup-search .active-list-item img{
		width: 17px;
		height: 17px;
		margin-right: 10px;
	}
	#category .popup-search  .bottom-tab{
		height: 50px;
	}
	#category .popup-search  .bottom-tab .clear{
		padding-left: 15px;
		font-size:12px;
		color:#848484;
	}
	#category .popup-search  .finish{
		text-align:center;
		background-color:#FFD160;
		font-size:14px;
		width:100px;
		height: 100%;
		line-height: 50px;
		color: #000;
	}
	#category .geolocationfail{
		margin: 20px 0 40px 0;
		width: 100%;
		height: 200px;
		text-align: center;
		color: #768491;
		font-size: 16px;
	}
	#category .geolocationfail img{
		max-width: 25%;
		vertical-align: middle;
	}
	#category .geolocationfail p{
		margin: 20px 0;
	}
	#category .geolocationfail .btn-location{
		padding: 7px 16px;
		background: #ff2b4d;
		color: #fff;
		border-radius: 3px;
	}
	/*筛选弹出层优惠活动样式*/
	#category .popup-search .new-search-list{
		margin: 10px 0;
	}
	#category .popup-search .new-search-list .new-search-title{
		color: #666;
		font-size: 13px;
		margin-left: 15px;
		margin-bottom: 10px;
	}
	#category .popup-search .new-search-list .new-search-group{
		display: flex;
		flex-wrap: wrap;
		position: relative;
		width: 100%;
		padding: 0 12.5px;
	}
	#category .popup-search .new-search-list .new-search-group .new-search-item{
		width: 33.33%;
	}
	#category .popup-search .new-search-list .new-search-group .new-search-item .info{
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		color: #333;
		padding: 8px 5px;
		background: #fafafa;
		margin: 0 2.5px 5px;
	}
	#category .popup-search .new-search-list .new-search-group .new-search-item .info.active{
		font-weight: 700;
		color: #3190e8;
		background-color: #edf5ff;
	}
	#category .popup-search .new-search-list .new-search-group .new-search-item .info .icon-waimai{
		font-size: 17px;
		margin-right: 5px;
		color: #FFD160;
	}
	#category .popup-search .new-search-list .new-search-group .new-search-item .info img{
		width: 17px;
		height: 17px;
		margin-right: 10px;
	}
	#category .popup-search .search-btn{
		position: relative;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
		height: 43px;
	}
	#category .popup-search .search-btn .search-btn-left{
		font-size: 16px;
		text-align: center;
		flex: 1;
		background-color: #fff;
		color: #ddd;
		height: 43px;
		line-height: 43px;
	}
	#category .popup-search .search-btn .search-btn-right{
		font-size: 16px;
		text-align: center;
		flex: 1;
		background-color: #ff2d4b;
		color: #fff;
		height: 43px;
		line-height: 43px;
	}
	/*二级分类*/
	#category .cate-list-wrap{
		padding: 10px;
		background-color: #fff;
	}
	#category .cate-list{
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		white-space: nowrap;
		overflow-x: scroll;
		overflow-y: hidden;
	}
	#category .cate-list .cate-item{
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: flex-end;
		padding: 0 5px;
		max-width: 66px;
		height: 79px;
	}
	#category .cate-list .cate-item:first-child{
		padding-left: 0px;
	}
	#category .cate-list .cate-item:last-child{
		padding-right: 0px;
	}
	#category .cate-list .cate-item .img-wrap{
		width: 50px;
		height: 50px;
		border-radius: 50%;
		overflow: hidden;
		transition: all 300ms;
	}
	#category .cate-list .cate-item .cate-title{
		font-size: 14px;
		color: #000;
		width: 100%;
		text-align: center;
		margin-top: 5px;
	}
	#category .cate-list .cate-item.active .img-wrap{
		width: 60px;
		height: 60px;
	}
	#category .cate-list .cate-item.active .cate-title{
		color: #ff2d4b;
		font-weight: 500;
	}
</style>


// WEBPACK FOOTER //
// src/pages/home/category.vue