<template>
	<div id="pay" v-if="!util.isMajia() && !util.isQianfan()">
		<public-header title="支付收银台" bgcolor="#ff2d4b" textcolor="#fff"></public-header>
		<div class="content">
			<van-swipe :autoplay="3000" class="swiper" v-if="slides && slides.length > 0" indicator-color="#ff2d4b">
				<van-swipe-item v-for="(item, index) in slides" :key="index">
					<img :src="item.thumb" alt="">
				</van-swipe-item>
			</van-swipe>
			<div class="remain-time" v-if="order.pay_endtime && order.pay_endtime > 0">
				<div>支付剩余时间</div>
				<div class="in-clock">
					<count-down :endTime="order.pay_endtime"></count-down>
				</div>
			</div>
			<div class="order-summary flex-lr">
				<div class="left">
					<img :src="order.logo" alt="">
				</div>
				<div class="right">
					<div class="fee">
            <span class="underline" v-if="paytype=='wechat'">¥{{order.fee}}</span>
						<span class="underline" v-if="paytype=='credit'">¥{{order.cust_fee}}</span>
            <span class="underline" v-if="paytype=='finishMeal'">¥{{order.fee}}</span>
					</div>
					<div class="order-info">
						<span class="underline">{{order.title}}</span>
					</div>
				</div>
			</div>
			<div class="bolck-title">选择支付方式</div>
			<div class="pay-list" v-if="status==0">
				<template v-for="(item, index) in payment" >
					<div class="pay-item van-hairline--bottom flex-lr"  @click="onSelectPayType1(item.value)">
						<div class="item-inner flex">
							<img src="static/img/wx-icon.png" alt="" v-if="item.value == 'wechat'">
							<img src="static/img/zfb-icon.png" alt="" v-else-if="item.value == 'alipay'">
							<img src="static/img/money-icon.png" alt="" v-else-if="item.value == 'credit'">
							<img src="static/img/delivery-icon.png" alt="" v-else-if="item.value == 'delivery'">
							<img src="static/img/peerpay-icon.png" alt="" v-else-if="item.value == 'peerpay'">
							<img src="static/img/finishMeal-icon.png" alt="" v-else-if="item.value == 'finishMeal'">
							<div class="item-box">
								<div class="item-title">{{item.title}}</div>
								<div class="item-subtitle flex" v-if="item.value == 'wechat'">
									<span class="pay-recommend">推荐使用</span>
									微信支付,安全快捷
								</div>
								<div class="item-subtitle flex" v-if="item.value == 'alipay'">
									<span class="pay-recommend" >推荐使用</span>
									简单、安全、快速
								</div>
								<div class="item-subtitle flex" v-if="item.value == 'credit'">
									当前账户余额:
									<span class="money"> ¥{{member.credit2 || 0.00}}</span>
								</div>
								<div class="item-subtitle flex" v-if="item.value == 'delivery'">
									线下当面交易，到店付款，货到付款
								</div>
							</div>
						</div>
						<i class="icon" :class="{'icon-check': item.value == paytype}"></i>
					</div>
				</template>
			</div>
			<div class="pay-list" v-if="status==1">
				<template>
					<!-- weixin :wechat   zhifubao:credit" -->
					<div class="pay-item van-hairline--bottom flex-lr"  @click="onSelectPayType(3)">
						<div class="item-inner flex">
							<img src="static/img/wx-icon.png" alt="" >
							<div class="item-box">
								<div class="item-title">微信支付</div>
								<div class="item-subtitle flex">
									<span class="pay-recommend">推荐使用</span>
									微信支付,安全快捷
								</div>
							</div>
						</div>
						<i class="icon" :class="{'icon-check': sqbPay==3}"></i>
					</div>
				</template>
				<template>
					<!-- weixin :wechat   zhifubao:credit" -->
					<div class="pay-item van-hairline--bottom flex-lr"  @click="onSelectPayType(2)">
						
						<div class="item-inner flex">
							<img src="static/img/zfb-icon.png" alt="" >
							<div class="item-box">
								<div class="item-title">支付宝支付</div>
								<div class="item-subtitle flex">
									<span class="pay-recommend" >推荐使用</span>
									简单、安全、快速
								</div>
							</div>
						</div>
					
						<i class="icon" :class="{'icon-check': sqbPay==2}"></i>
					</div>
				</template>
				<template>
					<!-- weixin :wechat   zhifubao:credit" -->
					<div class="pay-item van-hairline--bottom flex-lr"  @click="onSelectPayType(4)">
						
						<div class="item-inner flex">
							<img src="static/img/money-icon.png" alt="" >
							<div class="item-box">
								<div class="item-title">余额支付</div>
								<div class="item-subtitle flex" >
									当前账户余额:
									<span class="money"> ¥{{member.credit2 || 0.00}}</span>
								</div>
							</div>
						</div>
						<i class="icon" :class="{'icon-check': sqbPay==4}"></i>
					</div>
				</template>
			</div>
		</div>

		<div class="save-btn">
      <div class="tips">总计(含餐具费):¥{{order.total_fee}} 优惠券:{{order.discount_fee}}
      <span v-if="paytype=='credit'">{{order.quanyi_zhekou}}:{{order.zhekou_show}}折(¥{{order.zk_discount_fee}})</span>
      <span v-if="paytype=='finishMeal'">以收银机优惠折扣为主</span>
      </div>
			<van-button type="default" size="large" :disabled="submitDisabled" @click="onSubmit" >
        <span v-if="paytype=='finishMeal'">提交订单  ¥{{order.fee}}</span>
        <span v-if="paytype=='credit'">确认支付  ¥{{order.cust_fee}}</span>  
         <span v-if="paytype=='wechat'">确认支付  ¥{{order.fee}}</span>
         <span v-if="paytype=='sqb'">确认支付 100</span>
      </van-button>
		</div>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import axios from 'axios'
	import PublicHeader from '@/components/header'
	import countDown from '@/components/countDown'
	import h5app from '@/config/h5app'
	import {maJia} from '@/config/maJia'
	export default {
		name: "pay",
		components: {
			PublicHeader,
			countDown
		},
		data() {
			return {
				showPreLoading: true,
				order_type: 'takeout',
				slides: [],
				order: {},
				payment: [],
				paytype: '',
				member: {},
				status:1,
				sqbPay:3,
				submitDisabled: false,
				isShow: null  // 隐藏
			}
		},
		methods: {
			onLoad() {
				var that = this;
				this.util.request({
					url: 'system/paycenter/pay',
					method: 'POST',
					data: {
						sid: this.sid,
						id: this.order_id,
						order_type: this.order_type,
						type: 1
					}
				}).then((res) => {
					console.log('进来了')
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return false;
					}
					if(that.util.isMajia()) {
						console.log(11111)
						maJia().then(function() {
							var payinfo = window.majia.payinfo;
							mag.pay(payinfo, function(data){
								that.util.$toast('订单支付成功', payinfo.url_detail);
							}, function(data){
								that.util.$toast('支付失败,具体原因：' + data, payinfo.url_pay);
							});
						});
					} else if(that.util.isQianfan()) {
						console.log(22222)
						var payinfo = window.qianfan.payinfo;
						var QFdata = {
							'type' : parseInt(payinfo.type),
							'item' : payinfo.item,
							'send_type' : parseInt(payinfo.send_type),
							'address' : payinfo.address,
							'allow_pay_type' : parseInt(payinfo.allow_pay_type)
						};
						function QFH5ready() {
							QFH5.createOrder(QFdata['type'], QFdata['item'], QFdata['send_type'], QFdata['address'], QFdata['allow_pay_type'], function(state, data){
								if(state == 1){
									var order_id = data.order_id;
									that.util.request({
										url: 'system/paycenter/sync/qianfan',
										data:{
											tid: payinfo.tid,
											order_id: order_id
										}
									}).then((res) => {
										QFH5.jumpPayOrder(order_id, function(state, data){
											if(state == 1){
												that.util.$toast('订单支付成功', payinfo.url_detail);
											} else {
												that.util.$toast(data.error, payinfo.url_pay);
											}
										});
									})
								} else {
									that.util.$toast('创建交易订单失败:' + data.error, payinfo.url_pay);
								}
							});
						}
						QFH5ready();
					} else {
						console.log(3333)
						this.slides = result.message.slides;
						if (this.isShow == "Y") {
							console.log(1)
							let paymentList = [];
							for (let index = 0; index < result.message.payment.length; index++) {
								if (result.message.payment[index].value != "finishMeal") {
									paymentList.push(result.message.payment[index]);
								}
							}
							this.payment = paymentList;
							this.status=result.message.sqb
						}else{
							console.log(2)
							this.payment = result.message.payment;
							this.status=result.message.sqb
						}
						if((this.util.getStorage('itime') == 1)) {
							result.message.order.final_fee = 100;
							result.message.order.final_fee = 200;
						}
						this.order = result.message.order;

						this.member = result.message.member;
						if(this.payment.length > 0) {
							var default_paytype = this.payment[0]['value'];
							for(var i = 0,len = this.payment.length; i < len; i++){
								if(this.payment[i]['value'] == 'wechat') {
									default_paytype = 'wechat'
								}
							}
							this.paytype = default_paytype;
						}

						let autoPay = this.util.getUrlParam(window.location.href, 'autoPay');
						if(autoPay) {
							this.paytype = autoPay;
							this.onSubmit();
						}
					}
				});
			},

			//选中支付方式
			onSelectPayType1(paytype) {
				this.paytype = paytype;
				if(this.paytype == 'credit') {
					if(!this.member.credit2) {
						this.member.credit2 = 0;
					}
					if(this.member.credit2 - this.order.fee < 0) {
						this.submitDisabled = true;
					}
				} else {
					this.submitDisabled = false;
				}
			},
			onSelectPayType(sqbPay) {
				this.sqbPay = sqbPay;
				if(sqbPay==4){
					this.onSelectPayType1('credit')
					return
				}
				if(this.paytype == 'credit') {
					if(!this.member.credit2) {
						this.member.credit2 = 0;
					}
					if(this.member.credit2 - this.order.fee < 0) {
						this.submitDisabled = true;
					}
				} else {
					this.submitDisabled = false;
				}
			},

			onSubmit() {
				if(this.status==0){
					if(!this.paytype) {
						this.$toast('请先选择支付方式');
						return false;
					}
					if(this.util.ish5app() && (this.paytype == 'wechat' || this.paytype == 'alipay')) {
						h5app.init({});
						h5app.pay(this.paytype, '', '');
						return false;
					}
					this.submitDisabled = true;

					this.util.pay({
						pay_type: this.paytype,
						order_type: this.order_type,
						order_id: this.order_id,
						extra: this.extra,
						vue: this,
						zk_discount_fee:this.order.zk_discount_fee,
						zk_type:this.order.zhekou_type,
						zhekou:this.order.zhekou_show
					});
				}else{
					if(!this.sqbPay) {
						this.$toast('请先选择支付方式');
						return false;
					}

					if(this.sqbPay==4){
						if(this.util.ish5app() && (this.paytype == 'wechat' || this.paytype == 'alipay')) {
							h5app.init({});
							h5app.pay(this.paytype, '', '');
							return false;
						}
						this.submitDisabled = true;

						this.util.pay({
							pay_type: this.paytype,
							order_type: this.order_type,
							order_id: this.order_id,
							extra: this.extra,
							vue: this,
							zk_discount_fee:this.order.zk_discount_fee,
							zk_type:this.order.zhekou_type,
							zhekou:this.order.zhekou_show
						});
						return
					}

					if(this.util.ish5app() && (this.sqbPay == '3' || this.sqbPay == '2')) {
						h5app.init({});
						h5app.pay(this.sqbPay, '', '');
						return false;
					}
					this.submitDisabled = true;
					let postData={
						order_id:this.order_id,
						payway:this.sqbPay,
						total_amount:200
					}
					var url= `https://123.91ydxk.com/app/index.php?i=40&c=entry&do=wap&m=dkj_api&act=createpay&order_id=${this.order_id}&payway=${this.sqbPay}}&total_amount=${this.order.cust_fee}`
					axios.get(url).then((result) => {
						var result = result.data;
						location.href=result.url
					});
				}
			},

		},
		mounted () {
			this.onLoad();
		},
		created () {
			this.query = this.$route.query;
			if(this.query) {
				this.order_id = this.query.order_id;
				this.order_type = this.query.order_type;
				this.extra = this.query.extra;
				this.isShow = this.query.isShow;
			}
		}
	}
