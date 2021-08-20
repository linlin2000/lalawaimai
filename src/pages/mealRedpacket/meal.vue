<template>
	<div id="mealRedpacket-plus">
		<public-header title="红包套餐" v-if="!isWeixin"></public-header>
		<div class="content" v-if="mealRedpacketId > 0">
			<div class="info">
				<div class="city-records flex-lr">
					<div class="city flex">
						<template v-if="0">
							<span>使用城市:</span>
							<img class="img-location" src="static/img/meal/location1.png" alt="">
							<span>太原市</span>
							<img class="img-right" src="static/img/meal/right1.png" alt="">
						</template>
					</div>
					<router-link tag="div" :to="util.getUrl({path: '/package/pages/mealRedpacket/ordermeal'})" class="records flex">
						<img src="static/img/meal/meal_time.png" alt="">
						<span>购买记录</span>
					</router-link>
				</div>
				<div class="meal-info" :style="{background: 'url(' + params.backgroundImage + ') no-repeat top left/100% 100%'}">
					<div class="tip flex" :style="{color: style.rulesColor}">
						<span class="icon icon-question1" @click="onToggleAgreement"></span>
						<span @click="onToggleAgreement">特权说明</span>
					</div>
					<div class="title" :style="{color: style.titleColor}">{{params.title}}</div>
					<div class="contain" :style="{color: style.placeholderColor}">{{params.placeholder}}</div>
					<div class="btn-buy" v-if="!canBuy">本月购买次数已用完</div>
					<div class="btn-buy haved " :class="{disabled: !islegal}" @click="onSubmit()" :style="{color: style.btnColor, background: style.btnBackground}" v-else>
						<span class="renminbi font-12">¥</span>
						<span class="price font-18 padding-10-r">{{params.price}}</span>
						<span>{{params.btnText}}</span>
					</div>
				</div>
				<div class="use-limit flex-lr" v-if="params.tips">
					<div class="limit-item" v-for="(item, index) in params.tips" :key="index">
						<div class="img">
							<img :src="item.imgurl" alt="">
						</div>
						<span class="text ellipsis" :style="{color: item.color}">{{item.text}}</span>
					</div>
				</div>
			</div>
			<div class="detail">
				<template v-if="redpackets && redpackets.length > 0">
					<div class="title flex-lr padding-10-lr padding-10-t" v-if="!canBuy">
						<div class="avail-num">
							<span>会员红包</span>
						</div>
						<div class="flex">
							<span class="margin-5-r">剩余</span>
							<span class="font-bold font-20 c-default">{{usefulNum}}</span>
							<span>/{{redpackets.length}}张</span>
						</div>
					</div>
					<div class="redpacket-list">
						<van-row gutter="10">
							<van-col span="12" class="margin-10-b" v-for="(item, index) in redpackets" :key="index">
								<div class="redpacket-item" :class="{used: item.status > 1}">
									<div class="top">
										<div class="flex-lr">
											<div class="name">{{item.name}}</div>
											<div class="price color-main">
												¥<span class="font-20">{{item.discount}}</span>
											</div>
										</div>
										<div class="flex-lr margin-10-t">
											<div class="useday-limit">有效期: {{item.use_days_limit}}天</div>
											<p class="color-main" v-if="item.condition > 0">满{{item.condition}}元</p>
											<p class="color-main" v-else>无门槛</p>
										</div>
									</div>
									<div class="divide">
										<div class="divide-line"></div>
									</div>
									<div class="bottom" v-if="!canBuy">{{item.endtime_cn}}</div>
									<div class="bottom" v-else>购买后即可享受优惠</div>
								</div>
							</van-col>
						</van-row>
					</div>
				</template>
				<template v-if="params.exchangeStatus == 1 && exchanges.data.length > 0">
					<div class="title padding-10-lr margin-5-t">
						<span class="avail-num">
							<span>会员红包金额升级</span>
						</span>
						<span class="c-gray font-12 margin-5-l">以下商家支持红包金额升级</span>
					</div>
					<!--旧版-->
					<div class="exchange-list padding-10 hide">
						<van-list v-model="exchanges.loading" :finished="exchanges.finished" @load="onGetExchanges" :offset="100" :immediate-check="false">
							<div class="exchange-item" v-for="(item, index) in exchanges.data" :key="index">
								<div class="exchange-item-wrap ">
									<div class="store">
										<div class="store-name ellipsis">{{item.title}}</div>
										<div class="flex margin-10-t">
											<van-rate v-model="item.score" :size="12" :disabled-color="'#ff2d4b'" disabled />
											<p class="star">{{item.score}}</p>
										</div>
										<div class="activity flex margin-10-t"  v-if="item.activity">
											<img src="static/img/icon-discount.png" alt="">
											<p class="ellipsis">{{item.activity}}</p>
										</div>
									</div>
									<div class="price">
										¥<span>{{item.discount}}</span>
										<p class="ellipsis" v-if="item.condition > 0">满{{item.condition}}元</p>
										<p class="ellipsis" v-else>无门槛</p>
									</div>
								</div>
								<div class="exchange" @click="onExchangePopupShow(item.store_id)"><span>立</span><span>即</span><span>兑</span><span>换</span></div>
							</div>
						</van-list>
					</div>
					<!--新版-->
					<van-list
						v-model="exchanges.loading"
						:finished="exchanges.finished"
						@load="onGetExchanges"
						:offset="100"
						:immediate-check="false"
						class="new-exchange-list padding-10 font-14"
					>
						<van-row gutter="10">
							<van-col span="12" class="margin-10-b " v-for="(item, index) in exchanges.data" :key="index">
								<div class="new-exchange-item padding-15-tb">
									<div class="redpacket-info">
										<div class="flex-center">
											<span class="c-danger">¥</span>
											<span class="c-danger font-24 font-bold margin-5-r">{{item.discount}}</span>
											<span class="c-gray font-12" v-if="item.condition > 0">满{{item.condition}}元</span>
											<span class="c-gray font-12" v-else>无门槛</span>
										</div>
										<div class="upgrade" @click="onExchangePopupShow(item.store_id)">升级</div>
										<div class="c-gray font-12">需1张会员红包升级</div>
									</div>
									<div class="divide">
										<div class="divide-line"></div>
									</div>
									<router-link tag="div" :to="util.getUrl({path: '/pages/store/goods', query:{sid: item.sid}})" class="store-info">
										<div class="store-logo">
											<img :src="item.logo" alt="">
										</div>
										<div class="store-title w-100 ellipsis text-center margin-10-t padding-10-lr">{{item.title}}</div>
									</router-link>
								</div>
							</van-col>
						</van-row>
					</van-list>
				</template>
			</div>
		</div>
		<!--选择红包弹出层-->
		<van-popup class="popup-exchange" v-model="popupShow" position="bottom">
			<div class="popup-title van-hairline--bottom">请选择一个可用红包进行兑换</div>
			<div class="popup-container">
				<div class="redpacket-list">
					<van-row gutter="10">
						<van-col span="12" class="margin-10-b" v-for="(item, index) in redpackets" :key="index">
							<div class="redpacket-item" :class="{active: item.id == selectedRedpacketId, used: (item.status > 1 || item.sid > 0)}" @click="onSelectRedpacket(item)">
								<div class="top">
									<div class="flex-lr">
										<div class="name">{{item.name}}</div>
										<div class="price color-main">
											¥<span class="font-20">{{item.discount}}</span>
										</div>
									</div>
									<div class="flex-lr margin-10-tb">
										<div class="useday-limit">有效期: {{item.use_days_limit}}天</div>
										<p class="color-main" v-if="item.condition > 0">满{{item.condition}}元</p>
										<p class="color-main" v-else>无门槛</p>
									</div>
								</div>
								<div class="divide">
									<div class="divide-line"></div>
								</div>
								<div class="bottom" v-if="!canBuy">{{item.endtime_cn}}</div>
								<div class="bottom" v-else>购买后即可享受优惠</div>
							</div>
						</van-col>
					</van-row>
				</div>
			</div>
			<div class="popup-confirm van-hairline--top text-center c-danger" @click="onExchange()">立即升级</div>
		</van-popup>
		<agreement :show="agreementShow" title="特权说明" :content="agreementContent" @agreementHide="onToggleAgreement"></agreement>
		<iloading v-show="preLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import agreement from '@/components/agreement'
	export default {
		data() {
			return {
				preLoading: true,
				canBuy: true,
				mealRedpacketId: 0,
				params: {},
				style: {},
				redpackets: [],
				usefulNum: 0,
				exchanges: {
					page: 2,
					psize: 15,
					loading: false,
					finished: false,
					data: []
				},
				islegal: false,
				popupShow: false,
				selectedRedpacketId: 0,
				selectedSid: 0,
				agreementShow: false,
				agreementContent: '',
			}
		},
		components: {
			PublicHeader,
			agreement
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'mealRedpacket/meal/index',
				}).then((res) => {
					this.preLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return;
					}
					if(result.message.mealRedpacket == false) {
						this.util.$toast('暂无套餐红包活动');
						return false;
					}
					this.canBuy = result.message.canBuy;
					this.usefulNum = result.message.useful_num;
					this.redpackets = [...this.redpackets, ...result.message.redpackets];
					this.exchanges.data = [...this.exchanges, ...result.message.exchanges];
					if(result.message.exchanges.length < this.exchanges.psize) {
						this.exchanges.finished = true;
					}
					var mealRedpacket = result.message.mealRedpacket;
					this.agreementContent = mealRedpacket.data.rules;
					this.mealRedpacketId = mealRedpacket.id;
					this.params = mealRedpacket.data.params;
					this.style = mealRedpacket.data.style;
					this.islegal = true;
				})
			},
			onGetExchanges() {
				if(this.exchanges.finished) {
					return false;
				}
				this.util.request({
					url: 'mealRedpacket/meal/exchange',
					data: {
						page: this.exchanges.page,
						psize: this.exchanges.psize,
						mealRedpacket_id: this.mealRedpacketId
					}
				}).then((res) => {
					var result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return;
					}
					this.exchanges.loading = false;
					var exchanges = result.message.exchanges;
					this.exchanges.data = [...this.exchanges.data, ...exchanges];
					if(exchanges.length < this.exchanges.psize) {
						this.exchanges.finished = true;
					}
					this.exchanges.page++;
				})
			},
			onSubmit() {
				if(!this.islegal) {
					return false;
				}
				this.islegal = false;
				if(!this.canBuy) {
					this.uitl.$toast('本月购买次数已用完');
					return false;
				}
				var data = {
					mealRedpacket_id: parseInt(this.mealRedpacketId),
					final_fee: parseFloat(this.params.price)
				};
				this.util.request({
					url: 'mealRedpacket/meal/submit',
					data: data
				}).then((res) => {
					var result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return;
					}
					var order_id = result.message;
					this.$router.replace(this.util.getUrl({path: '/pages/public/pay?order_id=' + order_id + '&order_type=mealRedpacket'}));
				})
			},
			onExchangePopupShow(sid) {
				if(this.params.exchangeStatus != 1) {
					return false;
				}
				if(this.canBuy) {
					this.util.$toast('请购买套餐红包后再进行兑换操作');
					return false;
				}
				this.selectedSid = sid;
				this.onTogglePopup();
			},
			onTogglePopup() {
				this.popupShow = !this.popupShow;
			},
			onToggleAgreement() {
				this.agreementShow = !this.agreementShow;
			},
			onSelectRedpacket(redpacket) {
				if(redpacket.status != 1) {
					this.util.$toast('请选择有效的红包进行兑换');
					return false;
				}
				if(redpacket.sid > 0) {
					this.util.$toast('无法使用已兑换的红包进行兑换');
					return false;
				}
				this.selectedRedpacketId = redpacket.id;
			},
			onExchange() {
				var data = {
					redpacket_id: parseInt(this.selectedRedpacketId),
					sid: parseInt(this.selectedSid),
					mealRedpacket_id: parseInt(this.mealRedpacketId)
				};
				this.util.request({
					url: 'mealRedpacket/meal/do_exchange',
					data: data
				}).then((res) => {
					var result = res.data.message;
					this.util.$toast(result.message);
					if(result.errno) {
						return;
					} else {
						window.location.reload();
					}
				})
			}
		},
		mounted() {
			this.onLoad()
		}
	}
