<template>
	<div id="svip-purchase">
		<public-header :title="title"></public-header>
		<div class="content">
			<div class="header">
				<div class="user">
					<img :src="member.avatar" alt="" class="avatar">
					<div>
						<div class="info">
							<span>{{member.nickname}}</span>
							<span v-if="member.mobile">（{{member.mobile}}）</span>
						</div>
						<div class="svip">
							<span v-if="member.svip_status == 1">{{member.svip_endtime_cn}}到期，购买后有效期将顺延</span>
							<span v-else>您还不是超级会员</span>
						</div>
					</div>
				</div>
			</div>
			<div class="wrapper-item">
				<div class="header-title">
					<div class="title">
						选择优惠套餐
					</div>
				</div>
				<div class="item-list" v-if="meals.length > 0">
					<div class="container" :class="{active: select.index == index}" v-for="(item, index) in meals" :key="index">
						<div class="div-all flex" @click="onSelectMeal(index)">
							<div class="header-body">
								<div class="title">{{item.title}}</div>
								<div class="price">
									<span class="yuan">
										<span>￥</span>{{item.price}}
									</span>
									<span class="old-price line-through">{{item.oldprice}}</span>
								</div>
							</div>
							<span class="tag" v-if="item.description">{{item.description}}</span>
							<div class="tips" v-if="0"></div>
						</div>
					</div>
				</div>
				<div class="description padding-15-b" v-else>
					<span>暂时没有可购买会员套餐</span>
				</div>
			</div>
			<van-cell-group>
				<van-cell title="使用兑换码兑换会员" to="/package/pages/svip/svipExchange">
					<div slot="right-icon" class="flex">
						<van-icon name="arrow"></van-icon>
					</div>
				</van-cell>
			</van-cell-group>
			<div class="description">
				<div @click="onTogglePopup">会员特权说明</div>
			</div>
			<div class="bottomBar" v-if="meals.length > 0">
				<div class="allprice">
					<div class="total">
						总价
						<span class="total-prcie">￥<span class="c-danger">{{select.meal.price}}</span></span>
						<span class="line-through c-gray font-12">{{select.meal.oldprice}}</span>
					</div>
				</div>
				<button @click="onSubmit" :disabled="submitting" v-if="member.svip_status == 1">立即续费</button>
				<button @click="onSubmit" :disabled="submitting" v-else>立即开通</button>
			</div>
		</div>
		<van-popup v-model="agreementShow" position="bottom" class="agreement-popup">
			<van-nav-bar class="border-0px" title="会员特权说明" @click-left="onTogglePopup" :style="{background: '#ff2d4b', color: '#fff' }">
				<van-icon name="left" :style="{color: '#fff'}" slot="left" class="font-20"></van-icon>
			</van-nav-bar>
			<div class="popup-content margin-10" v-html="agreement"></div>
		</van-popup>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import publicHeader from "@/components/header"
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		components: {
			publicHeader,
		},
		data() {
			return {
				title: '开通会员',
				showPreLoading: true,
				meals: [],
				member: {},
				select: {
					index: 0,
					meal: {}
				},
				agreementShow: false,
				agreement: '',
				submitting: false
			}
		},
		methods: {
			onLoad(id) {
				var that = this;
				getData({
					vue: that,
					url: 'svip/index/meal',
					data: {},
					success: function(res) {
						that.meals = res.meals;
						that.member = res.member;
						if(that.member.svip_status == 1) {
							that.title = '续费会员';
						}
						that.select.meal = that.meals[0];
						that.agreement = res.agreement;
					}
				})
			},
			onSelectMeal(index) {
				this.select.index = index;
				this.select.meal = this.meals[index];
			},
			onTogglePopup() {
				this.agreementShow = !this.agreementShow;
			},
			onSubmit() {
				var that = this;
				if(that.submitting) {
					return false;
				}
				that.submitting = true;
				setData({
					vue: that,
					url: 'svip/index/buy',
					data: {id: that.select.meal.id},
					success: function(res) {
						that.$router.push(that.util.getUrl({path: 'pages/public/pay', query: {order_id: res.id, order_type: 'svip'}}))
					},
					fail: function(res) {
						that.submitting = false;
						that.util.$toast(res.message, '', 1000);
					}
				});
			}
		},
		mounted(){
			this.onLoad();
		},
	}
</script>

