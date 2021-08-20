<template>
	<div id="paotui-index">
		<public-header title="随意购"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
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
	</div>
</template>

<script>
	import {Amap} from '@/config/AMap'
	import PublicHeader from "@/components/header"
	import PublicFooter from "@/components/footer"
	export default {
		name: "paotuiIndex",
		components: {
			PublicHeader,
			PublicFooter
		},
		data() {
			return {
				showPreLoading: true,
				categorys: [],
				orders: [],
				delivery_num: 0,
				config: {},
				deliveryers: [],
				menufooter: {},
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'errander/index/index',
					data: {menufooter: 1},
				}).then((res) =>{
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message, '', 1000);
						return false;
					}
					result = result.message;
					this.categorys = [...result.categorys];
					this.orders = [...result.orders];
					this.delivery_num = result.delivery_num;
					this.config = result.config;
					this.deliveryers = result.deliveryers;
					this.menufooter = window.menufooter;
					this.loadmap();
				})
			},
			loadmap(){
				var that = this;
				Amap().then(function(AMap){
					var map = new AMap.Map('map-container', {
						resizeEnable: true,
						zoom: 11,
						center: [that.config.map.location_y, that.config.map.location_x],
					});
					for(var i in that.deliveryers) {
						var deliveryer = that.deliveryers[i];
						if(deliveryer.location_x && deliveryer.location_y) {
							var marker = new AMap.Marker({
								position: [deliveryer.location_y, deliveryer.location_x],
								offset: new AMap.Pixel(-26, -80),
								content: '<div class="map-center"><img src="' + deliveryer.avatar + '"alt=""></div>'
							});
							marker.setMap(map);
						}
					}
				});
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#paotui-index .map-content{
		width: 100%;
		height: 100%;
		position: relative;
	}
	#paotui-index .map-content #map-container{
		width: 100%;
		height: 100%;
	}
	#paotui-index .map-content .map-center{
		position: relative;
		width: 52px;
		height: 80px;
		background: url(../../../static/img/map-location.png) no-repeat 0 0;
		cursor: pointer;
	}
	#paotui-index .map-content .map-center img{
		position: absolute;
		top: 5px;
		right: 5px;
		width: 42px;
		height: 42px;
		border-radius: 100%;
	}
	#paotui-index .order-swiper{
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
	#paotui-index .order-swiper .swiper-item{
		padding: 0 10px;
		width: 100%;
		height: 100%;
	}
	#paotui-index .order-swiper .swiper-item .left{
		width: 92%;
	}
	#paotui-index .order-swiper .swiper-item .left p{
		width: 87%;
	}
	#paotui-index .order-swiper .swiper-item img{
		width: 30px;
		height: 30px;
	}
	#paotui-index .cate{
		position: absolute;
		bottom: 10px;
		left: 10px;
		right: 10px;
		background: rgba(255,255,255,.9);
		border-radius: 5px;
		font-size: 12px;
		z-index: 10;
	}
	#paotui-index .cate .cate-title{
		margin: 10px 0;
		text-align: center;
	}
	#paotui-index .cate .cate-item{
		width: 100%;
		color: #333;
		text-align: center;
		margin-bottom: 10px;
	}
	#paotui-index .cate .cate-item p{
		width: 100%;
		padding: 0 5px;
		margin-top: 5px;
	}
	#paotui-index .cate .cate-item img{
		width: 45px;
		height: 45px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/paotui/index.vue