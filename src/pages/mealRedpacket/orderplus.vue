<template>
	<div id="mealRedpacket-order">
		<public-header title="套餐红包购买记录"></public-header>
		<div class="content">
			<van-list v-model="redpackorder.loading" :finished="redpackorder.loaded" v-if="!redpackorder.empty" @load="onLoad" :offset="100" :immediate-check="false">
				<div class="order-item van-hairline--bottom" v-for="item in redpackorder.data" :key="item.id">
					<div class="order-info">
						<div class="name-time">
							<div class="name">{{item.data.meal.name}}</div>
							<div class="time">{{item.addtime}}</div>
						</div>
						<div class="price">¥{{item.final_fee}}</div>
					</div>
				</div>
				<div class="loaded" v-if="redpackorder.loaded">
					<div class="loaded-tips">我是有底线的</div>
				</div>
			</van-list>
			<div class="common-no-con" v-else>
				<img src= "static/img/order_no_con.png" alt="" />
				<p>您还没有购买记录，赶紧购买吧！</p>
				<div class="btn">
					<router-link :to="util.getUrl({path: '/pages/mealRedpacket/plus'})">现在购买</router-link>
				</div>
			</div>
		</div>
		<iloading v-show="preLoading"></iloading>
	</div>	
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		components: {
			PublicHeader
		},
		data() {
			return {
				preLoading: true,
				redpackorder: {
					page: 1,
					psize: 15,
					loading: false,
					loaded: false,
					empty: false,
					data:[]
				}
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'mealRedpacket/plus/mealorder',
					data: {
						page: this.redpackorder.page,
						psize: this.redpackorder.psize,
					}
				}).then((res) => {
					this.preLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return;
					}
					this.redpackorder.data = [...this.redpackorder.data, ...result.message];
					this.redpackorder.loading = false;
					if(this.redpackorder.data.length == 0) {
						this.redpackorder.empty = true;
					}
					if(result.message.length < this.redpackorder.psize) {
						this.redpackorder.loaded = true;
					}
					this.redpackorder.page++;
				})
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#mealRedpacket-order .content{
		position: fixed;
		top: 44px;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #F3F2F2;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#mealRedpacket-order .content::-webkit-scrollbar {
		display: none;
	}
	#mealRedpacket-order .van-nav-bar{
		background-color: #ff2d4b!important;
		color: #fff!important;
	}
	#mealRedpacket-order .van-hairline--bottom .van-icon-left{
		color: #fff!important;
	}
	#mealRedpacket-order .content .order-item{
		width: 100%;
		box-sizing: border-box;
		background-color: #fff;
		padding: 12px;
	}
	#mealRedpacket-order .content .order-item .order-info{
		width: 100%;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
		font-size: 12px;
	}
	#mealRedpacket-order .content .order-item .order-info .name-time .name{
		line-height: 18px;
	}
	#mealRedpacket-order .content .order-item .order-info .name-time .time{
		color: #878787;
		line-height: 18px;
	}
	#mealRedpacket-order .content .order-item .order-info .price{
		color: #FF5338;
		font-size: 18px;
		line-height: 27px;
	}
	#mealRedpacket-order .content .common-no-con{
		position: absolute;
		top: 32%;
		left: 0;
		width: 100%;
		height: 200px;
		text-align: center;
		color: #768491;
		font-size: 16px;
	}
	#mealRedpacket-order .content .common-no-con img{
		max-width: 25%;
		vertical-align: middle;
		border: none;
	}
	#mealRedpacket-order .content .common-no-con p{
		margin: 20px 0;
		line-height: 24px;
	}
	#mealRedpacket-order .content .common-no-con .btn a{
		display: inline-block;
		height: 40px;
		line-height: 40px;
		color: #fff;
		background: #ff2d4b;
		padding: 0 20px;
		border-radius: 40px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/mealRedpacket/orderplus.vue