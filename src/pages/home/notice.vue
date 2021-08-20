<template>
	<div id="notice">
		<public-header title="公告"></public-header>
		<public-footer :menufooter="menufooter" :preLoading="preLoading"></public-footer>
		<div class="content" v-html="content"></div>
	</div>
</template>

<script>
	import PublicFooter from '@/components/footer'
	import PublicHeader from '@/components/header'
	export default {
		name: "notice",
		data() {
			return {
				preLoading:false,
				id: Number,
				content: '',
				menufooter: {},
			}
		},
		components: {
			PublicFooter,
			PublicHeader
		},
		methods: {
			onLoad() {
				this.preLoading = true;
				this.util.request({
					url: 'wmall/home/notice',
					data: {
						id: this.id,
						menufooter: 1,
					}
				}).then((res) => {
					this.preLoading = false;
					var result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					this.content = result.message.content;
					this.menufooter = window.menufooter;
				})
			}
		},
		created() {
			if(this.$route.query.id) {
				this.id = this.$route.query.id;
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style scoped>
	#notice .content{
		background-color: #fff;
		padding: 10px;
		line-height: 1.5;
	}
</style>


// WEBPACK FOOTER //
// src/pages/home/notice.vue