<template>
	<div id="tangshi-order-create">
		<public-header title="订单确认"></public-header>
		<div class="content" :style="{bottom: order.order_type == 1 && address && address.address ? '88px' : '50px'}">
			<div class="content-scroll">
				<van-field class="border-0px" v-model="person_num" label="来客人数" placeholder="请输入用餐人数"/>
        <van-field class="border-0px" v-model="tempcount" value="tempcount" style="display: none;"/>
				<div class="order-food">
					<div class='order-food-title'>
						<div class='food-shop'>{{store.title}}</div>
					</div>
					<div class="food-list">
						<template v-for="item in cart.data">
							<template v-for="option in item">
                <van-card  v-if="store.pindan_status==0 && cart.pindan_id==0 && option.goods_id != '88888'">
                  <div slot="title" class="food-title">
										<div class="left" >
											<img class="activity-img" src="static/img/bargain_b.png" alt="" v-if="option.bargain_id > 0">
											{{option.title}}
										</div>
										<div class="right" v-if="option.pay_type == 1 ">¥{{option.total_discount_price}}</div>
										<!-- <div class="right" v-if="option.pay_type == 2 ">（酒币）¥{{option.integral}}</div> -->
									</div>
									<div slot="desc" class="food-desc">
										<div class="left">x{{option.num}}</div>
										<div class="">¥{{option.total_price}}</div>
									</div>
								</van-card>


                <van-card :thumb="option[0].buythumb" v-if="store.pindan_status==1 && cart.pindan_id>0 && option.goods_id != '88888'">
                  <div slot="title" class="food-title">
                		<div class="left">
                			<img class="activity-img" src="static/img/bargain_b.png" alt="" v-if="option[0].bargain_id > 0">
                			{{option[0].title}}
                		</div>
                		<div class="right" v-if="option[0].pay_type == 1 ">¥{{option[0].total_discount_price}}</div>
                	</div>
                	<div slot="desc" class="food-desc">

                		<div class="">¥{{option[0].total_price}}</div>
                	</div>
                  <div slot="footer">
                      <van-button size="mini" @click="handleGoods(option[0].buyuid,option[0].goods_id,0)">-</van-button>
                      <van-button size="mini">{{option[0].num}}</van-button>
                      <van-button size="mini" @click="handleGoods(option[0].buyuid,option[0].goods_id,1)">+</van-button>
                  </div>
                </van-card>
							</template>
						</template>
					</div>
					<van-cell-group class="extre-fee border-0px">
						<van-cell title="服务费" class="border-0px">
							<template slot="right-icon">￥{{order.serve_fee}}</template>
						</van-cell>
					</van-cell-group>
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
						<van-cell title="平台红包" class="border-0px">
							<template slot="right-icon" v-if="order.redpacket && order.redpacket.id > 0">
								<span class="c-danger" @click="onChangePopup('redPacket')">-￥{{order.redpacket.discount}}</span>
							</template>
							<template slot="right-icon" v-else>
								<span class="c-danger" v-if="redPackets && redPackets.length > 0" @click="onChangePopup('redPacket')">
									{{redPackets.length}}个可用红包
								</span>
								<span class="c-disabled" v-else>
									暂无可用红包
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
								</div><!--
                <div class='discount-fee'>此金额不包含餐具费</div> -->
							</div>

						</van-cell>
					</van-cell-group>
				</div>
				<div class="order-region">
					<van-cell-group>
						<van-cell title="支付方式" >
							<div slot="right-icon" class="c-disabled">在线支付</div>
						</van-cell>
						<van-cell class="flex-lr" title="备注/发票" :to="util.getUrl({path: '/tangshi/pages/table/note', query: { sid: sid}})">
							<div slot="right-icon" class="note flex-lr">
								<div class="note-text" v-if="orderExtra.note || order.note">
									{{orderExtra.note || order.note}}
								</div>
								<span class="c-disabled" v-else>口味、偏好等要求</span>
								<i class="van-icon van-icon-arrow van-cell__right-icon"></i>
							</div>
						</van-cell>
					</van-cell-group>
				</div>
			</div>
		</div>

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
                      <div v-if="item.yh_type==2">
											 {{item.zhekou}}<span>折</span>
                      </div>
                      <div v-if="item.yh_type==1">
                       <span>￥</span>{{item.discount}}
                      </div>
                      <div v-if="item.yh_type==3" style="font-size: 14px;line-height: 20px;">
                       <div v-if="item.activity_info.yuejine>0">返{{item.activity_info.yuejine}}余额</div>
                        <div v-if="item.activity_info.jifeng>0">返{{item.activity_info.jifeng}}积分</div>
                        <div v-if="item.activity_info.xianjin>0">返{{item.activity_info.xianjin}}现金</div>
                      </div>
										</div>

                    <div v-if="item.yh_type!=3">
										<div class="condition">满{{item.condition}}元可用</div>
                    </div>
                    <div v-if="item.yh_type==3">
                    <div class="condition">满{{item.condition}}元<span class="c-danger">立返</span></div>
                    </div>

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

		<!-- 红包弹出层 -->
		<van-popup v-model="popup.redPacket" position="bottom" v-if="redPackets && redPackets.length > 0">
			<div class="popup-redpacket">
				<div class="popup-title van-hairline--bottom">平台红包</div>
				<div class="popup-container">
					<load type="loaded" :text="'可用红包(' + redPackets.length + '个)'" bgcolor="#f5f5f5"></load>
					<div class="redPacket-list content-padded" v-for="item in redPackets">
						<div class="redPacket-list-item" @click="onSelectRedpacket(item.id)">
							<div class="redPacket-list-item-container">
								<div class="redPacket-info row">
									<div class="col-50">
										<span class="redPacket-title">{{item.title}}</span>
									</div>
									<div class="col-50 text-right">
										<div class="price">￥<span class="price-num">{{item.discount}}</span></div>
									</div>
								</div>
								<div class="redPacket-use-limit row">
									<div class="col-60">{{item.day_cn}}</div>
									<div class="col-40 text-right">
										<p class="use-condition">满{{item.condition}}元可用</p>
									</div>
								</div>
							</div>
							<span class="circle circle-left"></span>
							<span class="circle circle-right"></span>
							<div class="selected-status" v-if="order.redpacket && item.id == order.redpacket.id">
								<img src="static/img/success.png" alt="">
							</div>
						</div>
					</div>
				</div>
				<div class="popup-cancle van-hairline--top" @click="onSelectRedpacket(0)">不使用红包</div>
			</div>
		</van-popup>

		<van-submit-bar :disabled="!islegal" :price="order.final_fee * 100" label="待支付" button-text="提交订单" @submit="onSubmit">
			<div slot="default" class="order-benefit">
				已优惠 ¥{{order.discount_fee}}
			</div>
		</van-submit-bar>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>


