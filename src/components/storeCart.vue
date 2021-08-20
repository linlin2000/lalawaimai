<template>
	<div id="store-cart">
		<template v-if="show == 1">
			<template v-if="istore.is_rest == 0">
				<template v-if="from == 'table'">
					<div class="rest" v-if="istore.is_meal != 1">店内点餐暂未开启</div>
					<div class="rest" v-else-if="!table">桌号不存在</div>
					<div class="rest" v-else-if="table && table.status > 1 && (!table.jiacai_id || table.jiacai_id <= 0)">此桌已开台</div>
				</template>
				<div class="cart">

          <!--张月芳 堂食购物车-->
					<template v-if="from == 'table'">
						<div class='cart-tips' v-if="table && (table.status == 1 || table.jiacai_id > 0)">
							<div class="cart-icon" ref="cart_icon" :class="{active: cartTotalNum > 0}" @click="popupCart = (!popupCart && icart && icart.num > 0)">
								<van-icon name="cart1"></van-icon>
								<div class="cart-num" v-if="cartTotalNum > 0">{{cartTotalNum}}</div>
							</div>
							<div class='cart-empty' v-if="cartTotalNum == 0">
								购物车空空如也~~
							</div>
							<div class="cart-noempty" v-else-if="cartTotalNum > 0">
								<div class="cart-price">¥{{cartTotalPrice}}</div>
							</div>
						</div>
						<div class='cart-btns' v-if="table">
							<div class='cart-btn-unavail'>
								<div class="inner" v-if="!cartTotalNum || cartTotalNum == 0">未点菜</div>
							</div>
							<div @click="util.jspost({url: 'wmall/store/table/jiacai', data: {order_id: table.order_id, sid: istore.id,time_stamp:time_stamp}, confirm: '确定加菜吗?', successUrl: '/pages/order/detail/'+table.order_id})" class="cart-btn-confirm" v-if="table.jiacai_id > 0">
								<div class="inner">加菜</div>
							</div>


              <div class="cart-btn-confirm" v-if="cartIsSubmit==0"><div class="inner" @click="require_cate()">去结算</div></div>
              <div v-if="cartIsSubmit==1" >
							<router-link :to="util.getUrl({'path': '/tangshi/pages/table/create', query: {sid: istore.id, table_id: table.id,pindan_id:icart.pindan_id,tempmeals:tempmeals}})" class="cart-btn-confirm" v-if="cartSendCondition <= 0">
								<div class="inner">去结算</div>
							</router-link>
              </div>
						</div>
					</template>
					<template v-else-if="from == 'reserve'">
						<div class='cart-tips'>
							<div :style="{background:sysstyle}" class="cart-icon" ref="cart_icon" :class="{active: cartTotalNum > 0}" @click="popupCart = (!popupCart && icart && icart.num > 0)">
								<van-icon name="cart1"></van-icon>
								<div class="cart-num" v-if="cartTotalNum > 0">{{cartTotalNum}}</div>
							</div>
							<div class='cart-empty' v-if="cartTotalNum == 0">
								购物车空空如也~~
							</div>
							<div class="cart-noempty" v-else-if="cartTotalNum > 0">
								<div class="cart-price">¥{{cartTotalPrice}}</div>
							</div>
						</div>
						<div class='cart-btns'>
							<div class='cart-btn-unavail'>
								<div class="inner" v-if="cartSendCondition > 0">还差¥{{cartSendCondition}}</div>
							</div>
							<router-link :to="util.getUrl({'path': '/tangshi/pages/reserve/create', query: {sid: this.istore.id}})" class="cart-btn-confirm" v-if="cartSendCondition <= 0">
								<div class="inner">去结算</div>
							</router-link>
						</div>
					</template>
					<template v-else>
						<div class='cart-tips'>
							<div :style="{background:sysstyle}" class="cart-icon" ref="cart_icon" :class="{active: cartTotalNum > 0}" @click="popupCart = (!popupCart && icart && icart.num > 0)">
								<van-icon name="cart1"></van-icon>
								<div class="cart-num" v-if="cartTotalNum > 0">{{cartTotalNum}}</div>
							</div>
							<div class='cart-empty' v-if="cartTotalNum == 0">
								购物车空空如也~~
							</div>
							<div class="cart-noempty" v-else-if="cartTotalNum > 0">
								<div class="cart-price">¥{{cartTotalPrice}}</div>
							</div>
						</div>
						<div class='cart-btns'>
							<template v-if="pindan_id > 0">
								<div class='cart-btn-unavail'>
									<div class="inner" v-if="!cartTotalNum || cartTotalNum == 0">未选择商品</div>
								</div>
								<div @click="onSubmit()" class="cart-btn-confirm">
									<div class="inner">选好了</div>
								</div>
							</template>
							<template v-else>
								<div class='cart-btn-unavail'>
									<div class="inner" v-if="!cartTotalNum || cartTotalNum == 0">¥{{cartSendCondition}}起送</div>
									<div class="inner" v-else-if="cartSendCondition > 0">差¥{{cartSendCondition}}起送</div>
								</div>
								<div @click="onSubmit()" class="cart-btn-confirm" v-if="cartSendCondition <= 0">
									<div class="inner" :style="{background:sysstyle}">去结算</div>
								</div>
							</template>
						</div>
					</template>
				</div>
				<!-- 购物车弹出层 -->
				<van-popup v-model="popupCart" position="bottom" class="cart-popup">
					<div class="cart-dtl">
						<div class='cart-dtl-head'>
							<div class='box-fee' v-if="from != 'table' && from != 'reserve'">{{istore.cn.box_price}}{{icart.box_price}}元</div>
							<div class='cart-dusbin' @click='onTurncateCart'>
								<van-icon name='delete'></van-icon>
								清空购物车 ！！
							</div>
						</div>
						<!-- 可滚动的列表 -->
						<div class='cart-list'>
							<div class='list'>
								<template v-for="(item, index) in icart.data" >
									<div class='cart-dtl-item border-1px-b' v-for="(option, index) in item" >
										<div class='cart-dtl-item-inner'>
											<div class='goods-name'>{{option.title}}</div>
											<div class='cart-dtl-oprt' v-if="option.goods_id != '88888'">
												<goods-handle
													:goods="option"
													from="cart"
													:optionId="index"
                          @differce="differce"
													:type="from">
												</goods-handle>
											</div>
											<div class='cart-dtl-price'>¥{{option.total_discount_price}}</div>
										</div>
									</div>
								</template>
							</div>
						</div>
					</div>
				</van-popup>
			</template>
			<template v-else>
				<div class="rest" v-if="istore.is_rest == 1">本店打烊啦</div>
			</template>
