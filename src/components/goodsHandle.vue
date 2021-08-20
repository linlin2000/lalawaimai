<template>
	<div id="goods-handle">
		<template v-if="from != 'cart'">
			<template v-if="istore.is_in_business_hours && (type == 'takeout' || type == 'reserve' || (type == 'table' && table && (table.status == 1 || table.jiacai_id > 0)))">
				<template v-if="goods.is_sail_now == 1">
					<template v-if="goods.is_options == '0' && goods.is_attrs == 0">
						<div class="foodop">
							<template v-if="goods.total != 0">
								<van-icon name='plus' @click="onPlus($event, goods, '', '', '1')">
									<div class="badge" v-if="goodsNum && template == 1">{{goodsNum}}</div>
								</van-icon>
								<template v-if="goodsNum && template == 2">
									<div class='num'>{{goodsNum}}</div>
									<van-icon name='minus' @click="onMinus(goods)"></van-icon>
								</template>
							</template>
							<template v-else>
								<span>已售完</span>
							</template>
						</div>
					</template>
					<template v-else>
						<div class="foodop">
							<div class='spec' @click="onSelectOption">
								选规格
								<div class="badge" v-if="goodsNum">{{goodsNum}}</div>
							</div>
						</div>
					</template>
				</template>
				<template v-else>
					<div class="foodop no-sail" @click="onPopupNotInSailTime" v-if="type == 'takeout'">
						<span v-if="template == 2">非可售时间</span>
						<span v-else>非可售</span>
						<van-icon name="question1"></van-icon>
					</div>
				</template>
			</template>
			<!-- 选取规格弹出层 -->
			<van-popup v-model="popupSpecShow" class="options-popup" v-if="popupSpecShow">
				<div class="options-dialog">
					<div class="muti-close" @click="popupSpecShow = false"></div>
					<div class="muti-wrap">
						<div class="muti-food-title border-1px-b">
							{{goodsActive.title}}
						</div>
						<div class="muti-cont">
							<div class='muti-cont-inner'>
								<div class='muti-sec first' v-if="goodsActive.is_options == 1">
									<div class='muti-sec-title'>规格</div>
									<div class='muti-choice'>
										<template v-for="(item, index) in goodsActive.options" >
											<div :class="{selected: (goodsActive.activeOptions.optionSelected == item.id)}" @click="onToggleOption(item.id, '', 'option')">{{item.name}}</div>
										</template>
									</div>
								</div>
								<div class='muti-sec' v-if="goodsActive.is_attrs == 1">
									<template v-for="(attrItem, attrIndex) in goodsActive.attrs">
										<div class='muti-sec-title'>{{attrItem.name}}</div>
										<div class='muti-choice'>
											<template v-for="(label, labelIndex) in attrItem.label">
												<div :class="{selected: (goodsActive.activeOptions.attrsSelected[attrIndex] == labelIndex)}" @click="onToggleOption(attrIndex, labelIndex, 'attr')">{{label}}</div>
											</template>
										</div>
									</template>
								</div>
							</div>
						</div>
						<div class="muti-choose">
							<div class='muti-oprt'>
								<div class='muti-cart-oprt clearfix'>
									<div class='add-food'>
										<van-icon name='plus' @click="onPlus($event, goodsActive, '', '', '1')" style="background-color: #6BBA50;"></van-icon>
									</div>
									<template v-if="goodsSpecNum">
										<div class='food-num'>{{goodsSpecNum}}</div>
										<div class='remove-food'>
											<div class='remove icon icon-minus' @click="onMinus(goodsActive)"></div>
										</div>
									</template>
								</div>
							</div>
							<div class='muti-info'>
								<div class='muti-price'>¥{{goodsActive.activeOption.price}}</div>
								<div class='muti-type'>({{goodsActive.activeOption.name}})</div>
							</div>
						</div>
					</div>
				</div>
			</van-popup>
			<!-- 非可售时间弹出层 -->
			<van-popup v-model="popupNotInSailTime" class="not-in-time-popup" v-if="popupNotInSailTime">
				<div class='popup-top'>
					<div class='popup-item' v-if="goodsActive.week_cn">
						<div class='popup-title'>每周可售日期</div>
						<div class='popup-text'>{{goodsActive.week_cn}}</div>
					</div>
					<div class='popup-item' v-if="goodsActive.time_cn">
						<div class='popup-title'>每天可售时间</div>
						<div class='popup-text'>
							{{goodsActive.time_cn}}
						</div>
					</div>
				</div>
				<div class='popup-bottom border-1px-t' @click="popupNotInSailTime = false">知道了</div>
			</van-popup>
			<van-popup v-model="popupBuySvip" class="buy-svip">
				<div class='popup-svip-title'>客官，专享价限超级会员享受哦</div>
				<div class="svip-img">
					<div class="svip-vs-left">
						<i class="icon icon-crownfill"></i>
						<div class="font-12">会员专享价</div>
						<div class="svip-vs-price"><span class="font-14">¥</span>{{goods.svip_price}}</div>
					</div>
					<div class="svip-vs-right">
						<div class="svip-putong-title">普通用户价格</div>
						<div class="svip-putong-price"><span class="font-14">¥</span>{{goods.origin_price}}</div>
					</div>
				</div>
				<div class="buy-svip-text">即刻加入超级会员，尊享众多会员优惠</div>
				<button class="svip-price-btn font-16 margin-15-t">
					<div class="font-bold" @click="onPlus($event, goods, '', '', '3')">会员专享价购买</div>
					<div class="font-12 padding-5-t">(订单结算时成为会员享优惠)</div>
				</button>
				<van-button size="normal" class="price-btn font-16 margin-15-t" @click="onPlus($event, goods, '', '', '2')">原价购买</van-button>
			</van-popup>
		</template>
		<template v-else>
			<div class="from-cart">
				<van-icon name='plus' @click="onPlus($event, goods, optionId, from, '0')" ></van-icon>
				<template v-if="goods.num > 0">
					<div class='num'>{{goods.num}}</div>
					<van-icon name='minus' @click="onMinus(goods, optionId, from)"></van-icon>
				</template>
			</div>
		</template>
		<transition
			appear
			@after-appear = 'afterEnter'
			@before-appear="beforeEnter"
			v-for="(item,index) in showMoveDot"
			:key="index"
		>
			<div class="move_dot" v-if="item"></div>
		</transition>

	</div>
