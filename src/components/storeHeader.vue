<template>
	<div id="store-header">
		<!--店铺招牌-->
		<div class="store-sign">
			<img :src="store.data.shopSign" alt="" v-if="store.data && store.data.shopSign">
		</div>
		<div class="mask-block">
			<img src="static/img/mask-bg.png" alt="">
		</div>
		<!--店铺头部-->
		<div class='header clearfix'>
			<!-- 店铺详情 -->
			<div class='top clearfix'>
				<div class='avatar'>
					<img :src="store.logo">
				</div>
				<div class='campaign'>
					<div class='text' v-if="table">
						<div v-if="table.category">{{table.category.title}}~{{table.title}}号桌</div>
						<div class='fg-line' v-if="store.serve_fee && store.serve_fee.fee > 0"></div>
						<div v-if="store.serve_fee && store.serve_fee.fee > 0">服务费{{store.serve_fee.type == 1 ? '￥'+store.serve_fee.fee : store.serve_fee.fee+'% 订单消费'}}</div>
					</div>
					<div class='text' v-else-if="table_category">
						<div>{{table_category.title}}</div>
						<div class='fg-line'></div>
						<div>{{reserveExtra.day}}~{{reserveExtra.time}}</div>
					</div>
					<div class='text' v-else>
						<div>{{store.content}}</div>

						<!-- <div>起送¥{{store.send_price > 0 ? store.send_price : '0'}}</div>
						<div class='fg-line'></div>
						<div>配送¥{{store.delivery_price > 0 ? store.delivery_price : '0'}}</div>
						<div class='fg-line'></div>
						<div>{{store.delivery_time}}分钟</div>
						<div class='allocation-icon' v-if="store.delivery_mode == 2">{{store.delivery_title}}</div> -->
					</div>
					<!-- 公告 -->
					<div class="notice flex-lr">
						<van-icon name="voice" class="c-white font-14 margin-5-r"></van-icon>
						<van-notice-bar class="flex-1" delay="3" background="inherit" color="#ffffff" :scrollable="true" v-if="store.notice">
							{{store.notice}}
						</van-notice-bar>
					</div>
				</div>
				<template v-if="table">
					<div class='collect' @click="onCallServe(store.id, table.id)">
						<van-icon name='notice'></van-icon>
						<div class='text'>呼叫</div>
					</div>
					<router-link class='collect' :to="util.getUrl({path: '/pages/order/index'})">
						<van-icon name='order'></van-icon>
						<div class='text'>订单</div>
					</router-link>
				</template>
				<template v-else>
					<div class='collect' v-if="store.is_favorite == 1" @click="onFavor(store.id)">
						<van-icon name='favoritesfilling'></van-icon>
						<div class='text'>已收藏</div>
					</div>
					<div class='collect' v-else @click="onFavor(store.id)">
						<van-icon name='favorite'></van-icon>
						<div class='text'>收藏</div>
					</div>
				</template>
				<div style="clear:both;"></div>
			</div>
			<!-- 活动栏 -->
			<div class='activity-box clearfix'>
				<template v-if="store.activity && store.activity.num && store.activity.num > 0">
					<van-swipe class="activity-scroll" :autoplay="2000" vertical :show-indicators="false">
						<template v-for="activity in store.activity.items">
							<van-swipe-item>
								<div class="swiper-slide swiper-slide-prev">
									<img :src="'static/img/' + activity.type + '_b.png'" alt="">
									<div>{{activity.title}}</div>
								</div>
							</van-swipe-item>
						</template>
					</van-swipe>
					<div class='more'>
						<router-link :to="util.getUrl({path: '/pages/store/index', query: {sid: store.id}})">
							{{store.activity.num}}个活动
							<van-icon name='xiangyou1'></van-icon>
						</router-link>
					</div>
				</template>
				<div class="interim" v-else>
					<!-- <div>起送¥{{store.send_price > 0 ? store.send_price : '0'}}</div>
					<div class='fg-line'></div>
					<div>配送¥{{store.delivery_price}}</div>
					<div class='fg-line'></div>
					<div>{{store.delivery_time}}分钟</div> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	export default {
		name: "storeHeader",
		props: {
			store: Object,
			table: Object,
			table_category: Object,
		},
		data() {
			return {

			}
		},
		methods: {
			onFavor(sid) {
				if(this.store.is_favorite) {
					var type = 'cancal';
				} else {
					var type = 'star';
				}
				this.util.request({
					url: 'wmall/member/op/favorite',
					data: {
						id: sid,
						type: type
					},
				}).then((res) => {
					let result = res.data.message;
					if(res.data.message.errno == 0) {
						if(type == 'star') {
							this.$toast('添加收藏成功');
							this.store.is_favorite = 1;
						} else {
							this.$toast('取消收藏成功');
							this.store.is_favorite = 0;
						}
					} else {
						this.$toast(res.data.message.message);
					}

				})
			},
			onCallServe(sid, table_id) {
				this.util.request({
					url: 'wmall/store/call/index',
					data: {
						sid: sid,
						table_id: table_id
					},
				}).then((res) => {
					this.$toast(res.data.message.message);
				})
			}
		},
		computed: {
			...mapState([
				'reserveExtra'
			]),
		}
	}
