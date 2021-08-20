<template>
	<div id="order-create">
		<public-header title="订单确认"></public-header>
		<div class="content" :style="{bottom: order.order_type == 1 && address && address.address ? '88px' : '50px'}">
			<div class="content-scroll">
				<div class="delivery-info margin-10-b bg-default radius-3">
					<ul class="delivery-mode" v-if="store.delivery_type == 3">
						<li class="delivery" :class="{active: order.order_type == 1}" @click="onChangeOrderType(1)" v-if="store.delivery_type == 1 || store.delivery_type == 3">{{store.delivery_mode == 1 ? '商家自送' : '骑手配送'}}</li>
						<li class="self" :class="{active: order.order_type == 2}" @click="onChangeOrderType(2)" v-if="store.delivery_type == 2 || store.delivery_type == 3">到店自取 <van-tag type="danger" v-if="store.selfPickup_status > 0">有优惠</van-tag></li>
					</ul>
					<div class="plateform-box" v-if="store.delivery_type == 1 || store.delivery_type == 3">
						<van-cell-group class="border-0px" v-if="store.delivery_type == 1">
							<van-cell :value="store.delivery_mode == 1 ? '商家自送' : '骑手配送'">
							</van-cell>
						</van-cell-group>
						<div class="plateform-inner" v-if="order.order_type == 1">
							<van-cell-group class="border-0px">
								<van-cell class="addrress-select" title="选择收货地址" icon="plus" is-link v-if="!address.address" @click="util.jsUrl( '/pages/member/address', {sid: sid}, 'replace')" />
								<van-cell icon="locationfill" is-link class="store-address" @click="util.jsUrl( '/pages/member/address', {sid: sid}, 'replace')" v-else>
									<template slot="title">
										<div>{{address.address}}-{{address.number}}</div>
										<div class="store-title">{{address.realname}} {{address.sex}} {{address.mobile}}</div>
									</template>
								</van-cell>
								<van-cell :title="order.deliveryTimes.predict_day_cn + ' ' + order.deliveryTimes.predict_time_cn" icon="timefill" @click="onChangePopup('deliveryTime')" is-link />
								<van-cell class="delivery-tip" v-if="store.rest_reserve_cn">{{store.rest_reserve_cn}}</van-cell>
							</van-cell-group>
						</div>
					</div>
					<div class="instore-box" v-if="store.delivery_type == 2 || store.delivery_type == 3">
						<van-cell-group class="border-0px" v-if="store.delivery_type == 2">
							<van-cell class="border-0px">
								<template slot="title">
									<span class="van-cell-text">到店自取</span>
									<van-tag type="danger" v-if="store.selfPickup_status > 0">有优惠</van-tag>
								</template>
							</van-cell>
						</van-cell-group>
						<div class="instore-inner" v-if="order.order_type == 2">
							<van-cell-group class="border-0px">
								<van-cell icon="locationfill" is-link class="store-address">
									<template slot="title">
										<div>{{store.address}}</div>
										<div class="store-title">{{store.title}}</div>
									</template>
								</van-cell>
								<van-cell :title="store.telephone" icon="mobilefill" is-link/>
								<van-cell @click="onChangePopup('deliveryTime')" :title="order.deliveryTimes.predict_day_cn + ' ' + order.deliveryTimes.predict_time_cn" icon="timefill" is-link/>
								<van-field  v-model="mobile" left-icon="mobilefill" placeholder="请输入自提人手机号" />
							</van-cell-group>
						</div>
					</div>
				</div>

				<div class="order-food">
					<div class='order-food-title'>
						<div class='food-shop'>{{store.title}}</div>
						<div class='order-tips-thirpart' v-if="store.delivery_mode == 2">{{store.delivery_title}}</div>
					</div>
					<div class="food-list" v-if="!is_pindan || !pindan_id">
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
					<div class="food-list" v-else-if="is_pindan == 1 && pindan_id > 0">
						<template v-for="(pindanData, index) in cart.data">
							<div class='pindan-cart-title'>口袋{{index + 1}}</div>
							<template v-for="pindanItem in pindanData">
								<template v-for="pindanOption in pindanItem">
									<van-card :thumb="pindanOption.thumb" v-if="pindanOption.goods_id != '88888'">
										<div slot="title" class="food-title">
											<div class="left">
												<img class="activity-img" src="static/img/bargain_b.png" alt="" v-if="pindanOption.bargain_id > 0">
												{{pindanOption.title}}
											</div>
											<div class="right">¥{{pindanOption.total_discount_price}}</div>
										</div>
										<div slot="desc" class="food-desc">
											<div class="left">x{{pindanOption.num}}</div>
											<div class="right">¥{{pindanOption.total_price}}</div>
										</div>
									</van-card>
								</template>
							</template>
						</template>
					</div>
					<van-cell-group class="extre-fee border-0px">
						<van-cell :title="store.cn.box_price" class="border-0px">
							<template slot="right-icon">￥{{order.box_price}}</template>
						</van-cell>
						<van-cell :title="store.cn.pack_fee" class="border-0px" v-if="order.pack_fee > 0">
							<template slot="right-icon">￥{{order.pack_fee}}</template>
						</van-cell>
						<van-cell title="配送费" class="border-0px">
							<template slot="right-icon">￥{{order.delivery_fee}}</template>
						</van-cell>
						<template v-if="order.extra_fee > 0">
							<template v-if="order.extra_fee_detail.length > 0" v-for="item in order.extra_fee_detail">
								<van-cell :title="item.name" class="border-0px">
									<template slot="right-icon">￥{{item.fee}}</template>
								</van-cell>
							</template>
						</template>
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
							<template slot="right-icon" v-if="order.redpacket && order.redpacket.id">
								<span class="c-danger" @click="onChangePopup('redPacket')">-￥{{order.redpacket.discount}}</span>
							</template>
							<template slot="right-icon" v-else>
								<span class="c-danger" v-if="redPackets && redPackets.length > 0" @click="onChangePopup('redPacket')">
									{{redPackets.length}}个可用红包
								</span>
								<template v-else>
									<span class="c-danger" @click="onChangePopup('redPacket')" v-if="svip_redpacket && svip_redpacket.id">您有可领取的超级会员红包</span>
									<span class="c-disabled" v-else>
										暂无可用红包
									</span>
								</template>
								<i class="van-icon van-icon-arrow van-cell__right-icon"></i>
							</template>
						</van-cell>
						<div class="redpacket-buy" v-if="order.meal_redpackets">
							<div class="flex-lr">
								<p class="buy-tip">{{order.meal_redpackets.title}} <router-link v-if="0"@click="onChangePopup('mealRedpacketRules')" tag="i" to="" class="icon icon-question1"></router-link></p>
								<span class="check-box flex" :class="{active: buy_mealredpacket == 1}" @click="onBuyMealredpacket">
									<i class="icon icon-check"></i>
								</span>
							</div>
							<div class="flex-lr">
								<p class="buy-total">{{order.meal_redpackets.placeholder}}</p>
								<p class="redpacket-price">
									<span class="old" v-if="0">¥{{order.meal_redpackets.old_price}}</span>
									<span class="now">¥{{order.meal_redpackets.price}}</span>
								</p>
							</div>
						</div>
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
				<!--开通svip-->
				<div class="buy-svip bg-default padding-15 margin-10-t flex-lr font-12" v-if="order.show_buy_svip == 1">
					<div class="left flex-lr">
						<div class="svip-desc">
							<div class="main-desc ">
								<span class="font-bold font-16">成为超级会员, 本单享优惠 </span>
								<i class="icon icon-question1 font-14"></i>
							</div>
							<template v-if="svip_redpacket && svip_redpacket.id">
								<div class="second-desc">1.可用一个{{svip_redpacket.discount}}元会员专享红包</div>
							</template>
							<template v-else>
								<div class="second-desc">成为超级会员, 尊享众多会员特权</div>
							</template>
						</div>
						<div class="svip-price" v-if="order.svip_meal">
							<div class="first-buy" >{{order.svip_meal.description}}</div>
							<div class="flex-lr">
								<div class="c-gray line-through margin-15-r">￥{{order.svip_meal.oldprice}}</div>
								<div class="font-16 font-bold">￥{{order.svip_meal.price}}</div>
							</div>
						</div>
					</div>
					<div class="right" @click="onToggleBuysvip">
						<div class="icon icon-check" :class="{active: is_buysvip == 1}"></div>
					</div>
				</div>
				<!--准时宝-->
				<template v-if="orderExtra.order_type == 1">
					<div class="permit-time" v-if="store.data && store.data.zhunshibao && store.data.zhunshibao.status == 1">
						<div class="flex-lr">
							<div class="flex" @click="onChangePopup('zhunshibaoAgreementShow')">
								<i class="icon icon-security"></i>
								<div class="permit-time-title">准时宝</div>
								<i class="icon icon-question"></i>
							</div>
							<div class="flex">
								<div class="padding-10-r">¥{{store.data.zhunshibao.price}}</div>
								<van-switch
									v-model="orderExtra.buy_zhunshibao"
								    size="22px"
									active-color="#ff2d4b"
									inactive-color="#eee"
									@change='onToggleZhunshibao'
								/>
							</div>
						</div>
						<div class="permit-time-tips">{{store.data.zhunshibao.rule_cn}}</div>
						<div class="agreement" v-if="0">
							<i class="icon icon-check"></i>
							<router-link tag="div" to="" class="text">同意《准时宝服务协议》</router-link>
						</div>
					</div>
				</template>
				<div class="order-region">
					<van-cell-group>
						<van-cell title="支付方式" >
							<div slot="right-icon" class="c-disabled">在线支付</div>
						</van-cell>
						<van-cell title="餐具数量" @click="onChangePopup('picknum')">
							<template slot="right-icon">
								<template v-if="orderExtra.person_num">
									{{orderExtra.person_num}}套
								</template>
								<span class="c-disabled" v-else>未选择</span>
								<i class="van-icon van-icon-arrow van-cell__right-icon"></i>
							</template>
						</van-cell>
						<van-cell class="flex-lr" title="备注/发票" @click="util.jsUrl('/pages/order/note',{ sid: sid}, 'replace')">
							<div slot="right-icon" class="note flex-lr">
								<div class="note-text" v-if="orderExtra.note || order.note">
									{{orderExtra.note || order.note}}
								</div><span class="c-disabled" v-else>口味、偏好等要求</span>
								<i class="van-icon van-icon-arrow van-cell__right-icon"></i>
							</div>
						</van-cell>
					</van-cell-group>
				</div>
			</div>
		</div>
		<!--餐具人数选择-->
		<van-popup v-model="popup.picknum" position="bottom">
			<div class="popup-picknum">
				<van-picker :columns="columns" @confirm="onConfirmPersonNum" @cancel="onChangePopup('picknum')" show-toolbar confirm-button-text="确认" cancel-button-text="取消"/>
			</div>
		</van-popup>
		<van-popup v-model="popup.zhunshibaoAgreementShow" position="bottom" class="agreement-popup" :style="{height: '100%'}">
			<van-nav-bar class="border-0px" title="准时宝服务协议" @click-left="onChangePopup('zhunshibaoAgreementShow')" :style="{background: '#ff2d4b', color: '#fff' }">
				<van-icon name="left" :style="{color: '#fff'}" slot="left" class="font-20"></van-icon>
			</van-nav-bar>
			<div class="popup-content margin-10" v-html="store.zhunshibao_agreement"></div>
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

		<!-- 红包弹出层 -->
		<van-popup v-model="popup.redPacket" position="bottom" v-if="(redPackets && redPackets.length > 0) || (svip_redpacket && svip_redpacket.id)">
			<div class="popup-redpacket">
				<div class="popup-title van-hairline--bottom">平台红包</div>
				<div class="popup-container">
					<template v-if="svip_redpacket && svip_redpacket.id">
						<load type="loaded" text="超级会员专享红包" bgcolor="#f5f5f5"></load>
						<div class="svip-redpacket" v-if="is_buysvip == 1">
							<div class="svip-redpacket-item">
								<div class="svip-redpacket-top flex">
									<div class="svip-redpacket-left flex">
										<div class="redpacket-img">
											<img class="img-100" :src="svip_redpacket.logo" alt="" v-if="svip_redpacket.sid > 0">
											<img class="img-100" src="static/img/svip_redpacket.png" alt="" v-else>
										</div>
										<div class="redpacket-info">
											<div class="redpacket-title">{{svip_redpacket.title}}</div>
											<div>
												<span class="redpacket-tips">超级会员</span>
												<span class="font-12 c-gray"> 限会员有效期内使用</span>
											</div>
										</div>
									</div>
									<div class="svip-redpacket-right">
										<div class="c-danger">
											<div class="redpacket-money">
												<span class="redpacket-unit">￥</span>
												{{svip_redpacket.discount}}
											</div>
										</div>
										<div class="font-12 c-gray" v-if="svip_redpacket.condition == 0">无门槛</div>
										<div class="font-12 c-gray" v-else-if="svip_redpacket.condition > 0">满{{svip_redpacket.condition}}元</div>
									</div>
								</div>
								<div class="svip-redpacket-line">
									<div class="line"></div>
								</div>
								<div class="svip-redpacket-bottom flex-lr">
									<div class="font-12 c-gray">{{svip_redpacket.desc}}</div>
									<div class="svip-redpacket-convert" @click="onSelectRedpacket('svip_' + svip_redpacket.store_redpacket.id)" v-if="svip_redpacket.store_redpacket && svip_redpacket.store_redpacket.id">立即使用</div>
									<div class="svip-redpacket-convert" @click="onSelectRedpacket(svip_redpacket.id)" v-else>立即使用</div>
								</div>
							</div>
						</div>
						<div class="svip-redpacket" v-else>
							<div class="svip-redpacket-item">
								<div class="svip-redpacket-top flex">
									<div class="svip-redpacket-left flex">
										<div class="redpacket-img">
											<img class="img-100" :src="svip_redpacket.logo" alt="" v-if="svip_redpacket.sid > 0">
											<img class="img-100" src="static/img/svip_redpacket.png" alt="" v-else>
										</div>
										<div class="redpacket-info">
											<div class="redpacket-title">{{svip_redpacket.title}}</div>
											<div>
												<span class="redpacket-tips">超级会员</span>
												<span class="font-12 c-gray"> 限{{svip_redpacket.endtime_cn}}前领取</span>
											</div>
										</div>
									</div>
									<div class="svip-redpacket-right">
										<div class="c-danger">
											<div class="redpacket-money">
												<span class="redpacket-unit">￥</span>
												{{svip_redpacket.discount}}
											</div>
										</div>
										<div class="font-12 c-gray" v-if="svip_redpacket.condition == 0">无门槛</div>
										<div class="font-12 c-gray" v-else-if="svip_redpacket.condition > 0">满{{svip_redpacket.condition}}元</div>
									</div>
								</div>
								<div class="svip-redpacket-line">
									<div class="line"></div>
								</div>
								<div class="svip-redpacket-bottom flex-lr">
									<div class="font-12 c-gray">{{svip_redpacket.desc}}</div>
									<template v-if="svip_redpacket.take_status == 'take'">
										<div class="svip-redpacket-convert" @click="onConfirmSvipExchange">立即领取</div>
									</template>
									<template v-else-if="svip_redpacket.take_status == 'exchange'">
										<div class="svip-redpacket-convert" @click="onChangePopup('svipRedpacket')">立即兑换</div>
									</template>
								</div>
							</div>
						</div>
					</template>
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

		<!--兑换红包弹出层-->
		<van-popup v-model="popup.svipRedpacket" v-if="svip_redpacket && svip_redpacket.take_status == 'exchange' && svip_redpacket.store_redpacket">
			<div class="popup-svipRedpacket">
				<div class="svipRedpacket-wrap">
					<div class="svipRedpacket-title">兑换¥{{svip_redpacket.store_redpacket.discount}}店铺专享红包</div>
					<div class="margin-10-tb">
						<span class="font-14 c-gray">本次兑换将消耗<span class="c-danger">1个</span>「¥{{svip_redpacket.discount}}会员红包」是否兑换？</span>
					</div>
					<div class="exchange-svipRedpacket">
						<div class="exchange-start">
							<span class="price"><span>￥</span>{{svip_redpacket.discount}}</span>
							<span class="font-12">会员专享</span>
						</div>
						<div class="exchange-course">
							<img class="img-100" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2MiAzMyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMTAwJSIgeTI9IjAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkRGM0M3IiBzdG9wLW9wYWNpdHk9IjAiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGNERFNzIiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cGF0aCBmaWxsPSJ1cmwoI2EpIiBkPSJNMjQuNjcxIDIuNzZjMS4zMDcgNi41MTQgMi4wMzYgMTQuMzg3IDIuMTg3IDIzLjYxOS4xNSA5LjIzMi4yMDEgMTYuNDM4LjE1MyAyMS42Mmg5LjM2Yy44ODEtMy4xNTQgMS4zMjItMTAuNDIgMS4zMjItMjEuODAxIDAtMTEuMzgtLjEyLTE5LjE5My0uMzYtMjMuNDM4aDkuMTdhLjUuNSAwIDAgMCAuMzU2LS44NTFMMzEuMjg5LTEzLjg1YS41LjUgMCAwIDAtLjcxMy4wMDJMMTUuMTM2IDEuOTFhLjUuNSAwIDAgMCAuMzU3Ljg1aDkuMTc4eiIgdHJhbnNmb3JtPSJyb3RhdGUoOTAgMzEuMzI4IDE2LjY3KSIvPjwvc3ZnPg==" alt="">
						</div>
						<div class="exchange-end">
							<span class="exchange-end-price">
								<span>￥</span>
								{{svip_redpacket.store_redpacket.discount}}
							</span>
							<span class="font-12">{{svip_redpacket.store_redpacket.title}}</span>
						</div>
					</div>
					<div class="svipRedpacket-button">
						<van-button size="normal" class="font-16" block @click="onChangePopup('svipRedpacket')">放弃优惠</van-button>
						<van-button size="normal" class="bg-danger font-16" block @click="onConfirmSvipExchange">确认兑换</van-button>
					</div>
				</div>
			</div>
		</van-popup>

		<van-popup v-model="popup.deliveryTime" position="bottom" v-if='order.deliveryTimes.predict_day && order.deliveryTimes && order.deliveryTimes.times'>
			<div class="popup-time">
				<div class="popup-container">
					<div class="left">
						<template v-for="(item, index) in order.deliveryTimes.days" >
							<div class="date-item van-hairline--bottom" :class="{'van-hairline--right': order.deliveryTimes.predict_day != item}" @click="onSelectDeliveryday(item)">{{item}}</div>
						</template>
					</div>
					<div class="right">
						<van-cell-group v-if="order.deliveryTimes.times[order.deliveryTimes.predict_day] && order.deliveryTimes.times[order.deliveryTimes.predict_day].times">
							<template v-for="(item, index) in order.deliveryTimes.times[order.deliveryTimes.predict_day].times" >
								<van-cell @click="onSelectDeliverytimes(item.time_cn, index)" :class="{active: order.deliveryTimes.predict_index==index}">
									<template slot="title">
										{{item.time_cn}}{{item.time_cn == '立即送出' ? '(' + item.start + '~' + item.end + ')' : ''}}
									</template>
									<template slot="right-icon">
										{{order.order_type == 1 ? item.total_delivery_price_cn : ''}}
										<van-icon name="check" class="van-cell__right-icon" :class="{active: order.deliveryTimes.predict_index==index}"/>
									</template>
								</van-cell>
							</template>
						</van-cell-group>
					</div>
				</div>
				<div class="popup-cancle van-hairline--top" @click="onChangePopup('deliveryTime')">取消</div>
			</div>
		</van-popup>


		<van-submit-bar   :disabled="!islegal" :price="order.final_fee * 100" label="待支付" button-text="提交订单" @submit="onSubmit">
      <div slot="default" class="order-benefit">
				已优惠 ¥{{order.discount_fee}}
			</div>
			<span slot="tip" v-if="cart.bargain_use_limit == 2">
				<span>提示：折扣商品不与商户优惠活动（满减，代金券）同享</span>
			</span>
      <span slot="tip"  v-else-if="order.order_type == 1 && address && address.address">
      	<span>收货地址：{{address.address}}-{{address.number}}</span>
      </span>
		</van-submit-bar>

		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
		<van-popup v-if="0" v-model="popup.mealRedpacketRules" position="bottom" class="agreement-popup">
			<van-nav-bar class="border-0px" title="套餐红包使用规则" @click-left="onChangePopup('mealRedpacketRules')" :style="{background: '#ff2d4b', color: '#fff' }">
				<van-icon name="left" :style="{color: '#fff'}" slot="left" class="font-20"></van-icon>
			</van-nav-bar>
			<div class="popup-content margin-10" v-html="order.meal_redpackets.rules"></div>
		</van-popup>
	</div>
