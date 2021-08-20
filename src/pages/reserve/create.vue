<template>
	<div id="reserve-submit">
		<public-header title="订单确认"></public-header>
		<div class="content" :style="{height: contentHeight + 'px'}">
			<div class="content-block-title">{{category.title}} <span>|</span>{{reserveExtra.time}}</div>
			<div class="list-block">
				<van-cell-group>
					<van-field
						v-model="username"
						type="text"
						label="预定人"
						placeholder="您的姓名"
					/>
					<van-field
						v-model="mobile"
						type="mobile"
						label="手机号"
						placeholder="您的手机号"
					/>
				</van-cell-group>
			</div>
			<div class="content-type-title">预定类型</div>
			<div class="content-scroll">
				<!-- 平台配送 -->
				<div class="plateform-box">
					<van-cell-group class="border-0px">
						<van-cell :value="'只定座 预付￥' + category.reservation_price" @click="onChangeOrderType('table')">
							<div slot="right-icon" class="checkbox">
								<div class="van-icon" :class="{checked: reserve_type == 'table', 'van-icon-check': reserve_type == 'table'}"></div>
							</div>
						</van-cell>
					</van-cell-group>
				</div>
				<!-- 到店自取 -->
				<div class="instore-box">
					<van-cell-group class="border-0px">
						<van-cell :value="'提前下单' + category.limit_price + '元起订'" class="border-0px" @click="onChangeOrderType('order')">
							<div slot="right-icon" class="checkbox">
								<div class="van-icon" :class="{checked: reserve_type == 'order', 'van-icon-check': reserve_type == 'order'}"></div>
							</div>
						</van-cell>
					</van-cell-group>
				</div>
				<div class="order-food" v-if="reserve_type=='order'">
					<div class='order-food-title'>
						<div class='food-shop'>{{store.title}}</div>
					</div>
					<div class="food-list">
						<template v-for="item in cart.data">
							<template v-for="option in item">
								<van-card :thumb="option.thumb" v-if="option.goods_id != '88888'">
									<div slot="title" class="food-title">
										<div class="left">
											<img class="activity-img" src="static/img/bargain_b.png" alt="" v-if="option.bargain_id > 0">
											{{option.title}}
										</div>
										<div class="right">¥{{option.total_discount_price}}</div>
									</div>
									<div slot="desc" class="food-desc">
										<div class="left">x{{option.num}}</div>
										<div class="right">¥{{option.total_price}}</div>
									</div>
								</van-card>
							</template>
						</template>
					</div>
					<div class="divide">
						<div class="divide-line"></div>
					</div>
					<van-cell-group class="discount-box border-0px">
						<template v-if="order.activityed && order.activityed.list">
							<template v-for="activity in order.activityed.list" >
								<template v-if="activity.type != 'couponCollect' && activity.type != 'redPacket'">
									<van-cell class="border-0px">
										<div slot="title" class="discount-item flex">
											<img :src="'static/img/' + activity.type + '_b.png'" alt="">
											{{activity.name}}
										</div>
										<template slot="right-icon">
											<span class="c-danger">{{activity.text}}</span>
										</template>
									</van-cell>
								</template>
							</template>
						</template>
						<van-cell title="商家代金券" class="border-0px">
							<template slot="right-icon" v-if="order.coupon && order.coupon.id > 0">
								<span class="c-danger" @click="onChangePopup('coupon')">-￥{{order.coupon.discount}}</span>
							</template>
							<template slot="right-icon" v-else>
								<span class="c-danger" v-if="coupons && coupons.length > 0" @click="onChangePopup('coupon')">
									{{coupons.length}}张可用代金券
								</span>
								<span class="c-disabled" v-else>
									暂无可用代金券
								</span>
								<i class="van-icon van-icon-arrow van-cell__right-icon"></i>
							</template>
						</van-cell>

					</van-cell-group>
					<div class="divide">
						<div class="divide-line"></div>
					</div>
					<van-cell-group class="border-0px">
						<van-cell>
							<div slot="title" class="order-pay-info">
								<div class='pay-price'>
									实付
									<div>¥{{order.final_fee}}</div>
								</div>
								<div class='discount-fee'>优惠￥{{order.discount_fee}}</div>
								<div class='total-original'>
									共计￥{{order.total_fee}}
								</div>
							</div>
						</van-cell>
					</van-cell-group>
				</div>
				<div class="instore-box" v-if="tables && tables.length > 0">
					<van-cell title="包厢/桌号" :value="reserveExtra.table_title" is-link @click="onChangePopup('table')" />
				</div>
				<div class="order-region">
					<van-cell-group>
						<van-cell title="支付方式" value="在线支付" />
						<van-cell title="来客人数" @click="onChangePopup('person_num')">
							<template slot="right-icon">
								<template v-if="reserveExtra.person_num">
									{{reserveExtra.person_num}}人
								</template>
								<span v-else>选择来客人数</span>
								<i class="van-icon van-icon-arrow van-cell__right-icon"></i>
							</template>
						</van-cell>
						<van-cell title="备注" :to="util.getUrl({path: '/tangshi/pages/reserve/note', query: { sid: sid}})">
							<template slot="right-icon">
								{{reserveExtra.note || order.note || '口味、偏好等要求'}}
								<i class="van-icon van-icon-arrow van-cell__right-icon"></i>
							</template>
						</van-cell>
					</van-cell-group>
				</div>
			</div>
		</div>
		<!-- 桌号弹出层 -->
		<van-popup v-model="popup.table" position="bottom">
			<van-picker :columns="tables" value-key="title" title="桌号选择" @confirm="onSelectTable" @cancel="onChangePopup('table')" show-toolbar/>
		</van-popup>
		<!--人数选择-->
		<van-popup v-model="popup.person_num" position="bottom">
			<div class="popup-picknum">
				<van-picker :columns="columns" @confirm="onConfirmPersonNum" @cancel="onChangePopup('picknum')" show-toolbar confirm-button-text="确认" cancel-button-text="取消"/>
			</div>
		</van-popup>
		<!-- 代金券弹出层 -->
		<van-popup v-model="popup.coupon" position="bottom" v-if="coupons && coupons.length > 0">
			<div class="popup-coupon">
				<div class="popup-title van-hairline--bottom">商家代金券</div>
				<div class="popup-container">
					<load type="loaded" :text="'可用代金券(' + coupons.length + '张)'" bgcolor="#f5f5f5"></load>
					<div class="coupon-list">
						<div class="content-padded">
							<div class="coupon-item" v-for="item in coupons">
								<div class="clearfix" @click="onSelectCoupon(item.id)">
									<span class="circle circle-left"></span>
									<span class="circle circle-right"></span>
									<div class="left">
										<div class="store-logo">
											<img :src="item.logo" alt="">
										</div>
										<div class="coupon-detail">
											<div class="coupon-title">{{item.title}}</div>
											<div class="use-time">有效期至:{{item.endtime_cn}}</div>
										</div>
									</div>
									<div class="right">
										<div class="price">
											<span>￥</span>{{item.discount}}
										</div>
										<div class="condition">满{{item.condition}}元可用</div>
									</div>
								</div>
								<div class="selected-status" v-if="order.coupon && item.id == order.coupon.id">
									<img src="static/img/success.png" alt="">
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="popup-cancle van-hairline--top" @click="onSelectCoupon(0)">不使用代金券</div>
			</div>
		</van-popup>

		<van-submit-bar :disabled="!islegal" :price="order.final_fee * 100" label="待支付" button-text="提交订单" @submit="onSubmit">
			<div slot="default" class="order-benefit">
				已优惠 ¥{{order.discount_fee}}
			</div>
		</van-submit-bar>

		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	import Load from '@/components/load'
	import PublicHeader from '@/components/header'
	export default {
		data() {
			return {
				reserve_type: 'table',
				username: '',
				mobile: '',
				contentHeight: 0,
				popup:{
					coupon: false,
					table: false,
					person_num: false
				},
				store:{},
				cart:{},
				category: {},
				coupons: [],
				order: {},
				activityed: {},
				tables: [],
				columns: [],
				islegal: false,
				showPreLoading: true
			}
		},
		components: {
			PublicHeader,
			Load
		},
		computed: {
			...mapState([
				'reserveExtra'
			]),
		},
		watch: {
			mobile() {
				if(this.mobile && this.mobile.length == 11) {
					this.setState({type: 'reserveExtra', key: 'mobile', val: this.mobile});
				}
			},
			username() {
				this.setState({type: 'reserveExtra', key: 'username', val: this.username});
			}
		},
		methods: {
			...mapMutations([
				'setState' 
			]),
			onSelectTable(table) {
				if(table.is_reserved == 1) {
					this.$toast('该桌位已被他人提前预定, 请选择其他桌号');
					return;
				}
				this.setState({type: 'reserveExtra', key: 'table_id', val: table.id});
				this.setState({type: 'reserveExtra', key: 'table_title', val: table.title});
				this.onChangePopup('table');
			},
			onConfirmPersonNum(value, index) {
				var person_num = index + 1;
				this.setState({type: 'reserveExtra', key: 'person_num', val: person_num});
				this.popup.person_num = false;
			},
			onSelectCoupon(id) {
				this.setState({type: 'reserveExtra', key: 'coupon_id', val: id});
				this.onChangePopup('coupon');
				this.onCalculate();
			},
			onChangeOrderType(type) {
				this.reserve_type = type;
				this.setState({type: 'reserveExtra', key: 'reserve_type', val: type});
				if(type == 'order') {
					this.$router.push(this.util.getUrl({path: '/tangshi/pages/reserve/goods?sid=' + this.sid + '&table_cid=' + this.reserveExtra.cid}));
				}
			},

			onChangePopup(key) {
				this.popup[key] = !this.popup[key];
			},

			onCalculate() {
				var params = {
					sid: this.sid,
					extra: this.reserveExtra
				};
				this.util.request({
					url: 'wmall/store/reserve/post',
					data: params,
				}).then((res) => {
					let result = res.data.message.message;
					this.activityed = result.activityed;
					this.order = result.order;
				})
			},

			onSubmit() {
				if(!this.mobile || !this.username) {
					this.$toast('请完善预订信息');
					return false;
				}
				if(!this.reserveExtra.cid) {
					this.$toast('请先选择预定桌台');
					return false;
				}
				if(!this.reserveExtra.time) {
					this.$toast('请先选择预定时间');
					return false;
				}
				if(!this.islegal) {
					return false;
				}
				if(!this.reserveExtra.reserve_type) {
					this.reserveExtra.reserve_type = 'table';
				}
				this.islegal = false;
				var params = {
					sid: this.sid,
					extra: this.reserveExtra,
				};
				this.util.request({
					url: 'wmall/store/reserve/submit',
					data: params,
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return false;
					}
					var order_id = result.message;
					this.$router.push(this.util.getUrl({path: '/pages/public/pay?order_id=' + order_id + '&order_type=takeout'}));
				})
			},

			onLoad() {
				var params = {
					sid: this.sid,
					extra: this.reserveExtra
				};
				this.util.request({
					url: 'wmall/store/reserve/post',
					data: params,
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message, this.util.getUrl({path: 'tangshi/pages/reserve/index', query: {sid: this.sid}}), 1000, 'replace');
						return;
					}
					this.mobile = this.reserveExtra.mobile;
					this.username = this.reserveExtra.username;
					if(this.reserveExtra.reserve_type) {
						this.reserve_type = this.reserveExtra.reserve_type;
					}
					result = result.message;
					this.store = result.store;
					this.cart = result.cart;
					this.category = result.category;
					this.coupons = result.coupons;
					this.order = result.order;
					this.tables = result.tables;
					this.columns = result.columns;
					this.reserveExtra.person_num = result.renshu
					if(!this.reserveExtra.table_title) {
						this.reserveExtra.table_title = '请选择桌号';
					}
					this.islegal = result.islegal;
					if(!this.mobile) {
						this.mobile = this.order.mobile;
					}
					if(!this.username) {
						this.username = this.order.username;
					}
				})
			}
		},
		created(){
			this.query = this.$route.query;
			if(this.query) {
				this.sid = this.query.sid;
			}
		},
		mounted () {
			this.onLoad();
			let bodyHeight = document.documentElement.clientHeight;
			let navHeight = document.getElementsByClassName('van-nav-bar')[0].clientHeight;
			this.contentHeight = bodyHeight-navHeight-50;
		},
	}
