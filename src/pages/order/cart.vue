<template>
	<div id="order-cart">
		<public-header title="购物车"></public-header>
		<div class="content">
			<van-list v-model="list.loading" :finished="list.finished" @load="onLoad" :offset="100" :immediate-check="true" v-if="!list.empty">
				<div class="cart-item" v-for="(item, index) in list.data" :key="item">
					<div class="header">
						<router-link tag="div" class="store-info" :to="util.getUrl({path: '/pages/store/goods', query: {sid: item.sid}})">
							<div class="avatar">
								<img :src="item.logo">
							</div>
							<div class="store-title">{{item.storeName}}</div>
							<div class='icon icon-xiangyou1'></div>
						</router-link>
						<div class="btn-delete" v-if="item.is_rest == 0">
							<div class='icon icon-delete' @click="onTurncateCart(item.sid, index)"></div>
						</div>
						<div class="rest" v-else>休息中</div>
					</div>
					<div class="activity-box" v-if="item.activity">
						<span>促销</span> {{item.activity}}
					</div>
					<div class="food-list">
						<template v-for="goods of item.cart.data">
							<div class="food-item clearfix" v-for="goodsitem in goods" v-if="goodsitem.goods_id != '88888'">
								<div class="avatar">
									<img :src="goodsitem.thumb">
								</div>
								<div class="food-block">
									<div class="food-name flex">
										<div class='icon-b' v-if="goodsitem.discount_num">
											<img src="static/img/discount_b.png">
										</div>
										<span>{{goodsitem.title}}</span>
									</div>
									<div class="info-group">
										<div class="num">x{{goodsitem.num}}</div>
										<div class="right">
											<div class="old-price" v-if="goodsitem.discount_num">¥{{goodsitem.total_price}}</div>
											<div class="price">¥{{goodsitem.total_discount_price}}</div>
										</div>
									</div>
								</div>
							</div>
						</template>
					</div>
					<div class="discount-box clearfix" v-if="item.cart.box_price > 0">
						<div class='discount-item'>
							<div class="name">包装费</div>
							<div class="price">¥{{item.cart.box_price}}</div>
						</div>
					</div>
					<div class="discount-box clearfix" v-if="item.discounts.list">
						<div class='discount-item' v-for="discount in item.discounts.list">
							<div class="name">{{discount.name}}</div>
							<div class="price c-danger">{{discount.text}}</div>
						</div>
					</div>
					<div class="footer-group border-1px-t">
						<template v-if="item.send_limit <= 0">
							<div class="discount" v-if="item.discounts.total > 0">
								已优惠{{item.discounts.total}}元
							</div>
						</template>
						<div class="discount" v-else>
							还差{{item.send_limit}}元起送
						</div>
						<div class="pay-fee">
							¥{{item.final_fee}}
						</div>
						<router-link tag="div" :to="util.getUrl({path: '/pages/order/create?sid=' + item.sid})" v-if="item.send_limit <= 0 && item.cart.is_category_limit == 0">
							<div class="button">
								去结算
							</div>
						</router-link>
						<router-link tag="div" :to="util.getUrl({path: '/pages/store/goods?sid=' + item.sid})" v-else>
							<div class="button button-danger">
								去凑单
							</div>
						</router-link>
					</div>
					<div class="mask" v-if="item.is_rest == 1"></div>
				</div>
			</van-list>
			<div class='no-data' v-else>
				<img class='no-cart' src='static/img/cart_con.png'>
				<span class='no-record'>您还没有添加购物车，快去购买吧</span>
				<router-link tag="div" to='/' class="target">现在去购物</router-link>
			</div>
		</div>
		<transition name="loading">
			<iloading v-if="preLoading"></iloading>
		</transition>
	</div>

</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		components: {
			PublicHeader,
		},
		data() {
			return {
				list: {
					finished: false,
					loading: false,
					min: 0,
					empty: false,
					data: []
				},
				preLoading: true
			}
		},
		methods: {
			onLoad() {
				if(this.list.finished) {
					return false;
				}
				this.util.request({
					url: 'wmall/order/cart/index',
					data: {
						min: this.list.min,
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message)
						return;
					}
					if(result.cartsInfo){
						this.list.data = [...this.list.data, ...result.cartsInfo];
					}
					if(!this.list.data.length) {
						this.list.empty = true;
					}
					this.list.loading = false;
					this.list.min = result.min;
					if((result.cartsInfo && result.cartsInfo.length < 10) || !result.min) {
						this.list.finished = true;
					}
					this.preLoading = false;
				})
			},
			onTurncateCart(sid, index) {
				var sid = sid;
				var index = index;
				this.$dialog.confirm({
					title: '确定删除所选商品吗?'
				}).then(() => {
					this.util.request({
						url: 'wmall/order/cart/truncate',
						data: {
							sid: sid,
						}
					}).then((res) => {
						let result = res.data.message;
						if(result.errno) {
							this.$toast(result.message)
							return;
						}
						this.list.data.splice(index, 1);
						if(!this.list.data.length) {
							this.list.empty = true;
						}
					})
				}).catch(() => {

				})
			}
		},
		mounted() {

		}
	}
</script>

