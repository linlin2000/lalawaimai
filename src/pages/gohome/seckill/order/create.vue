<template>
	<div id="seckill-order-create">
		<public-header title="确认订单"></public-header>
		<div class="content ">
			<div class="content-scroll">
				<div class="delivery-info margin-10-b bg-default radius-3">
					<ul class="delivery-mode" v-if="0">
						<li class="delivery">快递配送</li>
						<li class="self active">到店核销</li>
					</ul>
					<div class="padding-15-lr" v-if="0">
						<div class="padding-15-tb flex-lr">
							<div class="flex">
								<i class="icon icon-locationfill font-20"></i>
								<ul class=" padding-10-l">
									<li class="font-14">山西省太原市小店区坞城街道南中环北张小区B2-401</li>
									<li class="c-gray font-12 margin-5-t">李四（先生） 121345678910</li>
								</ul>
							</div>
							<van-icon name="arrow" class="c-gray margin-10-l"></van-icon>
						</div>
						<div class="padding-15-tb flex-lr van-hairline--top">
							<div class="flex">
								<i class="icon icon-timefill font-18"></i>
								<span class="padding-10-l font-14">立即送出</span>
							</div>
							<div class="flex">
								<span class="font-14 c-info">预计16:30送达</span>
								<van-icon name="arrow" class="c-gray"></van-icon>
							</div>
						</div>
					</div>
					<div v-else>
						<div class="padding-15-lr padding-15-t font-18 font-bold">到店核销</div>
						<div class="padding-15-tb margin-15-lr van-hairline--bottom text-center">
							<p class="font-14 c-gray">商家地址</p>
							<p class="margin-10-tb">{{goods.store.address}}</p>
							<span class="font-14 c-danger" @click="util.jsLocation({lat: goods.store.location_x, lng: goods.store.location_y});" v-if="goods.store">查看地图</span>
						</div>
						<ul class="username-mobile flex-lr font-13 padding-15-tb margin-15-lr">
							<li class="van-hairline--right">
								<div class="margin-10-b">姓名</div>
								<input v-model="username" class="w-100" type="text" placeholder="请输入姓名">
							</li>
							<li class="padding-10-l">
								<div class="margin-10-b">手机号</div>
								<input class="w-100" v-model="mobile" type="text" placeholder="请输入手机号">
							</li>
						</ul>
					</div>
				</div>
				<div class="order-info">
					<div class="flex">
						<i class="icon icon-store font-18"></i>
						<span class="font-14 margin-10-l font-500">{{goods.store.title}}</span>
					</div>
					<div class="padding-15-tb goods flex-lr van-hairline--bottom">
						<div class="thumb">
							<img class="img-100" :src="goods.thumb" alt="">
						</div>
						<div class="info">
							<p>{{goods.name}}</p>
							<div class="flex">
								<div class="c-danger font-16 font-bold">¥{{goods.price}}</div>
								<div class="c-gray font-12 line-through margin-5-l">¥{{goods.oldprice}}</div>
							</div>
						</div>
					</div>
					<div class="van-hairline--bottom padding-15-b font-13">
						<div class="margin-15-t flex-lr">
							<span>数量</span>
							<van-stepper v-model="goodsNum" :min="1" :max="goods.total" />
						</div>
						<div class="margin-15-t flex-lr">
							<span>总价</span>
							<span class="c-danger">¥{{totalPrice}}</span>
						</div>
					</div>
					<div class="van-hairline--bottom padding-15-b font-13" v-if="0">
						<div class="margin-15-t flex-lr">
							<span>包装费</span>
							<span>¥2</span>
						</div>
						<div class="margin-15-t flex-lr">
							<span>配送费</span>
							<span>¥2</span>
						</div>
					</div>
					<div class="padding-15-tb flex-lr van-hairline--bottom font-13" v-if="0">
						<div class="c-danger">新客立减</div>
						<div class="c-danger">-¥2</div>
					</div>
					<div class="padding-15-b van-hairline--bottom font-13" v-if="0">
						<div class="margin-15-t flex-lr">
							<span>代金券</span>
							<div class="flex">
								<span class="c-gray">暂无可用代金券</span>
								<van-icon name="arrow" class="c-gray"></van-icon>
							</div>
						</div>
						<div class="margin-15-t flex-lr">
							<span>红包</span>
							<div class="flex">
								<span class="c-danger">通用红包3元</span>
								<van-icon name="arrow" class="c-gray"></van-icon>
							</div>
						</div>
					</div>
					<div class="padding-15-t total-price">
						<div class="margin-15-l">
							<span>小计</span> <span class="c-danger font-16 font-500">¥{{totalPrice}}</span>
						</div>
					</div>
				</div>
				<van-field
						v-model="buyremark"
						label="备注"
						type="textarea"
						placeholder="口味, 偏好等要求"
						rows="3"
						class="margin-10-t"
				/>
			</div>
		</div>
		<van-submit-bar :price="totalPrice1" label="待支付" button-text="提交订单" @submit="onSubmit" :disabled="!islegal"></van-submit-bar>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
		},
		data() {
			return {
				goods_id: 0,
				goods: {
					name: '',
					thumb: '',
					endtime: 0,
					store: {},
					is_favor: false,
					buy_note: '',
					description: '',
					total_looknum: 0,
					total_sharenum: 0,
					slides: [],
					price: 0,
				},
				goodsNum: 1,
				username: '',
				mobile: '',
				buyremark: '',
				showPreLoading: true,
				islegal: false,
			}
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'seckill/order/create',
					data: {
						goods_id: that.goods_id,
					},
					autoAssign: true,
					variable: 'goods',
					success: (res) => {
						that.islegal = true;
						that.username = res.member.username;
						that.mobile = res.member.mobile;
					}
				})
			},
			onSubmit() {
				var that = this;
				if(!that.username) {
					that.util.$toast('请输入核销人姓名');
					return;
				}
				if(!that.mobile) {
					that.util.$toast('请输入预留手机号');
					return;
				}
				if(!that.util.isValidMobile(that.mobile)) {
					that.util.$toast('手机号格式错误');
					return;
				}
				setData({
					vue: that,
					url: 'seckill/order/create',
					data: {
						goods_id: that.goods_id,
						buyremark: that.buyremark,
						username: that.username,
						mobile: that.mobile,
						goods_num: that.goodsNum,
					},
					message: '下单成功',
					success: (res) => {
						let order_id = res;
						that.util.$toast('下单成功', that.util.getUrl({path: '/pages/public/pay', query: {order_id: order_id, order_type: 'gohome'}}), 1500, 'replace');
					}
				})
			}
		},
		mounted() {
			if(this.$route.query && this.$route.query.goods_id) {
				this.goods_id = this.$route.query.goods_id;
			}
			this.onLoad();
		},
		computed: {
			totalPrice: function() {
				var that = this;
				let totalPrice = that.goods.price * that.goodsNum;
				totalPrice = totalPrice.toFixed(2)
				return totalPrice;
			},
			totalPrice1: function() {
				var that = this;
				let totalPrice1 = that.goods.price * that.goodsNum * 100;
				totalPrice1 = parseFloat(totalPrice1.toFixed(2));
				return totalPrice1;
			}
		}
	}
