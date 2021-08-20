<template>
	<div id="mealmealRedpacketet-index">
		<public-header title="套餐红包Plus"></public-header>
		<div class="content" v-if="sid > 0">
			<div class="meal-container">
				<div class="top">
					<div class="name">选择套餐红包</div>
					<div class="tip">
						提示信息
						<span>{{mealRedpacket.placeholder}}</span>
					</div>
				</div>
				<div class="meal-item" v-for="(item, index, key) in mealRedpacket.redpackets" :key="index">
					<div class="item-container" @click='selectmealRedpacketet(index,item.price,item.old_price)' :class="{active: index == select}">
						<div class="left">{{item.name}}</div>
						<div class="right">
							<span class="old-price">¥<span>{{item.old_price}}</span></span>
							<span class="price">¥<span>{{item.price}}</span></span>
						</div>
					</div>
				</div>
			</div>
			<div class="mealRedpacketet-wrap" v-for="(packets, index, key) in mealRedpacket.redpackets" v-if="index == select">
				<div class="mealRedpacketet-wrap-title ">{{packets.name}}红包套餐内容</div>
				<div class="mealRedpacketet-item" v-for="(mealRedpacketet,index) in packets.data">
					<div class="mealRedpacketet-item-body">
						<div class="item-body-price">
							￥
							<span class="body-price-number"><strong>{{mealRedpacketet.discount}}</strong></span>
						</div>
						<div class="item-body-name">
							<div class="name-general">{{mealRedpacketet.name}}</div>
							<div class="name-reduction">满{{mealRedpacketet.condition}}元可用</div>
						</div>
					</div>
				</div>
			</div>
			<router-link :to="util.getUrl({path: '/package/pages/mealRedpacket/orderplus'})" class="buy-record van-hairline--top van-hairline--bottom">
				购买记录
				<van-icon name='right'></van-icon>
			</router-link>
			<div class="meal-explain" @click="onToggleAgreement()">
				套餐规则
				<van-icon name='question'></van-icon>
			</div>
			<div class="submit-container">
				<div class="final-price">
					<div class="text">总价</div>
					<div class="price">￥<span>{{price}}</span></div>
					<div class="old-price">￥<span>{{old_price}}</span></div>
				</div>
				<div class="submit-button " :class="{disabled: !islegal}" @click="onSubmit()">立即购买</div>
			</div>
		</div>
		<iloading v-show="preLoading"></iloading>
		<agreement title="套餐规则" :show="showAgreement" :content="agreementContent" @agreementHide="onToggleAgreement()"></agreement>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import agreement from '@/components/agreement'
	export default {
		components: {
			PublicHeader,
			agreement
		},
		data() {
			return {
				preLoading: true,
				sid: 0,
				mealRedpacket: {},
				select: 0,
				price: 0,
				old_price: 0,
				islegal: false,
				showAgreement: false,
				agreementContent: ''
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'mealRedpacket/plus'
				}).then((res) => {
					this.preLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return;
					}
					if(result.message == false) {
						this.util.$toast('暂无套餐红包Plus活动');
						return false;
					}
					this.mealRedpacket = result.message.data;
					this.sid = result.message.id;
					this.agreementContent = result.message.data.rules;
					var redpackets = result.message.data.redpackets;
					for(var x in redpackets) {
						this.select = x;
						break;
					}
					this.price = redpackets[x].price;
					this.old_price = redpackets[x].old_price;
					this.islegal = true;
				})
			},
			selectmealRedpacketet(index,price,old_price) {
				this.select = index;
				this.price = price;
				this.old_price = old_price;
			},
			onToggleAgreement() {
				this.showAgreement = !this.showAgreement;
			},
			onSubmit() {
				if(!this.islegal) {
					return false;
				}
				this.islegal = false;
				if(!this.select) {
					this.util.$toast('请选择套餐');
					return false;
				}
				var params = {
					sid: this.sid,
					meal_id: this.select,
					final_fee: this.mealRedpacket.redpackets[this.select].price,
				}
				this.util.request({
					url: 'mealRedpacket/plus/submit',
					data: params
				}).then((res) => {
					var result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return;
					}
					var order_id = result.message;
					this.$router.replace(this.util.getUrl({path: '/pages/public/pay?order_id=' + order_id + '&order_type=mealRedpacket_plus'}));
				})
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#mealmealRedpacketet-index .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		bottom: 50px;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#mealmealRedpacketet-index .content::-webkit-scrollbar {
		display: none;
	}
	#mealmealRedpacketet-index .van-nav-bar{
		background-color: #ff2d4b!important;
		color: #fff!important;
	}
	#mealmealRedpacketet-index .van-hairline--bottom .van-icon-left{
		color: #fff!important;
	}
	#mealmealRedpacketet-index .content .meal-container{
		width: 100%;
		background-color: #fff;
		box-sizing: border-box;
		padding: 20px 15px;
	}
	#mealmealRedpacketet-index .content .meal-container .top{
		margin-bottom: 10px;
	}
	#mealmealRedpacketet-index .content .meal-container .top .name{
		font-size: 16px;
		color: #3F3F3F;
		height: 26px;
		line-height: 26px;
	}
	#mealmealRedpacketet-index .content .meal-container .top .tip{
		font-size: 12px;
		color: #7B7B79;
		max-width: 100%;
		line-height: 18px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	#mealmealRedpacketet-index .content .meal-container .top .tip span{
		color: #FF5D43;
	}
	#mealmealRedpacketet-index .content .meal-container .meal-item{
		width: 100%;
		margin-bottom: 10px;
	}
	#mealmealRedpacketet-index .content .meal-container .meal-item:last-child{
		margin-bottom: 0;
	}
	#mealmealRedpacketet-index .content .meal-container .meal-item .item-container.active{
		background-color: #FFFDEF;
		border: 2px solid #E9D8A8;
	}
	#mealmealRedpacketet-index .content .meal-container .meal-item .item-container{
		border: 2px solid #ddd;
		padding: 15px;
		min-height: 25px;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
	}
	#mealmealRedpacketet-index .content .meal-container .meal-item .item-container .left{
		width: 70%;
		overflow: hidden;
		color: #333;
		font-size: 14px;
		font-weight: bold;
	}
	#mealmealRedpacketet-index .content .meal-container .meal-item .item-container .right{
		width: 30%;
		text-align: right;
	}
	#mealmealRedpacketet-index .content .meal-container .meal-item .item-container .right .old-price{
		color: #B4B3B0;
		font-size: 12px;
		text-decoration: line-through;
	}
	#mealmealRedpacketet-index .content .meal-container .meal-item .item-container .right .price{
		color: #FF5338;
		font-size: 14px;
		font-weight: 600;
	}
	#mealmealRedpacketet-index .content .meal-container .meal-item .item-container .right .price span{
		font-weight: 600;
	}
	#mealmealRedpacketet-index .content .mealRedpacketet-wrap{
		height: auto;
		background: #fff;
		padding: 20px 4px;
		overflow: hidden;
		padding-top: 0;
	}
	#mealmealRedpacketet-index .content .mealRedpacketet-wrap .mealRedpacketet-wrap-title{
		font-size: 16px;
		color: #3f3f3f;
		padding: 0 11px;
		margin-bottom: 10px;
		line-height: 24px;
	}
	#mealmealRedpacketet-index .content .mealRedpacketet-wrap .mealRedpacketet-item{
		width: 46%;
		background: #fff7e7;
		float: left;
		border-radius: 3px;
		margin-bottom: 10px;
		margin-left: 10px;
		overflow: hidden;
		padding: 10px;
	}
	#mealmealRedpacketet-index .content .mealRedpacketet-wrap .mealRedpacketet-item .mealRedpacketet-item-body{
		overflow: hidden;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
	}
	#mealmealRedpacketet-index .content .mealRedpacketet-wrap .mealRedpacketet-item .mealRedpacketet-item-body .item-body-price{
		width: 48%;
		color: #fb5227;
		text-align: left;
		white-space: nowrap;
	}
	#mealmealRedpacketet-index .content .mealRedpacketet-wrap .mealRedpacketet-item .mealRedpacketet-item-body .item-body-price .body-price-number{
		font-size: 38px;
	}
	#mealmealRedpacketet-index .content .mealRedpacketet-wrap .mealRedpacketet-item .mealRedpacketet-item-body .item-body-price .body-price-number strong{
		font-weight: 700;
	}
	#mealmealRedpacketet-index .content .mealRedpacketet-wrap .mealRedpacketet-item .mealRedpacketet-item-body .item-body-name{
		width: 50%;
		text-align: left;
		height: 52px;
	}
	#mealmealRedpacketet-index .content .mealRedpacketet-wrap .mealRedpacketet-item .mealRedpacketet-item-body .item-body-name .name-general{
		height: 26px;
		font-size: 16px;
		line-height: 26px;
		color: #000;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	#mealmealRedpacketet-index .content .mealRedpacketet-wrap .mealRedpacketet-item .mealRedpacketet-item-body .item-body-name .name-reduction{
		display: inline-block;
		height: 26px;
		line-height: 26px;
		font-size: 14px;
		color: #bf9a42;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	#mealmealRedpacketet-index .content .meal-explain{
		display: block;
		width: 100%;
		font-size: 12px;
		color: #717171;
		text-align: center;
		margin-top: 20px;
		overflow: hidden;
		margin-bottom: 20px;
	}
	#mealmealRedpacketet-index .content .meal-explain .van-icon{
		display: inline-block;
		border: 0.1px solid #717171;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		text-align: center;
		line-height: 12px;
		margin-left: 3px;
	}
	#mealmealRedpacketet-index .content .submit-container{
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 50px;
		box-sizing: border-box;
		padding-left: 15px;
		line-height: 50px;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
		background: #3A3635;
		color: #fff;
	}
	#mealmealRedpacketet-index .content .submit-container .final-price{
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
	}
	#mealmealRedpacketet-index .content .submit-container .final-price .text{
		font-size: 16px;
	}
	#mealmealRedpacketet-index .content .submit-container .final-price .price{
		font-size: 16px;
		color: #FF5338;
		margin: 0 5px;
	}
	#mealmealRedpacketet-index .content .submit-container .final-price .price span{
		margin-left: -3px;
	}
	#mealmealRedpacketet-index .content .submit-container .final-price .old-price{
		color: #B4B3B0;
		font-size: 14px;
		text-decoration: line-through;
	}
	#mealmealRedpacketet-index .content .submit-container .final-price .old-price span{
		margin-left: -3px;
	}
	#mealmealRedpacketet-index .content .submit-container .submit-button{
		display: block;
		padding: 0 10px;
		min-width: 80px;
		height: 100%;
		text-align: center;
		font-size: 18px;
		color: #fff;
		background-color: #ff2d4b;
	}
	#mealmealRedpacketet-index .content .submit-container .submit-button.disabled{
		background-color: #ccc;
	}
	#mealmealRedpacketet-index .content .buy-record{
		display: block;
		padding: 10px 15px;
		font-size: 14px;
		color: #3F3F3F;
		line-height: 26px;
		overflow: hidden;
		background: #fff;
	}
	#mealmealRedpacketet-index .content .buy-record .van-icon-right{
		float: right;
		font-size: 14px;
		line-height: 26px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/mealRedpacket/plus.vue