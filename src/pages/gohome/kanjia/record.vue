<template>
	<div id="kanjia-record">
		<public-header title="我的砍价"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<van-pull-refresh v-model="isRefresh" @refresh="onPullDownRefresh">
				<van-list
					v-model="records.loading"
					:finished="records.finished"
					@load="onLoad"
					:offset="100"
					:immediate-check="false"
					v-if="!records.empty"
					class="record-list"
				>
					<div class="record-item flex-lr" v-for="(item, index) in records.data" v-if="item.goods_status == 1 && item.total != 0" :key="index">
						<div class="record-img">
							<img class="img-100" :src="item.thumb" alt="">
						</div>
						<div class="info w-100">
							<div class="goods-title ellipsis">{{item.name}}</div>
							<div class="progress" v-if="item.status == 1">
								<span class="max-price">￥{{item.old_price}}</span>
								<div class="progress-inner">
									<div class="now-price" :style="{left: item.per_price + '%'}">¥{{item.price}}</div>
									<div class="bar">
										<div class="bar-inner" :style="{'width': item.per_price + '%'}"></div>
									</div>
								</div>
								<span class="min-price">￥{{item.new_price}}</span>
							</div>
							<div v-else class="flex">
								<div class="c-danger font-16 font-bold">￥{{item.old_price}}</div>
								<div class="c-gray font-12 line-through margin-5-l">￥{{item.new_price}}</div>
							</div>
							<div class="flex-lr w-100">
								<template v-if="item.price == item.new_price">
									<span class="c-danger font-14">砍价成功</span>
									<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/kanjia/order/create', query: {activityid: item.activityid}})" class="btn btn-detail" >去下单</router-link>
								</template>
								<template v-else>
									<div class="flex">
										<div class="font-12 c-gray margin-5-r">距结束</div>
										<count-down :endTime="item.endtime"></count-down>
									</div>
									<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/kanjia/share', query: {activityid: item.activityid, uid: item.uid}})" class="btn btn-detail">找人砍</router-link>
								</template>
							</div>
						</div>
					</div>
					<div class="loaded" v-if="records.finished">
						<div class="loaded-tips">没有更多了</div>
					</div>
				</van-list>
				<div class="no-data" v-else>
					<img src="static/img/order_no_con.png" alt="">
					<p>暂无砍价记录!</p>
				</div>
			</van-pull-refresh>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	import {getRecords} from "@/controller/funcCommon"
	import CountDown from '@/components/countDown'
	export default {
		components: {
			PublicHeader,
			PublicFooter,
			CountDown
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
				isRefresh: false,
				showPreLoading: true,
			}
		},
		methods: {
			onLoad(force){
				var that = this;
				getRecords({
					vue: that,
					force: force,
					data: {
						status: 1,
						menufooter: 1
					},
					url: 'kanjia/record/index',
				})
			},
			onPullDownRefresh(){
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
		},
	}
</script>

<style>
	#kanjia-record .content .record-item{
		margin: 10px;
		padding: 10px;
		background-color: #fff;
		border-radius: 5px;
	}
	#kanjia-record .content .record-item .record-img{
		width: 80px;
		height: 80px;
		border: none;
	}
	#kanjia-record .content .record-item .info{
		width: 75%;
		padding-left: 10px;
		height: 80px;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
	}
	#kanjia-record .content .record-item .goods-title{
		width: 100%;
		color: #333;
		font-size: 16px;
		margin-bottom: 15px;
	}
	#kanjia-record .content .record-item .progress{
		width: 100%;
		display: flex;
		flex-flow: row nowrap;
		align-items: flex-end;
		justify-content: space-between;
		font-size: 14px;
	}
	#kanjia-record .content .record-item .progress .max-price{
		font-size: 13px;
		margin-right: 5px;
	}
	#kanjia-record .content .record-item .progress .progress-inner{
		width: 70%;
		height: 10px;
		position: relative;
		flex:1;
	}
	#kanjia-record .content .record-item .progress .progress-inner .bar{
		position: absolute;
		bottom: 1px;
		left: 0;
		right: 0;
		height: 10px;
		background-color: #FED4D5;
		border-radius: 20px;
		overflow: hidden;
	}
	#kanjia-record .content .record-item .progress .progress-inner .bar .bar-inner{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		background: linear-gradient(to right, #FD6131 , #FE0000);
		width: 20%;
	}
	#kanjia-record .content .progress .progress-inner .now-price{
		position: absolute;
		bottom: 15px;
		color: #ff2d4b;
		font-size: 12px;
		transform: translateX(-50%);
		text-align: center;
	}
	#kanjia-record .content .record-item .progress .min-price{
		font-size: 13px;
		color: #ff2d4b;
		margin-left: 5px;
	}
	#kanjia-record .content .record-item .timer span{
		background-color: #ff2d4b;
		color: #fff;
		font-size: 12px;
		padding: 3px;
		margin: 0 3px;
		border-radius: 3px;
	}
	#kanjia-record .content .record-item .btn{
		color: #fff;
		font-size: 14px;
		padding: 8px 10px;
		border-radius: 3px;
	}
	#kanjia-record .content .record-item .btn.btn-detail{
		background: linear-gradient(to right, #FC6030 , #FF0101);
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/kanjia/record.vue