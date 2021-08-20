<template>
	<div id="ordergrant-index">
		<public-header title="下单有礼"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<div class="banner">
				<div class="avatar">
					<img :src="member.avatar" alt="">
				</div>
				<router-link :to="util.getUrl({path: '/package/pages/ordergrant/record'})" class="detail">详细记录</router-link>
				<div @click="agreementShow = true" class="agreement">活动规则</div>
				<div class="gutter">
					<div class="col-33">
						<div class="titles">连续下单</div>
						<div class="days">{{order_days_amount.continuous}}天</div>
					</div>
					<div class="col-33">
						<div class="titles">{{member.nickname}}</div>
					</div>
					<div class="col-33">
						<div class="titles">累计下单</div>
						<div class="days">{{order_days_amount.sum}}天</div>
					</div>
				</div>
			</div>
			<div class="calendar">
				<div class="titles">
					<van-icon name='calendar' class="icon"></van-icon>
					{{year}}年{{month}}月
				</div>
				<div class="calendar-inner">
					<div class="week" v-for="week in calendar">
						<div class="day" v-for="item in week" :class="{today: item.today}" @click="onDayClick(item.day, item.grant)">
							<p class="num">{{item.day ? item.day : ''}}</p>
							<p class="grant"><van-icon v-if="item.grant" name='recharge' class="icon"></van-icon>{{item.grant}}</p>
							<p class="special" v-if="item.title">{{item.title}}</p>
							<van-icon v-if="item.signed" name='check' :class="{sigend: item.signed}"></van-icon>
						</div>
					</div>
				</div>
			</div>
			<div class="reward-container">
				<div class="titles">
					<span class="text"><van-icon name='gifts' class="icon"></van-icon> 连续下单有礼</span>
					<span class="subtitle pull-right">连续下单即可领取</span>
				</div>
				<div class="reward-inner">
					<div class="award">
						<div class="award-list">
							<div class="item" :class="{active: continuous_get[continuous.days]}" v-for="(continuous, index) in config_ordergrant.continuous">
								<div class="grant">+{{continuous.grant}}<br>{{grantType}}</div>
								<div class="circle" :class="{active: continuous.status==2}"><i class="icon icon-check"></i> </div>
								<div class="days">{{continuous.days}}天</div>
								<div class="text" v-if="!continuous.status" @click="onGetReward()">不可领</div>
								<div class="text" v-if="continuous.status==1" @click="onGetReward(1, continuous.days, continuous.status, index)">可领取</div>
								<div class="text" v-if="continuous.status==2" @click="onGetReward(1, continuous.days, continuous.status, index)">已领取</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="reward-container">
				<div class="titles">
					<span class="text"><van-icon name='gifts' class="icon"></van-icon> 累计下单有礼</span>
					<span class="subtitle pull-right">累计下单满足即可领取</span>
				</div>
				<div class="reward-inner">
					<div class="award">
						<div class="award-list">
							<div class="item" :class="{active: all_get[all.days]}" v-for="(all, index) in config_ordergrant.all">
								<div class="grant">+{{all.grant}}<br>{{grantType}}</div>
								<div class="circle" :class="{active: all.status==2}"><i class="icon icon-check"></i> </div>
								<div class="days">{{all.days}}天</div>
								<div class="text" v-if="!all.status" @click="onGetReward()">不可领</div>
								<div class="text" v-if="all.status == 1" @click="onGetReward(2, all.days, all.status, index)">可领取</div>
								<div class="text" v-if="all.status == 2" @click="onGetReward(2, all.days, all.status, index)">已领取</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<van-popup v-model="agreementShow" position="bottom" class="agreement-popup">
			<van-nav-bar class="border-0px" title="规则详解" @click-left="agreementShow = false" :style="{background: '#ff2d4b', color: '#fff' }">
				<van-icon name="left" :style="{color: '#fff'}" slot="left" class="font-20"></van-icon>
			</van-nav-bar>
			<div class="popup-content margin-10" v-html="config_ordergrant.agreement"></div>
		</van-popup>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	export default {
		components: {
			PublicHeader,
			PublicFooter
		},
		data() {
			return {
				showPreLoading:true,
				agreementShow: false,
				year:'',
				month:'',
				calendar: [],
				continuous_get: [],
				all_get: [],
				order_days_amount: {},
				member: {},
				config_ordergrant: {},
				grantType:'',
				menufooter: {}
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'ordergrant/index',
					data: {
						menufooter: 1
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message.message;
					this.year = result.year;
					this.month = result.month;
					this.calendar = result.calendar;
					this.continuous_get = result.continuous_get;
					this.all_get = result.all_get;
					this.order_days_amount = result.order_days_amount;
					this.member = result.member;
					this.config_ordergrant = result.config_ordergrant;
					this.grantType = result.grantType;
					this.menufooter = window.menufooter;
				})
			},
			onGetReward(type, days, status, index) {
				if(!type || !days) {
					this.$toast('您还没有达到领取该奖励的条件');
					return false;
				}
				this.util.request({
					url: 'ordergrant/index/get',
					data: {
						days: days,
						type: type
					},
					method: 'POST'
				}).then((res) => {
					this.$toast(res.data.message.message);
					if(status == 1){
						if(type == 1) {
							this.config_ordergrant.continuous[index].status = 2;
							this.continuous_get[days] = {days: days};
						} else if(type == 2) {
							this.config_ordergrant.all[index].status = 2;
							this.all_get[days] = {days: days};
						}
					}
				})
			},
			onDayClick(day, grant) {
				var date = new Date();
				var today = date.getDate();
				var difference = day - today;
				this.util.request({
					url: 'ordergrant/index/next',
					data: {
						difference: difference,
						grant: grant
					}
				}).then((res) => {
					this.$toast(res.data.message.message);
				})
			}
		},
		mounted () {
			this.onLoad();
		},
	}
