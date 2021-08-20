<template>
	<div id="memberProfileUsername">
		<public-header title="修改用户名"></public-header>
		<div class="content">
			<van-cell-group>
				<van-field v-model="username" placeholder="请输入用户名" />
			</van-cell-group>
			<div class="submit">
				<van-button size="large" type="danger" @click="onSubmit()">确定</van-button>
			</div>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		data() {
			return {
				username: ''
			}
		},
		components: {
			PublicHeader,
		},
		methods: {
			onLoad() {
				if(this.$route.query.username && this.$route.query.username != 'undefined') {
					this.username = this.$route.query.username;
				}
			},
			onSubmit() {
				let params = {
					type: 'username',
					realname: this.username
				}
				this.util.request({
					url: 'wmall/member/profile/edit',
					data: params,
				}).then((res) => {
					var result = res.data.message;
					this.$toast(result.message);
					if(result.errno) {
						return false;
					} else {
						this.$router.push(this.util.getUrl({path: '/pages/member/profile'}));
					}
				})
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#memberProfileUsername .content{
		padding-top: 10px;
	}
	#memberProfileUsername .content .submit{
		margin-top: 20px;
		padding: 0 15px;
	}
</style>



// WEBPACK FOOTER //
// src/pages/member/profileUsername.vue