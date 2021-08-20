<template>
	<div id="order-map">
		<div id="map-container"></div>
		<router-link tag="div" :to="util.getUrl({path: '/pages/paotui/detail', query: {id: id}})" class="icons back-icon">
			<div class="icon icon-arrow-left"></div>
		</router-link>
		<div class="icons refresh-icon" @click="onRefresh">
			<div class="icon icon-refresh"></div>
		</div>
		<div class="icons question-icon" @click="onQuestion">
			<div class="icon icon-question font-20"></div>
		</div>
	</div>
</template>

<script>
	import {Amap} from '@/config/AMap'
	export default {
		name: "orderMap",
		data() {
			return {
				id: Number,
				markers: [],
				order: {},
				deliveryer: {},
				AMap: Amap()
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'errander/order/location',
					data: {
						id: this.id
					}
				}).then((res) => {
					var result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					this.order = result.message.order;
					this.deliveryer = result.message.deliveryer;
					if(this.order.status == 3) {
						this.util.$toast('订单已完成！');
						return false;
					}
					this.loadmap();
				})
			},
			loadmap(){
				var that = this;
				that.AMap.then(function(AMap){
					that.map = new AMap.Map('map-container', {
						resizeEnable: true,
						center: [that.order.accept_location_y, that.order.accept_location_x],
						zoom: 10
					});
					//收货位置
					var marker = new AMap.Marker({
						position: [that.order.accept_location_y, that.order.accept_location_x],
						offset: new AMap.Pixel(-35, -35),
						content: '<div class="marker-mine-route"></div>'
					});
					marker.setMap(that.map);

					//取货地址
					if(that.order.buy_location_x && that.order.buy_location_y) {
						var marker = new AMap.Marker({
							position: [that.order.buy_location_y, that.order.buy_location_x],
							offset: new AMap.Pixel(-23, -74),
							content: '<div class="marker-start-route"></div>'
						});
						marker.setMap(that.map);
					}

					//配送员位置
					if(that.order.status == 3) {
						that.map.panTo([that.order.delivery_success_location_y, that.order.delivery_success_location_x]);
						var avatar = that.deliveryer.avatar;
						var marker = new AMap.Marker({
							position: [that.order.delivery_success_location_y, that.order.delivery_success_location_x],
							offset: new AMap.Pixel(-26, -80),
							content: '<div class="marker-deliveyer-route"><img src='+ avatar +' alt=""/></div>'
						});
						marker.setMap(that.map);
					} else {
						that.map.panTo([that.deliveryer.location_y, that.deliveryer.location_x]);
						var avatar = that.deliveryer.avatar;
						var marker = new AMap.Marker({
							position: [that.deliveryer.location_y, that.deliveryer.location_x],
							offset: new AMap.Pixel(-26, -80),
							content: '<div class="marker-deliveyer-route"><img src='+ avatar +' alt=""/></div>'
						});
						marker.setMap(that.map);
						that.markers.push(marker);
					}
					that.map.setFitView();
				});

			},
			onRefresh() {
				var that = this;
				if(that.order.status == 3){
					return false;
				}
				that.util.request({
					url: 'system/common/deliveryer/location',
					data: {
						id: that.order.deliveryer_id
					}
				}).then((res) => {
					var result = res.data.message;
					if(result.errno) {
						that.util.$toast(result.message);
						return false;
					}
					var deliveryer = result.message;
					that.AMap.then(function(AMap){
						var marker = new AMap.Marker({
							position: [deliveryer.location_y, deliveryer.location_x],
							offset: new AMap.Pixel(-26, -80),
							content: '<div class="marker-deliveyer-route"><img src="'+ deliveryer.avatar +'" alt=""/></div>'
						});
						that.map.remove(that.markers);
						marker.setMap(that.map);
						that.markers.push(marker);
						that.map.setFitView();
					});
				})
			},
			onQuestion() {
				this.$dialog.confirm({
					message: '要获取最新位置，请点击刷新按钮；如果配送员远离您，那可能是正在为更早下单的用户配送，请耐心等待~',
					showCancelButton: false
				})
			},
		},
		created() {
			if(this.$route.query.id) {
				this.id = this.$route.query.id
			} else {
				return false;
			}
		},
		mounted() {
			this.onLoad();
			setInterval(() => {
				this.onRefresh();
			}, 30000)
		}
	}
</script>

<style>
	#order-map{
		position: fixed;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	#order-map #map-container{
		width: 100%;
		height: 100%;
	}
	#order-map .icons{
		position: absolute;
		z-index: 100;
		height: 36px;
		width: 36px;
		text-align: center;
		line-height: 36px;
		border-radius: 100%;
		background: #9b9a96;
		opacity: 0.8;
		color: #FFF;
	}
	#order-map .back-icon{
		top: 15px;
		left: 15px;
	}
	#order-map .refresh-icon{
		top: 15px;
		right: 15px;
	}
	#order-map .question-icon{
		bottom: 15px;
		right: 15px;
	}
	#order-map .amap-marker .marker-deliveyer-route{
		position: relative; 
		width: 52px; 
		height: 80px; 
		color: #e90000; 
		background: url(../../../static/img/map-location.png) no-repeat 0 0;
		cursor: pointer;
	}
	#order-map .amap-marker .marker-deliveyer-route img{
		position:absolute; 
		top: 5px; 
		right: 5px; 
		width: 42px; 
		height: 42px; 
		border-radius: 100%;
	}
	#order-map .amap-marker .marker-start-head-route {
		position: relative;
		width: 70px;
		height: 70px;
		color: #e90000;
		background: url(../../../static/img/map-start-head.png) no-repeat 0 0;
		background-size: cover;
		cursor: pointer;
	}
	#order-map .amap-marker .marker-start-head-route img {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 46px;
		height: 46px;
		border-radius: 100%
	}
	#order-map .amap-marker .marker-mine-route {
		position: relative;
		width: 70px;
		height: 70px;
		color: #e90000;
		background: url(../../../static/img/map-lbs.png) no-repeat 0 0;
		background-size: cover;
		cursor: pointer;
	}
	.amap-marker .marker-mine-route img {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 46px;
		height: 46px;
		border-radius: 100%
	}
	.amap-marker .marker-start-route {
		position: relative;
		width: 54px;
		height: 74px;
		background: url(../../../static/img/map-start.png) no-repeat 0 0;
		background-size: cover;
		cursor: pointer;
	}
</style>


// WEBPACK FOOTER //
// src/pages/paotui/map.vue