</script>

<style>
	#ordergrant-index .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		bottom: 50px;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#ordergrant-index .content::-webkit-scrollbar {
		display: none;
	}
	#ordergrant-index .content .banner{
		padding: 4px 0;
		text-align: center;
		color: #fff;
		background: url(../../../static/img/bg-mypage.png) no-repeat center center;
		background-size: cover;
		position: relative;
	}
	#ordergrant-index .content .banner .avatar img{
		width: 55px;
		height: 55px;
		border-radius: 100%;
		border: 2px solid #fff;
		max-width: 100%;
	}
	#ordergrant-index .content .banner .detail{
		position: absolute;
		height: 24px;
		line-height: 24px;
		width: 60px;
		color: #fff;
		font-size: 12px;
		text-align: center;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 14px;
		right: 8px;
		top: 6px;
	}
	#ordergrant-index .content .banner .agreement{
		position: absolute;
		height: 24px;
		line-height: 24px;
		width: 60px;
		color: #fff;
		font-size: 12px;
		text-align: center;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 14px;
		left: 8px;
		top: 6px;
	}
	#ordergrant-index .content .banner .gutter{
		overflow: hidden;
	}
	#ordergrant-index .content .banner .gutter .col-33{
		width: 33.333333333333336%;
		margin: 0;
		float: left;
	}
	#ordergrant-index .content .banner .gutter .col-33 .titles{
		font-size: 12px;
		color: #fff;
		line-height: 18px;
	}
	#ordergrant-index .content .banner .gutter .col-33 .days{
		font-size: 17px;
		line-height: 25px;
	}
	#ordergrant-index .content .calendar{
		margin-top: 10px;
		padding: 0 10px;
		overflow: hidden;
	}
	#ordergrant-index .content .calendar .titles{
		height: 40px;
		padding: 0 10px;
		line-height: 40px;
		font-size: 16px;
		background: #fff;
		color: #ff2d4b;
		border-bottom: 1px solid #f2f2f2;
	}
	#ordergrant-index .content .calendar .titles .icon{
		font-size: 16px;
		margin-right: 4px;
	}
	#ordergrant-index .content .calendar .calendar-inner{
		background: #fff;
		padding: 10px;
	}
	#ordergrant-index .content .calendar .calendar-inner .week:first-child{
		width: 100%;
		border: 0;
		overflow: hidden;

	}
	#ordergrant-index .content .calendar .calendar-inner .week{
		width: 100%;
		border-top: 1px solid #f4f4f4;
		overflow: hidden;

	}
	#ordergrant-index .content .calendar .calendar-inner .week .day:nth-child(7n+1){
		border: 0;
	}
	#ordergrant-index .content .calendar .calendar-inner .week .day{
		height: 56px;
		width: 14%;
		border-left: 1px solid #f4f4f4;
		color: #777;
		font-size: 16px;
		position: relative;
		overflow: hidden;
		float: left;
	}
	#ordergrant-index .content .calendar .calendar-inner .week .day.today:before{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		content: "";
		border: 1px solid #ff2d4b;
	}
	#ordergrant-index .content .calendar .calendar-inner .week .day .num{
		height: 24px;
		line-height: 24px;
		padding-left: 6px;
		margin: 0;
	}
	#ordergrant-index .content .calendar .calendar-inner .week .day .sigend{
		position: absolute;
		top: 4px;
		right: 8px;
		height: 16px;
		width: 16px;
		line-height: 16px;
		color: #ff2d4b;
		font-size: 22px;
	}
	#ordergrant-index .content .calendar .calendar-inner .week .day .grant{
		margin: 0;
		height: 16px;
		font-size: 14px;
		line-height: 16px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: center;
		align-items: center;
	}
	#ordergrant-index .content .calendar .calendar-inner .week .day .grant .icon{
		font-size: 13px;
		color: #ff2c4b;
	}
	#ordergrant-index .content .calendar .calendar-inner .week .day .special{
		color: #fff;
		margin: 0;
		height: 16px;
		font-size: 12px;
		line-height: 16px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		text-align: center;
		position: absolute;
		bottom: 0;
		width: 100%;
		background: #ccc;
	}
	#ordergrant-index .content .reward-container{
		margin-top: 4px;
		overflow: hidden;
		position: relative;
	}
	#ordergrant-index .content .reward-container .titles{
		height: 32px;
		line-height: 32px;
		color: #888;
		font-size: 14px;
		padding: 0 6px;
	}
	#ordergrant-index .content .reward-container .titles .text .icon{
		font-size: 16px;
	}
	#ordergrant-index .content .reward-container .titles .subtitle{
		font-size: 12px;
		float: right;
	}
	#ordergrant-index .content .reward-container .reward-inner{
		height: auto;
		width: 100%;
		overflow: hidden;
		position: relative;
	}
	#ordergrant-index .content .reward-container .reward-inner:before{
		position: absolute;
		top: 42px;
		left: 0;
		right: 0;
		content: "";
		height: 5px;
		background: #fff;
	}
	#ordergrant-index .content .reward-container .reward-inner .award{
		height: 114px;
		width: 100%;
		overflow-x: auto;
		overflow-y: hidden;
	}
	#ordergrant-index .content .reward-container .reward-inner .award::-webkit-scrollbar {
		display: none;
	}
	#ordergrant-index .content .reward-container .reward-inner .award .award-list{
		height: 104px;
		width: auto;
		display: inline-flex;
	}
	#ordergrant-index .content .reward-container .reward-inner .award .award-list .item{
		height: 100px;
		width: 72px;
		overflow: hidden;
		position: relative;
	}
	#ordergrant-index .content .reward-container .reward-inner .award .award-list .item .grant{
		color: #666;
		font-size: 11px;
		height: 28px;
		width: 52px;
		padding-top: 4px;
		line-height: 12px;
		text-align: center;
		margin: auto;
		background: #fff;
		border-radius: 2px;
		position: relative;
	}
	#ordergrant-index .content .reward-container .reward-inner .award .award-list .item.active .circle{
		background: #ff2d4b;
	}
	#ordergrant-index .content .reward-container .reward-inner .award .award-list .item .circle{
		height: 20px;
		width: 20px;
		background: #fff;
		margin: 6px auto 0;
		border-radius: 28px;
		position: relative;
		color: #fff;
		font-size: 20px;
		font-weight: bold;
		line-height: 15px;
		text-align: center;
	}
	#ordergrant-index .content .reward-container .reward-inner .award .award-list .item.active .days{
		color: #ff2d4b;
	}
	#ordergrant-index .content .reward-container .reward-inner .award .award-list .item .days{
		color: #888;
		font-size: 12px;
		text-align: center;
		line-height: 18px;
	}
	#ordergrant-index .content .reward-container .reward-inner .award .award-list .item.active .text{
		color: #ff2d4b;
		border-color: #ff2d4b;
	}
	#ordergrant-index .content .reward-container .reward-inner .award .award-list .item .text{
		font-size: 12px;
		text-align: center;
		width: 48px;
		border: 1px solid #ccc;
		margin: auto;
		border-radius: 2px;
		line-height: 20px;
		color: #999;
	}
	#ordergrant-index .agreement-popup{
		height: 100%;
		width: 100%;
	}
</style>


// WEBPACK FOOTER //
// src/pages/ordergrant/index.vue