</template>


<script>

  //const ws = new WebSocket("ws://localhost:3000");
	import {mapState, mapMutations} from 'vuex'
	import Load from '@/components/load'
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	export default {

		data() {
			return {
				showPreLoading: true,
				popup:{
					coupon: false,
					redPacket: false,
				},
				person_num: '',
				store:{},
				cart:{},
				coupons: [],
				redPackets: [],
				order: {},
				islegal: false,
        tempcount:0,
        websocketObj:null
			}
		},
		components: {
			PublicFooter,
			PublicHeader,
			Load
		},
		computed: {
			...mapState([
				'orderExtra'
			]),
		},
		methods: {
			...mapMutations([
				'setOrderExtra', 'replaceOrderExtra'
			]),

      //加商品
      handleGoods(uid,goodsid,type){
          this.onHandleGoods(uid,goodsid,type);
      },

			onSelectCoupon(id) {
				this.setOrderExtra({key: 'coupon_id', val: id});
				this.onChangePopup('coupon');
				this.onCalculate();
			},

			onSelectRedpacket(id) {
        //console.log(123);
				this.setOrderExtra({key: 'redpacket_id', val: id});
				this.onChangePopup('redPacket');
				this.onCalculate();
			},

			onChangePopup(key) {
				this.popup[key] = !this.popup[key];
			},
      onHandleGoods(uid,goods_id,type){
          var params = {
            sid: this.sid,
            buyuid:uid,
            goods_id:goods_id,
            type:type
          };
          this.util.request({
            url: 'wmall/store/table/pindan_handle',
            data: params
          }).then((res) => {

            this.showPreLoading = false;
            let result = res.data.message;
            if(result.errno) {
            	this.util.$toast(result.message, './goods?sid=' + this.sid + '&table_id='+this.table_id, 1000, 'replace');
            	return false;
            }
            result = result.message;
            var tempExtra = Object.assign(this.orderExtra, {
            	note: result.order.note,
            	invoice_id: result.order.invoiceId,
            	table_id: this.table_id,
            });
            this.replaceOrderExtra(tempExtra);
            this.person_num = this.orderExtra.person_num ? this.orderExtra.person_num : '';
            this.store = result.store;
            this.cart = result.cart;
            this.activityed = result.activityed,
            this.coupons = result.coupons;

            this.redPackets = result.redPackets;
            this.order = result.order;
            this.islegal = result.islegal == 1;

          })
      },

			onCalculate() {

        console.log(this.orderExtra,'测试');
				var params = {
					sid: this.sid,
					extra: this.orderExtra
				};
         console.log(params);
				this.util.request({
					url: 'wmall/store/table/create',
					data: params,
				}).then((res) => {

					let result = res.data.message.message;
					this.order = result.order;
					this.activityed = result.activityed;
					this.islegal = result.islegal == 1;
				})
			},

			onSubmit() {
				if(!this.islegal) {
					return false;
				}

        if(!this.person_num || isNaN(this.person_num)==true || this.person_num<=0){
           this.util.$toast("请正确填写来客人数");
           return false;
        }

        this.islegal = false;

				var params = {
					sid: this.sid,
					table_id: this.table_id,
					extra: this.orderExtra,
          pindan_id:this.pindan_id
				};


				this.util.request({
					url: 'wmall/store/table/submit',
					data: params,
				}).then((res) => {
					let result = res.data.message;


					if(result.errno) {
						this.util.$toast(result.message, '', 1000);
						return false;
					}

          var order_id = result.message;
          if(order_id>0){
            this.$router.replace(this.util.getUrl({path: '/pages/public/pay?order_id=' + order_id + '&order_type=takeout'}));
          }
          return false;

				})
			},

			onLoad() {
				if(!this.table_id) {
					this.table_id = this.orderExtra.table_id;
				}

        var current_route = this.$route.query;
        //this.person_num = current_route.tempmeals;

				var params = {
					sid: this.sid,
					extra: this.orderExtra,
          pindan_id:this.pindan_id
				};
				this.util.request({
					url: 'wmall/store/table/create',
					data: params,
				}).then((res) => {

          console.log(res);

					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message, './goods?sid=' + this.sid + '&table_id='+this.table_id, 1000, 'replace');
						return false;
					}
					result = result.message;
					var tempExtra = Object.assign(this.orderExtra, {
						note: result.order.note,
						invoice_id: result.order.invoiceId,
						table_id: this.table_id,
            coupon_id: result.order.coupon.id
					});
					this.replaceOrderExtra(tempExtra);
					this.person_num = this.orderExtra.person_num ? this.orderExtra.person_num : current_route.tempmeals;
					this.store = result.store;

					this.cart = result.cart;


					this.activityed = result.activityed,
					this.coupons = result.coupons;
          console.log(result.coupons);
					this.redPackets = result.redPackets;
					this.order = result.order;

					this.islegal = result.islegal == 1;


				})
			}
		},
		watch: {
			person_num() {
				this.setOrderExtra({key: 'person_num', val: this.person_num});
			}
		},
		created(){
			this.query = this.$route.query;

			if(this.query) {
				this.sid = this.query.sid;
				this.table_id = this.query.table_id;
			  this.pindan_id = this.query.pindan_id;
			}
		},

		mounted () {
			this.onLoad();
		},
	}