<style>
	#order-cart .content{
		position: absolute;
		top: 46px;
		left: 0;
		right: 0;
		bottom: 0;
		overflow-y: auto;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}
	#order-cart .content::-webkit-scrollbar{
		display: none;
	}
	#order-cart .content{
		padding-bottom: 10px;
	}
	#order-cart .content .cart-item{
		padding-left: 15px;
		background: #fff;
		margin-bottom: 10px;
		position: relative;
	}
	#order-cart .content .cart-item .mask{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(255, 255, 255, 0.7);
	}
	#order-cart .content .cart-item .header{
		padding-right: 15px;
		height: 40px;
		line-height: 40px;
		position: relative;
	}
	#order-cart .content .cart-item .header .store-info{
		max-width: 80%;
		display: inline-block;
	}
	#order-cart .content .cart-item .header .store-info .avatar{
		width: 26px;
		height: 26px;
		margin-top: 8px;
	}
	#order-cart .content .cart-item .header .store-info>div{
		float: left;
	}
	#order-cart .content .cart-item .header .store-info .avatar img{
		display:inline-block;
		width:100%;
		height:100%;
		border-radius:50%;
	}
	#order-cart .content .cart-item .header .store-info .store-title{
		font-size: 15px;
		font-weight: bold;
		margin-left: 10px;
		margin-right: 5px;
	}
	#order-cart .content .cart-item .header .btn-delete{
		float: right;
		position: relative;
	}
	#order-cart .content .cart-item .header .btn-delete .icon{
		font-size: 16px;
	}
	#order-cart .content .cart-item .header .rest{
		font-size: 12px;
		border: 1px solid #000;
		width: 50px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		position: absolute;
		top: 50%;
		right: 15px;
		transform: translate(0, -50%);
	}
	#order-cart .content .cart-item .activity-box{
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: 10px;
	}
	#order-cart .content .cart-item .activity-box text{
		color: #D45E74;
		border: 1px solid #D45E74;
		padding: 0px 4px;
		font-size: 13px;
	}
	#order-cart .content .cart-item .food-list{
		width: 100%;
	}
	#order-cart .content .cart-item .food-item{
		background-color: #F8F8F8;
		height: 75px;
		margin-bottom: 10px;
		margin-top: 10px;
		display: flex;
	}
	#order-cart .content .cart-item .food-item:first-child{
		margin-top: 3px;
	}
	#order-cart .content .cart-item .food-item .avatar{
		width: 60px;
		display: inline-block;
		height: 60px;
		margin: 8px 0;
		margin-left: 8px;
	}
	#order-cart .content .cart-item .food-item .avatar img{
		display: inline-block;
		width: 100%;
		height: 100%;
	}
	#order-cart .content .cart-item .food-item .food-block{
		margin: 7.5px 10px;
		width: 80%;
		position: relative;
	}
	#order-cart .content .cart-item .food-item .food-block .food-name{
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		align-items: center;
	}
	#order-cart .content .cart-item .food-block .food-name .icon-b{
		width: 16px;
		height: 16px;
		margin-right: 5px;
	}
	#order-cart .content .cart-item .food-block .food-name .icon-b img{
		width: 100%;
		height: 100%;
	}
	#order-cart .content .cart-item .food-block .info-group{
		font-size: 14px;
		position: absolute;
		width: 100%;
		bottom: 0;
		left: 0;
		right: 0;
		height: 20px;
	}
	#order-cart .content .cart-item .food-block .info-group .num{
		display: inline-block;
		font-size: 14px;
		color: #9A9A9A;
		height: 100%;
		line-height: 20px;
	}
	#order-cart .content .cart-item .food-block .info-group .right{
		float: right;
		text-align: right;

	}
	#order-cart .cart-item .food-block .info-group .right>div{
		display: inline-block;
	}
	#order-cart .cart-item .food-block .info-group .right .old-price{
		margin-right: 5px;
		font-size: 12px;
		color: #9A9A9A;
		text-decoration: line-through;
	}
	#order-cart .cart-item .food-block .info-group .right .price{
		font-weight: bold;
		font-size: 16px;
	}
	#order-cart .cart-item .discount-box .discount-item{
		position: relative;
		height: 30px;
		line-height: 30px;
	}
	#order-cart .cart-item .discount-box .name{
		display: inline-block;
		font-size: 14px;
		position: absolute;
		left: 0;
		top: 50%;
		transform: translate(0, -50%);
	}
	#order-cart .cart-item .discount-box .price{
		position: absolute;
		right: 15px;
		top: 50%;
		transform: translate(0,-50%);
		font-size: 14px;
	}
	#order-cart .cart-item .footer-group{
		font-size: 14px;
		position: relative;
		display: flex;
		height: 50px;
		align-items:center;
	}
	#order-cart .cart-item .footer-group .discount{
		display: inline-block;
	}
	#order-cart .cart-item .footer-group .pay-fee{
		display: inline-block;
		position: absolute;
		top: 50%;
		right: 106px;
		transform: translate(0,-50%);
		font-size: 16px;
		font-weight: bold;
		color: #FB4D43;
	}
	#order-cart .footer-group .button{
		position: absolute;
		right: 15px;
		top: 50%;
		transform: translate(0,-50%);
		background: #FF2D4B;
		color: #fff;
		width: 80px;
		height: 35px;
		line-height: 35px;
		text-align: center;
		border-radius: 1px;
	}
	#order-cart .footer-group .button.button-danger{
		background: #EF4F4F;
		color: #fff;
	}
	#order-cart .no-data img{
		width:100px;
		height:100px;
		position:absolute;
		left:50%;
		top:150px;
		transform:translate(-50%,0);
	}
	#order-cart .no-data .target{
		position: absolute;
		left: 50%;
		top: 300px;
		transform: translate(-50%,0);
		font-size: 14px;
		background-color: #FF2D4B;
		color: #fff;
		padding: 8px 15px;
		border-radius: 15px;
	}
	#order-cart .no-data .no-record {
		position:absolute;
		left:50%;
		top:260px;
		transform:translate(-50%,0);
		font-size:16px;
		color:#656565;
		width:100%;
		text-align:center;
	}

</style>



// WEBPACK FOOTER //
// src/pages/order/cart.vue
