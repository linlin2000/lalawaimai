<template>
	<div id="loading">
		<div class="sk-spinner sk-spinner-three-bounce"  v-if="!loadingIsDiy">
			<div :style="{'background-color':sysbg}" class="sk-bounce1"></div>
			<div :style="{'background-color':sysbg}" class="sk-bounce2"></div>
			<div :style="{'background-color':sysbg}" class="sk-bounce3"></div>
		</div>
		<div class="diy-loading" v-else>
			<img :src="diyLoading.img" alt="" v-if="diyLoading.img">
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return{
        sysbg:'#ff2d4b',
				positionY: 0,
				timer: null,
				loadingIsDiy: false,
				diyLoading: {
					img: ''
				}
			}
		},
		mounted(){
			this.timer = setInterval(() => {
				this.positionY ++;
			}, 600)
			var theme = this.util.getStorage('theme');
      this.sysbg = theme.header.background;
			if(theme.loading && theme.loading.img) {
				this.loadingIsDiy = true;
				this.diyLoading = Object.assign(this.diyLoading, theme.loading)
			}
		},
		beforeDestroy(){
			clearInterval(this.timer);
		}
	}
</script>

<style scoped>

	#loading{
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 100000000;
		background-color: #fff;
	}
	#loading .sk-spinner-three-bounce.sk-spinner {
		width: 70px;
		text-align: center;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
	#loading .sk-spinner-three-bounce div {
		width: 18px;
		height: 18px;
		background-color: #ff2d4b;
		border-radius: 100%;
		display: inline-block;
		-webkit-animation: sk-threeBounceDelay 1.4s infinite ease-in-out;
		animation: sk-threeBounceDelay 1.4s infinite ease-in-out;
		/* Prevent first frame from flickering when animation starts */
		-webkit-animation-fill-mode: both;
		animation-fill-mode: both;
	}
	#loading .sk-spinner-three-bounce .sk-bounce1 {
		-webkit-animation-delay: -0.32s;
		animation-delay: -0.32s;
	}
	#loading .sk-spinner-three-bounce .sk-bounce2 {
		-webkit-animation-delay: -0.16s;
		animation-delay: -0.16s;
	}
	@-webkit-keyframes sk-threeBounceDelay {
		0%,
		80%,
		100% {
			-webkit-transform: scale(0);
			transform: scale(0);
		}
		40% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}
	}
	@keyframes sk-threeBounceDelay {
		0%,
		80%,
		100% {
			-webkit-transform: scale(0);
			transform: scale(0);
		}
		40% {
			-webkit-transform: scale(1);
			transform: scale(1);
		}
	}

	/*自定义加载动画*/
	#loading .diy-loading{
		position: relative;
		width: 100%;
		height: 100%;
		background-color: #f5f5f5;
	}
	#loading .diy-loading img{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, 0);
		max-width: 70%;
	}
</style>



// WEBPACK FOOTER //
// src/components/loading.vue