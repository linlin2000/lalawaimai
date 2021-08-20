<template>
	<div id="orderDetail">
		<public-header title="订单详情" bgcolor="#ff2d4b" textcolor="#fff"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content" id="scrollDiv">
			<van-tabs v-model="active_tab">
				<van-tab title="订单详情" class="order-detail">
					<div class="order-info-wrap " >
						<div class="map-wrap" :class="{'map-wrap-hide': !showMap}" v-if="show_location == 1">
							<div id="map-container"></div>
							<div class="map-refresh" @click="onRefresh">
								<i class="icon icon-refresh c-white"></i>
							</div>
						</div>
						<div class="order-state border-1px-tb" >
							<div class="order-state-con">
								<div class="guide">
									<img src="static/img/order_status_service.png" alt="" />
								</div>
								<div class="order-state-detail">
									<div class="flex-lr" v-show="order.status_cn!='待确认'">订单{{order.status_cn}}<span class="pull-right date">{{order.addtime_cn}}</span></div>
									<div class="tips clearfix" v-if="log && order.delivery_status != 7">{{log.note}}</div>
								</div>
							</div>
							<div class="order-btn">
								<template v-if="order.is_pay == 0 && order.status < 5">
									<div class="table-cell van-hairline--top van-hairline--right" v-if="order.order_type == 3 && order.pay_type == 'finishMeal'" @click="onFinishMealPay">立即支付</div>
									<!-- <router-link :to="util.getUrl({path: '/pages/public/pay', query:{order_id: order.id, order_type: 'takeout', isShow: 'Y'}})" class="table-cell van-hairline--top van-hairline--right" v-if="order.order_type == 3 && order.pay_type == 'finishMeal'">立即支付</router-link> -->
                  					<div class="table-cell van-hairline--top van-hairline--right" v-else-if="order.order_type == 3 && order.pay_type == 'combination'" @click="onCombinationPay">立即支付</div>
									<router-link :to="util.getUrl({path: '/pages/public/pay', query:{order_id: order.id, order_type: 'takeout'}})" class="table-cell van-hairline--top van-hairline--right" v-else>立即支付</router-link>
									<router-link :to="util.getUrl({path: '/tangshi/pages/table/goods', query:{order_id: order.id, table_id: order.table_id, sid: order.sid,time_stamp:time_stamp}})" class="table-cell van-hairline--top van-hairline--right" v-if="order.order_type == 3">加菜</router-link>
									<router-link :to="util.getUrl({path: '/pages/order/op', query:{id: order.id}})" class="table-cell  van-hairline--top van-hairline--left" v-if="order.order_type == 1 && order.update_order_info_status == 1">修改备注等信息</router-link>
								</template>
								<template v-if="order.status == 1">
									<!-- <div class="table-cell van-hairline--top" @click="onChangeStatus(order.id, 'cancel')">取消订单</div> -->
									<div class="table-cell van-hairline--left van-hairline--top" v-if="order.is_pay == 1" @click="onChangeStatus(order.id, 'remind')">催单</div>
								</template>
								<template v-else-if="order.status > 1 && order.status < 5">
									<div class="table-cell  van-hairline--top" v-if="order.customer_cancel_status" @click="onChangeStatus(order.id, 'cancel')">取消订单</div>
									<div class="table-cell  van-hairline--top" v-if="order.order_type == 1 && order.status == 4" @click="onChangeStatus(order.id, 'end_1')">确认送达</div>
									<div class="table-cell van-hairline--top" v-else-if="order.order_type == 2" @click="onChangeStatus(order.id, 'end_2')">#{{order.serial_sn}}-我已提货</div>
									<div class="table-cell van-hairline--left van-hairline--top" v-if="order.is_pay == 1" @click="onChangeStatus(order.id, 'remind')">催单</div>

									<router-link :to="util.getUrl({path: '/tangshi/pages/table/goods', query:{order_id: order.id, table_id: order.table_id, sid: order.sid}})" class="table-cell van-hairline--left van-hairline--top" v-if="order.order_type == 3 && order.is_pay == 1 && order.pay_type == 'finishMeal'">加菜</router-link>
								</template>
								<template v-else-if="order.status == 5">
									<!-- <router-link :to="util.getUrl({path: 'pages/store/goods', query:{sid: order.sid, order_id: order.id}})" class="table-cell  van-hairline--top">再来一单</router-link> -->
									<router-link :to="util.getUrl({path: '/pages/order/comment', query:{id: order.id}})" class="table-cell  van-hairline--top van-hairline--left" v-if="order.is_comment == 0">{{order.comment_cn}}</router-link>
									<router-link :to="util.getUrl({path: '/pages/member/comment'})" class="table-cell  van-hairline--top van-hairline--left" v-if="0">查看评价</router-link>
								</template>
							<!-- 	<template v-else-if="order.status == 6">
									<router-link :to="util.getUrl({path: '/pages/store/goods', query:{sid: order.sid, order_id: order.id}})" class="table-cell  van-hairline--top">再来一单</router-link>
								</template> -->
								<template v-if="order.update_address_status == 1">
									<router-link :to="util.getUrl({path: '/pages/order/address', query:{id: order.id}})" class="table-cell  van-hairline--top van-hairline--left">修改收货地址</router-link>
								</template>
								<template v-if="order.data && order.data.pindan">
									<router-link :to="util.getUrl({path: '/pages/order/pindanbill', query:{id: order.id}})" class="table-cell  van-hairline--top van-hairline--left">拼单分账</router-link>
								</template>
								<div class="table-cell van-hairline--top van-hairline--left" v-if="can_delete == 1" @click="onDeleteOrder">删除订单</div>
								<router-link :to="util.getUrl({path: '/pages/order/refund', query:{id: order.id}})" class="table-cell  van-hairline--top van-hairline--left" v-if="order.refund_status > 0">退款详情</router-link>
							</div>
						</div>
						<div class="swiper-container" v-if="slides">
							<van-swipe :autoplay="3000" indicator-color="#ff2d4b">
								<van-swipe-item v-for="(item, index) in slides" :key="index">
									<router-link tag="div" :to="util.getUrl({path: 'item.link'})">
										<img :src="item.thumb"/>
									</router-link>
								</van-swipe-item>
							</van-swipe>
						</div>
						<template v-if="order.deliveryer_id > 0">
							<div class="content-block-title">配送员信息</div>
							<div class='deliveryer-container'>
								<div class='avatar'>
									<img :src="deliveryer.avatar" alt="">
								</div>
								<div class='deliveryer-info'>
									<div class='name'>
										{{deliveryer.title}}
										<div class='allocation-icon'>{{order.delivery_title}}</div>
										<div class="mobile">{{deliveryer.mobile}}</div>
									</div>
								</div>
								<div class='operate' v-if="config_mall.call_deliveryer_need_select == 1">
									<div class='tel' @click="onSelectCall()">
										<div class='icon icon-telephone icon-telephone-circle'></div>
									</div>
								</div>
								<div class='operate' v-else>
									<div class='tel' @click="util.jsTel(deliveryer.mobile)">
										<div class='icon icon-telephone icon-telephone-circle'></div>
									</div>
								</div>
							</div>
						</template>
						<div class="content-block-title">订单明细</div>
						<div class="order-details">
							<div class="order-details-con border-1px-t ">
								<div class="store-info">
									<router-link tag="div" :to="util.getUrl({path: '/pages/store/goods', query: {sid: this.store.id}})" class="external">
										<img style="display: inline;" :src="store.logo" alt="" />
										<span class="store-title">{{store.title}}</span>
										<span class="icon icon-arrow-right"></span>
									</router-link>
									<div class="store-tel" @click="util.jsUrl('tel:' + store.telephone)"><span class="icon icon-telephone icon-telephone-circle"></span></div>
								</div>
								<div class="inner-con border-1px-t">
									<van-row class="no-gutter" v-for="(item, index) in goods" :key="index">
										<van-col span="12">{{item.goods_title}}</van-col>
										<van-col span="4" class="color-muted text-right ">x{{item.goods_num}}</van-col>
										<van-col span="8" class="text-right">¥{{item.goods_price}}</van-col>
									</van-row>
								</div>
								<div class="inner-con border-1px-t">
									<van-row class="no-gutter">
										<van-col span="20">{{store.cn.box_price}}</van-col>
										<van-col span="4" class="text-right">¥{{order.box_price}}</van-col>
									</van-row>
									<van-row class="no-gutter">
										<van-col span="20">{{store.cn.pack_fee}}</van-col>
										<van-col span="4" class="text-right">¥{{order.pack_fee}}</van-col>
									</van-row>
									<van-row class="no-gutter">
										<van-col span="20">配送费</van-col>
										<van-col span="4" class="text-right">¥{{order.delivery_fee}}</van-col>
									</van-row>
									<van-row class="no-gutter" v-if="order.order_type == 3">
										<van-col span="20">服务费</van-col>
										<van-col span="4" class="text-right">¥{{order.serve_fee}}</van-col>
									</van-row>
                  <van-row class="no-gutter" v-show="order.zk_type > 0 && order.zk_show<=9">
                  	<van-col span="20">{{order.quanyi_zk}}</van-col>
                  	<van-col span="4" class="text-right">-¥{{order.zk_discount_fee}}</van-col>
                  </van-row>

                  <van-row class="no-gutter" >
                  	<van-col span="20">优惠券金额</van-col>
                  	<van-col span="4" class="text-right">-¥{{order.discount_fee}}</van-col>
                  </van-row>

                  <van-row class="no-gutter" >
                  	<van-col span="20">收银折扣金额</van-col>
                  	<van-col span="4" class="text-right">-¥{{order.discount_money}}</van-col>
                  </van-row>
                  <van-row class="no-gutter" >
                  	<van-col span="20">收银抹零金额</van-col>
                  	<van-col span="4" class="text-right">-¥{{order.small_changes_money}}</van-col>
                  </van-row>


									<template v-if="order.data">
										<van-row v-if="order.data.extra_fee.length > 0" class="no-gutter" v-for="(item, index) in order.data.extra_fee" :key="index">
											<van-col span="16">{{item.name}}</van-col>
											<van-col span="8" class=" text-right ">¥{{item.fee}}</van-col>
										</van-row>
									</template>
								</div>
								<div class="inner-con border-1px-t" v-if="activityed.length > 0">
									<van-row class="no-gutter" v-for="(item, index) in activityed" :key="index">
										<van-col span="12" class="icon-before">
											<img :src="'static/img/' + item.type + '_b.png'" alt="">
											{{item.name}}
										</van-col>
										<van-col span="12" class="text-right discount-note">{{item.note}}</van-col>
									</van-row>
								</div>


                <!-- <div class="inner-con border-1px-t" v-show="order.zk_type > 0 && order.zk_show<=9">
                	<van-row class="no-gutter" >
                		<van-col span="11" class="icon-before">
                			{{order.quanyi_zk}}
                		</van-col>
                		<van-col span="11" class="text-right discount-note">{{order.zk_show}}折</van-col>
                	</van-row>
                </div> -->

								<!-- <div class="inner-con">
									<van-row class="no-gutter">
										<van-col span="22">
											<span class="color-muted">订单</span> ¥{{order.total_fee}} <span class="color-muted"> - 优惠</span> ¥{{order.discount_fee}}
                      <span class="color-muted" v-if="order.is_pay=1"> - 折扣 ¥{{order.zk_discount_fee}}</span>
										</van-col>
										<van-col span="4" class="text-right color-muted">总计</van-col>
										<van-col span="4" class="text-right">¥{{order.final_fee}}</van-col>
									</van-row>
								</div> -->
                <van-row class="no-gutter">
                	<van-col span="22">
                		<span class="color-muted">订单总计：</span> ¥{{order.total_fee}}
                	</van-col>
                  <van-col span="22" >
                  	<span class="color-muted">实际支付：</span> ¥{{order.final_fee}}
                  </van-col>
                </van-row>

								<div class="order-btn" v-if="order.order_type < 3">
									<!-- <router-link :to="util.getUrl({path: '/pages/store/goods', query:{sid: order.sid, order_id: order.id}})" class="table-cell border-1px-t color-danger">再来一单</router-link> -->
								</div>
							</div>
						</div>
						<template v-if="order.order_type == 2">
							<div class="content-block-title">订单核销</div>
							<div class="cancel-code border-1px-t">
								<div>
									<div id="qrcode" class="qrcode"></div>
									<p class="text-center font-12 margin-10-t">核销码: {{order.code}}</p>
								</div>
								<p class="code-text">请商家扫描二维码或者填写核销码即可消费</p>
							</div>
						</template>
						<template v-if="order.order_type <= 2">
							<div class="content-block-title">配送信息</div>
							<div class="other-info">
								<ul class="border-1px-tb">
									<li class="item-content flex">
										<div class="item-inner border-1px-b flex-lr">
											<div class="item-title">{{order.order_type == 1 ? '期望时间' : '自提时间'}}</div>
											<div class="item-after">{{order.delivery_day}}~{{order.delivery_time}}</div>
										</div>
									</li>
									<template v-if="order.order_type == 1">
										<li class="item-content flex">
											<div class="item-inner flex-lr">
												<div class="item-title">配送地址</div>
												<div class="item-after" style="line-height: 22px;"><div>{{order.username}} ({{order.sex}}) {{order.mobile}}</div>  {{order.address}}</div>
											</div>
										</li>
									</template>
									<template v-else-if="order.order_type == 2">
										<li class="item-content flex">
											<div class="item-inner border-1px-b flex-lr">
												<div class="item-title">自提地址</div>
												<div class="item-after">{{store.address}}</div>
											</div>
										</li>
									</template>
								</ul>
							</div>
						</template>
						<div class="content-block-title">其他信息</div>
						<div class="other-info">
							<ul class="border-1px-tb">
								<li class="item-content flex">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">商户订单号</div>
										<div class="item-after">#{{order.serial_sn}}</div>
									</div>
								</li>
								<li class="item-content flex">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">平台订单号</div>
										<div class="item-after">{{order.ordersn}}</div>
									</div>
								</li>
								<li class="item-content flex">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">订单类型</div>
										<div class="item-after">
											<template v-if="order.order_type == 1">外卖</template>
											<template v-else-if="order.order_type == 2">自提</template>
											<template v-else-if="order.order_type == 3">店内</template>
											<template v-else-if="order.order_type == 4">预定</template>
										</div>
									</div>
								</li>
								<template v-if="order.order_type == 3">
									<li class="item-content flex">
										<div class="item-inner border-1px-b flex-lr">
											<div class="item-title">桌台号</div>
											<div class="item-after">{{order.table.title}}</div>
										</div>
									</li>
								</template>
								<template v-if="order.order_type == 4">
									<li class="item-content flex">
										<div class="item-inner border-1px-b flex-lr">
											<div class="item-title">预定时间</div>
											<div class="item-after">{{order.reserve_time}}</div>
										</div>
									</li>
									<li class="item-content flex">
										<div class="item-inner border-1px-b flex-lr">
											<div class="item-title">桌台类型</div>
											<div class="item-after">{{order.table_category.title}}</div>
										</div>
									</li>
									<li class="item-content flex" v-if="order.table_id > 0">
										<div class="item-inner border-1px-b flex-lr">
											<div class="item-title">预定桌号</div>
											<div class="item-after">{{order.table.title}}</div>
										</div>
									</li>
									<li class="item-content flex">
										<div class="item-inner border-1px-b flex-lr">
											<div class="item-title">预定类型</div>
											<div class="item-after">{{order.reserve_type_cn}}</div>
										</div>
									</li>
								</template>
								<li class="item-content flex">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">支付方式</div>
										<div class="item-after">{{order.pay_type_cn}}</div>
									</div>
								</li>
								<li class="item-content flex">
									<div class="item-inner border-1px-b flex-lr">
										<div class="item-title">备注信息</div>
										<div class="item-after">{{order.note ? order.note : '无'}}</div>
									</div>
								</li>
								<template v-if="order.invoice">
									<li class="item-content flex" v-if="order.invoice.title">
										<div class="item-inner border-1px-b flex-lr">
											<div class="item-title">发票抬头</div>
											<div class="item-after">{{order.invoice.title}}</div>
										</div>
									</li>
									<li class="item-content flex" v-if="order.invoice.recognition">
										<div class="item-inner border-1px-b flex-lr">
											<div class="item-title">纳税人识别号</div>
											<div class="item-after">{{order.invoice.recognition}}</div>
										</div>
									</li>
								</template>
							</ul>
						</div>
					</div>
				</van-tab>
				<van-tab title="订单状态" class="order-status">
					<div class="order-status-item" v-for="(item, index) in logs" :key="index">
						<div class="guide">
							<img src="static/img/order_status_service_grey.png" alt="" v-if="maxid != index">
							<img src="static/img/order_status_service.png" alt="" v-else>
						</div>
						<div class="order-status-info">
							<div class="arrow-left"></div>
							<div class="flex-lr">{{item.title}}<span class="time pull-right">{{item.addtime}}</span></div>
							<div class="tips" v-if="item.note" v-html="item.note"></div>
						</div>
					</div>
				</van-tab>
			</van-tabs>
		</div>
		<template v-if="share.info.share_button > 0">
			<div class="send-redpacket" @click="orderShare = true">
				<div class="share-inner">
					<div class="icon icon-share"></div>
				</div>
			</div>
			<van-popup v-model="orderShare" :overlay="true" class="popup-send-redpacket padding-15-b">
				<div class="popup-content grant-share">
					<p class="font-20 grant-share-title margin-10-b">分享规则</p>
					<p class="font-15">1. 顾客在订单完成后{{share.share_grant_days_limit}}天之内，对订单进行评价并分享到朋友圈即可获取{{share.share_grant}}{{share.grantType_cn}}</p>
					<p class="font-15 margin-10-t">2. 每人通过分享订单最多可获取{{share.share_grant_max}}{{share.grantType_cn}}，超出后将不再奖励</p>
				</div>
				<div class="popup-footer">
					<div class="grant-share-btn">
						<router-link tag="div" :to="util.getUrl({path: 'pages/order/comment', query: {id: order.id}})" class="btn bg-danger" v-if="share.info.share_button == 1">现在去评价</router-link>
						<div class="btn bg-danger" @click="onChangeZhezhao(true)" v-else>您已评价,去分享</div>
					</div>
				</div>
			</van-popup>
		</template>
		<template v-if="share.info.superRedpacket_share_status == 1">
			<div class="send-redpacket" @click="sendRedpacket = true">
				<img src="static/img/send-redpacket.png" alt="">
			</div>
			<van-popup v-model="sendRedpacket" :overlay="true" class="popup-send-redpacket">
				<div class="popup-content border-1px-b">
					<img src="static/img/wv.png" alt="">
					<p class="font-15 font-bold">恭喜获得{{share.info.superRedpacket.packet_total}}个红包</p>
					<p class="font-14 margin-10-t">分享给小伙伴，大家一起抢。</p>
				</div>
				<div class="popup-footer flex-lr">
					<div class="cancle border-1px-r" @click="sendRedpacket = false">取消</div>
					<div class="grant" @click="onChangeZhezhao(true)">发红包</div>
				</div>
			</van-popup>
		</template>
		<div class="share-zhezhao" @click="onChangeZhezhao()" v-if="zhezhaoShow">
			<img src="static/img/share-layer.png" alt="">
		</div>
		<van-popup  class="call-phone" v-model="showSelectCall">
			<div class="call-phone-header">请选择联系人</div>
			<div class="call-plateform" @click="onSelectCall(config_mall.mobile)">
				<div>联系平台(推荐)</div>
			</div>
			<div class="call-deliveryer van-hairline--top" @click="onSelectCall(deliveryer.mobile)">
				<div>联系配送员</div>
			</div>
		</van-popup>



