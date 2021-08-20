<template>
	<div id="paotui-guide">
		<public-header :title="title" v-if="!isWeixin"></public-header>
		<template v-if="home_setting == 'index' || !home_setting">
			<public-footer :preLoading="showPreLoading" :menufooter="menufooter" :failedTips="failedTips" :showFailedTips="!getLocationStatus"></public-footer>
			<div class="content">
				<div class="map-content">
					<div id="map-container"></div>
				</div>
				<van-swipe class="order-swiper" :autoplay="3000" vertical :show-indicators="false" v-if="orders.length > 0">
					<van-swipe-item v-for="(order, index) in orders" :key="index" >
						<router-link tag="div" :to="util.getUrl({path: '/pages/paotui/diy?id=' + order.order_cid})" class="swiper-item flex-lr">
							<div class="left flex-lr">
								<img :src="order.thumb" alt="">
								<p class="ellipsis">{{order.anonymous_username}}购买了{{order.goods_name}}</p>
							</div>
							<span class="icon icon-right"></span>
						</router-link>
					</van-swipe-item>
				</van-swipe>
				<div class="cate">
					<p class="cate-title">
						平台共有 <span class="c-danger">{{delivery_num}}</span> 位骑士为您服务
					</p>
					<van-row class="cate-list">
						<van-col span="6" v-for="(item, index) in categorys" :key="index">
							<router-link tag="div" :to="util.getUrl({path: '/pages/paotui/diy?id=' + item.id})"  class="cate-item">
								<img :src="item.thumb" alt="">
								<p class="ellipsis">{{item.name}}</p>
							</router-link>
						</van-col>
					</van-row>
				</div>
			</div>
		</template>
		<template v-for="(homeitem, index) in home.items" v-else-if="home_setting == 'diy'">
			<public-footer :preLoading="showPreLoading" :menufooter="menufooter" :failedTips="failedTips" :showFailedTips="!getLocationStatus"></public-footer>
			<div class="content" :style="{background: homeitem.style.background}">
				<van-swipe :autoplay="3000" class="swiper" indicator-color="#ff2d4b">
					<van-swipe-item v-for="(item, index) in homeitem.picture" :key="index">
						<div @click="util.jsUrl(item.linkurl)" class="img-box">
							<img :src="item.imgurl" alt="">
						</div>
					</van-swipe-item>
				</van-swipe>
				<div class="rider-nearby flex" :style="{color: homeitem.rider.color}">
					<img src="static/img/paotui_rider.png" alt="">
					<span>{{homeitem.rider.text.left}}</span>
					<span class="num" :style="{color: homeitem.rider.num_color}">{{homeitem.rider.text.num}}</span>
					<span>{{homeitem.rider.text.right}}</span>
				</div>
				<div class="goods-edit">
					<div class="goods-input">
						<div class="goods-input-placeholder" v-if="!inputStatus && !note" @click="onChangeInputStatus()">
							<img src="static/img/edit_icon.png" alt="">
							{{homeitem.params.placeholder}}
						</div>
						<div class="goods-input-content flex-lr" v-else>
							<van-field
									v-model="note"
									type="textarea"
									:placeholder="homeitem.params.placeholder"
									class="border-0px"
							/>
							<div class="good-input-submit" @click="onSubmit(homeitem.params.submiturl)">
								<img src="static/img/goods_submit.png" alt="">
							</div>
						</div>
					</div>
					<van-row class="goods-tags" gutter="5">
						<van-col span="6" v-for="(item, index) in homeitem.lanmu" :key="index" >
							<div class="tag-item ellipsis" :style="{color: item.color, 'background-color': item.background_color}" @click="onSubmit(item.linkurl)">
								{{item.text}}
								<div class="tag-item-hot" v-if="item.is_hot == 1">
									<img src="static/img/goods_hot.png" alt="">
								</div>
							</div>
						</van-col>
					</van-row>
				</div>
				<div class="paotui-feature">
					<div class="feature-title">
						跑腿特色
					</div>
					<div class="feature-list">
						<div class="feature-item" v-for="(item, index) in homeitem.feature" :key="index" @click="util.jsUrl(item.linkurl)">
							<div class="feature-item-icon" :style="{'border-color': item.icon_color}">
								<span class="icon" :class="item.icon" :style="{color: item.icon_color}"></span>
							</div>
							<div class="feature-item-text font-13" :style="{color: item.color}">{{item.text}}</div>
						</div>
					</div>
				</div>
			</div>
			<router-link tag="div" :to="util.getUrl({path: '/pages/paotui/order'})" class="paotui-order" :style="{'border-color': homeitem.order.border_color, color: homeitem.order.color}">
				<div class="icon" :class="homeitem.order.icon"></div>
				<span class="font-12">{{homeitem.order.text}}</span>
			</router-link>
		</template>
	</div>
