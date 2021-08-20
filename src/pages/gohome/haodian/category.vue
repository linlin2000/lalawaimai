<template>
	<div id="haodian-category">
		<public-header :title="category.title"></public-header>
		<public-footer :menufooter="menufooter" :preLoading="showPreLoading"></public-footer>
		<div class="content">
			<template v-if="!getLocationFail">
				<div class="diy-haodian-list">
					<div class="haodian-filter fixed padding-15-tb padding-10-lr flex-lr bg-default font-14 van-hairline--bottom">
						<div class="filter-item" :class="{active: haodianExtra.orderby == 'distance'}" @click="onChangeHaodianExtra('distance')">附近</div>
						<div class="filter-item" :class="{active: haodianExtra.orderby == 'new'}" @click="onChangeHaodianExtra('new')">最新</div>
						<div class="filter-item" :class="{active: haodianExtra.orderby == 'score'}" @click="onChangeHaodianExtra('score')">评分</div>
						<div class="flex filter-item" @click="onChangeHaodianExtra('filter')">
							筛选<i class="icon icon-unfold"></i>
							<span class="haodian-search-sign"></span>
						</div>
					</div>
					<van-list v-model="haodian.loading" :finished="haodian.loaded" @load="onGetHaodianStore" :offset="100" :immediate-check="false" v-if="!haodian.empty">
						<div class="store-item " :class="{'van-hairline--top': haodianIndex > 0}" v-for="(haodianItem, haodianIndex) in haodian.data" :key="haodianIndex">
							<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/haodian/detail', query: {sid: haodianItem.id}})" class="img-wrap">
								<img :src="haodianItem.logo" alt="">
							</router-link>
							<div class="store-main">
								<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/haodian/detail', query: {sid: haodianItem.id}})">
									<div class="flex-lr">
										<div class="flex">
											<div class="store-title" >{{haodianItem.title}}</div>
											<van-rate v-model="haodianItem.haodian_score" :size="12" disabled-color="#ff2d4b" disabled />
											<span class="c-gray font-12 margin-5-l" >{{haodianItem.haodian_score}}分</span>
										</div>
										<div class="c-danger">{{haodianItem.distance}}km</div>
									</div>
									<div class="c-gray font-12 margin-10-t">营业时间: {{haodianItem.business_hours_cn}}</div>
									<ul class="store-tags"  v-if="haodianItem.haodian_tags && haodianItem.haodian_tags.length > 0">
										<li class="tag-item" v-for="(haodianTag, haodianTagIndex) in haodianItem.haodian_tags" :key="haodianTagIndex" >{{haodianTag}}</li>
									</ul>
								</router-link>
								<div class="discount-box" v-if="haodianItem.activity && haodianItem.activity.length > 0">
									<div class="single-line" v-for="(activityItem, activityIndex) in haodianItem.activity" :key="activityIndex">
										<img class="discount-icon" :src="activityItem.thumb_vue">
										<div class="discount-text">{{activityItem.text}}</div>
									</div>
								</div>
							</div>
						</div>
						<div class="loaded" v-if="haodian.loaded">
							<div class="loaded-tips">我是有底线的</div>
						</div>
					</van-list>
					<div class="no-data" v-else>
						<img src="static/img/collect_no_bg.png" alt="">
						<p>暂无好店，您可以更换筛选条件试试</p>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="no-data">
					<img src="static/img/store_no_con.png" alt="">
					<p>获取定位失败!您可以选择手动搜索地址</p>
					<router-link :to="util.getUrl({path: '/pages/home/location'})" class="navigator">手动搜索地址</router-link>
				</div>
			</template>
		</div>
		<van-popup v-model="popup.haodianSearch" position="top">
			<div class="haodian-filter padding-15-tb padding-10-lr flex-lr bg-default font-14 van-hairline--bottom">
				<div class="filter-item" :class="{active: haodianExtra.orderby == 'distance'}" @click="onChangeHaodianExtra('distance')">附近</div>
				<div class="filter-item" :class="{active: haodianExtra.orderby == 'new'}" @click="onChangeHaodianExtra('new')">最新</div>
				<div class="filter-item" :class="{active: haodianExtra.orderby == 'score'}" @click="onChangeHaodianExtra('score')">评分</div>
				<div class="filter-item">筛选</div>
			</div>
			<van-tree-select
					:items="haodianCategory"
					:main-active-index="haodianTemp.cIndexActive"
					:active-id="haodianTemp.haodian_child_id"
					@navclick="onClickHaodianParentCategory"
					@itemclick="onClickHaodianChildCategory"
					class="font-14"
			/>
			<ul class="flex van-hairline--top">
				<li class="flex-1 c-gray van-hairline--right text-center padding-15-tb" @click="onChangeHaodianExtra('filter')">取消</li>
				<li class="flex-1 c-danger text-center padding-15-tb" @click="onHaodianCategoryConfirm">确定</li>
			</ul>
		</van-popup>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	import {mapState, mapMutations} from 'vuex'
	import {getData, getRecords} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
			PublicFooter,
		},
		data() {
			return {
				category: {
					id: 0,
					title: '好店分类',
				},
				haodian: {
					page: 2,
					psize: 10,
					loading: false,
					loaded: false,
					empty: false,
					data:[]
				},
				popup: {
					haodianSearch: false
				},
				haodianExtra: {
					orderby: 'distance',
					haodian_cid: 0,
					haodian_child_id: 0,
				},
				haodianCategory: [],
				haodianTemp: {
					haodian_cid: 0,
					haodian_child_id: 0,
					cIndexActive: 0,
				},

				showPreLoading: true,
				getLocationFail: false,
				menufooter: {},
			}
		},
		methods: {
			...mapMutations([
				'setLocation', 'getLocation'
			]),
			onLoad(force) {
				var that = this;
				if(force) {
					that.haodian = {
						page: 2,
						psize: 10,
						loaded: false,
						empty: false,
						loading: true,
						data: []
					};
				}
				getData({
					vue: that,
					url: 'haodian/index/category',
					data: {
						lat: that.locationInfo.location_x,
						lng: that.locationInfo.location_y,
						psize: that.haodian.psize,
						orderby: that.haodianExtra.orderby,
						haodian_cid: that.haodianExtra.haodian_cid,
						haodian_child_id: that.haodianExtra.haodian_child_id,
						menufooter: 1
					},
					success: (res) => {
						that.category = Object.assign(that.category, res.category);
						that.util.setWXTitle(that.category.title);
						that.haodianExtra.haodian_cid = that.category.id;

						that.haodianCategory = [...res.categorys];

						that.haodian.data = [...that.haodian.data, ...res.store];
						that.haodian.loading = false;
						if(!res.store || res.store.length < that.haodian.psize) {
							that.haodian.loaded = true;
						}
						if(!that.haodian.data.length) {
							that.haodian.empty = true;
						}
						
					}
				})
			},
			onGetHaodianStore(force) {
				var that = this;
				if(force) {
					that.haodian = {
						page: 1,
						psize: 10,
						loaded: false,
						empty: false,
						loading: true,
						data: []
					};
				}
				getData({
					vue: that,
					url: 'haodian/index/store',
					data: {
						lat: that.locationInfo.location_x,
						lng: that.locationInfo.location_y,
						page: that.haodian.page,
						psize: that.haodian.psize,
						orderby: that.haodianExtra.orderby,
						haodian_cid: that.haodianExtra.haodian_cid,
						haodian_child_id: that.haodianExtra.haodian_child_id,
					},
					success: (result) => {
						that.haodian.data = [...that.haodian.data, ...result.store];
						if(result.store.length < that.haodian.psize) {
							that.haodian.loaded = true;
						}
						if(!that.haodian.data.length) {
							that.haodian.empty = true;
						}
						that.haodian.loading = false;
						that.haodian.page++;
						return;
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
			onChangeHaodianExtra(key) {
				var that = this;
				if(key == 'filter') {
					that.popup.haodianSearch = !that.popup.haodianSearch;
				} else {
					if(key == that.haodianExtra.orderby) {
						return;
					}
					that.haodianExtra.orderby = key;
					that.onGetHaodianStore(true);
				}
			},
			onClickHaodianParentCategory(index) {
				var that = this;
				that.haodianTemp.cIndexActive = index;
				if(that.haodianCategory.hasOwnProperty(index)) {
					that.haodianTemp.haodian_cid = that.haodianCategory[index]['id'];
					that.haodianTemp.haodian_child_id = 0;
				}
			},
			onClickHaodianChildCategory(data) {
				var that = this;
				if(data) {
					that.haodianTemp.haodian_child_id = data.id;
					if(that.haodianTemp.haodian_cid == 0) {
						if(that.haodianCategory.length > 0) {
							that.haodianTemp.haodian_cid = that.haodianCategory[0]['id'];
						}
					}
				}
			},
			onHaodianCategoryConfirm() {
				var that = this;
				that.haodianExtra = that.util.extend(that.haodianExtra, that.haodianTemp);
				that.onLoad(true);
				that.onChangeHaodianExtra('filter');
			}
		},
		computed: {
			...mapState([
				'locationInfo'
			]),
		},
		mounted() {
			if(this.$route.query && this.$route.query.cid > 0) {
				this.haodianExtra.haodian_cid = this.$route.query.cid;
			}
			this.onInit();
		}
	}
</script>

<style>
	@import "../../../../static/css/diy.css";
	#haodian-category .haodian-filter.fixed{
		position: fixed;
		left: 0;
		top: 46px;
		right: 0;
		z-index: 10;
	}
	#haodian-category .diy-haodian-list{
		padding-top: 44px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/haodian/category.vue