</template>
<script>
  //const ws = new WebSocket("ws://localhost:3000");
	import {mapState, mapMutations} from 'vuex'
	export default {
		name: 'StoreCart',
		props:{
			from: String,
			goods: Object,
			optionId: String | Number,
			template: {
				type: String | Number,
				default: 2
			},
			templatePage: {
				type: String | Number,
				default: 0
			},
			type: {
				type: String,
				default: 'takeout'
			},
			table: Object,
      isdouble:String | Number
		},
		data() {
			return {
				popupSpecShow: false,
				popupNotInSailTime: false,
				popupBuySvip: false,
				goodsActive: this.goods,
				showMoveDot: [],
				elLeft: 0,
				elBottom: 0,
			}
		},
		computed: {
			...mapState([
				'istore', 'icart', 'cart_animate'
			]),
			goodsNum: function(){
				if(!this.icart|| !this.icart['data1'] || !this.icart['data1'][this.goods.id]) {
					return 0;
				}
				if(this.icart['data1'][this.goods.id][0]) {
					return this.icart['data1'][this.goods.id][0]['num'];
				}
				var num = 0;
				Object.values(this.icart['data1'][this.goods.id]).forEach((item, index) => {
					num += item.num;
				});
				return num;
			},

			goodsSpecNum: function(){
				if(!this.icart|| !this.icart['data1'] || !this.icart['data1'][this.goodsActive.id]) {
					return 0;
				}
				var optionId = this.goodsActive.activeOptionId;
				if(!this.icart['data1'][this.goodsActive.id][optionId]) {
					return 0;
				}
				return this.icart['data1'][this.goodsActive.id][optionId]['num'];
			},
		},

		mounted () {
			this.windowHeight = window.innerHeight;
		},

		methods: {
			...mapMutations([
				'replaceStore', 'replaceCart', 'replaceState'
			]),

      handleWsOpen(e){
          console.log("c open");
      },
      handleWsClose(e){
        console.log("c close");
      },
      handleWsError(e){
        console.log("c error");
      },
      handleWsMessage(e){
        console.log('客户端接收',e.data);
      },
			onPopupNotInSailTime: function(){
				if(this.from == 'list') {
					this.$emit('onParentPopupNotInSailTime', this.goods);
					return;
				}
				this.goodsActive = this.goods;
				this.popupNotInSailTime = true;
			},

			onSelectOption: function() {
        console.log("chuan");
				if(this.from == 'list') {
					this.$emit('onParentSelectOption', this.goods);
					return;
				}
				this.popupSpecShow = true;
				if(!this.goods['activeOptions']) {
					this.onGoodsOptionInit();
				}
			},

			onGoodsOptionInit: function() {
				this.goodsActive = this.goods;
				this.goodsActive['activeOptions'] = {
					option: 0,
					attrs: [],
					optionSelected: 0,
					attrsSelected: [],
					num: 0
				};
				if(this.goodsActive.is_options == 1) {
					this.goodsActive['activeOptions']['option'] = this.goodsActive.options[0]['id'];
					this.goodsActive['activeOptions']['optionSelected'] = this.goodsActive.options[0]['id'];
				}
				if(this.goodsActive.is_attrs == 1) {
					for(var i = 0; i < this.goodsActive.attrs.length; i++) {
						this.goodsActive['activeOptions']['attrs'].push(i + "s0");
						this.goodsActive['activeOptions']['attrsSelected'][i] = 0;
					}
				}
				this.onToggleActiveOption();
			},

			onToggleOption: function (optionId, optionValueID, type) {
				var goodsActive = this.goods;
				if(type == 'option') {
					goodsActive['activeOptions']['option'] = optionId;
					goodsActive['activeOptions']['optionSelected'] = optionId;
				} else {
					goodsActive['activeOptions']['attrs'][optionId] = optionId + 's' + optionValueID;
					goodsActive['activeOptions']['attrsSelected'][optionId] = optionValueID;
				}
				this.goodsActive = goodsActive;
				this.onToggleActiveOption();
			},

			onToggleActiveOption: function(option_key) {
				var goodsActive = this.goodsActive;
				if(!option_key) {
					goodsActive['activeOptionId'] = goodsActive['activeOptions']['option'];
					if(goodsActive['activeOptions']['attrs'].length > 0) {
						goodsActive['activeOptionId'] = goodsActive['activeOptionId'] + '_' + goodsActive['activeOptions']['attrs'].join('v')
					}
				} else {
					goodsActive['activeOptionId'] = option_key;
				}
				goodsActive['activeOption'] = goodsActive['options_data'][goodsActive['activeOptionId']];
				goodsActive['activeOption']['num'] = this.getSpecNum();
				this.goodsActive = Object.assign({}, goodsActive)
			},

			getSpecNum: function(){
				if(!this.icart|| !this.icart['data1'] || !this.icart['data1'][this.goodsActive.id]) {
					return 0;
				}
				var optionId = this.goodsActive.activeOptionId;
				if(!this.icart['data1'][this.goodsActive.id][optionId]) {
					return 0;
				}
				return this.icart['data1'][this.goodsActive.id][optionId]['num'];
			},

			onPlus: function(event, goods, optionId, from, buysvip_status) {
				if(this.type == 'takeout' && this.from == 'list' && this.templatePage == 1) {
					this.$emit('onParentPlus', event, goods, optionId, from, buysvip_status);
					return;
				}
				var buysvip = 0;
				if(this.icart.pindan_id == 0) {
					if(this.icart.is_buysvip == 1) {
						buysvip = 1;
					} else {
						if(this.icart.svip_buy_show >= 1 && goods.svip_buy_show == 1) {
							if(buysvip_status == 1) {
								if(this.goodsActive.activeOption) {
									if(this.goodsActive.activeOption.origin_price > 0) {
										this.goods.origin_price =  this.goodsActive.activeOption.origin_price;
									} else {
										this.goods.origin_price =  this.goodsActive.activeOption.price;
									}
									if(this.goodsActive.activeOption.svip_price > 0) {
										this.goods.svip_price = this.goodsActive.activeOption.svip_price;
									} else {
										this.goods.svip_price = this.goodsActive.activeOption.price;
									}
								}
								this.popupBuySvip = true;
								return;
							} else if(buysvip_status == 2) {
								this.popupBuySvip = false;
							} else if(buysvip_status == 3) {
								this.popupBuySvip = false;
								buysvip = 1;
							}
						}
					}
				}

				var goods_id = goods.id || goods.goods_id;
				var option_id = goods.activeOptionId || optionId;
				var params = {
					sid: this.istore.id,
					goods_id: goods_id,
					option_id: option_id,
					num: 1,
					sign: '+',
					is_buysvip: buysvip
				};
				var url = 'wmall/store/goods/cart';
        var acart =0;
				if(this.type == 'table') {
					url = 'wmall/store/table/cart';
					if(this.table) {
						params.order_id = this.table.jiacai_id;
					}
				} else if(this.type == 'reserve') {
					url = 'wmall/store/reserve/cart';
				}

				this.util.request({
					url: url,
					//showLoading: true,
					data: params,
				}).then((result) => {



					var result = result.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return false;
					}
					if(result.message.msg) {
						this.$toast(result.message.msg);
					}

          this.$emit('differce',result.differce);
					// 加入购物车动画
					let elLeft = event.target.getBoundingClientRect().left;
					let elBottom = event.target.getBoundingClientRect().bottom;
					if(from == 'cart'){
						elBottom = elBottom + 50;
					}
					this.elLeft = elLeft;
					this.elBottom = elBottom;
					if(this.templatePage == 1) {
						this.$emit('showMoveDot', this.showMoveDot, elLeft, elBottom);
					} else {
						this.showMoveDot.push(true);
					}
         
					this.replaceCart(result.message.cart);

				})
			},

			onMinus: function(goods, optionId, from) {
        console.log('g-----');
				var buysvip = 0;
				if(this.icart.is_buysvip == 1) {
					buysvip = 1;
				}
				var goods_id = goods.id || goods.goods_id;
				var option_id = goods.activeOptionId || optionId;
				var params = {
					sid: this.istore.id,
					goods_id: goods_id,
					option_id: option_id,
					num: 1,
					sign: '-',
					is_buysvip: buysvip
				};
				var url = 'wmall/store/goods/cart';
        var kcart = 0;
				if(this.type == 'table') {
					url = 'wmall/store/table/cart';
					if(this.table) {
						params.order_id = this.table.jiacai_id;
					}

				} else if(this.type == 'reserve') {
					url = 'wmall/store/reserve/cart';
				}

        console.log('herer',url);
				this.util.request({
					url: url,
					//showLoading: true,
					data: params,
				}).then((result) => {
					var result = result.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return false;
					}
console.log(result,'g-');
          this.$emit('differce',result.differce);

					this.replaceCart(result.message.cart);
				})
			},
			beforeEnter(el){
				el.style.bottom = this.windowHeight - this.elBottom + 'px';
				el.style.left = this.elLeft +5 + 'px';
				el.style.opacity = 0;
			},
			afterEnter(el){
				el.style.bottom = -20 + 'px';
				el.style.left = 20 + 'px';
				el.style.opacity = 1;
				setTimeout(() => {
					this.replaceState({key: 'cart_animate', val: true});
				}, 400)
			},
		}
	}
