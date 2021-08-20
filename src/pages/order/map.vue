<template>
	<div id="order-map">
		<div id="map-container"></div>
		<router-link tag="div" :to="util.getUrl({path: '/pages/order/detail', query: {id: id}})" class="icons back-icon">
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
				center: {
					lat: '',
					lng: '',
				},
				order: {},
				deliveryer_marker: [],
				AMap: Amap()
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'wmall/order/index/location',
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
					if(this.order.status == 5) {
						return false;
					}
					this.markers = [...this.markers, ...result.message.markers];
					this.center.lat = result.message.markers[0].latitude;
					this.center.lng = result.message.markers[0].longitude;
					this.loadmap();
				})
			},
			loadmap(){
				var that = this;
				that.AMap.then(function(AMap){
					that.map = new AMap.Map('map-container', {
						resizeEnable: true,
						center: [that.center.lng, that.center.lat],
						zoom: 10
					});
					// 顾客位置
					if(that.markers[0].longitude && that.markers[0].latitude) {
						var marker = new AMap.Marker({
							position: [that.markers[0].longitude, that.markers[0].latitude],
							offset: new AMap.Pixel(-26, -80),
							content: '<div class="marker-mine-route"></div>'
						});
						marker.setMap(that.map);
					}
					// 商家位置
					if(that.markers[2].longitude && that.markers[2].latitude) {
						var marker = new AMap.Marker({
							position: [that.markers[2].longitude, that.markers[2].latitude],
							offset: new AMap.Pixel(-33, -70),
							content: '<div class="marker-start-head-route"><img src="' + that.markers[2].vue_icon + '" alt=""/></div>'
						});
						marker.setMap(that.map);
					}
					// 配送员位置
					if(that.order.status == 5) {
						var marker = new AMap.Marker({
							position: [that.order.delivery_success_location_y, that.order.delivery_success_location_x],
							offset: new AMap.Pixel(-26, -80),
							content: '<div class="marker-deliveyer-route"><img src='+ params.deliveryer.avatar +' alt=""/></div>'
						});
						marker.setMap(that.map);
					} else {
						if(that.markers[1].longitude && that.markers[1].latitude) {
							var marker = new AMap.Marker({
								position: [that.markers[1].longitude, that.markers[1].latitude],
								offset: new AMap.Pixel(-26, -80),
								content: '<div class="marker-deliveyer-route"><img src="' + that.markers[1].vue_icon + '" alt=""/></div>'
							});
							marker.setMap(that.map);
							that.deliveryer_marker.push(marker);
						}
					}
					that.map.setFitView();
				});

			},
			onRefresh() {
				var that = this;
				if(that.order.status == 5){
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
						that.map.remove(that.deliveryer_marker);
						marker.setMap(that.map);
						that.deliveryer_marker.push(marker);
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
	#order-map .amap-marker .marker-mine-route img {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 46px;
		height: 46px;
		border-radius: 100%
	}
</style>


// WEBPACK FOOTER //
// src/pages/order/map.vue