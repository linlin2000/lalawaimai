<template>
	<div id="reserve-yuding">
		<public-header title="预定"></public-header>
		<div class="content">
			<div class="yuding-header">
				<div class="yuding-date active">
					<div>今天</div>
					<div class="padding-5-t">03:05</div>
				</div>
				<div class="yuding-date">
					<div>明天</div>
					<div class="padding-5-t">不可订</div>
				</div>
				<div class="yuding-date">
					<div>明天</div>
					<div class="padding-5-t">不可订</div>
				</div>
				<div class="yuding-date">
					<div>周四</div>
					<div class="padding-5-t">不可订</div>
				</div>
				<div class="yuding-date">
					<div>周五</div>
					<div class="padding-5-t">不可订</div>
				</div>
				<div class="yuding-date">
					<div>周六</div>
					<div class="padding-5-t">不可订</div>
				</div>
				<div class="yuding-date">
					<div>周日</div>
					<div class="padding-5-t">不可订</div>
				</div>
			</div>
			<div class="yuding-filter van-hairline--top">
				<div class="filter-item">全部桌型 <i class="icon icon-unfold"></i></div>
				<div class="filter-item">全部时间 <i class="icon icon-unfold"></i></div>
				<div class="filter-item">全部折扣 <i class="icon icon-unfold"></i></div>
			</div>
			<div class="tables-list">
				<div class="tables-item" v-for="index in 6">
					<div class="tables-left">
						<div class="font-12 c-gray">到店就餐时间(可保留15分钟)</div>
						<div class="tables-info padding-10-t">
							<div class="tables-time">12:40</div>
							<div class="tables-date">今天</div>
							<div class="font-14">1-2人</div>
						</div>
						<div class="flex">
							<div class="tables-bar">
								<div class="bar-inner" style="width: 30%;"></div>
							</div>
							<div class="tables-text">剩1桌</div>
						</div>
					</div>
					<div class="tables-right flex">
						<div class="btn-tables">限时抢</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		data() {
			return {

			}
		},
		components: {
			PublicHeader
		},
		methods: {

		},
		mounted () {

		}
	}
</script>

<style>
	#reserve-yuding .yuding-header{
		width: 100%;
		white-space: nowrap;
		overflow-x: scroll;
		overflow-y: hidden;
		font-size: 0;
		padding: 10px 15px;
		background-color: #fff;
	}
	#reserve-yuding .yuding-header .yuding-date{
		display: inline-block;
		padding: 5px 20px;
		color: #999;
		font-size: 14px;
		text-align: center;
		margin-right: 10px;
	}
	#reserve-yuding .yuding-header .yuding-date.active{
		border: 1px solid #FFCDB2;
		background-color: #FFF5F0;
		color: #FF5900;
		border-radius: 35px;
	}
	#reserve-yuding .yuding-header .yuding-date:last-child{
		margin-right: 0;
	}
	#reserve-yuding .yuding-filter{
		position: relative;
		padding: 15px;
		font-size: 14px;
		color: #787878;
		background-color: #fff;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
	}
	#reserve-yuding .yuding-filter .filter-item{
		padding: 0 10px;
	}
	#reserve-yuding .tables-list{
		padding: 0 15px 15px;
	}
	#reserve-yuding .tables-list .tables-item{
		display: flex;
		align-items: center;
		margin-top: 15px;
		padding: 15px 0;
		background-color: #fff;
		box-shadow:2px 2px 5px #e0e0e0;
		border-radius: 5px;
	}
	#reserve-yuding .tables-list .tables-item .tables-left{
		width: 75%;
		padding: 0 15px;
		border-right: 1px dashed #e0e0e0;
	}
	#reserve-yuding .tables-list .tables-item .tables-left .tables-info{
		display: flex;
		align-items: flex-end;
	}
	#reserve-yuding .tables-list .tables-item .tables-left .tables-time{
		font-size: 22px;
		font-weight: bold;
		color: #FF5900;
		padding-right: 10px;
	}
	#reserve-yuding .tables-list .tables-item .tables-left .tables-date{
		font-size: 14px;
		color: #FF5900;
		padding-right: 10px;
	}
	#reserve-yuding .tables-list .tables-item .tables-left .tables-bar{
		width: 65%;
		height: 5px;
		border-radius: 5px;
		background-color: #FFE6D8;
		position: relative;
		margin: 15px 0 5px;
		overflow: hidden;
	}
	#reserve-yuding .tables-list .tables-item .tables-left .tables-bar .bar-inner{
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		bottom: 0;
		border-radius: 20px;
		background: -webkit-linear-gradient(left, #FD6131, #FE0000);
		background: -o-linear-gradient(right, #FD6131, #FE0000);
		background: -moz-linear-gradient(right, #FD6131, #FE0000);
		background: linear-gradient(to right, #FD6131 , #FE0000);
	}
	#reserve-yuding .tables-list .tables-item .tables-left .tables-text{
		font-size: 12px;
		color: #999;
		padding-left: 10px;
		margin-top: 6px;
	}
	#reserve-yuding .tables-list .tables-item .tables-right{
		width: 25%;
	}
	#reserve-yuding .tables-list .tables-item .tables-right .btn-tables{
		background: linear-gradient(to right, #FF9701 , #FF6200);
		color: #fff;
		border-radius: 50px;
		padding: 7px 12px;
		font-size: 12px;
		margin: 0 auto;
	}
</style>


// WEBPACK FOOTER //
// src/pages/reserve/yuding.vue