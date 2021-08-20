<template>
	<div id="store-goods">
		<store-header :store="store" :table_category="table_category"></store-header>
		<!-- 标签 -->
		<div class="store-tabs flex-lr van-hairline--bottom">
			<div class="tab-item active">商品</div>
			<router-link class="tab-item" :to="util.getUrl({path: '/pages/store/comment?sid=' + store.id})" tag="div">评价</router-link>
			<router-link class="tab-item" :to="util.getUrl({path: '/pages/store/index?sid=' + store.id})" tag="div">商家</router-link>
		</div>
		<div class="goods-container">
			<van-row class="goods-some" v-if="template_page == 1">
				<van-col span="5" :style="{height: vanColHeight +'px'}">
					<van-badge-group :active-key="categorySelectedIndex" class="tabs-list">
						<template v-for="(item, index) in categoryAll" >
							<van-badge class="border-0px van-hairline--top" :title="item.title" @click="onToggleCategory(item.id, index, '')" v-if="item.total > 0" :info="item.total" />
							<van-badge class="border-0px van-hairline--top" :title="item.title" @click="onToggleCategory(item.id, index, '')" v-else />
						</template>
					</van-badge-group>
				</van-col>
				<van-col span="19" :style="{height: vanColHeight +'px'}">
					<van-list v-model="goodsLoading" :finished="goodsItem.loaded" @load="onGetGoods" :offset="50">
						<!-- 商家代金券 -->
						<div class='coupon-show-container' v-if="coupon.id > 0 && couponStatus == 1">
							<div class='coupon-price'>
								¥<div>{{coupon.price}}</div>
							</div>
							<div class='coupon-detail'>
								<div class='coupon-title'>商家代金券</div>
								<div class='coupon-desc'>内含{{coupon.num}}张券</div>
							</div>
							<div class='coupon-fetch' @click="onCollectCoupon">去领取</div>
						</div>
						<!-- 门店海报 -->
						<div class="banner" v-if="0 && shopPage">
							<template v-for="(shopPageItem, shopPageKey) in shopPage">
								<div class="banner-item" v-if="shopPageItem.wxapp_link"  @click="util.jsUrl(shopPageItem.wxapp_link)" >
									<img :src="shopPageItem.thumb">
								</div>
								<router-link class="banner-item" v-else-if="shopPageItem.goodsLength == 1" :to="util.getUrl({path: '/tangshi/pages/reserve/goodsDetail', query:{sid: store.id, id: shopPageItem.goods[0]}})">
									<img :src="shopPageItem.thumb">
								</router-link>
								<router-link class="banner-item" v-else-if="shopPageItem.goodsLength > 1" :to="util.getUrl({path: '/pages/store/shopPage', query:{sid: store.id, shopPageKey: shopPageKey}})">
									<img :src="shopPageItem.thumb">
								</router-link>
							</template>
						</div>
						<!-- 二级分类 -->
						<template v-if="categorySelected.child">
							<div class="tag2-list" v-if="categorySelected.child.length > 0">
								<div class="tag2-item" v-for="(item, index) in categorySelected.child" :class="{selected: index == childSelectedIndex}" @click="onToggleCategory(item.id, index, 'child')" :key="item">
									{{item.title}}
									<div :class="{dot: item.total}" v-if="item.total > 0"></div>
								</div>
							</div>
						</template>
						<div class="title border-1px-t">
							<div class="title-text ellipsis">
								<div class='title-line' style="{'border-color': '#6BBA50'}"></div>
								{{categorySelected.child && categorySelected.child.length > 0 ? categorySelected.child[childSelectedIndex].title : categorySelected.title}}
							</div>
							<div class="title-rank">
								<div class="sales " :class="{'selected': (goodsItem.orderby.type == 'sailed')}" @click="onOrderby('sailed', 'desc')">销量</div>
								<div class="shu">|</div>
								<div class="prionToggleCategoryce-container" @click="onOrderby('price', (goodsItem.orderby.value == 'desc' ? 'asc' : 'desc'))">
									<div class="price">价格</div>
									<div class="triangle">
										<div class="triangle-top" :class="{selected: (goodsItem.orderby.type == 'price' && goodsItem.orderby.value == 'asc')}"></div>
										<div class="triangle-bottom " :class="{selected: (goodsItem.orderby.type == 'price' && goodsItem.orderby.value == 'desc')}"></div>
									</div>
								</div>
							</div>
						</div>
						<!-- 单列模板 -->
						<template v-if="template == 2">
							<div class="goods clearfix " v-if="goodsItem.data.length > 0" v-for="(item, index) in goodsItem.data" :key="item">
								<div class="goods-inner border-1px-b">
									<router-link class="image-box" :to="util.getUrl({path: '/tangshi/pages/reserve/goodsDetail', query: {id: item.id, sid: store.id, table_cid: table_cid}})">
										<img class="pic" v-lazy="{src: item.thumb, loading: lazyload_goods}">
										<div class="label" v-if="item.label">{{item.label}}</div>
									</router-link>
									<div class='shop-info clearfix'>
										<div class="name ellipsis">{{item.title}}</div>
										<div class="description">{{item.content}}</div>
										<div class="sold">已售{{item.sailed}} 赞{{item.comment_good}}</div>
										<div class="price">
											<div class="now-price">
												<span class="price-icon font-14">￥</span>{{item.price}}<span class="font-14 font-bold">{{item.unitname_cn}}</span>
											</div>
											<div class='old-price' v-if="item.old_price">
												<div class="price-icon">￥</div>{{item.old_price}}
											</div>
										</div>
										<div class='discount'>
											<template v-if="item.discount">
												<van-icon name='tag'></van-icon>
												{{item.discount}}折 限{{item.max_buy_limit}}份 {{item.unitnum > 1 ? item.unitnum + '份起购' : ''}}
											</template>
											<template v-else-if="item.unitnum > 1">
												<van-icon name='tag'></van-icon>
												{{item.unitnum}}份起购
											</template>
										</div>
									</div>
									<goods-handle
											:goods="item"
											:optionId="0"
											from="list"
											type="reserve"
											@onParentSelectOption="onParentSelectOption"
											@onParentPopupNotInSailTime="onParentPopupNotInSailTime">
									</goods-handle>
									<div style="clear:both"></div>
								</div>
							</div>
						</template>
						<!-- 双列模板 -->
						<template v-else>
							<div class="goods-list clearfix" v-if="goodsItem.data && goodsItem.data.length > 0" >
								<div class="col-50 goods-item" v-for="(item, index) in goodsItem.data" :key="item">
									<div class="goods-info">
										<router-link class="avatar" :to="util.getUrl({path: '/tangshi/pages/reserve/goodsDetail', query: {id: item.id, sid: store.id, table_cid: table_cid}})">
											<img v-lazy="{src: item.thumb, loading: lazyload_goods}">
										</router-link>
										<div class="goods-name">{{item.title}}</div>
										<div class="solid">
											已售{{item.sailed}} <div>赞{{item.comment_good}}</div>
										</div>
										<div class="price">¥
											<div>{{item.price}}</div><span class="font-bold">{{item.unitname_cn}}</span>
										</div>
										<div class="old-price" v-if="0 && item.old_price">{{item.old_price}}</div>
										<div class="discount">
											<div v-if="item.discount">
												<van-icon name="tag"></van-icon> {{item.discount}}折 限{{item.max_buy_limit}}份 {{item.unitnum > 1 ? item.unitnum + '份起购' : ''}}
											</div>
											<div v-else-if="item.unitnum > 1">
												<van-icon name="tag"></van-icon> {{item.unitnum}}份起购
											</div>
										</div>
										<goods-handle
											:goods="item"
											:template="template"
											:optionId="0"
											from="list"
											type="reserve"
											@onParentSelectOption="onParentSelectOption"
											@onParentPopupNotInSailTime="onParentPopupNotInSailTime">
										</goods-handle>
									</div>
								</div>
								<div style="clear: both"></div>
							</div>
						</template>
						<load v-if="goodsItem.empty == 1" type="loaded" text="暂无商品"></load>
						<load v-else-if="goodsItem.loaded" type="loaded" text="已经到底了"></load>
						<!--<load v-if="goodsLoading" type="loading"></load>-->
					</van-list>
				</van-col>
			</van-row>
			<van-row class="goods-all" v-else>
				<van-col span="5" :style="{height: vanColHeight +'px'}">
					<div ref="categoryWrapper" :style="{height: vanColHeight +'px'}" >
						<van-badge-group :active-key="currentIndex" class="tabs-list">
							<template v-for="(item, index) in cateHasGoods" >
								<li ref="categoryItem" @click="selectCategory(index, $event)">
									<van-badge class="border-0px van-hairline--top" :title="item.title" v-if="item.total > 0" :info="item.total" />
									<van-badge class="border-0px van-hairline--top" :title="item.title" v-else />
								</li>
							</template>
						</van-badge-group>
					</div>
				</van-col>
				<van-col span="19" :style="{height: vanColHeight +'px'}">
					<div ref="goodsWrapper" :style="{height: vanColHeight +'px'}" >
						<div>
							<!-- 商家代金券 -->
							<div class='coupon-show-container' ref="couponWrapper" v-if="coupon.id > 0 && couponStatus == 1">
								<div class='coupon-price'>
									¥<div>{{coupon.price}}</div>
								</div>
								<div class='coupon-detail'>
									<div class='coupon-title'>商家代金券</div>
									<div class='coupon-desc'>内含{{coupon.num}}张券</div>
								</div>
								<div class='coupon-fetch' @click="onCollectCoupon">去领取</div>
							</div>
							<!-- 门店海报 -->
							<div class="banner" ref="shopPageWrapper" v-if="0 && shopPage">
								<template v-for="(shopPageItem, shopPageKey) in shopPage">
									<div class="banner-item" v-if="shopPageItem.wxapp_link"  @click="util.jsUrl(shopPageItem.wxapp_link)" >
										<img :src="shopPageItem.thumb">
									</div>
									<router-link class="banner-item" v-else-if="shopPageItem.goodsLength == 1" :to="util.getUrl({path: '/tangshi/pages/reserve/goodsDetail', query:{sid: store.id, id: shopPageItem.goods[0]}})">
										<img :src="shopPageItem.thumb">
									</router-link>
									<router-link class="banner-item" v-else-if="shopPageItem.goodsLength > 1" :to="util.getUrl({path: '/pages/store/shopPage', query:{sid: store.id, shopPageKey: shopPageKey}})">
										<img :src="shopPageItem.thumb">
									</router-link>
								</template>
							</div>
							<ul>
								<li v-for="(citem, cindex) in cateHasGoods" :key="cindex" ref="goodsList">
									<div class="title border-1px-t">
										<div class="title-text">
											<div class='title-line' style="{'border-color': '#6BBA50'}"></div>
											{{citem.title}}
										</div>
									</div>
									<!-- 单列模板 -->
									<template v-if="template == 2">
										<div class="goods clearfix" v-if="citem.goods.length > 0" v-for="(item, index) in citem.goods" :key="index">
											<div class="goods-inner " :class="{'border-1px-b': index < citem.goods.length - 1}">
												<router-link class="image-box" :to="util.getUrl({path: '/tangshi/pages/reserve/goodsDetail', query: {id: item.id, sid: store.id, table_cid: table_cid}})">
													<img class="pic" v-lazy="{src: item.thumb, loading: lazyload_goods}">
													<div class="label" v-if="item.label">{{item.label}}</div>
												</router-link>
												<div class='shop-info clearfix'>
													<div class="name ellipsis">{{item.title}}</div>
													<div class="description">{{item.content}}</div>
													<div class="sold">已售{{item.sailed}} 赞{{item.comment_good}}</div>
													<div class="price">
														<div class="now-price">
															<span class="price-icon font-14">￥</span>{{item.price}}<span class="font-14 font-bold">{{item.unitname_cn}}</span>
														</div>
														<div class='old-price' v-if="item.old_price">
															<div class="price-icon">￥</div>{{item.old_price}}
														</div>
													</div>
													<div class='discount'>
														<template v-if="item.discount">
															<van-icon name='tag'></van-icon>
															{{item.discount}}折 限{{item.max_buy_limit}}份 {{item.unitnum > 1 ? item.unitnum + '份起购' : ''}}
														</template>
														<template v-else-if="item.unitnum > 1">
															<van-icon name='tag'></van-icon>
															{{item.unitnum}}份起购
														</template>
													</div>
												</div>
												<goods-handle
														:goods="item"
														:optionId="0"
														from="list"
														templatePage="1"
														type="reserve"
														@onParentSelectOption="onParentSelectOption"
														@onParentPopupNotInSailTime="onParentPopupNotInSailTime"
														@showMoveDot="showMoveDotFun">
												</goods-handle>
												<div style="clear:both"></div>
											</div>
										</div>
									</template>
									<!-- 双列模板 -->
									<template v-else>
										<div class="goods-list clearfix" v-if="citem.goods && citem.goods.length > 0" >
											<div class="col-50 goods-item" v-for="(item, index) in citem.goods" :key="item">
												<div class="goods-info">
													<router-link class="avatar" :to="util.getUrl({path: '/tangshi/pages/reserve/goodsDetail', query: {id: item.id, sid: store.id, table_cid: table_cid}})">
														<img v-lazy="{src: item.thumb, loading: lazyload_goods}">
													</router-link>
													<div class="goods-name">{{item.title}}</div>
													<div class="solid">
														已售{{item.sailed}} <div>赞{{item.comment_good}}</div>
													</div>
													<div class="price">¥
														<div>{{item.price}}</div><span class="font-bold">{{item.unitname_cn}}</span>
													</div>
													<div class="old-price" v-if="0 && item.old_price">{{item.old_price}}</div>
													<div class="discount">
														<div v-if="item.discount">
															<van-icon name="tag"></van-icon> {{item.discount}}折 限{{item.max_buy_limit}}份 {{item.unitnum > 1 ? item.unitnum + '份起购' : ''}}
														</div>
														<div v-else-if="item.unitnum > 1">
															<van-icon name="tag"></van-icon> {{item.unitnum}}份起购
														</div>
													</div>
													<goods-handle
														:goods="item"
														:template="template"
														:optionId="0"
														from="list"
														templatePage="1"
														type="reserve"
														@onParentSelectOption="onParentSelectOption"
														@onParentPopupNotInSailTime="onParentPopupNotInSailTime"
														@showMoveDot="showMoveDotFun">
													</goods-handle>
												</div>
											</div>
											<div style="clear: both"></div>
										</div>
									</template>
								</li>
							</ul>
						</div>
					</div>
				</van-col>
			</van-row>
		</div>
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

		<van-popup v-model="ParentPopupSpecShow" class="options-popup" v-if="ParentPopupSpecShow">
			<div class="options-dialog">
				<div class="muti-close" @click="ParentPopupSpecShow = false"></div>
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
										<div :class="{selected: (goodsActive.activeOptions.optionSelected == item.id)}" @click="onParentToggleOption(item.id, '', 'option')">{{item.name}}</div>
									</template>
								</div>
							</div>
							<div class='muti-sec' v-if="goodsActive.is_attrs == 1">
								<template v-for="(attrItem, attrIndex) in goodsActive.attrs">
									<div class='muti-sec-title'>{{attrItem.name}}</div>
									<div class='muti-choice'>
										<template v-for="(label, labelIndex) in attrItem.label">
											<div :class="{selected: (goodsActive.activeOptions.attrsSelected[attrIndex] == labelIndex)}" @click="onParentToggleOption(attrIndex, labelIndex, 'attr')">{{label}}</div>
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
									<van-icon name='plus' @click="onParentPlus($event, goodsActive)" style="background-color: #6BBA50;"></van-icon>
								</div>
								<template v-if="goodsSpecNum">
									<div class='food-num'>{{goodsSpecNum}}</div>
									<div class='remove-food'>
										<div class='remove icon icon-minus' @click="onParentMinus(goodsActive)"></div>
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

		<!-- 购物车部分 -->
		<store-cart
			:show="activetabs == 0"
			:store="store"
			:cart="cart"
			from="reserve"
			:table_category="table_category">
		</store-cart>
		<transition name="loading">
			<iloading v-if="preLoading"></iloading>
		</transition>
		<!--小球-->
		<transition
			appear
			@after-appear = 'onParentAfterEnter'
			@before-appear="onParentBeforeEnter"
			v-for="(item,index) in showMoveDot"
			:key="index"
		>
			<div class="parent_move_dot" v-if="item"></div>
		</transition>
		<!--公告弹出层-->
		<notice-popup v-if="store.tips && showNotice" :tips="store.tips"></notice-popup>
	</div>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	import PublicFooter from '@/components/footer'
	import Load from '@/components/load'
	import StoreCart from '@/components/storeCart'
	import GoodsHandle from '@/components/goodsHandle'
	import StoreHeader from '@/components/storeHeader'
	import noticePopup from '@/components/noticePopup'
	import BScroll from 'better-scroll'
	export default {
		name: 'StoreGoods',
		data() {
			return {
				goodsActive: {},
				popupNotInSailTime: false,
				ParentPopupSpecShow: false,
				preLoading: true,
				goodsLoading: true,
				store:{
					is_rest: 0,
					activity: {
						num: 0
					}
				},
				activetabs: 0,
				swiper_dots: false,
				tabswiperable: true,
				is_rest: 0,
				status: {
					options_show: false,
					not_in_time_show: false,
					cart_show: false,
				},
				vanColHeight: 0,
				commentHeight: 0,
				categorySelectedIndex: 0,
				categorySelectedId: 0,
				categoryAll:[],
				categorySelected: {
					child: [{}]
				},
				childSelectedIndex: 0,
				childSelectedId: 0,
				goodsAll: [],
				goodsItem: {
					orderby: {
						type: '',
						value: ''
					}
				},
				table_category: {},
				coupon: [],
				cart: {
					num: 0,
				},
				template: 2,
				couponStatus: 1,
				lazyload_goods: '',
				showMoveDot: [],
				windowHeight: 0,
				showNotice: true,

				cateHasGoods: [],
				template_page: 0,
				scrollY: 0,
				listHeight: [],
				tabActive: 0,
			}
		},
		components: {
			PublicFooter,
			Load,
			StoreCart,
			GoodsHandle,
			StoreHeader,
			noticePopup
		},
		methods: {
			...mapMutations([
				'replaceStore', 'replaceCart', 'replaceState'
			]),
			showMoveDotFun: function(showMoveDot, elLeft, elBottom) {
				this.showMoveDot.push(true);
				this.elLeft = elLeft;
				this.elBottom = elBottom;
			},

			onCollectCoupon() {
				this.util.request({
					url: 'wmall/channel/coupon/get',
					data: {sid: this.sid},
				}).then((result) => {
					var result = result.data.message;
					if(result.errno) {
						this.util.$toast('领取失败', '', 1000);
						return false;
					}
					this.couponStatus = 0;
					this.util.$toast(result.message, '', 1000);
				})
			},

			onParentSelectOption: function(goods) {
				this.goodsActive = goods;
				this.goods = goods;
				this.ParentPopupSpecShow = true;
				if(!this.goods['activeOptions']) {
					this.onParentGoodsOptionInit();
				}
			},

			onParentGoodsOptionInit: function() {
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
				this.onParentToggleActiveOption();
			},

			onParentToggleOption: function (optionId, optionValueID, type) {
				var goodsActive = this.goods;
				if(type == 'option') {
					goodsActive['activeOptions']['option'] = optionId;
					goodsActive['activeOptions']['optionSelected'] = optionId;
				} else {
					goodsActive['activeOptions']['attrs'][optionId] = optionId + 's' + optionValueID;
					goodsActive['activeOptions']['attrsSelected'][optionId] = optionValueID;
				}
				this.goodsActive = goodsActive;
				this.onParentToggleActiveOption();
			},

			onParentToggleActiveOption: function(option_key) {
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
				goodsActive['activeOption']['num'] = this.parentGetSpecNum();
				this.goodsActive = Object.assign({}, goodsActive)
			},

			parentGetSpecNum: function(){
				if(!this.icart|| !this.icart['data1'] || !this.icart['data1'][this.goodsActive.id]) {
					return 0;
				}
				var optionId = this.goodsActive.activeOptionId;
				if(!this.icart['data1'][this.goodsActive.id][optionId]) {
					return 0;
				}
				return this.icart['data1'][this.goodsActive.id][optionId]['num'];
			},

			onParentPlus: function(event, goods, optionId, from) {
				var goods_id = goods.id || goods.goods_id;
				var option_id = goods.activeOptionId || optionId;
				var params = {
					sid: this.istore.id,
					goods_id: goods_id,
					option_id: option_id,
					num: 1,
					sign: '+'
				};
				this.util.request({
					url: 'wmall/store/reserve/cart',
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

					// 加入购物车动画
					let elLeft = event.target.getBoundingClientRect().left;
					let elBottom = event.target.getBoundingClientRect().bottom;
					if(from == 'cart'){
						elBottom = elBottom + 50;
					}
					this.elLeft = elLeft;
					this.elBottom = elBottom;
					this.showMoveDot.push(true);
					this.replaceCart(result.message.cart);
				})
			},

			onParentMinus: function(goods, optionId, from) {
				var goods_id = goods.id || goods.goods_id;
				var option_id = goods.activeOptionId || optionId;
				var params = {
					sid: this.istore.id,
					goods_id: goods_id,
					option_id: option_id,
					num: 1,
					sign: '-'
				};
				this.util.request({
					url: 'wmall/store/reserve/cart',
					//showLoading: true,
					data: params,
				}).then((result) => {
					var result = result.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return false;
					}
					this.replaceCart(result.message.cart);
				})
			},

			onParentPopupNotInSailTime: function(goods){
				this.goodsActive = goods;
				this.popupNotInSailTime = true;
			},

			onToggleCategory(cid, index, from) {
				var childIndex = 0;
				if(from == 'child') {
					childIndex = index;
					this.childSelectedIndex = childIndex;
					this.categoryAll[this.categorySelectedIndex]['childSelectedIndex'] = childIndex;
					this.categorySelected = this.categoryAll[this.categorySelectedIndex];
				} else {
					if(this.categoryAll[index]['childSelectedIndex'] > 0) {
						childIndex = this.categoryAll[index].childSelectedIndex;
					}
					this.categorySelected = this.categoryAll[index];
					this.categorySelectedIndex = index;
					this.childSelectedIndex = childIndex;
					this.categoryAll[index]['childSelectedIndex'] = childIndex;
				}
				this.categorySelectedId = this.categorySelected.id;
				this.childSelectedId = 0;
				if(this.categorySelected.child && this.categorySelected.child.length > 0) {
					this.childSelectedId = this.categorySelected.child[childIndex]['id'];
				}
				this.onGetGoods();
			},

			onGetGoods() {
				if(this.goodsLoading) {
					//return false;
				}
				if(!this.goodsAll[this.categorySelectedIndex]) {
					this.goodsAll[this.categorySelectedIndex] = [];
				}
				this.goodsItem = this.goodsAll[this.categorySelectedIndex][this.childSelectedIndex];
				if(!this.goodsItem) {
					this.goodsItem = {
						page: 1,
						psize: 30,
						empty: 0,
						loaded: false,
						data: [],
						orderby: {
							type: '',
							value: ''
						}
					};
				} else {
					if(this.goodsItem.empty) {
						return false;
					}
					if(this.goodsItem.loaded) {
						return false;
					}
				}
				this.goodsLoading = true;
				this.util.request({
					url: 'wmall/store/reserve/goods',
					data: {
						sid: this.sid,
						page: this.goodsItem.page,
						psize: this.goodsItem.psize,
						cid: this.categorySelectedId,
						child_id: this.childSelectedId,
						type: this.goodsItem.orderby.type,
						value: this.goodsItem.orderby.value
					},
				}).then((res) => {
					this.goodsLoading = false;
					var result = res.data.message.message;
					this.goodsItem.data = [...this.goodsItem.data, ...result.goods];
					this.goodsItem.page++;
					if(result.goods.length < this.goodsItem.psize) {
						this.goodsItem.loaded = true;
						if(!result.goods.length) {
							this.goodsItem.empty = 1;
						}
					}
					if(!this.goodsAll[this.categorySelectedIndex]) {
						this.goodsAll[this.categorySelectedIndex] = [];
					}
					this.goodsAll[this.categorySelectedIndex][this.childSelectedIndex] = this.goodsItem;
				})
			},

			onOrderby(type, value) {
				this.goodsItem = {
					page: 1,
					psize: 30,
					empty: 0,
					data: [],
					orderby: {
						type: type,
						value: value
					}
				};
				this.goodsAll[this.categorySelectedIndex][this.childSelectedIndex] = this.goodsItem;
				this.onGetGoods();
			},

			onLoad() {
				this.util.request({
					url: 'wmall/store/reserve/goodsIndex_vue',
					data: {
						sid: this.sid,
						table_cid: this.table_cid
					}
				}).then((res) => {
					this.goodsLoading = false;
					this.preLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return false;
					}
					result = result.message;
					this.template_page = result.template_page;
					if(this.template_page == 1) {
						this.goodsItem = {
							page: 2,
							psize: 30,
							empty: 0,
							data: result.goods,
							orderby: {
								type: '',
								value: ''
							}
						};
						if(this.goodsItem.data.length < this.goodsItem.psize) {
							this.goodsItem.loaded = true;
							if(!this.goodsItem.data.length) {
								this.goodsItem.empty = 1;
							}
						}
						this.categorySelectedId = result.cid;
						this.childSelectedId = result.child_id;
						this.goodsAll[this.categorySelectedIndex] = [];
						this.goodsAll[this.categorySelectedIndex][this.childSelectedIndex] = this.goodsItem;
						this.categorySelected = result.category[this.categorySelectedIndex] || {};
					} else {
						this.cateHasGoods = result.cate_has_goods;
					}

					this.store = result.store;
					if(this.store.tips) {
						var storeNotice = 'storeNotice' + this.store.id;
						var storeNoticeStorage = this.util.getStorage(storeNotice);
						if(!storeNoticeStorage || (storeNoticeStorage && !storeNoticeStorage.notice)) {
							this.util.setStorage(storeNotice, {'notice': 1}, 300)
						} else {
							this.showNotice = false;
						}
					}


					this.coupon = result.coupon;
					this.categoryAll = result.category;
					this.is_rest = result.store.is_rest;
					this.table_category = result.table_category;
					this.template = result.template;
					this.lazyload_goods = result.lazyload_goods;
					this.util.setWXTitle(this.store.title)
					this.replaceStore(result.store);
					this.replaceCart(result.cart.message.cart);
					if(!this.template_page) {
						this.$nextTick(() => {
							this._initScroll();
							this._calculateHeight();
						})
					}
				})
			},

			onParentBeforeEnter(el){
				el.style.bottom = this.windowHeight - this.elBottom + 'px';
				el.style.left = this.elLeft +5 + 'px';
				el.style.opacity = 0;
			},

			onParentAfterEnter(el){
				el.style.bottom = -20 + 'px';
				el.style.left = 20 + 'px';
				el.style.opacity = 1;
				setTimeout(() => {
					this.replaceState({key: 'cart_animate', val: true});
				}, 400)
			},

			_initScroll() {
				this.categoryScroll = new BScroll(this.$refs.categoryWrapper, {
					click: true
				});
				this.goodsScroll = new BScroll(this.$refs.goodsWrapper, {
					click: true,
					probeType: 3
				});

				this.goodsScroll.on('scroll', (pos) => {
					// 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
					if (pos.y <= 0) {
						this.scrollY = Math.abs(Math.round(pos.y));
					}
				});
			},
			_calculateHeight() {
				let goodsList = this.$refs.goodsList;
				let height = 0;
				if(this.$refs.couponWrapper) {
					height += this.$refs.couponWrapper.clientHeight;
				}
				if(this.$refs.shopPageWrapper) {
					height += this.$refs.shopPageWrapper.clientHeight;
				}
				this.listHeight.push(0);
				for (let i = 0; i < goodsList.length; i++) {
					let item = goodsList[i];
					height += item.clientHeight;
					this.listHeight.push(height);
				}
			},
			_followScroll(index) {
				if(index != this.tabActive) {
					let categoryItem = this.$refs.categoryItem;
					let el = categoryItem[index];
					this.categoryScroll.scrollToElement(el, 300, 0, -100);
					this.tabActive = index;
				}
			},
			selectCategory(index, event) {
				if (!event._constructed) {
					return;
				}
				let goodsList = this.$refs.goodsList;
				let el = goodsList[index];
				this.goodsScroll.scrollToElement(el, 500);
			}
		},
		watch: {
			icart() {
				var cartgoods = this.icart.data;
				if(this.template_page == 1) {
					var categoryAllTemp = this.categoryAll;
					if(cartgoods) {
						for(var c in categoryAllTemp) {
							categoryAllTemp[c]['total'] = 0;
							if(categoryAllTemp[c]['child'] && categoryAllTemp[c]['child'].length > 0) {
								for(var index in categoryAllTemp[c]['child']) {
									categoryAllTemp[c]['child'][index]['total'] = 0;
									var childtotal = 0;
									var total = 0;
									for(var i in cartgoods) {
										for(var j in cartgoods[i]) {
											if(cartgoods[i][j]['cid'] == categoryAllTemp[c]['id']) {
												total += cartgoods[i][j]['num'];
												categoryAllTemp[c]['total'] = total;
												if(cartgoods[i][j]['child_id'] == categoryAllTemp[c]['child'][index]['id']) {
													childtotal += cartgoods[i][j]['num'];
													categoryAllTemp[c]['child'][index]['total'] = childtotal;
												}
											}
										}
									}
								}
							} else {
								var total = 0;
								for(var i in cartgoods) {
									for(var j in cartgoods[i]) {
										if(cartgoods[i][j]['cid'] == categoryAllTemp[c]['id']) {
											total += cartgoods[i][j]['num'];
											categoryAllTemp[c]['total'] = total;
										}
									}
								}
							}
						}
					} else {
						for(var c in categoryAllTemp) {
							categoryAllTemp[c]['total'] = 0;
							if(categoryAllTemp[c]['child']) {
								for(var index in categoryAllTemp[c]['child']) {
									categoryAllTemp[c]['child'][index]['total'] = 0;
								}
							}
						}
					}
					this.categoryAll = categoryAllTemp;
				} else {
					var cateHasGoods = this.cateHasGoods;
					if(cartgoods) {
						for(var x in cateHasGoods) {
							cateHasGoods[x]['total'] = 0;
							var total = 0;
							for(var i in cartgoods) {
								for(var j in cartgoods[i]) {
									if(cartgoods[i][j]['cid'] == cateHasGoods[x]['id']) {
										total += cartgoods[i][j]['num'];
										cateHasGoods[x]['total'] = total;
									}
								}
							}
						}
					} else {
						for(var x in cateHasGoods) {
							cateHasGoods[x]['total'] = 0;
						}
					}
					this.cateHasGoods = cateHasGoods;
				}
			},
		},
		created(){
			this.query = this.$route.query;
			if(this.query) {
				this.sid = this.query.sid;
				this.table_cid = this.query.table_cid;
			}
		},
		computed: {
			...mapState([
				'istore', 'icart', 'reserveExtra'
			]),

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

			currentIndex:function() {
				for (let i = 0; i < this.listHeight.length; i++) {
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i + 1];
					if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
						this._followScroll(i);
						return i;
					}
				}
				return 0;
			},

		},
		mounted () {
			this.onLoad();
			this.$nextTick(() => {
				let bodyHeight = document.documentElement.clientHeight;
				let headerHeight = document.getElementsByClassName('header')[0].clientHeight;
				let tabsHeight =document.getElementsByClassName('store-tabs')[0].clientHeight;
				this.vanColHeight = bodyHeight-headerHeight-tabsHeight-50;
				this.windowHeight = window.innerHeight;
			})
		}
	}