<style>
	#svip-purchase #public-header .van-nav-bar{
		background-color: #282728!important;
	}
	#svip-purchase .content{
		padding-bottom: 65px;
	}
	#svip-purchase .content .header{
		background: #282728;
	}
	#svip-purchase .content .header .user{
		display: flex;
		align-items: center;
		padding: 0 4% 2.934%;
	}
	#svip-purchase .content .header .user .avatar{
		display: block;
		overflow: hidden;
		margin-right: 3.2%;
		margin-top: 7px;
		width: 48px;
		height: 48px;
		border-radius: 50%;
	}
	#svip-purchase .content .header .user .info{
		display: flex;
		align-items: baseline;
		color: #fff;
		line-height: 24px;
		margin-top: 5px;
	}
	#svip-purchase .content .header .user .info span:first-child{
		font-weight: 700;
		font-size: 17px;
	}
	#svip-purchase .content .header .user .info span:last-child{
		font-size: 12px;
	}
	#svip-purchase .content .header .user .svip{
		margin-top: 2.5px;
		color: rgba(255,255,255,0.7);
		line-height: 16px;
		font-size: 12px;
	}
	#svip-purchase .content .wrapper-item{
		background: #fff;
		margin-bottom: 15px;
	}
	#svip-purchase .content .wrapper-item .header-title{
		display: flex;
		padding: 24px 15px 14px;
	}
	#svip-purchase .content .wrapper-item .header-title .title{
		color: #333;
		display: block;
		font-size: 15px;
		font-weight: 700;
		margin-bottom: 5px;
		line-height: 18px;
	}
	#svip-purchase .content .wrapper-item .item-list{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		padding: 0 7.5px;
	}
	#svip-purchase .content .wrapper-item .item-list .container{
		background-color: #fff;
		width: 33%;
	}
	#svip-purchase .content .wrapper-item .item-list .container.active .div-all{
		box-shadow: 0 0 0 2px #dfc78a, 0 1px 2px 0 rgba(0,0,0,.04);
		background-color: #fffcee;
	}
	#svip-purchase .content .wrapper-item .item-list .container .div-all{
		position: relative;
		height: 150px;
		box-shadow: 0 0 0 1px #eee, 0 1px 1.5px 0 rgba(0,0,0,.04);
		border-radius: 4px;
		text-align: center;
		margin: 0 7.5px 15px;
	}
	#svip-purchase .content .wrapper-item .item-list .container .header-body{
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		width: 100%;
	}
	#svip-purchase .content .wrapper-item .item-list .container .header-body .title{
		color: #666;
		font-weight: 700;
		font-size: 16px;
		margin-bottom: 4px;
	}
	#svip-purchase .content .wrapper-item .item-list .container.active .header-body .title{
		color: #b99c5b;
	}
	#svip-purchase .content .wrapper-item .item-list .container .header-body .price{
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	#svip-purchase .content .wrapper-item .item-list .container .header-body .price .yuan{
		font-size: 32px;
		font-weight: 500;
		color: #ff5339;
	}
	#svip-purchase .content .wrapper-item .item-list .container.active .header-body .price .yuan{
		color: #8b5d22;
	}
	#svip-purchase .content .wrapper-item .item-list .container .header-body .price .yuan span{
		font-size: 20px;
		color: #ff5339;
		margin-right: -2px;
	}
	#svip-purchase .content .wrapper-item .item-list .container.active .header-body .price .yuan span{
		color: #8b5d22;
	}
	#svip-purchase .content .wrapper-item .item-list .container .header-body .price .old-price{
		color: #bbb;
		font-size: 14px;
	}
	#svip-purchase .content .wrapper-item .item-list .container.active .header-body .price .old-price{
		color: #b99c5b;
	}
	#svip-purchase .content .wrapper-item .item-list .container .tag{
		position: absolute;
		left: -3px;
		top: -5px;
		font-size: 12px;
		font-weight: 700;
		color: #fff;
		padding: 4px 8px;
		background-color: #ff5339;
		border-radius: 0 6px;
		box-shadow: 0 1px 2px 0 rgba(216,54,30,.2);
	}
	#svip-purchase .content .wrapper-item .item-list .container .tips{
		position: absolute;
		bottom: -2px;
		left: -2px;
		width: 104%;
		padding: 6px 9px;
		text-align: center;
		color: #ff5339;
		font-size: 12px;
		line-height: 14px;
		background: #fff4e8;
		border-radius: 0 0 4px 4px;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
	}
	#svip-purchase .content .wrapper-item .van-cell__title span{
		color: #333;
		font-size: 15px;
		font-weight: 700;
	}
	#svip-purchase .content .wrapper-item .van-cell__value span{
		color: #9d9d9d;
		font-size: 12px;
		font-weight: 900;
	}
	#svip-purchase .content .van-cell__title span{
		color: #333;
		font-size: 15px;
		font-weight: 700;
	}
	#svip-purchase .content .van-cell__title .van-cell__label{
		font-size: 12px;
		color: #666;
		font-weight: 400;
	}
	#svip-purchase .content .description{
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 15px;
	}
	#svip-purchase .content .description a{
		color: #666;
		font-size: 12px;
	}
	#svip-purchase .content .description div{
		color: #666;
		font-size: 12px;
	}
	#svip-purchase .content .description span{
		margin: 0 13px;
		color: #999;
		font-size: 12px;
	}
	#svip-purchase .content .bottomBar{
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 0;
		left:  0;
		width: 100%;
		height: 50px;
		background-color: #fff;
		box-shadow: 0 -1px 3px 0 rgba(0,0,0,.1);
	}
	#svip-purchase .content .bottomBar .allprice{
		flex: 1;
		display: flex;
		align-items: center;
	}
	#svip-purchase .content .bottomBar .allprice .total{
		display: flex;
		align-items: center;
		margin-left: 15px;
		font-size: 17px;
		font-weight: 500;
		padding-right: 12px;
	}
	#svip-purchase .content .bottomBar .allprice .total .total-prcie{
		color: #ff5339;
		margin:0 5px;
	}
	#svip-purchase .content .bottomBar button{
		outline: none;
		border: none;
		width: 130px;
		height: 100%;
		background-image: linear-gradient(90deg,#eadb9d,#c9b86a);
		font-size: 17px;
		font-weight: 600;
		color: #5c4415;
	}
	#svip-purchase .agreement-popup{
		height: 100%;
		width: 100%;
	}
	#svip-purchase .agreement-popup .popup-content{
		word-wrap: break-word;
	}
</style>


// WEBPACK FOOTER //
// src/pages/svip/purchase.vue