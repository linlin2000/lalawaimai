<template>
	<div id="freeLunch-mealcoupon">
		<public-header title="我的餐券"></public-header>
		<div class="content">
			<div class="myticket">
				<div class="ticket-value"><span>{{rewards ? rewards : '?'}}</span>元</div>
				<span>中奖总金额</span>
			</div>
			<van-tabs v-model="status" swipeable>
				<van-tab title="我参与的">
					<van-list
						v-model="participants_part.loading"
						:finished="participants_part.loaded"
						:immediate-check="false"
						:offset="100"
						@load="onGetParticipants(0)"
						v-if="!participants_part.empty"
					>
						<div class="participant-list van-hairline--top">
							<router-link :to="util.getUrl({path: '/package/pages/freelunch/detail', query: {record_id: item.record_id}})" class="participant-item van-hairline--bottom" v-for="(item, index) in participants_part.data" :key="index">
								<div class="participant-ico">
									<img src="static/img/freeLunch_mealcoupon.png" alt="">
								</div>
								<div class="participant-info">
									<div class="participant-title">{{item.title}}</div>
									<div class="has-participant">第{{item.serial_sn}}期 | 我已参与 <span>{{item.total}}</span> 次</div>
								</div>
								<div class="status">
									<span>{{item.text}}</span>
									<van-icon name='right'></van-icon>
								</div>
							</router-link>
						</div>
						<div class="loaded" v-if="participants_part.loaded">
							<div class="loaded-tips">没有更多了</div>
						</div>
					</van-list>
					<div class="not-login" v-else>
						<img src="static/img/no_order.png" alt="">
						<h3>您还没有记录哦</h3>
						<p>好运常在，买的多机会大</p>
						<div class="login">
							<router-link :to="util.getUrl({path: '/package/pages/freelunch/index'})">去试试手气</router-link>
						</div>
					</div>
				</van-tab>
				<van-tab title="中奖纪录">
					<van-list
						v-model="participants_prize.loading"
						:finished="participants_prize.loaded"
						:immediate-check="false"
						:offset="100"
						@load="onGetParticipants(1)"
						v-if="!participants_prize.empty"
					>
						<div class="participant-list van-hairline--top">
							<router-link :to="util.getUrl({path: '/package/pages/freelunch/detail', query: {record_id: item.record_id}})" class="participant-item van-hairline--bottom" v-for="item in participants_prize.data" :key="item.record_id">
								<div class="participant-ico">
									<img src="static/img/freeLunch_mealcoupon.png" alt="">
								</div>
								<div class="participant-info">
									<div class="participant-title">{{item.title}}</div>
									<div class="has-participant">第{{item.serial_sn}}期 | 我已参与 <span>{{item.total}}</span> 次</div>
								</div>
								<div class="status">
									<span>{{item.text}}</span>
									<van-icon name='right'></van-icon>
								</div>
							</router-link>
						</div>
						<div class="loaded" v-if="participants_prize.loaded">
							<div class="loaded-tips">没有更多了</div>
						</div>
					</van-list>
					<div class="not-login" v-else>
						<img src="static/img/no_order.png" alt="">
						<h3>您还没有记录哦</h3>
						<p>好运常在，买的多机会大</p>
						<div class="login">
							<router-link :to="util.getUrl({path: '/package/pages/freelunch/index'})">去试试手气</router-link>
						</div>
					</div>
				</van-tab>
			</van-tabs>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicFooter from '@/components/footer'
	import PublicHeader from '@/components/header'
	export default {
		components: {
			PublicHeader,
			PublicFooter,
		},
		data() {
			return {
				status: 0,
				participants_part: {
					loading: false,
					min: 0,
					loaded: false,
					empty: false,
					data: []
				},
				participants_prize: {
					loading: false,
					min: 0,
					loaded: false,
					empty: false,
					data: []
				},
				rewards: {},
				activity: {},
				showPreLoading: true
			}
		},
		methods: {
			onLoad() {
				this.onGetParticipants(0);
				this.onGetParticipants(1);
			},
			onGetParticipants(status) {
				if(status == 0 && this.participants_part.loaded){
					return false;
				}
				if(status == 1 && this.participants_prize.loaded){
					return false;
				}
				this.util.request({
					url: 'freeLunch/mealCoupon',
					data: {
						status: status,
						min: status ? this.participants_prize.min : this.participants_part.min
					}
				}).then((res) => {
					this.showPreLoading = false;
					var result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					if(status == 0) {
						this.participants_part.data = [...this.participants_part.data, ...result.message];
						this.participants_part.min = result.min;
						if(!this.participants_part.data.length) {
							this.participants_part.empty = true;
						}
						if(result.message.length < 15){
							this.participants_part.loaded = true;
						}
						this.participants_part.loading = false;
					} else {
						this.participants_prize.data = [...this.participants_prize.data, ...result.message];
						this.participants_prize.min = result.min;
						if(!this.participants_prize.data.length) {
							this.participants_prize.empty = true;
						}
						if(result.message.length < 15){
							this.participants_prize.loaded = true;
						}
						this.participants_prize.loading = false;
					}
					this.activity = result.activity;
					this.rewards = result.rewards;
				})
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#freeLunch-mealcoupon .van-nav-bar{
		background-color: #ff2d4b!important;
		color: #fff!important;
	}
	#freeLunch-mealcoupon .van-hairline--bottom .van-icon-left{
		color: #fff!important;
	}
	#freeLunch-mealcoupon .content .myticket{
		font-size: 10px;
		padding: 36px;
		align-items: center;
		height: 140px;
		color: #fff;
		background-color: #ff2d4b;
		background-image: url(../../../static/img/mealcoupon.png);
		background-repeat: no-repeat;
		background-size: 100%;
		background-position: bottom;
		text-align: center;
	}
	#freeLunch-mealcoupon .content .myticket .ticket-value{
		line-height: 45px;
	}
	#freeLunch-mealcoupon .content .myticket .ticket-value span{
		font-weight: bold;
		font-size: 30px;
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .participant-list{
		background-color: #fff;
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .participant-list .participant-item{
		display: block;
		padding: 10px;
		overflow: hidden;
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .participant-list .participant-item .participant-ico{
		width: 36px;
		height: 36px;
		float: left;
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .participant-list .participant-item .participant-ico img{
		border: none;
		max-width: 100%;
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .participant-list .participant-item .participant-info{
		padding-left: 10px;
		color: #999;
		float: left;
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .participant-list .participant-item .participant-info .participant-title{
		color: #333;
		font-size: 14px;
		line-height: 21px
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .participant-list .participant-item .participant-info .has-participant{
		font-size: 12px;
		line-height: 18px
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .participant-list .participant-item .participant-info .has-participant span{
		color: #333;
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .participant-list .participant-item .status{
		color: #999;
		font-size: 10px;
		margin-top: 12px;
		float: right;
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .participant-list .participant-item .status .van-icon{
		font-size: 14px;
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .not-login{
		margin-top: 40px;
		text-align: center;
		font-size: 14px;
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .not-login img{
		display: block;
		width: 120px;
		margin: 0 auto;
		border: none;
		max-width: 100%;
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .not-login h3{
		color: #666;
		font-weight: normal;
		margin: 6px 0;
		line-height: 24px;
		font-size: 16px;
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .not-login p{
		margin-bottom: 20px;
		color: #999;
		font-size: 12px;
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .not-login .login{
		margin: 0 auto;
	}
	#freeLunch-mealcoupon .content .van-tabs .van-tab__pane .not-login .login a{
		display: inline-block;
		color: #fff;
		background-color: #f6383a;
		padding: 12px 20px;
		border: none;
		cursor: pointer;
		border-radius: 5px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/freelunch/mealcoupon.vue