</script>

<style>
	#goods-handle .move_dot{
		position: fixed;
		z-index: 9000;
		bottom: 43px;
		left: 37px;
		width: 15px;
		height: 15px;
		border-radius: 50%;
		background: linear-gradient(to right,#FF930F,#FF5E4E);
		color: #fff;
		transition: bottom .4s cubic-bezier(0.3, -0.25, 0.7, -0.15), left .4s linear;
	}
	#goods-handle .foodop{
		position: absolute;
		right: 10px;
		bottom: 11px;
		line-height: 25px;
	}
	#goods-handle .foodop.no-sail{
		display:flex;
		align-items: center;
	}
	#goods-handle .no-sail .van-icon{
		color: #ccc;
	}
	#goods-handle .foodop div,#goods-handle .foodop .van-icon, #goods-handle .from-cart div,#goods-handle .from-cart .van-icon{
		float: right;
		display: inline-block;
	}

	#goods-handle .foodop .van-icon-plus, #goods-handle .from-cart .van-icon-plus{
		background: linear-gradient(to right,#FF930F,#FF5E4E);
	}
	#goods-handle .foodop .van-icon .badge{
		padding: 0 3px;
		font-size: 10px;
		line-height: 15px;
		color: #3d4145;
		border-radius: 15px;
		position: absolute;
		right: -8px;
		min-width: 15px;
		top: -8px;
		height: 15px;
		text-align: center;
		background-color: #FFD400;
	}
	#goods-handle .foodop.no-sail{
		display:flex;
		align-items: center;
	}
	#goods-handle .no-sail .van-icon{
		color: #ccc;
		font-weight: normal;
		font-size: 14px;
		width: 20px;
		height: 20px;
		line-height: 20px;
		border: 0;
	}
	#goods-handle .foodop .num,#goods-handle .from-cart .num{
		height: 25px;
		lin-height: 25px;
		margin: 0px 6px;
		padding-top: 3px;
	}
	#goods-handle .foodop .van-icon-minus,#goods-handle .from-cart .van-icon-minus{
		color: #ff2d4b;
		background-color: #fff;
		border: 1px solid #ff2d4b;
	}
	#goods-handle .foodop .spec{
		font-size: 10px;
		background: linear-gradient(to right,#FF930F,#FF5E4E);
		border-radius: 30px;
		color: #fff;
		padding: 0 4px;
		position: relative;
		height: 22px;
		line-height: 22px;
	}
	#goods-handle .foodop .spec .badge{
		padding: 0 5px;
		font-size: 12px;
		line-height: 17px;
		color: #3d4145;
		background-color: #FFD400;
		border-radius: 30px;
		position: absolute;
		right: -3px;
		min-width: 17px;
		top: -11px;
		height: 17px;
		text-align: center;
		font-weight: 500;
	}
	#goods-handle .foodop span{
		color: #888;
		font-size: 12px;
	}

	/*非可售时间*/
	#goods-handle .not-in-time-popup{
		max-width: 100%;
		width: 75%;
		background-color: #fff;
		border-radius: 4px;
		font-size: 14px;
	}
	#goods-handle .not-in-time-popup .popup-top{
		width: 100%;
		padding: 26px 28px 0 28px;
		box-sizing: border-box;
	}
	#goods-handle .not-in-time-popup .popup-top .popup-item{
		margin-bottom: 10px;
	}
	#goods-handle .not-in-time-popup .popup-top .popup-title{
		color: #000;
		font-size: 15px;
		font-weight: bold;
		margin-bottom: 5px;
	}
	#goods-handle .not-in-time-popup .popup-top .popup-text{
		line-height: 2;
	}
	#goods-handle .not-in-time-popup .popup-bottom{
		width: 100%;
		height: 52px;
		line-height: 52px;
		color: #ff2d4b;
		text-align: center;
		box-sizing: border-box;
	}
	/*选规格*/
	#goods-handle .options-popup{
		max-width: 90%;
		width: 90%;
	}
	#goods-handle .options-dialog{
		background-color: #fff;
		width: 100%;
	}
	#goods-handle .options-dialog .muti-close{
		position: absolute;
		top: 10px;
		right: 10px;
		width: 24px;
		height: 24px;
		text-align: center;
	}
	#goods-handle .options-dialog .muti-close::before,.options-dialog .muti-close::after{
		position: absolute;
		top: 10px;
		right: 1px;
		width: 20px;
		height: 1px;
		background: #666;
		content: '';
	}
	#goods-handle .options-dialog .muti-close::before{
		-webkit-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		-moz-transform: rotate(45deg);
		transform: rotate(45deg);
	}
	#goods-handle .options-dialog .muti-close::after{
		-webkit-transform: rotate(135deg);
		-ms-transform: rotate(135deg);
		-moz-transform: rotate(135deg);
		transform: rotate(135deg);
	}
	#goods-handle .options-dialog .muti-food-title{
		line-height: 44px;
		margin: 0 35px;
		font-size: 16px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
		border-radius: 8px 8px 0 0;
	}
	#goods-handle .options-dialog .muti-cont{
		max-height: 250px;
		overflow-y: scroll;
		overflow-x: hidden;
		-webkit-box-flex: 1;
		font-size: 14px;
		padding-bottom: 10px;
	}
	#goods-handle .options-dialog .muti-cont .muti-sec .muti-sec-title{
		line-height: 20px;
		margin: 10px 0 0 15px;
	}
	#goods-handle .options-dialog .muti-cont .muti-sec .muti-choice{
		margin: 0 5px;
		overflow: hidden;
	}
	#goods-handle .options-dialog .muti-cont .muti-sec .muti-choice div{
		display: inline-block;
		float: left;
		margin: 10px 5px 0;
		min-width: 75px;
		padding: 0 10px;
		height: 28px;
		line-height: 26px;
		border: 1px solid #c4c4c4;
		box-sizing: border-box;
		border-radius: 14px;
		text-align: center;
		overflow: hidden;
	}
	#goods-handle .options-dialog .muti-cont .muti-sec .muti-choice div.selected{
		border-color: #FF2D4B;
		color: #FF2D4B;
	}
	#goods-handle .options-dialog .muti-choose{
		height: 56px;
		background-color: #f4f4f4;
		overflow: hidden;
		border-radius: 0 0 8px 8px;
	}
	#goods-handle .options-dialog .muti-choose .muti-oprt{
		float: right;
		display: inline-block;
	}
	#goods-handle .options-dialog .muti-choose .muti-oprt .muti-cart-btn{
		width: 78px;
		height: 32px;
		line-height: 32px;
		padding-left: 32px;
		margin: 12px 12px 0 0;
		background-size: 16px auto;
		font-size: 13px;
		border-radius: 16px;
		background: #FF2D4B url(//xs01.meituan.net/waimai_i/img/muti_icart.dafdd4d1.png) no-repeat 10px 8px;
		text-align: left;
		-webkit-background-size: 16px auto;
	}
	#goods-handle .options-dialog .muti-choose .muti-cart-oprt{
		margin-top: 16px;
	}
	#goods-handle .options-dialog .muti-choose .muti-cart-oprt .add-food,.options-dialog .muti-choose .muti-cart-oprt .remove-food{
		float: right;
		height: 35px;
		width: 35px;
		display: inline-block;
	}
	#goods-handle .options-dialog .muti-choose .muti-cart-oprt .add-food{
		text-align: left;
	}
	#goods-handle .options-dialog .muti-choose .muti-cart-oprt .remove-food{
		text-align: right;
	}
	#goods-handle .options-dialog .muti-choose .muti-cart-oprt .add-food .van-icon{
		width: 30px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		color: #fff;
		font-weight: bold;
		border-radius: 100%;
		position: relative;
		font-size: 16px;
		background: -webkit-gradient(linear,left top, right top,from(#FF930F),to(#FF5E4E));
		background: linear-gradient(to right,#FF930F,#FF5E4E);
	}
	#goods-handle .options-dialog .muti-choose .muti-cart-oprt .remove-food div{
		width: 30px;
		height: 30px;
		text-align: center;
		line-height: 30px;
		color: #fff;
		font-weight: bold;
		border-radius: 100%;
		position: relative;
		font-size: 16px;
		color: #ff2d4b;
		background-color: #fff;
		border: 1px solid #ff2d4b;
	}
	#goods-handle .options-dialog .muti-choose .muti-cart-oprt div{
		height: 27px;
		line-height: 27px;
		min-width: 21px;
		text-align: center;
		float: right;
	}
	#goods-handle .options-dialog .muti-choose .muti-info{
		margin-left: 15px;
		line-height: 56px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#goods-handle .options-dialog .muti-choose .muti-info .muti-price{
		font-size: 24px;
		color: #FB4E44;
		vertical-align: middle;
		display: inline-block;
	}
	#goods-handle .options-dialog .muti-choose .muti-info .muti-type{
		margin-left: 5px;
		font-size: 12px;
		color: #2F2F2F;
		display: inline-block;
		vertical-align: middle;
	}
	/*普通用户购买超级会员商品弹出层样式*/
	#goods-handle .buy-svip{
		padding: 20px 15px;
		background-color: #fff;
		font-size: 15px;
		line-height: 1;
	}
	#goods-handle .buy-svip .popup-svip-title{
		display: flex;
		align-items: center;
		font-weight: 700;
		white-space:nowrap;
		padding-bottom: 15px;
		text-align: center;
	}
	#goods-handle .buy-svip .popup-svip-title:before,#goods-handle .buy-svip .popup-svip-title:after{
		display: block;
		margin: 0 3.5px;
		width: 23px;
		height: 10px;
		background-image: url(../../static/img/svip-title-head.png);
		background-position: 0 0;
		background-size: 100% auto;
		background-repeat: no-repeat;
		content: "";
	}
	#goods-handle .buy-svip .popup-svip-title:after{
		transform: scaleX(-1);
	}
	#goods-handle .buy-svip .svip-img{
		display: flex;
		width: 100%;
		height: 73px;
		background: url(../../static/img/svip-vs-bg.png) no-repeat;
		background-size: 100% auto;
		margin-bottom: 15px;
	}
	#goods-handle .buy-svip .svip-img .svip-vs-left{
		width: 50%;
		text-align: center;
		color: #FFE98B;
	}
	#goods-handle .buy-svip .svip-img .svip-vs-left .icon{
		padding: 3px 0;
		font-size: 12px;
	}
	#goods-handle .buy-svip .svip-img .svip-vs-left .svip-vs-price{
		font-size: 26px;
		padding: 5px 0;
	}
	#goods-handle .buy-svip .svip-img .svip-vs-right{
		width: 50%;
		text-align: center;
		color: #656565;
	}
	#goods-handle .buy-svip .svip-img .svip-vs-right .svip-putong-title{
		padding-top: 18px;
		font-size: 12px;
	}
	#goods-handle .buy-svip .svip-img .svip-vs-right .svip-putong-price{
		font-size: 26px;
		padding: 5px 0;
	}
	#goods-handle .buy-svip .buy-svip-text{
		font-size: 14px;
		color: #999;
		text-align: center;
	}
	#goods-handle .buy-svip .svip-price-btn{
		display: block;
		width: 100%;
		height: 45px;
		text-align: center;
		background: linear-gradient(90deg,#faeaa7,#e0c470);
		border: none;
		border-radius: 3px;
		padding: 0;
		color: #7C4F0B;
	}
	#goods-handle .buy-svip .price-btn{
		width: 100%;
		display: block;
		text-align: center;
		color: #7c7c7c;
		font-weight: 600;
	}
	#goods-handle .buy-svip .van-button::before{
		border-color: transparent;
		background-color: transparent;
	}
  #goods-store .goods-list .goods-item .price div {
      font-size: 14px;
      line-height: 14px;
  }

</style>

<style scoped>
  .van-icon-plus:before {
      content: "\E60D";
  }
  .van-icon, .van-icon:before {
      display: inline-block;
  }

  #goods-handle .foodop .van-icon, #goods-handle .from-cart .van-icon{
  	width: 24px;
  	height: 24px;
  	line-height: 24px;
  	font-size: 16px;
  }
</style>

// WEBPACK FOOTER //
// src/components/goodsHandle.vue