<!--
			<template v-else>
				&lt;!&ndash;打烊&ndash;&gt;

				&lt;!&ndash;店铺休息中 店铺推荐&ndash;&gt;
				<van-popup v-model="is_rest" position="bottom" class="recommend-popup" >
					<div class="guide-head">
						<div class="store-rest">
							本店已休息
							<div class="store-close">
								<div class="van-icon van-icon-unfold"></div>
							</div>
						</div>
						<span class="store-start">00:00~23:59继续营业</span>
						<span class="store-recommended">为你推荐相似好店</span>
					</div>
					<div class="diy-store-list">
						<div class="diy-waimai-store-box" >
							<div class="waimai-store-item-list">
								<div class="waimai-store-item border-1px-b" v-for="n in 2">
									<div class="mian-content-box">
										<div class="content-left">
											<router-link class="item-image" to="">
												<div class="item-num" v-if="1">2</div>
												<img src="http://1.xinzuowl.com/attachment/images/1/2016/12/ecc9Eu0LIyr62aoOiC6goU6aLAcIIC.jpg">
												<div class="store-label" v-if="1">
													<div class="label">标签</div>
												</div>
											</router-link>
										</div>
										<div class="content-right">
											<router-link to="">
												<div class="item-name-wrap">
													<div class="item-name">茶不思</div>
												</div>
												<div class="item-score-time">
													<div class="item-score-sale">
														<div class="item-star-box">
															<van-rate v-model="istore.score" :size="12" />
														</div>
														<div class="item-sale">月售 60</div>
													</div>
													<div class="time-distance">
														<div class="avg_delivery_time">15分钟</div>
														<div class="line">|</div>
														<div class="avg_distance">2105.00km</div>
													</div>
												</div>
												<div class="item-min-delivery">
													<div class="item-min-delivery-left">
														<div>起送价￥20</div>
														<div class="line">|</div>
														<div>配送费￥3</div>
													</div>
													<div class="item-min-delivery-right">啦啦专送</div>
												</div>
											</router-link>
											<div class="discount-box">
												<div class="toggle">
													<div class="icon icon-fold"></div>
												</div>
												<div class="single-line">
													<img class="discount-icon" src="static/img/newMember_b.png?t=999">
													<div class="discount-text">活动名称</div>
												</div>
											</div>
											&lt;!&ndash;	热卖商品 &ndash;&gt;
											<div class="hot-box">
												<router-link to="" v-for="n in 3">
													<div class="hot-box-item">
														<div class="hot-t border-1px">
															<img src="https://fuss10.elemecdn.com/f/4f/f7a9a2f0e6163e218c243cd2b9e72jpeg.jpeg">
															<div class="discount">9折</div>
														</div>
														<div class="hot-b">
															<div class="shop-name">商品名称</div>
															<div class="shop-price">
																<div class="now-price">¥20</div>
																<div class="old-price">¥10</div>
															</div>
														</div>
													</div>
												</router-link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</van-popup>
			</template>
