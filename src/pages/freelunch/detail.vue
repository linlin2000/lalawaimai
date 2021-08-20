<template>
	<div id="freeLunch-detail">
		<public-header title="参与详情"></public-header>
		<div class="content">
			<div class="prize-status">
				<div class="batch">
					<span>第{{record.serial_sn}}期</span>
				</div>
				<!--已开奖-->
				<div v-if="record.status == 2">
					<template v-if="record.reward_uid == uid">
						<p>恭喜您 中奖了</p>
						<div class="no-prize">
							<span>获得{{record.reward_fee}}元红包</span>
						</div>
					</template>
					<template v-else>
						<p>很遗憾 未中奖</p>
						<div class="no-prize">
							<span>{{record.reward_fee}}元红包与你擦肩而过</span>
						</div>
					</template>
					<div class="winning-detail">
						<div class="winning-inner">
							<div class="winning-code">中奖号码</div>
							<div class="lucky-number">
								<span class="digit" v-for="(item, index) in record.reward_number" :key="index">{{item}}</span>
							</div>
							<div class="details">
								<img :src="member.avatar">
								<div class="participate-info">
									<span class="participate-name">{{member.nickname}} 本期参与 {{winner_partaker.nums}} 次</span>
									<div class="participate-time" v-for="(item, index) in winner_partaker.data" :key="index">参与时间: {{item.addtime_cn}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div v-else-if="record.status == 1">
					<p>活动进行中</p>
					<div class="prize-info">
						<div class="pirze-inner">
							<div class="draw-condition"><span>{{record.reward_fee}}元无门槛红包</span></div>
							<div class="progress">
								<div class="progress-bar" :style="{width: record.percent + '%'}"></div>
							</div>
							<div class="prize-data">
								总需人次: {{record.partaker_total}} <span class="vertical-line">|</span> 剩余人次: {{record.partaker_dosage}}
							</div>
						</div>
					</div>
				</div>
				<router-link tag="div" :to="util.getUrl({path: '/package/pages/freelunch/rule'})" class="open-popup">活动规则</router-link>
			</div>
			<div class="participate">
				<template v-if="mine_partaker.nums && mine_partaker.nums > 0">
					<div class="participate-num">
						我参与了:
						<span>{{mine_partaker.nums}}</span>
						<strong>次</strong>
					</div>
					<div class="participate-code" v-for="(item, index) in mine_partaker.data" :key="index">
						参与号码:
						<strong>{{item.number}}</strong>
					</div>
				</template>
				<p v-else>您没有参与本期活动，立即参与领红包吧！</p>
			</div>
			<div class="current-participant">
				<div class="participant-title van-hairline--bottom">
					<span>本期参与人</span>
					<span class="start-time">{{record.startime_cn}} 开始</span>
				</div>
				<div class="participant-list" v-if="!partakers.empty">
					<van-list
						v-model="partakers.loading"
						:finished="partakers.loaded"
						:offset="150"
						:immediate-check="false"
						@load="onGetPartakers"
					>
						<div class="participant-item" v-for="(item, index) in partakers.data" :key="index">
							<div class="col-20">
								<img :src="item.avatar" alt="">
							</div>
							<div class="col-80 van-hairline--bottom">
								<span class="participant-name">{{item.nickname}}</span>
								<span class="participant-time">{{item.addtime}}</span>
							</div>
						</div>
					</van-list>
				</div>
				<div class="loaded" v-if="partakers.loaded && !partakers.empty">
					<div class="loaded-tips" style="background-color: #fff;">没有更多了</div>
				</div>
				<div class="loaded" v-if="partakers.empty">
					<div class="loaded-tips" style="background-color: #fff;">暂无记录</div>
				</div>
			</div>
		</div>
		<div class="bar van-hairline--top">
			<div v-if="record.status == 2">
				<span class="col-50">新的一期正在火热进行中…</span>
				<router-link :to="util.getUrl({path: '/package/pages/freelunch/index'})" class="join-now">立即参与</router-link>
			</div>
			<div v-else>
				<div class="col-60">
					<router-link :to="util.getUrl({path: '/package/pages/freelunch/index'})" class="partake-times" v-if="partake_status.errno == 0">再次参与,中奖率翻倍</router-link>
					<router-link to="" class="no-partake-times" v-else>{{partake_status.message}}</router-link>
				</div>
				<div class="col-40">
					<div class="refresh" @click="onRefresh">刷新进度</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import Load from '@/components/load'
	export default {
		components: {
			PublicHeader,
			Load
		},
		data() {
			return {
				record_id: Number,
				uid: '',
				freelunch: {},
				member: {},
				mine_partaker: {},
				partake_status: {},
				record: {},
				winner_partaker: {},
				partakers: {
					min: 0,
					loading: false,
					loaded: false,
					empty: false,
					data: [],
				}
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'freeLunch/freeLunch/detail',
					data: {
						record_id: this.record_id
					}
				}).then((res) => {
					var result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					result = result.message;
					this.uid = result.uid;
					this.freelunch = result.freelunch;
					this.member = result.member;
					this.mine_partaker = result.mine_partaker;
					this.partake_status = result.partake_status;
					this.record = result.record;
					this.winner_partaker = result.winner_partaker;
					this.onGetPartakers();
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
						record_id: this.record_id
					}
				}).then((res) => {
					var result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					this.partakers.min = result.min;
					this.partakers.data = [...this.partakers.data, ...result.message];
					if(!this.partakers.data.length) {
						this.partakers.empty = true;
					}
					if(result.message && result.message.length < 15 || !this.partakers.min) {
						this.partakers.loaded = true;
					}
					this.partakers.loading = false;
				})
			},
			onRefresh() {
				this.uid = '';
				this.freelunch = {};
				this.member = {};
				this.mine_partaker = {};
				this.partake_status = {};
				this.record = {};
				this.winner_partaker = {};
				this.partakers = {
					min: 0,
					loading: true,
					loaded: false,
					empty: false,
					data: [],
				},
				this.onLoad();
			}
		},
		created() {
			if(this.$route.query.record_id) {
				this.record_id = this.$route.query.record_id;
			} else {
				return false;
			}
		},
		mounted() {
			this.onLoad();
		},
	}
