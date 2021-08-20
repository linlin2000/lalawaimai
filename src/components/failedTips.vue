<template>
	<div id="failed-tips">
		<div class="wrapper">
			<img :src="'static/img/tips/' + failedTips.type + '.png'" alt="">
			<p class="tips">{{failedTips.tips}}</p>
			<a @click="util.jsUrl(failedTips.link)" class="link">{{failedTips.btnText}}</a>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			failedTips: {
				type: Object,
				default() {
					return {
						type: 'location',
						tips: '获取定位失败!您可以选择手动搜索地址',
						btnText: '手动搜索地址',
						link: '/pages/home/location'
					}
				}
			}
		},
		data() {
			return {}
		},
	}
</script>

<style>
	#failed-tips{
		position: fixed;
		z-index: 100000;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		background-color: #f5f5f5;
	}
	#failed-tips .wrapper{
		position: absolute;
		top: 40%;
		left: 0;
		right: 0;
		transform: translateY(-50%);
		text-align: center;
		font-size: 16px;
		color: #768491;
	}
	#failed-tips .wrapper img{
		width: 120px;
		height: 120px;
		border: 0px;
	}
	#failed-tips .wrapper .tips{
		padding: 20px;
		line-height: 1.8;
	}
	#failed-tips .wrapper .link{
		display: inline-block;
		padding: 10px 16px;
		background: #ff2b4d;
		color: #fff;
		border-radius: 3px;
	}

</style>


// WEBPACK FOOTER //
// src/components/failedTips.vue