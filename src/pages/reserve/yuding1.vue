<template>
	<div id="store-paybill">
		<public-header :title="store.title"></public-header>
		<div class="content">
			<div class="list-block">
				<ul>
					<li>
						<div class="item-content">
							<div class="item-inner">
								<div class="item-title">消费总额(元)</div>
								<div class="item-input">
									<input type="number" class="align-right" placeholder="询问服务员后输入" @input="onInput" data-type="total">
								</div>
							</div>
						</div>
					</li>
					<li>
						<div class="check" @click="onToggleStatus('noDiscountShow')">
							<div class="checked" :class="{checked: status.noDiscountShow, active:  status.noDiscountShow}"><van-icon :name=" status.noDiscountShow ? 'check' : ''"></van-icon></div>
							输入不参与优惠金额(如酒水、套餐)
						</div>
					</li>
					<li v-if="status.noDiscountShow">
						<div class="item-content">
							<div class="item-inner">
								<div class="item-title">不参与优惠金额</div>
								<div class="item-input">
									<input type="text" class="align-right" placeholder="询问服务员后输入"@input="onInput" data-type="nodiscount">
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
			<template v-if="paybill_extra == '1'">
				<van-cell-group>
					<van-cell title="包厢/桌号" arrow-direction="down" @click="onToggleStatus('tableShow')">
						<div class="flex c-gray" slot="right-icon">
							<span v-if="table_sn">{{table_sn}}</span>
							<span v-else>请选择桌号</span>
							<van-icon name="arrow-down" class="margin-5-l"></van-icon>
						</div>
					</van-cell>
				</van-cell-group>
				<van-cell-group class="margin-10-t">
					<van-field v-model="note" type="textarea" placeholder="请输入备注，最多50字哦"/>
				</van-cell-group>
			</template>
			<div class="list-block">
				<van-cell-group >
					<van-cell is-link @click="onToggleStatus('couponShow')">
						<div class="van-cell__value">
							<span :class="{'c-danger': couponId > 0}">{{couponTitle}}</span>
						</div>
						<template slot="title">
							<span class="van-cell-text">优惠券</span>
							<van-tag type="danger" v-if="couponNum > 0">{{couponNum}}张可用</van-tag>
						</template>
					</van-cell>
					<van-cell title="实付金额" :value="final" />
				</van-cell-group>
			</div>
			<div class="list-block" v-if="0">
				<van-radio-group v-model="pay_type">
					<van-cell-group>
						<template v-if="payment.length > 0" v-for="item in payment">
							<van-cell :title="item.title" clickable @click="pay_type = item.value">
								<van-radio :name="item.value" />
							</van-cell>
						</template>
					</van-cell-group>
				</van-radio-group>
			</div>
			<div class="list-block">
				<div class="confirm">
					<div @click="onSubmit" class="submit" v-if="total > 0 && total > nodiscount">确认买单</div>
					<div class="submit disabled" v-else>确认买单</div>
				</div>
			</div>
		</div>
		<!-- 代金券弹出层 -->
		<van-popup v-model="status.couponShow" position="bottom" v-if="coupons.length > 0">
			<div class="popup-coupon">
				<div class="popup-title van-hairline--bottom">商家代金券</div>
				<div class="popup-container">
					<load type="loaded" :text="'可用代金券(' + coupons.length + '张)'" bgcolor="#f5f5f5"></load>
					<div class="coupon-list">
						<div class="content-padded">
							<div class="coupon-item" v-for="(item, index) in coupons" :key="item">
								<div class="clearfix" @click="onSelectCoupon(index, item.id)">
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
								<div class="selected-status" v-if="couponId == item.id">
									<img src="static/img/success.png" alt="">
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="popup-cancle van-hairline--top" @click="onSelectCoupon(-1, 0)">不使用代金券</div>
			</div>
		</van-popup>
		<!--选择桌号弹出层-->
		<van-popup v-model="status.tableShow" position="bottom">
			<van-picker
				show-toolbar
				title="请选择桌号"
				:columns="tables"
				value-key="title"
				@cancel="onToggleStatus('tableShow')"
				@confirm="onTableConfirm"
			/>
		</van-popup>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import load from '@/components/load'
	export default {
		data() {
			return {
				store: {},
				tables: [],
				table_sn: '',
				note: '',
				status: {
					noDiscountShow: false,
					couponShow: false,
					tableShow: false
				},
				payment: [],
				pay_type: 'wechat',
				couponNum: 0,
				coupons: [],
				couponId:0,
				condition:0,
				discount_fee: 0,
				total:0,
				nodiscount: 0,
				paybill_extra: ''
			}
		},
		components: {
			PublicHeader,
			load
		},
		computed: {
			final: function () {
				var final = parseFloat(this.total - this.discount_fee);
				if(!final || final < 0) {
					final = 0;
				}
				return final;
			},
			couponTitle: function() {
				var couponTitle = '未使用';
				if(this.couponId) {
					couponTitle = this.discount_fee + '元券';
				}
				return couponTitle;
			}
		},
		watch: {
			nodiscount: function() {
				this.onCalculate();
				this.onGetCoupon();
			},
			discount_fee: function() {
				this.onCalculate();
			},
			total: function() {
				this.onGetCoupon();
				this.onCalculate();
			},
		},
		methods: {
			onInput(e){
				var type = e.target.dataset.type;
				if(type == 'total') {
					this.total = e.target.value;
				}else if(type == 'nodiscount') {
					this.nodiscount = e.target.value;
				}
			},
			onToggleStatus(key) {
				this.status[key] = !this.status[key];
				if(key == 'noDiscountShow' && !this.status.noDiscountShow) {
					this.nodiscount = 0;
				}
			},
			onLoad() {
				this.util.request({
					url: 'wmall/store/paybill/payment',
					data: {
						sid: this.sid,
					}
				}).then((res) => {
					let result = res.data.message.message;
					this.store = result.store;
					this.payment = result.payment;
					this.tables = [...this.tables, ...result.tables];
					this.paybill_extra = result.paybill_extra;
					this.util.setWXTitle(this.store.title);
				})
			},
			onCalculate() {
				this.total = parseFloat(this.total);
				this.discount_fee = parseFloat(this.discount_fee);
				this.nodiscount = parseFloat(this.nodiscount);
				this.canDiscount = this.total - this.nodiscount;
				if(this.couponId > 0 && this.canDiscount < this.condition) {
					this.couponId = 0;
					this.condition = 0;
					this.discount_fee = 0;
				}
				if(this.nodiscount > 0 && this.nodiscount > this.total) {
					this.$toast('超出消费总额,重新输入');
				}
			},
			onGetCoupon() {
				this.canDiscount = this.total - this.nodiscount;
				this.util.request({
					url: 'wmall/store/paybill/coupon',
					data: {
						sid: this.sid,
						sum: this.canDiscount
					}
				}).then((res) => {
					let result = res.data.message;
					this.couponNum = result.num;
					this.coupons = [...result.message];
				})
			},
			onSelectCoupon(index, couponId) {
				this.canDiscount = this.total - this.nodiscount;
				this.couponId = couponId;
				if(couponId > 0 && this.coupons[index].id == couponId) {
					if(this.canDiscount >= this.coupons[index].condition) {
						this.discount_fee = this.coupons[index].discount;
						this.condition = this.coupons[index].condition;
					}
				} else {
					this.discount_fee = 0;
				}
				this.status.couponShow = false;
			},
			onTableConfirm(value) {
				this.table_sn = value.title;
				this.onToggleStatus('tableShow');
			},
			onSubmit() {
				console.log(this.pay_type);
				if(this.total <= 0) {
					this.$toast('消费总额不能为空');
					return false;
				}
				var params = {
					sid: this.sid,
					total_fee: this.total,
					no_discount_part: this.nodiscount,
					couponId: this.couponId,
					table_sn: this.table_sn,
					note: this.note
				}
				this.util.request({
					url: 'wmall/store/paybill/index',
					data: params,
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message, '', 1000);
						return false;
					}
					var order_id = result.message;
					this.$router.replace(this.util.getUrl({path: '/pages/public/pay?order_id=' + order_id + '&order_type=paybill'}));

				})
			}
		},
		created() {
			this.query = this.$route.query;
			if(this.query) {
				this.sid = this.query.sid;
			}
		},
		mounted () {
			this.onLoad()
		},
	}
