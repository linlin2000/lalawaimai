<template>
	<div id="vip-index">
		<div class="content">
			<header class="wrapper">
				<div class="card">
					<div class="card-top">
						<span>专享红包</span>
						<img src="static/img/svip-head.png" alt="">
						<span>下单奖励</span>
					</div>
					<h2 class="card-title">加入即领20元红包</h2>
					<div class="card-description">众多会员特权，平均每年可省785元</div>
				</div>
				<section class="card-list">
					<header class="list-header">
						<h2 class="title-header">会员特权</h2>
					</header>
					<router-link to="" class="list-bonus">
						特权说明
						<van-icon name='question1'></van-icon>
					</router-link>
					<ul class="list-item">
						<li>
							<img src="static/img/svip-list-bg1.png" alt="">
							<span>专享红包</span>
						</li>
						<li>
							<img src="static/img/svip-list-bg2.png" alt="">
							<span>奖励金</span>
						</li>
						<li>
							<img src="static/img/svip-list-bg3.png" alt="">
							<span>专属客服</span>
						</li>
						<li>
							<img src="static/img/svip-list-bg4.png" alt="">
							<span>专属折扣</span>
						</li>
						<li>
							<img src="static/img/svip-list-bg5.png" alt="">
							<span>金币特权</span>
						</li>
					</ul>
				</section>
			</header>
			<div class="vip-body">
				<div class="member-title">
					<div class="member-info">请填写会员信息</div>
				</div>
				<van-cell-group>
					<van-field
						v-model="username"
						label="姓名"
						placeholder="请输入姓名"
					/>
					<van-field
						v-model="mobile"
						label="手机号"
						placeholder="请输入手机号"
					/>
				</van-cell-group>
				<div class="vip-checked">
					<i class="icon" :class="{'icon-check': check == '1'}" @click="onChecked"></i>
					我已阅读并同意以下 <span @click="onChangePopup">《开通会员卡协议》</span>
				</div>
			</div>
			<footer class="go-member">
				<div class="button"  @click='onSubmit'>
					<span>开通会员</span>
				</div>
			</footer>
			<van-popup v-model="agreementShow" position="bottom" class="agreement-popup">
				<van-nav-bar class="border-0px" title="会员卡协议详解" @click-left="onChangePopup" :style="{background: '#ff2d4b', color: '#fff' }">
					<van-icon name="left" :style="{color: '#fff'}" slot="left" class="font-20"></van-icon>
				</van-nav-bar>
				<div class="popup-content margin-10" v-html="agreement"></div>
			</van-popup>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				check: 1,
				username: '',
				mobile: '',
				agreement: '',
				agreementShow: false
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'vip/vipcard/index',
				}).then((res) => {
					let result = res.data.message.message;
					this.username = result.member.realname;
					this.mobile = result.member.mobile;
					this.agreement =  result.agreement;
				})
			},
			onSubmit() {
				if(!this.check){
					this.$toast('请先同意协议');
					return false;
				}
				if(!this.username){
					this.$toast('姓名不能为空');
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
				this.util.request({
					url: 'vip/vipcard/post',
					data: {
						username: this.username,
						mobile: this.mobile,
						//fee: 30
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						if(result.errno == -1000) {
							this.util.$toast(result.message, this.util.getUrl({path: '/pages/vip/recharge'}), 1000, 'replace');
							return;
						}
						this.util.$toast(result.message, '', 1000);
						return false;
					}
					var order_id = result.message;
					this.$router.replace(this.util.getUrl({path: '/pages/public/pay?order_id=' + order_id + '&order_type=vip'}));
				})
			},
			onChangePopup() {
				this.agreementShow = !this.agreementShow;
			},
			onChecked() {
				this.check = !this.check;
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#vip-index .content{
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 65px;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#vip-index .content::-webkit-scrollbar {
		display: none;
	}
	#vip-index .content .wrapper{
		display: -webkit-flex;
		display: flex;
		-webkit-flex-direction: column;
		flex-direction: column;
		-webkit-align-items: center;
		align-items: center;
		justify-content: space-between;
		padding: 2.135% 0 4%;
		width: 100%;
		background: #fff url(../../../static/img/svip-bg-head.png) 0 0 no-repeat;
		background-size: 100% auto;
	}
	#vip-index .content .wrapper .card{
		display: -webkit-flex;
		display: flex;
		-webkit-flex-direction: column;
		flex-direction: column;
		-webkit-align-items: center;
		align-items: center;
		position: relative;
		padding-bottom: 5%;
		width: 82.67%;
	}
	#vip-index .content .wrapper .card .card-top{
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		-webkit-justify-content: center;
		justify-content: center;
		margin-top: 8.71%;
		line-height: 16px;
		color: #735b27;
		font-size: 14px;
	}
	#vip-index .content .wrapper .card .card-top:before{
		display: block;
		margin: 0 10px;
		width: 50px;
		height: 1px;
		background: #735b27;
		content: "";
	}
	#vip-index .content .wrapper .card .card-top:after{
		display: block;
		margin: 0 10px;
		width: 50px;
		height: 1px;
		background: #735b27;
		content: "";
	}
	#vip-index .content .wrapper .card .card-top img{
		display: block;
		margin: 0 4px;
		width: 7.5px;
		height: 7.5px;
	}
	#vip-index .content .wrapper .card .card-top span{
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#vip-index .content .wrapper .card .card-title{
		position: relative;
		margin-top: 22px;
		color: #624e22;
		font-weight: 700;
		font-size: 33px;
		line-height: 46px;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-align: center;
	}
	#vip-index .content .wrapper .card .card-description{
		margin-top: 6.6px;
		color: #735b28;
		font-size: 17px;
		line-height: 24px;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-align: center;
	}
	#vip-index .content .wrapper .card-list{
		position: relative;
		margin-top: 13px;
		width: 100%;
	}
	#vip-index .content .wrapper .card-list .list-header{
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		-webkit-justify-content: center;
		justify-content: center;
	}
	#vip-index .content .wrapper .card-list .list-header .title-header{
		color: #515151;
		font-weight: 700;
		line-height: 25px;
		font-size: 21px;
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		-webkit-justify-content: center;
		justify-content: center;
	}
	#vip-index .content .wrapper .card-list .list-header .title-header:before{
		display: block;
		margin: 3.8px;
		width: 25.4px;
		height: 11px;
		background-image: url(../../../static/img/svip-title-head.png);
		background-position: 0 0;
		background-size: 100% auto;
		background-repeat: no-repeat;
		content: "";
	}
	#vip-index .content .wrapper .card-list .list-header .title-header:after{
		display: block;
		margin: 3.8px;
		width: 25.4px;
		height: 11px;
		background-image: url(../../../static/img/svip-title-head.png);
		background-position: 0 0;
		background-size: 100% auto;
		background-repeat: no-repeat;
		transform: scaleX(-1);
		content: "";
	}
	#vip-index .content .wrapper .card-list .list-bonus{
		position: absolute;
		color: #999;
		font-size: 13px;
		right: 18.7px;
		top: 5.5px;
	}
	#vip-index .content .wrapper .card-list .list-bonus .van-icon-question1{
		font-size: 15px;
		margin-left: 5px;
		color: #ccc;
	}
	#vip-index .content .wrapper .card-list .list-item{
		display: -webkit-flex;
		display: flex;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		margin: 3.24% 4.24% 0;
		padding: 2%;
		background-color: #fff;
		box-shadow: 0 0.5px 1px 0 #e9e9e9;
	}
	#vip-index .content .wrapper .card-list .list-item li{
		display: -webkit-flex;
		display: flex;
		-webkit-flex-direction: column;
		flex-direction: column;
		-webkit-align-items: center;
		align-items: center;
		-webkit-flex: 1;
		flex: 1;
	}
	#vip-index .content .wrapper .card-list .list-item li img{
		display: block;
		width: 52.9px;
		height: 52.9px;
	}
	#vip-index .content .wrapper .card-list .list-item li span{
		margin-top: 3px;
		color: #999;
		font-size: 12px;
		line-height: 16px;
	}
	#vip-index .content .vip-body{
		margin-top: 15px;
		font-size: 16px;
		background-color: #FFF;
	}
	#vip-index .content .vip-body .member-title{
		padding: 10px;
	}
	#vip-index .content .vip-body .member-info{
		line-height: 21px;
		border-left: 3px solid #FF2D4B;
		font-size: 15px;
		padding-left: 10px;
		color: #333;
	}
	#vip-index .content .vip-body .vip-checked{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 10px 15px;
		background-color: #FFF;
		font-size: 15px;
		color: #AFAFAF;
		line-height: 21px;
	}
	#vip-index .content .vip-body .vip-checked span{
		color: #FF2D4B;
	}
	#vip-index .content .vip-body .vip-checked .icon{
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 1px solid #ccc;
		text-align: center;
		line-height: 18px;
		margin-right: 5px;
	}
	#vip-index .content .vip-body .vip-checked .icon.icon-check{
		color: #fff;
		background-color: #ff2d4b;
		border-color: #ff2d4b;
	}
	#vip-index .content .go-member{
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		-webkit-justify-content: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 65px;
		background: #fff;
	}
	#vip-index .content .go-member .button{
		margin: 10px;
		width: 95%;
		height: 69.25%;
		border-radius: 3px;
		background: url(../../../static/img/svip-button.png) 0 0 no-repeat;
		background-size: cover;
		color: #cab96e;
		font-weight: 700;
		font-size: 18px;
		text-align: center;
	}
	#vip-index .content .go-member .button span{
		font-weight: 700;
		line-height: 45px;
	}
	#vip-index .agreement-popup{
		height: 100%;
		width: 100%;
	}
</style>


// WEBPACK FOOTER //
// src/pages/vip/index.vue