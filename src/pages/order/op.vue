<template>
	<div id="order-op">
		<public-header title="修改订单信息"></public-header>
		<div class="content">
			<div class="header-remind c-gray">温馨提示: 订单支付后无法修改以下信息，请仔细确认</div>
			<van-cell-group>
				<van-cell :to="util.getUrl({path: 'pages/order/opUpdate', query: {type: 'note', id: order.id}})" title="备注">
					<div class="flex c-gray" slot="right-icon">
						<span v-if="order.note">点击修改</span>
						<span v-else>口味、偏好等要求</span>
						<van-icon name="arrow" class="margin-5-l"></van-icon>
					</div>
				</van-cell>
				<van-cell to="" title="发票" v-if="0">
					<div class="flex c-gray" slot="right-icon">
						<span>该商家不支持开发票</span>
					</div>
				</van-cell>
				<van-cell :to="util.getUrl({path: 'pages/order/opUpdate', query: {type: 'mobile', id: order.id}})" title="收货电话">
					<div class="flex" slot="right-icon">
						<span>{{order.mobile}}</span>
						<van-icon name="arrow" class="margin-5-l c-gray"></van-icon>
					</div>
				</van-cell>
				<van-cell :to="util.getUrl({path: 'pages/order/opUpdate', query: {type: 'person_num', id: order.id}})" title="餐具数量">
					<div class="flex c-gray" slot="right-icon">
						<span v-if="order.person_num">{{order.person_num}}套</span>
						<span v-else>未选择</span>
						<van-icon name="arrow" class="margin-5-l"></van-icon>
					</div>
				</van-cell>
			</van-cell-group>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import {getData} from "@/controller/funcCommon"
	export default {
		data() {
			return {
				id: 0,
				order: {},
				showPreLoading: true
			}
		},
		components: {
			PublicHeader
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'wmall/order/index/order_info_update',
					data: {
						id: this.id
					},
					success: (res) => {
						this.order = res.order;
					}
				})
			},
		},
		mounted () {
			this.onLoad();
		},
		created() {
			this.query = this.$route.query;
			if(this.query && this.query.id) {
				this.id = this.query.id;
			}
		}
	}
</script>

<style>
	#order-op .header-remind{
		background-color: #FFF6E6;
		padding: 10px 15px;
		font-size: 14px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/order/op.vue