</script>

<style>
	@import '../../../static/css/diy.css';
	#store-goods #public-header~#store-header{
		margin-top: 46px;
	}
	/*小球*/
	#store-goods .parent_move_dot{
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
	/*非可售时间*/
	#store-goods .not-in-time-popup{
		max-width: 100%;
		width: 75%;
		background-color: #fff;
		border-radius: 4px;
		font-size: 14px;
	}
	#store-goods .not-in-time-popup .popup-top{
		width: 100%;
		padding: 26px 28px 0 28px;
		box-sizing: border-box;
	}
	#store-goods .not-in-time-popup .popup-top .popup-item{
		margin-bottom: 10px;
	}
	#store-goods .not-in-time-popup .popup-top .popup-title{
		color: #000;
		font-size: 15px;
		font-weight: bold;
		margin-bottom: 5px;
	}
	#store-goods .not-in-time-popup .popup-top .popup-text{
		line-height: 2;
	}
	#store-goods .not-in-time-popup .popup-bottom{
		width: 100%;
		height: 52px;
		line-height: 52px;
		color: #ff2d4b;
		text-align: center;
		box-sizing: border-box;
	}
	/*选规格*/
	#store-goods .options-popup{
		max-width: 90%;
		width: 90%;
	}
	#store-goods .options-dialog{
		background-color: #fff;
		width: 100%;
	}
	#store-goods .options-dialog .muti-close{
		position: absolute;
		top: 10px;
		right: 10px;
		width: 24px;
		height: 24px;
		text-align: center;
	}
	#store-goods .options-dialog .muti-close::before,.options-dialog .muti-close::after{
		position: absolute;
		top: 10px;
		right: 1px;
		width: 20px;
		height: 1px;
		background: #666;
		content: '';
	}
	#store-goods .options-dialog .muti-close::before{
		-webkit-transform: rotate(45deg);
		-ms-transform: rotate(45deg);
		-moz-transform: rotate(45deg);
		transform: rotate(45deg);
	}
	#store-goods .options-dialog .muti-close::after{
		-webkit-transform: rotate(135deg);
		-ms-transform: rotate(135deg);
		-moz-transform: rotate(135deg);
		transform: rotate(135deg);
	}
	#store-goods .options-dialog .muti-food-title{
		line-height: 44px;
		margin: 0 35px;
		font-size: 16px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		text-align: center;
		border-radius: 8px 8px 0 0;
	}
	#store-goods .options-dialog .muti-cont{
		max-height: 250px;
		overflow-y: scroll;
		overflow-x: hidden;
		-webkit-box-flex: 1;
		font-size: 14px;
		padding-bottom: 10px;
	}
	#store-goods .options-dialog .muti-cont .muti-sec .muti-sec-title{
		line-height: 20px;
		margin: 10px 0 0 15px;
	}
	#store-goods .options-dialog .muti-cont .muti-sec .muti-choice{
		margin: 0 5px;
		overflow: hidden;
	}
	#store-goods .options-dialog .muti-cont .muti-sec .muti-choice div{
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
	#store-goods .options-dialog .muti-cont .muti-sec .muti-choice div.selected{
		border-color: #FF2D4B;
		color: #FF2D4B;
	}
	#store-goods .options-dialog .muti-choose{
		height: 56px;
		background-color: #f4f4f4;
		overflow: hidden;
		border-radius: 0 0 8px 8px;
	}
	#store-goods .options-dialog .muti-choose .muti-oprt{
		float: right;
		display: inline-block;
	}
	#store-goods .options-dialog .muti-choose .muti-oprt .muti-cart-btn{
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
	#store-goods .options-dialog .muti-choose .muti-cart-oprt{
		margin-top: 16px;
	}
	#store-goods .options-dialog .muti-choose .muti-cart-oprt .add-food,.options-dialog .muti-choose .muti-cart-oprt .remove-food{
		float: right;
		height: 35px;
		width: 35px;
		display: inline-block;
	}
	#store-goods .options-dialog .muti-choose .muti-cart-oprt .add-food{
		text-align: left;
	}
	#store-goods .options-dialog .muti-choose .muti-cart-oprt .remove-food{
		text-align: right;
	}
	#store-goods .options-dialog .muti-choose .muti-cart-oprt .add-food .van-icon{
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
	#store-goods .options-dialog .muti-choose .muti-cart-oprt .remove-food div{
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
	#store-goods .options-dialog .muti-choose .muti-cart-oprt div{
		height: 27px;
		line-height: 27px;
		min-width: 21px;
		text-align: center;
		float: right;
	}
	#store-goods .options-dialog .muti-choose .muti-info{
		margin-left: 15px;
		line-height: 56px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#store-goods .options-dialog .muti-choose .muti-info .muti-price{
		font-size: 24px;
		color: #FB4E44;
		vertical-align: middle;
		display: inline-block;
	}
	#store-goods .options-dialog .muti-choose .muti-info .muti-type{
		margin-left: 5px;
		font-size: 12px;
		color: #2F2F2F;
		display: inline-block;
		vertical-align: middle;
	}
	#store-goods .goods-some .van-col{
		overflow-y: auto;
		background: #fff;
	}
	#store-goods .goods-all .van-col{
		overflow-y: hidden;
		background: #fff;
	}
	#store-goods .van-col::-webkit-scrollbar {
		display: none;
	}
	#store-goods .van-cell__left-icon{
		font-size: 20px;
	}
	#store-goods .store-tabs{
		width: 100%;
		height: 45px;
		line-height: 45px;
		background-color: #fff;
		color: #333;
	}
	#store-goods .store-tabs .tab-item{
		width: 40%;
		height: 100%;
		text-align: center;
		font-size: 14px;
		position: relative;
	}
	#store-goods .store-tabs .tab-item.active{
		color: #f44;
	}
	#store-goods .store-tabs .tab-item.active:after{
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 0;
		border-bottom: 2px solid #f44;
	}
	/* 分隔线 */
	#store-goods .fg-line{
		display: inline-block;
		margin: 5px 5px 0 5px;
		width: 0;
		height: 9px;
		font-size: 0;
		border-right: 1px solid #ccc;
	}
	/*商品主体*/
	#store-goods .goods-container .tabs-list{
		width: 100%;
		text-align: center;
	}
	#store-goods .goods-container .tabs-list .van-badge{
		padding: 15px 6px;
		line-height: 1.5;
	}
	/*门店优惠券*/
	#store-goods .coupon-show-container{
		margin: 10px;
		height: 75px;
		background: url(//xs01.meituan.net/waimai_i/img/coupon_bg.41b40907.png) no-repeat;
		background-size: 100% 75px;
	}
	#store-goods .coupon-show-container .coupon-price{
		float: left;
		line-height: 75px;
		margin-left: 16px;
		color: #FFD161;
		font-size: 17px;
		text-align: center;
		white-space: nowrap;
	}
	#store-goods .coupon-show-container .coupon-price div{
		display: inline-block;
		font-size: 30px;
	}
	#store-goods .coupon-show-container .coupon-detail{
		float: left;
		margin: 15px 0 0 4%;
	}
	#store-goods .coupon-show-container .coupon-detail .coupon-title{
		line-height: 23px;
		font-size: 16px;
		color: #333;
	}
	#store-goods .coupon-show-container .coupon-detail .coupon-desc{
		line-height: 16px;
		font-size: 12px;
		color: #999;
	}
	#store-goods .coupon-show-container .coupon-fetch{
		float: right;
		width: 25%;
		line-height: 75px;
		color: #FFD161;
		font-size: 14px;
		text-align: center;
	}
	/*门店海报*/
	#store-goods .banner{
		width: 100%;
		box-sizing: border-box;
		margin: 10px 0px;
		padding: 0px 10px;
	}
	#store-goods .banner .banner-item{
		display: inline-block;
		width: 100%;
		height: 80px;
		margin-bottom: 10px;
	}
	#store-goods .banner .banner-item:last-child{
		margin-bottom: 0px;
	}
	#store-goods .banner .banner-item img{
		width: 100%;
		height: 100%;
		border-radius: 4px;
		margin-bottom: -1px;
	}
	/* 二级分类样式 */
	#store-goods .tag2-list{
		width: 100%;
		padding-left: 10px;
		box-sizing: border-box;
		display:flex;
		flex-wrap:wrap;
		align-items: flex-end;
		margin-top: 10px;
	}
	#store-goods .tag2-list .tag2-item{
		position: relative;
		display:inline-block;
		width:29%;
		height:35px;
		padding:0px 5px;
		box-sizing: border-box;
		background: #F3F3F3;
		text-align:center;
		line-height: 35px;
		font-size:14px;
		margin-right: 10px;
		margin-bottom: 10px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		border-radius: 2px;
	}
	#store-goods .tag2-list .tag2-item.selected{
		background: #FFF;
		border:1px solid #FF2D4B;
		color:#FF2D4B;
		top: 0;
		left:0;
	}
	#store-goods .tag2-list .dot{
		width: 7px;
		height: 7px;
		position: absolute;
		top: 7px;
		right: 7px;
		border-radius: 50%;
		background-color: #ff2d4b;
	}
	/*分类名称*/
	#store-goods .title{
		color: #333;
		font-size: 14px;
		padding: 5px 8px;
		line-height: 18px;
		background: #F9F9F9;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
	}
	#store-goods .title .title-text{
		max-width: 70%;
	}
	#store-goods .title .title-line{
		display: inline-block;
		margin: 0 3px;
		width: 0;
		height: 10px;
		border-right: 2px solid #FF2D4B;
	}
	#store-goods .title .title-rank{
		float:right;
		display: flex;
		font-size:12px;
		height:100%;
	}
	#store-goods .title .title-rank .selected{
		font-weight: bold;
	}
	#store-goods .title .title-rank .shu{
		font-size:6px;
		padding:0px 8px;
		color:#999;
	}
	#store-goods .title .title-rank .prionToggleCategoryce-container{
		display: flex;
	}
	#store-goods .title .title-rank .prionToggleCategoryce-container .triangle{
		height:100%;
		padding-top:3px;
		padding-left:3px;
	}
	#store-goods .title .title-rank .prionToggleCategoryce-container .triangle .triangle-top{
		width: 0;
		height: 0;
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;
		border-bottom: 5px solid #ccc;
		margin-bottom:2px;
	}
	#store-goods .title .title-rank .prionToggleCategoryce-container .triangle .triangle-top.selected{
		border-bottom: 5px solid #000;
	}
	#store-goods .title .title-rank .prionToggleCategoryce-container .triangle .triangle-bottom{
		width: 0;
		height: 0;
		border-left: 4px solid transparent;
		border-right: 4px solid transparent;
		border-top: 5px solid #ccc;
	}
	#store-goods .title .title-rank .prionToggleCategoryce-container .triangle .triangle-bottom.selected{
		border-top: 5px solid #000;
	}

	/*商品*/
	#store-goods .goods-container .goods{
		position: relative;
		padding: 0 10px;
		font-size: 18px;
		line-height: 20px;
	}
	#store-goods .goods-container .goods-inner{
		padding: 10px 0;
	}

	#store-goods .goods-container .goods .image-box{
		float: left;
		width: 56px;
		height: 56px;
		display: inline-block;
		margin-right: 10px;
		position: relative;
	}
	#store-goods .goods-container .goods .image-box .pic{
		width: 100%;
		height: 100%;
	}
	#store-goods .goods-container .goods .image-box .label{
		position: absolute;
		left: 0;
		top: 0;
		font-size: 12px;
		color: #fff;
		background-color: #ff2d4b;
		height: 14px;
		line-height: 14px;
		padding: 0 2px;
	}
	#store-goods .goods-container .goods .shop-info{
		float: left;
		max-width: 72%;
		min-height: 55px;
	}
	#store-goods .goods-container .goods .shop-info .name{
		color: #3d4145;
		font-size: 16px;
		line-height: 20px;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		font-weight: 500;
	}
	#store-goods .goods-container .goods .shop-info .sold{
		color: #8C8C8C;
		font-size: 12px;
		line-height: 1.5;
	}
	#store-goods .goods-container .goods .shop-info .description{
		color: #8C8C8C;
		font-size: 10px;
		line-height: 16px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	#store-goods .goods-container .goods .shop-info .price .now-price{
		color: #f45044;
		font-size: 20px;
		line-height: 20px;
		font-weight: bold;
		display: inline-block;
	}
	.goods-container .goods .shop-info .price .now-price .price-icon{
		display: inline-block;
	}
	#store-goods .goods-container .goods .shop-info .price .old-price{
		display: inline-block;
		font-size: 12px;
		text-decoration: line-through;
		color: #8C8C8C;
		font-weight: normal;
	}
	#store-goods .goods-container .goods .shop-info .price .old-price .price-icon{
		font-size: 10px;
		display: inline-block;
	}
	#store-goods .goods-container .goods .shop-info .discount{
		font-size: 12px;
		color: #f45044;
	}

	#store-goods .goods-list{
		background: #fff;
		padding-bottom: 20px;
	}
	#store-goods .goods-list .goods-item{
		padding-top: 20px;
		padding-bottom: 10px;
		float: left;
		border-right: 1px solid #e0e0e0;
		border-bottom: 1px solid #e0e0e0;
		box-sizing: border-box;
		width: 50%;
		display: inline-block;
	}
	#store-goods .goods-list .goods-item:first-child{
		padding-top: 0;
		margin-top: 20px;
	}
	#store-goods .goods-list .goods-item:nth-child(odd){
		padding-bottom: 0;
		border-bottom: none;
	}
	#store-goods .goods-list .goods-item:nth-child(odd) .goods-info{
		padding-left: 0;
		margin-left: 15px;
		padding-bottom: 10px;
		border-bottom: 1px solid #e0e0e0;
	}
	#store-goods .goods-list .goods-item:nth-child(even){
		padding-bottom: 0;
		border-bottom: none;
	}
	#store-goods .goods-list .goods-item:nth-child(even) .goods-info{
		padding-right: 0;
		margin-right: 15px;
		padding-bottom: 10px;
		border-bottom: 1px solid #e0e0e0;
	}
	#store-goods .goods-list .goods-item .goods-info{
		position: relative;
		padding: 0 15px;
	}
	#store-goods .goods-list .goods-item .avatar{
		display: inline-block;
		width: 100%;
		height: 95px;
	}
	#store-goods .goods-list .goods-item .avatar img{
		display: inline-block;
		width: 100%;
		height: 100%;
	}
	#store-goods .goods-list .goods-item .goods-name{
		font-size: 16px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-top: 5px;
	}
	#store-goods .goods-list .goods-item .description{
		font-size: 14px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #606060;
		height: 22px;
	}
	#store-goods .goods-list .goods-item .solid{
		font-size: 12px;
		color: #B8B8B8;
		margin-top: 3px;
	}
	#store-goods .goods-list .goods-item .solid div{
		display: inline-block;
		margin-left: 5px;
	}
	#store-goods .goods-list .goods-item .price{
		font-size: 14px;
		color: #FA4F3F;
		margin-top: 5px;
	}
	#store-goods .goods-list .goods-item .price{
		color: #FA4F3F;
		font-size: 14px;
		margin-top: 5px;
		line-height: 20px;
		display: inline-block;
	}
	#store-goods .goods-list .goods-item .price div{
		display: inline-block;
		font-size: 20px;
		font-weight: bold;
		line-height:20px;
	}
	#store-goods .goods-list .goods-item .old-price{
		display: inline-block;
		font-size: 12px;
		text-decoration: line-through;
		color: #8C8C8C;
		font-weight: normal;
	}
	#store-goods .goods-list .goods-item .discount{
		font-size: 12px;
		color: #f45044;
		height: 22px;
	}
	/*店铺休息中推荐*/
	#store-goods .recommend-popup{
		width: 100%;
		height: 380px;
		overflow: hidden;
		z-index: 100000!important;
	}
	#store-goods .guide-head {
		width: 93%;
		background: #fff;
		padding: 15px 15px;
		text-align: center;
		color: #333;
		height: 100px;
		box-sizing: border-box;
		margin: 0 auto;
	}
	#store-goods .guide-head .store-rest {
		font-size: 20px;
		font-weight: 600;
		line-height: 20px;
		overflow: hidden;
		padding-left: 22px;
		text-align: center;
	}
	#store-goods .guide-head .store-rest .store-close {
		float: right;
	}
	#store-goods .guide-head .store-rest .store-close .van-icon-unfold {
		float: right;
		width: 100%;
		height: 100%;
		text-align: center;
		font-size: 16px;
		line-height: 16px;
		color: #727272;
	}
	#store-goods .guide-head .store-start {
		font-size: 16px;
		color: #727272;
		display: block;
	}
	#store-goods .guide-head .store-recommended {
		font-size: 16px;
		color: #ccc;
		display: block;
		margin-top: 7px;
	}
	#store-goods .diy-store-list{
		width: 100%;
		height: 270px;
		box-sizing: border-box;
		overflow-y: auto;
	}
	#store-goods .goods-list .foodop{
		right: 5px;
		bottom: 22px;
	}
</style>




// WEBPACK FOOTER //
// src/pages/reserve/goods.vue