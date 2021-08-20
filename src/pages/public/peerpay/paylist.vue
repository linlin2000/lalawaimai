<template>
	<div id="peerpay-paylist">
		<div class="content">
			<div class="head-block">
				<div class="head-block-bg">
					<div class="item-text">{{peerpay.peerpay_message}}</div>
					<div class="remaining-time hide">
						<div>支付剩余时间</div>
						<div class="in-clock">
							<span class="in-num">0</span>
							<span class="in-num">0</span>
							<span class="in-colon">:</span>
							<span class="in-num">0</span>
							<span class="in-num">1</span>
						</div>
					</div>
					<img class="avatar" :src="member.avatar" alt="">
				</div>
			</div>
			<div class="title-text">
				<span class="icon"></span>
				快来帮{{member.nickname ? member.nickname : '小伙伴'}}搞定这个
				<span class="icon"></span>
			</div>
			<div class="order van-hairline--top van-hairline--top">
				<router-link to="" v-if="peerpay.data">
					<img class="item-thumbnail" :src="peerpay.data.logo" alt="">
					<div class="item-desc">
						<div class="item-title">{{peerpay.data.title}}</div>
						<div class="item-price">¥{{peerpay.data.fee}}</div>
					</div>
				</router-link>
				<div class="progress-bar-block">
					<div class="progress-text">
						<template v-if="peerpay.uid == member.uid">
							<template v-if="differ > 0">
								<template v-if="peerpay.peerpay_realprice > 0">
									<span>还差</span><span class="color-warning">¥{{peerpay.peerpay_realprice}}</span><span>哦，快去找朋友帮助吧~</span>
								</template>
								<template v-else>
									<span class="color-warning">订单已完成支付</span>
								</template>
							</template>
							<template v-else>
								还没有好友帮你代付呢，快去召集朋友吧~
							</template>
						</template>
						<template v-else>
							快来帮好友达成心愿吧~
							<span>还差</span><span class="color-warning">¥{{peerpay.peerpay_realprice}}</span><span>哦，TA需要你的帮助呢~</span>
						</template>
					</div>
					<van-progress :percentage="percent" />
				</div>
			</div>
			<div class="pay-list van-hairline--top van-hairline--bottom" v-if="payinfos && payinfos.length > 0">
				<div class="pay-list-block">
					<div class="pay-list-img"></div>
					<template v-for="item in payinfos">
						<div class="pay-item van-hairline--bottom">
							<img :src="item.headimg" alt=""/>
							<div class="name"><span>{{item.uname}}</span> <span class="support">支持</span> <span class="price">¥{{item.final_fee}}</span></div>
							<div class="message">{{item.usay}}</div>
						</div>
					</template>
				</div>
			</div>
			<div class="bottom-btn-block" v-if="peerpay.status != 1">
				<template v-if="is_same_person == 1">
					<router-link class="router-link-exact-active" :to="util.getUrl({path:'pages/public/peerpay/payment', query: {id: peerpay.id}})" >我先付点</router-link>
					<div class="open-zhezhao" @click="onChangeZhezhao()">喊朋友帮忙</div>
				</template>
				<template v-else>
					<router-link class="router-link-exact-active"  :to="util.getUrl({path:'pages/home/index'})" >我也要玩</router-link>
					<router-link class="open-zhezhao"  :to="util.getUrl({path:'pages/public/peerpay/payment', query: {id: peerpay.id}})">帮TA付</router-link>
				</template>
			</div>
		</div>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
		<div class="share-zhezhao" @click="onChangeZhezhao()" v-if="zhezhaoShow">
			<img src="static/img/share-layer.png" alt="">
		</div>
	</div>
</template>

<script>
	export default {
		name: "peerpayPaylist",
		data() {
			return {
				showPreLoading: true,
				zhezhaoShow: false,
				peerpay: {},
				member: {},
				payinfos: [],
				differ: 0,
				percent: 0,
				is_same_person: 0,
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'system/paycenter/peerpay/paylist',
					data: {
						id: this.id,
						payinfo_id: this.payinfo_id
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message, this.util.getUrl({path: 'pages/order/index'}), 1000, 'replace');
					}
					result = result.message;
					this.peerpay = result.peerpay;
					this.member = result.member;
					this.payinfos = result.payinfos;
					this.differ = result.differ;
					this.percent = result.percent;
					this.is_same_person = result.is_same_person;
					this.util.setWXTitle(result.page_title);
				})
			},
			onChangeZhezhao() {
				this.zhezhaoShow = !this.zhezhaoShow;
			}

		},
		created() {
			this.query = this.$route.query;
			if(this.query) {
				this.id = this.query.id;
				this.payinfo_id = this.query.payinfo_id;
			}
		},
		mounted () {
			this.onLoad();
		},
	}
</script>