</script>

<style>

	/*整体结构*/
	#reserve-submit .content{
		padding: 0 10px 10px;
	}
	#reserve-submit .content .content-block-title{
		margin: 15px 0;
		text-align: center;
		position: relative;
		overflow: hidden;
		font-size: 16px;
		line-height: 1;
		color: #6d6d72;
		text-overflow: ellipsis;
		text-transform: uppercase;
		white-space: nowrap;
	}
	#reserve-submit .content .content-block-title span{
		display: inline-block;
		padding: 0 5px;
	}
	#reserve-submit .content .content-type-title{
		margin: 14px 15px;
		position: relative;
		overflow: hidden;
		font-size: 14px;
		line-height: 1;
		color: #6d6d72;
		text-overflow: ellipsis;
		text-transform: uppercase;
		white-space: nowrap;
	}

	/*详情*/
	#reserve-submit .order-food{
		background-color: #fff;
		margin-top: 10px;
	}
	#reserve-submit .order-food .order-food-title{
		position: relative;
		height: 50px;
		line-height: 50px;
		padding: 0 15px;
		color: #898989;
		font-size: 14px;
		overflow: hidden;
	}
	#reserve-submit .order-food .order-food-title .food-shop{
		float: left;
		box-sizing: border-box;
		padding-right: 75px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#reserve-submit .order-food .order-food-title .order-tips-thirpart{
		position: absolute;
		right: 15px;
		height: 15px;
		line-height: 15px;
		margin-top: 17px;
		display: inline-block;
		padding: 0 5px;
		color: #fff;
		font-size: 10px;
		background-color: #ff2d4b;
	}
	#reserve-submit .order-food .order-food-title .order-tips-thirpart::before,#reserve-submit .order-food .order-food-title .order-tips-thirpart::after{
		content: "";
		position: absolute;
		border: 2px solid #fff;
	}
	#reserve-submit .order-food .order-food-title .order-tips-thirpart::before{
		left: 0;
		top: 0;
		border-color: #fff #ff2d4b #ff2d4b #fff;
	}
	#reserve-submit .order-food .order-food-title .order-tips-thirpart::after{
		right: 0;
		bottom: 0;
		border-color: #ff2d4b #fff #fff #ff2d4b;
	}
	#reserve-submit .food-list .van-card{
		height: 75px;
		padding: 10px;
		margin-bottom: 10px;
	}
	#reserve-submit .food-list .van-card .van-card__header .van-card__content{
		height: auto;
	}
	#reserve-submit .food-list .van-card:last-child{
		margin-bottom: 0;
	}
	#reserve-submit .food-list .van-card .van-card__thumb{
		top: 0px;
		left: 0px;
		width: 55px;
		height: 55px;
	}
	#reserve-submit .food-list .van-card .food-title,#reserve-submit .food-list .van-card .food-desc{
		display: flex;
		flex-flow: row nowrap;
		align-item: center;
		justify-content: space-between;
	}
	#reserve-submit .food-list .van-card .food-title .left{
		display: flex;
		flex-flow: row nowrap;
		align-item: center;
	}
	#reserve-submit .food-list .van-card .food-title .activity-img{
		width: 15px;
		height: 15px;
		margin-right: 4px;
		margin-top: 1px;
	}
	#reserve-submit .food-list .van-card .food-desc{
		font-size: 12px;
		color: #999;
		margin-top: 5px;
	}
	#reserve-submit .food-list .van-card .food-desc .right{
		text-decoration: line-through;
	}
	#reserve-submit .discount-box .van-cell__value{
		color: #F95339;
	}
	#reserve-submit .order-pay-info{
		font-size: 14px;
		position: relative;
	}
	#reserve-submit .order-pay-info .pay-price{
		display: inline-block;
		float: right;
		line-height: 24px;
	}
	#reserve-submit .order-pay-info .pay-price div{
		display: inline-block;
		color: #F95339;
		font-size: 16px;
	}
	#reserve-submit .order-pay-info .total-original{
		display: inline-block;
		float: right;
		line-height: 24px;
		margin-right: 10px;
		color: #898989;
		font-size: 12px;
	}
	#reserve-submit .order-pay-info .discount-fee{
		display: inline-block;
		float: right;
		line-height: 24px;
		margin-right: 10px;
		color: #898989;
		font-size: 12px;
	}
	#reserve-submit .order-region{
		margin-top: 10px;
		background: #fff;
	}
	#reserve-submit .checkbox .van-icon{
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border:1px solid #ccc;
		vertical-align: middle;
		text-align: center;
		line-height: 16px;
	}
	#reserve-submit .checkbox .van-icon.checked{
		border: 1px solid #ff2d4b;
		background-color: #ff2d4b;
		color: #fff;
	}
	#reserve-submit .plateform-box .van-cell__value span, #reserve-submit .instore-box .van-cell__value span{
		font-size: 14px;
	}
	#reserve-submit .plateform-box .van-cell__left-icon,#reserve-submit .instore-box .van-cell__left-icon{
		font-size: 16px;
	}
	#reserve-submit .plateform-inner .van-icon-plus{
		width: 13px;
		height: 13px;
		border-radius: 50%;
		line-height: 13px;
		text-align: center;
		margin-top: 5px;
		background-color: #ff2d4b;
		color: #fff;
		font-size: 12px;
	}
	#reserve-submit .plateform-inner .addrress-select .van-cell__title{
		color: #ff2d4b;
	}
	#reserve-submit .instore-box{
		margin-top: 10px;
	}
	#reserve-submit .store-title{
		font-size:12px;
		color: #999;
	}
	#reserve-submit .store-address .van-icon{
		line-height: 48px;
	}
	/*代金券弹出层*/
	#reserve-submit .popup-coupon .popup-title,#reserve-submit .popup-redpacket .popup-title{
		width: 100%;
		height: 50px;
		text-align: center;
		font-size: 16px;
		line-height: 50px;
	}
	#reserve-submit .popup-coupon .popup-container,#reserve-submit .popup-redpacket .popup-container{
		width: 100%;
		height: 300px;
		overflow-y: auto;
		background: #f5f5f5;
	}
	#reserve-submit .popup-coupon .popup-container::-webkit-scrollbar,#reserve-submit .popup-redpacket .popup-container::-webkit-scrollbar{
		width: 0px;
		height: 0px;
	}
	#reserve-submit .coupon-list{
		padding: 0px 10px 10px;
	}
	#reserve-submit .coupon-list .content-padded{
		margin: 10px;
	}
	#reserve-submit .coupon-list .content-padded .coupon-item{
		background: #fff;
		margin-top: 12px;
		overflow: hidden;
		padding: 16px;
		position: relative;
	}
	#reserve-submit .coupon-item .clearfix{
		overflow: hidden;
	}
	#reserve-submit .coupon-item .clearfix .circle{
		display: block;
		width: 16px;
		height: 16px;
		background: #f5f5f5;
		position: absolute;
		border-radius: 16px;
		top: 50%;
		margin-top: -8px;
		z-index: 20;
	}
	#reserve-submit .coupon-item .clearfix .circle-left{
		left: -8px;
	}
	#reserve-submit .coupon-item .clearfix .circle-right{
		right: -8px;
	}
	#reserve-submit .coupon-item .clearfix .overdue{
		display: block;
		position: absolute;
		width: 70px;
		height: 70px;
		top: 10px;
		right: 10px;
		z-index: 100;
		background: url(../../../static/img/ws.png);
		background-size: 100%;
	}
	#reserve-submit .coupon-item .clearfix .use{
		display: block;
		position: absolute;
		width: 70px;
		height: 70px;
		top: 10px;
		right: 10px;
		z-index: 100;
		background: url(../../../static/img/wu.png);
		background-size: 100%;
	}
	#reserve-submit .coupon-item .left{
		width: 70%;
		float: left;
	}
	#reserve-submit .coupon-item .left .store-logo{
		display: inline-block;
	float: left;
	width: 32%;
	}
	#reserve-submit .coupon-item .left .store-logo img{
		display: inline-block;
		width: 56px;
		height: 56px;
		margin-top: 4px;
	}
	#reserve-submit .coupon-item .left .coupon-detail{
		display: inline-block;
	float: left;
	width: 60%;
	}
	#reserve-submit .coupon-item .left .coupon-detail .coupon-title{
		font-weight: bold;
		width: 100%;
		overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: #ff2d4b;
	margin-top: 3px;
	}
	#reserve-submit .coupon-item .left .coupon-detail .use-time{
		font-size: 12px;
		overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: #808080;
	margin-top: 16px;
	}
	#reserve-submit .coupon-item .right{
		width: 29%;
		border-left: 1px dashed #ccc;
		text-align: center;
		float: right;
	}
	#reserve-submit .coupon-item .right .price{
		color: #ff2d4b;
	font-size: 24px;
	}
	#reserve-submit .coupon-item .right .price span{
		font-size: 14px;
		margin-right: 2px;
	}
	#reserve-submit .coupon-item .right .condition{
		margin-top: 8px;
	font-size: 12px;
	display: -webkit-box;
	overflow: hidden;
	text-overflow: ellipsis;
	word-wrap: break-word;
	white-space: normal !important;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	padding: 2px;
	color: #808080;
	}
	#reserve-submit .coupon-item .selected-status,#reserve-submit .redPacket-list-item .selected-status{
		position: absolute;
		right: 0;
		bottom: 0;
		width: 31px;
		height: 24px;
	}
	#reserve-submit .coupon-item .selected-status img,#reserve-submit .redPacket-list-item .selected-status img{
		width: 100%;
		height: 100%;
	}
	/*红包弹出层*/
	#reserve-submit .redPacket-list.content-padded{
		margin: 10px;
	}
	#reserve-submit .redPacket-list .row{
		margin-left: -4%;
		overflow: hidden;
	}
	#reserve-submit .redPacket-list .text-right{
		text-align: right;
	}
	#reserve-submit .redPacket-list .redPacket-list-item{
		background: #fff;
		margin-bottom: 12px;
		overflow: hidden;
		position: relative;
	}
	#reserve-submit .redPacket-list .redPacket-list-item .redPacket-list-item-container{
		padding: 25px 16px;
	}
	#reserve-submit .redPacket-list .redPacket-list-item .redPacket-list-item-container.superredpacket-meal{
		border: 2px solid #ff2d4b;
	}
	#reserve-submit .redPacket-list .redPacket-info .col-50{
		width: 46%;
		margin-left: 4%;
		float: left;
	}
	#reserve-submit .redPacket-list .redPacket-info .col-50 .redPacket-title{
		color: #ff2d4b;
		margin: 0;
		font-size: 18px;
	}
	#reserve-submit .redPacket-list .redPacket-info .col-50 .price{
		color: #ff2d4b;
		position: relative;
		margin-top: -4px;
	}
	#reserve-submit .redPacket-list .redPacket-info .col-50 .price .price-num{
		font-size: 22px;
		line-height: 26px;
	}
	#reserve-submit .redPacket-list .redPacket-list-item .redPacket-list-item-container .redPacket-use-limit{
		margin-top: 10px;
		color: #666;
		font-size: 14px;
	}
	#reserve-submit .redPacket-list .row .col-60{
		width: 55.99999999999999%;
		margin-left: 4%;
		float: left;
		white-space:nowrap
	}
	#reserve-submit .redPacket-list .row .col-40{
		width: 36%;
		margin-left: 4%;
		float: left;
	}
	#reserve-submit .redPacket-list .row .col-40 .use-condition{
		margin: 0;
		font-size: 14px;
	}
	#reserve-submit .redPacket-list .redPacket-list-item .redPacket-list-item-container .other-limit{
		font-size: 12px;
		color: #999;
		border-top: 1px dashed #e0e0e0;
		padding-top: 4px;
	}
	#reserve-submit .redPacket-list .redPacket-list-item .circle{
		display: block;
		width: 16px;
		height: 16px;
		background: #f5f5f5;
		position: absolute;
		border-radius: 16px;
		top:50%;
		margin-top: -8px;
		z-index: 20;
	}
	#reserve-submit .redPacket-list .redPacket-list-item .circle.superredpacket-meal{
		border: 2px solid #ff2d4b;
	}
	#reserve-submit .redPacket-list .redPacket-list-item .circle-left{
		left: -8px;
	}
	#reserve-submit .redPacket-list .redPacket-list-item .circle-right{
		right: -8px;
	}
	#reserve-submit .redPacket-list .redPacket-list-item .overdue{
		display: block;
	position: absolute;
	width: 70px;
	height: 70px;
	top: 10px;
	right: 10px;
	background: url(../../../static/img/ws.png);
	background-size: 100%;
	z-index: 100;
	}
	#reserve-submit .redPacket-list .redPacket-list-item .use{
		display: block;
	position: absolute;
	width: 70px;
	height: 70px;
	top: 10px;
	right: 10px;
	background: url(../../../static/img/wu.png);
	background-size: 100%;
	z-index: 100;
	}
	/*提交订单栏*/
	#reserve-submit .order-benefit{
		height: 50px;
		line-height: 50px;
		font-size: 14px;
		padding-left: 15px;
	}
	#reserve-submit .van-submit-bar .van-button{
		background-color: #ff2d4b;
		border-color: #ff2d4b;
		color: #fff;
	}
	#reserve-submit .extre-fee .van-cell,#reserve-submit .discount-box .van-cell{
		padding: 2px 15px;
	}
	#reserve-submit .discount-box .discount-item img{
		width: 16px;
		height: 16px;
		margin-right: 5px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/reserve/create.vue