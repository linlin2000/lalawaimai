<template>
	<transition name="notice" mode="out-in">
		<div id="notice-popup" v-if="noticeShow">
			<div class="popup-modal"></div>
			<div class="popup-container">
				<div class="popup-content">
					<div class="popup-title">
						<div class="line"></div>
						<span>温馨提示</span>
					</div>
					<div class="popup-main">
						{{tips}}
					</div>
				</div>
				<div class="popup-close" @click="onClose">
					<span class="icon icon-close"></span>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		name: "noticePopup",
		props: {
			tips: String,
		},
		data() {
			return {
				noticeShow: true
			}
		},
		methods: {
			onClose() {
				this.noticeShow = false;
			}
		}
	}
</script>

<style>
	.notice-enter-active, .notice-leave-active {
		transition: opacity .5s;
	}
	.notice-enter, .notice-leave-active {
		opacity: 0;
	}
	#notice-popup{
		position: fixed;
		z-index: 20000;
	}
	#notice-popup .popup-modal {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		background-color: rgba(0,0,0,.7);
	}
	#notice-popup .popup-container {
		position: fixed;
		top: 50%;
		left: 50%;
		max-height: 100%;
		overflow-y: auto;
		-webkit-transition: .2s ease-out;
		transition: .2s ease-out;
		-webkit-overflow-scrolling: touch;
		-webkit-transform: translate3d(-50%,-50%,0);
		transform: translate3d(-50%,-50%,0);
		width: 80%;
	}
	#notice-popup .popup-content {
		background-color: #fff;
		width: 100%;
		border-radius: 5px;
	}
	#notice-popup .popup-content .popup-title{
		height: 44px;
		position: relative;
	}
	#notice-popup .popup-content .popup-title .line{
		width: 60%;
		height: 22px;
		border-bottom:1px solid #e5e5e5;
		margin: 0 auto;
	}
	#notice-popup .popup-content .popup-title span{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%,-50%,0);
		background-color: #fff;
		padding: 0 10px;
		font-size: 14px;
		color: #999;
	}
	#notice-popup .popup-content .popup-main{
		padding: 0 15px 15px;
		min-height: 100px;
		line-height: 1.5;
		color: #333;
		font-size: 14px;
	}
	#notice-popup .popup-close{
		margin-top: 30px;
		text-align: center;
	}
	#notice-popup .popup-close .icon{
		display: inline-block;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		border: 1px solid #fff;
		color: #fff;
		line-height: 36px;
		font-size: 20px;
	}
</style>


// WEBPACK FOOTER //
// src/components/noticePopup.vue