</template>

<script>
	import {Amap} from '@/config/AMap'
	import {mapState, mapMutations} from 'vuex'
	import PublicHeader from "@/components/header"
	import PublicFooter from "@/components/footer"
	export default {
		name: "paotuiGuide",
		components: {
			PublicHeader,
			PublicFooter,
		},
		data() {
			return {
				home_setting: '',
				showPreLoading: true,
				menufooter: {},
				//自定义首页数据
				note: '',
				inputStatus: false,
				title: '跑腿',
				homepage: {},
				home: {},
				//默认首页数据
				categorys: [],
				orders: [],
				delivery_num: 0,
				config: {},
				deliveryers: [],
				getLocationStatus: true,
				failedTips: {
					type: 'location',
					tips: '获取定位失败!您可以选择手动搜索地址',
					btnText: '手动搜索地址',
					link: '/pages/home/location'
				}
			}
		},
		computed: {
			...mapState([
				'erranderExtra',
			]),
		},
		methods: {
			...mapMutations([
				'setState' 
			]),
			onLoad() {
				this.util.request({
					url: 'errander/guide/index',
					data: {
						forceLocation: 1,
						menufooter: 1
					},
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno  == -1) {
						this.util.$toast(result.message, '', 1000);
						return false;
					} else if(result.errno  == -2) {
						this.getLocationStatus = false;
						this.failedTips.tips = result.message;
						return false;
					}
					result = result.message;
					this.home_setting = result.home_setting;
					if(!this.home_setting || this.home_setting == 'index') {
						this.categorys = [...result.categorys];
						this.orders = [...result.orders];
						this.delivery_num = result.delivery_num;
						this.config = result.config;
						this.deliveryers = result.deliveryers;
						this.menufooter = window.menufooter;
						this.loadmap();
					} else if(this.home_setting == 'diy') {
						this.homepage = result.homepage;
						this.home = this.homepage.data;
						if(this.home && this.home.page && this.home.page.title) {
							this.title = this.home.page.title;
							this.util.setWXTitle(this.title);
						}
					}
					this.menufooter = window.menufooter;
				}).catch((res) => {
					if(window.forceGetLocationStatus == 'fail') {
						this.showPreLoading = false;
						this.getLocationStatus = false;
					}
				})
			},
			onChangeInputStatus() {
				this.inputStatus = true;
			},
			onSubmit(url) {
				this.setState({type: 'erranderExtra', key: 'note', val: this.note});
				this.util.jsUrl(url);
			},
			loadmap(){
				Amap().then((AMap) => {
					var map = new AMap.Map('map-container', {
						resizeEnable: true,
						zoom: 11,
						center: [this.config.map.location_y, this.config.map.location_x],
					});
					for(var i in this.deliveryers) {
						var deliveryer = this.deliveryers[i];
						if(deliveryer.location_x && deliveryer.location_y) {
							var marker = new AMap.Marker({
								position: [deliveryer.location_y, deliveryer.location_x],
								offset: new AMap.Pixel(-26, -80),
								content: '<div class="map-center"><img src="' + deliveryer.avatar + '"alt=""></div>'
							});
							marker.setMap(map);
						}
					}
					map.setFitView();
				})
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	/*默认首页样式*/
	#paotui-guide .map-content{
		width: 100%;
		height: 100%;
		position: relative;
	}
	#paotui-guide .map-content #map-container{
		width: 100%;
		height: 100%;
	}
	#paotui-guide .map-content .map-center{
		position: relative;
		width: 52px;
		height: 80px;
		background: url(../../../static/img/map-location.png) no-repeat 0 0;
		cursor: pointer;
	}
	#paotui-guide .map-content .map-center img{
		position: absolute;
		top: 5px;
		right: 5px;
		width: 42px;
		height: 42px;
		border-radius: 100%;
	}
	#paotui-guide .order-swiper{
		position: absolute;
		top: 10px;
		left: 15px;
		right: 15px;
		z-index: 10;
		background: rgba(0,0,0,.6);
		border-radius: 60px;
		height: 40px;
		line-height: 40px;
		overflow: hidden;
		color: #fff;
		font-size: 14px;
		box-sizing: border-box;
	}
	#paotui-guide .order-swiper .swiper-item{
		padding: 0 10px;
		width: 100%;
		height: 100%;
	}
	#paotui-guide .order-swiper .swiper-item .left{
		width: 92%;
	}
	#paotui-guide .order-swiper .swiper-item .left p{
		width: 87%;
	}
	#paotui-guide .order-swiper .swiper-item img{
		width: 30px;
		height: 30px;
	}
	#paotui-guide .cate{
		position: absolute;
		bottom: 10px;
		left: 10px;
		right: 10px;
		background: rgba(255,255,255,.9);
		border-radius: 5px;
		font-size: 12px;
		z-index: 10;
	}
	#paotui-guide .cate .cate-title{
		margin: 10px 0;
		text-align: center;
	}
	#paotui-guide .cate .cate-item{
		width: 100%;
		color: #333;
		text-align: center;
		margin-bottom: 10px;
	}
	#paotui-guide .cate .cate-item p{
		width: 100%;
		padding: 0 5px;
		margin-top: 5px;
	}
	#paotui-guide .cate .cate-item img{
		width: 45px;
		height: 45px;
	}
	/*自定义页面样式*/
	#paotui-guide .content{
		background: -moz-linear-gradient(top, #f5f5f5 0%, #ffffff 100%);
		background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#f5f5f5), color-stop(100%,#ffffff));
		background: -webkit-linear-gradient(top, #f5f5f5 0%,#ffffff 100%);
		background: -o-linear-gradient(top, #f5f5f5 0%,#ffffff 100%);
		background: -ms-linear-gradient(top, #f5f5f5 0%,#ffffff 100%);
		background: linear-gradient(to bottom, #f5f5f5 0%,#ffffff 100%);
	}
	#paotui-guide .content .swiper{
		width: 100%;
		height: 230px;
	}
	#paotui-guide .content .swiper .img-box{
		width: 100%;
		height: 100%;
	}
	#paotui-guide .content .swiper img{
		width: 100%;
		height: 100%;
	}
	#paotui-guide .content .rider-nearby{
		position: absolute;
		z-index: 100;
		top: 115px;
		left: 50%;
		transform:translate3d(-50%,0,0);
		width:150px;
		height:25px;
		background-color:#623c15;
		border-radius:55px;
		line-height:18px;
		white-space:nowrap;
		padding:0 11px;
		color:#fff;
		font-size:13px;
		text-align: center;
	}
	#paotui-guide .content .rider-nearby img{
		width: 20px;
		height: 17px;
		margin-right: 5px;
	}
	#paotui-guide .content .rider-nearby .num{
		padding: 0 5px;
		color: #f6ce00;
	}
	#paotui-guide .content .goods-edit{
		position:absolute;
		top: 147px;
		left:50%;
		transform:translate3d(-50%,0,0);
		width:93%;
		min-height:230px;
		background:#fff;
		box-shadow:0 0 56px 0 rgba(0,0,0,.14);
		padding:17px 10px 4px;
		z-index:100;
	}
	#paotui-guide .content .goods-edit .goods-input{
		position:relative;
		padding:0 6px;
		height: 100px;
	}
	#paotui-guide .content .goods-edit .goods-input .goods-input-placeholder{
		width:100%;
		height: 100%;
		line-height:1;
		color:#999;
		font-size:18px;
		display: flex;
		align-items:flex-start;
		line-height: 1.5;
	}
	#paotui-guide .content .goods-edit .goods-input .goods-input-placeholder img{
		width:16px;
		height:18px;
		margin-right:7px;
		margin-top: 5px;
	}
	#paotui-guide .content .goods-edit .goods-input .goods-input-content{
		height: 100%;
	}
	#paotui-guide .content .goods-edit .goods-input .goods-input-content .van-cell{
		width: 75%;
		height: 100%;
		padding: 0;
		font-size: 18px;
	}
	#paotui-guide .content .goods-edit .goods-input .goods-input-content .van-cell .van-field__body{
		width: 100%;
		height: 100%;
	}
	#paotui-guide .content .goods-edit .goods-input .goods-input-content .van-cell .van-field__body textarea{
		width: 100%;
		height: 100%;
	}
	#paotui-guide .content .goods-edit .goods-input .goods-input-content .good-input-submit{
		width: 25%;
		height: 100%;
	}
	#paotui-guide .content .goods-edit .goods-input .goods-input-content .good-input-submit img{
		width: 73px;
		height: 73px;
		display: block;
		margin: 20px auto 0;
	}
	#paotui-guide .content .goods-edit .goods-tags{
		margin-top: 11px;
	}
	#paotui-guide .content .goods-edit .goods-tags .tag-item{
		position: relative;
		display: inline-block;
		width:100%;
		box-sizing:border-box;
		padding:0 6px;
		height:44px;
		line-height:44px;
		margin-bottom: 5px;
		background: #fef7df;
		font-size: 15px;
		color: #83490d;
		text-align: center;
	}
	#paotui-guide .content .goods-edit .goods-tags .tag-item .tag-item-hot{
		position: absolute;
		left: 0;
		top: 0;
		width:43px;
		height:25px;
	}
	#paotui-guide .content .goods-edit .goods-tags .tag-item .tag-item-hot img{
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
	}
	#paotui-guide .content .paotui-feature{
		padding: 20px 0;
		margin-top: 220px;
	}
	#paotui-guide .content .paotui-feature .feature-title{
		text-align:center;
		font-size:15px;
		font-weight:700;
		color:#666;
		margin-bottom:19px;
	}
	#paotui-guide .content .paotui-feature .feature-list{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#paotui-guide .content .paotui-feature .feature-list .feature-item{
		margin-right: 64px;
		display:flex;
		flex-direction:column;
		align-items:center;
	}
	#paotui-guide .content .paotui-feature .feature-list .feature-item:last-child{
		margin-right: 0;
	}
	#paotui-guide .content .paotui-feature .feature-list .feature-item .feature-item-icon{
		width: 45px;
		height: 45px;
		border-radius: 50%;
		line-height: 45px;
		text-align: center;
		border: 1px solid #FFD56F;
		color: #FFD56F;
		margin-bottom:10px;
	}
	#paotui-guide .content .paotui-feature .feature-list .feature-item .feature-item-icon .icon{
		font-size: 28px;
	}
	#paotui-guide .paotui-order{
		position: fixed;
		z-index: 1000000;
		right: 10px;
		bottom: 160px;
		display:flex;
		flex-direction:column;
		align-items:center;
		width:50px;
		height:50px;
		border-radius:50px;
		text-align:center;
		border:1px solid #FFD56F;
		background:#fff;
		color: #FFD56F;
	}
	#paotui-guide .paotui-order .icon{
		font-size: 24px;
		margin-top: 6px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/paotui/guide.vue