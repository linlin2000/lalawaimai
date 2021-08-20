<template>
	<div id="order-pindanbill">
		<div class="content">
			<div class="inner">
				<div class="store-logo">
					<img class="img-100" :src="order.store_logo" alt="">
				</div>
				<div class="store-title ellipsis font-16 text-center margin-10-t">{{order.store_title}}</div>
				<div class="text-center font-bold font-18 margin-10-t">*** 结账单：共付{{order.final_fee}}元 ***</div>
				<div class="c-gray font-14 text-center margin-10-t">已帮您计算好配送费和活动优惠咯~</div>
				<div class="divide">
					<div class="divide-line"></div>
				</div>
				<div class="user-list" v-if="order.data.pindan">
					<div class="user-item padding-10-lr margin-10-tb font-14" v-for="(pindanItem, index) in order.data.pindan" :key="index">
						<div class="flex-lr">
							<div class="avatar">
								<img class="img-100" :src="pindanItem.member.avatar" alt="">
							</div>
							<div class="flex-1 flex-lr padding-10-l">
								<div class="nickname font-bold ellipsis">{{pindanItem.member.nickname}}</div>
								<div>
									<span class="c-gray">需支付：</span>
									<span class="c-danger font-bold">¥{{pindanItem.pindan_fee}}</span>
								</div>
							</div>
						</div>
						<div class="goods-list c-gray">
							<template v-for="(goodsItem, index) in pindanItem.data">
								<van-row class="padding-10-t" v-for="(option, key) in goodsItem" :key="key">
									<van-col span="14" class="ellipsis">{{option.title}}</van-col>
									<van-col span="4" class="text-right">x{{option.num}}</van-col>
									<van-col span="6" class="text-right">¥{{option.total_discount_price}}</van-col>
								</van-row>
							</template>
							<van-row class="padding-10-t" v-if="pindanItem.box_price > 0">
								<van-col span="18" class="ellipsis">餐盒费</van-col>
								<van-col span="6" class="text-right">¥{{pindanItem.box_price}}</van-col>
							</van-row>
							<van-row class="padding-10-t" v-if="pindanItem.avg_pack_fee > 0">
								<van-col span="18" class="ellipsis">包装费</van-col>
								<van-col span="6" class="text-right">¥{{pindanItem.avg_pack_fee}}</van-col>
							</van-row>
							<van-row class="padding-10-t" v-if="pindanItem.avg_delivery_fee > 0">
								<van-col span="18" class="ellipsis">配送费</van-col>
								<van-col span="6" class="text-right">¥{{pindanItem.avg_delivery_fee}}</van-col>
							</van-row>
							<van-row class="padding-10-t" v-if="pindanItem.avg_extra_fee > 0">
								<van-col span="18" class="ellipsis">附加费</van-col>
								<van-col span="6" class="text-right">¥{{pindanItem.avg_extra_fee}}</van-col>
							</van-row>
							<van-row class="padding-10-t" v-if="pindanItem.avg_discount_fee > 0">
								<van-col span="18" class="ellipsis">活动优惠</van-col>
								<van-col span="6" class="text-right">-¥{{pindanItem.avg_discount_fee}}</van-col>
							</van-row>
						</div>
					</div>
				</div>
				<div class="plateform">
					<div class="flex-center">
						<div class="plateform-logo">
							<img :src="config.logo" alt="" class="img-100">
						</div>
						<span class="font-bold font-15">{{config.title}}</span>
					</div>
					<div class="c-gray ellipsis text-center font-14 margin-5-t" v-if="0">{{config.desc}}</div>
				</div>
			</div>
		</div>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import {getData} from "@/controller/funcCommon"
	export default {
		data() {
			return {
				showPreLoading: true,
				order: {},
				config: {}
			}
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'wmall/order/index/pindan_detail',
					data: {
						id: that.id
					},
					success: function(res) {
						that.order = res.order;
						that.config = res.config;
					}
				})
			},
		},
		created() {
			if(this.$route.query && this.$route.query.id > 0) {
				this.id = this.$route.query.id;
			}
		},
		mounted () {
			this.onLoad();
		}
	}
</script>

<style>
	#order-pindanbill .content{
		background-color: #ff2d4b;
		background: linear-gradient(to bottom, #ff2d4b, #FF9331);
	}
	#order-pindanbill .content .inner{
		position: relative;
		margin: 60px 10px 10px;
		background-color: #fff;
		border-radius: 3px;
		padding-top: 40px;
	}
	#order-pindanbill .store-logo{
		width: 80px;
		height: 80px;
		border-radius: 50%;
		overflow: hidden;
		position: absolute;
		left: 50%;
		transform: translate(-50%, -100%);
	}
	#order-pindanbill .store-logo img{
		border-radius: 50%;
	}
	#order-pindanbill .content .inner .divide::before,#order-pindanbill .content .inner .divide::after{
		background-color: #ff2d4b;
	}
	#order-pindanbill .user-item .avatar{
		width: 40px;
		height: 40px;
		border-radius: 50%;
		overflow: hidden;
	}
	#order-pindanbill .user-item .nickname{
		max-width: 150px;
	}
	#order-pindanbill .user-item .goods-list{
		background-color: #f5f5f5;
		padding: 0 10px 10px;
		margin-top: 10px;
		border-radius: 3px;
	}
	#order-pindanbill .plateform{
		padding: 30px 0;
	}
	#order-pindanbill .plateform img{
		width: 28px;
		height: 28px;
		border-radius: 3px;
		overflow: hidden;
		margin-right: 10px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/order/pindanbill.vue