</script>

<style>
	#store-paybill .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#store-paybill .content::-webkit-scrollbar {
		display: none;
	}
	#store-paybill .content .list-block{
		margin: 8px 0;
	}
	#store-paybill .content .list-block ul{
		position: relative;
		padding: 0;
		margin: 0;
		list-style: none;
		background-color: #f5f5f5;
	}
	#store-paybill .content .list-block ul li{
		position: relative;
		box-sizing: border-box;
		list-style: none;
		margin: 0;
		padding: 0;
	}
	#store-paybill .content .list-block ul li .item-content{
		margin: 10px 10px;
		border: 1px solid #ccc;
		border-radius: 4px;
		background-color: #fff;
		display: -webkit-flex;
		display: flex;
		padding-left: 15px;
		justify-content: space-between;
	}
	#store-paybill .content .list-block ul li .item-content .item-inner{
		padding: 8px 0 7px;
		margin-right: 15px;
		width: 100%;
		display: flex;
		justify-content: space-between;
	}
	#store-paybill .content .list-block ul li .item-content .item-inner .item-title{
		position: relative;
		width: 40%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin: 4px 0;
		flex-shrink: 0;
		line-height: 25px;
	}
	#store-paybill .content .list-block ul li .item-content .item-inner .item-input{
		position: relative;
		width: 100%;
		margin-top: -8px;
		margin-bottom: -7px;
		-webkit-box-flex: 1;
		flex-shrink: 1;
	}
	#store-paybill .content .list-block ul li .item-content .item-inner .item-input input{
		display: block;
		width: 100%;
		height: 48px;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		-webkit-appearance: none;
		padding: 0 8px 0 5px;
		margin: 0;
		font-family: inherit;
		font-size: 17px;
		color: #3d4145;
		background: #fff;
		border: none;
		border-radius: 0;
		box-shadow: none;
		text-align: right;
	}
	#store-paybill .content .list-block ul li .check{
		position: relative;
		padding: 0 10px;
		display: flex;
		-webkit-box-align: center;
		align-items: center;
		transition-duration: 300ms;
		transition-property: background-color;
		position: relative;
		font-size: 15px;
		vertical-align: middle;
		color: #999;
		line-height: 21px;
	}
	#store-paybill .content .list-block ul li .check .checked{
		width: 14px;
		height: 14px;
		background: #fff;
		border: 1px solid #bbb;
		border-radius: 3px;
		margin-right: 10px;
		position: relative;
	}
	#store-paybill .content .list-block ul li .check .checked.active{
	    border: 1px solid #FF2D4B;
	    color: #FF2D4B;
	}
	#store-paybill .content .list-block ul li .check .checked .van-icon{
		position: absolute;
		top: 1px;
		right: 1px;
		font-size: 11px;
	}
	#store-paybill .content .list-block .van-cell .van-cell__title .van-hairline--surround{
		color: #fff;
		background-color: #FF2D4B;
		padding: 0 3px;
		font-size: 14px;
		display: inline-block;
		border-radius: 0;
	}
	#store-paybill .content .list-block .van-cell .van-cell__title span{
		font-size: 17px;
	}
	#store-paybill .content .list-block .van-cell .van-cell__value span{
		font-size: 17px;
	}
	#store-paybill .content .list-block .van-cell-group .van-cell:last-child .van-cell__value span{
		color: #FF2D4B;
		font-weight: bold;
	}
	#store-paybill .content .list-block .van-radio-group .van-cell__value .van-radio__input{
		width: 24px;
		height: 24px;
	}
	#store-paybill .content .list-block .van-radio-group .van-cell__value .van-radio__input .van-icon-checked{
		color: #fff;
		background: #FF2D4B;
		position: relative;
		width: 22px;
		height: 22px;
		line-height: 24px;
		border-radius: 22px;
		font-size: 14px;
		text-align: center;
	}
	#store-paybill .content .list-block .van-radio-group .van-cell__value .van-radio__input .van-icon-check{
		color: #fff;
		position: relative;
		width: 21px;
		height: 21px;
		line-height: 24px;
		border: 1px solid #c7c7cc;
		border-radius: 21px;
		font-size: 14px;
		text-align: center;
	}
	#store-paybill .content .list-block .confirm{
		text-align: center;
		margin-top: 10px;
	}
	#store-paybill .content .list-block .confirm .submit{
		display: inline-block;
		width: 90%;
		border-radius: 4px;
		color: #fff;
		height: 44px;
		line-height: 44px;
		background-color: #FF2D4B;
	}
	#store-paybill .content .list-block .confirm .submit.disabled{
		background-color: #ccc;
	}
	/*代金券弹出层*/
	#store-paybill .popup-coupon{
		width: 100%;
		height: 400px;
		overflow: hidden;
	}
	#store-paybill .popup-coupon .popup-cancle{
		width: 100%;
		height:50px;
		text-align:center;
		line-height:50px;
		font-size:16px;
		color:#FFD161;
	}
	#store-paybill .popup-coupon .popup-title{
		width: 100%;
		height: 50px;
		text-align: center;
		font-size: 16px;
		line-height: 50px;
	}
	#store-paybill .popup-coupon .popup-container{
		width: 100%;
		height: 300px;
		overflow-y: auto;
		background: #f5f5f5;
	}
	#store-paybill .popup-coupon .popup-container::-webkit-scrollbar{
		width: 0px;
		height: 0px;
	}
	#store-paybill .coupon-list{
		padding: 0px 10px 10px;
	}
	#store-paybill .coupon-list .content-padded{
		margin: 10px;
	}
	#store-paybill .coupon-list .content-padded .coupon-item{
		background: #fff;
		margin-top: 12px;
		overflow: hidden;
		padding: 16px;
		position: relative;
	}
	#store-paybill .coupon-item .clearfix{
		overflow: hidden;
	}
	#store-paybill .coupon-item .clearfix .circle{
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
	#store-paybill .coupon-item .clearfix .circle-left{
		left: -8px;
	}
	#store-paybill .coupon-item .clearfix .circle-right{
		right: -8px;
	}
	#store-paybill .coupon-item .clearfix .overdue{
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
	#store-paybill .coupon-item .clearfix .use{
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
	#store-paybill .coupon-item .left{
		width: 70%;
		float: left;
	}
	#store-paybill .coupon-item .left .store-logo{
		display: inline-block;
		float: left;
		width: 32%;
	}
	#store-paybill .coupon-item .left .store-logo img{
		display: inline-block;
		width: 56px;
		height: 56px;
		margin-top: 4px;
	}
	#store-paybill .coupon-item .left .coupon-detail{
		display: inline-block;
		float: left;
		width: 60%;
	}
	#store-paybill .coupon-item .left .coupon-detail .coupon-title{
		font-weight: bold;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #ff2d4b;
		margin-top: 3px;
	}
	#store-paybill .coupon-item .left .coupon-detail .use-time{
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #808080;
		margin-top: 16px;
	}
	#store-paybill .coupon-item .right{
		width: 29%;
		border-left: 1px dashed #ccc;
		text-align: center;
		float: right;
	}
	#store-paybill .coupon-item .right .price{
		color: #ff2d4b;
		font-size: 24px;
	}
	#store-paybill .coupon-item .right .price span{
		font-size: 14px;
		margin-right: 2px;
	}
	#store-paybill .coupon-item .right .condition{
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
	#store-paybill .coupon-item .selected-status{
		position: absolute;
		right: 0;
		bottom: 0;
		width: 31px;
		height: 24px;
	}
	#store-paybill .coupon-item .selected-status img{
		width: 100%;
		height: 100%;
	}
	#store-paybill .text .van-field{
		padding: 15px;
	}
	#store-paybill textarea{
		background-color: #f5f5f5;
		height: 100px;
		border:1px solid #ECECEC;
		padding:10px;
		font-size: 16px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/store/paybill.vue