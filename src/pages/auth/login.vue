<template>
	<div id="login">
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
						type="text"
						placeholder="请输入手机号"
					/>
					<van-field
						v-model="password"
						left-icon="lock"
						type="password"
						placeholder="请输入密码"
					/>
				</van-cell-group>
				<router-link :to="util.getUrl({path: '/pages/auth/forget'})" class="list-password">忘记密码<van-icon name='right'></van-icon></router-link>
				<div class="content-padded">
					<div @click="onLogin" class="button-login">登录</div>
				</div>
			</div>
			<div class="text">
				<p>还没有账号？<router-link :to="util.getUrl({path: '/pages/auth/register'})" class="text-a">立即注册</router-link></p>
			</div>
			<div class="other-way" v-if="util.ish5app() && gconfig.app && gconfig.app.customer && (gconfig.app.customer.login.qq == 1 || gconfig.app.customer.login.wx == 1)">
				<div class="use-way">
					<span>使用合作账号登录/注册</span>
					<span class="line van-hairline--top"></span>
				</div>
				<div class="other-entry">
					<div class="entry-item" v-if="gconfig.app.customer.login.qq == 1" @click="h5appLogin('qq')">
						<img src="../../../static/img/accounts_icon_qq.png" alt="" />
						<span>腾讯QQ</span>
					</div>
					<div class="entry-item" v-if="gconfig.app.customer.login.wx == 1" @click="h5appLogin('wx')">
						<img src="../../../static/img/accounts_icon_weichat.png" alt="" />
						<span>微信</span>
					</div>
				</div>
			</div>
		</div>
		<transition name="loading">
			<iloading v-show="showLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import h5app from '@/config/h5app'
	import util from '@/config/util'
	export default {
		data() {
			return {
				mobile: '',
				password: '',
				config: {},
				gconfig: {},
				showLoading: true
			}
		},
		beforeRouteEnter (to, from, next){
			if(from.name) {
				window.redirct_url = {path: from.path, query: from.query};
			}
			next(vm => {
				vm.util.checkToken({
					success: function() {
						vm.$router.replace(util.getUrl({path: '/pages/home/index'}));
						return false;
					},
					fail: function() {
						vm.onLoad();
						return false;
					},
				})
			})
		},
		methods: {
			onLogin() {
				if(!this.mobile) {
					this.$toast('手机号不能为空');
				}
				if(!this.util.isValidMobile(this.mobile)) {
					this.$toast('手机号格式错误');
					return false;
				}
				if(!this.password) {
					this.$toast('请输入密码');
				}
				this.util.request({
					url: 'wmall/auth/login',
					method: 'POST',
					data: {
						mobile: this.mobile,
						password: this.password,
						inituid: this.inituid
					},
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message, '', 1000);
						return false;
					}
					result = result.message;
					this.util.setStorage('itoken', result.member.token);

					var redirct_url = window.redirct_url;
					if(!redirct_url || (redirct_url && redirct_url.path.indexOf('pages/auth/') != -1)) {
						redirct_url = {path: '/pages/home/index'};
					}
					this.$router.replace(this.util.getUrl(redirct_url));
				})
			},
			onLoad() {
				this.util.request({
					url: 'wmall/auth/login',
					data: {
						gconfig: 1,
					}
				}).then((res) => {
					this.showLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message, '', 1000);
						return false;
					}
					this.config = result.message.config_mall;
					this.gconfig = window.gconfig;
				})
			},

			h5appLogin(sns) {
				var that = this;
				if(that.util.isGlala()) {
					that.util.wxLogin();
					return;
				}

				var forwardUrl = this.util.getStorage('forwardUrl');
				h5app.init({
					backurl: forwardUrl
				});
				h5app.sns(sns);
			}
		},
		mounted() {
			this.onLoad()
		},
		created(){
			this.query = this.$route.query;
			if(this.query) {
				this.inituid = this.query.inituid;
			}
		}
	}
</script>

<style>
	#login .content{
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
	#login .content::-webkit-scrollbar {
		display: none;
	}
	#login .content .header{
		background: url(../../../static/img/bg-mypage.png) no-repeat 0 0;
		background-size: 100% 100%;
		overflow: hidden;
	}
	#login .content .header .logo{
		position: relative;
		height: 88px;
		width: 88px;
		border-radius: 100%;
		margin: 20px auto 0;
	}
	#login .content .header .logo img{
		width: 100%;
		height: 100%;
		border-radius: 100%;
	}
	#login .content .header .logo:before{
		position: absolute;
		content: "";
		height: 94px;
		width: 94px;
		border: 1px solid #fff;
		border-radius: 94px;
		top: -4px;
		left: -4px;
	}
	#login .content .header .name{
		height: 50px;
		color: #fff;
		text-align: center;
		font-size: 20px;
		line-height: 50px;
	}
	#login .content .list-block{
		position: relative;
	}
	#login .content .list-block .van-cell .van-icon{
		font-size: 16px;
		color: #999;
	}
	#login .content .list-block .van-cell .van-field__body{
		font-size: 17px;
	}
	#login .content .list-block .content-padded{
		margin: 20px 20px 10px 20px;
	}
	#login .content .list-block .content-padded .button-login{
		position: relative;
		display: block;
		height: 40px;
		line-height: 40px;
		color: #fff;
		background-color: #f6383a;
		border-radius: 25px;
		text-align: center;
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
	}
	#login .content .list-block .list-password{
		z-index: 10000;
		position: absolute;
		top: 58px;
		right: 15px;
		font-size: 14px;
		color: #888;
	}
	#login .content .text{
		padding: 0 32px;
		color: #888;
		font-size: 16px;
		text-align: center;
	}
	#login .content .text p{
		padding: 0;
		margin: 0;
		line-height: 24px;
	}
	#login .content .text p .text-a{
		color: #0894ec;
	}
	#login .content .other-way{
		font-size: 16px;
		color: #999;
		margin-top: 20px;
	}
	#login .content .other-way .use-way{
		position: relative;
		height: 32px;
		text-align: center;
	}
	#login .content .other-way .use-way span:first-child{
		display: block;
		width: 60%;
		margin-left: -30%;
		position: absolute;
		left: 50%;
		background-color: #fff;
		z-index: 10;
		padding: 0 10px;
		line-height: 24px;
	}
	#login .content .other-way .use-way .line{
		display: block;
		width: 100%;
		height: 2px;
		position: absolute;
		top: 40%;
	}
	#login .content .other-way .other-entry{
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0 auto;
		text-align: center;
		max-width: 30%;
	}
	#login .content .other-way .other-entry .entry-item{
		width: 50%;
	}
	#login .content .other-way .other-entry .entry-item img{
		width: 30px;
		height: 30px;
	}
	#login .content .other-way .other-entry .entry-item span{
		display: block;
		font-size: 12px;
		line-height: 18px;
	}
</style>



// WEBPACK FOOTER //
// src/pages/auth/login.vue
