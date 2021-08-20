<template>
	<div id="peerpay-index">
		<div class="content">
			<div class="head-block">
				<div class="head-block-bg">
					<div class="item-text"></div>
					<img class="avatar" :src="member_avatar" alt="">
				</div>
			</div>
			<div class="order van-hairline--top van-hairline--top">
				<router-link to="" v-if="peerpay.data">
					<img class="item-thumbnail" :src="peerpay.data.logo" alt="">
					<div class="item-desc">
						<div class="item-title">{{peerpay.data.title}}</div>
						<div class="item-price">¥{{peerpay.data.fee}}</div>
					</div>
				</router-link>
			</div>
			<div class="note-container van-hairline--top van-hairline--top">
				<div class="note-title">编辑留言</div>
				<textarea v-model='message'></textarea>
			</div>
			<div class="bottom-btn-block">
				<div @click="onCallAsk">喊朋友帮忙</div>
			</div>
		</div>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	export default {
		name: "peerpayIndex",
		data() {
			return {
				showPreLoading: true,
				peerpay: {},
				member_avatar: '',
				message: '感情深不深,看你跟不跟~'
			}
		},
		methods: {
			onLoad() {
				if(!this.pid) {
					this.util.$toast('请重新选择支付方式', this.util.getUrl({path: 'pages/order/index'}), 1000, 'replace');
				}
				this.util.request({
					url: 'system/paycenter/peerpay/message',
					data: {
						id: this.pid,
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message, this.util.getUrl({path: 'pages/order/index'}), 1000, 'replace');
					}
					this.peerpay = result.message.peerpay;
					this.member_avatar = result.message.member_avatar;
					if(result.message.help_words && result.message.help_words.length > 0) {
						this.message = result.message.help_words[0];
					}
					this.util.setWXTitle(result.message.page_title);
				})
			},

			onCallAsk() {
				this.util.request({
					url: 'system/paycenter/peerpay/message',
					method: 'POST',
					data: {
						id: this.pid,
						message: this.message
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message, '', 1000);
						return false;
					}
					this.$router.push(this.util.getUrl({path: 'pages/public/peerpay/paylist', query: {id: this.peerpay.id}}));
				})
			}
		},
		created() {
			this.query = this.$route.query;
			if(this.query) {
				this.pid = this.query.pid;
			}
		},
		mounted () {
			this.onLoad();
		},
	}
</script>

<style>
	#peerpay-index .content{
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#peerpay-index .content::-webkit-scrollbar {
		display: none;
	}
	#peerpay-index .content .head-block{
		text-align: center;
		position: relative;
		min-height: 175px;
		margin-bottom: 14px;
	}
	#peerpay-index .content .head-block .head-block-bg{
		background: linear-gradient(to top, #f44, #ff3b5d);
		z-index: 0;
		height: 100%;
		width: 100%;
		min-height: 155px;
		border-radius: 0 0 55% 55% / 0 0 55px 55px;
	}
	#peerpay-index .content .head-block .head-block-bg .item-text{
		color: #fff;
		padding: 46px 20px 0px;
		text-align: center;
		background-color: transparent;
		border: 0;
		outline: none;
		width: 100%;
		box-sizing: border-box;
		line-height: 20px;
		text-shadow: 0 1px 4px rgba(0,0,0,0.6);
		font-size: 12px;
	}
	#peerpay-index .content .head-block .head-block-bg .avatar{
		display: block;
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translate3d(-50%, 0, 0);
		width: 54px;
		height: 54px;
		border: 1px solid #f2f2f2;
		z-index: 10;
		border-radius: 100%;
	}
	#peerpay-index .content .order{
		overflow: hidden;
		margin: 10px 0;
		background-color: #fff;
		display: block;
		position: relative;
		font-size: 14px;
	}
	#peerpay-index .content .order .router-link-active{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		height: 80px;
		padding: 10px 0;
		background-color: #fff;
	}
	#peerpay-index .content .order .router-link-active .item-thumbnail{
		height: 54px;
		width: 54px;
		margin-left: 10px;
	}
	#peerpay-index .content .order .router-link-active .item-desc{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-left: 20px;
		font-size: 12px;
		height: 46px;
		color: #333;
	}
	#peerpay-index .content .order .router-link-active .item-desc .item-price{
		color: #ed5050;
		font-size: 14px;
	}
	#peerpay-index .content .note-container{
		background-color: #fff;
		padding: 0 10px;
	}
	#peerpay-index .content .note-container .note-title{
		font-size: 14px;
		padding: 10px 0;
		line-height: 21px;
	}
	#peerpay-index .content .note-container textarea{
		border: none;
		width: 100%;
		font-size: 15px;
		color: #333;
		height: 44px;
	}
	#peerpay-index .content .bottom-btn-block{
		width: 100%;
		height: 50px;
		z-index: 100;
		position: fixed;
		bottom: 10px;
		padding: 0 20px;
		box-sizing: border-box;
		max-width: 640px;
	}
	#peerpay-index .content .bottom-btn-block div{
		display: block;
		width: 100%;
		max-width: 640px;
		background-color: #f44;
		border-color: #f44;
		box-shadow: 0 2px 4px rgba(0,0,0,0.2);
		border-radius: 25px;
		height: 50px;
		display: inline-block;
		text-align: center;
		line-height: 50px;
		color: #fff;
		font-size: 16px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/public/peerpay/index.vue