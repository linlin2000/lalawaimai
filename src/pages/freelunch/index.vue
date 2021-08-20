<template>
	<div id="freeLunch-index">
		<public-header :title="title"></public-header>
		<div class="content">
			<div class="nav-tab">
				<ul class="flex-lr">
					<li :class="{active: type == 'common'}">
						<router-link :to="util.getUrl({path: '/package/pages/freelunch/index'})">
							{{title}}
						</router-link>
					</li>
					<li :class="{active: type == 'plus'}" v-if="freelunch.plus_status == 1">
						<router-link :to="util.getUrl({path: '/package/pages/freelunch/index', query: {type: 'plus'}})">
							{{title}}
						</router-link>
						<span class="badge">{{freelunch.pre_plus_reward_fee}}元红包</span>
					</li>
					<li class="pull-right">
						<router-link :to="util.getUrl({path: '/package/pages/freelunch/mealCoupon'})">
							<img class="dash-line" src="static/img/freeLunch_dash_line.png" alt="">
							<img class="coupon-icon" src="static/img/freeLunch_coupon.png" alt="">
							<span>我的餐券</span>
						</router-link>
					</li>
				</ul>
			</div>
			<div class="content-inner">
				<div class="prize">
					<img :src="type == 'common' ? freelunch.thumb : freelunch.plus_thumb" alt="">
					<div class="batch">第{{record.serial_sn}}期</div>
					<router-link :to="util.getUrl({path: '/package/pages/freelunch/rule'})" class="rule">活动规则</router-link>
					<div class="prize-info">
						<div class="pirze-inner">
							<div class="draw-condition">每满{{record.partaker_total}}人次，即抽取1人获得 <span>{{record.reward_fee}}元无门槛红包</span></div>
							<div class="progress">
								<div class="progress-bar" :style="{width: record.percent + '%'}"></div>
							</div>
							<div class="prize-data">
								总需人次: {{record.partaker_total}} <span class="vertical-line">|</span> 剩余人次: {{record.partaker_dosage}}
							</div>
						</div>
					</div>
				</div>
				<div class="no-participate">
					<template v-if="member_partaker.nums">
						<div class="participate-num">我参与了: <span>{{member_partaker.nums}}</span> <strong>次</strong></div>
						<div class="participate-code" v-for="item in member_partaker.data" :key="item.id">参与号码: <strong>{{item.number}}</strong></div>
					</template>
					<template v-else>
						您没有参与本期活动，立即参与领红包吧！
					</template>
				</div>
				<div class="lucky-history" v-if="luckiers">
					<router-link :to="util.getUrl({path: '/package/pages/freelunch/luckier'})" class="lucky-inner">
						<div class="lucky-tab van-hairline--right">
							<img src="static/img/freeLunch_luckier.png" alt="">
							<div class="subtitle">中奖直播</div>
						</div>
						<div class="luckier-list">
							<van-swipe :autoplay="1000" vertical :show-indicators="false">
								<van-swipe-item class="flex-lr" v-for="item in luckiers" :key="item.id">
									<img class="luckier-avatar" :src="item.avatar" alt="">
									<div class="luckier-info">
										<p>{{item.nickname}} <span class="c-gray">{{item.time}}</span></p>
										<p>中奖 <span class="c-danger">{{item.reward_fee}}</span> 元</p>
									</div>
								</van-swipe-item>
							</van-swipe>
						</div>
						<van-icon name='right' class="lucky-icon"></van-icon>
					</router-link>
				</div>
				<div class="current-participant">
					<div class="participant-title border-1px-b">
						<span>本期参与人</span>
						<span class="start-time">{{record.starttime_cn}} 开始</span>
					</div>
					<van-list
						v-model="partakers.loading"
						:finished="partakers.loaded"
						:immediate-check="false"
						:offset="100"
						@load="onGetPartakers"
						v-if="!partakers.empty"
					>
						<div class="participant-list flex-lr" v-for="(item, index) in partakers.data" :key="item.id">
							<div class="col-20">
								<img :src="item.avatar" alt="">
							</div>
							<div class="col-80 " :class="{'van-hairline--bottom': index < partakers.data.length - 1}">
								<span class="participant-name">{{item.nickname}}</span>
								<span class="participant-time">{{item.addtime}}</span>
							</div>
						</div>
					</van-list>
					<div class="loaded" v-if="partakers.loaded && !partakers.empty">
						<div class="loaded-tips" style="background-color: #fff;">我是有底线的</div>
					</div>
					<div class="loaded" v-if="partakers.empty">
						<div class="loaded-tips" style="background-color: #fff;">暂无参与记录</div>
					</div>
				</div>
			</div>
		</div>
		<div class="bar">
			<van-button size="normal" type="danger" :block="true" @click="onSubmit" :disabled="islegal ? false : true" v-if="partake_status.errno == 0" class="font-16">立即参与</van-button>
			<van-button size="normal" type="danger" :block="true" :disabled="true" class="font-16" v-else>{{partake_status.message}}</van-button>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		components: {
			PublicHeader,
		},
		data() {
			return {
				title: '',
				type: 'common',
				freelunch: {},
				luckiers: [],
				member_partaker: {},
				partake_status: {},
				record: {},
				partakers: {
					min: 0,
					loading: false,
					loaded: false,
					empty: false,
					data: []
				},
				islegal: false
			}
		},
		watch: {
			// 对路由变化作出响应...
			'$route' (to, from) {
				this.title = '';
				this.type = 'common';
				this.freelunch = {};
				this.luckiers = [];
				this.member_partaker = {};
				this.partake_status = {};
				this.record = {};
				this.partakers = {
					min: 0,
					loading: false,
					loaded: false,
					empty: false,
					data: []
				};
				this.islegal = false;
				if(this.$route.query.type) {
					this.type = this.$route.query.type
				}
				this.onLoad();
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'freeLunch/freeLunch',
					data: {
						type: this.type
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					result = result.message;
					this.freelunch = result.freelunch;
					this.luckiers = [...this.luckiers, ...result.luckiers];
					this.member_partaker = result.member_partaker;
					this.partake_status = result.partake_status;
					this.record = result.record;
					this.title = this.type == 'common' ? this.freelunch.title : this.freelunch.title + 'Plus';
					this.onGetPartakers();
					this.islegal = true;
				})
			},
			onGetPartakers() {
				if(this.partakers.loaded) {
					return false;
				}
				this.util.request({
					url: 'freeLunch/freeLunch/partakers',
					data: {
						min: this.partakers.min,
						record_id: this.record.id
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
			
					this.partakers.min = result.min;
					this.partakers.data = [...this.partakers.data, ...result.message]
					if(result.message.length < 10 || !result.min) {
						this.partakers.loaded = true;
					}
					if(!this.partakers.data.length) {
						this.partakers.empty = true;
					}
					this.partakers.loading = false;
				})
			},
			onSubmit() {
				if(!this.islegal) {
					return false;
				}
				this.islegal = false;
				this.util.request({
					url: 'freeLunch/freeLunch/partake',
					data: {
						record_id: this.record.id
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					let order_id = result.message;
					this.$router.replace(this.util.getUrl({path: '/pages/public/pay', query: {order_id: order_id, order_type: 'freelunch'}}))
				})
			}
		},
		created() {
			if(this.$route.query.type) {
				this.type = this.$route.query.type;
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#freeLunch-index .content{
		bottom: 70px;
	}
	#freeLunch-index .van-nav-bar{
		background-color: #ff2d4b!important;
		color: #fff!important;
	}
	#freeLunch-index .van-hairline--bottom .van-icon{
		color: #fff!important;
	}
	#freeLunch-index .content .nav-tab{
		background-color: #ff2d4b;
		position: fixed;
		top: 46px;
		z-index: 10;
		width: 100%;
	}
	#freeLunch-index .content .nav-tab ul{
		color: #fff;
		font-size: 14px;
		padding: 0 20px;
	}
	#freeLunch-index .content .nav-tab ul li.active a{
		font-weight: bold;
	}
	#freeLunch-index .content .nav-tab ul li.active:after{
		content: '';
		position: absolute;
		left: 50%;
		transform: translate(-50%, 0);
		bottom: 6px;
		width: 80%;
		height: 2px;
		background-color: #fff;
	}
	#freeLunch-index .content .nav-tab ul li{
		position: relative;
		display: inline-block;
		height: 60px;
		line-height: 60px;
		padding: 0;
		margin: 0;
	}
	#freeLunch-index .content .nav-tab ul li a{
		color: #fff;
	}
	#freeLunch-index .content .nav-tab ul li .badge{
		display: inline-block;
		vertical-align: middle;
		color: #fff;
		position: absolute;
		right: -40px;
		top: 6px;
		height: 16px;
		line-height: 16px;
		white-space: nowrap;
		border-radius: 8px;
		padding: 0 8px;
		font-size: 12px;
		font-weight: normal;
		color: #fff;
		background-color: #fc692a;
	}
	#freeLunch-index .content .nav-tab ul .pull-right{
		float: right;
		position: relative;
		display: inline-block;
		height: 60px;
		line-height: 60px;
	}
	#freeLunch-index .content .nav-tab ul .pull-right .dash-line{
		margin-right: 10px;
		height: 16px;
		width: 1px;
		vertical-align: middle;
		border: none;
		max-width: 100%;
	}
	#freeLunch-index .content .nav-tab ul .pull-right .coupon-icon{
		margin-right: 2.6666px;
		width: 19px;
		height: 13px;
		vertical-align: middle;
		border: none;
		max-width: 100%;
	}
	#freeLunch-index .content .content-inner{
		margin-top: 60px;
	}
	#freeLunch-index .content .content-inner .prize{
		position: relative;
		height: 260px;
	}
	#freeLunch-index .content .content-inner .prize img{
		width: 100%;
		height: 100%;
	}
	#freeLunch-index .content .content-inner .prize .batch{
		position: absolute;
		top: 10px;
		left: 10px;
		font-size: 12px;
		padding: 4px;
		opacity: 0.85;
		background-color: #fff;
		color: #333;
		font-weight: bold;
		border: 1px solid #333;
		border-radius: 4px;
		line-height: 18px;
	}
	#freeLunch-index .content .content-inner .prize .rule{
		display: inline-block;
		position: absolute;
		top: -2px;
		right: 10px;
		padding: 6px;
		font-size: 12px;
		font-weight: bold;
		color: #ff3f3f;
		background: url(../../../static/img/rule.png) no-repeat;
		background-size: 40px 50px;
		width: 40px;
		min-height: 50px;
		text-align: center;
		line-height: 1.2;
	}
	#freeLunch-index .content .content-inner .prize .prize-info{
		font-size: 12px;
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 10px;
		color: #fff;
		background-color: rgba(191, 8, 8, .6);
		text-align: center;
	}
	#freeLunch-index .content .content-inner .prize .prize-info .draw-condition{
		opacity: 0.85;
		line-height: 18px;
	}
	#freeLunch-index .content .content-inner .prize .prize-info .draw-condition span{
		opacity: 1;
		font-weight: bold;
	}
	#freeLunch-index .content .content-inner .prize .prize-info .progress{
		margin: 10px auto;
		height: 4px;
		width: 80%;
		background-color: rgba(0, 0, 0, .2);
		border-radius: 2px;
	}
	#freeLunch-index .content .content-inner .prize .prize-info .progress .progress-bar{
		height: 100%;
		border-radius: 2px;
		background-image: linear-gradient(to right, #efab0b, #fffbba);
		animation: bar-grow 0.5s;
		transform-origin: left;
	}
	#freeLunch-index .content .content-inner .prize .prize-info .prize-data{
		font-size: 0.7rem;
		font-weight: bold;
		line-height: 21px;
	}
	#freeLunch-index .content .content-inner .prize .prize-info .prize-data .vertical-line{
		opacity: 0.7;
		font-weight: bold;
	}
	#freeLunch-index .content .content-inner .no-participate{
		margin: 10px;
		padding: 10px;
		font-size: 14px;
		background: #fff;
		border-radius: 4px;
		text-align: center;
		color: #999;
	}
	#freeLunch-index .content .content-inner .no-participate .participate-num{
		text-align: left;
		line-height: 21px;
	}
	#freeLunch-index .content .content-inner .no-participate .participate-num span{
		color: #fc692a;
		font-weight: bold;
	}
	#freeLunch-index .content .content-inner .no-participate strong{
		color: #333;
		font-weight: 700;
	}
	#freeLunch-index .content .content-inner .no-participate .participate-code{
		text-align: left;
		line-height: 21px;
	}
	#freeLunch-index .content .content-inner .lucky-history{
		padding: 10px;
		margin: 10px 0;
		background-color: #fff;
		overflow: hidden;
	}
	#freeLunch-index .content .content-inner .lucky-history .lucky-inner{
		display: block;
		position: relative;
		/*overflow: hidden;*/
	}
	#freeLunch-index .content .content-inner .lucky-history .lucky-tab{
		width: 21%;
		color: #ff6000;
		text-align: center;
		padding-right: 16px;
		float: left;
	}
	#freeLunch-index .content .content-inner .lucky-history .lucky-inner .lucky-tab img{
		width: 100%;
		height: 16px;
		margin-bottom: 5px;
	}
	#freeLunch-index .content .content-inner .lucky-history .lucky-inner .lucky-tab .subtitle{
		font-size: 14px;
		border-top: 1px solid rgba(255, 96, 0, .50);
		margin-top: 3.2px;
		line-height: 22px;
	}
	#freeLunch-index .content .content-inner .lucky-history .lucky-inner .luckier-list{
		padding: 0 10px;
		width: 70%;
		font-size: 12px;
		margin-top: 4px;
		height: 40px;
		overflow: hidden;
		float: left;
		position: relative;
		z-index: 1;
	}
	#freeLunch-index .content .content-inner .lucky-history .lucky-inner .luckier-list .van-swipe{
		width: 100%;
		height: 100%;
	}
	#freeLunch-index .content .content-inner .lucky-history .lucky-inner .luckier-list .van-swipe img{
		width: 40px;
		height: 40px;
		border-radius: 100%;
	}
	#freeLunch-index .content .content-inner .lucky-history .lucky-inner .luckier-list .van-swipe .luckier-info{
		width: 75%;
		line-height: 1.5;
		font-size: 12px;
	}
	#freeLunch-index .content .content-inner .lucky-history .lucky-inner .lucky-icon{
		color: #999;
		position: absolute;
		top: 26px;
		right: 7px;
		margin-top: -10px;
		font-size: 12px;
	}
	#freeLunch-index .content .content-inner .current-participant{
		padding: 0 10px;
		background-color: #fff;
		font-size: 14px;
		overflow: hidden;
	}
	#freeLunch-index .content .content-inner .current-participant .participant-title{
		padding: 16px 0;
	}
	#freeLunch-index .content .content-inner .current-participant .participant-title .start-time{
		color: #999;
		float: right;
	}
	#freeLunch-index .content .content-inner .current-participant .participant-list .col-20{
		width: 15%;
	}
	#freeLunch-index .content .content-inner .current-participant .participant-list .col-20 img{
		width: 36px;
		height: 36px;
		border-radius: 100%;
	}
	#freeLunch-index .content .content-inner .current-participant .participant-list .col-80{
		padding: 6px 0;
		width: 85%;
	}
	#freeLunch-index .content .content-inner .current-participant .participant-list .col-80 .participant-name{
		display: block;
		line-height: 21px;
	}
	#freeLunch-index .content .content-inner .current-participant .participant-list .col-80 .participant-time{
		display: block;
		line-height: 21px;
		color: #999;
	}
	#freeLunch-index .bar{
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 999;
		width: 100%;
		height: 70px;
		padding: 10px;
		border-top: 1px solid #e7e7e7;
		background: #fff;
	}
	#freeLunch-index .bar .van-button{
		width: 100%;
		height: 100%;
		border-radius: 4px;
		background-color: #ff2d4b;
		color: #fff;
		line-height: 50px;
	}
	#freeLunch-index .loaded .loaded-tips{
		background-color: #fff;
	}
</style>



// WEBPACK FOOTER //
// src/pages/freelunch/index.vue