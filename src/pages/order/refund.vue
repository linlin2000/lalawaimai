<template>
	<div id="order-refund">
		<public-header title="退款进度"></public-header>
		<div class="content">
			<div class="refund-list font-14" v-if="refunds.length > 0">
				<div class="refund-item margin-10-b" v-for="(item, index) in refunds" :key="refunds.id">
					<div class="padding-15 bg-danger">
						<div class="font-20 c-white">{{item.status_cn}}</div>
						<div class="font-12 c-white margin-10-t hide">预计最晚2019年01月24日到账</div>
					</div>
					<van-cell-group>
						<van-cell title="退款金额">
							<div class="c-danger" slot="right-icon">¥{{item.fee}}</div>
						</van-cell>
						<van-cell class="no-fix" title="退款账户" :value="item.account" v-if="item.account" />
					</van-cell-group>
					<div class="margin-10-t bg-default padding-10-b" v-if="item.logs && item.logs.length > 0">
						<div class="padding-15-lr padding-15-t padding-5-b">退款流程</div>
						<van-steps direction="vertical" :active="item.logs.length-1" active-color="#ff2d4b">
							<van-step v-for="logItem in item.logs" :key="logItem.id">
								<div>{{logItem.title}}</div>
								<p class="margin-5-t font-12 c-gray">{{logItem.note}}</p>
								<div class="margin-5-t c-gray font-12">{{logItem.addtime_cn}}</div>
							</van-step>
						</van-steps>
						<div class="flex-center hide">
							<div class="more">
								展开更多 <i class="icon icon-unfold margin-5-l c-gray"></i>
							</div>
						</div>
					</div>
					<div class="margin-10-t bg-default padding-10-b">
						<div class="padding-15-lr padding-15">退款信息</div>
						<div class="goods-list" v-if="item.data && item.data.refund_goods && item.data.refund_goods.length > 0">
							<van-row class="goods-item" v-for="(goodsItem, goodsIndex) in item.data.refund_goods" :key="goodsIndex" >
								<van-col span="4">
									<div class="img-wrap">
										<img class="img-100" :src="goodsItem.thumb" alt="">
									</div>
								</van-col>
								<van-col span="20" class="goods-info">
									<van-row class="w-100">
										<van-col span="20" class="ellipsis">{{goodsItem.goods_title}}</van-col>
										<van-col span="4" class="text-right">¥{{goodsItem.fee}}</van-col>
									</van-row>
									<div class="c-gray margin-10-t">x{{goodsItem.total_num}}</div>
								</van-col>
							</van-row>
						</div>
						<van-row class="padding-15-lr margin-10-t">
							<van-col span="5">退款原因</van-col>
							<van-col span="19">{{item.reason}}</van-col>
						</van-row>
						<van-row class="padding-15-lr margin-10-t">
							<van-col span="5">订单号码</van-col>
							<van-col span="19">{{item.order_sn}}</van-col>
						</van-row>
					</div>
				</div>
			</div>
			<div class="loaded" v-else>
				<div class="loaded-tips">暂无退款记录</div>
			</div>
		</div>

		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import {getData} from '@/controller/funcCommon'
	export default {
		components: {
			PublicHeader
		},
		data() {
			return {
				id: 0,
				refunds: [],
				showPreLoading: true
			}
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'wmall/order/index/refund',
					data: {
						id: that.id
					},
					success: (res) => {
						if(res.refunds && res.refunds.length > 0) {
							that.refunds = [...res.refunds];
						}
					}
				})
			}
		},
		mounted() {
			let query = this.util.parseQuery(this.$route.query);
			this.id = query.id;
			this.onLoad();
		}
	}
</script>

<style>
	#order-refund .refund-item .van-cell.no-fix .van-cell__value{
		flex: none;
		max-width: 90%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	#order-refund .refund-item  .van-icon.van-icon-checked{
		background-color: #ff2d4b;
		color: #fff!important;
		border-radius: 50%;
	}
	#order-refund .refund-item .more{
		display: inline-flex;
		padding: 3px 10px;
		border-radius: 3px;
		font-size: 12px;
		border: 1px solid #999;
		margin-bottom: 10px;
	}
	#order-refund .refund-item .goods-list .goods-item{
		background-color: #f5f5f5;
		padding: 10px;
		margin-bottom: 10px;
	}
	#order-refund .refund-item .goods-list .goods-item .img-wrap{
		width: 50px;
		height: 50px;
		font-size: 0px;
	}
	#order-refund .refund-item .goods-list .goods-item .goods-info{
		height: 50px;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: center;
	}
</style>


// WEBPACK FOOTER //
// src/pages/order/refund.vue