<style>
	#peerpay-paylist .content{
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
	#peerpay-paylist .content::-webkit-scrollbar {
		display: none;
	}
	#peerpay-paylist .content .head-block{
		text-align: center;
		position: relative;
		min-height: 175px;
		margin-bottom: 14px;
	}
	#peerpay-paylist .content .head-block .head-block-bg{
		background: linear-gradient(to top, #f44, #ff3b5d);
		z-index: 0;
		height: 100%;
		width: 100%;
		min-height: 155px;
		border-radius: 0 0 55% 55% / 0 0 55px 55px;
	}
	#peerpay-paylist .content .head-block .head-block-bg .item-text{
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
	#peerpay-paylist .content .head-block .head-block-bg .remaining-time{
		color: #fff;
		text-align: center;
		padding-top: 10px;
		padding-bottom: 10px;
		font-size: 12px;
	}
	#peerpay-paylist .content .head-block .head-block-bg .remaining-time .in-clock{
		margin-top: 5px;
	}
	#peerpay-paylist .content .head-block .head-block-bg .remaining-time .in-clock .in-num{
		display: inline-block;
		text-align: center;
		background-color: #000;
		color: #fafafa;
		width: 16px;
		margin: 0 2px;
		line-height: 18px;
	}
	#peerpay-paylist .content .head-block .head-block-bg .avatar{
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
	#peerpay-paylist .content .title-text{
		padding-bottom: 10px;
		text-align: center;
		font-size: 12px;
		color: #999;
	}
	#peerpay-paylist .content .title-text .icon{
		display: inline-block;
		width: 4px;
		height: 10px;
		background: url(../../../../static/img/diagonal.png) no-repeat center;
		background-size: contain;
	}
	#peerpay-paylist .content .order{
		overflow: hidden;
		margin: 10px 0;
		background-color: #fff;
		display: block;
		position: relative;
		font-size: 14px;
	}
	#peerpay-paylist .content .order .router-link-active{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		height: 80px;
		padding: 10px 0;
		background-color: #fff;
	}
	#peerpay-paylist .content .order .router-link-active .item-thumbnail{
		height: 54px;
		width: 54px;
		margin-left: 10px;
	}
	#peerpay-paylist .content .order .router-link-active .item-desc{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-left: 20px;
		font-size: 12px;
		height: 46px;
		color: #333;
	}
	#peerpay-paylist .content .order .router-link-active .item-desc .item-price{
		color: #ed5050;
		font-size: 14px;
	}
	#peerpay-paylist .content .order .progress-bar-block{
		background-color: #FFF;
		font-size: 12px;
	}
	#peerpay-paylist .content .order .progress-bar-block .progress-text{
		padding: 10px;
		color: #999;
	}
	#peerpay-paylist .content .order .progress-bar-block .progress-text .color-warning{
		color: #f60;
	}
	#peerpay-paylist .content .order .progress-bar-block .van-progress{
		margin: 10px;
	}
	#peerpay-paylist .content .bottom-btn-block{
		display: flex;
		justify-content: space-between;
		width: 100%;
		height: 50px;
		z-index: 100;
		position: fixed;
		bottom: 10px;
		padding: 0 20px;
		box-sizing: border-box;
		max-width: 640px;
	}
	#peerpay-paylist .content .bottom-btn-block .router-link-exact-active{
		display: inline-block;
		width: 40%;
		background-color: #f85;
		border-color: #f85;
		box-shadow: 0 2px 4px rgba(0,0,0,0.2);
		border-radius: 25px;
		height: 50px;
		text-align: center;
		line-height: 50px;
		color: #fff;
		font-size: 16px;
		max-width: 640px;
	}
	#peerpay-paylist .content .bottom-btn-block .open-zhezhao{
		display: inline-block;
		width: 54%;
		background-color: #f44;
		border-color: #f44;
		box-shadow: 0 2px 4px rgba(0,0,0,0.2);
		border-radius: 25px;
		height: 50px;
		text-align: center;
		line-height: 50px;
		color: #fff;
		font-size: 16px;
		max-width: 640px;
	}
	#peerpay-paylist .pay-list{
		position: relative;  
		padding-top: 10px;  
		background-color: #fff;
	}
	#peerpay-paylist .pay-list .pay-list-block{
		margin: 0; padding: 0 0 0 10px; 
		font-size: 14px; 
		box-sizing: border-box;
	}
	#peerpay-paylist .pay-list .pay-list-block .pay-list-img{
		width: 82px; 
		height: 22px;
		margin: 12px auto; 
		background: url("../../../../static/img/pay-list-img.png"); 
		background-size: contain;
	}
	#peerpay-paylist .pay-list .pay-list-block .pay-item{
		padding: 10px 10px 10px 0; 
		position: relative; 
		display: block; 
		overflow: hidden; 
		font-size: 12px; 
		color: #333;
	}
	#peerpay-paylist .pay-list .pay-list-block .pay-item img{
		width: 40px; 
		height: 40px; 
		float: left; 
		margin-right: 10px; 
		border: 1px solid #f8f8f8; 
		border-radius: 100%;
	}
	#peerpay-paylist .pay-list .pay-list-block .pay-item .name{
		padding-top: 5px;
	}
	#peerpay-paylist .pay-list .pay-list-block .pay-item .support{
		color: #666;
	}
	#peerpay-paylist .pay-list .pay-list-block .pay-item .price{
		color: #f60;
	}
</style>


// WEBPACK FOOTER //
// src/pages/public/peerpay/paylist.vue