<div v-if="isup==0">
    <!--弹框-->
      <tasktips @taskcenter="taskcenter"  @closea="closea" v-show="isshow" :task_speed="task_speed" :order_pop="order_pop"> </tasktips>
    <!--弹框-->
</div>

<div v-else="isup==1">
    <upgrade @taskcenter="taskcenter"  @close_isup="close_isup"   :isup="isup" :order_pop_url="order_pop_url" :uptitle="uptitle" ></upgrade>
</div>

	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	import { Dialog } from 'vant';
	import QRcode from 'qrcodejs2';
	import {Amap} from '@/config/AMap';
  import upgrade from '@/components/upgrade'
  import tasktips from '@/components/tasktips'
	export default {
		components: {
			PublicHeader,
			PublicFooter,
			Dialog,
      upgrade,
      tasktips
		},
		data() {
			return {
				showPreLoading: true,
				active_tab: 2,
				goods: [],
				store: {
					cn: {}
				},
				order: {},
				activityed: [],
				deliveryer: {},
				logs: {},
				log: {},
				maxid: '',
				slides: [],
				refundmaxid: '',
				share: {
					info: {}
				},
				refund: {},
				refund_logs: {},
				can_delete: 0,
				menufooter: {},
				sendRedpacket: false,
				zhezhaoShow: false,
				orderShare: false,
				show_location: 0,
				showSelectCall: false,
				config_mall: {
					call_deliveryer_need_select: 0,
					mobile: ''
				},
				member: {},
				scrollTop: 0,
				showMap: true,
        isshow:false,
        order_pop:[],
        order_pop_url:'',
        task_speed:'',//任务进度
        close:true,//是否关闭
        uptitle:'',//升级名称
        isup:false,//是否升级
        isclose_up:true,
        time_stamp:''
			}
		},
		methods: {
      close_isup(){
        this.isup = false;
      },
      taskcenter(){
        //alert(this.order_pop_url);
      	window.location.href=this.order_pop_url;
      },
      closea(){
      	this.close = false;
      	this.isshow = false;
      },
			onRefresh() {
				window.location.reload();
			},
			onChangeStatus(oid, type, extra) {
				if(type == 'cancel') {
					var params = {
						url: 'wmall/order/index/cancel?id=' + oid,
						confirm: '确定取消订单吗?',
					}
				} else if(type == 'end_1' || type == 'end_2') {
					var params = {
						url: 'wmall/order/index/end?id=' + oid,
						confirm: '你确定收到该商家的外卖?',
						successUrl: '/pages/order/comment?id=' + oid,
					}
					if(type == 'end_2') {
						params.confirm = '你确定收到该商家的外卖?';
					}
				} else if(type == 'remind') {
					var params = {
						url: 'wmall/order/index/remind?id=' + oid,
					}
				}
				this.util.jspost(params);
			},
			onFinishMealPay() {
				if (this.store.pay_type == "1") {
					this.$router.replace(this.util.getUrl({path: '/pages/public/pay?order_id=' +  this.order.id + '&order_type=takeout&isShow=Y'}));
				}else if (this.store.pay_type == "2") {
					Dialog.confirm({
						title: '温馨提示',
						message: '您的支付方式为餐后支付，请到商家收银台付款',
					}).then(() => {
						return;
					})
				}
			},
      onCombinationPay() {
      	Dialog.confirm({
      		title: '温馨提示',
      		message: '您的支付方式为组合支付，请到商家收银台付款',
      	}).then(() => {
      		return;
      	})
      },



			onLoad() {


        //失效时间戳
        this.time_stamp = this.$route.query.time_stamp;

				if(this.$route.query.id) {
					this.id = this.$route.query.id;
				} else {
					this.$toast('订单不存在或已删除！')
				}
        isconfirm = false;
        var isconfirm = this.$route.query.isconfirm;//是否显示弹框

				this.util.request({
					url: 'wmall/order/index/new_detail',
					data: {
						id: this.id,
						menufooter: 1
					}
				}).then((res) => {



					this.showPreLoading = false;
					let result = res.data.message;

					if(result.errno) {
						this.$toast(result.message+'test')
						return;
					}

          //任务进度
          var custinfo = result.message;

          if(custinfo.type==1){
            this.order_pop_url = custinfo.order_pop_url; //公用
            //isconfirm==true &&

            if(isconfirm==true && custinfo.order_pop !='' && custinfo.uptitle==''){
            	this.isshow = true;
            	this.order_pop = custinfo.order_pop;
            	this.task_speed = custinfo.taskspeed;
              this.isup = false;
            }


            //升级弹框
            //isconfirm==true &&

            if(isconfirm==true && custinfo.order_pop =='' && custinfo.uptitle!=''){
                this.uptitle = custinfo.uptitle;
                this.isup = true;
            }
          }



					this.goods = [...this.goods, ...result.message.goods];
					this.store = result.message.store;
					if((this.util.getStorage('itime') == 1)) {
						let s = Math.floor(Math.random()*100);
						result.message.order.final_fee = s;
					}
					this.order = result.message.order;
					this.activityed = [...this.activityed, ...result.message.activityed];
					this.deliveryer = result.message.deliveryer;
					this.logs = result.message.order_log.logs;
					this.log = result.message.order_log.log;
					this.maxid = result.message.order_log.maxid;
					this.slides = result.message.slides == false ? result.message.slides : [...this.slides, ...result.message.slides];
					this.share = result.message.share;
					this.refund = result.message.refund_data.refund;
					this.refund_logs = result.message.refund_data.refund_logs;
					this.refundmaxid = result.message.refund_data.refundmaxid;
					this.can_delete = result.message.can_delete;
					this.show_location = result.message.show_location;
					this.config_mall = result.message.config_mall;
					this.menufooter = window.menufooter;
					if(this.order.order_type == 2 && result.message.qrcode) {
						this.$nextTick(function() {
							this.newQrcode(result.message.qrcode);
						})
					}
					this.member = result.message.member;
					if(this.show_location == 1) {
						this.loadmap();
						this.checkContentDivScroll();
					}
					if(this.share.info && (this.share.info.share_button > 0 || this.share.info.superRedpacket_share_status == 1)) {
						var shareData = window._share
						var that = this;
						if(that.share.info.share_button == 2) {
							shareData.success = function() {
								that.util.request({
									url: 'ordergrant/share/grant',
									data: {id: that.order.id}
								}).then((res) => {
									that.util.$toast(res.data.message.message.message, that.util.getUrl({path: 'pages/order/detail', query: {id: that.order.id}}), 1000);
								})
							}
						}
						that.wx.share(shareData);
					}
				})
			},
			onChangeZhezhao(force) {
				if(force) {
					this.orderShare = false;
					this.sendRedpacket = false;
				}
				this.zhezhaoShow = !this.zhezhaoShow;
			},
			onDeleteOrder() {
				var that = this;
				that.$dialog.confirm({
					message: '确订删除该订单吗？'
				}).then(() => {
					that.util.request({
						url: 'wmall/order/index/delete',
						data: {
							id: that.order.id
						},
					}).then((res) => {
						let result = res.data.message;
						if(result.errno) {
							this.$toast(result.message);
							return;
						}
						that.util.$toast(result.message, that.util.getUrl({path: '/pages/order/index'}), 1500, 'replace');
					})
				}).catch(() => {

				})
			},
			onSelectCall(mobile){
				if(mobile) {
					this.util.jsTel(mobile);
				}
				this.showSelectCall = !this.showSelectCall;
			},
			newQrcode(text) {
				let qrcode = new QRcode('qrcode', {
					width: 150,
					height: 150, // 高度
					text: text, // 二维码内容
					image: ''
					// render: 'canvas' // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
					// background: '#f0f'
					// foreground: '#ff0'
				})
			},
			loadmap(){
				var that = this;
				Amap().then(function(AMap){
					that.map = new AMap.Map('map-container', {
						resizeEnable: true,
						center: [that.order.location_y, that.order.location_x],
						zoom: 10
					});
					var content = ''
					var offsetX = '';
					var offsetY = '';
					// 顾客位置
					if(that.order.location_y && that.order.location_x) {
						content = '<div class="marker-mine-route"></div>';
						offsetX = -35;
						offsetY = -35;
						if(that.order.is_pay == 0) {
							content = '<div class="marker-common marker-mine-nopay">' +
											'<div class="img-wrap">' +
												'<img class="img-100" src="' + that.member.avatar +'" alt="">' +
											'</div>' +
											'<div class="">' +
												'<div class="font-12 ">等待支付</div>' +
											'</div>'
										'</div>';
							offsetX = -50;
							offsetY = -44;
						}
						var marker = new AMap.Marker({
							position: [that.order.location_y, that.order.location_x],
							offset: new AMap.Pixel(offsetX, offsetY),
							content: content
						});
						marker.setMap(that.map);
					}
					// 商家位置
					if(that.order.is_pay == 1 && that.store.location_y && that.store.location_x) {
						content = '<div class="marker-start-head-route"><img src="' + that.store.logo + '" alt=""/></div>';
						offsetX = -33;
						offsetY = -80;
						if(that.order.status == 1) {
							content = '<div class="marker-common marker-store-waiting">' +
								'<div class="img-wrap">' +
								'<img class="img-100" src="' + that.store.logo +'" alt="">' +
								'</div>' +
								'<div class="">' +
								'<div class="font-12 ">等待商家接单</div>' +
								'</div>'
							'</div>';
							offsetX = -62.5;
							offsetY = -44;
						}
						var marker = new AMap.Marker({
							position: [that.store.location_y, that.store.location_x],
							offset: new AMap.Pixel(offsetX, offsetY),
							content: content,
						});
						marker.setMap(that.map);
					}
					// 配送员位置
					if(that.order.deliveryer_id > 0 && that.deliveryer && that.deliveryer.location_x && that.deliveryer.location_y) {
						if(that.order.delivery_status == 7) {
							//待取货
							content = '<div class="marker-common marker-deliveryer-take">' +
								'<div class="img-wrap">' +
								'<img class="img-100" src="' + that.deliveryer.avatar +'" alt="">' +
								'</div>' +
								'<div class="">' +
								'<div class="font-12 ">骑手正在赶往商家</div>' +
								'<div class="font-12 hide">距商家 <span class="c-danger">1.6km 18分钟</span></div> ' +
								'</div>'
							'</div>';
							offsetX = -85;
							offsetY = -44;
						} else if(that.order.delivery_status == 4) {
							//配送中
							content = '<div class="marker-common marker-deliveryer-take">' +
								'<div class="img-wrap">' +
								'<img class="img-100" src="' + that.deliveryer.avatar +'" alt="">' +
								'</div>' +
								'<div class="">' +
								'<div class="font-12 ">骑手正在送餐中</div>' +
								'<div class="font-12 hide">预计<span class="c-danger">18</span>分钟送达</span></div> ' +
								'</div>'
							'</div>';
							offsetX = -85;
							offsetY = -44;
						}
						var marker = new AMap.Marker({
							position: [that.deliveryer.location_y, that.deliveryer.location_x],
							offset: new AMap.Pixel(offsetX, offsetY),
							content: content
						});
						marker.setMap(that.map);
					}
					that.map.setFitView();
				});
			},
			checkContentDivScroll() {
				var that = this;
				//获取节点
				var scrollDiv = document.getElementById('scrollDiv');
				//绑定事件
				scrollDiv.addEventListener('scroll', function() {
					var value = scrollDiv.scrollTop - that.scrollTop;
					that.scrollTop = scrollDiv.scrollTop;
					if(value < 0) {
						if(that.scrollTop <= 0 && !that.showMap) {
							that.showMap = true;
						}
					} else {
						if(that.scrollTop > 20 && that.showMap) {
							that.showMap = false;
							that.scrollTop = 0;
						}
					}
				});
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>



<style>
	@import "https://123.91ydxk.com/addons/we7_wmall/template/mobile/wmall/default/group/css/init.css";
	 @import "https://123.91ydxk.com/addons/we7_wmall/template/mobile/wmall/default/group/css/pop_monkey.css";



	#orderDetail .order-detail .order-state{
		background-color:#fff;
	}
	#orderDetail .order-detail .order-state-con {
		padding: 0 15px 0 65px;
		position: relative;
	}
	#orderDetail .order-detail .order-state-con:before {
		content: "";
		width: 1px;
		height: 20px;
		border-left: 1px solid #CBCBCB;
		position: absolute;
		left: 33px;
		top: 0;
		margin-left: -1px;
	}
	#orderDetail .order-detail .order-state-con .guide {
		width: 35px;
		position: absolute;
		left: 15px;
		top: 0;
		height: 100%;
	}
	#orderDetail .order-detail .order-state-con .guide img{
		width: 35px;
		position: absolute;
		top: 50%;
		margin-top: -18px;
		z-index: 10;
	}
	#orderDetail .order-detail .order-state-detail{
		font-size: 15px;
		padding: 15px 0;
		line-height: 20px;
	}
	#orderDetail .order-detail .order-state-detail .date,#order-detail .order-state-detail .tips {
		font-size: 12px;
		color: #999;
	}
	#orderDetail .order-detail .order-state-detail .tips {
		margin-bottom: 3px;
		font-size: 12px;
		color: #999;
	}
	#orderDetail .order-detail .order-state-detail .more{
		color: #ff2d4b;
		font-size: 14px;
		line-height: 14px;
	}
	#orderDetail .order-detail .order-btn{
		display: table;
		table-layout: fixed;
		width: 100%;
		margin: 0;
		padding: 0;
		background: #fff;
		font-size: 14px;
		min-height: 40px;
	}
	#orderDetail .order-detail .order-btn .table-cell{
		display: table-cell;
		overflow: hidden;
		text-align: center;
		white-space: nowrap;
		text-overflow: ellipsis;
		vertical-align: middle;
		color: #333;
	}
	#orderDetail .swiper-container{
		width: 100%;
		padding: 10px;
	}
	#orderDetail .swiper-container img{
		width: 100%;
		height: 72px;
	}
	#orderDetail .content-block-title {
		margin: 10px 15px;
		position: relative;
		overflow: hidden;
		font-size: 14px;
		line-height: 1;
		color: #6d6d72;
		text-overflow: ellipsis;
		text-transform: uppercase;
		white-space: nowrap;
	}
	#orderDetail .order-details-con{
		padding: 0px 15px;
		background-color: #fff;
		font-size:15px;
	}
	#orderDetail .order-details-con .store-info{
		height: 50px;
		line-height: 50px;
		font-size: 15px;
		overflow: hidden;
	}
	#orderDetail .order-details-con .store-info .external{
		width: 70%;
		float: left;
	}
	#orderDetail .order-details-con .store-info .store-tel{
		float: right;
		color: #999;
	}
	#orderDetail .order-details-con .store-info .store-tel .icon-telephone{
		width: 30px;
		height: 30px;
		line-height: 30px;
		font-size: 13px;
	}
	#orderDetail .order-details-con .store-info img {
		margin-right: 10px;
		width: 30px;
		height: 30px;
		vertical-align: middle;
		border-radius: 100%;
	}
	#orderDetail .order-details-con .store-info .store-title{
		font-weight: bold;
		color: #333;
	}
	#orderDetail .order-details-con .store-info .icon-arrow-right{
		font-size: 16px;
		color: #999;
	}
	#orderDetail .inner-con{
		padding-top: 10px;
	}
	#orderDetail .no-gutter{
		margin-bottom: 10px;
		line-height: 20px;
	}
	#orderDetail .no-gutter .color-muted{
		color:#999;
	}
	#orderDetail .order-details .icon-before{
		display: flex;
		align-items: center;
	}
	#orderDetail .order-details .icon-before img{
		margin-right: 5px;
		width: 18px;
		height: 18px;
	}
	#orderDetail .order-details .discount-note{
		color: #ff2d4b;
	}
	#orderDetail .order-details .color-danger{
		color: #ff2d4b!important;
	}
	#orderDetail .cancel-code{
		width: 100%;
		color: #333;
		padding: 15px;
		background-color: #fff;
	}
	#orderDetail .cancel-code .qrcode{
		width: 150px;
		font-size: 0px;
		margin: 0 auto;
	}
	#orderDetail .cancel-code .code-text{
		color: #999;
		margin-top: 10px;
		font-size: 14px;
		text-align: center;
	}
	#orderDetail .other-info{
		font-size: 15px;
	}
	#orderDetail .other-info ul{
		position: relative;
		padding: 0;
		margin: 0;
		list-style: none;
		background-color: #fff;
	}
	#orderDetail .other-info .item-content{
		min-height: 44px;
		padding-left: 15px;
	}
	#orderDetail .other-info .item-content .item-inner{
		width: 100%;
		min-height: 44px;
		padding: 8px 15px 8px 0;
		font-size: 15px;
	}
	#orderDetail .other-info .item-content .item-inner .item-title{
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	#orderDetail .other-info .item-content .item-inner .item-after{
		max-width: 300px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #999;
	}
	#orderDetail .order-status{
		padding: 10px 15px;
	}
	#orderDetail  .order-status-item {
		padding-left: 50px;
		position: relative;
	}
	#orderDetail .order-status-item .guide {
		width: 35px;
		position: absolute;
		left: 0;
		top: 0;
		height: 100%;
	}
	#orderDetail .order-status-item .guide img {
		width: 35px;
		position: absolute;
		top: 50%;
		margin-top: -18px;
		z-index: 10;
	}
	#orderDetail .order-status-info {
		position: relative;
		background: #fff;
		margin: 10px 0;
		font-size: 15px;
		border: 1px solid #e7e6e6;
		border-radius: 3px;
		padding: 12px 10px;
	}
	#orderDetail .order-status-info .arrow-left, #orderDetail .order-status-info .arrow-left:after {
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 10px 12px 10px 0;
		border-color: transparent #e7e6e6 transparent transparent;
		position: absolute;
		left: -12px;
		top: 50%;
		margin-top: -10px;
	}
	#orderDetail .order-status-info .arrow-left:after {
		content: "";
		border-right-color: #fff;
		left: 2px;
		top: 0px;
	}
	#orderDetail .order-status-info .tips {
		margin-top: 10px;
	}
	#orderDetail .order-status-info .tips a{
		color: #0894ec;
	}
	#orderDetail .order-status-info .tips,#orderDetail .order-status .order-status-info .time {
		color: #999;
		font-size: 12px;
	}
	#orderDetail .order-status-item:before, #orderDetail .order-status-item:after {
		content: "";
		width: 1px;
		height: 50%;
		border-left: 1px solid #CBCBCB;
		position: absolute;
		top: 0px;
		left: 18px;
		margin-left: -1px;
	}
	#orderDetail  .order-status-item:first-child:before{
		height: 0px;
	}
	#orderDetail .order-status-item:last-child:after{
		height: 0px;
	}
	#orderDetail .order-status-item:after {
		top: 75%;
		bottom: 0;
		height: 50%;
	}
	#orderDetail .order-refund{
		margin-top: 10px;
	}
	#orderDetail .order-refund .refund-detail{
		background: #FFF;
		padding: 0 15px 10px;
		font-size: 15px;
	}
	#orderDetail .order-refund .refund-detail .refund-de-title{
		padding: 10px 0;
		font-size: 15px;
		color: #333;
	}
	#orderDetail .order-refund .refund-detail .refund-de-title .color-danger{
		color: #f6383a;
	}
	#orderDetail .order-refund .refund-detail .refund-status-cn{
		background: #ddd;
		color: #fff;
		font-size: 12px;
		border-radius: 20px;
		padding: 3px 6px;
	}
	#orderDetail .order-refund .refund-detail .refund-detail-con{
		font-size: 12px;
		color: #999;
	}
	#orderDetail .order-refund .refund-detail .refund-detail-con .no-gutter{
		margin: 7px 0;
	}
	#orderDetail .refund-plan{
		margin-top: 10px;
		padding: 15px;
		background: #FFF;
	}
	#orderDetail .refund-plan .order-status-info{
		background: #fafafa!important;
	}
	#orderDetail .refund-plan .arrow-left:after{
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 10px 12px 10px 0;
		border-color: transparent #e7e6e6 transparent transparent;
		position: absolute;
		left: 2px;
		top: 50%;
		margin-top: -10px;
		content: "";
		border-right-color: #fafafa;
		/*left: 2px;*/
		/*top: 0;*/
	}
	#orderDetail .map-info{
		width: 100%;
		height: 160px;
		margin-top: -20px;
		background-color: #fff;
	}

	/*分享红包弹出层*/
	#orderDetail .send-redpacket{
		z-index: 2000;
		position: fixed;
		bottom: 200px;
		right: 8px;
		max-width: 60px;
	}
	#orderDetail .send-redpacket img{
		width: 85%;
	}
	#orderDetail .send-redpacket .share-inner{
		width: 60px;
		height: 60px;
		border-radius: 100%;
		background-color: #ff2d4b;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#orderDetail .send-redpacket .share-inner .icon{
		font-size: 30px;
		color: #fff;
	}
	#orderDetail .van-modal{
		z-index: 20000!important;
	}
	#orderDetail .popup-send-redpacket{
		z-index: 20001!important;
		width: 270px;
		color: #333;
		border-radius: 7px;
		background-color: #fff;
	}
	#orderDetail .popup-send-redpacket .popup-content{
		width: 100%;
		padding: 15px;
		text-align: center;
		line-height: 1.5;
	}
	#orderDetail .popup-send-redpacket .popup-content.grant-share{
		text-align: left;
	}
	#orderDetail .popup-send-redpacket .popup-content .grant-share-title{
		text-align: center;
	}
	#orderDetail .popup-send-redpacket .popup-content img{
		width: 120px;
	}
	#orderDetail .popup-send-redpacket .popup-footer{
		width: 100%;
		height: 44px;
	}
	#orderDetail .popup-send-redpacket .popup-footer div{
		width: 50%;
		line-height: 44px;
		text-align: center;
		font-size: 17px;
	}
	#orderDetail .popup-send-redpacket .popup-footer .grant{
		color: #f90;
	}
	#orderDetail .popup-send-redpacket .popup-footer .grant-share-btn{
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#orderDetail .popup-send-redpacket .popup-footer .grant-share-btn .btn{
		width: 80%;
		border: 1px solid #ddd;
		border-radius:3px;
	}
	#orderDetail .content .deliveryer-container{
		padding: 10px 15px;
		background-color: #fff;
		overflow: hidden;
	}
	#orderDetail .content .deliveryer-container .avatar{
		float: left;
		display: inline-block;
		width: 50px;
		height: 50px;
		border-radius: 100%;
	}
	#orderDetail .content .deliveryer-container .avatar img{
		width: 100%;
		height: 100%;
		border-radius: 100%;
	}
	#orderDetail .content .deliveryer-container .deliveryer-info{
		display: inline-block;
		float: left;
		margin-left: 10px;
	}
	#orderDetail .content .deliveryer-container .deliveryer-info .name{
		font-size: 14px;
		text-align: left;
	}
	#orderDetail .content .deliveryer-container .deliveryer-info .name .mobile{
		color: #999;
		margin-top: 10px;
		line-height: 22px;
	}
	#orderDetail .content .deliveryer-container .deliveryer-info .name .allocation-icon{
		display: inline-block;
		position: relative;
		height: 15px;
		line-height: 15px;
		padding: 0 6px;
		font-size: 10px;
		font-weight: normal;
		vertical-align: middle;
		margin-left: 5px;
		background-color: #ff2d4b;
		color: #fff;
	}
	#orderDetail .content .deliveryer-container .deliveryer-info .name .allocation-icon:before,#orderDetail .content .deliveryer-container .deliveryer-info .name .allocation-icon:after{
		content: "";
		position: absolute;
		border: 2px solid #fff;
	}
	#orderDetail .content .deliveryer-container .deliveryer-info .name .allocation-icon:before{
		left: 0;
		top: 0;
		border-color: #fff #ff2d4b #ff2d4b #fff;
	}
	#orderDetail .content .deliveryer-container .deliveryer-info .name .allocation-icon:after{
		right: 0;
		bottom: 0;
		border-color: #ff2d4b #fff #fff #ff2d4b;
	}
	#orderDetail .content .deliveryer-container .operate{
		float: right;
		width: 50px;
		height: 100%;
	}
	#orderDetail .content .deliveryer-container .operate .tel{
		display: inline-block;
		height: 50px;
		width: 50px;
		line-height: 50px;
		text-align: right;
	}
	#orderDetail .content .deliveryer-container .operate .tel .icon{
		font-size: 16px;
	}
	#orderDetail .call-phone{
		width: 270px;
		color: #333;
		border-radius: 7px;
		background-color: #fff;
		padding: 15px;
		z-index: 20001!important;
	}
	#orderDetail .call-phone .call-phone-header{
		text-align: center;
		padding-bottom: 15px;
	}
	#orderDetail .call-phone .call-plateform{
		padding-bottom: 10px;
		text-align: center;
		color: #999;
		font-size: 15px;
	}
	#orderDetail .call-phone .call-deliveryer{
		padding-top: 10px;
		text-align: center;
		color: #999;
		font-size: 15px;
	}
	/*地图*/
	#orderDetail .map-wrap{
		width: 100%;
		height: 300px;
		transition: height 1s;
		position: relative;
	}
	#orderDetail .map-wrap .map-refresh{
		position: absolute;
		right: 15px;
		bottom: 15px;
		z-index: 1;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.4);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#orderDetail .map-wrap.map-wrap-hide{
		height: 0;
	}
	#orderDetail .map-wrap #map-container{
		width: 100%;
		height: 100%;
	}
	#orderDetail .map-wrap .amap-marker .marker-deliveyer-route{
		position: relative;
		width: 52px;
		height: 80px;
		color: #e90000;
		background: url(../../../static/img/map-location.png) no-repeat 0 0;
		cursor: pointer;
	}
	#orderDetail .map-wrap .amap-marker .marker-deliveyer-route img{
		position:absolute;
		top: 5px;
		right: 5px;
		width: 42px;
		height: 42px;
		border-radius: 100%;
	}
	#orderDetail .map-wrap .amap-marker .marker-start-head-route {
		position: relative;
		width: 70px;
		height: 70px;
		color: #e90000;
		background: url(../../../static/img/map-start-head.png) no-repeat 0 0;
		background-size: cover;
		cursor: pointer;
	}
	#orderDetail .map-wrap .amap-marker .marker-start-head-route img {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 46px;
		height: 46px;
		border-radius: 100%
	}
	#orderDetail .map-wrap .amap-marker .marker-mine-route {
		position: relative;
		width: 70px;
		height: 70px;
		color: #e90000;
		background: url(../../../static/img/map-lbs.png) no-repeat 0 0;
		background-size: cover;
		cursor: pointer;
	}
	#orderDetail .map-wrap .amap-marker .marker-mine-route img {
		position: absolute;
		top: 12px;
		right: 12px;
		width: 46px;
		height: 46px;
		border-radius: 100%
	}
	#orderDetail .van-tabs__wrap{
		position: fixed;
		top: 46px;
		z-index: 20;
	}
	#orderDetail .amap-copyright, .amap-logo{
		display: none!important;
	}
	#orderDetail .marker-common{
		display: flex;
		align-items: center;
		padding: 5px;

		background-color: #fff;
		border-radius: 100px;
		position: relative;
	}
	#orderDetail .marker-common:after{
		content: '';
		display: block;
		border-width: 8px;
		position: absolute;
		bottom: -15px;
		left: 50%;
		transform: translateX(-50%);
		border-style: solid dashed dashed;
		border-color: #fff transparent transparent;
		font-size: 0;
		line-height: 0;
		z-index: 10;
	}
	#orderDetail .marker-common:before{
		content: '';
		width: 10px;
		height: 10px;
		border-radius: 50%;
		position: absolute;
		background-color: rgba(255, 45, 75, 0.5);
		bottom: -12px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 9;
	}
	#orderDetail .marker-common .img-wrap{
		width: 30px;
		height: 30px;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 5px;
	}
	#orderDetail .marker-common.marker-mine-nopay{
		min-width: 100px;
	}
	#orderDetail .marker-common.marker-store-waiting{
		min-width: 125px;
	}
	#orderDetail .marker-common.marker-deliveryer-take{
		min-width: 170px;
	}
</style>



// WEBPACK FOOTER //
// src/pages/order/detail.vue