-->
		</template>
	</div>
</template>
<script>
	import {mapState, mapMutations} from 'vuex'
	import GoodsHandle from '@/components/goodsHandle'
	export default {
		name: 'StoreCart',
		data() {
			return {
				popupCart: false,
				toUrl: '',
        temp_rt:Number
			}
		},
		props:{
			show: Number | Boolean,
			from: String,
			table_category: Object,
			table: Object,
			pindan_id: Number,
      sysstyle:String,
      time_stamp:String,
      pd_cart:Object,
      tempmeals:String | Number,
      testval:Number
		},
		components: {
			GoodsHandle
		},
		watch: {
			cart_animate() {
				if(this.cart_animate) {
					let cart_icon = this.$refs.cart_icon;
					cart_icon.style.transform = "scale(1.2)"
					setTimeout(() => {
						cart_icon.style.transform = "scale(1)"
						this.replaceState({key: 'cart_animate', val: false});
					}, 200)
				}
			}
		},
		computed: {
			...mapState([
				'istore', 'icart', 'cart_animate'
			]),

			cartTotalNum: function (){
        
        return this.icart.num;
			},
      //初始页面检查是否是必选项提示
      cartIsSubmit:function(){
        var require_cid = this.istore.require_cid;
        if(!require_cid){
           return 1;
        }


        if(this.istore.pindan_status==1){
            // var pd_cart = this.pd_cart.data;
            // //console.log(pd_cart);
            // var require_arr = require_cid.split(',');
            // var j = 0;
            // if(!pd_cart){
            //   return 1;
            // }

            // for(var i=0;i<require_arr.length;i++){
            //     for(var ii=0;ii<pd_cart.length;ii++){
            //       for(var t in pd_cart[ii]){
            //           if(pd_cart[ii][t][0]['cid']==require_arr[i]){
            //              j++;
            //           }
            //       }

            //     }
            // }


            // if(j>=require_arr.length){
            //    return 1;
            // }else{
            //   return 0;
            // }

            return 1;

        }else{


           var cart = this.icart.data;
           var require_arr = require_cid.split(',');
           var j = 0;
           if(!cart){
             return 1;
           }

           for(var i=0;i<require_arr.length;i++){
               for(var ii=0;ii<cart.length;ii++){
                 for(var t in cart[ii]){
                   //console.log(cart[ii][t]['cid']+'abc');
                     if(cart[ii][t]['cid']==require_arr[i]){
                        j++;
                     }
                 }

               }
           }

           if(j>=require_arr.length){
              return 1;
           }else{
             return 0;
           }
        }

      },

			cartTotalPrice: function (){
				if(this.from == 'table' || this.from == 'reserve') {
					return (this.icart.price).toFixed(2);
				} else {
					return (this.icart.price + this.icart.box_price).toFixed(2);
				}
			},

			cartSendCondition: function (){
				if(!this.from) {
					if(!this.icart.num) {
						return this.istore.send_price;
					} else {
						return (this.istore.send_price - this.icart.price - this.icart.box_price).toFixed(2);
					}
				} else if(this.from == 'reserve') {
					if(!this.icart.num) {
						return this.table_category.limit_price;
					} else {
						return (this.table_category.limit_price - this.icart.price).toFixed(2);
					}
				} else if(this.from == 'table') {
					if(this.icart.num) {
						return 0;
					}
				}

			}
		},

		methods: {
			...mapMutations([
				'replaceStore', 'replaceCart', 'replaceState'
			]),

      differce:function(value){
        console.log("购物车接受");

          this.$emit('differce',value);
      },
			onTurncateCart: function(){
				this.$dialog.confirm({
					title: '温馨提示',
					message: '确定清除购物车吗?'
				}).then(() => {
					this.util.request({
						url: 'wmall/store/goods/truncate',
						data: {
							sid: this.istore.id
						}
					}).then((res) => {
             // $return["tipstxt"] = $notice;
             // $return["kturl"] = $conurl;
             // $return["next_grade"] = $next_grade;
             // $return["yijian_notice"] = $yijian_notice;
             // $return["yijian"] = $yijian;
             // $return["shiji"] = $shiji;
						this.popupCart = false;
						this.replaceCart({});

            //


					});
				});
				return;
			},
			init() {
				this.toUrl = this.util.getUrl({'path': '/pages/order/create', query: {sid: this.istore.id}});
				if(this.from == 'reserve') {
					this.toUrl = this.util.getUrl({'path': '/tangshi/pages/reserve/create', query: {sid: this.istore.id}});
				}
			},
 			onSubmit() {
				if(this.icart.is_category_limit == 1) {
					this.$dialog.alert({
						title: '温馨提示',
						message: this.icart.category_limit_cn
					});
					return false;
				}

				if(this.pindan_id > 0) {
					this.$router.replace(this.util.getUrl({'path': '/pages/store/pindan', query: {sid: this.istore.id, pindan_id: this.pindan_id}}));
				} else {
					this.$router.push(this.util.getUrl({'path': '/pages/order/create', query: {sid: this.istore.id, is_buysvip: this.icart.is_buysvip}}));
				}
			},
      require_cate(){
        this.$dialog.alert({
        	title: '需要选择必选项下的商品才可下单哦~'
        });
        return;
      },
			onSelectPindan: function(){
				var that = this;
				if(that.from == 'table' || that.from == 'reserve') {
					return false;
				}
				if(that.pindan_id > 0 || that.icart.pindan_id == 0 || !that.icart.pindan_id) {
					return false;
				}
				that.$dialog.confirm({
					title: '温馨提示',
					message: '您正在参与拼单中，单独购买请先放弃拼单',
					confirmButtonText: '放弃拼单',
					cancelButtonText: '继续拼单'
				}).then(() => {
					that.util.request({
						url: 'wmall/store/goods/giveupPindan',
						data: {
							sid: that.icart.sid,
							cart_id: that.icart.id
						}
					}).then((res) => {
						that.pindan_id = 0;
						that.$emit('selectPinadan', that.pindan_id);
					});
				}).catch(() => {
					that.pindan_id = that.icart.pindan_id;
					that.$emit('selectPinadan', that.pindan_id);
				});
				return;
			},

		},

		mounted() {
			//console.log('---');
			//console.log(this.from);
			//this.init()


		},
		updated() {
			this.onSelectPindan();
		}

	}