</script>

<style>
  .tips{
    color: #999;
    font-size: 12px;
    padding:12px;
  }
	#pay .content{
		position: absolute;
		left: 0;
		bottom: 70px;
		right: 0;
		background-color: #f8f8f8;
	}
	#pay .content .swiper{
		width: 100%;
		height: 80px;
	}
	#pay .content .swiper img{
		width: 100%;
		height: 100%;
		pointer-events: none;
	}
	#pay .content .remain-time{
		color: #666;
		text-align: center;
		padding: 15px 0;
		background: #f9f9fc;
		font-size: 10px;
		line-height: 1.5;
	}
	#pay .content .remain-time .in-clock{
		margin-top: 5px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#pay .content .remain-time .in-clock span{
		background-color: #000;
		color: #fafafa;
		font-size: 12px;
		padding: 3px 3px;
		border-radius: 3px;
		margin: 0 3px;
	}
	#pay .order-summary{
		padding: 15px 0;
		margin-left: 0;
		background: #f5f5f5  url(../../../static/img/line.png) repeat-x 0 0;
		background-size: auto 100%;
	}
	#pay .order-summary .left{
		width: 30%;
		display: flex;
		justify-content: center;
	}
	#pay .order-summary .left img{
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
	#pay .order-summary .right{
		width: 70%;
		line-height: 22px;
	}
	#pay .fee{
		font-size: 16px;
	}
	#pay .order-info{
		font-size: 12px;
	}
	#pay .underline{
		border-bottom: 1px dotted #e0e0e0;
	}
	#pay .bolck-title{
		margin: 10px 15px;
		color: #6d6d72;
		font-size: 14px;
	}
	#pay .pay-list{
		background-color: #fff;
		padding-left: 15px;
	}
	#pay .pay-list .pay-item{
		padding: 10px 15px 10px 0;
	}
	#pay .pay-list .item-inner img{
		width: 40px;
		height: 40px;
		margin-right: 10px;
	}
	#pay .pay-list .item-inner .item-title{
		font-size: 14px;
		color: #333;
	}
	#pay .pay-list .item-inner .item-subtitle{
		margin-top: 5px;
		color: #999;
		font-size: 12px;
		white-space: normal;
	}
	#pay .pay-list .item-inner .item-subtitle .money{
		font-size: 14px;
		color: #ff2d4b;
	}
	#pay .pay-list .item-inner .item-subtitle .pay-recommend{
		color: #ff9c05;
		padding: 2px;
		margin-right: 5px;
		border: 1px solid #ff9c05;
		border-radius: 4px;
		font-size: 10px;
	}
	#pay .pay-list .pay-item .icon{
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 1px solid #ccc;
		text-align: center;
		line-height: 18px;
	}
	#pay .pay-list .pay-item .icon.icon-check{
		color: #fff;
		background-color: #ff2d4b;
		border-color: #ff2d4b;
	}
	#pay .save-btn{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 10px;
		background-color: #fff;
	}
	#pay .save-btn .van-button{
		background-color: #ff2d4b;
		color: #fff;
	}
	#pay .save-btn .van-button.disabled{
		color: #999;
		background-color: #eee;
		border: 1px solid #e5e5e5;
	}
</style>


// WEBPACK FOOTER //
// src/pages/public/pay.vue
