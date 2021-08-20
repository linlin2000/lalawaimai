<template>
	<div id="paotui-order-detail">
		<public-header title="订单详情" bgcolor="#ff2d4b" textcolor="#fff"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<van-tabs v-model="active_tab" swipeable>
				<van-tab title="订单详情" class="order-detail">
					<div class="order-state border-1px-tb">
						<div class="order-state-con">
							<div class="guide">
								<img src="static/img/order_status_service.png" alt="" />
							</div>
							<div class="order-state-detail">
								<div class="flex-lr">订单{{order.order_status}}<span class="pull-right date">{{order.addtime_cn}}</span></div>
								<div class="tips clearfix" v-if="log.note">{{log.note}}</div>
							</div>
						</div>
						<div class="order-btn" v-if="order.status < 3">
							<router-link tag='div' :to="util.getUrl({path: '/pages/public/pay', query:{order_id: order.id, order_type: 'errander'}})" class="table-cell  van-hairline--top" v-if="order.is_pay == 0">立即支付</router-link>
							<template v-if="order.status == 1">
								<div class="table-cell van-hairline--top" @click="onChangeStatus(order.id, 'cancel')">取消订单</div>
							</template>
							<template v-else-if="order.status == 2">
								<div v-if="order.delivery_stauts == 1" class="table-cell van-hairline--top" @click="onChangeStatus(order.id, 'cancel')">取消订单</div>
								<div class="table-cell van-hairline--top" @click="onChangeStatus(order.id, 'end')">确认送达</div>
								<div class="table-cell van-hairline--top" @click="util.jsUrl('tel:' + deliveryer.mobile)">联系骑士</div>
							</template>
							<router-link :to="util.getUrl({path: '/pages/paotui/map', query:{id: order.id}})" class="table-cell van-hairline--left van-hairline--top" v-if="show_location">配送员位置</router-link>
							<router-link :to="util.getUrl({path: '/pages/paotui/detail', query:{id: order.id}})" class="table-cell van-hairline--top" v-if="order.is_refund == 1">查看退款</router-link>
						</div>
					</div>
					<div class="content-block-title">订单明细</div>
					<div class="order-details">
						<div class="order-details-con border-1px-t ">
							<div class="store-info border-1px-b">
								<router-link tag="div" :to="util.getUrl({path: '/pages/paotui/diy', query:{id: order.category.id}})" class="external">
									<img :src="order.category.thumb" alt="" />
									<span class="store-title">{{order.category.name}}</span>
									<span class="icon icon-arrow-right pull-right"></span>
								</router-link>
							</div>
							<div class="inner-con">
								<van-row class="no-gutter" v-if="order.order_type == 'buy'">
									<van-col span="12" class="ellipsis">{{order.goods_name}}</van-col>
									<van-col span="12" class="text-right">与配送员结算</van-col>
								</van-row>
								<van-row class="no-gutter">
									<van-col span="12">配送费</van-col>
									<van-col span="12" class="text-right">¥{{order.delivery_fee}}</van-col>
								</van-row>
								<van-row class="no-gutter">
									<van-col span="20">小费</van-col>
									<van-col span="4" class="text-right">¥{{order.delivery_tips}}</van-col>
								</van-row>
							</div>
							<div class="inner-con">
								<van-row class="no-gutter padding-10">
									<van-col span="20" class="text-right color-muted">总计</van-col>
									<van-col span="4" class="text-right">¥{{order.final_fee}}</van-col>
								</van-row>
							</div>
						</div>
					</div>
					<template v-if="order.order_type == 'buy'">
						<div class="content-block-title">商品信息</div>
						<div class="other-info">
							<ul class="border-1px-tb">
								<li class="item-content flex">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">订单类型</div>
										<div class="item-after">{{order.order_type_cn}}</div>
									</div>
								</li>
								<li class="item-content flex">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">购买商品</div>
										<div class="item-after">{{order.goods_name}}</div>
									</div>
								</li>
								<li class="item-content flex">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">购买地址</div>
										<div class="item-after">{{order.buy_address}}</div>
									</div>
								</li>
								<li class="item-content padding-15-r" v-if="order.thumbs.length > 0">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">顾客上传的图片</div>
									</div>
									<van-row gutter="10">
										<van-col span="6" class="goods-img" v-for="(item, index) in order.thumbs" :key="index">
											<img :src="item" alt="">
										</van-col>
									</van-row>
								</li>
							</ul>
						</div>
					</template>
					<template v-else>
						<div class="content-block-title">物品信息</div>
						<div class="other-info">
							<ul class="border-1px-tb">
								<li class="item-content flex">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">订单类型</div>
										<div class="item-after">{{order.order_type_cn}}</div>
									</div>
								</li>
								<li class="item-content flex">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">物品信息</div>
										<div class="item-after">{{order.goods_name}}</div>
									</div>
								</li>
								<li class="item-content flex">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">物品价值</div>
										<div class="item-after">{{order.goods_price}}</div>
									</div>
								</li>
								<li class="item-content flex">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">物品重量</div>
										<div class="item-after">{{order.goods_weight}}公斤</div>
									</div>
								</li>
								<li class="item-content flex">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">取货地址</div>
										<div class="item-after">{{order.buy_address}}</div>
									</div>
								</li>
								<li class="item-content flex">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">联系人</div>
										<div class="item-after">{{order.buy_username}}</div>
									</div>
								</li>
								<li class="item-content padding-15-r" v-if="order.thumbs.length > 0">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">顾客上传的图片</div>
									</div>
									<van-row gutter="10">
										<van-col span="6" class="goods-img" v-for="(item, index) in order.thumbs" :key="index">
											<img :src="item" alt="">
										</van-col>
									</van-row>
								</li>
							</ul>
						</div>
					</template>
					<template v-if="order.data.order">
						<template v-if="order.data.order.thumbs" v-for="item in order.data.order.thumbs">
							<div class="item-inner flex-lr">
								<div class="content-block-title">{{item.title}}</div>
							</div>
							<div class="padding-15-lr padding-15-t padding-5-b bg-default border-1px-tb">
								<van-row gutter="10">
									<van-col span="6" class="goods-img" v-for="(childItem, index) in item.value" :key="index">
										<div class="img-wrap" @click="util.jsPreviewImage(item.value, index)">
											<img :src="childItem" alt="">
										</div>
									</van-col>
								</van-row>
							</div>
						</template>
					</template>
					<div class="content-block-title">收货地址</div>
					<div class="other-info">
						<ul class="border-1px-tb">
							<li class="item-content flex">
								<div class="item-inner border-1px-b flex-lr">
									<div class="item-title">收货地址</div>
									<div class="item-after">{{order.accept_address}}</div>
								</div>
							</li>
							<li class="item-content flex">
								<div class="item-inner border-1px-b flex-lr">
									<div class="item-title">联系人</div>
									<div class="item-after">{{order.accept_username}}</div>
								</div>
							</li>
						</ul>
					</div>
					<div class="content-block-title">其他信息</div>
					<div class="other-info">
						<ul class="border-1px-tb">
							<li class="item-content flex" v-if="order.deliveryer_id > 0">
								<div class="item-inner border-1px-b flex-lr">
									<div class="item-title">配送员</div>
									<div class="item-after">{{deliveryer.title}}</div>
								</div>
							</li>
							<li class="item-content flex">
								<div class="item-inner border-1px-b flex-lr">
									<div class="item-title">配送时间</div>
									<div class="item-after">{{order.delivery_time}}</div>
								</div>
							</li>
							<li class="item-content flex">
								<div class="item-inner border-1px-b flex-lr">
									<div class="item-title">订单号</div>
									<div class="item-after">{{order.order_sn}}</div>
								</div>
							</li>
							<li class="item-content flex">
								<div class="item-inner border-1px-b flex-lr">
									<div class="item-title">收货码</div>
									<div class="item-after">{{order.code}}</div>
								</div>
							</li>
							<li class="item-content flex">
								<div class="item-inner border-1px-b flex-lr">
									<div class="item-title">支付方式</div>
									<div class="item-after">{{order.pay_type_cn}}</div>
								</div>
							</li>
							<li class="item-content flex">
								<div class="item-inner border-1px-b flex-lr">
									<div class="item-title">备注</div>
									<div class="item-after">{{order.note ? order.note : '无'}}</div>
								</div>
							</li> 
							<template v-if="order.data.order">
								<template v-if="order.data.order.partData" v-for="(item, index) in order.data.order.partData">
									<li class="item-content flex" v-if="item.type != 'multipleChoices'">
										<div class="item-inner border-1px-b flex-lr">
											<div class="item-title">{{item.title}}</div>
											<div class="item-after">{{item.value}}</div>
										</div>
									</li>
									<li class="item-content flex" v-else>
										<div class="item-inner border-1px-b flex-lr">
											<div class="item-title">{{item.title}}</div>
											<div class="item-after">
												<template v-for="childItem in item.value">
													{{childItem}}
												</template>
											</div>
										</div>
									</li>
								</template>
								<template v-if="order.data.order.extra_fee" v-for="(item, index) in order.data.order.extra_fee" >
									<li class="item-content flex">
										<div class="item-inner border-1px-b flex-lr">
											<div class="item-title">{{item.title}}</div>
											<div class="item-after">
												<template v-for="childItem in item.value">
													&nbsp{{childItem.name}}-￥{{childItem.fee}}
												</template>
											</div>
										</div>
									</li>
								</template>
							</template>
						</ul>
					</div>
				</van-tab>
				<van-tab title="订单状态" class="order-status">
					<div class="order-status-item" v-for="(item, index) in logs" :key="index">
						<div class="guide">
							<img src="static/img/order_status_service_grey.png" alt="" v-if="maxid != index">
							<img src="static/img/order_status_service.png" alt="" v-else>
						</div>
						<div class="order-status-info">
							<div class="arrow-left"></div>
							<div class="flex-lr">{{item.title}}<span class="time pull-right">{{item.addtime}}</span></div>
							<div class="tips" v-if="item.note" v-html="item.note"></div>
						</div>
					</div>
				</van-tab>
				<van-tab title="退款详情" class="order-refund" v-if="order.refund_status > 0" >
					<div class="refund-detail">
						<van-row class="refund-de-title border-1px-b">
							<van-col span="13">
								退款金额 <span class="color-danger">¥{{order.final_fee}}</span>
							</van-col>
							<van-col span="11">
								<span class="refund-status-cn float-right">{{order.refund_status_cn}}</span>
							</van-col>
						</van-row>
						<div class="refund-detail-con">
							<div class="no-gutter">订单编号:<span>{{order.order_sn}}</span></div>
							<div class="no-gutter">退款周期:<span>1-15个工作日</span></div>
							<div class="no-gutter">支付方式:<span>{{order.pay_type_cn}}</span></div>
							<div class="no-gutter" v-if="order.refund_channel">退款方式:<span>{{order.refund_channel_cn}}</span></div>
							<div class="no-gutter" v-if="order.refund_account">退款账户:<span>{{order.refund_account}}</span></div>
						</div>
					</div>
					<div class="refund-plan">
						<div class="order-status-item" v-for="(item, index) in refund_logs" :key="index">
							<div class="guide">
								<img src="static/img/order_status_service_grey.png" alt="" v-if="index != refundmaxid">
								<img src="static/img/order_status_service.png" alt="" v-else>
							</div>
							<div class="order-status-info">
								<div class="arrow-left"></div>
								<div class="flex-lr">{{item.title}}<span class="time pull-right">{{item.addtime}}</span></div>
								<div class="tips" v-if="item.note" >{{item.note}}</div>
							</div>
						</div>
					</div>
				</van-tab>
			</van-tabs>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	export default {
		components: {
			PublicHeader,
			PublicFooter
		},
		data() {
			return {
				showPreLoading: true,
				active_tab: 0,
				order: {
					thumbs:[],
					category: {},
					data: {
						order: {}
					}
				},
				logs: {},
				log: {},
				maxid: '',
				refundmaxid: '',
				refund_logs: {},
				menufooter: {},
				show_location: 0,
			}
		},
		methods: {
			onChangeTab(index) {
				this.active_tab = index;
			},
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
				if(!this.id) {
					this.$toast('订单不存在或已删除');
					return false;
				}
				this.util.request({
					url: 'errander/order/detail',
					data: {
						id: this.id,
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
					this.order = result.order;
					this.logs = result.logs;
					this.deliveryer = result.deliveryer;
					this.maxid = result.maxid;
					if(result.refund_logs) {
						this.refund_logs = result.refund_logs;
						this.refundmaxid = result.refundmaxid;
					}
					this.show_location = result.show_location;
					this.menufooter = window.menufooter;
				})
			},
		},
		created() {
			this.query = this.$route.query;
			if(this.query) {
				this.id = this.query.id;
			}
		},
		mounted() {
			this.onLoad()
		}
	}