</template>


<script>
	import {mapState, mapMutations} from 'vuex'
	import Load from '@/components/load'
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	import { Dialog } from 'vant';
	import {getData, setData} from "@/controller/funcCommon"


	export default {

		data() {
			return {
				showPreLoading: true,
				store: {
					cn: {}
				},
				mobile: '',
				popup:{
					coupon: false,
					redPacket: false,
					deliveryTime: false,
					picknum: false,
					mealRedpacketRules: false,
					svipRedpacket: false,
					zhunshibaoAgreementShow: false
				},
				cart:{},
				address: {},
				coupons: [],
				redPackets: [],
				svip_redpacket: {},
				order: {
					deliveryTimes: {
						days: {},
						times: {},
						predict_day: 0,
						predict_index: 0
					},
				},
				islegal: false,
				columns: ['1人', '2人', '3人', '4人', '5人'],
				buy_mealredpacket: 0,
				buy_zhunshibao: 0,
				config_takeout: {}
			}
		},
		components: {
			PublicFooter,
			PublicHeader,
			Load,
			Dialog
		},
		computed: {
			...mapState([
				'orderExtra'
			]),
		},
		watch: {
			mobile() {
				this.setOrderExtra({key: 'mobile', val: this.mobile});
			}
		},
		methods: {
			...mapMutations([
				'setOrderExtra', 'replaceOrderExtra'
			]),
			onToggleZhunshibao(status) {
				this.setOrderExtra({key: 'buy_zhunshibao', val: status});
				this.onCalculate();
			},
			onConfirmSvipExchange() {
				var that = this;
				var take_status = that.svip_redpacket.take_status;
				var id = that.svip_redpacket.id;
				if(take_status == 'exchange') {
					id = that.svip_redpacket.store_redpacket.id;
				}
				setData({
					vue: that,
					url: 'wmall/order/create/exchange',
					data: {
						sid: that.sid,
						id: id,
						oldid: that.svip_redpacket.exchange_id,
						discount: that.order.total_fee
					},
					success: (res) => {
						var message = '领取成功';
						if(take_status == 'exchange') {
							message = '兑换成功';
						}
						this.util.$toast(message);
						if(res.redPackets) {
							that.redPackets = [...res.redPackets];
						}
						that.svip_redpacket = res.svip_redpacket;
						that.onSelectRedpacket(res.redpacket_id);
						if(take_status == 'exchange') {
							that.onChangePopup('svipRedpacket');
						}
					}
				})
			},

			onConfirmPersonNum(value, index) {
				var person_num = index + 1;
				this.setOrderExtra({key: 'person_num', val: person_num});
				this.popup.picknum = false;
			},

			onSelectCoupon(id) {
				this.setOrderExtra({key: 'coupon_id', val: id});
				this.onChangePopup('coupon');
				this.onCalculate();
			},

			onSelectRedpacket(id) {
				this.setOrderExtra({key: 'redpacket_id', val: id});
				this.onChangePopup('redPacket');
				this.onCalculate();
			},

			onChangePopup(key) {
				this.popup[key] = !this.popup[key];
				if(key == 'deliveryTimes') {
					if(!this.order.deliveryTimes.predict_day || !this.order.deliveryTimes.times[this.order.deliveryTimes.predict_day]) {
						this.util.$toast('商户暂时只支持立即配送');
						return;
					}
				}
			},

			onChangeOrderType(type) {
				this.setOrderExtra({key: 'order_type', val: type});
				if(type == 2) {
					this.setOrderExtra({key: 'buy_zhunshibao', val: false});
				}
				this.onCalculate();
			},

			onSelectDeliveryday(day) {
				this.order.deliveryTimes.predict_day = day;
				this.order.deliveryTimes.predict_day_cn = day;
				this.setOrderExtra({key: 'predict_day_cn', val: day});
			},

			onSelectDeliverytimes: function(time, index) {
				this.order.deliveryTimes.predict_index = index;
				this.order.deliveryTimes.predict_time_cn = time;
				this.onChangePopup('deliveryTime');
				this.setOrderExtra({key: 'predict_index', val: index});
				this.setOrderExtra({key: 'predict_time_cn', val: time});
				this.onCalculate();
			},

			onBuyMealredpacket: function() {
				this.buy_mealredpacket = !this.buy_mealredpacket;
				if(this.buy_mealredpacket == 1) {
					this.setOrderExtra({key: 'buy_mealredpacket', val: 1});
				} else {
					this.setOrderExtra({key: 'redpacket_id', val: 0});
					this.setOrderExtra({key: 'buy_mealredpacket', val: 0});
				}
				this.onCalculate();
			},

			onToggleBuysvip() {
				if(this.is_buysvip == 1) {
					this.is_buysvip = 0;
				} else {
					this.is_buysvip = 1;
				}
				this.onCalculate();
			},

			onCalculate() {
				var params = {
					sid: this.sid,
					extra: JSON.stringify(this.orderExtra),
					is_buysvip: this.is_buysvip,
					is_pindan: this.is_pindan,
					pindan_id: this.pindan_id,
				};
				this.util.request({
					url: 'wmall/order/create/index',
					data: params,
					method: 'post'
				}).then((res) => {
					let result = res.data.message.message;
					this.address = result.address;
					this.order = result.order;
					this.islegal = result.islegal == 1;
					this.redPackets = result.redPackets;
					this.cart = result.cart;
					this.svip_redpacket = result.svip_redpacket;
					this.onCheckSendPrice(result.message, this.address);
				})
			},

			onCheckSendPrice: function(params, address) {
				if(params.errno == 'noReachSendPrice') {
					if(address) {
						var location = {
							address: address.address,
							x: address.location_x,
							y: address.location_y
						};
						//app.util.setStorageSync('location', location, 600);
					}
					this.$toast(params.message, 3000);
					this.$router.push(this.util.getUrl({path: '/pages/store/goods?sid=' + this.sid}));
					return false;
				}
				return true;
			},

			onSubmit() {
				if(this.orderExtra.order_type == 2) {
					if(!this.mobile) {
						this.$toast('请输入提货手机号');
						return false;
					}
					if(!this.util.isValidMobile(this.mobile)) {
						this.$toast('请输入正确的手机号');
						return false;
					}
					this.orderExtra.mobile = this.mobile;
				}
				if((this.orderExtra.order_type == 1 || !this.orderExtra.order_type) && !this.orderExtra.address_id && this.store.delivery_type != 2) {
					this.$toast('请选择收货地址');
					return false;
				}
				if(!this.islegal) {
					return false;
				}
				this.islegal = false;

				if(this.store.delivery_type == 2) {
					this.orderExtra.order_type = 2;
				}
				if((this.orderExtra.order_type == 1 || !this.orderExtra.order_type) && this.config_takeout.audit_accept_address == 1) {
					Dialog.confirm({
						title: '请确定您的收货信息',
						message: '收货地址：' + this.address.address +'</br>' + '手机　号：' + this.address.mobile + '</br>' + '收货　人：' + this.address.realname,
					}).then(() => {
						this.submitPost();
						return;
					}).catch(() => {
  						this.islegal = true;
					});
				} else {
					this.submitPost();
				}
			},

			submitPost: function() {
				var params = {
					sid: this.sid,
					extra: this.orderExtra,
					is_pindan: this.is_pindan,
					pindan_id: this.pindan_id
				};
				this.util.request({
					url: 'wmall/order/create/submit',
					data: params,
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						if(result.errno == 1000) {
							this.$router.push(this.util.getUrl({path: '/pages/store/goods?sid=' + this.sid}));
							return false;
						}
						return false;
					}
					var order_id = result.message;
					this.$router.replace(this.util.getUrl({path: '/pages/public/pay?order_id=' + order_id + '&order_type=takeout'}));
				})
			},

			onLoad() {
				var params = {
					sid: this.sid,
					extra: JSON.stringify(this.orderExtra),
					is_buysvip: this.is_buysvip,
					is_pindan: this.is_pindan,
					pindan_id: this.pindan_id,
				};
				this.util.request({
					url: 'wmall/order/create/index',
					data: params,
					method: 'post'
				}).then((res) => {
          var textprice = document.querySelectorAll(".van-submit-bar .van-submit-bar__price");
          textprice[0].classList.add("newClass");;

					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						if(result.errno == 1000) {
							this.$router.replace({path: '/pages/store/goods', query: {sid:  this.sid}});
							return false;
						} else {
							this.$toast(result.message);
						}
						return false;
					}
					result = result.message;
          //console.log(result.order);
					var tempExtra = Object.assign(this.orderExtra, {
						predict_index: result.order.deliveryTimes.predict_index,
						predict_time_cn: result.order.deliveryTimes.predict_time_cn,
						predict_day_cn: result.order.deliveryTimes.predict_day_cn,
						address_id: result.address.id,
						order_type: result.order.order_type,
						person_num: result.order.person_num
					});
					this.replaceOrderExtra(tempExtra);
					this.store = result.store;
					this.cart = result.cart;
					this.address = result.address;
					this.coupons = result.coupons;
					this.redPackets = result.redPackets;
					this.order = result.order;
					this.islegal = result.islegal == 1;
					this.mobile = result.mobile;
					if(this.orderExtra.buy_mealredpacket == 1) {
						this.buy_mealredpacket = 1;
					}
					this.config_takeout = result.config_takeout;
					if(this.orderExtra.mobile) {
						this.mobile = this.orderExtra.mobile;
					}
					this.onCheckSendPrice(result.message, this.address);

					//svip红包
					this.svip_redpacket = result.svip_redpacket;
          //


				})
			}
		},
		created(){
			this.query = this.$route.query;
			if(this.query) {
				this.sid = this.query.sid;
				this.is_buysvip = this.query.is_buysvip;
				this.is_pindan = this.query.is_pindan;
				this.pindan_id = this.query.pindan_id;
			}
		},
		mounted () {
			this.onLoad();
		},
		destroyed() {
			this.util.request({
				url: 'wmall/order/create/destroyed',
				data: {sid: this.sid},
			}).then((res) => {})
		}
	}
