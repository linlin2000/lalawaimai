<template>
	<div id="spread-qrcode">
		<div class="content">
			<p class="tips">邀请朋友扫描下方二维码</p>
			<div class="qrcode-wrap">
				<div id="qrcode"></div>
			</div>
			<p class="explain">好友扫描您的二维码,并且下单, {{settle.balance_condition == 1 ? '确认收货之后' : '确认收货并评价之后'}}, 您就可以获得佣金</p>
		</div>
		<transition name="loading">
			<iloading v-if="preLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import QRcode from 'qrcodejs2'
	export default {
		data() {
			return {
				preLoading: true,
				url: '',
				settle: {}
			}
		},
		methods: {
			newQrcode(text) {
				let qrcode = new QRcode('qrcode', {
					width: 150,
					height: 150, // 高度
					text: text, // 二维码内容
					image: ''
					// render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
					// background: '#f0f'
					// foreground: '#ff0'
				})
			},
			onLoad() {
				this.util.request({
					url: 'spread/poster/qrcode',
				}).then((res) => {
					this.preLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					this.url = result.message.url;
					this.settle = result.message.settle;
					this.newQrcode(this.url);
				})
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#spread-qrcode .content{
		background:url("../../../static/img/poster-bg.jpg") no-repeat;
		background-size:100% 100%;
	}
	#spread-qrcode p{
		text-align: center;
		color: #fff;
		font-size: 18px;
	}
	#spread-qrcode .tips{
		margin-top: 30%;
	}
	#spread-qrcode .explain{
		margin: 15px 30px 0px;
		line-height: 1.5;
	}
	#spread-qrcode .qrcode-wrap {
		width: 260px;
		height: 270px;
		margin: 5% auto 0;
		text-align: center;
		background:url("../../../static/img/qrcode-wrap.png") no-repeat;
		background-size:100% 100%;
		padding-top: 90px;
	}
	#spread-qrcode .qrcode-wrap #qrcode{
		width: 65%;
		max-height: 200px;
		margin: 0 auto 10px;
	}
	#spread-qrcode .qrcode-wrap #qrcode img{
		pointer-events: auto;
		margin: 0 auto;
	}
</style>



// WEBPACK FOOTER //
// src/pages/spread/qrcode.vue