</script>

<style scoped>
  .deleteprice{
    text-decoration: line-through;
  }
  .oldprice{
    font-size: 10px;
  }
</style>
<style>

	#store-cart .cart{
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		background-color: #313131;
		z-index: 10000;
	}
	#store-cart .cart .cart-tips{
		color: #999;
		padding-left: 12px;
	}
	#store-cart .cart .cart-tips .cart-icon{
		float: left;
		position: relative;
		top: -18px;
		margin-right: 10px;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		text-align: center;
		background-color: #313131;
		color: #fff;
		line-height: 50px;
		border: 5px solid #444;
		transition: transform .2s;
	}
	#store-cart .cart .cart-tips .cart-icon.active{
		background-color: #ff2d4b;
		color: #fff;
	}
	#store-cart .cart .cart-tips .cart-icon .van-icon{
		display: block;
		font-size: 25px;
		margin-top: 7px;
	}
	#store-cart .cart .cart-tips .cart-icon .cart-num{
		border-radius: 15px;
		background-color: #FFD400;
		min-width: 15px;
		height: 15px;
		padding: 0px 3px;
		line-height: 15px;
		font-size: 10px;
		text-align: center;
		position: absolute;
		top: -7px;
		right: -7px;
		color: #3d4145;
	}
	#store-cart .cart .cart-tips .cart-empty{
		line-height: 50px;
		font-size: 13px;
		color: #888;
	}
	#store-cart .cart .cart-tips .cart-noempty .cart-price{
		font-size: 20px;
		margin-left: 4px;
		color: #fff;
		line-height: 34px;
	}
	#store-cart .cart .cart-tips .cart-noempty .cart-shipping{
		font-size: 12px;
		margin-left: 4px;
		margin-top: -5px;
	}
	#store-cart .cart .cart-btns{
		position: absolute;
		top: 0;
		right: 0;
		height: 100%;
	}
	#store-cart .cart .cart-btns .cart-btn-unavail .inner{
		background-color: #2A2A2A;
		color: #999;
	}
	#store-cart .cart .cart-btns .cart-btn-unavail .inner, .cart .cart-btns .cart-btn-confirm .inner{
		width: 110px;
		height: 54px;
		line-height: 50px;
		font-size: 16px;
		text-align: center;
		font-weight: bold;
	}
	#store-cart .cart .cart-btns .cart-btn-confirm .inner{
		background-color: #ff2d4b;
		color: #fff;
	}
	/* 购物车弹框 */
	#store-cart .cart-popup{
		bottom: 50px;
		margin-left: -1px;
	}
	#store-cart .cart-dtl{
		width: 100%;
		height: 244px;
		overflow: hidden;
	}
	#store-cart .cart-dtl .cart-dtl-head{
		position: relative;
		height: 44px;
		border-top: 1px solid #ebebeb;
		background-color: #F4F4F4;
	}
	#store-cart .cart-dtl .cart-dtl-head .box-fee{
		display: inline-block;
		float: left;
		margin-left: 12px;
		line-height: 44px;
		font-size: 14px;
		color: #333;
	}
	#store-cart .cart-dtl .cart-dtl-head .cart-dusbin{
		float: right;
		height: 44px;
		line-height: 44px;
		margin-right: 15px;
		font-size: 14px;
		color: #888;
	}
	#store-cart .cart-dtl .cart-list{
		height: 200px;
		width: 100%;
		overflow-y: auto;
	}
	#store-cart .cart-dtl .cart-list .list{
		background-color: #fff;
	}
	#store-cart .cart-dtl .cart-list .list .cart-dtl-item{
		max-height: 65px;
		padding: 5px 10px;
		overflow: hidden;
	}
	#store-cart .cart-dtl .cart-list .list .cart-dtl-item .cart-dtl-item-inner{
		overflow: hidden;
		height: 40px;
		line-height: 40px;
	}
	#store-cart .cart-dtl-item-inner .goods-name{
		float: left;
		max-width: 170px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 15px;
		color: #666;
	}
	#store-cart .cart-dtl-item-inner .cart-dtl-oprt{
		display: inline-block;
		float: right;
		margin-top: 5px;
		line-height: 28px;
	}
	#store-cart .cart-dtl-item-inner .cart-dtl-price{
		float: right;
		display: inline-block;
		overflow: hidden;
		max-width: 60px;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-right: 12px;
		line-height: 42px;
		color: #666;
	}
	/*打烊了*/
	#store-cart .rest{
		position: fixed;
		bottom: 0;
		z-index: 20000;
		text-align: center;
		width: 100%;
		height: 50px;
		line-height: 50px;
		background-color: #343434;
		color: #fff;
		font-size: 14px;
	}
</style>



// WEBPACK FOOTER //
// src/components/storeCart.vue
