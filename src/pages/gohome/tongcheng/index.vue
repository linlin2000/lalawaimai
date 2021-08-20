<template>
	<div id="tongcheng-index">
		<follow :follow="follow" v-if="follow && follow.status == 1"></follow>
		<public-footer :menufooter="menufooter" :preLoading="showPreLoading"></public-footer>
		<div class="container">
			<diy
				:diydata="diydata"
				:preLoading="showPreLoading"
				:getLocationFail="getLocationFail"
				:showFixedSearchBar="showFixedSearchBar"
				@onToggleDiscount="onToggleDiscount"
				@onGetInformation="onGetInformation"
				@onToggleInformation="onToggleInformation"
				@onCloseGuide="onCloseGuide"
			>
			</diy>
		</div>
	</div>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	import PublicFooter from '@/components/footer'
	import diy from '@/components/diy'
	import InformationItem from './components/informationItem'
	import {getData, getRecords} from "@/controller/funcCommon"
	export default {
		components: {
			PublicFooter,
			InformationItem,
			diy
		},
		data() {
			return {
				showPreLoading: true,
				diydata:{
					diy: {
						data: {}
					},
					tongcheng: {
						get_all: 0,
						page: 2,
						psize: 10,
						loading: true,
						loaded: false,
						finished: false,
						empty: false,
						data:[]
					},
					guideData: {
						is_show: false
					},
					config: {},
				},
				menufooter: {},
				order_remind: {},
				showFixedSearchBar: false,
				getLocationFail: false, 
				follow: {},
			}
		},
		methods: {
			...mapMutations([
				'setLocation', 'getLocation'
			]),
			onToggleDiscount(key, diyindex) {
				var diyitem = this.diydata.diy.data.items[diyindex];
				if(diyitem.id == 'waimai_stores') {
					this.diydata.diy.data.items[diyindex].data[key]['activity']['is_show_all'] = !this.diydata.diy.data.items[diyindex].data[key]['activity']['is_show_all'];
				} else {
					this.diydata.stores.data[key]['activity']['is_show_all'] = !this.diydata.stores.data[key]['activity']['is_show_all'];
				}
			},

			onToggleInformation(index) {
				this.diydata.tongcheng.data[index].showall = !this.diydata.tongcheng.data[index].showall;
			},
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'tongcheng/index/index',
					data: {
						lat: this.locationInfo.location_x,
						lng: this.locationInfo.location_y,
						menufooter: 1
					},
					success: (res) => {
						that.diydata.diy = res.diy;
						that.diydata.config = res.config;
						that.diydata.cart_sum = res.cart_sum;
						that.util.setWXTitle(that.diydata.diy.data.page.title);

						if(that.diydata.diy.guide) {
							if(that.diydata.diy.guide.params.status == 1 && that.diydata.diy.guide.params.show_setting == 'interval') {
								var guideStorage = this.util.getStorage('guideStorage');
								if(!guideStorage || (guideStorage && !guideStorage.show)) {
									this.util.setStorage('guideStorage', {show: 1}, that.diydata.diy.guide.params.interval_time * 60);
									that.diydata.guideData.is_show = true;
								}
							} else if(that.diydata.diy.guide.params.status == 1 && that.diydata.diy.guide.params.show_setting == 'everytime') {
								this.util.removeStorage('guideStorage')
								that.diydata.guideData.is_show = true;
							}
						}
						var default_location = that.diydata.config.default_location;
						if(default_location && default_location.location_x) {
							this.getLocationFail = false;
							that.setLocation(default_location);
						}
						if(res.diy.tongcheng && res.diy.tongcheng.informationdata) {
							that.diydata.tongcheng.data = res.diy.tongcheng.informationdata;
							that.diydata.tongcheng.loading = false;
							that.diydata.tongcheng.get_all = res.diy.tongcheng.get_all;
							if(that.diydata.tongcheng.get_all == 1) {
								that.diydata.tongcheng.finished = true;
								that.diydata.tongcheng.loaded = true;
							}
						}
						that.menufooter = window.menufooter;
						that.order_remind = window.order;
						if(that.diydata.diy.is_show_kefu == 1) {
							that.util.imeiqia();
						}
					}
				})
			},
			onGetInformation(force) {
				var that = this;
				if(force) {
					that.diydata.tongcheng = {
						page: 1,
						psize: 10,
						loaded: 0,
						empty: false,
						loading: true,
						data: []
					};
				}
				that.diydata.tongcheng.loading = true;
				this.util.request({
					url: 'tongcheng/index/information',
					data: {
						page: that.diydata.tongcheng.page,
						psize: that.diydata.tongcheng.psize,
					},
				}).then((res) => {
					let result = res.data.message.message;
					that.diydata.tongcheng.data = [...this.diydata.tongcheng.data, ...result.informations];
					if(result.informations.length < that.diydata.tongcheng.psize) {
						that.diydata.tongcheng.loaded = 1;
						if(!that.diydata.tongcheng.data.length) {
							that.diydata.tongcheng.empty = true;
						}
						that.diydata.tongcheng.finished = true;
					}
					that.diydata.tongcheng.loading = false;
					that.diydata.tongcheng.page++;
				})
			},
			onGetCartNums() {
				this.util.request({
					url: 'tongcheng/index/cart',
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return;
					}
					this.diydata.cart_sum = result.message.cart_sum;
				})
			},
			onCloseGuide() {
				this.diydata.guideData.is_show = false;
			},
			onInit() {
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
							that.setLocation({
								last_location_x: 0,
								location_x: 0,
								address: '获取定位失败'
							});
							that.getLocationFail = true;
							that.onLoad();
						}
					});
				} else {
					that.getLocationFail = false;
					that.locationInfo.last_location_x = this.locationInfo.location_x;
					that.onLoad();
				}
			},

		},
		activated() {
			if(this.locationInfo.last_location_x != this.locationInfo.location_x) {
				this.diydata.tongcheng = {
					has_get_all: 0,
					page: 2,
					psize: 10,
					loading: true,
					loaded: false,
					finished: false,
					empty: false,
					data:[]
				};
				this.onInit();
				return;
			}
			if(this.diydata.diy.is_show_cart == 1) {
				this.onGetCartNums();
			}
		},
		computed: {
			...mapState([
				'locationInfo'
			]),
		},
		mounted(){
			var that = this;
			this.onInit();
			window.addEventListener('scroll', function() {
				var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
				if(scrollTop > 100) {
					that.showFixedSearchBar = true;
				} else {
					that.showFixedSearchBar = false;
				}
			});
		}
	}
</script>

<style scoped>
</style>



// WEBPACK FOOTER //
// src/pages/gohome/tongcheng/index.vue