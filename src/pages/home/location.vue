<template>
	<div id="home-location">
		<public-header title="选择收货地址"></public-header>
		<div class="content">
			<div class='search-header-wrap van-hairline--bottom'>
				<div class='search-header'>
					<van-search v-model="key" show-action background="#fff" placeholder="请输入您的收货地址">
						<div slot="action">搜索</div>
					</van-search>
				</div>
			</div>
			<template v-if="!showSearch">
				<div class='location' @click="onGetNowLocation">
					<van-icon name='location'></van-icon> {{getNowLocationing == true ? '正在获取定位...' : '点击定位当前位置'}}
				</div>
				<template v-if="addresses.length && addresses.length > 0">
					<div class="item-title">
						<van-icon name='time'></van-icon>我的收货地址
					</div>
					<van-cell-group>
						<van-cell v-for="(item, index) in addresses" :title="item.address" :label="item.realname + ' ' + item.sex + ' ' + item.mobile " :key="index" @click="chooseLocation(item)"/>
					</van-cell-group>
				</template>

				<template v-if="addressSearchHistory.length && addressSearchHistory.length > 0">
					<div class="item-title">
						<van-icon name='location'></van-icon>搜索历史
					</div>
					<van-cell-group >
						<van-cell :title="item.address" :label="item.name" v-for="(item, index) in addressSearchHistory" :key="index" @click="chooseLocation(item)"/>
					</van-cell-group>
				</template>
			</template>
			<van-cell-group v-else>
				<van-cell v-for="(item,index) in searchAddress"  :title="item.address"  :label="item.name" :key="index" @click="chooseLocation(item, true)"/>
			</van-cell-group>
		</div>
	</div>
</template>

<script>
	import { mapState, mapMutations } from "vuex"
	import PublicHeader from '@/components/header'
	export default {
		data() {
			return {
				addresses: [],
				showSearch: false,
				key: '',
				searchAddress: [],
				addressSearchHistory: [],
				getNowLocationing: false,
			}
		},
		components: {
			PublicHeader,
		},
		watch: {
			key() {
				let key= this.key;
				this.showSearch = key ? true : false;
				this.searchAddress = [];
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
						this.searchAddress = [...this.searchAddress, ...result.message];
					})
				}
			}
		},
		methods: {
			...mapMutations(['setLocation']),

			onLoad() {
				this.util.request({
					url: 'wmall/home/location/index',
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						return;
					}
					this.addresses = [...this.addresses, ...result.message];
				})
				var addressSearchHistory = this.util.getStorage('addressSearchHistory')
				if(addressSearchHistory && addressSearchHistory.length && addressSearchHistory.length > 0) {
					this.addressSearchHistory = [...this.addressSearchHistory, ...addressSearchHistory];
				}
			},

			chooseLocation(item, is_search = false){
				var locationInfo = {
					last_location_x: this.locationInfo.location_x,
					address: item.address,
					location_x: item.location_x,
					location_y: item.location_y,
				}
				this.setLocation(locationInfo);
				if(is_search) {
					locationInfo.name = item.name;
					this.addressSearchHistory.push(locationInfo);
					this.util.setStorage('addressSearchHistory', this.addressSearchHistory);
				}
				this.$router.go(-1);
			},

			onGetNowLocation() {
				var that = this;
				that.getNowLocationing = true;
				that.util.getLocation({
					successLocation: function(res) {
					},
					successAddress:  function(res) {
						that.setLocation({
							last_location_x: that.locationInfo.location_x,
							location_x: res.location_x,
							location_y: res.location_y,
							address: res.address
						});
						that.getNowLocationing = false;
						that.$router.go(-1);
					},
					fail: function(res) {
						that.getNowLocationing = false;
						that.util.$toast('获取定位失败,你可以手动搜索收货地址');
					}
				});
			},
		},
		computed: {
			...mapState([
				'locationInfo'
			]),
		},
		mounted() {
			this.onLoad();
		},
	}
</script>

<style>
	#home-location .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#home-location .content::-webkit-scrollbar {
		display: none;
	}
	#home-location .content .van-search{
		padding: 6px 10px;
	}
	#home-location .content .van-search__action{
		padding-right: 0!important;
	}
	#home-location .content .search-header-wrap .search-header .van-cell{
		background-color:#f5f5f5;
		border-radius: 20px;
	}
	#home-location .content .search-header-wrap .search-header .van-cell input{
		background-color:#f5f5f5;
	}
	#home-location .content .search-header-wrap .search-header .van-search__action{
		font-size:14px;
		color:#FF2D4B;
		display:inline-block;
		padding: 0 9px;
	}
	#home-location .content .location{
		text-align:center;
		padding:10px;
		background:#fff;
		margin-top:10px;
		font-size:15px;
		line-height: 24px;
	}
	#home-location .content .location .van-icon{
		font-size: 14px;
	}
	#home-location .content .item-title{
		padding:10px 0 10px 15px;
		font-size:14px;
		color:#B2B2B2;
		line-height: 22px;
	}
	#home-location .content .item{
		background: #fff;
	}
	#home-location .content .van-cell-group .van-cell__title span{
		line-height: 22px;
		font-size: 14px;
	}
	#home-location .content .van-cell-group .van-cell__title div{
		margin-top:5px;
		color:#B2B2B2;
		line-height: 22px;
		font-size: 14px;
	}
	#home-location .content .van-search .van-icon-clear{
		display: none;
	}
</style>


// WEBPACK FOOTER //
// src/pages/home/location.vue