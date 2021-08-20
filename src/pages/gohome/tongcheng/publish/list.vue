<template>
	<div id="publish-list">
		<public-header title="我的发布"></public-header>
		<public-footer :menufooter="menufooter" :preLoading="showPreLoading"></public-footer>
		<div class="content">
			<div class="tab-group">
				<div class="tab-item" :class="{active: filter.items.status == -1}" @click="onToggleStatus(-1)">全部</div>
				<div class="tab-item" :class="{active: filter.items.status == 1}" @click="onToggleStatus(1)">待支付</div>
				<div class="tab-item" :class="{active: filter.items.status == 2}" @click="onToggleStatus(2)">审核中</div>
				<div class="tab-item" :class="{active: filter.items.status == 3}" @click="onToggleStatus(3)">已通过</div>
				<div class="tab-item" :class="{active: filter.items.status == 4}" @click="onToggleStatus(4)">未通过</div>
			</div>
			<van-pull-refresh v-model="isRefresh" @refresh="onPullDownRefresh">
				<van-list
					v-model="records.loading"
					:finished="records.finished"
					@load="onLoad"
					:offset="100"
					:immediate-check="false"
					v-if="!records.empty"
				>
					<div class="list-wrap van-hairline--top">
						<information-item :informations="records.data" from="mine"></information-item>
					</div>
					<div class="loaded" v-if="records.finished">
						<div class="loaded-tips">没有更多了</div>
					</div>
				</van-list>
				<div class="no-data" v-else>
					<img src="static/img/order_no_con.png" alt="">
					<p>还没有发布任何信息</p>
				</div>
			</van-pull-refresh>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	import InformationItem from '../components/informationItem'
	import {getRecords} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
			PublicFooter,
			InformationItem
		},
		data() {
			return {
				showPreLoading: true,
				isRefresh: false,
				records: {
					page: 1,
					psize: 5,
					loading: true,
					finished: false,
					empty: false,
					data:[]
				},
				filter: {
					items: {
						status: -1
					}
				},
				menufooter: {}
			}
		},
		methods: {
			onLoad(force) {
				var that = this;
				getRecords({
					vue: that,
					force: force,
					recordsName: 'informations',
					url: 'tongcheng/index/mine',
					data: {menufooter: 1},
					success: (res) => {
						that.menufooter = window.menufooter;
					}
				})
			},
			onPullDownRefresh() {
				this.onLoad(true);
			},

			onToggleStatus: function(value) {
				if(this.filter.items.status == value) {
					return;
				}
				this.filter.items.status = value;
				this.onLoad(true);
			},

		},
		mounted(){
			this.onLoad();
		}

	}
</script>

<style>
	@import "../../../../../static/css/test.css";
	#publish-list .content{
		padding-top: 45px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/tongcheng/publish/list.vue