</script>

<style>

	#seckill-order-create .content{
		width: 100%;
		box-sizing: border-box;
		padding: 10px;
		bottom: 50px;
		overflow: hidden;
		background-color: #f5f5f5;
	}
	#seckill-order-create .content .content-scroll{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow-y: auto;
		overflow-x: hidden;
	}
	#seckill-order-create .content .content-scroll::-webkit-scrollbar {
		display: none;
	}
	#seckill-order-create .username-mobile li{
		width: 49.9%;
	}
	#seckill-order-create .order-benefit{
		height: 50px;
		line-height: 50px;
		font-size: 14px;
		padding-left: 15px;
	}
	#seckill-order-create .order-info{
		background-color: #fff;
		padding: 15px;
		border-radius: 3px;
		font-size: 14px;
	}
	#seckill-order-create .order-info .goods .thumb{
		width: 60px;
		height: 60px;
		border-radius: 3px;
		overflow: hidden;
		font-size: 0px;
	}
	#seckill-order-create .order-info .goods .info{
		height: 60px;
		font-size: 14px;
		flex: 1;
		padding-left: 10px;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
	}
	#seckill-order-create .order-info .van-stepper .van-stepper__minus, #seckill-order-create .order-info .van-stepper .van-stepper__plus{
		width: 24px;
		height: 20px;
	}
	#seckill-order-create .order-info .van-stepper .van-stepper__input{
		height: 16px;
		width: 24px;
	}
	#seckill-order-create .order-info .total-price{
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
	}
	#seckill-order-create .delivery-mode{
		background-color: #f5f5f5;
		display: flex;
		flex-flow: row nowrap;
		align-items: flex-end;
		justify-content: center;
	}
	#seckill-order-create .delivery-mode li{
		width: 50%;
		padding: 12px 0;
		text-align: center;
		position: relative;
		font-size: 15px;
		background-color: #eee;
	}
	#seckill-order-create .delivery-mode .delivery.active{
		background-color: #fff;
		color: #ff2d4b;
		padding: 18px 0 12px 0;
	}
	#seckill-order-create .delivery-mode .delivery.active:after{
		content: '';
		position: absolute;
		z-index: 10;
		top: 0;
		bottom: 0;
		right: -20px;
		width: 0;
		height: 0;
		border-width:0 20px 47px 0;
		border-style:solid;
		border-color:transparent  transparent #fff transparent;
	}
	#seckill-order-create .delivery-mode .self.active{
		background-color: #fff;
		color: #ff2d4b;
		padding: 18px 0 12px 0;
	}
	#seckill-order-create .delivery-mode .self.active:after{
		content: '';
		position: absolute;
		z-index: 10;
		top: 0;
		bottom: 0;
		left: -20px;
		width: 0;
		height: 0;
		border-width: 47px 20px  0 0;
		border-style:solid;
		border-color:  transparent #fff transparent transparent;
	}
	#seckill-order-create .store-address .van-icon{
		line-height: 48px;
	}
	#seckill-order-create .store-address .van-icon-locationfill,#seckill-order-create .van-icon-mobilefill{
		font-size: 16px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/seckill/order/create.vue