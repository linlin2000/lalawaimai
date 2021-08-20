<template>
	<div id="memberBind">
		<public-header title="更改绑定手机号"></public-header>
		<div class="content">
			<van-cell-group>
				<van-field v-model="mobile" label="手机号" placeholder="请输入手机号"/>
				<van-field v-model="yzm" label="短信验证码" placeholder="请输入短信验证码" >
					<van-button slot="button" size="small" type="primary" @click="onGetCode()" v-if="code.downcount == 60">{{code.text}}</van-button>
					<van-button slot="button" size="small" type="primary" disabled v-else>{{code.text}}</van-button>
				</van-field>
				<van-field v-model="password" type="password" label="登录密码" placeholder="请输入您的登录密码"/>
				<van-field v-model="repassword" type="password" label="确认密码" placeholder="请输入确认登录密码"/>
			</van-cell-group>
			<div class="submit">
				<van-button size="large" type="danger" @click="onSubmit()">立即绑定</van-button>
			</div>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		data() {
			return {
				mobile: '',
				yzm: '',
				password: '',
				repassword: '',
				getCode: true,
				code: {text : '获取验证码', downcount: 60}
			}
		},
		components: {
			PublicHeader,
		},
		methods: {
			onLoad() {
				if(this.$route.query.mobile && this.$route.query.mobile != 'undefined') {
					this.mobile = this.$route.query.mobile
				}
			},
			onGetCode() {
				if(!this.getCode) {
					return false;
				}
				if(!this.mobile) {
					this.$toast('手机号不能为空');
					return false;
				}
				if(!this.util.isValidMobile(this.mobile)) {
					this.$toast('手机号格式错误');
					return false;
				}
				this.util.request({
					url: 'system/common/code',
					data: {
						mobile: this.mobile
					},
				}).then((res) => {
					var result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return false;
					} else {
						this.code.text = this.code.downcount + "秒后重新获取";
						var timer = setInterval(() => {
							this.code.downcount--;
							if(this.code.downcount <= 0){
								clearInterval(timer);
								this.code.text = "获取验证码";
								this.code.downcount = 60;
								this.getCode = true;
							} else {
								this.code.text = this.code.downcount + "秒后重新获取";
							}
						}, 1000);
						this.$toast('验证码发送成功, 请注意查收');
					}
				})
			},
			onSubmit() {
				if(!this.mobile){
					this.$toast('手机号不能为空');
					return false;
				}
				if(!this.util.isValidMobile(this.mobile)) {
					this.$toast('手机号格式错误');
					return false;
				}
				if(!this.yzm) {
					this.$toast('请输入短信验证码');
					return false;
				}
				if (!this.password) {
					this.$toast('密码不能为空');
					return false;
				} else {
					var length = this.password.length;
					if(length < 8 || length > 20) {
						this.$toast("请输入8-20位密码");
						return false;
					}
					var reg = /[0-9]+[a-zA-Z]+[0-9a-zA-Z]*|[a-zA-Z]+[0-9]+[0-9a-zA-Z]*/;
					if(!reg.test(this.password)) {
						this.$toast("密码必须由数字和字母组合");
						return false;
					}
				}
				if (!this.repassword) {
					this.$toast('请重复输入密码');
					return false;
				}
				if(this.password != this.repassword) {
					this.$toast('两次密码输入不一致');
					return false;
				}
				var params = {
					mobile: this.mobile,
					code: this.yzm,
					password: this.password,
					repassword: this.repassword
				}
				this.util.request({
					url: 'wmall/member/profile/bind',
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
	#memberBind .content{
		padding-top: 10px;
	}
	#memberBind .content .submit{
		margin-top: 20px;
		padding: 0 15px;
	}
</style>



// WEBPACK FOOTER //
// src/pages/member/bind.vue