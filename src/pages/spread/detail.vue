<template>
	<div id="spreadOrderDetail">
		<public-header title="推广订单详情"></public-header>
		<div class="content">
			<van-cell-group>
				<van-cell title="订单号" :value="detail.ordersn" />
				<van-cell title="下单人" :value="detail.username"/>
				<van-cell title="佣金" :value="'￥' + detail.commission"/>
				<van-cell title="结算状态" :value="detail.spreadbalance == 1 ? '已结算' : '未结算'"/>
				<van-cell title="订单状态" :value="detail.status_cn"/>
			</van-cell-group>
		</div>
		<iloading v-if="showPreLoading"></iloading>
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
				showPreLoading: true,
				detail: {}
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'spread/order/detail',
					data: {
						order_type: this.order_type,
						id: this.id
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					this.detail = result.message;
				})
			}
		},
		created() {
			if(this.$route.query.id) {
				this.id = this.$route.query.id;
			}
			this.order_type = 'takeout';
			if(this.$route.query.order_type) {
				this.order_type = this.$route.query.order_type;
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#spreadOrderDetail .content{
		padding-top: 10px;
	}
</style>



// WEBPACK FOOTER //
// src/pages/spread/detail.vue