<template>
	<div id="follow" v-if="status.tips">
		<div class="follow-tips" >
			<div class=" flex-lr">
				<div class="info">
					<div class="logo">
						<img :src="follow.logo" alt="">
					</div>
					<div class="txt">
						欢迎进入{{follow.title}}<br>关注公众号，享专属服务
					</div>
				</div>
				<div class="text-btn" @click="onChangeStatus('qrcode')" v-if="follow.qrcode">立即关注</div>
				<router-link :to="follow.link" class="text-btn" v-else>立即关注</router-link>
			</div>
			<div class="close-popup" @click="onChangeStatus('tips')">×</div>
		</div>
		<van-popup class="follow-qrcode" v-model="status.qrcode">
			<div class="qrcode">
				<img :src="follow.qrcode" alt="">
			</div>
			<p class="notice">长按识别二维码关注</p>
			<div class="close-qrcode" @click="onChangeStatus('qrcode')">×</div>
		</van-popup>
	</div>
</template>

<script>
	export default {
		props: {
			follow: {}
		},
		data() {
			return {
				status: {
					tips: true,
					qrcode: false
				},
			}
		},
		methods: {
			onChangeStatus(type, value) {
				this.status[type] = !this.status[type];
			}
		},
	}
</script>

<style>
	#follow .follow-tips{
		width: 100%;
		background: rgba(0,0,0, 0.9);
		position: fixed;
		padding: 8px;
		top: 0;
		z-index: 10000!important;
		color: #fff;
		font-size: 14px;
	}
	#follow .follow-tips .info{
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: flex-start;
	}
	#follow .follow-tips .info .logo{
		font-size: 0px;
	}
	#follow .follow-tips .info .logo img{
		width: 40px;
		height: 40px;
		border-radius: 6px;
		margin-right: 10px;
	}
	#follow .follow-tips .info .txt{
		line-height: 1.4;
	}
	#follow .follow-tips .text-btn{
		height: 30px;
		line-height: 30px;
		padding: 0 10px;
		border-radius: 5px;
		text-align: center;
		background-color: #ff2d4b;
		margin-right: 10px;
		color: #fff;
	}
	#follow .follow-tips .close-popup{
		position: absolute;
		top: 0;
		right: 0;
		width: 25px;
		height: 25px;
		border-radius: 0 0 0 50px;
		line-height: 18px;
		text-align: right;
		background-color: rgba(0, 0, 0, 0.8);
		color: #ff2d4b;
		padding-right: 1px;
		font-size: 17px;
	}
	#follow .van-modal{
		z-index: 100000001!important;
		background-color: rgba(0,0,0,.4);
	}
	#follow .follow-qrcode{
		z-index: 1000000002!important;
		background-color: transparent;
		color: #fff;
		text-align: center;
		overflow: hidden;
	}
	#follow .follow-qrcode .qrcode{
		width: 200px;
		height: 200px;
		font-size: 0;
	}
	#follow .follow-qrcode .qrcode img{
		width: 100%;
		height: 100%;
		pointer-events: auto;
	}
	#follow .follow-qrcode .notice{
		margin: 10px 0;
	}
	#follow .follow-qrcode .close-qrcode{
		display: inline-block;
		width: 30px;
		height: 30px;
		text-align: center;
		line-height: 28px;
		font-size: 24px;
		color: #fff;
		border-radius: 100%;
		background-color: rgba(0,0,0,0.5);
	}
</style>


// WEBPACK FOOTER //
// src/components/follow.vue