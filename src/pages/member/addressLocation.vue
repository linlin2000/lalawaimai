<template>
	<div id="address-location">
		<public-header title="新增收货地址"></public-header>
		<transition name="loading">
			<iloading v-show="showLoading"></iloading>
		</transition>
		<div class="content">
			<van-search placeholder="请输入您的收货地址" background="#f5f5f5" v-model="key"/>
			<template v-if="!key">
				<div class="map-content">
					<div id="allmap1"></div>
					<div class="center-marker">
						<img src="static/img/marker_red.png" alt="">
					</div>
				</div>
				<div class="location-list">
					<div class="list-item flex-lr van-hairline--bottom " :class="{active: index == 0}" v-for="(item, index) in addressPois" @click="onSelectAddress(item)" :key="index">
						<i class="icon icon-locationfill"></i>
						<div class="item-inner">
							<div class="name ellipsis">{{item.address}}</div>
							<div class="address ellipsis">{{item.name}}</div>
						</div>
					</div>
				</div>
			</template>
			<van-cell-group class="search-list" v-else>
				<van-cell v-for="(item,index) in addressSearch"  :title="item.address"  :label="item.name" @click="onSelectAddress(item)" :key="index"/>
			</van-cell-group>
		</div>
	</div>
</template>

<script>
	import {Amap} from '@/config/AMap'
	import {mapState, mapMutations} from 'vuex'
	import PublicHeader from '@/components/header'
	import axios from 'axios'
	export default {
		data() {
			return {
				showLoading: true,
				key: '',
				mapConfig: {
					center: {}
				},
				map: {
					lat: '',
					lng: ''
				},
				addressPois: [],
				addressSearch: []
			}
		},
		components: {
			PublicHeader,
		},
		computed: {
			...mapState(['editAddress', 'erranderExtra']),
		},

		watch: {
			key() {
				let key= this.key;
				this.addressSearch = [];
				if(key) {
					this.util.request({
						url: 'system/common/map/suggestion',
						data: {
							key: key
						}
					}).then((res) => {
						let result = res.data.message;
						if(result.errno) {
							return;
						}
						this.addressSearch = [...this.addressSearch, ...result.message];
					})
				}
			}
		},
		methods: {
			...mapMutations(['replaceAddress']),

			onLoad() {
				var params = {
					sid: this.sid,
					erranderId: this.erranderId
				};
				if(this.erranderExtra && this.erranderExtra.agentid) {
					params['agentid'] = this.erranderExtra.agentid;
				}
				this.util.request({
					url: 'wmall/member/address/location',
					data: params,
				}).then((res) => {
					this.showLoading = false;
					let result = res.data.message;
					this.mapConfig = result.message.map;
					this.map.lat = result.message.map.center.location_x;
					this.map.lng = result.message.map.center.location_y;
					this.loadmap();
					this.onGetAddressPois(this.map.lat, this.map.lng);
				});
			},

			onGetAddressPois(lat, lng) {
				var params = {
					type: '商务住宅|科教文化服务|地名地址信息|医疗保健服务|政府机构及社会团体|住宿服务|公司企业|道路附属设施|购物服务|生活服务|体育休闲服务|交通设施服务',
					location: lat + ',' + lng,
				};
				var url = 'https://restapi.amap.com/v3/place/around?key=37bb6a3b1656ba7d7dc8946e7e26f39b&radius=1000&offset=25&page=1&extensions=all&output=json&keywords=&json=' +  this.util.toQueryString(params);
				axios.get(url).then((result) => {
					var result = result.data;
					if(result.info == "OK"){
						var re = [];
						for(var i in result.pois){
							var location = result.pois[i].location.split(',');
							var poi = {
								name: result.pois[i].address,
								address: result.pois[i].name,
								lng: location[0],
								lat: location[1],
								location_x: location[1],
								location_y: location[0],
							};
							re.push(poi);
						}
						this.addressPois = re;
					}
				});
			},

			onSelectAddress(item) {
				this.replaceAddress(item);
				if(this.editAddress) {
					this.$router.replace(this.util.getUrl({path: '/pages/member/addressPost', query: {id: this.id, sid: this.sid, channel: this.channel, erranderId: this.erranderId, orderId: this.orderId, input: this.input, from: 'location'}}));
				}
			},

			loadmap(){
				var that = this;
				Amap().then(function(AMap){
					window.map = that.map = new AMap.Map('allmap1', {
						resizeEnable: true,
						center: [that.mapConfig.center.location_y, that.mapConfig.center.location_x],
						zoom: 17
					});

					AMap.event.addListener(that.map, "dragend", function(){
						var center = that.map.getCenter();
						that.onGetAddressPois(center.lat, center.lng);
					});

					that.util.getLocation({
						successLocation: function(location) {
							that.map.panTo([location.lng, location.lat]);
							that.onGetAddressPois(location.lat, location.lng);
						},
						fail: function(res) {
						}
					});
				});

			},

		},
		created() {
			this.query = this.$route.query;
			if(this.query) {
				this.id = this.query.id;
				this.sid = this.query.sid;
				this.channel = this.query.channel;
				this.input = this.query.input;
				this.erranderId = this.query.erranderId;
				this.orderId = this.query.orderId;
			}
		},
		mounted(){
			this.onLoad();
		},
	}
</script>

<style>
	#address-location .map-content{
		width: 100%;
		height: 200px;
		position: relative;
	}
	#address-location .map-content #allmap1{
		width: 100%;
		height: 100%;
	}
	#address-location .map-content .center-marker{
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -9.5px;
		margin-top: -25px;
	}
	#address-location .content{
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
	}
	#address-location .content .location-list{
		overflow-y: auto;
	}
	#address-location .content .location-list::-webkit-scrollbar {
		display: none;
	}
	#address-location .van-search .van-icon-clear{
		display: none;
	}
	#address-location .content .search-list{
		position: absolute;
		top: 40px;
		right: 0;
		bottom: 0;
		left: 0;
		overflow-y: auto;
	}
	#address-location .content .search-list::-webkit-scrollbar {
		display: none;
	}
	#address-location .content .location-list{
		background-color: #fff;
		padding-left: 15px;
	}
	#address-location .content .location-list .list-item{
		padding: 10px 15px 10px 0;
	}
	#address-location .content .location-list .list-item .icon{
		align-self: flex-start;
		font-size: 16px;
		color: #FF2D4B;
		margin-right: 2px;
		opacity: 0;
	}
	#address-location .content .location-list .list-item .item-inner{
		width: 100%;
	}
	#address-location .content .location-list .list-item .name{
		font-size: 14px;
	}
	#address-location .content .location-list .list-item .address{
		font-size: 12px;
		color: #999;
		margin-top: 10px;
	}
	#address-location .content .location-list .list-item.active .name{
		color: #FF2D4B;
	}
	#address-location .content .location-list .list-item.active .icon{
		opacity: 1;
	}
</style>



// WEBPACK FOOTER //
// src/pages/member/addressLocation.vue