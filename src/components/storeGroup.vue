<template>
	<div id="store-group">
		<div class="stat-day">
        	<slot name="stat_day"></slot>
    	</div> 
		<div class="diy-waimai-store-box">
			<div class="waimai-store-item-list">
				<template v-for="(store, index) in stores">
					<div class="waimai-store-item border-1px-b" :class="{disabled: store.is_rest == 1}">
						<div class="mian-content-box">
							<div class="content-left border-1px">
								<router-link class="item-image" :to="util.getUrl({path: store.url})">
									<div class="item-rest" v-if="store.is_rest==1">休息中</div>
									<img v-lazy="{src: store.logo, loading: lazyload.lazyload_store}">
								</router-link>
							</div>
							<div class="content-right">
								<router-link :to="util.getUrl({path: store.url})">
									<div class="item-name-wrap">
										<div class="item-name">{{store.title}}</div>
									</div>
									<div class="delivery-tip" v-if="store.rest_reserve_cn">{{store.rest_reserve_cn}}</div>
									<div class="item-score-time">
										<div class="item-score-sale">
											<div class="item-star-box">
												<van-rate v-model="store.score" :size="12" disabled-color="#ff2d4b" disabled />
											</div>
											<div class="item-sale">月售 {{store.sailed}}</div>
										</div>
										<div class="time-distance">
											<div class="avg_delivery_time" v-if="store.delivery_time">{{store.delivery_time}}分钟 </div>
											<div class="avg_delivery_time" v-if="store.distance">&nbsp|&nbsp{{store.distance}}km</div>
										</div>
									</div>
									<div class="item-min-delivery">
										<div class="item-min-delivery-left">
											<!-- <div>起送价￥{{store.send_price}}</div>
											<div class="line">|</div>
											<div>配送费￥{{store.delivery_price}}</div> -->
										</div>
										<div class="item-min-delivery-right" v-if="store.delivery_mode == 2">{{store.delivery_title}}</div>
									</div>
								</router-link>
								<div class="discount-box" @click="onToggleDiscount(index)" v-if="store.activity && (store.activity.num > 0 || store.activity.labels_num > 0)">
									<div class="toggle">
										<div class="icon " :class="{'icon-fold': store.activity.is_show_all, 'icon-unfold': !store.activity.is_show_all}" v-if="(theme.store.discount_style == 1 && store.activity.num > 2) || (theme.store.discount_style == 2 && store.activity.labels_num > 4)"></div>
									</div>
									<template v-if="theme.store.discount_style == 1">
										<template v-for="(activityItem, index) in store.activity.items">
											<div class="single-line" v-if="index < 2 || (store.activity.is_show_all && index >= 2)">
												<img class="discount-icon" :src="'static/img/' + activityItem.type + '_b.png'">
												<div class="discount-text">{{activityItem.title}}</div>
											</div>
										</template>
									</template>
									<template v-else-if="theme.store.discount_style == 2">
										<div class="label-wrap" :class="{autoHeight: store.activity.is_show_all}">
											<span :class="activityLabel.class" v-for="(activityLabel, index) in store.activity.labels" v-if="index < 4 || (store.activity.is_show_all && index >= 4)">{{activityLabel.title}}</span>
										</div>
									</template>
								</div>
								<div class="hot-box" v-if="store.hot_goods && store.hot_goods.length > 0">
									<template v-for="(item, index) in store.hot_goods" >
										<router-link :to="util.getUrl({path: '/pages/store/goodsDetail', query: {sid: store.id, id: item.id}})">
											<div class="hot-box-item">
												<div class="hot-t border-1px">
													<img v-lazy="{src: item.thumb, loading: lazyload.lazyload_goods}">
													<div class="">{{item.discount}}折</div>
												</div>
												<div class="hot-b">
													<div class="shop-name">{{item.title}}</div>
													<div class="shop-price">
														<div class="now-price">¥{{item.price}}</div>
														<div class="old-price" v-if="item.old_price > 0">¥{{item.old_price}}</div>
													</div>
												</div>
											</div>
										</router-link>
									</template>
								</div>
							</div>
						</div>
					</div>
				</template>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			stores: Array,
			lazyload: {
				type: Object,
				default: () => {
					return {
						lazyload_goods: '',
						lazyload_store: '',
					}
				}
			},
		},
		methods: {
			onToggleDiscount(index) {
				this.$set(this.stores[index]['activity'], 'is_show_all', !this.stores[index]['activity']['is_show_all'])
			}
		},
		mounted() {
		}
	}
</script>

<style>
	@import "../../static/css/diy.css";
</style>


// WEBPACK FOOTER //
// src/components/storeGroup.vue