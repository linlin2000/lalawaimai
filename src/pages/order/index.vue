<template>
	<div id="order-index">
		<public-header :title="title"></public-header>
		<order-status-warpper v-if="order_remind && order_remind.log" :order="order_remind"></order-status-warpper>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<div class="list-block" v-if="errander_status">
				<van-cell-group>
					<van-cell is-link :to="util.getUrl({path: '/pages/paotui/order'})">
						<template slot="title">
							<img src="static/img/suiyigou_icon.png">
							<span class="list-block-text">万能跑腿订单</span>
						</template>
					</van-cell>
				</van-cell-group>
			</div>
			<van-list v-model="orders.loading" :finished="orders.finished" @load="onLoad" :offset="100" :immediate-check="true">
				<template v-if="orders.data.length > 0">
					<div class="order-container" v-for="(order, index) in orders.data">
						<div class="order-inner">
							<div class="store-info van-hairline--bottom">
								<router-link class="external" :to="util.getUrl({path: '/pages/store/goods', query:{sid: order.sid}})">
									<img style="display: inline;":src="order.logo" alt="" />
									<span class="store-title">{{order.title}}
                  </span>
									<van-icon name='arrow-right' class="icon"></van-icon>
								</router-link>
								<div class="plateform-delivery" v-if="order.delivery_mode == 2"><span v-if="config_mall && config_mall.delivery_title">{{config_mall.delivery_title}}</span></div>
							</div>
							<router-link class="goods-info" :to="util.getUrl({path: '/pages/order/detail', query:{id: order.id}})">
								<div class="col-75">
									<div class="goods-title"><span v-if="order.table_id>0">{{order.tablename}}-</span> {{order.goods.goods_title}}等<span>{{order.num}}</span>件商品</div>
									<div class="date">{{order.addtime}}</div>
								</div>
								<div class="col-25">
									<div class="price">￥{{order.final_fee}}</div>
									<div class="status no-pay">{{order.status_text}}</div>
								</div>
							</router-link>
							<div class="order-status" v-if="order.is_pay == 0 && order.status != 6 && order.order_type != 3">
								<div class="pic">
									<img src="static/img/order_status_money.png" alt="" />
								</div>
								<div class="order-status-detail">
									<div class="arrow-left"></div>
									<div class="clearfix">待支付<span class="pull-right">{{order.addtime_hm}}</span></div>
									<div class="tips">
										<template v-if="order.pay_time_limit > 0">
											请在提交订单后{{order.pay_time_limit}}分钟内完成支付
										</template>
										<template v-else>
											请在提交订单后10分钟内完成支付
										</template>
									</div>
								</div>
							</div>
						</div>
						<div class="order-btn">
							<template  v-if="order.is_pay == 0 && order.status < 5">
								<!-- <div class="table-cell van-hairline--top van-hairline--right" v-if="order.order_type == 3 && order.pay_type == 'finishMeal'" @click="onFinishMealPay">立即支付</div> -->
								<router-link :to="util.getUrl({path: '/pages/order/detail', query:{id: order.id}})" class="table-cell van-hairline--top van-hairline--right" v-if="order.order_type == 3 && order.pay_type == 'finishMeal'">查看详情</router-link>
								<router-link :to="util.getUrl({path: '/pages/public/pay', query:{order_id: order.id, order_type: 'takeout'}})" class="table-cell van-hairline--top van-hairline--right" v-else>立即支付</router-link>
								<router-link :to="util.getUrl({path: '/tangshi/pages/table/goods', query:{order_id: order.id, table_id: order.table_id, sid: order.sid}})" class="table-cell van-hairline--top van-hairline--right" v-if="order.order_type == 3">加菜</router-link>
							</template>
							<template v-if="order.status == 1">
								<div class="table-cell van-hairline--top" @click="onChangeStatus(order.id, 'cancel')">取消订单</div>
								<div class="table-cell van-hairline--left van-hairline--top" v-if="order.is_pay == 1" @click="onChangeStatus(order.id, 'remind')">催单</div>
							</template>
							<template v-else-if="order.status > 1 && order.status < 5">
								<div class="table-cell van-hairline--top" v-if="order.customer_cancel_status == 1" @click="onChangeStatus(order.id, 'cancel')">取消订单</div>
								<div class="table-cell  van-hairline--top" v-if="order.order_type == 1 && order.status == 4" @click="onChangeStatus(order.id, 'end_1')">确认送达</div>
								<div class="table-cell van-hairline--top" v-else-if="order.order_type == 2" @click="onChangeStatus(order.id, 'end_2')">我已提货</div>
								<div class="table-cell van-hairline--left van-hairline--top" v-if="order.is_pay == 1" @click="onChangeStatus(order.id, 'remind')">催单</div>
								<div class="table-cell van-hairline--left van-hairline--top" v-if="order.is_pay == 1 && order.order_type == 4 && order.is_out_moeny == 0 && order.is_refund != 1" @click="onChangeStatus(order.id, 'cancel')">申请退款</div>
								<router-link :to="util.getUrl({path: '/tangshi/pages/table/goods', query:{order_id: order.id, table_id: order.table_id, sid: order.sid}})" class="table-cell van-hairline--left van-hairline--top" v-if="order.order_type == 3 && order.is_pay == 1 && order.pay_type == 'finishMeal'">加菜</router-link>
							</template>
							<template v-else-if="order.status == 5">
								<!-- <router-link :to="util.getUrl({path: '/pages/store/goods', query:{sid: order.sid, order_id: order.id}})" class="table-cell  van-hairline--top">再来一单</router-link> -->
								<router-link :to="util.getUrl({path: '/pages/order/comment', query:{id: order.id}})" class="table-cell  van-hairline--top van-hairline--left" v-if="order.is_comment == 0">{{order.comment_cn}}</router-link>
								<div class="table-cell van-hairline--left van-hairline--top" v-if="order.is_pay == 1 && order.order_type == 4 && order.is_out_moeny == 0 && order.is_refund == 0" @click="onChangeStatus(order.id, 'cancel')">申请退款</div>
								<router-link :to="util.getUrl({path: '/pages/member/comment'})" class="table-cell  van-hairline--top van-hairline--left" v-if="0">查看评价</router-link>
							</template>
							<!-- <template v-else-if="order.status == 6">
								<router-link :to="util.getUrl({path: '/pages/store/goods', query:{sid: order.sid, order_id: order.id}})" class="table-cell  van-hairline--top">再来一单</router-link>
							</template> -->
							<router-link :to="util.getUrl({path: '/pages/order/detail', query:{id: order.id}})" class="table-cell  van-hairline--top van-hairline--left" v-if="order.is_refund == 1">查看退款</router-link>
						</div>
					</div>
					<load type="loaded" text="我是有底线的"  v-if="orders.finished"></load>
				</template>
				<div class="common-no-con" v-else>
					<img src= "static/img/order_no_con.png" alt="" />
					<p>您还没有订单，赶紧点一份！</p>
					<router-link :to="util.getUrl({path: '/pages/home/index'})" class="common-no-con-a">现在点一份</router-link>
				</div>
			</van-list>
		</div>
	</div>
