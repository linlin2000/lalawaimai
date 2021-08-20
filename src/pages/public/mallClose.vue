<template>
	<div id="mall-close">
		<failed-tips :failedTips="failedTips"></failed-tips>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				failedTips: {
					type: 'message',
					tips: '平台暂时关闭',
					btnText: '知道喽',
					link: 'close'
				},
			}
		},
		methods: {
			onLoad() {
				var that = this;
				that.util.request({
					url: 'wmall/home/mallclose',
				}).then((res) => {
					that.$router.replace(that.util.getUrl({path: 'pages/home/index'}))
				})
			}
		},
		mounted() {
			this.onLoad();
			var mallClose = this.util.getStorage('mallClose');
			if(mallClose && mallClose.tips) {
				this.failedTips.tips = mallClose.tips;
			}
		}
	}
</script>

<style>

</style>


// WEBPACK FOOTER //
// src/pages/public/mallClose.vue