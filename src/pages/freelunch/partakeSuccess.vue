<template>
	<div id="freelunch-partake_success">
		<public-header title="参与成功"></public-header>
		<div class="content">
			<div class="partake-info">
				<p>参与成功</p>
				<div class="partake-serial">您是本期第{{num}}位参与者,奖券号<span>{{partaker.number}}</span></div>
				<div class="pre-reward-time">预计1小时内开奖,若与当期开奖号码相同即为中奖</div>
				<div class="scan">
					<router-link :to="util.getUrl({path: '/package/pages/freelunch/detail', query: {record_id: partaker.record_id}})" class="scan-btn">查看本期开奖进度</router-link>
				</div>
			</div>
			<div class="repartake">
				<div class="remission" v-if="freelunch.partake_grant_type == 1">返还的{{partaker.final_fee}}元红包已经放入您的账户,每次参与都会立返哦</div>
				<div class="remission" v-else-if="freelunch.partake_grant_type == 2">返还的{{partaker.final_fee}}元现金已经放入您的账户,每次参与都会立返哦</div>
				<div class="repartake-invite">
					<router-link :to="util.getUrl({path: '/package/pages/freelunch/index'})" class="repartake-btn">再次参与,中奖率加倍</router-link>
				</div>
				<router-link :to="util.getUrl({path: '/package/pages/freelunch/index', query: {type: 'plus'}})" class="partake-plus">参加霸王餐Plus,赢元红包<van-icon name='right'></van-icon></router-link>
			</div>
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
				freelunch: {},
				partaker: {},
				num: 0,
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'freeLunch/freeLunch/partake_success',
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					result = result.message;
					this.freelunch = result.freelunch;
					this.partaker = result.partaker;
					this.num = result.num;
				})
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#freelunch-partake_success .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#freelunch-partake_success .content::-webkit-scrollbar {
		display: none;
	}
	#freelunch-partake_success .van-nav-bar{
		background-color: #ff2d4b!important;
		color: #fff!important;
	}
	#freelunch-partake_success .van-hairline--bottom .van-icon-left{
		color: #fff!important;
	}
	#freelunch-partake_success .content .partake-info{
		background-color: #fff;
		text-align: center;
		padding: 16px 0;
	}
	#freelunch-partake_success .content .partake-info p{
		margin: 10px 0;
		font-size: 20px;
		font-weight: bold;
		line-height: 29px;
	}
	#freelunch-partake_success .content .partake-info .partake-serial{
		font-size: 14px;
		color: #666;
		line-height: 21px;
	}
	#freelunch-partake_success .content .partake-info .partake-serial span{
		color: #f90;
	}
	#freelunch-partake_success .content .partake-info .pre-reward-time{
		font-size: 12px;
		color: #999;
		line-height: 18px;
	}
	#freelunch-partake_success .content .partake-info .scan{
		margin: 10px 0;
		line-height: 25px;
	}
	#freelunch-partake_success .content .partake-info .scan .scan-btn{
		padding: 6px 10px;
		font-size: 14px;
		font-weight: bold;
		border: 1px solid #e0e0e0;
		border-radius: 4px;
		color: #333;
	}
	#freelunch-partake_success .content .repartake{
		text-align: center;
		padding: 16px 0;
		font-size: 14px;
	}
	#freelunch-partake_success .content .repartake .remission{
		color: #999;
		line-height: 21px;
	}
	#freelunch-partake_success .content .repartake .repartake-invite{
		margin: 10px;
	}
	#freelunch-partake_success .content .repartake .repartake-invite .repartake-btn{
		display: block;
		line-height: 48px;
		color: #fff;
		background-color: #f6383a;
		border: none;
		height: 48px;
		font-size: 17px;
		padding: 0 10px;
		border-radius: 5px;
		text-align: center;
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
	}
	#freelunch-partake_success .content .repartake .partake-plus{
		display: block;
		margin-top: 16px;
		line-height: 21px;
		color: #0894ec;
	}
	#freelunch-partake_success .content .repartake .partake-plus .van-icon{
		font-size: 13px;
		padding-left: 3px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/freelunch/partakeSuccess.vue