</script>

<style >
	/* 头部 */
	#store-header{
		position: relative;
		width: 100%;
		height: 86px;
	}
	#store-header .store-sign, #store-header .mask-block{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 20;
		opacity: 0.5;
	}
	#store-header .mask-block img, #store-header .store-sign img{
		width: 100%;
		height: 100%;
	}
	#store-header .store-sign{
		z-index: 10;
		background-color: #fff;
	}
	#store-header .header{
		padding: 10px 10px 7px 10px;
		top: 0;
		left: 0;
		right: 0;

		position: absolute;
		z-index: 30;
	}
	#store-header .header .top{
		display: flex;
		flex-flow: row nowrap;
		align-items: flex-start;
		justify-content: space-between;
	}
	#store-header .header .avatar{
		width: 40px;
		height: 40px;
		overflow: hidden;
		display: inline-block;
	}
	#store-header .header .avatar img{
		width: 100%;
		height: 100%;
	}
	#store-header .header .campaign{
		flex: 1;
		margin-left: 10px;
		font-size: 12px;
	}
	#store-header .header .campaign .text{
		font-size: 12px;
		color: #fff;
		vertical-align: middle;
	}
	#store-header .header .campaign .text div{
		display: inline-block;
	}
	#store-header .header .campaign .text div:nth-child(2){
		margin-right: 5px;
	}
	#store-header .header .campaign .text .allocation-icon{
		margin-left: 5px;
		position:relative;
		background-color:#FFD161;
		height:15px;
		line-height:15px;
		padding:0 6px;
		font-size:10px;
		color:#333;
		font-weight:normal;
		vertical-align:middle;
	}
	#store-header .header .campaign .text .allocation-icon::before, .header .text .allocation-icon::after{
		content: '';
		position: absolute;
		border: 2px solid #484242;
		width: 0;
		height: 0;
		font-size: 0;
	}
	#store-header .header .campaign .text .allocation-icon::before{
		left: 0;
		top: 0;
		border-color: #ff2d4b #FFD161 #FFD161 #ff2d4b;
	}
	#store-header .header .campaign .text .allocation-icon::after{
		right: 0;
		bottom: 0;
		border-color: #FFD161 #ff2d4b #ff2d4b #FFD161;
	}
	#store-header .header .campaign .van-notice-bar{
		padding: 0px;
		line-height: 1;
		height: auto;
	}
	#store-header .header .campaign .van-notice-bar .van-notice-bar__wrap{
		height: 22px;
		line-height: 22px;
	}
	#store-header .header .campaign .notice .van-icon{
		font-size: 14px;
	}
	#store-header .header .collect{
		width: 42px;
		color: #fff;
		text-align: right;
	}
	#store-header .header .collect .van-icon{
		font-size: 20px;
		width: 100%;
		text-align: right;
	}
	#store-header .header .collect .text{
		font-size: 12px;
		margin-top: 3px;
	}
	#store-header .header .activity-box{
		width: 100%;
		height: 19px;
		position: relative;
		margin-top: 10px;
	}
	#store-header .header .activity-box .interim{
		font-size:12px;
		color:#fff;
		vertical-align:middle;
	}
	#store-header .header .activity-box .interim>div{
		display: inline-block;
	}
	#store-header .header .activity-box .activity-scroll{
		height: 100%;
		color: #fff;
		font-size: 12px;
	}
	#store-header .header .activity-box .activity-scroll .swiper-slide{
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
	}
	#store-header .header .activity-box .activity-scroll .swiper-slide img{
		width: 15px;
		height: 15px;
		margin-right: 5px;
	}
	#store-header .header .activity-box .activity{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	#store-header .header .activity-box .activity .icon{
		width: 18px;
		height: 18px;
		display: inline-block;
		float: left;
	}
	#store-header .header .activity-box .activity .icon img{
		width: 100%;
		height: 100%;
	}
	#store-header .header .activity-box .activity .tags{
		font-size: 12px;
		display: inline-block;
		float: left;
		text-align: center;
	}
	#store-header .header .activity-box .activity .icon-b img{
		float: left;
	}
	#store-header .header .activity-box .activity span{
		font-size: 12px;
		color: #fff;
		float: left;
	}
	#store-header .header .activity-box .more{
		position: absolute;
		right: 0px;
		top: 4px;
		color: #fff;
		font-size: 12px;
	}
	#store-header .header .activity-box .more a{
		font-size: 12px;
		color: #fff;
	}
</style>


// WEBPACK FOOTER //
// src/components/storeHeader.vue