</script>

<style>
	#mealRedpacket-plus .popup-exchange{
		height: 400px;
		width: 100%;
	}
	#mealRedpacket-plus .popup-exchange .popup-container{
		height: 300px;
		width: 100%;
		overflow-y: scroll;
		overflow-x: hidden;
		padding: 10px 10px 0;
		background-color: #f5f5f5;
	}
	#mealRedpacket-plus .popup-exchange .popup-title,#mealRedpacket-plus .popup-exchange .popup-confirm{
		width: 100%;
		height: 50px;
		font-size: 16px;
		line-height: 50px;
		padding: 0 10px;
	}
	#mealRedpacket-plus .color-main{
		color: #ff000f;
	}
	#mealRedpacket-plus .info{
		background-color: #fff;
	}
	#mealRedpacket-plus .info .city-records{
		padding: 10px 10px 0 10px;
		font-size: 14px;
	}
	#mealRedpacket-plus .info .city-records .city .img-location{
		width: 18px;
		height: 18px;
		margin: 0 5px;
	}
	#mealRedpacket-plus .info .city-records .city .img-right{
		width: 20px;
		height: 20px;
		margin-left: 5px;
	}
	#mealRedpacket-plus .info .city-records .records {
		color: #999;
	}
	#mealRedpacket-plus .info .city-records .records img{
		width: 15px;
		height: 15px;
		margin-right: 3px;
	}
	#mealRedpacket-plus .info .meal-info{
		width: 100%;
		background: url("../../../static/img/meal/meal_title_bg.png") no-repeat top left/100% 100%;
		text-align: center;
		padding-bottom: 15px;
	}
	#mealRedpacket-plus .info .meal-info .tip{
		font-size: 14px;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: flex-end;
		padding: 60px 20px 20px 0;
	}
	#mealRedpacket-plus .info .meal-info .tip img{
		width: 14px;
		hegiht: 14px;
	}
	#mealRedpacket-plus .info .meal-info .title{
		font-size: 25px;
		font-weight: 600;
		color: #fff;
		font-family: '黑体';
	}
	#mealRedpacket-plus .info .meal-info .contain{
		margin: 10px 0 20px;
		color: #fff;
	}
	#mealRedpacket-plus .info .meal-info .btn-buy{
		height: 40px;
		display: inline-flex;
		align-items: center;
		border-radius: 40px;
		padding: 0 15px;
		color: #ffdee3;
		border: 1px solid #ffdee3;
	}
	#mealRedpacket-plus .info .meal-info .btn-buy.haved{
		background-color: #b64d57;
		color: #ffdee3;
	}
	#mealRedpacket-plus .info .meal-info .btn-buy.disabled{
		background-color: #eee!important;
		color: #999!important;
		border-color: #eee;
	}
	#mealRedpacket-plus .info .use-limit{
		padding: 20px 30px;
		font-size: 13px;
		color: #A99667;
	}
	#mealRedpacket-plus .info .use-limit .limit-item{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		max-width: 33.33%;
	}
	#mealRedpacket-plus .info .use-limit .limit-item img{
		width: 40px;
		height: 40px;
	}
	#mealRedpacket-plus .info .use-limit .limit-item .img{
		position: relative;
	}
	#mealRedpacket-plus .info .use-limit .limit-item .img span{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #fff;
	}
	#mealRedpacket-plus .info .use-limit .limit-item .text{
		max-width: 100%;
	}
	#mealRedpacket-plus .detail{
		margin-top: 10px;
	}
	#mealRedpacket-plus .detail .title{
		color: #999;
		font-size: 14px;
	}
	#mealRedpacket-plus .detail .title .avail-num span{
		color: #333;
		font-size: 16px;
		font-weight: bold;
	}
	#mealRedpacket-plus .detail .redpacket-list{
		padding: 10px 10px 0;
	}
	#mealRedpacket-plus .redpacket-list .van-col .redpacket-item{
		display: flex;
		flex-flow: column nowrap;
		justify-content: space-between;
		border-radius: 5px;
		font-size: 12px;
		color: #999;
		background-color: #fff;
		border: 2px solid #f5f5f5;
		overflow: hidden;
		box-sizing: border-box;
	}
	#mealRedpacket-plus .redpacket-list .van-col .redpacket-item .top{
		padding: 10px 10px 4px 10px;
	}
	#mealRedpacket-plus .redpacket-list .van-col .redpacket-item .name{
		color: #333;
		font-size: 15px;
	}
	#mealRedpacket-plus .redpacket-list .van-col .redpacket-item .bottom{
		padding: 4px 10px 10px 10px;
	}
	#mealRedpacket-plus .redpacket-list .van-col .redpacket-item.used{
		opacity: 0.6;
	}
	#mealRedpacket-plus .redpacket-list .van-col .redpacket-item.active{
		border-color: #ff2d4b;
		border-radius: 5px;
	}
	#mealRedpacket-plus .detail .exchange-list .exchange-item{
		position: relative;
		background: url("../../../static/img/meal/meal_exchange.png") no-repeat top left/100% 100%;
		margin-bottom: 10px;
	}
	#mealRedpacket-plus .detail .exchange-list .exchange-item .exchange-item-wrap{
		display: flex;
		flex-flow: row nowrap;
		align-items: flex-end;
		justify-content: space-between;
	}
	#mealRedpacket-plus .detail .exchange-list .exchange-item .store{
		width: 65%;
		padding: 10px 10px 10px 15px;
	}
	#mealRedpacket-plus .detail .exchange-list .exchange-item .store .star{
		font-size: 13px;
		color: #6F6E6B;
		margin-left: 5px;
	}
	#mealRedpacket-plus .detail .exchange-list .exchange-item .store .activity{
		font-size: 14px;
		color: #6F6E6B;
	}
	#mealRedpacket-plus .detail .exchange-list .exchange-item .store .activity img{
		width: 16px;
		height: 16px;
		margin-right: 5px;
	}
	#mealRedpacket-plus .detail .exchange-list .exchange-item .price{
		width: 31%;
		padding-right: 24px;
		text-align: center;
		color: #ff000f;
		font-size: 14px;
		padding-bottom: 10px;
	}
	#mealRedpacket-plus .detail .exchange-list .exchange-item .price span{
		font-size: 28px;
		font-weight: 500;
	}
	#mealRedpacket-plus .detail .exchange-list .exchange-item .price p{
		margin-top: 20px;
		color: #6F6E6B;
	}
	#mealRedpacket-plus .detail .exchange-list .exchange-item .exchange{
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		width: 24px;
		line-height: 1.5;
		text-align: center;
		display: flex;
		flex-flow: column nowrap;
		justify-content: center;
		align-items: center;
		border-radius: 0 5px 5px 0;
		font-size: 12px;
		color: #fff;
		background-color: #F12845;
	}
	/*新版兑换红包列表*/
	#mealRedpacket-plus .new-exchange-list{
		background-color: #f5f5f5;
	}
	#mealRedpacket-plus .new-exchange-list .new-exchange-item{
		border-radius: 5px;
		background-color: #fff;
	}
	#mealRedpacket-plus .new-exchange-list .new-exchange-item .redpacket-info{
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 4px;
	}
	#mealRedpacket-plus .new-exchange-list .new-exchange-item .redpacket-info .upgrade{
		width: 60%;
		padding: 8px 0;
		margin: 10px 0;
		border-radius: 100px;
		text-align: center;
		background-color: #FF425D;
		color: #ffdee3;
	}
	#mealRedpacket-plus .new-exchange-list .new-exchange-item .store-logo{
		width: 100%;
		height: 120px;
		padding: 4px 10px 0 10px;
	}
	#mealRedpacket-plus .new-exchange-list .new-exchange-item .store-logo img{
		width: 100%;
		height: 100%;
		border-radius: 5px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/mealRedpacket/meal.vue