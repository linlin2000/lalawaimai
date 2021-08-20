<template>
	<div id="forget">
		<div class="content">
			<div class="header">
				<div class="logo">
					<img v-if="config.logo" :src="config.logo" alt=""/>
					<img v-else src="static/img/head.png" alt=""/>
				</div>
				<div class="name">{{config.title}}</div>
			</div>
			<div class="list-block">
				<van-cell-group>
				  <van-field
				    v-model="mobile"
				    left-icon="phone1"
				    type="number"
				    placeholder="请输入手机号"
				  />
				  <van-field
				    v-model="captcha"
				    left-icon="code"
				    type="number"
				    placeholder="请输入图形验证码"
				  />
				  <van-field
				    v-model="code"
				    left-icon="email"
				    type="number"
				    placeholder="请输入6位短信验证码"
				  />
				  <van-field
				    v-model="password"
				    left-icon="lock"
				    type="password"
				    placeholder="请输入新密码"
				  />
				  <van-field
				    v-model="repassword"
				    left-icon="lock"
				    type="password"
				    placeholder="请重复输入新密码"
				  />
				</van-cell-group>
				<div class="email-img" @click="onRefreshCaptcha">
					<img :src="captcha_img" alt="">
				</div>
				<div @click="onGetCode" class="list-password" :class="{disabled: code_disabled}">{{code_html}}<van-icon name='right'></van-icon></div>
				<div class="content-padded">
					<div class="button-register" @click="onSubmit">立即找回</div>
				</div>
			</div>
			<div class="text">
				<p>已有账号？<router-link :to="util.getUrl({path: '/pages/auth/login'})" class="text-a">立即登录</router-link></p>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				mobile: '',
				password: '',
				repassword: '',
				captcha: '',
				code: '',
				config: {},
				downcount: 60,
				captcha_img: '',
  				code_html: "获取验证码",
  				downcount: 60,
  				code_disabled: false,
			}
		},
		methods: {
			onRefreshCaptcha() {
  				this.util.request({
					url: 'wmall/auth/forget/captcha',
				}).then((res) => {
					this.captcha_img = res.data.message.message.captcha;
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
				if(!this.captcha) {
					this.$toast('请输入图形验证码');
					return false;
				}
				if(!this.code) {
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
				this.util.request({
					url: 'wmall/auth/forget',
					method: 'POST',
					data: {
						mobile: this.mobile,
						code: this.code,
						password: this.password,
						repassword: this.repassword
					},
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message, '', 1000);
						return false;
					}
					result = result.message;
					this.util.setStorage('itoken', result.member.token);
					this.$router.replace(this.util.getUrl({path: '/pages/home/index'}));
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
					url: 'wmall/auth/forget',
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message, '', 1000);
						return false;
					}
					this.config = result.message.config_mall;
					this.captcha_img = result.message.captcha;
				})
			}

		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#forget .content{
	position: fixed;
	top: 0px;
	right: 0;
	left: 0;
	bottom: 0px;
	width: 100%;
	background: #fff;
	overflow-x: hidden;
    overflow-y: scroll;
	}
	#forget .content::-webkit-scrollbar {
        display: none;
    }
    #forget .content .header{
	    height: 160px;
	    background: url(../../../static/img/bg-mypage.png) no-repeat 0 0;
	    background-size: 100% 100%;
	    overflow: hidden;
    }
    #forget .content .header .logo{
	    position: relative;
	    height: 88px;
	    width: 88px;
	    border-radius: 100%;
	    margin: 20px auto 0;
    }
    #forget .content .header .logo:before{
	    position: absolute;
	    content: "";
	    height: 94px;
	    width: 94px;
	    border: 1px solid #fff;
	    border-radius: 94px;
	    top: -4px;
	    left: -4px;
    }
    #forget .content .header .logo img{
	    height: 88px;
	    width: 88px;
	    border-radius: 88px;
	    display: block;
	    border: none;
	    max-width: 100%;
    }
    #forget .content .header .name{
		height: 50px;
	    color: #fff;
	    text-align: center;
	    font-size: 20px;
	    line-height: 50px;
    }
    #forget .content .list-block{
    	position: relative;
    	overflow: hidden;
    }
    #forget .content .list-block .van-cell .van-icon{
    	font-size: 16px;
    	margin-right: 12px;
    }
    #forget .content .list-block .van-cell .van-cell__value .van-field__body{
    	font-size: 17px;
    }
    #forget .content .list-block .email-img{
	    height: 32px;
	    width: 90px;
	    position: absolute;
	    top: 49px;
	    right: 15px;
    }
    #forget .content .list-block .email-img img{
	    border: none;
	    max-width: 100%;
    }
    #forget .content .list-block .list-password{
	    z-index: 10000;
	    position: absolute;
	    top: 102px;
	    right: 15px;
	    font-size: 14px;
	    color: #888;
	    line-height: 24px;
    }
    #forget .content .list-block .content-padded{
    	margin: 20px 20px 10px 20px;
    }
    #forget .content .list-block .content-padded .button-register{
    	display: block;
	    border-radius: 25px;
	    font-size: 17px;
        color: #fff;
    	background-color: #f6383a;
    	height: 40px;
    	line-height: 40px;
    	width: 100%;
	    text-align: center;
	    text-decoration: none;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    cursor: pointer;
    }
    #forget .content .text{
	    padding: 0 32px;
	    color: #888;
	    font-size: 16px;
	    text-align: center;
	    line-height: 24px;
    }
    #forget .content .text .text-a{
    	color: #0894ec;
    }
</style>



// WEBPACK FOOTER //
// src/pages/auth/forget.vue