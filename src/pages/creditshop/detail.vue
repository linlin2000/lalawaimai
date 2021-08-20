<template>
	<div id="creditshop-detail">
		<public-header title="兑换详情"></public-header>
		<div class="content">
			<div class="detail">
				<div class="shop-content">
					<div class="store-name">
						<div class="name">兑换商品信息</div>
					</div>
					<div class="food-list">
						<div class="food-item-img">
							<img :src="order.goods_info.thumb" alt="">
						</div>
						<div class="food-item-price">
							<div class="now-price">
								{{order.goods_info.use_credit1}}酒币
								<template v-if="order.goods_info.use_credit2 > 0">
									+ ¥{{order.goods_info.use_credit2}}
								</template>
							</div>
							<div class="old-price">{{order.goods_info.old_price}}</div>
						</div>
						<div class="food-item-info">
							<div class="food-item-name">{{order.goods_info.title}}</div>
							<div class="food-item-num">x1</div>
						</div>
					</div>
				</div>
				<div class="dispatching" v-if="order.goods_type == 'goods'">
					<div class="time van-hairline--bottom">
						<div class="text">收件人姓名</div>
						<div class="main">{{order.username}}</div>
					</div>
					<div class="server">
						<div class="text">联系方式</div>
						<div class="main">{{order.mobile}}</div>
					</div>
				</div>
				<div class="code-qrcode" v-if="order.goods_type == 'goods'">
					<div id="qrcode"></div>
					<span class="font-14 margin-10-t">兑换码：{{order.code}}</span>
					<div class="code-text">请平台管理员扫描二维码或者填写兑换码即可兑换</div>
				</div>
				<div class="order">
					<div class="code">
						<div class="text">订单号码</div>
						<div class="main">{{order.order_sn}}</div>
					</div>
					<div class="divide-line"></div>
					<template v-if="order.goods_type == 'credit2' || order.goods_type == 'redpacket'">
						<div class="code">
							<div class="text">商品类型</div>
							<div class="main">
								<template v-if="order.goods_type == 'credit2'">
									余额
								</template>
								<template v-else-if="order.goods_type == 'redpacket'">
									红包
								</template>
								<span class="c-danger">（已发送到您的账户中）</span>
							</div>
						</div>
						<div class="divide-line"></div>
					</template>
					<div class="time">
						<div class="text">
							消耗酒币<template v-if="order.use_credit2 > 0">+消耗余额</template>
						</div>
						<div class="main">
							{{order.use_credit1}}酒币 <template v-if="order.use_credit2 > 0">+ ¥{{order.use_credit2}}</template>
						</div>
					</div>
					<div class="divide-line"></div>
					<div class="code">
						<div class="text">兑换时间</div>
						<div class="main">{{order.addtime}}</div>
					</div>
				</div>
				<router-link :to="util.getUrl({path: '/pages/public/pay', query: {order_id: order.id, order_type: 'creditshop'}})" class="now-pay" v-if="order.use_credit2 > 0 && order.is_pay == 0 && order.status == 1">
					立即支付
				</router-link>
			</div>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import QRcode from 'qrcodejs2'
	export default {
		data() {
			return {
				order_id: Number,
				islegal: false,
				order: {
					goods_info: {},
				},
				showPreLoading: true
			}
		},
		components: {
			PublicHeader,
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'creditshop/order/detail',
					data: {
						order_id: this.order_id
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					this.islegal = true;
					this.order = result.message;
					this.$nextTick(() => {
						this.newQrcode(this.order.qrcode);
					})
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
		created() {
			if(this.$route.query.id) {
				this.order_id = this.$route.query.id;
			} else {
				this.util.$toast('参数错误')
				return false;
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#creditshop-detail .content .detail{
		margin: 10px;
	}
	#creditshop-detail .content .detail .shop-content{
		background-color:#fff;
	}
	#creditshop-detail .content .detail .shop-content .store-name{
		padding:10px 15px;
	}
	#creditshop-detail .content .detail .shop-content .store-name .name{
		display:inline-block;
		font-size:14px;
		text-align: left;
		max-width:80%;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
		color:#7D7D7D;
		line-height: 22px;
	}
	#creditshop-detail .content .detail .shop-content .food-list{
		padding:10px;
		background-color:#f8f8f8;
		overflow:hidden;
	}
	#creditshop-detail .content .detail .shop-content .food-list .food-item-img{
		display:inline-block;
		float:left;
		width:55px;
		height:55px;
		overflow:hidden;
	}
	#creditshop-detail .content .detail .shop-content .food-list .food-item-img img{
		border: none;
		width: 100%;
		height: 100%;
	}
	#creditshop-detail .content .detail .shop-content .food-list .food-item-info{
		margin:0 55px 0 65px;
	}
	#creditshop-detail .content .detail .shop-content .food-list .food-item-info .food-item-name{
		line-height:20px;
		white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
		font-size:14px;
	}
	#creditshop-detail .content .detail .shop-content .food-list .food-item-info .food-item-num{
		line-height:18px;
		color:#999;
		font-size:12px;
	}
	#creditshop-detail .content .detail .shop-content .food-list .food-item-price{
		float:right;
		display:inline-block;
		line-height:20px;
	}
	#creditshop-detail .content .detail .shop-content .food-list .food-item-price .now-price{
		text-align:right;
		font-size:15px;
		color:#333;
		font-weight:500;
	}
	#creditshop-detail .content .detail .shop-content .food-list .food-item-price .old-price{
		text-align:right;
		font-size:12px;
		color:#999;
		text-decoration:line-through;
	}
	#creditshop-detail .content .detail .dispatching{
		padding:15px 15px;
		background-color:#fff;
		margin-top:10px;
	}
	#creditshop-detail .content .detail .dispatching .time{
		overflow: hidden;
		line-height: 22px;
		padding-bottom: 10px;
	}
	#creditshop-detail .content .detail .dispatching .time .text{
		font-size:14px;
		color:#9A9A9A;
		margin-right:15px;
		float:left;
	}
	#creditshop-detail .content .detail .dispatching .time .main{
		font-size: 14px;
		float: left;
	}
	#creditshop-detail .content .detail .dispatching .server{
		overflow: hidden;
		line-height: 22px;
		padding-top: 10px;
	}
	#creditshop-detail .content .detail .dispatching .server .text{
		font-size:14px;
		color:#9A9A9A;
		margin-right:15px;
		float: left;
	}
	#creditshop-detail .content .detail .dispatching .server .main{
		float: left;
		font-size: 14px;
	}
	#creditshop-detail .content .detail .order{
		padding:15px;
		margin-top:10px;
		background-color:#fff;
		position:relative;
	}
	#creditshop-detail .content .detail .order .code{
		display:flex;
		align-items:center;
	}
	#creditshop-detail .content .detail .order .code .text{
		display:inline-block;
		font-size:14px;
		color:#9A9A9A;
		margin-right:15px;
		line-height: 22px;
	}
	#creditshop-detail .content .detail .order .code .main{
		display:inline-block;
		font-size:14px;
		line-height: 22px;
	}
	#creditshop-detail .content .detail .order .time{
		display:flex;
		align-items:center;
	}
	#creditshop-detail .content .detail .order .time .text{
		color:#9A9A9A;
		margin-right:15px;
		display:inline-block;
		font-size:14px;
	}
	#creditshop-detail .content .detail .order .time .main{
		display:inline-block;
		font-size:14px;
	}
	#creditshop-detail .content .detail .order .divide-line{
		height:0;
		font-size:0;
		border-top:1px dotted #ddd;
		margin:10px 0px;
	}
	#creditshop-detail .content .now-pay{
		display: inline-block;
		width: 100%;
		background:#ff2d4b;
		margin-top:10px;
		color:#fff;
		font-size:18px;
		text-align:center;
		line-height: 46px;
		border-radius: 5px;
	}
	#creditshop-detail .content  .code-qrcode{
		padding: 15px;
		margin-top: 10px;
		background-color: #fff;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
	}
	#creditshop-detail .content  .code-qrcode .code-text{
		color: #999;
		margin-top: 10px;
		font-size: 14px;
		text-align: center;
	}
</style>


// WEBPACK FOOTER //
// src/pages/creditshop/detail.vue