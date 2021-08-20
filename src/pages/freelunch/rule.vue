<template>
	<div id="freelunch-rule">
		<div class="content">
			<div class="banner">
				<img src="static/img/freeLunch_rule.png" alt="">
				<div class="close" @click="onClose">关闭</div>
			</div>
			<div class="rules" v-html="agreement"></div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "freelunchRule",
		data() {
			return {
				agreement: ''
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'freeLunch/freeLunch/rule',
				}).then((res) => {
					var result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					this.agreement = result.message.agreement;
				})
			},
			onClose() {
				this.$router.go(-1);
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style scoped>
	#freelunch-rule .content{
		background-color: #ff2d4b;
		padding-bottom: 16px;
	}
	#freelunch-rule .banner{
		position: relative;
		height: 100px;
	}
	#freelunch-rule .banner img{
		width: 100%;
	}
	#freelunch-rule .banner .close{
		position: absolute;
		right: 10px;
		top: 10px;
		color: #fff;
	}
	#freelunch-rule .rules{
		font-size: 14px;
		position: relative;
		background-color: #fff;
		width: 94%;
		min-height: 80%;
		margin: 0 auto;
		padding: 16px;
		border-radius: 5px;
		line-height: 1.5;
	}
</style>


// WEBPACK FOOTER //
// src/pages/freelunch/rule.vue