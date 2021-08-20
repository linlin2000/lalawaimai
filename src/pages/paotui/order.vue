<template>
	<div id="paotui-order">
		<public-header title="跑腿订单"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<van-cell-group>
				<van-cell>
					<div slot="title" class="font-16 c-default flex height-30">
						已有
						<span class="c-danger">{{total_user}}</span>
						人使用了随意购
					</div>
					<router-link :to="util.getUrl({path: '/pages/paotui/guide'})" slot="right-icon" class="c-danger font-16 flex height-30">
						立即下单 <span class="icon icon-right"></span>
					</router-link>
				</van-cell>
			</van-cell-group>
			<template v-if="orders.data.length > 0">
				<van-list v-model="orders.loading" :finished="orders.finished" @load="onLoad" :offset="100" :immediate-check="false">
					<div class="order-item" v-for="item in orders.data" :key='item.id'>
						<van-cell>
							<router-link :to="util.getUrl({path: '/pages/paotui/diy?id=' + item.order_cid})" slot="title" class="font-16 c-default flex height-30">
								<img :src="item.thumb" alt="" v-if="item.thumb">
								<span class="category-title">{{item.title}}</span>
								<span class="icon icon-right font-16 c-disabled"></span>
							</router-link>
						</van-cell>
						<router-link tag='div' class="order-info flex-lr" :to="util.getUrl({path: '/pages/paotui/detail', query:{id: item.id}})">
							<div class="left">
								<div class="title ellipsis font-16">购买商品：{{item.goods_name}}</div>
								<div class="date font-13 c-disabled">{{item.addtime}}</div>
							</div>
							<div class="right text-right">
								<div class="price font-15">¥ {{item.final_fee}}</div>
								<div class="status c-danger font-14">{{item.order_status}}</div>
							</div>
						</router-link>
						<div class="order-status" v-if="item.is_pay == 0 && item.status != 4">
							<div class="pic">
								<img src="static/img/order_status_money.png" alt="" />
							</div>
							<div class="order-status-detail">
								<div class="arrow-left"></div>
								<div class="clearfix">待支付<span class="pull-right">{{item.addtime}}</span></div>
								<div class="tips">
									<template v-if="config.pay_time_limit > 0">
										请在提交订单后{{config.pay_time_limit}}分钟内完成支付
									</template>
								</div>
							</div>
						</div>
						<template v-if="item.status < 3 || item.refund_status > 0">
							<div class="order-btn van-hairline--top">
								<template v-if="item.is_pay == 0">
								<router-link tag='div' class="order-btn-item van-hairline--right" :to="util.getUrl({path: '/pages/public/pay', query:{order_id: item.id, order_type: 'errander'}})">立即支付</router-link>
								</template>
								<template v-if="item.status == 1">
									<div class="order-btn-item" @click="onChangeStatus(item.id, 'cancel')">取消订单</div>
								</template>
								<template v-else-if="item.status == 2">
									<div class="order-btn-item van-hairline--right" @click="onChangeStatus(item.id, 'end')">确认收货</div>
									<div class="order-btn-item" @click="util.jsUrl('tel:' + item.deliveryer.mobile)">联系骑士</div>
								</template>
								<template v-if="item.refund_status >= 1">
									<router-link tag='div' class="order-btn-item" :to="util.getUrl({path: '/pages/paotui/detail', query:{id: item.id}})">查看退款</router-link>
								</template>
							</div>
						</template>
					</div>
				</van-list>
			</template>
			<template v-else>
				<div class="order-empty border-1px-b">
					<img src= "static/img/paotui_order_no.png" alt="" />
					<p class="font-15">您还没有随意购的订单 ~</p>
				</div>
				<p class="order-empty-title">看看大家都在买啥</p>
				<div class="order-other">
					<router-link tag="div" :to="util.getUrl({path: '/pages/paotui/diy?id=' + item.order_cid})" class="order-other-item flex-lr" v-for="(item, index) in others" :key="index">
						<img :src="item.thumb" alt="">
						<div class="item-info flex-lr">
							<div class="info-inner">
								<p class="title width-100 ellipsis font-14">{{item.anonymous_username}} 购买了 {{item.goods_name}}</p>
								<p class="font-13 c-disabled">{{item.addtime}}</p>
							</div>
							<span class="icon icon-right font-16 c-disabled"></span>
						</div>
					</router-link>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
	import PublicHeader from "@/components/header"
	import PublicFooter from "@/components/footer"
	export default {
		name: "paotuiOrder",
		components: {
			PublicHeader,
			PublicFooter
		},
		data() {
			return{
				showPreLoading: true,
				orders: {
					page: 1,
					psize: 7,
					finished: false,
					loading: false,
					data:[]
				},
				others: [],
				total_user: 0,
				config:{},
				menufooter: {},
			}
		},
		methods: {
			onChangeStatus(oid, type) {
				if(type == 'cancel') {
					var params = {
						url: 'errander/order/cancel?id=' + oid,
						confirm: '确定取消订单吗?',
					}
				} else if(type == 'end') {
					var params = {
						url: 'errander/order/end?id=' + oid,
						confirm: '确定已收到商品吗?',
					}
				} 
				this.util.jspost(params);
			},
			onLoad() {
				if(this.orders.finished) {
					return false;
				}
				this.util.request({
					url: 'errander/order/new_list',
					data: {
						page: this.orders.page,
						psize: this.orders.psize,
						menufooter: 1
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message)
						return false;
					}
					result = result.message;
					this.total_user = result.total_user;
					this.config = result.config;
					this.others = result.others;
					this.orders.data = [...this.orders.data, ...result.orders];
					this.orders.loading = false;
					if(result.orders.length < this.orders.psize) {
						this.orders.finished = true;
					}
					this.orders.page++;
					this.menufooter = window.menufooter;
				})
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#paotui-order .height-30{
		height: 30px;
	}
	#paotui-order .order-item{
		margin-top: 10px;
		background-color: #fff;
	}
	#paotui-order .order-item img{
		width: 30px;
		height: 30px;
		margin-right: 10px;
	}
	#paotui-order .order-item .category-title{
		font-size: 16px;
		font-weight: bold;
		padding-right: 10px;
	}
	#paotui-order .order-item .order-info{
		padding: 10px 15px;
		line-height: 1.6;
	}
	#paotui-order .order-item .order-info .left{
		width: 75%;
	}
	#paotui-order .order-item .order-info .right{
		width: 25%;
	}
	#paotui-order .order-item .order-info .price{
		color: #707070;
	}
	#paotui-order .order-item .order-status{
		margin: 10px 15px;
		position: relative;
	}
	#paotui-order .order-item .order-status:before{
		content: "";
		width: 1px;
		height: 20px;
		border-left: 1px solid #CBCBCB;
		position: absolute;
		top: 10px;
		left: 17.5px;
		margin-left: -1px;
	}
	#paotui-order .order-item .order-status .pic{
		width: 35px;
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
	}
	#paotui-order .order-item .order-status .pic img{
		width: 35px;
		height: 35px;
		position: absolute;
		top: 50%;
		margin-top: -17.5px;
		z-index: 10;
	}
	#paotui-order .order-item .order-status .order-status-detail{
		position: relative;
		font-size: 16px;
		border: 1px solid #e7e6e6;
		border-radius: 3px;
		background: #fafafa;
		padding: 12px 10px;
		margin-left: 55px;
	}
	#paotui-order .order-item .order-status .order-status-detail .arrow-left,#paotui-order .order-item .order-status .order-status-detail .arrow-left:after{
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
	#paotui-order .order-item .order-status .order-status-detail .arrow-left:after{
		content: "";
		border-right-color: #fafafa;
		left: 2px;
		top: 0px;
	}
	#paotui-order .order-item .order-status .order-status-detail .clearfix{
		overflow: hidden;
		line-height: 24px;
	}
	#paotui-order .order-item .order-status .order-status-detail .clearfix .pull-right{
		color: #999;
		font-size: 12px;
		float: right;
	}
	#paotui-order .order-item .order-status .order-status-detail .tips{
		color: #999;
		font-size: 12px;
		line-height: 18px;
	}

	#paotui-order .order-item .order-btn{
		width: 100%;
		height: 44px;
		line-height: 44px;
		text-align: center;
		display: flex;
		flex-flow: row nowrap;
		justify-content: center;
		align-items: center;
	}
	#paotui-order .order-item .order-btn-item{
		width: 100%;
	}
	#paotui-order .order-empty{
		background-color: #fff;
		text-align: center;
		padding: 30px 0;
	}
	#paotui-order .order-empty img{
		max-width: 25%;
	}
	#paotui-order .order-empty-title{
		color: #6d6d72;
		font-size: 14px;
		text-align: center;
		padding: 15px;
	}
	#paotui-order .order-other .order-other-item{
		background-color: #fff;
		margin-bottom: 10px;
		padding: 10px 15px;
	}
	#paotui-order .order-other .order-other-item img{
		width: 45px;
		height: 45px;
	}
	#paotui-order .order-other .order-other-item .item-info{
		width: 85%;
		line-height: 1.5;
	}
	#paotui-order .order-other .order-other-item .item-info .info-inner{
		width: 90%;
	}
</style>


// WEBPACK FOOTER //
// src/pages/paotui/order.vue