</template>

<script>
	import PublicFooter from '@/components/footer'
	import PublicHeader from '@/components/header'
	import loading from '@/components/loading'
	import load from '@/components/load'
	import OrderStatusWarpper from '@/components/orderStatusWarpper'
	import { Dialog } from 'vant';
	export default {
		components: {
			PublicHeader,
			PublicFooter,
			load,
			OrderStatusWarpper,
			Dialog
		},
		data() {
			return {
				orders: {
					min: 0,
					finished: false,
					loading: false,
					data:[]
				},
				config_mall:{},
				errander_status: '',
				showPreLoading: true,
				menufooter: this.util.getStorage('menufooter'),
				order_remind: {},
        title:''
			}
		},
		methods: {
			onChangeStatus(oid, type) {
				if(type == 'cancel') {
					var params = {
						url: 'wmall/order/index/cancel?id=' + oid,
						confirm: '确定取消订单吗?',
					}
				} else if(type == 'end_1' || type == 'end_2') {
					var params = {
						url: 'wmall/order/index/end?id=' + oid,
						confirm: '你确定收到该商家的外卖?',
						successUrl: '/pages/order/comment?id=' + oid,
					}
					if(type == 'end_2') {
						params.confirm = '你确定收到该商家的外卖?';
					}
				} else if(type == 'remind') {
					var params = {
						url: 'wmall/order/index/remind?id=' + oid,
					}
				}
				this.util.jspost(params);
			},
			onFinishMealPay() {
				Dialog.confirm({
					title: '温馨提示',
					message: '您的支付方式为餐后支付，请到商家收银台付款',
				}).then(() => {
					return;
				})
			},
			onLoad() {
				if(this.orders.finished) {
					return false;
				}
				this.util.request({
					url: 'wmall/order/index',
					data: {
						min: this.orders.min,
						menufooter: 1,
						order_remind: 1
					}
				}).then((res) => {
					let result = res.data.message;
          //console.log(res.data.message);
					if(result.errno) {
						this.$toast(result.message)
						return;
					}

					this.hideLoading();
					this.orders.data = [...this.orders.data, ...result.message];
          this.title = result.title;
					this.orders.loading = false;
					this.orders.min = result.min;
					this.config_mall = result.config_mall;
					this.errander_status = result.errander_status;
					if(result.message.length < 20 || !result.min) {
						this.orders.finished = true;
					}
					this.menufooter = window.menufooter;
					this.order_remind = window.order;
				})
			},
			hideLoading(){
				this.showPreLoading = false;
			},
		},
		mounted() {
			this.util.imap();
		}
	}
