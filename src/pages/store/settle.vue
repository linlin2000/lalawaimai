<template>
	<div id="store-settle">
		<public-header title="商户入驻"></public-header>
		<div class="content">
			<van-cell-group>
				<van-field v-model="mobile" label="手机号" placeholder="请输入手机号"/>
				<van-field v-if="mobile_verify_status == 1" v-model="captcha" type="number" label="图形验证码" placeholder="请输入图形验证码"/>
				<van-field v-if="mobile_verify_status == 1" v-model="code" type="number" label="短信验证码" placeholder="请输入6位短信验证码"/>
				<van-field v-model="password" type="password" label="登录密码" placeholder="请输入您的登录密码"/>
				<van-field v-model="repassword" type="password" label="确认密码" placeholder="请输入确认登录密码"/>
				<van-field v-model="title" label="姓名" placeholder="您的姓名"/>
				<van-field v-if="isagent > 0" :value="agentTitle" label="所属区域" placeholder="选择所属区域" @click="showAgents = true"/>
			</van-cell-group>
			<div class="email-img" @click="onRefreshCaptcha" v-if="mobile_verify_status == 1">
				<img :src="captcha_img" alt="">
			</div>
			<div @click="onGetCode" class="list-password" :class="{disabled: code_disabled}" v-if="mobile_verify_status == 1">{{code_html}}<van-icon name='right'></van-icon></div>
			<div class="submit" @click="onSubmit">
				<van-button size="normal" type="danger" :block="true" :disabled="submitting">下一步</van-button>
			</div>
			<imessage v-if="message.type":message = message></imessage>
		</div>
		<van-popup v-model="showAgents" position="bottom">
			<div class="popup-picknum">
				<van-picker :columns="agents" title="选择区域" @confirm="onConfirmAgent" @cancel="onCancelAgent()" show-toolbar confirm-button-text="确认" cancel-button-text="取消"/>
			</div>
		</van-popup>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import imessage from '@/components/imessage'
	export default {
		name: "storeSettle",
		components: {
			PublicHeader,
			imessage
		},
		data() {
			return {
				submitting: false,
				showAgents: false,
				isagent: 0,
				agentid: 0,
				agentTitle: '',
				agents: [],
				mobile: '',
				title: '',
				password: '',
				repassword: '',
				captcha: '',
				code: '',
				mobile_verify_status: 0,
				captcha_img: '',
				code_html: "获取验证码",
				downcount: 60,
				code_disabled: false,
				message: {
					type: '',
					message: '',
					description: '',
					redirect: '',
					btnText: '',
				}
			}
		},
		methods: {
			onConfirmAgent(value, index) {
				this.agentid = value.id;
				this.agentTitle = value.text;
				this.showAgents = false;
			},
			onCancelAgent() {
				this.showAgents = false;
				this.agentid = 0;
				this.agentTitle = '';
			},
			onRefreshCaptcha() {
				this.util.request({
					url: 'wmall/store/settle/captcha',
				}).then((res) => {
					this.captcha_img = res.data.message.message.captcha;
				})
			},
			onSubmit() {
				if(this.submitting) {
					return false;
				}
				if(!this.mobile){
					this.$toast('手机号不能为空');
					return false;
				}
				if(!this.util.isValidMobile(this.mobile)) {
					this.$toast('手机号格式错误');
					return false;
				}
				if(this.mobile_verify_status == 1) {
					if(!this.captcha) {
						this.$toast('请输入图形验证码');
						return false;
					}
					if(!this.code) {
						this.$toast('请输入短信验证码');
						return false;
					}
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
				if(this.isagent > 0) {
					if(!this.agentid) {
						this.$toast('请选择所属区域');
						return false;
					}
				}
				this.submitting = true;
				this.util.request({
					url: 'wmall/store/settle',
					method: 'POST',
					data: {
						mobile: this.mobile,
						code: this.code,
						password: this.password,
						repassword: this.repassword,
						title: this.title,
						agentid: this.agentid
					},
				}).then((res) => {
					let result = res.data.message;
					this.util.$toast(result.message, '', 1000);
					if(result.errno) {
						if(result.errno == -1000) {
							this.onLoad();
						}
						this.submitting = false;
						return false;
					}
				})
			},
			onGetCode() {
				if(this.downcount != 60) {
					return false;
				}
				if(!this.mobile) {
					this.$toast('请输入手机号');
					return false;
				}
				if(!this.util.isValidMobile(this.mobile)) {
					this.$toast('手机号格式错误');
					return false;
				}
				if(!this.captcha) {
					this.$toast('请输入图形验证码');
					return false;
				}

				this.util.request({
					url: 'system/common/code',
					method: 'POST',
					data: {
						mobile: this.mobile,
						captcha: this.captcha
					}
				}).then((res) => {
					let result = res.data.message
					if(result.errno) {
						this.$toast(result.message);
						return;
					} else {
						var timer = setInterval(() => {
							this.downcount--;
							if(this.downcount <= 0){
								clearInterval(timer);
								this.code_html = "获取验证码";
								this.downcount = 60;
							} else {
								this.code_disabled = true;
								this.code_html = this.downcount + "秒后重新获取";
							}
						}, 1000);
						this.$toast('验证码发送成功, 请注意查收');

					}
				})

			},
			onLoad() {
				this.util.request({
					url: 'wmall/store/settle',
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						if(result.errno == -1000) {
							this.$router.replace(this.util.getUrl({path: '/pages/store/application'}));
							return;
						}
						this.message = {
							type: 'error',
							message: result.message,
							redirect: this.util.getUrl({path: '/pages/member/mine'}),
							btnText: '返回',
						} 				
						return false;
					}
					this.mobile_verify_status = result.message.mobile_verify_status;
					this.captcha_img = result.message.captcha;
					this.isagent = result.message.isagent;
					if(this.isagent > 0) {
						this.agents = result.message.agents;
					}
				})
			}

		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style scoped>
	#store-settle .content{
		padding-top: 10px;
	}
	#store-settle .content .submit{
		margin-top: 20px;
		padding: 0 15px;
	}
	#store-settle .content .email-img{
		height: 32px;
		width: 90px;
		position: absolute;
		top: 60px;
		right: 15px;
	}
	#store-settle .content .email-img img{
		border: none;
		width: 100%;
		height: 100%;
	}
	#store-settle .content .list-password{
		z-index: 10000;
		position: absolute;
		top: 108px;
		right: 15px;
		font-size: 14px;
		color: #888;
		line-height: 24px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/store/settle.vue