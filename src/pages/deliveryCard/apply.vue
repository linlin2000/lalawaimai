<template>
	<div id="deliveryCard-apply">
		<public-header title="购买配送会员卡"></public-header>
		<div class="content">
			<div class="block-title van-hairline--bottom">会员选择</div>
			<div class="row setmeal-list">
				<div class="col-33 setmeal-item " :class="{'active' : num == index}" v-for="(item, index) in cards" @click="onChooseCard(index)" :key="item">
					<span class="money">{{item.price}}元</span>
					<span class="name">{{item.title}}</span>
				</div>
			</div>
			<div class="block-info">
				<div class="van-hairline--top">当前选择会员有效期为<span>{{card.starttime}}</span>至<span id="setmeal-endtime">{{card.endtime}}</span></div>
			</div>
			<div class="list-block">
				<van-cell-group>
					<van-cell>
						<template slot="title">
							<span class="item-icon"></span>
							<span class="item-text">仅支持平台配送商户使用</span>
						</template>
					</van-cell>
					<van-cell>
						<template slot="title">
							<span class="item-icon"></span>
							<span class="item-text">下单配送费直接扣除</span>
						</template>
					</van-cell>
					<van-cell>
						<template slot="title">
							<span class="item-icon"></span>
							<span class="item-text" v-if="card.day_free_limit > 0">每日仅限{{card.day_free_limit}}单享受特权</span>
							<span class="item-text" v-else>每日不限次享受特权</span>
						</template>
					</van-cell>
					<van-cell>
						<template slot="title">
							<span class="item-icon"></span>
							<span class="item-text" v-if="card.delivery_fee_free_limit > 0">每单最高减免配送费{{card.delivery_fee_free_limit}}元</span>
							<span class="item-text" v-else>每单配送费全免</span>
						</template>
					</van-cell>
				</van-cell-group>
			</div>
		</div>
		<div class="cart">
			<div>￥ <span id="cart-money">{{card.price}}</span></div>
			<span id="cart-submit" @click='onSubmit'>去支付</span>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		data() {
			return {
				paytype: 'alipay',
				card: {},
				cards: [],
				num: 0
			}
		},
		components: {
			PublicHeader,
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'deliveryCard/apply/index',
				}).then((res) => {
					let result = res.data.message.message;
					this.cards = result
					this.card = result[0];
				})
			},
			onChooseCard(index) {
				this.card = this.cards[index];
				this.num = index;
			},
			onSubmit() {
				this.util.request({
					url: 'deliveryCard/apply/pay1',
					data: {
						setmeal_id: this.card.id,
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return false;
					}
					var orderId = result.message;
					this.$router.replace(this.util.getUrl({path: '/pages/public/pay?order_id=' + orderId + '&order_type=deliveryCard'}));
				})
			}

		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#deliveryCard-apply .content{
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 44px;
		background: #f5f5f5;
	}
	#deliveryCard-apply .block-title{
	    min-height: 44px;
	    background: #fff;
	    line-height: 44px;
	    padding: 0 15px;
	}
	#deliveryCard-apply .row{
		margin-left: -4%;
	}
	#deliveryCard-apply .row .col-33{
	    width: 28.7%;
	    margin-left: 4%;
	    float: left;
	}
	#deliveryCard-apply .setmeal-list{
		overflow: hidden;
	    background: #fff;
	    padding: 15px;
	    padding-bottom: 0;
	}
	#deliveryCard-apply .setmeal-list .setmeal-item{
		height: 58px;
	    margin-bottom: 15px;
	    padding: 10px 0;
	    text-align: center;
	    border-radius: 3px;
	    border: 1px solid #e7e7e7;
	}
	#deliveryCard-apply .setmeal-list .setmeal-item.active{
	    border-color: #ff2d4b;
    	color: #ff2d4b;
	}
	#deliveryCard-apply .setmeal-list .setmeal-item .money{
	    display: inline-block;
    	width: 100%;
	}
	#deliveryCard-apply .setmeal-list .setmeal-item .name{
		display: inline-block;
	    width: 100%;
	    font-size: 14px;
	    line-height: 30px;
	}
	#deliveryCard-apply .block-info{
		background: #FFF;
	}
	#deliveryCard-apply .block-info div{
	    margin: 0 0 0 15px;
	    padding: 10px 15px;
	    padding-left: 0;
	    color: #aaa;
	    font-size: 14px;
	    line-height: 41px;
	}
	#deliveryCard-apply .block-info div span{
	    color: #ff2d4b;
	}
	#deliveryCard-apply .list-block{
		margin: 10px 0;
	}
	#deliveryCard-apply .list-block .item-icon{
	    width: 8px;
	    height: 8px;
	    border-radius: 3px;
	    display: inline-block;
	    zoom: 1;
	    background: #ececec;
	    margin-right: 5px;
	}
	#deliveryCard-apply .list-block .item-text{
		color: #aaa;
	}
	#deliveryCard-apply .list-block .van-icon-checked{
		color: #fff;
		background: #FF2D4B;
	    position: relative;
	    width: 20px;
	    height: 20px;
	    line-height: 22px;
	    border-radius: 20px;
	    font-size: 14px;
	    text-align: center;
	}
	#deliveryCard-apply .list-block .van-icon-check{
		color: #fff;
	    position: relative;
	    width: 20px;
	    height: 20px;
	    line-height: 22px;
	    border: 1px solid #c7c7cc;
	    border-radius: 20px;
	    font-size: 14px;
	    text-align: center;
	}
	#deliveryCard-apply .cart{
		position: absolute;
	    height: 50px;
	    line-height: 50px;
	    bottom: 0;
	    background: #fff;
	    right: 0;
	    left: 0;
	    color: #ff2d4b;
	    padding: 0 15px;
	    z-index: 10000;
	}
	#deliveryCard-apply .cart #cart-submit{
	    display: block;
	    position: absolute;
	    right: 0;
	    width: 100px;
	    top: 0;
	    bottom: 0;
	    background: #ff2d4b;
	    color: #fff;
	    text-align: center;
	}
	#deliveryCard-apply .cart #cart-money{
		font-weight: normal;
	}
</style>


// WEBPACK FOOTER //
// src/pages/deliveryCard/apply.vue