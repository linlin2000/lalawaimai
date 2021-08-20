<template>
	<div id="gohome-poster">
		<div class="content">
			<div class="img-wrap">
				<van-loading type="spinner" v-if="preLoading" />
				<img class="img-100" :src="respon" alt="" v-else>
			</div>
			<div class="tip">
				<img src="static/img/postershare.png" alt="">
				<span class="font-16 c-white">长按上图保存图片，或发送给好友</span>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				preLoading: true,
				respon: ''
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'gohome/poster/index',
					data: {
						goods_id: this.goods_id,
						type: this.type
					}
				}).then((res) => {
					this.preLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					this.respon = result.message.respon;
				})
			},
		},
		created() {
			if(this.$route.query) {
				this.goods_id = this.$route.query.goods_id
				this.type = this.$route.query.type
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#gohome-poster .content{
		background-color: #000;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	#gohome-poster .img-wrap{
		margin: 20px 20px 15px;
		border-radius: 5px;
		overflow: hidden;
	}
	#gohome-poster .img-wrap img{
		width: 100%;
		height: auto;
		pointer-events: auto;
	}
	#gohome-poster .tip{
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		font-size: 0px;
	}
	#gohome-poster .tip img{
		width: 20px;
		margin-right: 5px;
	}
</style>



// WEBPACK FOOTER //
// src/pages/gohome/poster/index.vue