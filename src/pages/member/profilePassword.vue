<template>
	<div id="memberProfilePassword">
		<public-header title="修改密码"></public-header>
		<div class="content">
			<van-cell-group>
				<van-field v-model="password" type="password" placeholder="当前密码" />
				<van-field v-model="newpassword" type="password" placeholder="新密码" />
				<van-field v-model="repassword" type="password" placeholder="确认新密码" />
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
				password: '',
				newpassword: '',
				repassword: '',
			}
		},
		components: {
			PublicHeader,
		},
		methods: {
			onSubmit() {
				if (!this.password) {
					this.$toast('当前密码不能为空');
					return false;
				}
				if (!this.newpassword) {
					this.$toast('新密码不能为空');
					return false;
				} else {
					var length = this.newpassword.length;
					if(length < 8 || length > 20) {
						this.$toast("请输入8-20位密码");
						return false;
					}
					var reg = /[0-9]+[a-zA-Z]+[0-9a-zA-Z]*|[a-zA-Z]+[0-9]+[0-9a-zA-Z]*/;
					if(!reg.test(this.newpassword)) {
						this.$toast("密码必须由数字和字母组合");
						return false;
					}
				}
				if (!this.repassword) {
					this.$toast('请确认新密码');
					return false;
				}
				if(this.newpassword != this.repassword) {
					this.$toast('两次密码输入不一致');
					return false;
				}
				var params = {
					type: 'account',
					password: this.password,
					newpassword: this.newpassword,
					repassword: this.repassword
				}
				this.util.request({
					url: 'wmall/member/profile/edit',
					data: params
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return;
					} else {
						this.$router.push('/pages/member/profile')
					}
				})
			},
		},
	}
</script>

<style>
	#memberProfilePassword .content{
		padding-top: 10px;
	}
	#memberProfilePassword .content .submit{
		margin-top: 20px;
		padding: 0 15px;
	}
</style>



// WEBPACK FOOTER //
// src/pages/member/profilePassword.vue