</script>

<style>
	#paotui-order-detail .content{
		position: absolute;
		top: 46px;
		left: 0;
		right: 0;
		bottom: 50px;
		overflow-y: auto;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}
	#paotui-order-detail .content::-webkit-scrollbar{
		display: none;
	}
	#paotui-order-detail .order-detail .order-state{
		background-color:#fff;
		margin-top: 10px;
	}
	#paotui-order-detail .order-detail .order-state-con {
		padding: 0 15px 0 65px;
		position: relative;
	}
	#paotui-order-detail .order-detail .order-state-con:before {
		content: "";
		width: 1px;
		height: 20px;
		border-left: 1px solid #CBCBCB;
		position: absolute;
		left: 33px;
		top: 0;
		margin-left: -1px;
	}
	#paotui-order-detail .order-detail .order-state-con .guide {
		width: 35px;
		position: absolute;
		left: 15px;
		top: 0;
		height: 100%;
	}
	#paotui-order-detail .order-detail .order-state-con .guide img{
		width: 35px;
		position: absolute;
		top: 50%;
		margin-top: -18px;
		z-index: 10;
	}
	#paotui-order-detail .order-detail .order-state-detail{
		font-size: 15px;
		padding: 15px 0;
		line-height: 1.5;
	}
	#paotui-order-detail .order-detail .order-state-detail .date,#order-detail .order-state-detail .tips {
		font-size: 12px;
		color: #999;
	}
	#paotui-order-detail .order-detail .order-state-detail .tips {
		margin-bottom: 3px;
		font-size: 12px;
		color: #999;
	}
	#paotui-order-detail .order-detail .order-state-detail .more{
		color: #ff2d4b;
		font-size: 14px;
		line-height: 14px;
	}
	#paotui-order-detail .order-detail .order-btn{
		display: table;
		table-layout: fixed;
		width: 100%;
		margin: 0;
		padding: 0;
		background: #fff;
		font-size: 14px;
		min-height: 40px;
	}
	#paotui-order-detail .order-detail .order-btn .table-cell{
		display: table-cell;
		overflow: hidden;
		text-align: center;
		white-space: nowrap;
		text-overflow: ellipsis;
		vertical-align: middle;
		color: #333;
	}
	#paotui-order-detail .swiper-container{
		width: 100%;
		padding: 10px;
	}
	#paotui-order-detail .swiper-container img{
		width: 100%;
		height: 72px;
	}
	#paotui-order-detail .content-block-title {
		margin: 10px 15px;
		position: relative;
		overflow: hidden;
		font-size: 14px;
		line-height: 1;
		color: #6d6d72;
		text-overflow: ellipsis;
		text-transform: uppercase;
		white-space: nowrap;
	}
	#paotui-order-detail .order-details-con{
		padding: 0px 15px;
		background-color: #fff;
		font-size:15px;
	}
	#paotui-order-detail .order-details-con .store-info{
		height: 50px;
		line-height: 50px;
		font-size: 15px;
	}
	#paotui-order-detail .order-details-con .store-info img {
		margin-right: 10px;
		width: 30px;
		height: 30px;
		vertical-align: middle;
		border-radius: 100%;
	}
	#paotui-order-detail .order-details-con .store-info .store-title{
		font-weight: bold;
		color: #333;
	}
	#paotui-order-detail .order-details-con .store-info .icon{
		font-size: 16px;
		color: #999;
		float: right;
	}
	#paotui-order-detail .no-gutter{
		margin: 10px 0;
		line-height: 1.5;
	}
	#paotui-order-detail .no-gutter .color-muted{
		color:#999;
	}
	#paotui-order-detail .order-details .icon-before{
		display: flex;
		align-items: center;
	}
	#paotui-order-detail .order-details .icon-before img{
		margin-right: 5px;
		width: 18px;
		height: 18px;
	}
	#paotui-order-detail .order-details .discount-note{
		color: #ff2d4b;
	}
	#paotui-order-detail .order-details .color-danger{
		color: #ff2d4b!important;
	}
	#paotui-order-detail .other-info{
		font-size: 15px;
	}
	#paotui-order-detail .other-info ul{
		position: relative;
		padding: 0;
		margin: 0;
		list-style: none;
		background-color: #fff;
	}
	#paotui-order-detail .other-info .item-content{
		min-height: 44px;
		padding-left: 15px;
	}
	#paotui-order-detail .other-info .item-content:last-child .item-inner{
		border-bottom: 0;
	}
	#paotui-order-detail .other-info .item-content .item-inner{
		width: 100%;
		min-height: 44px;
		padding: 8px 15px 8px 0;
		font-size: 15px;
	}
	#paotui-order-detail .other-info .item-content .item-inner .item-title{
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	#paotui-order-detail .other-info .item-content .item-inner .item-after{
		max-width: 300px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #999;
	}
	#paotui-order-detail .other-info .item-content img{
		width: 100%;
		height: 80px;
		margin-bottom: 7px;
		border-radius: 3px;
	}
	#paotui-order-detail .order-status{
		padding: 10px 15px;
	}
	#paotui-order-detail  .order-status-item {
		padding-left: 50px;
		position: relative;
	}
	#paotui-order-detail .order-status-item .guide {
		width: 35px;
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
	}
	#paotui-order-detail .order-status-item .guide img {
		width: 35px;
		position: absolute;
		top: 50%;
		margin-top: -18px;
		z-index: 10;
	}
	#paotui-order-detail .order-status-info {
		position: relative;
		background: #fff;
		margin: 10px 0;
		font-size: 15px;
		border: 1px solid #e7e6e6;
		border-radius: 3px;
		padding: 12px 10px;
	}

	#paotui-order-detail .order-status-info .arrow-left, #paotui-order-detail .order-status-info .arrow-left:after {
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
	#paotui-order-detail .order-status-info .arrow-left:after {
		content: "";
		border-right-color: #fff;
		left: 2px;
		top: 0px;
	}

	#paotui-order-detail .order-status-info .tips {
		margin-top: 10px;
	}
	#paotui-order-detail .order-status-info .tips a{
		color: #0894ec;
	}
	#paotui-order-detail .order-status-info .tips,#paotui-order-detail .order-status .order-status-info .time {
		color: #999;
		font-size: 12px;
	}
	#paotui-order-detail .order-status-item:before, #paotui-order-detail .order-status-item:after {
		content: "";
		width: 1px;
		height: 50%;
		border-left: 1px solid #CBCBCB;
		position: absolute;
		top: 0px;
		left: 18px;
		margin-left: -1px;
	}
	#paotui-order-detail  .order-status-item:first-child:before{
		height: 0px;
	}
	#paotui-order-detail .order-status-item:last-child:after{
		height: 0px;
	}
	#paotui-order-detail .order-status-item:after {
		top: 75%;
		bottom: 0;
		height: 50%;
	}
	#paotui-order-detail .order-refund{
		margin-top: 10px;
	}
	#paotui-order-detail .order-refund .refund-detail{
		background: #FFF;
		padding: 0 15px 10px;
		font-size: 15px;
	}
	#paotui-order-detail .order-refund .refund-detail .refund-de-title{
		padding: 10px 0;
		font-size: 15px;
		color: #333;
	}
	#paotui-order-detail .order-refund .refund-detail .refund-de-title .color-danger{
		color: #f6383a;
	}
	#paotui-order-detail .order-refund .refund-detail .refund-status-cn{
		background: #ddd;
		color: #fff;
		font-size: 12px;
		border-radius: 20px;
		padding: 3px 6px;
	}
	#paotui-order-detail .order-refund .refund-detail .refund-detail-con{
		font-size: 12px;
		color: #999;
	}
	#paotui-order-detail .order-refund .refund-detail .refund-detail-con .no-gutter{
		margin: 7px 0;
	}
	#paotui-order-detail .refund-plan{
		margin-top: 10px;
		padding: 15px;
		background: #FFF;
	}
	#paotui-order-detail .refund-plan .order-status-info{
		background: #fafafa!important;
	}

	#paotui-order-detail .refund-plan .arrow-left:after{
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 10px 12px 10px 0;
		border-color: transparent #e7e6e6 transparent transparent;
		position: absolute;
		left: 2px;
		top: 0;
		margin-top: -10px;
		content: "";
		border-right-color: #fafafa;
	}
	#paotui-order-detail .goods-img .img-wrap{
		width: 100%;
		height: 80px;
		font-size: 0px;
		margin-bottom: 10px;
		border-radius: 3px;
		overflow: hidden;
	}
	#paotui-order-detail .goods-img .img-wrap img{
		width: 100%;
		height: 100%;
	}
</style>



// WEBPACK FOOTER //
// src/pages/paotui/detail.vue