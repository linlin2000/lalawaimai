<template>
	<div id="order-zhunshibao">
		<public-header title="准时宝详情"></public-header>
		<div class="content">
			<div class="zhunshibao-list">
				<div class="zhunshibao-item">
					<div class="zhunshibao-item-left">价格</div>
					<div class="zhunshibao-item-right">¥50</div>
				</div>
			</div>
			<div class="blank"></div>
			<div class="zhunshibao-list">
				<div class="zhunshibao-item van-hairline--bottom">
					<div class="zhunshibao-item-left">订单号</div>
					<div class="zhunshibao-item-right">321321321321</div>
				</div>
				<div class="zhunshibao-item van-hairline--bottom">
					<div class="zhunshibao-item-left">服务状态</div>
					<div class="zhunshibao-item-right">购买成功</div>
				</div>
				<div class="zhunshibao-item van-hairline--bottom align-top">
					<div class="zhunshibao-item-left">赔付标准</div>
					<div class="zhunshibao-item-right">
						<div>晚于16:16:16送达，赔付4.8元</div>
						<div>晚于16:16:16送达，赔付4.8元</div>
						<div>晚于16:16:16送达，赔付4.8元</div>
					</div>
				</div>
				<div class="zhunshibao-item flex-lr">
					<div class="zhunshibao-item-left">服务说明</div>
					<div class="icon icon-right c-gray"></div>
				</div>
			</div>
			<div class="blank"></div>
			<div class="zhunshibao-list">
				<div class="zhunshibao-item van-hairline--bottom">
					<div class="zhunshibao-item-left">配送状态</div>
				</div>
				<van-steps direction="vertical" :active="0" active-color="#ff2d4b">
					<van-step>
						<h3>订单已送达，本次配送未到达赔付标准</h3>
						<p>2019-07-12 12:40</p>
					</van-step>
					<van-step>
						<h3>预计送达</h3>
						<p>2019-07-11 10:00</p>
					</van-step>
				</van-steps>
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
	#order-zhunshibao .content{
		background-color: #fff;
	}
	#order-zhunshibao .blank{
		width: 100%;
		height: 10px;
		background-color: #f5f5f5;
	}
	#order-zhunshibao .zhunshibao-list{
		background-color: #fff;
		padding-left: 15px;
	}
	#order-zhunshibao .zhunshibao-list .zhunshibao-item{
		display: flex;
		align-items: center;
		padding: 10px 15px 10px 0;
	}
	#order-zhunshibao .zhunshibao-list .zhunshibao-item .zhunshibao-item-left{
		width: 35%;
		text-align: left;
		color: #999;
	}
	#order-zhunshibao .zhunshibao-list .zhunshibao-item.align-top{
		align-items: flex-start;
	}
	#order-zhunshibao .zhunshibao-list .zhunshibao-item .zhunshibao-item-right{
		font-size: 15px;
		color: #333;
	}
	#order-zhunshibao .zhunshibao-list .zhunshibao-item .zhunshibao-item-right div{
		padding-bottom: 5px;
		color: #333;
	}
	#order-zhunshibao .zhunshibao-list .zhunshibao-item .zhunshibao-item-right div:last-child{
		padding-bottom: 0;
	}
	#order-zhunshibao .van-step__circle-container .van-icon-checked{
		color: #fff!important;
		border-radius: 100%;
		border: 1px solid #ff2d4b;
		background-color: #ff2d4b;
	}
</style>


// WEBPACK FOOTER //
// src/pages/order/zhunshibao.vue