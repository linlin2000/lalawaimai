<template>
	<div id="kanjia-order-list">
		<public-header title="我的订单"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<div class="tab-group">
				<div class="tab-item" :class="{active: filter.items.status == -1}" @click="onToggleStatus(-1)">全部</div>
				<div class="tab-item" :class="{active: filter.items.status == 1}" @click="onToggleStatus(1)">待付款</div>
				<div class="tab-item" :class="{active: filter.items.status == 3}" @click="onToggleStatus(3)">待使用</div>
				<div class="tab-item" :class="{active: filter.items.status == 5}" @click="onToggleStatus(5)">待评价</div>
			</div>
			<van-pull-refresh v-model="isRefresh" @refresh="onPullDownRefresh">
				<van-list class="order-list"
					v-model="records.loading"
					:finished="records.finished"
					@load="onLoad"
					:offset="100"
					:immediate-check="false"
					v-if="!records.empty"
				>
					<div class="order-item" v-for="(item, index) in records.data" :key="item.id">
						<div class="flex-lr">
							<div class="flex" v-if="item.store">
								<i class="icon icon-shop font-18 c-gray"></i>
								<span class="margin-5-l">{{item.store.title}}</span>
							</div>
							<div class="c-danger">{{item.status_all.text}}</div>
						</div>
						<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/order/detail', query: {id: item.id}})" class="padding-15-tb  flex-lr">
							<div class="thumb">
								<img class="img-100" :src="item.goods.thumb" alt="">
							</div>
							<div class="info w-100">
								<div class="goods-title w-100 ellipsis">
									<span class="order-type" :class="item.order_type_all.css">{{item.order_type_all.text}}</span>{{item.goods.name}}
								</div>
								<div class="c-gray font-12" >下单时间: {{item.addtime_cn}}</div>
								<div class="c-gray font-12" v-if="item.status != 1">支付时间: {{item.paytime_cn}}</div>
								<div class="c-gray font-12" v-if="item.status == 5 || item.status == 6">核销时间: {{item.applytime_cn}}</div>
								<div class="c-gray font-12 opacity-1">截止时间: 2018-11-22</div>
								<div class="c-danger">¥{{item.final_fee}}</div>
							</div>
						</router-link>
						<div class="padding-15-t btn-group van-hairline--top" v-if="item.status < 6">
							<template v-if="item.is_pay == 0">
								<div class="btn-item" v-if="item.status == 1" @click="util.jspost({url: 'gohome/order/cancel', data: {id: item.id}})">取消订单</div>
								<router-link tag="div" :to="util.getUrl({path: '/pages/public/pay', query: {order_id: item.id, order_type: 'gohome'}})" class="btn-item" v-if="item.status == 1">立即支付</router-link>
							</template>
							<template v-else-if="item.is_pay == 1">
								<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/order/detail', query: {id: item.id}})" class="btn-item" v-if="item.status == 3">去使用</router-link>
								<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/comment/comment', query: {order_id: item.id}})" class="btn-item" v-if="item.status == 5">立即评价</router-link>
							</template>
						</div>
					</div>
					<div class="loaded" v-if="records.finished">
						<div class="loaded-tips">没有更多了</div>
					</div>
				</van-list>
				<div class="no-data" v-else>
					<img src="static/img/order_no_con.png" alt="">
					<p>暂无订单</p>
				</div>
			</van-pull-refresh>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	import {getRecords} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
			PublicFooter
		},
		data() {
			return {
				records: {
					page: 1,
					psize: 15,
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
				menufooter: {},
				showPreLoading: true,
				isRefresh: false,
			}
		},
		watch: {
			filter: {
				handler(newValue, oldValue) {
					this.onLoad(true)
				},
				deep: true
			},
		},
		methods: {
			onLoad(force) {
				var that = this;
				getRecords({
					vue: that,
					force: force,
					url: 'gohome/order/list',
					data: {
						menufooter: 1
					},
					success: (res) => {
						that.menufooter = window.menufooter;
					}
				})
			},
			onPullDownRefresh() {
				this.onLoad(true);
			},
			onToggleStatus: function(value) {
				value = parseInt(value);
				if(this.filter.items.status == value) {
					return;
				}
				this.filter.items.status = value;
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#kanjia-order-list .content{
		padding-top: 45px;
	}
	#kanjia-order-list .order-item{
		margin: 15px;
		padding: 15px;
		background-color: #fff;
		font-size: 14px;
		border-radius: 3px;
	}
	#kanjia-order-list .order-item .thumb{
		width: 80px;
		height: 80px;
		border-radius: 3px;
		overflow: hidden;
	}
	#kanjia-order-list .order-item .info{
		width: 74%;
		padding-left: 10px;
		height: 80px;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
	}
	#kanjia-order-list .order-item .info .order-type{
		display: inline-block;
		background-color: #ff2d4b;
		color: #fff;
		font-size: 12px;
		padding: 3px 5px;
		border-radius: 3px;
		margin-right: 5px;
	}
	#kanjia-order-list .order-item .btn-group{
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	#kanjia-order-list .order-item .btn-group .btn-item{
		color: #ff2d4b;
		border: 1px solid #ff2d4b;
		border-radius: 3px;
		padding: 5px 8px;
		margin-left: 10px;
		font-size: 12px;
	}
	#kanjia-order-list .order-item .goods-title .label{
		color: #fff;
	}
	#kanjia-order-list .order-item .goods-title .label.label-info{
		background-color: #5bc0de;
	}
	#kanjia-order-list .order-item .goods-title .label.label-danger{
		background-color: #ff2d4b;
	}
	#kanjia-order-list .order-item .goods-title .label.label-warning{
		background-color: #f0ad4e;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/order/index.vue