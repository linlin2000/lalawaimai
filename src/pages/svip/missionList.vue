<template>
	<div id="svip-missionList">
		<public-header title="我的任务"></public-header>
		<div class="content">
			<div class="wrap-search">
				<div class="tab-group flex-lr">
					<div class="tab-item" :class="{active: filter.items.status == 1}" @click="onToggleStatus(1)">进行中</div>
					<div class="tab-item" :class="{active: filter.items.status == 2}" @click="onToggleStatus(2)">已完成</div>
					<div class="tab-item" :class="{active: filter.items.status == 3}" @click="onToggleStatus(3)">已失败</div>
				</div>
			</div>
			<van-pull-refresh v-model="isRefresh" @refresh="onPullDownRefresh()">
			<van-list
				v-model="records.loading"
				:finished="records.finished"
				@load="onLoad"
				:offset="100"
				:immediate-check="false"
				class="mission-list"
				v-if="!records.empty"
			>
				<div class="mission-item" v-for="item in records.data" :key="item.id">
					<div class="mission-group van-hairline--bottom">
						<div class="mission-img">
							<img class="img-100" :src="item.avatar" alt="">
						</div>
						<div class="mission-info">
							<div class="flex-lr">
								<div class="font-15">{{item.data.title}}</div>
								<div class="c-danger font-15">{{item.takepart_status_all.text}}</div>
							</div>
							<div class="c-gray font-13 padding-10-t flex">
								<span>领取时间：</span>
								<span>{{item.addtime_cn}}</span>
							</div>
							<div class="c-gray font-13 padding-5-t flex">
								<span>截止时间：</span>
								<span>{{item.overtime_cn}}</span>
							</div>
							<div class="c-gray font-13 padding-5-t flex" v-if="item.status == 2">
								<span>完成时间：</span>
								<span>{{item.endtime_cn}}</span>
							</div>
							<div class="mission-award">
								<span>任务奖励：</span>
								<span>{{item.award_cn}}</span>
							</div>
						</div>
					</div>
					<div class="mission-footer" v-if="item.status == 1">
						<router-link :to="util.getUrl({path: 'pages/member/recharge'})" class="itag itag-danger" v-if="item.task_type == 'oneChargeFee'">去充值</router-link>
						<router-link :to="util.getUrl({path: 'pages/home/index'})" class="itag itag-danger" v-else-if="item.task_type == 'oneOrderFee'">去完成</router-link>
					</div>
				</div>
				<div class="loaded" v-if="records.finished">
					<div class="loaded-tips">已经到底了</div>
				</div>
			</van-list>
			<div class="no-data" v-else>
				<img src="static/img/goods_no_con.png" alt="" v-if="1">
				<p>还没有相关数据!</p>
			</div>
			</van-pull-refresh>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import publicHeader from "@/components/header"
	import {getRecords} from "@/controller/funcCommon"
	export default {
		components: {
			publicHeader
		},
		data() {
			return {
				isRefresh: false,
				showPreLoading: true,
				records:{
					page: 1,
					psize: 10,
					loading: false,
					finished: false,
					empty: false,
					data:[]
				},
				filter: {
					items: {
						status: 1
					}
				}
			}
		},
		methods: {
			onToggleStatus: function(value) {
				if(this.filter.items.status == value) {
					return;
				}
				this.filter.items.status = value;
				this.onLoad(true);
			},
			onLoad(force){
				var that = this;
				getRecords({
					vue: that,
					force: force,
					url: 'svip/task/takepartlist'
				});
			},
			onPullDownRefresh() {
				this.onLoad(true);
			}
		},
		mounted() {
			this.onLoad();
		},
	}
</script>

<style>
	#svip-missionList .mission-list{
		padding-top: 45px;
	}
	#svip-missionList .mission-item{
		margin-top: 10px;
		background-color: #fff;
	}
	#svip-missionList .mission-item:first-child{
		margin-top: 0;
	}
	#svip-missionList .mission-item .mission-group{
		display: flex;
		padding: 10px 0;
		margin: 0 15px;
	}
	#svip-missionList .mission-item .mission-group .mission-award{
		font-size: 13px;
		color: #ff2d4b;
		padding-top: 5px;
		line-height: 15px;
	}
	#svip-missionList .mission-item .mission-group .mission-img{
		width: 50px;
		height: 50px;
	}
	#svip-missionList .mission-item .mission-group .mission-info{
		width: 85%;
		padding-left: 10px;
	}
	#svip-missionList .mission-item .mission-footer{
		display: flex;
		justify-content: flex-end;
		padding: 10px 15px;
		background-color: #fff;
	}
	#svip-missionList .mission-item .mission-footer .itag{
		display: inline-block;
		border-radius: 3px;
		font-size: 14px;
		padding: 6px 15px;
		color: #fff;
		margin-left: 10px;
	}
	#svip-missionList .mission-item .mission-footer .itag.itag-danger{
		background-color: #FF2C4C;
	}
</style>


// WEBPACK FOOTER //
// src/pages/svip/missionList.vue