</script>

<style>
	#order-index .content{
		position: absolute;
		right: 0;
		left: 0;
		bottom: 50px;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#order-index .content::-webkit-scrollbar {
		display: none;
	}
	#order-index .content .common-no-con{
		position: absolute;
		top: 32%;
		left: 0;
		width: 100%;
		height: 200px;
		text-align: center;
		color: #768491;
		font-size: 16px;
	}
	#order-index .content .common-no-con img{
		max-width: 25%;
		vertical-align: middle;
	}
	#order-index .content .common-no-con p{
		margin: 20px 0;
	}
	#order-index .content .common-no-con .common-no-con-a{
		display: inline-block;
		height: 35px;
		line-height: 35px;
		color: #fff;
		font-size: 14px;
		background: #ff2d4b;
		padding: 0 10px;
		border-radius: 35px;
	}
	#order-index .content .list-block{
		margin: 10px 0;
		font-size: 17px;
	}
	#order-index .van-cell{
		padding: 2px 0 2px 10px;
	}
	#order-index .van-cell .van-cell__title{
		display: table-cell;
		overflow: hidden;
		position: relative;
	}
	#order-index .content .list-block .van-cell__title img{
		height: 38px;
		width: 38px;
		float:left;
		position: absolute;
		top: 3px;
	}
	#order-index .content .list-block .van-cell__title .list-block-text{
		line-height: 44px;
		margin-left: 48px;
		color: #333;
		font-weight: bold;
		font-size: 16px;
	}
	#order-index .van-cell .van-icon{
		line-height: 44px;
		font-size: 16px;
		margin-right: 10px;
	}
	#order-index .content .order-container{
		background: #fff;
		margin-bottom: 10px;
	}
	#order-index .content .order-container .order-inner{
		padding: 0 10px;
	}
	#order-index .content .order-container .order-inner .store-info{
		position: relative;
		height: 50px;
		line-height: 50px;
		font-size: 16px;
	}
	#order-index .content .order-container .order-inner .store-info .external{
		display: block;
		overflow: hidden;
	}
	#order-index .content .order-container .order-inner .store-info .external img{
		margin-right: 10px;
		width: 30px;
		height: 30px;
		vertical-align: middle;
		border-radius: 100%;
		border: none;
		max-width: 100%;
	}
	#order-index .content .order-container .order-inner .store-info .external .store-title{
		font-weight: bold;
		color: #333;
		line-height: 21px;
	}
	#order-index .content .order-container .order-inner .store-info .external .icon{
		font-size: 16px;
		color: #999;
		margin-left: 6px;
		line-height: 17px;
	}
	#order-index .content .order-container .order-inner .store-info .plateform-delivery{
		position: absolute;
		right: 0;
		top: 14px;
		text-align: right;
	}
	#order-index .content .order-container .order-inner .store-info .plateform-delivery span{
		height: 20px;
		line-height: 20px;
		font-size: 12px;
		background: linear-gradient(to right,#FF930F,#FF5E4E);
		border-radius: 7px 0 7px 0;
		color: #fff;
		display: block;
		padding: 0 6px;
	}
	#order-index .content .order-container .order-inner .goods-info{
		padding: 10px 5px;
		display: block;
		color: #3d4145;
		overflow: hidden;
	}
	#order-index .content .order-container .order-inner .goods-info .col-75{
		width: 75%;
		margin: 0;
		float: left;
	}
	#order-index .content .order-container .order-inner .goods-info .col-75 .goods-title{
		font-size: 16px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 3px;
		line-height: 24px;
	}
	#order-index .content .order-container .order-inner .goods-info .col-75 .date{
		color: #999;
		font-size: 12px;
		line-height: 18px;
	}
	#order-index .content .order-container .order-inner .goods-info .col-25{
		width: 25%;
		margin: 0;
		float: left;
		text-align: right;
	}
	#order-index .content .order-container .order-inner .goods-info .col-25 .price{
		font-size: 16px;
		color: #707070;
		margin-bottom: 3px;
	}
	#order-index .content .order-container .order-inner .goods-info .col-25 .status{
		color: #9F9F9F;
		font-size: 14px;
		line-height: 24px;
	}
	#order-index .content .order-container .order-inner .goods-info .col-25 .status.no-pay{
		color: #ff2d4b;
		line-height: 21px;
	}
	#order-index .content .order-container .order-inner .order-status{
		padding: 10px 5px 10px 50px;
		position: relative;
	}
	#order-index .content .order-container .order-inner .order-status:before{
		content: "";
		width: 1px;
		height: 20px;
		border-left: 1px solid #CBCBCB;
		position: absolute;
		top: 10px;
		left: 17.5px;
		margin-left: -1px;
	}
	#order-index .content .order-container .order-inner .order-status .pic{
		width: 35px;
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
	}
	#order-index .content .order-container .order-inner .order-status .pic img{
		width: 35px;
		position: absolute;
		top: 50%;
		margin-top: -17.5px;
		z-index: 10;
	}
	#order-index .content .order-container .order-inner .order-status .order-status-detail{
		position: relative;
		font-size: 16px;
		border: 1px solid #e7e6e6;
		border-radius: 3px;
		background: #fafafa;
		padding: 12px 10px;
	}
	#order-index .content .order-container .order-inner .order-status .order-status-detail .arrow-left,#order-index .content .order-container .order-inner .order-status .order-status-detail .arrow-left:after{
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 10px 12px 10px 0;
		border-color: transparent #e7e6e6 transparent transparent;
		position: absolute;
		left: -12px;
		top: 50%;
		margin-top: -10px;
	}
	#order-index .content .order-container .order-inner .order-status .order-status-detail .arrow-left:after{
		content: "";
		border-right-color: #fafafa;
		left: 2px;
		top: 0px;
	}
	#order-index .content .order-container .order-inner .order-status .order-status-detail .clearfix{
		overflow: hidden;
		line-height: 24px;
	}
	#order-index .content .order-container .order-inner .order-status .order-status-detail .clearfix .pull-right{
		color: #999;
		font-size: 12px;
		float: right;
	}
	#order-index .content .order-container .order-inner .order-status .order-status-detail .tips{
		color: #999;
		font-size: 12px;
		line-height: 18px;
	}
	#order-index .content .order-container .order-btn{
		display: table;
		table-layout: fixed;
		width: 100%;
		margin: 0;
		padding: 0;
		background: #fff;
		font-size: 14px;
		min-height: 40px;
	}
	#order-index .content .order-container .order-btn .table-cell{
		display: table-cell;
		overflow: hidden;
		text-align: center;
		white-space: nowrap;
		text-overflow: ellipsis;
		vertical-align: middle;
		color: #333;
	}
</style>


// WEBPACK FOOTER //
// src/pages/order/index.vue