</script>

<style>
	#freeLunch-detail .content{
		bottom: 70px;
	}
	#freeLunch-detail .van-nav-bar{
		background-color: #ff2d4b!important;
		color: #fff!important;
	}
	#freeLunch-detail .van-hairline--bottom .van-icon-left{
		color: #fff!important;
	}
	#freeLunch-detail .content .prize-status{
		background-image: url(../../../static/img/freelunch-detail.png);
		background-size: 100% auto;
		min-height: 160px;
		text-align: center;
		color: #fff;
		position: relative;
	}
	#freeLunch-detail .content .prize-status .batch{
		opacity: 0.8;
		padding-top: 20px;
		height: 20px;
		font-size: 12px;
	}
	#freeLunch-detail .content .prize-status .batch span{
		padding: 3px;
		border: 1px solid #fff;
		border-radius: 1.2px;
	}
	#freeLunch-detail .content .prize-status p{
		font-size: 24px;
		margin-top: 20px;
		font-weight: bold;
		line-height: 36px;
	}
	#freeLunch-detail .content .prize-status .no-prize{
		opacity: 0.85;
		font-size: 12px;
		line-height: 18px;
		padding: 5px;
	}
	#freeLunch-detail .content .prize-status .winning-detail{
		padding: 20px 0;
		font-size: 12px;
	}
	#freeLunch-detail .content .prize-status .winning-detail .winning-inner{
		position: relative;
		padding-bottom:6px;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		flex-direction: column;
		-webkit-box-align: center;
		-ms-flex-align: center;
		align-items: center;
		background-image: url(../../../static/img/bg-line.png);
		background-repeat: no-repeat;
		background-size: 80% 100%;
		background-position: center;
	}
	#freeLunch-detail .content .prize-status .winning-detail .winning-inner .winning-code{
		margin-top: -6px;
		font-weight: bold;
	}
	#freeLunch-detail .content .prize-status .winning-detail .winning-inner .lucky-number{
		display: flex;
	}
	#freeLunch-detail .content .prize-status .winning-detail .winning-inner .lucky-number .digit{
		align-items: center;
		-webkit-box-align: center;
		justify-content: center;
		-webkit-box-pack: center;
		display: flex;
		opacity: 0.8;
		margin: 10px 2.8px;
		width: 24px;
		height: 24px;
		line-height: 24px;
		color: #ee2d08;
		background-color: #fff;
		border-radius: 4px;
		font-size: 16px;
		font-weight: bold;
	}
	#freeLunch-detail .content .prize-status .winning-detail .winning-inner .details{
		display: flex;
		align-items: center;
	}
	#freeLunch-detail .content .prize-status .winning-detail .winning-inner .details img{
		width: 36px;
		height: 36px;
		border-radius: 50%;
		margin-left: 10px;
		border: none;
		max-width: 100%;
	}
	#freeLunch-detail .content .prize-status .winning-detail .winning-inner .details .participate-info{
		float: left;
		margin-left: 10px;
	}
	#freeLunch-detail .content .prize-status .winning-detail .winning-inner .details .participate-info .participate-name{
		line-height: 16px;
		font-weight: bold;
	}
	#freeLunch-detail .content .prize-status .winning-detail .winning-inner .details .participate-info .participate-time{
		line-height: 18px;
	}
	#freeLunch-detail .content .prize-status .prize-info{
		font-size: 12px;
		bottom: 0;
		width: 100%;
		padding: 10px;
		color: #fff;
		text-align: center;
	}
	#freeLunch-detail .content .prize-status .prize-info .draw-condition{
		opacity: 0.85;
		line-height: 18px;
		font-size: 12px;
	}
	#freeLunch-detail .content .prize-status .prize-info .draw-condition span{
		opacity: 1;
		font-weight: bold;
	}
	#freeLunch-detail .content .prize-status .prize-info .progress{
		margin: 10px auto;
		height: 4px;
		width: 80%;
		background-color: rgba(0, 0, 0, .2);
		border-radius: 2px;
	}
	#freeLunch-detail .content .prize-status .prize-info .progress .progress-bar{
		height: 100%;
		border-radius: 2px;
		background-image: -webkit-linear-gradient(left, #efab0b, #fffbba);
		background-image: linear-gradient(to right, #efab0b, #fffbba);
		-webkit-transform-origin: left;
		transform-origin: left;
		-webkit-animation: bar-grow 0.5s;
		animation: bar-grow 0.5s;
	}
	#freeLunch-detail .content .prize-status .prize-info .prize-data{
		font-size: 14px;
		font-weight: bold;
		line-height: 21px;
	}
	#freeLunch-detail .content .prize-status .prize-info .prize-data span{
		opacity: 0.7;
	}
	#freeLunch-detail .content .prize-status .open-popup{
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
	#freeLunch-detail .content .participate{
		text-align: center;
		margin: 10px;
		padding: 10px;
		font-size: 14px;
		background-color: #fff;
		border-radius: 4px;
		color: #666;
	}
	#freeLunch-detail .content .participate .participate-num{
		text-align: left;
		line-height: 21px;
	}
	#freeLunch-detail .content .participate .participate-num span{
		color: #fc692a;
		font-weight: bold;
	}
	#freeLunch-detail .content .participate .participate-num strong{
		color: #333;
		font-weight: 700;
	}
	#freeLunch-detail .content .participate .participate-code{
		text-align: left;
		line-height: 21px;
	}
	#freeLunch-detail .content .participate .participate-code strong{
		color: #333;
		font-weight: 700;
	}
	#freeLunch-detail .content .current-participant{
		margin-top: 10px;
		padding: 0 10px;
		background-color: #fff;
		font-size: 14px;
	}
	#freeLunch-detail .content .current-participant .participant-title{
		padding: 16px 0;
		line-height: 21px;
		overflow: hidden;
	}
	#freeLunch-detail .content .current-participant .participant-title .start-time{
		color: #999;
		float: right;
	}
	#freeLunch-detail .content .current-participant .participant-item{
		margin-left: -4%;
		overflow: hidden;
	}
	#freeLunch-detail .content .current-participant .participant-item .col-20{
		padding-top: 8px;
		width: 16%;
		margin-left: 4%;
		float: left;
	}
	#freeLunch-detail .content .current-participant .participant-item .col-20 img{
		width: 36px;
		height: 36px;
		border-radius: 100%;
		border: none;
		max-width: 100%;
	}
	#freeLunch-detail .content .current-participant .participant-item .col-80{
		margin-left: 0;
		padding: 6px 0;
		width: 80%;
		float: left;
	}
	#freeLunch-detail .content .current-participant .participant-item .col-80 .participant-name{
		display: block;
		line-height: 21px;
		font-size: 14px;
	}
	#freeLunch-detail .content .current-participant .participant-item .col-80 .participant-time{
		display: block;
		line-height: 21px;
		font-size: 14px;
		color: #999;
	}
	#freeLunch-detail .content #load .loaded .loaded-tips{
		background: #f5f5f5;
	}
	#freeLunch-detail .bar{
		position: fixed;
		bottom: 0;
		right: 0;
		background-color: #fff;
		padding: 10px;
		margin-left: 0;
		z-index: 100;
		width: 100%;
		height: 70px;
		table-layout: fixed;
		-webkit-transition-duration: .4s;
		-o-transition-duration: .4s;
		transition-duration: .4s;
		overflow: hidden;
	}
	#freeLunch-detail .bar .col-50{
		font-size: 14px;
		height: 50px;
		line-height: 50px;
		font-weight: bold;
		display: block;
		color: #333;
		width: 50%;
		float: left;
		text-align: center;
	}
	#freeLunch-detail .bar .join-now{
		text-align: center;
		display: block;
		border-radius: 4px;
		background-color: #ff2d4b;
		color: #fff;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 50px;
		height: 50px;
	}
	#freeLunch-detail .bar .col-60{
		width: 60%;
		float: left;
	}
	#freeLunch-detail .bar .col-60 .partake-times{
		border: 1px solid #ff2d4b;
		font-size: 15px;
		text-align: center;
		display: block;
		border-radius: 4px;
		background-color: #ff2d4b;
		color: #fff;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 50px;
		height: 50px;
	}
	#freeLunch-detail .bar .col-60 .no-partake-times{
		background-color: #ddd;
		border: 1px solid #ddd;
		text-align: center;
		display: block;
		border-radius: 4px;
		color: #fff;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 15px;
		line-height: 50px;
		height: 50px;
	}
	#freeLunch-detail .bar .col-40{
		width: 36%;
		margin-left: 4%;
		float: left;
	}
	#freeLunch-detail .bar .col-40 .refresh{
		background-color: #fff;
		color: #ff2d4b;
		border: 1px solid #ff2d4b;
		font-size: 15px;
		text-align: center;
		display: block;
		border-radius: 4px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		line-height: 50px;
		height: 50px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/freelunch/detail.vue