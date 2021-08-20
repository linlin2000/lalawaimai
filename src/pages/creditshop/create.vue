<template>
	<div id="creditshop-create">
		<public-header title="订单确认"></public-header>
		<div class="content">
			<div class="goods-info">
				<div class="flex">
					<span class="font-14 font-500">商品信息</span>
				</div>
				<div class="padding-15-tb goods flex-lr van-hairline--bottom">
					<div class="thumb">
						<img class="img-100" :src="goods.thumb" alt="">
					</div>
					<div class="info">
						<p>{{goods.title}}</p>
						<div class="flex">
							<div class="c-danger font-16 font-bold">¥{{goods.use_credit2}}</div>
							<div class="c-gray font-12 line-through margin-5-l">¥{{goods.old_price}}</div>
						</div>
					</div>
				</div>
				<div class="padding-15-t total-price">
					<div class="margin-15-l">
						<span>小计</span><span class="c-danger font-16 font-500">
							{{goods.use_credit1}}酒币
							<template v-if="goods.use_credit2 > 0">
								+ {{goods.use_credit2}}元
							</template>
						</span>
					</div>
				</div>
			</div>
			<div class="margin-10" v-if="goods.type == 'goods'">
				<van-field
					v-model.trim="username"
					label="姓名"
					type="text"
					placeholder="请输入您的名字"
					input-align="right"
				/>
				<van-field
					v-model.number="mobile"
					label="联系方式"
					type="text"
					placeholder="请输入您的联系方式"
					input-align="right"
				/>
			</div>
		</div>
		<van-submit-bar :disabled="!islegal" button-text="提交订单" @submit="onSubmit">
			<div slot="default" class="order-total-field">
				待支付
				<div class="order-total">
					{{goods.use_credit1}}酒币
					<template v-if="goods.use_credit2 > 0">
						+ ¥{{goods.use_credit2}}
					</template>
				</div>
			</div>
		</van-submit-bar>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		data() {
			return {
				goods_id: Number,
				goods: {},
				islegal: false,
				username: '',
				mobile: '',
			}
		},
		components: {
			PublicHeader,
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'creditshop/order/create',
					data: {
						goods_id: this.goods_id
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					this.goods = result.message
					this.islegal = true;
				})
			},
			onSubmit() {
				if(this.goods.type == 'goods') {
					if(!this.username) {
						this.util.$toast('请输入姓名');
						return false;
					}
					if(!this.mobile) {
						this.util.$toast('请输入联系方式');
						return false;
					}
				}
				if(!this.islegal) {
					return false;
				}
				this.islegal = false;
				this.util.request({
					url: 'creditshop/order/submit',
					data: {
						goods_id: this.goods_id,
						username: this.username,
						mobile: this.mobile
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					let order_id = result.message.order_id;
					let redirect = result.message.redirect;
					var url = {path: '/pages/creditshop/detail', query: {id: order_id}};
					if(redirect == 'pay') {
						url = '/pages/public/pay?order_id=' + order_id + '&order_type=creditshop';
						this.util.jsUrl(url);
					} else {
						this.util.$toast('兑换成功', this.util.getUrl(url));
					}
				})
			}
		},
		created() {
			if(this.$route.query.goods_id) {
				this.goods_id = this.$route.query.goods_id;
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
	#creditshop-create .content{
		bottom: 50px;
	}
	#creditshop-create .order-total-field{
		margin-left:15px;
		height:50px;
		line-height:50px;
		color:#2f2f2f;
		font-size:16px;
		line-height: 50px;
	}
	#creditshop-create .order-total-field .order-total{
		display:inline-block;
		color:#F95339;
		font-size:14px;
		vertical-align:middle;
		margin-left:5px;
	}
	#creditshop-create .goods-info{
		background-color: #fff;
		padding: 15px;
		border-radius: 3px;
		font-size: 14px;
		margin: 10px;
	}
	#creditshop-create .goods-info .goods .thumb{
		width: 60px;
		height: 60px;
		border-radius: 3px;
		overflow: hidden;
		font-size: 0px;
	}
	#creditshop-create .goods-info .goods .info{
		height: 60px;
		font-size: 14px;
		flex: 1;
		padding-left: 10px;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
	}
	#creditshop-create .goods-info .van-stepper .van-stepper__minus, #seckill-order-create .order-info .van-stepper .van-stepper__plus{
		width: 24px;
		height: 20px;
	}
	#creditshop-create .goods-info .van-stepper .van-stepper__input{
		height: 16px;
		width: 24px;
	}
	#creditshop-create .goods-info .total-price{
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
	}
</style>


// WEBPACK FOOTER //
// src/pages/creditshop/create.vue