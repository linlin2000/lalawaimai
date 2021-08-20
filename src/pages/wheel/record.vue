<template>
	<div id="wheel-record">
		<public-header title="中奖纪录"></public-header>
		<div class="content">
			<div class="tab-group">
				<div class="tab-item" :class="{active: filter.items.status == -1}" @click="onChangeStatus(-1)">全部</div>
				<div class="tab-item" :class="{active: filter.items.status == 0}" @click="onChangeStatus(0)">未领取</div>
				<div class="tab-item" :class="{active: filter.items.status == 1}" @click="onChangeStatus(1)">已领取</div>
			</div>
			<van-list
				v-model="records.loading"
				:finished="records.loaded"
				@load="onLoad"
				:offset="100"
				:immediate-check="false"
				v-if="!records.empty"
				class="van-tabs"
			>
				<div class="record-item" v-for="(item, index) in records.data" :key="index">
					<div class="record-body">
						<div class="record-inner">
							<span class="record-text-left">抽奖时间：</span>
							<span class="record-text-right">{{item.addtime}}</span>
						</div>
						<div class="record-inner">
							<span class="record-text-left">中奖情况：</span>
							<span class="record-text-right" v-if="item.type">{{item.type.text ? item.type.text : '无'}}</span>
							<span class="record-text-right" v-else>未中奖</span>

						</div>
						<div class="record-inner">
							<span class="record-text-left">奖品类型：</span>
							<span class="record-text-right" v-if="item.award_type">{{item.award_type.text ? item.award_type.text : '无'}}</span>
							<span class="record-text-right" v-else>无</span>
						</div>
						<div class="record-inner">
							<span class="record-text-left">奖品详情：</span>
							<span class="record-text-right" v-if="item.award_type">
								<template v-if="item.award_type.name != 'redpacket'">
									{{item.award_value}}{{item.award_type.name == 'credit1' ? '酒币' : '元'}}
								</template>
								<template v-else v-for="da in item.award_value">
									{{da}}
								</template>
							</span>
							<span class="record-text-right" v-else>
								未中奖
							</span>
						</div>
					</div>
					<div class="record-footer" v-if="item.status == 0">
						<div @click="onGetPrize(item.id)" class="record-status">已领取</div>
					</div>
				</div>
				<div class="loaded" v-if="records.loaded && !records.empty">
					<div class="loaded-tips">没有更多了</div>
				</div>
			</van-list>
			<div v-else class="no-data">
				<img src= "static/img/no_order.png" alt="" />
				<p>暂时没有中奖记录哦～</p>
			</div>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		components: {
			PublicHeader
		},
		data() {
			return {
				status: -1,
				records:{
					page: 1,
					psize: 10,
					empty: false,
					loaded: false,
					loading: false,
					data: []
				},
				filter: {
					items: {
						status: -1
					}
				},
				showPreLoading: true,
			}
		},
		methods: {
			onChangeStatus(status) {
				var that = this;
				if(status == that.filter.items.status) {
					return;
				} else {
					that.filter.items.status = status;
				}
				that.records = {
					page: 1,
					psize: 10,
					empty: false,
					loaded: false,
					loading: false,
					data: []
				};
				this.onLoad();
			},
			onLoad() {
				var that = this;
				that.records.loading = true;
				that.util.request({
					url: 'wheel/activity/record',
					data:{
						status: that.filter.items.status,
						page: that.records.page,
						psize: that.records.psize,
					}
				}).then((res) => {
					that.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						that.$toast(result.message);
						return;
					}
					result = result.message;
					that.records.data = [...that.records.data, ...result.records];
					if(!result.records || result.records.length < that.records.psize) {
						that.records.loaded = true;
					}
					if(!that.records.data.length) {
						that.records.empty = true;
					}
					that.records.page++;
					that.records.loading = false;
				})
			},
			onGetPrize(id) {
				var that = this;
				that.util.jspost({
					url: 'wheel/activity/status',
					data: {
						id: id
					},
					confirm: '确定已领取赠品吗？'
				});
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#wheel-record .content .van-tabs{
		padding-top: 45px;
	}
	#wheel-record .content .van-tabs .record-item:first-child{
		margin-top: 0;
	}
	#wheel-record .content .van-tabs .record-item{
		width: 100%;
		margin-top: 10px;
		background: #fff;
		padding-left: 25px;
	}
	#wheel-record .content .van-tabs .record-item .record-body{
		width: 100%;
		padding: 10px 0;
		color: #333;
		text-align: left;
	}
	#wheel-record .content .van-tabs .record-item .record-body .record-inner{
		font-size: 14px;
		margin: 5px 0;
		line-height: 26px;
	}
	#wheel-record .content .van-tabs .record-item .record-body .record-inner .record-text-left{
		display: inline-block;
		width: 20%;
		color: #a3a3a3;
		white-space: nowrap;
		overflow: hidden;
	}
	#wheel-record .content .van-tabs .record-item .record-body .record-inner .record-text-right{
		display: inline-block;
		width: 70%;
		white-space: nowrap;
		overflow: hidden;
	}
	#wheel-record .content .van-tabs .record-item .record-footer{
		padding: 10px 0;
		margin-right: 10px;
		border-top: 1px solid #e0e0e0;
		overflow: hidden;
	}
	#wheel-record .content .van-tabs .record-item .record-footer .record-status{
		display: inline-block;
		float: right;
		margin-right: 10px;
		font-size: 14px;
		padding: 5px 0;
		width: 70px;
		border: 1px solid #ccc;
		text-align: center;
		border-radius: 3px;
		color: #333;
	}
</style>


// WEBPACK FOOTER //
// src/pages/wheel/record.vue