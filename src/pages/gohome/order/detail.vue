<template>
	<div id="kanjia-order-detail">
		<public-header title="订单详情"></public-header>
		<div class="content">
			<div class="content-scroll">
				<div class="margin-15 font-14 flex-lr">
					<div class="c-gray">到店核销</div>
					<div class="c-danger">{{order.status_cn}}</div>
				</div>
				<div class="goods-info margin-15 padding-15 bg-default radius-3">
					<div class="flex">
						<i class="icon icon-store font-18"></i>
						<span class="font-14 margin-10-l font-500">{{order.store.title}}</span>
					</div>
					<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/' + order.order_type + '/detail', query: {id: order.goods.id}})" class="padding-15-t flex-lr">
						<div class="thumb">
							<img class="img-100" :src="order.goods.thumb" alt="">
						</div>
						<div class="info">
							<p>{{order.goods.name}}</p>
							<div class="flex-lr w-100">
								<div class="flex">
									<div class="c-danger font-16 font-500">¥{{order.final_fee}}</div>
									<div class="c-gray font-12 line-through margin-10-l">¥{{order.goods.oldprice}}</div>
								</div>
								<span class="c-gray">x{{order.num}}</span>
							</div>
						</div>
					</router-link>
				</div>
				<div class="margin-15 padding-15 bg-default radius-3 ">
					<div class="padding-15-b van-hairline--bottom font-14">费用信息</div>
					<div class="padding-15-b van-hairline--bottom font-13">
						<div class="margin-15-t flex-lr">
							<div class="c-gray">商品费用</div>
							<div>¥{{order.final_fee}}</div>
						</div>
						<template v-if="0">
							<div class="margin-10-t flex-lr">
								<div class="c-gray">新客立减</div>
								<div>-¥10</div>
							</div>
							<div class="margin-10-t flex-lr">
								<div class="c-gray">红包</div>
								<div>-¥5</div>
							</div>
						</template>
					</div>
					<div class="padding-15-t flex-lr font-14">
						<div class="c-gray">实付款</div>
						<div class="c-danger">¥{{order.final_fee}}</div>
					</div>
				</div>
				<div class="margin-15 padding-15 bg-default radius-3 font-13">
					<div class="padding-15-b van-hairline--bottom font-14">核销使用</div>
					<div class="margin-15-t flex-lr" v-if="0">
						<div class="c-gray">截止时间</div>
						<div class="c-danger">2018-12-31</div>
					</div>
					<div class="margin-10-t flex-lr">
						<div class="c-gray">核销数量</div>
						<div>{{order.num}}</div>
					</div>
					<div class="margin-10-t flex-lr hide">
						<div class="c-gray">核销密码</div>
						<input type="text" placeholder="请输入核销密码" class="text-right">
					</div>
					<template v-if="order.order_type != 'pintuan' || (order.order_type == 'pintuan' && order.status >= 3)">
						<div class="margin-10-t">
							<div id="qrcode" class="qrcode"></div>
							<p class="text-center font-12 margin-10-t">核销码: {{order.code}}</p>
						</div>
						<p class="margin-10-t c-gray text-center">请商家扫描二维码或者填写核销码即可消费</p>
					</template>
				</div>
				<div class="margin-15 padding-15 bg-default radius-3 font-13">
					<div class="padding-15-b van-hairline--bottom font-14">订单信息</div>
					<van-row class="c-gray margin-10-t">
						<van-col span="6">订单编号</van-col>
						<van-col span="18">{{order.ordersn}}</van-col>
					</van-row>
					<van-row class="c-gray margin-10-t" v-if="order.is_pay == 1">
						<van-col span="6">支付方式</van-col>
						<van-col span="18">{{order.pay_type_cn}}</van-col>
					</van-row>
					<van-row class="c-gray margin-10-t">
						<van-col span="6">下单时间</van-col>
						<van-col span="18">{{order.addtime_cn}}</van-col>
					</van-row>
					<van-row class="c-gray margin-10-t" v-if="order.is_pay == 1">
						<van-col span="6">支付时间</van-col>
						<van-col span="18">{{order.paytime_cn}}</van-col>
					</van-row>
					<van-row class="c-gray margin-10-t">
						<van-col span="6">买家备注</van-col>
						<van-col span="18" class="line-12">{{order.buyremark ? order.buyremark : '无'}}</van-col>
					</van-row>
				</div>
			</div>
			<ul class="fix-bottom van-hairline--top">
				<router-link tag="li" :to="util.getUrl({path: '/gohome/pages/' + order.order_type + '/index',})" v-if="order.order_type_all">查看更多{{order.order_type_all.text}}活动</router-link>
				<router-link tag="li" v-if="order.order_type == 'pintuan' && order.team_id > 0" :to="util.getUrl({path: '/gohome/pages/pintuan/share', query: {id: order.goods_id, team_id: order.team_id}})">拼团详情</router-link>
				<template v-if="order.is_pay == 0">
					<li v-if="order.status == 1" @click="util.jspost({url: 'gohome/order/cancel', data: {id: order.id}})">取消订单</li>
					<router-link tag="li" :to="util.getUrl({path: '/pages/public/pay', query: {order_id: order.id, order_type: 'gohome'}})" class="btn-item" v-if="order.status == 1">立即支付</router-link>
				</template>
				<template v-else-if="order.is_pay == 1">
					<router-link tag="li" :to="util.getUrl({path: '/gohome/pages/comment/comment', query: {order_id: order.id}})" class="btn-item" v-if="order.status == 5">立即评价</router-link>
				</template>
			</ul>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import {getData} from "@/controller/funcCommon"
	import QRcode from 'qrcodejs2'
	export default {
		components: {
			PublicHeader,
		},
		data() {
			return {
				id: 0,
				order: {
					goods: {},
					store: {}
				},
				showPreLoading: true
			}
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'gohome/order/detail',
					data: {
						id: that.id
					},
					autoAssign: true,
					variable: 'order',
					success: (res) => {
						that.newQrcode(res.qrcode);
					}
				})
			},
			newQrcode(text) {
				let qrcode = new QRcode('qrcode', {
					width: 150,
					height: 150, // 高度
					text: text, // 二维码内容
					image: ''
					// render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
					// background: '#f0f'
					// foreground: '#ff0'
				})
			},
		},
		mounted() {
			if(this.$route.query && this.$route.query.id) {
				this.id = this.$route.query.id;
			}
			this.onLoad()
		}
	}
</script>

<style>
	#kanjia-order-detail .content .content-scroll{
		position: absolute;
		top: 0;
		bottom: 50px;
		left: 0;
		right: 0;
		box-sizing: border-box;
		overflow-y: auto;
		overflow-x: hidden;
	}
	#kanjia-order-detail .content .content-scroll::-webkit-scrollbar {
		display: none;
	}
	#kanjia-order-detail .content .fix-bottom{
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 50px;
		background-color: #fff;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 0 15px;
	}
	#kanjia-order-detail .content .fix-bottom li{
		color: #ff2d4b;
		border: 1px solid #ff2d4b;
		font-size: 14px;
		padding: 7px 10px;
		border-radius: 50px;
		margin-left: 10px;
	}
	#kanjia-order-detail .goods-info .thumb{
		width: 50px;
		height: 50px;
		border-radius: 3px;
		overflow: hidden;
		font-size: 0px;
	}
	#kanjia-order-detail .goods-info .info{
		height: 50px;
		font-size: 14px;
		flex: 1;
		padding-left: 10px;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
	}
	#kanjia-order-detail .qrcode{
		width: 150px;
		font-size: 0px;
		margin: 0 auto;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/order/detail.vue