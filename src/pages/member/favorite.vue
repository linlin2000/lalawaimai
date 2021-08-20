<template>
	<div id="favorite">
		<public-header title="我的收藏"></public-header>
		<div class="content">
			<van-list v-model="stores.loading" :finished="stores.finished" @load="onLoad" v-if="stores.data.length > 0" :offset="100" :immediate-check="false">
				<div class="diy-waimai-store-box" >
					<div class="waimai-store-item-list">
						<template v-for="(store, index) in stores.data">
							<div class="waimai-store-item border-1px-b" :class="{disabled: store.is_rest == 1}">
								<div class="mian-content-box">
									<div class="content-left border-1px">
										<router-link class="item-image" :to="util.getUrl({path: store.url})">
											<div class="item-rest" v-if="store.is_rest == 1">休息中</div>
											<img :src="store.logo">
										</router-link>
									</div>
									<div class="content-right">
										<router-link :to="util.getUrl({path: store.url})">
											<div class="item-name-wrap">
												<div class="item-name">{{store.title}}</div>
											</div>
											<div class="item-score-time">
												<div class="item-score-sale">
													<div class="item-star-box">
														<van-rate v-model="store.score" :size="12" disabled-color="#FF5571" disabled/>
													</div>
												</div>
												<view class="item-sale">月售 {{store.sailed}}</view>
												<div class="time-distance">
													<div class="avg_delivery_time">{{store.delivery_time}}分钟</div>
												</div>
											</div>
											<div class="item-min-delivery">
												<div class="item-min-delivery-left">
													<!-- <div>起送价￥{{store.send_price}}</div>
													<div class="line">|</div>
													<div>配送费￥{{store.delivery_price}}</div> -->
												</div>
												<div class="item-min-delivery-right br">{{store.delivery_title}}</div>
											</div>
										</router-link>
										<div class="discount-box">
											<div class="toggle">
												<div class="icon " :class="{'icon-fold': store.activity.is_show_all, 'icon-unfold': !store.activity.is_show_all}" v-if="store.activity.num > 2" @click="onToggleActivity(index)"></div>
											</div>
											<template v-for="(activityItem, activityIndex) in store.activity.items">
												<div class="single-line" v-if="activityIndex < 2 || (store.activity.is_show_all && activityIndex >= 2)">
													<img class="discount-icon" :src="'static/img/' + activityItem.type + '_b.png'">
													<div class="discount-text">{{activityItem.title}}</div>
												</div>
											</template>
										</div>
									</div>
								</div>
							</div>
						</template>
					</div>
				</div>
			</van-list>
			<div v-else class="no-data">
				<img src= "static/img/collect_no_bg.png" alt="" />
				<p>您没有收藏</p>
			</div>
		</div>
		<transition name="loading">
			<iloading v-show="showLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import loading from '@/components/loading'
	export default {
		data() {
			return {
				stores: {
					min: 0,
					loading: false,
					finished: false,
					data: []
				},
				showLoading: true
			}
		},
		components: {
			PublicHeader,
			loading
		},
		methods: {
			onLoad() {
				if(this.stores.finished) {
					return false;
				}
				this.util.request({
					url: 'wmall/member/favorite',
					data: {
						min: this.stores.min
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message)
						return;
					}
					this.hideLoading();
					this.stores.data = [...this.stores.data, ...result.message];
					this.stores.loading = false;
					this.stores.min = result.min;
					if(result.message.length < 10 || !result.min) {
						this.stores.finished = true;
					}
				})
			},
			onToggleActivity(index) {
				this.stores.data[index]['activity']['is_show_all'] = !this.stores.data[index]['activity']['is_show_all'];
				this.stores.data[index]['activity']['items'] = [...this.stores.data[index]['activity']['items']];
			},
			hideLoading(){
				this.showLoading = false;
			},
		},
		mounted () {
			this.onLoad();
		},
	}
</script>

<style>
	@import "../../../static/css/diy.css";
	.loading-enter-active, .loading-leave-active {
		transition: opacity .7s
	}
	.loading-enter, .loading-leave-active {
		opacity: 0
	}
</style>


// WEBPACK FOOTER //
// src/pages/member/favorite.vue