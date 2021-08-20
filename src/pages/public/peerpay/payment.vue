<template>
	<div id="peerpay-payment">
		<div class="content">
			<div class="head-block">
				<div class="head-block-bg">
					<div class="item-text">{{peerpay.peerpay_message}}</div>
					<img class="avatar" :src="member.avatar" alt="">
				</div>
			</div>
			<div class="pay-container van-hairline--top van-hairline--top">
				<div class="pay-title">代付金额</div>
				<div class="input-container">
					¥
					<input type="text" v-model='fee' palceholder="请输入代付金额">
				</div>
			</div>
			<div class="note-container van-hairline--top van-hairline--top">
				<div class="note-title">给好友留言</div>
				<textarea name="note" v-model='note' placeholder="请输入留言"></textarea>
			</div>
			<div class="wx-pay-button" @click="onSubmit()">微信支付</div>
		</div>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	export default {
		name: "peerpayPayment",
		data() {
			return {
				showPreLoading: true,
				fee: 0,
				peerpay: {},
				member: {},
				note: '',
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'system/paycenter/peerpay/payment',
					data: {
						id: this.id,
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message, '', 1000);
						return false;
					}
					result = result.message;
					this.peerpay = result.peerpay;
					this.member = result.member;
					this.note = result.note;
					this.util.setWXTitle(result.page_title);
				})
			},

			onSubmit() {
				if(this.fee <= 0) {
					this.util.$toast('请输入大于0的金额', '', 1000);
					return false;
				}
				if(this.fee > this.peerpay.peerpay_price) {
					this.util.$toast('代付不能超过订单的金额', '', 1000);
					return false;
				}
				if(this.fee > this.peerpay.peerpay_selfpay && this.peerpay.peerpay_selfpay > 0) {
					this.util.$toast('代付不能超过代付最大金额', '', 1000);
					return false;
				}
				this.util.request({
					url: 'system/paycenter/peerpay/payment',
					method: 'POST',
					data: {
						id: this.id,
						note: this.note,
						val: this.fee
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message, '', 1000);
						return false;
					}
					this.util.pay({
						pay_type: 'wechat',
						order_type: 'peerpay',
						order_id: result.message.id,
						vue: this
					});
				})
			},

		},
		created() {
			this.query = this.$route.query;
			if(this.query) {
				this.id = this.query.id;
			}
		},
		mounted () {
			this.onLoad();
		},
	}
</script>

<style>
	#peerpay-payment .content{
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#peerpay-payment .content::-webkit-scrollbar {
		display: none;
	}
	#peerpay-payment .content .head-block{
		text-align: center;
		position: relative;
		min-height: 175px;
		margin-bottom: 14px;
	}
	#peerpay-payment .content .head-block .head-block-bg{
		background: linear-gradient(to top, #f44, #ff3b5d);
		z-index: 0;
		height: 100%;
		width: 100%;
		min-height: 155px;
		border-radius: 0 0 55% 55% / 0 0 55px 55px;
	}
	#peerpay-payment .content .head-block .head-block-bg .item-text{
		color: #fff;
		padding: 46px 20px 0px;
		text-align: center;
		background-color: transparent;
		border: 0;
		outline: none;
		width: 100%;
		box-sizing: border-box;
		line-height: 20px;
		text-shadow: 0 1px 4px rgba(0,0,0,0.6);
		font-size: 12px;
	}
	#peerpay-payment .content .head-block .head-block-bg .avatar{
		display: block;
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate3d(-50%, 0, 0);
		width: 54px;
		height: 54px;
		border: 1px solid #f2f2f2;
		z-index: 10;
		border-radius: 100%;
	}
	#peerpay-payment .content .pay-container{
		background-color: #fff;
		padding: 10px;
		margin: 10px 0;
	}
	#peerpay-payment .content .pay-container .pay-title{
		font-size: 14px;
		padding: 10px 0;
		color: #999;
		line-height: 21px;
	}
	#peerpay-payment .content .pay-container .input-container{
		padding: 10px 0;
		font-size: 20px;
		line-height: 30px;
		font-weight: 700;
	}
	#peerpay-payment .content .pay-container .input-container input{
		width: 90%;
		border: none;
	}
	#peerpay-payment .content .note-container{
		background-color: #fff;
		padding: 0 10px;
	}
	#peerpay-payment .content .note-container .note-title{
		font-size: 14px;
		padding: 10px 0;
		line-height: 21px;
	}
	#peerpay-payment .content .note-container textarea{
		border: none;
		width: 100%;
		font-size: 15px;
		color: #333;
		height: 44px;
	}
	#peerpay-payment .content .wx-pay-button{
		display: inline-block;
		background-color: #43bb01;
		height: 50px;
		text-align: center;
		line-height: 50px;
		color: #fff;
		font-size: 16px;
		width: 100%;
		z-index: 100;
		position: fixed;
		bottom: 0;
		padding: 0 20px;
		box-sizing: border-box;
		max-width: 640px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/public/peerpay/payment.vue