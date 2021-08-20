<template>
	<div id="haodian-index">
		<public-footer :menufooter="menufooter" :preLoading="showPreLoading"></public-footer>
		<div class="container">
			<diy
				:diydata="diydata"
				:preLoading="showPreLoading"
				:getLocationFail="getLocationFail"
				:showFixedSearchBar="showFixedSearchBar"
				@onToggleDiscount="onToggleDiscount"
				@onGetHaodianStore="onGetHaodianStore"
				@onCloseGuide="onCloseGuide"
				@onChangeHaodianExtra="onChangeHaodianExtra"
				@onClickHaodianParentCategory="onClickHaodianParentCategory"
				@onClickHaodianChildCategory="onClickHaodianChildCategory"
				@onHaodianCategoryConfirm="onHaodianCategoryConfirm"
			>
			</diy>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import {mapState, mapMutations} from 'vuex'
	import PublicFooter from '@/components/footer'
	import diy from '@/components/diy'
	import {getData, getRecords} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
			PublicFooter,
			diy
		},
		data() {
			return {
				showPreLoading: true,
				diydata:{
					diy: {
						data: {}
					},
					haodian: {
						page: 2,
						psize: 10,
						loading: false,
						loaded: false,
						finished: false,
						empty: false,
						data:[]
					},
					guideData: {
						is_show: false
					},
					config: {},
					popup: {
						haodianSearch: false
					},
					haodianExtra: {
						orderby: 'distance',
						haodian_cid: 0,
						haodian_child_id: 0,
						cIndexActive: 0,
					},
					haodianCategory: [],
					showSearchSign: false
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
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'haodian/index/index',
					data: {
						lat: this.locationInfo.location_x,
						lng: this.locationInfo.location_y,
						psize: this.diydata.haodian.psize,
						orderby: that.diydata.haodianExtra.orderby,
						haodian_cid: that.diydata.haodianExtra.haodian_cid,
						haodian_child_id: that.diydata.haodianExtra.haodian_child_id,
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
						that.diydata.haodianCategory = [...res.diy.haodian.category];
						that.diydata.haodianExtra.haodian_child_id = res.diy.haodian.haodian_child_id;

						that.diydata.haodian.data = [...res.diy.haodian.store];
						that.diydata.haodian.loading = false;
						if(!res.diy.haodian.store || res.diy.haodian.store.length < that.diydata.haodian.psize) {
							that.diydata.haodian.loaded = true;
						}
						if(!that.diydata.haodian.data.length) {
							that.diydata.haodian.empty = true;
						}
						that.menufooter = window.menufooter;
						that.order_remind = window.order;
						if(that.diydata.diy.is_show_kefu == 1) {
							that.util.imeiqia();
						}
					}
				})
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
			onToggleDiscount(key, diyindex) {
				var diyitem = this.diydata.diy.data.items[diyindex];
				if(diyitem.id == 'waimai_stores') {
					this.diydata.diy.data.items[diyindex].data[key]['activity']['is_show_all'] = !this.diydata.diy.data.items[diyindex].data[key]['activity']['is_show_all'];
				} else {
					this.diydata.stores.data[key]['activity']['is_show_all'] = !this.diydata.stores.data[key]['activity']['is_show_all'];
				}
			},
			onCloseGuide() {
				this.diydata.guideData.is_show = false;
			},
			onGetHaodianStore(force) {
				var that = this;
				if(force) {
					that.diydata.haodian = {
						page: 1,
						psize: 10,
						loaded: false,
						empty: false,
						loading: true,
						data: []
					};
				}

				this.util.request({
					url: 'haodian/index/store',
					data: {
						lat: that.locationInfo.location_x,
						lng: that.locationInfo.location_y,
						page: that.diydata.haodian.page,
						psize: that.diydata.haodian.psize,
						orderby: that.diydata.haodianExtra.orderby,
						haodian_cid: that.diydata.haodianExtra.haodian_cid,
						haodian_child_id: that.diydata.haodianExtra.haodian_child_id,
					},
				}).then((res) => {
					let result = res.data.message.message;
					that.diydata.haodian.data = [...that.diydata.haodian.data, ...result.store];
					if(result.store.length < that.diydata.haodian.psize) {
						that.diydata.haodian.loaded = true;
					}
					if(!that.diydata.haodian.data.length) {
						that.diydata.haodian.empty = true;
					}
					that.diydata.haodian.loading = false;
					that.diydata.haodian.page++;
					return;
				})
			},
			onChangeHaodianExtra(key) {
				var that = this;
				if(key == 'filter') {
					that.diydata.popup.haodianSearch = !that.diydata.popup.haodianSearch;
				} else {
					if(key == that.diydata.haodianExtra.orderby) {
						return;
					}
					that.diydata.showSearchSign = false;
					that.diydata.haodianExtra.orderby = key;
					that.diydata.haodianExtra.haodian_cid = 0;
					if(that.diydata.haodianCategory.length > 0) {
						if(that.diydata.haodianCategory[0]['children'].length > 0) {
							that.diydata.haodianExtra.haodian_child_id = that.diydata.haodianCategory[0]['children'][0]['id'];
						}
					}
					that.diydata.haodianExtra.cIndexActive = 0;
					that.onGetHaodianStore(true);
				}
			},
			onClickHaodianParentCategory(index) {
				var that = this;
				that.diydata.haodianExtra.cIndexActive = index;
				if(that.diydata.haodianCategory.hasOwnProperty(index)) {
					that.diydata.haodianExtra.haodian_cid = that.diydata.haodianCategory[index]['id'];
					if(that.diydata.haodianCategory[index]['children'].length > 0) {
						that.diydata.haodianExtra.haodian_child_id = that.diydata.haodianCategory[index]['children'][0]['id'];
					}
				}
			},
			onClickHaodianChildCategory(data) {
				var that = this;
				if(data) {
					that.diydata.haodianExtra.haodian_child_id = data.id;
					if(that.diydata.haodianExtra.haodian_cid == 0) {
						if(that.diydata.haodianCategory.length > 0) {
							that.diydata.haodianExtra.haodian_cid = that.diydata.haodianCategory[0]['id'];
						}
					}
				}
			},
			onHaodianCategoryConfirm() {
				var that = this;
				if(that.diydata.haodianExtra.haodian_child_id > 0 && that.diydata.haodianExtra.haodian_cid == 0) {
					if(that.diydata.haodianCategory.length > 0) {
						that.diydata.haodianExtra.haodian_cid = that.diydata.haodianCategory[0]['id'];
					}
				}
				that.diydata.showSearchSign = true;
				that.onGetHaodianStore(true);
				that.onChangeHaodianExtra('filter');
			}
		},
		computed: {
			...mapState([
				'locationInfo'
			]),
		},
		mounted() {
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

<style >

</style>


// WEBPACK FOOTER //
// src/pages/gohome/haodian/index.vue