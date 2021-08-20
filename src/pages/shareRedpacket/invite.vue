<template>
	<div id="shareRedpacket-invite">
		<public-header :title="redPacket.title"></public-header>
		<div class="content">
			<div class="platform-ad">
				<img src="static/img/shareRedpacket-top.png" alt="">
			</div>
			<div class="active-day">
				<div class="day-picture">
					<img :src="member.avatar" alt="">
				</div>
				<p class="day-info">
					Hi,我来{{mall_title}}{{days_format}}了，你也快来吧！
				</p>
			</div>
			<div class="activity-box">
				<div class="activity-info">
					<p>新用户最高可得</p>
					<p class="packet-money">¥<span>{{redPacket.follow_redpacket_max}}</span></p>
				</div>
				<div class="user-info">
					<div class="phone-input"><input type="text" name="mobile" v-model='mobile' placeholder="请输入手机号"></div>
					<div class="captcha clearfix">
						<div class="captcha-input">
							<input type="text" name="captcha" v-model='captcha' placeholder="请输入图形验证码">
						</div>
						<img @click="onRefreshCaptcha" :src="captcha_img" class="btn-captcha"/>
					</div>
					<div class="code clearfix">
						<div class="code-input">
							<input type="text" name="code" v-model='code' placeholder="请输入验证码">
						</div>
						<div class="send-code" :class="{disabled: code_disabled}" @click="onGetCode">{{code_html}}</div>
					</div>
					<div class="now-get">
						<div id="now-get" @click="onSubmit">立即领取</div>
					</div>
				</div>
				<div class="box-bottom">
					<img src="static/img/box_bot.png" alt="">
				</div>
				<input type="hidden" name="hidden" value="">
			</div>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		components: {
			PublicHeader
		},
  		data() {
  			return {
  				mobile: '',
  				captcha: '',
  				code: '',
  				redPacket: {},
  				member: {},
  				mall_title: '',
  				days_format: '',
  				captcha_img: '',
  				code_html: "获取验证码",
  				downcount: 60,
  				code_disabled: false,
  			}
  		},
  		computed: {
  		},
  		methods: {
  			onRefreshCaptcha() {
  				this.util.request({
					url: 'shareRedpacket/share/captcha',
				}).then((res) => {
					this.captcha_img = res.data.message.message.captcha;
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
  			onSubmit() {
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
				if(!this.code) {
					this.$toast('请输入短信验证码');
					return false;
				}
				this.util.request({
					url: 'shareRedpacket/share/invite',
					method: 'POST',
					data: {
						mobile: this.mobile,
						captcha: this.captcha,
						code: this.code,
						uid: this.uid,
					}
				}).then((res) => {
					let result = res.data.message
					if(result.errno) {
						this.$toast(result.message);
						if(result.errno == -1000) {
							this.$router.push(this.util.getUrl({path: '/package/pages/shareRedpacket/repeat'}));
						}
						return false;
					} else {
						this.$router.push(this.util.getUrl({path: '/package/pages/shareRedpacket/success', query:{uid: result.message}}));
					}
				})	
  			},
			onLoad() {
				this.util.request({
					url: 'shareRedpacket/share/invite',
					data: {
						u: this.uid
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						if(result.errno == -1000) {
							this.$router.replace(this.util.getUrl({path: '/package/pages/shareRedpacket/repeat'}));
						}
						return false;
					}
					result = result.message;
					this.member = result.member;
					this.mall_title = result.mall_title;
					this.redPacket = result.redPacket;
					this.days_format = result.days_format;
					this.captcha_img = result.captcha;
				})
			},
		},
		created() {
			this.query = this.$route.query;
			if(this.query) {
				this.uid = this.query.u;
			}
		},
		mounted () {
			this.onLoad();
		},
	}
</script>

<style>
	#shareRedpacket-invite .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
	    background: url(../../../static/img/bgrepeat.png) repeat;
		overflow-x: hidden;
        overflow-y: scroll;
        padding: 20px 10px 0;
        text-align: center;
	}
	#shareRedpacket-invite .content::-webkit-scrollbar {
        display: none;
    }
    #shareRedpacket-invite .van-nav-bar{
	    background-color: #fff!important;
	    color: #000!important;
    }
    #shareRedpacket-invite .van-hairline--bottom .van-icon-left{
    	color: #000!important;
    }
    #shareRedpacket-invite .content .platform-ad{
		    box-sizing: border-box;
		    display: block;
    }
    #shareRedpacket-invite .content .platform-ad img{
		border: none;
		max-width: 100%;
    }
    #shareRedpacket-invite .content .active-day{
		position: relative;
		height: 50px;
    }
    #shareRedpacket-invite .content .active-day .day-picture{
		position: absolute;
		left: 0;
		top: 0;
		border-radius: 100%;
		border: 2px solid #3d1e13;
		padding: 1px;
		width: 44px;
		height: 44px;
		z-index: 1;
    }
    #shareRedpacket-invite .content .active-day .day-picture img{
		width: 100%;
		border-radius: 100%;
		border: none;
    }
    #shareRedpacket-invite .content .active-day .day-info{
		margin-top: 7.4px;
		margin-bottom: 0;
		height: 32px;
		line-height: 32px;
		position: absolute;
		background: #ffee8a;
		border: 2px solid #3d1e13;
		border-radius: 6px;
		font-size: 12px;
		width: 82%;
		left: 1%;
		text-align: left;
		padding-left: 56px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
    }
    #shareRedpacket-invite .content .activity-box{
	    margin-top: 5px;
    }
    #shareRedpacket-invite .content .activity-box .activity-info{
		font-size: 14px;
		padding-top: 15px;
		padding-bottom: 20px;
		color: #f00;
		background: url(../../../static/img/box.png) no-repeat top center;
		background-size: 100% 100%;
    }
    #shareRedpacket-invite .content .activity-box .activity-info p:first-child{
    	line-height: 18px;
    }
    #shareRedpacket-invite .content .activity-box .activity-info .packet-money{
	    font-size: 16px;
    }
    #shareRedpacket-invite .content .activity-box .activity-info .packet-money span{
		font-size: 36px;
		line-height: 1;
    }
    #shareRedpacket-invite .content .activity-box .user-info{
		background: url(../../../static/img/line_repeat.png) repeat-y;
		background-size: 100% auto;
		padding: 0 15px 0;
    }
    #shareRedpacket-invite .content .activity-box .user-info .phone-input{
		background: url(../../../static/img/btn_white.png) no-repeat;
		background-size: 100% 100%;
		width: 100%;
		height: 40px;
		text-align: left;
    }
    #shareRedpacket-invite .content .activity-box .user-info .phone-input input{
		width: 94%;
		height: 40px;
		border: none;
		padding-left: 20px;
		background: rgba(255,255,255,0);
		font-size: 14px;
    }
    #shareRedpacket-invite .content .activity-box .user-info .captcha{
		height: 40px;
		margin-top: 10px;
    }
    .clearfix:after{
    	clear: both;
    }
    #shareRedpacket-invite .content .activity-box .user-info .captcha .captcha-input{
		background: url(../../../static/img/btn_white.png) no-repeat;
		background-size: 100% 100%;
		width: 65%;
		float: left;
    }
    #shareRedpacket-invite .content .activity-box .user-info .captcha .captcha-input input{
		width: 91%;
		height: 40px;
		border: none;
		padding-left: 20px;
		background: rgba(255,255,255,0);
		font-size: 14px;
    }
    #shareRedpacket-invite .content .activity-box .user-info .captcha .btn-captcha{
		display: block;
		width: 30%;
		height: 36px;
		line-height: 40px;
		border: 2px solid #3d1e13;
		border-radius: 8px;
		float: right;
    }
    #shareRedpacket-invite .content .activity-box .user-info .code{
		height: 40px;
		margin-top: 10px;
    }
    #shareRedpacket-invite .content .activity-box .user-info .code .code-input{
		background: url(../../../static/img/btn_white.png) no-repeat;
		background-size: 100% 100%;
		width: 65%;
		float: left;
    }
    #shareRedpacket-invite .content .activity-box .user-info .code .code-input input{
		width: 91%;
		height: 38px;
		border: none;
		padding-left: 20px;
		background: rgba(255,255,255,0);
		font-size: 14px;
    }
    #shareRedpacket-invite .content .activity-box .user-info .code .send-code{
		background: url(../../../static/img/btn_yellow.png) no-repeat;
		background-size: 100% 100%;
		display: block;
		width: 30%;
		height: 36px;
		overflow: hidden;
		line-height: 34px;
		color: #000;
		font-size: 16px;
		border: 2px solid #3d1e13;
		border-radius: 8px;
		float: right;
    }
    #shareRedpacket-invite .content .activity-box .user-info .now-get{
		background: url(../../../static/img/btn_yellow.png) no-repeat;
		background-size: 100% 100%;
		margin-top: 10px;
		border: 2px solid #3d1e13;
		border-radius: 8px;
    }
    #shareRedpacket-invite .content .activity-box .user-info .now-get div{
		display: block;
		width: 100%;
		line-height: 40px;
		color: #644505;
		font-size: 16px;
    }
	#shareRedpacket-invite .content .activity-box .box-bottom img{
		border: none;
		max-width: 100%;
    }
</style>


// WEBPACK FOOTER //
// src/pages/shareRedpacket/invite.vue