</script>

<style>
	/*整体结构*/
	#tangshi-order-create .content{
		width: 100%;
		box-sizing: border-box;
		padding: 10px;
		bottom: 88px;
		overflow: hidden;
		background-color: #f5f5f5;
	}
	#tangshi-order-create .content .content-scroll{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow-y: auto;
		overflow-x: hidden;
	}
	#tangshi-order-create .content .content-scroll::-webkit-scrollbar {
		display: none;
	}
	/*详情*/
	#tangshi-order-create .order-food{
		background-color: #fff;
		margin-top: 10px;
	}
	#tangshi-order-create .order-food .order-food-title{
		position: relative;
		height: 50px;
		line-height: 50px;
		padding: 0 15px;
		color: #898989;
		font-size: 14px;
		overflow: hidden;
	}
	#tangshi-order-create .order-food .order-food-title .food-shop{
		float: left;
		box-sizing: border-box;
		padding-right: 75px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#tangshi-order-create .order-food .order-food-title .order-tips-thirpart{
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
	#tangshi-order-create .order-food .order-food-title .order-tips-thirpart::before,#tangshi-order-create .order-food .order-food-title .order-tips-thirpart::after{
		content: "";
		position: absolute;
		border: 2px solid #fff;
	}
	#tangshi-order-create .order-food .order-food-title .order-tips-thirpart::before{
		left: 0;
		top: 0;
		border-color: #fff #ff2d4b #ff2d4b #fff;
	}
	#tangshi-order-create .order-food .order-food-title .order-tips-thirpart::after{
		right: 0;
		bottom: 0;
		border-color: #ff2d4b #fff #fff #ff2d4b;
	}
	#tangshi-order-create .food-list .van-card{
		height: 75px;
		padding: 10px;
		margin-bottom: 10px;
	}
	#tangshi-order-create .food-list .van-card .van-card__header .van-card__content{
		height: auto;
	}
	#tangshi-order-create .food-list .van-card:last-child{
		margin-bottom: 0;
	}
	#tangshi-order-create .food-list .van-card .van-card__thumb{
		top: 0px;
		left: 0px;
		width: 55px;
		height: 55px;
    border: 2px solid rgb(250, 150, 50);
    border-radius: 50%;
    overflow: hidden;
	}
	#tangshi-order-create .food-list .van-card .food-title,#tangshi-order-create .food-list .van-card .food-desc{
		display: flex;
		flex-flow: row nowrap;
		align-item: center;
		justify-content: space-between;
	}
	#tangshi-order-create .food-list .van-card .food-title .left{
		display: flex;
		flex-flow: row nowrap;
		align-item: center;
	}
	#tangshi-order-create .food-list .van-card .food-title .activity-img{
		width: 15px;
		height: 15px;
		margin-right: 4px;
		margin-top: 1px;
	}
	#tangshi-order-create .food-list .van-card .food-desc{
		font-size: 12px;
		color: #999;
		margin-top: 5px;
	}
	#tangshi-order-create .food-list .van-card .food-desc .right{
		text-decoration: line-through;
	}
	#tangshi-order-create .discount-box .van-cell__value{
		color: #F95339;
	}
	#tangshi-order-create .order-pay-info{
		font-size: 14px;
		position: relative;
	}
	#tangshi-order-create .order-pay-info .pay-price{
		display: inline-block;
		float: right;
		line-height: 24px;
	}
	#tangshi-order-create .order-pay-info .pay-price div{
		display: inline-block;
		color: #F95339;
		font-size: 16px;
	}
	#tangshi-order-create .order-pay-info .total-original{
		display: inline-block;
		float: right;
		line-height: 24px;
		margin-right: 10px;
		color: #898989;
		font-size: 12px;
	}
	#tangshi-order-create .order-pay-info .discount-fee{
		display: inline-block;
		float: right;
		line-height: 24px;
		margin-right: 10px;
		color: #898989;
		font-size: 12px;
	}
	#tangshi-order-create .order-region{
		margin-top: 10px;
		background: #fff;
	}
	#tangshi-order-create .checkbox .van-icon{
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border:1px solid #ccc;
		vertical-align: middle;
		text-align: center;
		line-height: 16px;
	}
	#tangshi-order-create .checkbox .van-icon.checked{
		border: 1px solid #ff2d4b;
		background-color: #ff2d4b;
		color: #fff;
	}
	#tangshi-order-create .plateform-box .van-cell__value span, #tangshi-order-create .instore-box .van-cell__value span{
		font-size: 18px;
		font-weight: bold;
	}
	#tangshi-order-create .plateform-box .van-cell__left-icon,#tangshi-order-create .instore-box .van-cell__left-icon{
		font-size: 16px;
	}
	#tangshi-order-create .plateform-inner .van-icon-plus{
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
	#tangshi-order-create .plateform-inner .addrress-select .van-cell__title{
		color: #ff2d4b;
	}
	#tangshi-order-create .instore-box{
		margin-top: 10px;
	}
	#tangshi-order-create .store-title{
		font-size:12px;
		color: #999;
	}
	#tangshi-order-create .store-address .van-icon{
		line-height: 48px;
	}
	/*地址弹出层*/
	#tangshi-order-create .popup-address .address-list{
		height: 350px;
	}
	#tangshi-order-create .popup-address .van-address-list__group::-webkit-scrollbar{
		width: 0px;
		height: 0px;
	}
	#tangshi-order-create .van-address-list .van-radio__input .van-icon{
		border: 1px solid #ccc;
		border-radius: 15px;
	}
	#tangshi-order-create .van-address-list .van-radio__input .van-icon-checked{
		color: #FFF;
		background-color: #38f;
		border-color: #38f;
	}
	#tangshi-order-create .van-address-list .van-icon-check {
		color: #FFF;
	}
	#tangshi-order-create .order-region .note{
		max-width: 75%;
	}
	#tangshi-order-create .order-region .note .note-text{
		max-width: 90%;
	}
	/*时间弹出层*/
	#tangshi-order-create .popup-time, #tangshi-order-create .popup-coupon, #tangshi-order-create .popup-redpacket{
		width: 100%;
		height: 400px;
		overflow: hidden;
	}
	#tangshi-order-create .popup-time .popup-container{
		width: 100%;
		height:350px;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
	}
	#tangshi-order-create .popup-time .popup-container .left{
		width: 35%;
		height: 100%;
		overflow-y: auto;
		background-color: #f5f5f5;
	}
	#tangshi-order-create .popup-time .popup-container .right{
		width: 65%;
		height: 100%;
		overflow-y: auto;
	}
	#tangshi-order-create .popup-time .popup-container .left::-webkit-scrollbar,#tangshi-order-create .popup-time .popup-container .right::-webkit-scrollbar{
		width: 0px;
		height: 0px;
	}
	.popup-time .left .date-item{
		width: 100%;
		height: 44px;
		text-align: center;
		line-height: 44px;
		box-sizing: border-box;
		background-color: #fff;
	}
	.popup-time .right .van-cell.active{
		color: #ff2d4b;
	}
	.popup-time .right .van-icon{
		color: #fff;
		font-size: 16px;
	}
	.popup-time .right .van-icon.active{
		color: #ff2d4b;
	}
	#tangshi-order-create .popup-time .popup-cancle, #tangshi-order-create .popup-coupon .popup-cancle, #tangshi-order-create .popup-redpacket .popup-cancle{
		width: 100%;
		height:50px;
		text-align:center;
		line-height:50px;
		font-size:16px;
		color:#FF2D4B;
	}
	/*代金券弹出层*/
	#tangshi-order-create .popup-coupon .popup-title,#tangshi-order-create .popup-redpacket .popup-title{
		width: 100%;
		height: 50px;
		text-align: center;
		font-size: 16px;
		line-height: 50px;
	}
	#tangshi-order-create .popup-coupon .popup-container,#tangshi-order-create .popup-redpacket .popup-container{
		width: 100%;
		height: 300px;
		overflow-y: auto;
		background: #f5f5f5;
	}
	#tangshi-order-create .popup-coupon .popup-container::-webkit-scrollbar,#tangshi-order-create .popup-redpacket .popup-container::-webkit-scrollbar{
		width: 0px;
		height: 0px;
	}
	#tangshi-order-create .coupon-list{
		padding: 0px 10px 10px;
	}
	#tangshi-order-create .coupon-list .content-padded{
		margin: 10px;
	}
	#tangshi-order-create .coupon-list .content-padded .coupon-item{
		background: #fff;
		margin-top: 12px;
		overflow: hidden;
		padding: 16px;
		position: relative;
	}
	#tangshi-order-create .coupon-item .clearfix{
		overflow: hidden;
	}
	#tangshi-order-create .coupon-item .clearfix .circle{
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
	#tangshi-order-create .coupon-item .clearfix .circle-left{
		left: -8px;
	}
	#tangshi-order-create .coupon-item .clearfix .circle-right{
		right: -8px;
	}
	#tangshi-order-create .coupon-item .clearfix .overdue{
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
	#tangshi-order-create .coupon-item .clearfix .use{
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
	#tangshi-order-create .coupon-item .left{
		width: 70%;
		float: left;
	}
	#tangshi-order-create .coupon-item .left .store-logo{
		display: inline-block;
	float: left;
	width: 32%;
	}
	#tangshi-order-create .coupon-item .left .store-logo img{
		display: inline-block;
		width: 56px;
		height: 56px;
		margin-top: 4px;
	}
	#tangshi-order-create .coupon-item .left .coupon-detail{
		display: inline-block;
	float: left;
	width: 60%;
	}
	#tangshi-order-create .coupon-item .left .coupon-detail .coupon-title{
		font-weight: bold;
		width: 100%;
		overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: #ff2d4b;
	margin-top: 3px;
	}
	#tangshi-order-create .coupon-item .left .coupon-detail .use-time{
		font-size: 12px;
		overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	color: #808080;
	margin-top: 16px;
	}
	#tangshi-order-create .coupon-item .right{
		width: 29%;
		border-left: 1px dashed #ccc;
		text-align: center;
		float: right;
	}
	#tangshi-order-create .coupon-item .right .price{
		color: #ff2d4b;
	font-size: 24px;
	}
	#tangshi-order-create .coupon-item .right .price span{
		font-size: 14px;
		margin-right: 2px;
	}
	#tangshi-order-create .coupon-item .right .condition{
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
	#tangshi-order-create .coupon-item .selected-status,#tangshi-order-create .redPacket-list-item .selected-status{
		position: absolute;
		right: 0;
		bottom: 0;
		width: 31px;
		height: 24px;
	}
	#tangshi-order-create .coupon-item .selected-status img,#tangshi-order-create .redPacket-list-item .selected-status img{
		width: 100%;
		height: 100%;
	}
	/*红包弹出层*/
	#tangshi-order-create .redPacket-list.content-padded{
		margin: 10px;
	}
	#tangshi-order-create .redPacket-list .row{
		margin-left: -4%;
		overflow: hidden;
	}
	#tangshi-order-create .redPacket-list .text-right{
		text-align: right;
	}
	#tangshi-order-create .redPacket-list .redPacket-list-item{
		background: #fff;
		margin-bottom: 12px;
		overflow: hidden;
		position: relative;
	}
	#tangshi-order-create .redPacket-list .redPacket-list-item .redPacket-list-item-container{
		padding: 25px 16px;
	}
	#tangshi-order-create .redPacket-list .redPacket-list-item .redPacket-list-item-container.superredpacket-meal{
		border: 2px solid #ff2d4b;
	}
	#tangshi-order-create .redPacket-list .redPacket-info .col-50{
		width: 46%;
		margin-left: 4%;
		float: left;
	}
	#tangshi-order-create .redPacket-list .redPacket-info .col-50 .redPacket-title{
		color: #ff2d4b;
		margin: 0;
		font-size: 18px;
	}
	#tangshi-order-create .redPacket-list .redPacket-info .col-50 .price{
		color: #ff2d4b;
		position: relative;
		margin-top: -4px;
	}
	#tangshi-order-create .redPacket-list .redPacket-info .col-50 .price .price-num{
		font-size: 22px;
		line-height: 26px;
	}
	#tangshi-order-create .redPacket-list .redPacket-list-item .redPacket-list-item-container .redPacket-use-limit{
		margin-top: 10px;
		color: #666;
		font-size: 14px;
	}
	#tangshi-order-create .redPacket-list .row .col-60{
		width: 55.99999999999999%;
		margin-left: 4%;
		float: left;
		white-space:nowrap
	}
	#tangshi-order-create .redPacket-list .row .col-40{
		width: 36%;
		margin-left: 4%;
		float: left;
	}
	#tangshi-order-create .redPacket-list .row .col-40 .use-condition{
		margin: 0;
		font-size: 14px;
	}
	#tangshi-order-create .redPacket-list .redPacket-list-item .redPacket-list-item-container .other-limit{
		font-size: 12px;
		color: #999;
		border-top: 1px dashed #e0e0e0;
		padding-top: 4px;
	}
	#tangshi-order-create .redPacket-list .redPacket-list-item .circle{
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
	#tangshi-order-create .redPacket-list .redPacket-list-item .circle.superredpacket-meal{
		border: 2px solid #ff2d4b;
	}
	#tangshi-order-create .redPacket-list .redPacket-list-item .circle-left{
		left: -8px;
	}
	#tangshi-order-create .redPacket-list .redPacket-list-item .circle-right{
		right: -8px;
	}
	#tangshi-order-create .redPacket-list .redPacket-list-item .overdue{
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
	#tangshi-order-create .redPacket-list .redPacket-list-item .use{
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
	#tangshi-order-create .order-benefit{
		height: 50px;
		line-height: 50px;
		font-size: 14px;
		padding-left: 15px;
	}
	#tangshi-order-create .van-submit-bar .van-button{
		background-color: #ff2d4b;
		border-color: #ff2d4b;
		color: #fff;
	}
	#tangshi-order-create .extre-fee .van-cell,#tangshi-order-create .discount-box .van-cell{
		padding: 2px 15px;
	}
	#tangshi-order-create .discount-box .discount-item img{
		width: 16px;
		height: 16px;
		margin-right: 5px;
	}
  .van-card__footer{
    margin-top:-20px;
  }
</style>


// WEBPACK FOOTER //
// src/pages/table/create.vue
