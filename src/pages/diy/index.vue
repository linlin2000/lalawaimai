<template>
	<div id="diy">
		<follow :follow="follow" v-if="followShow"></follow>
		<public-header :title="title" v-if="!isWeixin"></public-header>
		<public-footer :menufooter="menufooter" v-if="menufooter"></public-footer>
		<div class="container" :style="styleContent">
			<diy
				:diydata="diydata"
				:preLoading="showPreLoading"
				:getLocationFail="getLocationFail"
				:showFixedSearchBar="showFixedSearchBar"
				@onToggleDiscount="onToggleDiscount"
				@onChangeStoreExtra="onChangeStoreExtra"
				@onStoreOrderby="onStoreOrderby"
				@onGetStore="onGetStore"
				@onCloseRedpacket="onCloseRedpacket"
				@onCloseGuide="onCloseGuide"
				@onGetInformation="onGetInformation"
				@onToggleInformation="onToggleInformation"
				@onGetHaodianStore="onGetHaodianStore"
				@onChangeHaodianExtra="onChangeHaodianExtra"
				@onClickHaodianParentCategory="onClickHaodianParentCategory"
				@onClickHaodianChildCategory="onClickHaodianChildCategory"
				@onHaodianCategoryConfirm="onHaodianCategoryConfirm"
				@onToggleService="onToggleService">
			</diy>
		</div>
	</div>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	import follow from '@/components/follow'
	import diy from '@/components/diy'
	export default {
		name: "diyIndex",
		data() {
			return {
				title: '',
				id: 0,
				getLocationFail: false,
				showPreLoading: true,
				styleContent: {},
				diydata:{
					diy: {
						data: {}
					},
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
						loading: true,
						finished: false,
						page: 1,
						psize: 20,
						loaded: 0,
						empty: 0,
						data: [],
					},
					popup: {
						storeSearch: false,
						haodianSearch: false,
						serviceQrcode: false
					},
					superRedpacketData: {},
					guideData: {
						is_show: false
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
					haodian: {
						page: 2,
						psize: 15,
						loading: false,
						loaded: false,
						finished: false,
						empty: false,
						data:[]
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
				showFixedSearchBar: false,
				menufooter: {},
				follow: {},
				followShow: false
			}
		},
		components: {
			PublicHeader,
			PublicFooter,
			diy,
			follow
		},
		watch: {
			$route(){
				this.id = this.$route.query.id
			},
			id() {
				this.onLoad(true);
			},
		},
		methods: {
			...mapMutations([
				'setLocation', 'getLocation', 'setState'
			]),

			onToggleDiscount(key, diyindex) {
				var diyitem = this.diydata.diy.data.items[diyindex];
				if(diyitem.id == 'waimai_stores') {
					this.diydata.diy.data.items[diyindex].data[key]['activity']['is_show_all'] = !this.diydata.diy.data.items[diyindex].data[key]['activity']['is_show_all'];
				} else {
					this.diydata.stores.data[key]['activity']['is_show_all'] = !this.diydata.stores.data[key]['activity']['is_show_all'];
				}
				this.diydata = Object.assign({}, this.diydata)
			},

			onCloseRedpacket() {
				this.diydata.superRedpacketData.is_show = false;
				this.diydata.superRedpacketData = Object.assign({}, this.diydata.superRedpacketData);
			},

			onChangeStoreExtra(key) {
				if(key == 'multiple') {
					this.diydata.storeExtra.multiple = true;
					this.diydata.storeExtra.filter = false;
				} else {
					this.diydata.storeExtra.multiple = false;
					this.diydata.storeExtra.filter = true;
				}
				this.diydata.popup.storeSearch = true;
			},

			onStoreOrderby(type, value, title) {
				if(type == 'order') {
					if(value == 'svipRedpacket') {
						this.diydata.storeExtra.condition.dis = value;
					} else {
						this.diydata.storeExtra.condition.order = value;
						this.diydata.storeExtra.multiple = false;
						if(value != 'sailed' && value != 'distance') {
							this.diydata.storeExtra.filter_title = title;
						} else {
							this.diydata.storeExtra.filter_title = '综合排序';
						}
					}
				} else if(type == 'discounts') {
					if(this.diydata.storeExtra.condition.dis == value) {
						value = '';
					}
					this.diydata.storeExtra.condition.dis = value;
					return false;
				} else if(type == 'mode') {
					if(this.diydata.storeExtra.condition.mode == value) {
						value = '';
					}
					this.diydata.storeExtra.condition.mode = value;
					return false;
				} else if(type == 'clear') {
					this.diydata.storeExtra.condition.dis = '';
					this.diydata.storeExtra.condition.order = '';
					this.diydata.storeExtra.condition.mode = '';
					this.diydata.storeExtra.filter = false;
					this.diydata.storeExtra.filter_title = '综合排序';
				} else if(type == 'finish') {
					this.diydata.storeExtra.filter = false;
				}
				this.diydata.popup.storeSearch = false;
				this.onGetStore(true);
			},

			onGetStore(force) {
				var that = this;
				if(force) {
					that.diydata.stores = {
						page: 1,
						psize: 20,
						loaded: 0,
						empty: false,
						loading: true
					};
				}
				that.diydata.stores.loading = true;
				this.util.request({
					url: 'wmall/home/index/store',
					data: {
						lat: that.locationInfo.location_x,
						lng: that.locationInfo.location_y,
						page: that.diydata.stores.page,
						psize: that.diydata.stores.psize,
						condition: JSON.stringify(that.diydata.storeExtra.condition)
					},
				}).then((res) => {
					let result = res.data.message.message;
					if(force) {
						that.diydata.stores.data = [];
					}
					that.diydata.stores.data = [...this.diydata.stores.data, ...result.stores];
					if(result.pagetotal <= that.diydata.stores.page) {
						that.diydata.stores.loaded = 1;
						if(!that.diydata.stores.data.length) {
							that.diydata.stores.empty = true;
						}
						that.diydata.stores.finished = true;
					}
					that.diydata.stores.loading = false;
					that.diydata.stores.page++;

					if(!that.diydata.stores.loaded && !result.stores.length) {
						this.onGetStore();
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
					url: 'diypage/diy/information',
					data: {
						page: that.diydata.tongcheng.page,
						psize: that.diydata.tongcheng.psize
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

			onLoad(force = false) {
				this.util.request({
					url: 'diypage/diy',
					data: {
						id: this.id,
						menufooter: 1
					}
				}).then((res) => {
					var that = this;
					that.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						that.util.$toast(result.message)
						return;
					}
					that.diydata.config = result.message.config;
					that.diydata.diy = result.message.diy;
					that.diy = result.message.diy;
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
					//处理同城
					if(that.diydata.diy.tongcheng) {
						that.diydata.tongcheng.data = [...that.diydata.diy.tongcheng.informationdata];
						if(that.diydata.tongcheng.data.length == 0) {
							that.diydata.tongcheng.empty = true;
						}
						that.diydata.tongcheng.loading = false;
						that.diydata.tongcheng.has_get_all = that.diydata.diy.tongcheng.has_get_all;
						delete that.diydata.diy['tongcheng'];
						if(that.diydata.tongcheng.has_get_all == 1) {
							that.diydata.tongcheng.finished = true;
							that.diydata.tongcheng.loaded = true;
						}
					}
					//处理好店
					if(that.diydata.diy.haodian) {
						that.diydata.haodianCategory = [...that.diydata.diy.haodian.category];
						that.diydata.haodianExtra.haodian_child_id = that.diydata.diy.haodian.haodian_child_id;

						that.diydata.haodian.data = [...that.diydata.diy.haodian.store];
						that.diydata.haodian.loading = false;
						if(!that.diydata.diy.haodian.store || that.diydata.diy.haodian.store.length < that.diydata.haodian.psize) {
							that.diydata.haodian.loaded = true;
						}
						if(!that.diydata.haodian.data.length) {
							that.diydata.haodian.empty = true;
						}
					}
					that.title = result.message.diy.data.page.title;
					that.util.setWXTitle(that.title);
					that.diydata.superRedpacketData = result.message.superRedpacketData;
					that.diydata.superRedpacketData.is_show = true;
					that.diydata.cart_sum = result.message.cart_sum;
					that.menufooter = window.menufooter;
					that.follow = window.follow;
					if(that.diy.data.page.followbar == 1 && that.follow && that.follow.status == 1) {
						that.followShow = true;
					}
					that.styleContent = {
						'background-color': this.diydata.diy.data.page.background
					};
					if(that.diy.is_show_kefu == 1) {
						that.util.imeiqia();
					}
					if(that.diy.is_has_location == 1 || that.diy.is_has_allstore == 1) {
						that.getLocation();
						if(!that.locationInfo.location_x) {
							that.util.getLocation({
								successLocation: function(res) {
									that.setLocation({
										last_location_x: res.location_x,
										location_x: res.location_x,
										location_y: res.location_y
									});
									if(that.diy.is_has_allstore == 1) {
										that.onGetStore(force);
									}
								},
								successAddress:  function(res) {
									that.setLocation({
										last_location_x: res.location_x,
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
									if(that.diy.is_has_allstore == 1) {
										that.onGetStore(force);
									}
								}
							});
						} else {
							that.getLocationFail = false;
							if(that.diy.is_has_allstore == 1) {
								that.onGetStore(force);
							}
						}
					}
				})
			},
			onGetCartNums() {
				this.util.request({
					url: 'wmall/home/index/cart',
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
			onToggleInformation(index) {
				this.diydata.tongcheng.data[index].showall = !this.diydata.tongcheng.data[index].showall;
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
			},
			onToggleService() {
				var that = this;
				that.diydata.popup.serviceQrcode = !that.diydata.popup.serviceQrcode;
			}
		},
		created() {
			if(this.$route.query.id) {
				this.id = this.$route.query.id;
			} else {
				this.util.$toast('页面不存在！')
			}
		},
		computed: {
			...mapState([
				'locationInfo'
			]),
		},
		activated() {
			if(this.locationInfo.last_location_x != this.locationInfo.location_x) {
				this.diydata.storeExtra = {
					condition: {
						order: '',
						mode: '',
						dis: ''
					},
					filter_title: '综合排序',
					multiple: false,
					filter: false
				};
				this.onLoad(true);
				return;
			}
			this.onGetCartNums();
		},
		mounted() {
			var that = this;
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


// WEBPACK FOOTER //
// src/pages/diy/index.vue