</script>

<style>
	/*整体结构*/

	#order-create .content{
		width: 100%;
		box-sizing: border-box;
		padding: 10px;
		bottom: 88px;
		overflow: hidden;
		background-color: #f5f5f5;
	}
	#order-create .content .content-scroll{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow-y: auto;
		overflow-x: hidden;
	}
	#order-create .content .content-scroll::-webkit-scrollbar {
		display: none;
	}
	#order-create .delivery-mode{
		background-color: #f5f5f5;
		display: flex;
		flex-flow: row nowrap;
		align-items: flex-end;
		justify-content: space-between;
	}
	#order-create .delivery-mode li{
		width: 50%;
		padding: 12px 0;
		text-align: center;
		position: relative;
		font-size: 16px;
		background-color: #eee;
	}
	#order-create .delivery-mode .delivery.active{
		background-color: #fff;
		color: #ff2d4b;
		padding: 18px 0 12px 0;
	}
	#order-create .delivery-mode .delivery.active:after{
		content: '';
		position: absolute;
		z-index: 10;
		top: 0;
		bottom: 0;
		right: -20px;
		width: 0;
		height: 0;
		border-width:0 20px 47px 0;
		border-style:solid;
		border-color:transparent  transparent #fff transparent;
	}
	#order-create .delivery-mode .self .van-tag{
		padding: 0px 5px;
	}
	#order-create .delivery-mode .self.active{
		background-color: #fff;
		color: #ff2d4b;
		padding: 18px 0 12px 0;
	}
	#order-create .delivery-mode .self.active:after{
		content: '';
		position: absolute;
		z-index: 10;
		top: 0;
		bottom: 0;
		left: -20px;
		width: 0;
		height: 0;
		border-width: 47px 20px  0 0;
		border-style:solid;
		border-color:  transparent #fff transparent transparent;
	}
	/*详情*/
	#order-create .order-food{
		background-color: #fff;
		margin-top: 10px;
	}
	#order-create .order-food .order-food-title{
		position: relative;
		height: 50px;
		line-height: 50px;
		padding: 0 15px;
		color: #898989;
		font-size: 14px;
		overflow: hidden;
	}
	#order-create .order-food .order-food-title .food-shop{
		float: left;
		box-sizing: border-box;
		padding-right: 75px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#order-create .order-food .order-food-title .order-tips-thirpart{
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
	#order-create .order-food .order-food-title .order-tips-thirpart::before,#order-create .order-food .order-food-title .order-tips-thirpart::after{
		content: "";
		position: absolute;
		border: 2px solid #fff;
	}
	#order-create .order-food .order-food-title .order-tips-thirpart::before{
		left: 0;
		top: 0;
		border-color: #fff #ff2d4b #ff2d4b #fff;
	}
	#order-create .order-food .order-food-title .order-tips-thirpart::after{
		right: 0;
		bottom: 0;
		border-color: #ff2d4b #fff #fff #ff2d4b;
	}
	#order-create .food-list .pindan-cart-title{
		padding-left: 10px;
		font-size: 14px;
		color: #898989;
	}
	#order-create .food-list .van-card{
		height: 75px;
		padding: 10px;
		margin-bottom: 10px;
	}
	#order-create .food-list .van-card .van-card__header .van-card__content{
		height: auto;
	}
	#order-create .food-list .van-card:last-child{
		margin-bottom: 0;
	}
	#order-create .food-list .van-card .van-card__thumb{
		top: 0px;
		left: 0px;
		width: 55px;
		height: 55px;
	}
	#order-create .food-list .van-card .food-title,#order-create .food-list .van-card .food-desc{
		display: flex;
		flex-flow: row nowrap;
		align-item: center;
		justify-content: space-between;
	}
	#order-create .food-list .van-card .food-title .left{
		display: flex;
		flex-flow: row nowrap;
		align-item: center;
	}
	#order-create .food-list .van-card .food-title .activity-img{
		width: 15px;
		height: 15px;
		margin-right: 4px;
		margin-top: 1px;
	}
	#order-create .food-list .van-card .food-desc{
		font-size: 12px;
		color: #999;
		margin-top: 5px;
	}
	#order-create .food-list .van-card .food-desc .right{
		text-decoration: line-through;
	}
	#order-create .discount-box .van-cell__value{
		color: #F95339;
	}
	#order-create .order-pay-info{
		font-size: 14px;
		position: relative;
	}
	#order-create .order-pay-info .pay-price{
		display: inline-block;
		float: right;
		line-height: 24px;
	}
	#order-create .order-pay-info .pay-price div{
		display: inline-block;
		color: #F95339;
		font-size: 16px;
	}
	#order-create .order-pay-info .total-original{
		display: inline-block;
		float: right;
		line-height: 24px;
		margin-right: 10px;
		color: #898989;
		font-size: 12px;
	}
	#order-create .order-pay-info .discount-fee{
		display: inline-block;
		float: right;
		line-height: 24px;
		margin-right: 10px;
		color: #898989;
		font-size: 12px;
	}
	#order-create .order-region{
		margin-top: 10px;
		background: #fff;
	}
	#order-create .checkbox .van-icon{
		width: 16px;
		height: 16px;
		border-radius: 50%;
		border:1px solid #ccc;
		vertical-align: middle;
		text-align: center;
		line-height: 16px;
	}
	#order-create .checkbox .van-icon.checked{
		border: 1px solid #ff2d4b;
		background-color: #ff2d4b;
		color: #fff;
	}
	#order-create .plateform-box .van-cell__value span, #order-create .instore-box .van-cell__value span, #order-create .instore-box .van-cell-text{
		font-size: 18px;
		font-weight: bold;
	}
	#order-create .plateform-box .delivery-tip{
		color: #436EBE;
	}
	#order-create .delivery-info .van-cell__left-icon,#order-create .delivery-info .van-cell__left-icon{
		font-size: 16px;
	}
	#order-create .plateform-inner .van-icon-plus{
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
	#order-create .plateform-inner .addrress-select .van-cell__title{
		color: #ff2d4b;
	}
	#order-create .instore-box{
		margin-top: 10px;
	}
	#order-create .store-title{
		font-size:12px;
		color: #999;
	}
	#order-create .store-address .van-icon{
		line-height: 48px;
	}
	/*地址弹出层*/
	#order-create .popup-address .address-list{
		height: 350px;
	}
	#order-create .popup-address .van-address-list__group::-webkit-scrollbar{
		width: 0px;
		height: 0px;
	}
	#order-create .van-address-list .van-radio__input .van-icon{
		border: 1px solid #ccc;
		border-radius: 15px;
	}
	#order-create .van-address-list .van-radio__input .van-icon-checked{
		color: #FFF;
		background-color: #38f;
		border-color: #38f;
	}
	#order-create .van-address-list .van-icon-check {
		color: #FFF;
	}
	#order-create .order-region .note{
		max-width: 75%;
	}
	#order-create .order-region .note .note-text{
		max-width: 90%;
	}
	/*时间弹出层*/
	#order-create .popup-time, #order-create .popup-coupon, #order-create .popup-redpacket{
		width: 100%;
		height: 400px;
		overflow: hidden;
	}
	#order-create .popup-time .popup-container{
		width: 100%;
		height:350px;
		display: flex;
		flex-flow: row nowrap;
		justify-content: space-between;
	}
	#order-create .popup-time .popup-container .left{
		width: 35%;
		height: 100%;
		overflow-y: auto;
		background-color: #f5f5f5;
	}
	#order-create .popup-time .popup-container .right{
		width: 65%;
		height: 100%;
		overflow-y: auto;
	}
	#order-create .popup-time .popup-container .left::-webkit-scrollbar,#order-create .popup-time .popup-container .right::-webkit-scrollbar{
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
	#order-create .popup-time .popup-cancle, #order-create .popup-coupon .popup-cancle, #order-create .popup-redpacket .popup-cancle{
		width: 100%;
		height:50px;
		text-align:center;
		line-height:50px;
		font-size:16px;
		color:#FF2D4B;
	}
	/*代金券弹出层*/
	#order-create .popup-coupon .popup-title,#order-create .popup-redpacket .popup-title{
		width: 100%;
		height: 50px;
		text-align: center;
		font-size: 16px;
		line-height: 50px;
	}
	#order-create .popup-coupon .popup-container,#order-create .popup-redpacket .popup-container{
		width: 100%;
		height: 300px;
		overflow-y: auto;
		background: #f5f5f5;
	}
	#order-create .popup-coupon .popup-container::-webkit-scrollbar,#order-create .popup-redpacket .popup-container::-webkit-scrollbar{
		width: 0px;
		height: 0px;
	}
	#order-create .coupon-list{
		padding: 0px 10px 10px;
	}
	#order-create .coupon-list .content-padded{
		margin: 0 10px 10px 10px;
	}
	#order-create .coupon-list .content-padded .coupon-item{
		background: #fff;
		margin-bottom: 12px;
		overflow: hidden;
		padding: 16px;
		position: relative;
	}
	#order-create .coupon-item .clearfix{
		overflow: hidden;
	}
	#order-create .coupon-item .clearfix .circle{
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
	#order-create .coupon-item .clearfix .circle-left{
		left: -8px;
	}
	#order-create .coupon-item .clearfix .circle-right{
		right: -8px;
	}
	#order-create .coupon-item .clearfix .overdue{
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
	#order-create .coupon-item .clearfix .use{
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
	#order-create .coupon-item .left{
		width: 70%;
		float: left;
	}
	#order-create .coupon-item .left .store-logo{
		display: inline-block;
		float: left;
		width: 32%;
	}
	#order-create .coupon-item .left .store-logo img{
		display: inline-block;
		width: 56px;
		height: 56px;
		margin-top: 4px;
	}
	#order-create .coupon-item .left .coupon-detail{
		display: inline-block;
		float: left;
		width: 60%;
	}
	#order-create .coupon-item .left .coupon-detail .coupon-title{
		font-weight: bold;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #ff2d4b;
		margin-top: 3px;
	}
	#order-create .coupon-item .left .coupon-detail .use-time{
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #808080;
		margin-top: 16px;
	}
	#order-create .coupon-item .right{
		width: 29%;
		border-left: 1px dashed #ccc;
		text-align: center;
		float: right;
	}
	#order-create .coupon-item .right .price{
		color: #ff2d4b;
		font-size: 24px;
	}
	#order-create .coupon-item .right .price span{
		font-size: 14px;
		margin-right: 2px;
	}
	#order-create .coupon-item .right .condition{
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
	#order-create .coupon-item .selected-status,#order-create .redPacket-list-item .selected-status{
		position: absolute;
		right: 0;
		bottom: 0;
		width: 31px;
		height: 24px;
	}
	#order-create .coupon-item .selected-status img,#order-create .redPacket-list-item .selected-status img{
		width: 100%;
		height: 100%;
	}
	/*红包弹出层*/
	#order-create .svip-redpacket .svip-redpacket-item{
		position: relative;
		background-color: #fff;
		margin: 0 10px 10px 10px;
	}
	#order-create .svip-redpacket .svip-redpacket-item .svip-redpacket-top{
		position: relative;
		padding: 15px;
	}
	#order-create .svip-redpacket .svip-redpacket-item .svip-redpacket-top .svip-redpacket-left{
		width: 80%;
	}
	#order-create .svip-redpacket .svip-redpacket-left .redpacket-img{
		width: 55px;
		height: 55px;
	}
	#order-create .svip-redpacket .svip-redpacket-left .redpacket-info{
		height: 55px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		padding-left: 10px;
	}
	#order-create .svip-redpacket .svip-redpacket-left .redpacket-info .redpacket-title{
		font-size: 15px;
		font-weight: 600;
	}
	#order-create .svip-redpacket .svip-redpacket-left .redpacket-info .redpacket-tips{
		font-size: 12px;
		color: #7E6050;
		border: 1px solid #F0E4D8;
		background-color: #FFF3E8;
		padding: 2px 4px;
		margin-right: 5px;
	}
	#order-create .svip-redpacket .svip-redpacket-item .svip-redpacket-top .svip-redpacket-right{
		width: 20%;
	}
	#order-create .svip-redpacket .svip-redpacket-item .svip-redpacket-right{
		height: 55px;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		text-align: right;
	}
	#order-create .svip-redpacket .svip-redpacket-item .svip-redpacket-right .redpacket-money{
		font-size: 30px;
		color: #FB4E44;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#order-create .svip-redpacket .svip-redpacket-item .svip-redpacket-right .redpacket-money .redpacket-unit{
		font-size: 24px;
		margin-right: -10px;
	}
	#order-create .svip-redpacket .svip-redpacket-item .svip-redpacket-line{
		position: relative;
	}
	#order-create .svip-redpacket .svip-redpacket-item .svip-redpacket-line .line{
		border-top: 1px dashed #E6E6E6;
	}
	#order-create .svip-redpacket .svip-redpacket-item .svip-redpacket-line .line:before{
		content: '';
		position: absolute;
		top: -5px;
		left: -2px;
		z-index: 20;
		width: 5px;
		height: 10px;
		border-radius: 0 5px 5px 0;
		border: 1px solid #f6f6f6;
		background: #f6f6f6;
	}
	#order-create .svip-redpacket .svip-redpacket-item .svip-redpacket-line .line:after{
		content: '';
		position: absolute;
		top: -5px;
		right: -1px;
		z-index: 20;
		width: 5px;
		height: 10px;
		border-radius: 5px 0 0 5px;
		border: 1px solid #f6f6f6;
		background: #f6f6f6;
	}
	#order-create .svip-redpacket .svip-redpacket-item .svip-redpacket-bottom{
		position: relative;
		padding: 5px 15px;
	}
	#order-create .svip-redpacket .svip-redpacket-item .svip-redpacket-bottom .svip-redpacket-convert{
		font-size: 14px;
		border-radius: 3px;
		background-color: #3D3731;
		color: #DBC5AF;
		padding: 5px 10px;
	}
	#order-create .redPacket-list.content-padded{
		margin: 0 10px 10px 10px;
	}
	#order-create .redPacket-list .row{
		margin-left: -4%;
		overflow: hidden;
	}
	#order-create .redPacket-list .text-right{
		text-align: right;
	}
	#order-create .redPacket-list .redPacket-list-item{
		background: #fff;
		margin-bottom: 12px;
		overflow: hidden;
		position: relative;
	}
	#order-create .redPacket-list .redPacket-list-item .redPacket-list-item-container{
		padding: 25px 16px;
	}
	#order-create .redPacket-list .redPacket-list-item .redPacket-list-item-container.superredpacket-meal{
		border: 2px solid #ff2d4b;
	}
	#order-create .redPacket-list .redPacket-info .col-50{
		width: 46%;
		margin-left: 4%;
		float: left;
	}
	#order-create .redPacket-list .redPacket-info .col-50 .redPacket-title{
		color: #ff2d4b;
		margin: 0;
		font-size: 18px;
	}
	#order-create .redPacket-list .redPacket-info .col-50 .price{
		color: #ff2d4b;
		position: relative;
		margin-top: -4px;
	}
	#order-create .redPacket-list .redPacket-info .col-50 .price .price-num{
		font-size: 22px;
		line-height: 26px;
	}
	#order-create .redPacket-list .redPacket-list-item .redPacket-list-item-container .redPacket-use-limit{
		margin-top: 10px;
		color: #666;
		font-size: 14px;
	}
	#order-create .redPacket-list .row .col-60{
		width: 55.99999999999999%;
		margin-left: 4%;
		float: left;
		white-space:nowrap
	}
	#order-create .redPacket-list .row .col-40{
		width: 36%;
		margin-left: 4%;
		float: left;
	}
	#order-create .redPacket-list .row .col-40 .use-condition{
		margin: 0;
		font-size: 14px;
	}
	#order-create .redPacket-list .redPacket-list-item .redPacket-list-item-container .other-limit{
		font-size: 12px;
		color: #999;
		border-top: 1px dashed #e0e0e0;
		padding-top: 4px;
	}
	#order-create .redPacket-list .redPacket-list-item .circle{
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
	#order-create .redPacket-list .redPacket-list-item .circle.superredpacket-meal{
		border: 2px solid #ff2d4b;
	}
	#order-create .redPacket-list .redPacket-list-item .circle-left{
		left: -8px;
	}
	#order-create .redPacket-list .redPacket-list-item .circle-right{
		right: -8px;
	}
	#order-create .redPacket-list .redPacket-list-item .overdue{
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
	#order-create .redPacket-list .redPacket-list-item .use{
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
	#order-create .order-benefit{
		height: 50px;
		line-height: 50px;
		font-size: 14px;
		padding-left: 15px;
	}
	#order-create .van-submit-bar .van-button{
		/* background-color: #ff2d4b;
    border-color: #ff2d4b; */
		color: #fff;
	}
	#order-create .extre-fee .van-cell,#order-create .discount-box .van-cell{
		padding: 2px 15px;
	}
	#order-create .discount-box .discount-item img{
		width: 16px;
		height: 16px;
		margin-right: 5px;
	}
	/*购买套餐红包*/
	#order-create .discount-box .redpacket-buy{
		background-color: #f5f5f5;
		margin: 0 15px;
		padding: 10px;
		color: #333;
		font-size: 14px;
	}
	#order-create .discount-box .redpacket-buy>div:first-child{
		margin-bottom: 10px;
	}
	#order-create .discount-box .redpacket-buy .buy-tip .icon{
		color: #ccc;
		font-size: 15px;
	}
	#order-create .discount-box .redpacket-buy .check-box{
		width: 16px;
		height: 16px;
		border: 1px solid #ccc;
		justify-content: center;
	}
	#order-create .discount-box .redpacket-buy .check-box .icon{
		color: #ff2d4b;
		font-size: 14px;
		display: none;
	}
	#order-create .discount-box .redpacket-buy .check-box.active{
		border-color: #ff2d4b;
	}
	#order-create .discount-box .redpacket-buy .check-box.active .icon{
		display: inline-block;
	}
	#order-create .discount-box .redpacket-buy .buy-total{
		font-size: 12px;
		color: #6E6E6E;
	}
	#order-create .discount-box .redpacket-buy .redpacket-price .old{
		font-size: 12px;
		color: #8A8A8A;
		text-decoration: line-through;
		margin-right: 2px;
	}
	/*兑换超级会员专享红包弹出层样式*/
	#order-create .popup-svipRedpacket .svipRedpacket-wrap{
		width: 300px;
		background-color: #fff;
		padding: 20px 15px;
	}
	#order-create .popup-svipRedpacket .svipRedpacket-wrap .svipRedpacket-title{
		font-size: 20px;
		text-align: center;
		font-weight: bold;
	}
	#order-create .popup-svipRedpacket .svipRedpacket-wrap .exchange-svipRedpacket{
		position: relative;
		display: flex;
		align-items: center;
		padding: 0 25px;
		font-weight: bold;
	}
	#order-create .popup-svipRedpacket .svipRedpacket-wrap .exchange-svipRedpacket .exchange-start{
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		width: 70px;
		height: 85px;
		background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNzAgODYiPjxkZWZzPjxsaW5lYXJHcmFkaWVudCBpZD0iYSIgeDE9IjAlIiB4Mj0iOTMuNzYyJSIgeTE9IjMuNzU2JSIgeTI9IjEzMy4xMjglIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkRGM0M3Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRTlEMzczIi8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBpZD0iYiIgZD0iTTcwIDgwVjVhNSA1IDAgMCAxLTUtNUg1YTUgNSAwIDAgMS01IDV2NzVhNSA1IDAgMCAxIDUgNWg2MGE1IDUgMCAwIDEgNS01eiIvPjxwYXRoIGlkPSJjIiBkPSJNNjYgNzYuNjQ0VjkuMzU2YTQuNDAyIDQuNDAyIDAgMCAxLTEgLjExNWMtMi40NDYgMC00LjQyOS0yLjAwMi00LjQyOS00LjQ3MUg4LjQzYzAgMi40NjktMS45ODMgNC40Ny00LjQyOSA0LjQ3djY3LjA2YzIuNDQ2IDAgNC40MjkgMi4wMDEgNC40MjkgNC40N2g1Mi4xNGMwLTIuNDY5IDEuOTgzLTQuNDcgNC40MjktNC40Ny4zNDQgMCAuNjc5LjAzOSAxIC4xMTR6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJlIiB4MT0iNzEuNTI5JSIgeDI9IjE3LjI4NyUiIHkxPSIzOS4yNjIlIiB5Mj0iOTUuODUyJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGRjFCNSIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZGMUI3Ii8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSI3MS41MjklIiB4Mj0iMzAuNDk0JSIgeTE9IjM5LjI2MiUiIHkyPSI3OC4yMiUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkRFNTIiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGRDM1MyIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iNzAuMDU3JSIgeDI9IjE3LjM2JSIgeTE9IjIxLjAzMyUiIHkyPSI4OC43JSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y5RjBDMSIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZGN0Q5Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwIC44NCkiPjx1c2UgZmlsbD0idXJsKCNhKSIgeGxpbms6aHJlZj0iI2IiLz48bWFzayBpZD0iZCIgZmlsbD0iI2ZmZiI+PHVzZSB4bGluazpocmVmPSIjYyIvPjwvbWFzaz48cGF0aCBzdHJva2U9IiNFOUQ5QTAiIHN0cm9rZS13aWR0aD0iLjg5NCIgZD0iTTY1LjU1MyA3Ni4xMTRWOS44ODZhNC44NDIgNC44NDIgMCAwIDEtLjU1My4wMzJjLTIuNTQ0IDAtNC42MzItMS45NjUtNC44NTYtNC40N0g4Ljg1NmMtLjIxIDIuMzU2LTIuMDcxIDQuMjM1LTQuNDA5IDQuNDV2NjYuMjA1YzIuMzM4LjIxNCA0LjE5OCAyLjA5MyA0LjQwOSA0LjQ1aDUxLjI4OGMuMjI0LTIuNTA2IDIuMzEyLTQuNDcgNC44NTYtNC40Ny4xODYgMCAuMzcuMDEuNTUzLjAzeiIvPjxnIG1hc2s9InVybCgjZCkiPjxwYXRoIGZpbGw9InVybCgjZSkiIGQ9Ik0xMjQgN3Y3OUg0NXoiIG9wYWNpdHk9Ii4yNDMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMCA3KSIvPjxwYXRoIGZpbGw9InVybCgjZikiIGQ9Ik0xMjAgMjZ2NjBINjR6IiBvcGFjaXR5PSIuMTE5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAgNykiLz48cGF0aCBmaWxsPSJ1cmwoI2YpIiBkPSJNMTEwIDI2djYwSDU0eiIgb3BhY2l0eT0iLjExOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwIDcpIi8+PHBhdGggZmlsbD0idXJsKCNnKSIgZD0iTTcyLjY0IDBIOTJMMTkuMzYgNzlIMHoiIG9wYWNpdHk9Ii4yIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjAgNykiLz48cGF0aCBmaWxsPSJ1cmwoI2cpIiBkPSJNOTAuNjQgMEgxMTBMMzcuMzYgNzlIMTh6IiBvcGFjaXR5PSIuNCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwIDcpIi8+PC9nPjwvZz48L3N2Zz4=);
		color: #7d490f;
		background-repeat: no-repeat;
		background-position: 0 0;
		background-size: cover;
	}
	#order-create .popup-svipRedpacket .svipRedpacket-wrap .exchange-svipRedpacket .exchange-start .price{
		display: block;
		font-weight: bold;
		font-size: 32px;
		overflow: hidden;
	}
	#order-create .popup-svipRedpacket .svipRedpacket-wrap .exchange-svipRedpacket .exchange-start .price span{
		font-size: 14px;
		float: left;
		padding-top: 5px;
	}
	#order-create .popup-svipRedpacket .svipRedpacket-wrap .exchange-svipRedpacket .exchange-course{
		margin: 0 3px;
		width: 40px;
		height: 21px;
	}
	#order-create .popup-svipRedpacket .svipRedpacket-wrap .exchange-svipRedpacket .exchange-end{
		width: 100px;
		height: 120px;
		background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgMTAxIDEyMSI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJiIiB4MT0iNTAlIiB4Mj0iNTAlIiB5MT0iMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjRkU0QTJGIi8+PHN0b3Agb2Zmc2V0PSI1MC4xMTYlIiBzdG9wLWNvbG9yPSIjRkY2NTQzIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkU3RjU4Ii8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBpZD0iYSIgZD0iTTAgMGgxMDB2ODAuOGMtMTAuNjYyIDEwLjktMjQuMjk4IDE5LjgtNDkuNDk0IDE5LjhDMjUuMzA5IDEwMC42IDEwLjA1IDkwLjg3IDAgODAuOFYweiIvPjxmaWx0ZXIgaWQ9ImMiIHdpZHRoPSIxMDIlIiBoZWlnaHQ9IjEwMiUiIHg9Ii0xJSIgeT0iLTElIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giPjxmZUdhdXNzaWFuQmx1ciBpbj0iU291cmNlQWxwaGEiIHJlc3VsdD0ic2hhZG93Qmx1cklubmVyMSIgc3RkRGV2aWF0aW9uPSIuNSIvPjxmZU9mZnNldCBkeT0iLTEiIGluPSJzaGFkb3dCbHVySW5uZXIxIiByZXN1bHQ9InNoYWRvd09mZnNldElubmVyMSIvPjxmZUNvbXBvc2l0ZSBpbj0ic2hhZG93T2Zmc2V0SW5uZXIxIiBpbjI9IlNvdXJjZUFscGhhIiBrMj0iLTEiIGszPSIxIiBvcGVyYXRvcj0iYXJpdGhtZXRpYyIgcmVzdWx0PSJzaGFkb3dJbm5lcklubmVyMSIvPjxmZUNvbG9yTWF0cml4IGluPSJzaGFkb3dJbm5lcklubmVyMSIgdmFsdWVzPSIwIDAgMCAwIDAuOTg4MjM1Mjk0IDAgMCAwIDAgMC41MTI5ODIyMDQgMCAwIDAgMCAwLjM0NTA5ODAzOSAwIDAgMCAxIDAiLz48L2ZpbHRlcj48ZmlsdGVyIGlkPSJkIiB3aWR0aD0iMTA2JSIgaGVpZ2h0PSIxMDYuMiUiIHg9Ii0zJSIgeT0iLTMuMSUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCI+PGZlR2F1c3NpYW5CbHVyIGluPSJTb3VyY2VHcmFwaGljIiBzdGREZXZpYXRpb249IjEiLz48L2ZpbHRlcj48bGluZWFyR3JhZGllbnQgaWQ9ImYiIHgxPSIwJSIgeDI9IjkzLjc2MiUiIHkxPSIzLjc1NiUiIHkyPSIxMzMuMTI4JSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZERjNDNyIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0U5RDM3MyIvPjwvbGluZWFyR3JhZGllbnQ+PHBhdGggaWQ9ImciIGQ9Ik04MCA5MS4yOTRWNS43MDZBNS43MSA1LjcxIDAgMCAxIDc0LjI4NiAwSDUuNzE0QTUuNzEgNS43MSAwIDAgMSAwIDUuNzA2djg1LjU4OEE1LjcxIDUuNzEgMCAwIDEgNS43MTQgOTdoNjguNTcyQTUuNzEgNS43MSAwIDAgMSA4MCA5MS4yOTR6Ii8+PHBhdGggaWQ9ImgiIGQ9Ik03Ni41NzEgODUuMzM0VjguODA4Yy0yLjg0IDAtNS4xNDItMi4yODUtNS4xNDItNS4xMDJIOS43MTRjMCAyLjgxNy0yLjMwMiA1LjEwMi01LjE0MyA1LjEwMnY3Ni41MjZjMi44NCAwIDUuMTQzIDIuMjg0IDUuMTQzIDUuMTAxSDcxLjQzYzAtMi44MTcgMi4zMDItNS4xMDEgNS4xNDItNS4xMDF6Ii8+PGxpbmVhckdyYWRpZW50IGlkPSJqIiB4MT0iNzEuNTI5JSIgeDI9IjE3LjI4NyUiIHkxPSIzOS4yNjIlIiB5Mj0iOTUuODUyJSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0ZGRjFCNSIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZGMUI3Ii8+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImsiIHgxPSI3MS41MjklIiB4Mj0iMzAuNDk0JSIgeTE9IjM5LjI2MiUiIHkyPSI3OC4yMiUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkRFNTIiIHN0b3Atb3BhY2l0eT0iMCIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI0ZGRDM1MyIvPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJsIiB4MT0iNzAuMDU3JSIgeDI9IjE3LjM2JSIgeTE9IjIxLjAzMyUiIHkyPSI4OC43JSI+PHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iI0Y5RjBDMSIgc3RvcC1vcGFjaXR5PSIwIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjRkZGN0Q5Ii8+PC9saW5lYXJHcmFkaWVudD48cGF0aCBpZD0ibSIgZD0iTTAgMGgxMDB2MzUuMkgweiIvPjxmaWx0ZXIgaWQ9Im4iIHdpZHRoPSIxMTIlIiBoZWlnaHQ9IjExMy42JSIgeD0iLTYlIiB5PSItNi44JSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94Ij48ZmVHYXVzc2lhbkJsdXIgaW49IlNvdXJjZUdyYXBoaWMiIHN0ZERldmlhdGlvbj0iMiIvPjwvZmlsdGVyPjxsaW5lYXJHcmFkaWVudCBpZD0icCIgeDE9IjUwJSIgeDI9IjUwJSIgeTE9IjI1LjU1JSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRTc3NTIiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNGRTMzNDEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC41IC44NCkiPjxtYXNrIGlkPSJlIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNhIi8+PC9tYXNrPjxnIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIC0xIDAgMTAwLjYpIj48dXNlIGZpbGw9InVybCgjYikiIHhsaW5rOmhyZWY9IiNhIi8+PHVzZSBmaWxsPSIjMDAwIiBmaWx0ZXI9InVybCgjYykiIHhsaW5rOmhyZWY9IiNhIi8+PC9nPjxwYXRoIGZpbGw9IiNEQTQ2MUIiIGQ9Ik0wIDYzYzE1LjEzNSA1Ljg2NyAzMS4yODYgOC44IDQ4LjQ1MyA4LjggMTcuMTY2IDAgMzQuMzQ5LTIuOTMzIDUxLjU0Ny04Ljh2OTQuOGEyIDIgMCAwIDEtMiAySDJhMiAyIDAgMCAxLTItMlY2M3oiIGZpbHRlcj0idXJsKCNkKSIgbWFzaz0idXJsKCNlKSIvPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMC41IDE2Ljg0KSI+PHVzZSBmaWxsPSJ1cmwoI2YpIiB4bGluazpocmVmPSIjZyIvPjxtYXNrIGlkPSJpIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNoIi8+PC9tYXNrPjxwYXRoIHN0cm9rZT0iI0YwRTNCNyIgc3Ryb2tlLXdpZHRoPSIxLjAyMiIgZD0iTTc2LjA2IDg0Ljg0NVY5LjI5NWMtMi43MTItLjI0LTQuODc0LTIuMzg0LTUuMTItNS4wNzhIMTAuMjAzYy0uMjQ1IDIuNjk0LTIuNDA3IDQuODM4LTUuMTIgNS4wNzl2NzUuNTVjMi43MTMuMjQgNC44NzUgMi4zODQgNS4xMiA1LjA3OGg2MC43MzljLjI0NS0yLjY5NCAyLjQwNy00LjgzNyA1LjEyLTUuMDc5eiIvPjxnIG1hc2s9InVybCgjaSkiPjxwYXRoIGZpbGw9InVybCgjaikiIGQ9Ik0xNDEuNzE0IDcuOTg4djkwLjE1M0g1MS40M3oiIG9wYWNpdHk9Ii4yNDMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMi44NTcgNy45ODgpIi8+PHBhdGggZmlsbD0idXJsKCNrKSIgZD0iTTEzNy4xNDMgMjkuNjd2NjguNDcxaC02NHoiIG9wYWNpdHk9Ii4xMTkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMi44NTcgNy45ODgpIi8+PHBhdGggZmlsbD0idXJsKCNrKSIgZD0iTTEyNS43MTQgMjkuNjd2NjguNDcxaC02NHoiIG9wYWNpdHk9Ii4xMTkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMi44NTcgNy45ODgpIi8+PHBhdGggZmlsbD0idXJsKCNsKSIgZD0iTTgzLjAxOCAwaDIyLjEyNUwyMi4xMjUgOTAuMTUzSDB6IiBvcGFjaXR5PSIuMiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIyLjg1NyA3Ljk4OCkiLz48cGF0aCBmaWxsPSJ1cmwoI2wpIiBkPSJNMTAzLjU5IDBoMjIuMTI0TDQyLjY5NiA5MC4xNTNIMjAuNTcxeiIgb3BhY2l0eT0iLjQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yMi44NTcgNy45ODgpIi8+PC9nPjwvZz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSguNSA1My4yNCkiPjxtYXNrIGlkPSJvIiBmaWxsPSIjZmZmIj48dXNlIHhsaW5rOmhyZWY9IiNtIi8+PC9tYXNrPjxwYXRoIGZpbGw9IiNFMTMyMTEiIGQ9Ik0wIDYuNmMxNS4xMzUgNS44NjcgMzEuMjg2IDguOCA0OC40NTMgOC44IDE3LjE2NiAwIDM0LjM0OS0yLjkzMyA1MS41NDctOC44djg2YTIgMiAwIDAgMS0yIDJIMmEyIDIgMCAwIDEtMi0ydi04NnoiIGZpbHRlcj0idXJsKCNuKSIgbWFzaz0idXJsKCNvKSIgb3BhY2l0eT0iLjIiLz48L2c+PHBhdGggZmlsbD0idXJsKCNwKSIgZD0iTTAgNjAuMkMxNS4xMzUgNjYuMDY3IDMxLjI4NiA2OSA0OC40NTMgNjljMTcuMTY2IDAgMzQuMzQ5LTIuOTMzIDUxLjU0Ny04LjhWMTE2YTQgNCAwIDAgMS00IDRINGE0IDQgMCAwIDEtNC00VjYwLjJ6IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSguNSAuODQpIi8+PC9nPjwvc3ZnPg==);
		background-repeat: no-repeat;
		background-position: 0 0;
		background-size: cover;
		color: #ffd5b5;
		display: flex;
		align-items: center;
		flex-direction: column;
	}
	#order-create .popup-svipRedpacket .svipRedpacket-wrap .exchange-svipRedpacket .exchange-end .exchange-end-price{
		display: block;
		font-weight: bold;
		font-size: 40px;
		color: #7d490f;
		margin: 25px 0;
		overflow: hidden;
	}
	#order-create .popup-svipRedpacket .svipRedpacket-wrap .exchange-svipRedpacket .exchange-end .exchange-end-price span{
		float:left;
		font-size: 14px;
		padding-top: 5px;
	}
	#order-create .popup-svipRedpacket .svipRedpacket-wrap .svipRedpacket-button{
		display: flex;
		margin-top: 20px;
	}
	#order-create .popup-svipRedpacket .svipRedpacket-wrap .svipRedpacket-button button:first-child{
		margin-right: 10px;
	}
	/*开通svip*/
	#order-create .buy-svip{
		line-height: 1;
	}
	#order-create .buy-svip .left{
		width: 87%;
	}
	#order-create .buy-svip .left .second-desc{
		color: #999;
		margin-top: 5px;
	}
	#order-create .buy-svip .left .svip-price .first-buy{
		background-color: #ff2d4b;
		color: #fff;
		padding: 3px 5px;
		border-radius: 2px;
		margin-bottom: 5px;
		text-align: center;
	}
	#order-create .buy-svip .right{
		width: 10%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}
	#order-create .buy-svip .right .icon-check{
		display: flex;
		align-items: center;
		justify-content: center;
		width: 22px;
		height: 22px;
		border-radius: 50%;
		color: #fff;
		background-color: #EAEAEA;
	}
	#order-create .buy-svip .right .icon-check.active{
		background-color: #ff2d4b;
	}
	#order-create .permit-time{
		margin-top: 10px;
		padding: 10px 15px;
		background-color: #fff;
	}
	#order-create .permit-time .permit-time-tips{
		font-size: 12px;
		padding-top: 10px;
		line-height: 16px;
		color: #999;
	}
	#order-create .permit-time .permit-time-title{
		padding: 0 5px;
		font-size: 14px;
	}
	#order-create .permit-time .icon-question{
		font-size: 16px;
		color: #B5B5B5;
		border: 1px solid #E0E0E0;
		border-radius: 100%;
		line-height: 16px;
	}
	#order-create .permit-time .icon-security{
		font-size: 16px;
		color: #696565;
	}
	#order-create .permit-time .agreement{
		display: flex;
		align-items: center;
		padding-top: 10px;
	}
	#order-create .permit-time .agreement .icon{
		width: 16px;
		height: 16px;
		border-radius: 3px;
		border: 1px solid #ccc;
		text-align: center;
		line-height: 14px;
	}
	#order-create .permit-time .agreement .icon.icon-check{
		font-size: 13px;
		color: #ff2d4b;
		border-color: #ff2d4b;
		font-weight: bold;
	}
	#order-create .permit-time .agreement .text{
		font-size: 12px;
		color: #707070;
		padding-left: 10px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/order/create.vue
