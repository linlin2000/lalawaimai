<template>
	<div id="svip-record">
		<public-header title="奖励明细"></public-header>
		<div class="content">
			<ul class="wrapper-list van-hairline--bottom">
				<li @click="onToggleType('redpacket')">
					<span class="item" :class="{active: type == 'redpacket'}">红包</span>
				</li>
				<li @click="onToggleType('credit')">
					<span class="item" :class="{active: type == 'credit'}">奖励金</span>
				</li>
			</ul>
			<template v-if="type == 'redpacket'">
				<van-list
					v-model="redpacket.loading"
					:finished="redpacket.finished"
					@load="onLoad"
					:offset="100"
					:immediate-check="false"
					v-if="!redpacket.empty"
					class="record-list"
				>
					<div class="record-tips">
						<img src="../../../static/img/svip-shengyin.png" alt="">
						<span class="font-bold">下个月的<span class="c-danger font-bold">{{exchange_max}}次</span>领红包权益将于{{next}}可用</span>
					</div>
					<div class="record-item" v-for="(item, index) in redpacket.data" :key="item.id">
						<div class="record-info flex-lr" :class="{'van-hairline--top': index > 0}">
							<div>
								<div class="font-14 font-bold">{{item.title}}</div>
								<div class="font-12 c-gray padding-5-t">{{item.granttime_cn}}</div>
							</div>
							<div class="font-14 c-danger font-bold">¥{{item.discount}}</div>
						</div>
					</div>
					<div class="loaded" v-if="redpacket.finished">
						<div class="loaded-tips">已经到底了</div>
					</div>
				</van-list>
				<div class="loaded" v-else>
					<div class="loaded-tips">暂无数据</div>
				</div>
			</template>
			<template v-else="type == 'credit'">
				<van-list
					v-model="credit.loading"
					:finished="credit.finished"
					@load="onLoad"
					:offset="100"
					:immediate-check="false"
					v-if="!credit.empty"
					class="record-list"
			 	>
					<div class="record-item" v-for="(item, index) in credit.data" :key="item.id">
						<div class="record-info flex-lr" :class="{'van-hairline--top': index > 0}">
							<div>
								<div class="font-14 font-bold">{{item.title}}</div>
								<div class="font-13 padding-5-t" v-if="item.remark">{{item.remark}}</div>
								<div class="font-12 c-gray padding-5-t">{{item.createtime_cn}}</div>
							</div>
							<div class="font-14 font-bold" :class="{'c-danger': item.num > 0, 'c-gray': item.num <= 0 }">{{item.num}}个</div>
						</div>
					</div>
					<div class="loaded" v-if="credit.finished">
						<div class="loaded-tips">已经到底了</div>
					</div>
				</van-list>
				<div class="loaded" v-else>
					<div class="loaded-tips">暂无数据</div>
				</div>
			</template>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import publicHeader from "@/components/header"
	import {getData} from "@/controller/funcCommon";
	export default {
		components: {
			publicHeader
		},
		data() {
			return {
				type: 'redpacket',
				next: '',
				exchange_max: 0,
				redpacket: {
					page: 1,
					psize: 15,
					loading: false,
					finished: false,
					empty: false,
					data:[]
				},
				credit: {
					page: 1,
					psize: 15,
					loading: true,
					finished: false,
					empty: false,
					data:[]
				},
				showPreLoading: true
			}
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'svip/records/list',
					data: {
						type: that.type,
						page: that[that.type].page,
						psize: that[that.type].psize,
					},
					success: (res) => {
						that.next = res.next;
						that.exchange_max = res.exchange_max;
						let type = that.type;
						let records = res.records;
						that[type].data = [...that[type].data, ...records];
						if(!that[type].data.length) {
							that[type].empty = true;
						}
						if(records && records.length < that[type].psize ) {
							that[type].finished = true;
						}
						that[type].page++;
						that[type].loading = false;
					}
				})
			},
			onToggleType(value) {
				var  that = this;
				if(value == that.type) {
					return;
				} else {
					that.type = value;
					if(!that[that.type].finished && !that[that.type].data.length) {
						that.onLoad();
					}
				}
			}
		},
		mounted() {
			this.onLoad();
		},
	}
</script>

<style>
	#svip-record #public-header .van-nav-bar{
		background-color: #000!important;
	}
	#svip-record .content{
		padding-top: 40px;
	}
	#svip-record .wrapper-list{
		display: flex;
		width: 100%;
		height: 40px;
		background: #fff;
		position: fixed;
		top: 46px;
		left: 0;
		right: 0;
		z-index: 1;
	}
	#svip-record .wrapper-list li{
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
	#svip-record .wrapper-list li .item{
		padding: 7px 0 8px 0;
		border-bottom: 2px solid transparent;
		color: #666;
		font-size: 14px;
		line-height: 16px;
		opacity: .7;
	}
	#svip-record .wrapper-list li .item.active{
		border-color: #333;
		font-weight: 700;
		opacity: 1;
	}
	#svip-record .record-list .record-title{
		padding: 10px 15px;
		font-size: 14px;
		color: #999;
	}
	#svip-record .record-list .record-tips{
		display: flex;
		align-items: center;
		padding: 10px 15px;
		background-image: linear-gradient(90deg,#f7ecbd,#e5d693);
		color: #735b27;
		font-size: 12px;
	}
	#svip-record .record-list .record-tips img{
		width: 14px;
		height: 14px;
		margin-right: 10px;
	}
	#svip-record .record-list .record-item{
		background-color: #fff;
	}
	#svip-record .record-list .record-info{
		padding: 10px 15px 10px 0;
		margin-left: 10px;
		border-bottom: 1px solid #eee;
	}
	#svip-record .record-list .record-info:last-child{
		border-bottom: none;
	}
</style>


// WEBPACK FOOTER //
// src/pages/svip/record.vue