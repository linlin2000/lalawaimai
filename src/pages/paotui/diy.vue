<template>
	<div id="paotui-scene">
		<public-header :title="title"></public-header>
		<div class="content">
			<template v-for="(diyitem, diyitemIndex) in diy.data.items">
				<!--单图组-->
				<div class="diy-banner" v-if="diyitem.id == 'banner'">
					<div v-for="(item, index) in diyitem.data" :key="index">
						<img :src="item.imgurl" @click="util.jsUrl(item.linkurl)">
					</div>
				</div>
				<!--图片轮播-->
				<div class="diy-picture" v-else-if="diyitem.id == 'picture'">
					<van-swipe :autoplay="3000" indicator-color="#ff2d4b">
						<van-swipe-item v-for="(item, index) in diyitem.data" :key="index">
							<div @click="util.jsUrl(item.linkurl)">
								<img :src="item.imgurl" alt="">
							</div>
						</van-swipe-item>
					</van-swipe>
				</div>
				<!--辅助线-->
				<div v-else-if="diyitem.id == 'line'" class="diy-line" :style="{background: diyitem.style.background, padding: diyitem.style.padding + 'px ' + '0px'}" >
					<div class="line"></div>
				</div>
				<!--辅助空白-->
				<div v-else-if="diyitem.id == 'blank'" class="diy-blank" :style="{height: diyitem.style.height + 'px', background: diyitem.style.background}"></div>
				<!--上传图片-->
				<div v-else-if="diyitem.id == 'uploadImg'" class="diy-uploadImg" :style="{'margin-top': diyitem.style.marginTop + 'px'}">
					<div class="uploadImg-item" v-for="(item, pindex) in diyitem.data" :key="item">
						<div class="uploadImg-title">{{item.title}}</div>
						<template v-if="erranderExtra.thumbs && erranderExtra.thumbs[diyitemIndex + '_' + pindex] && erranderExtra.thumbs[diyitemIndex + '_' + pindex].length > 0">
							<div class="img-list">
								<div class="img-group" v-for="(item, index) in erranderExtra.thumbs[diyitemIndex + '_' + pindex]" :key="item">
									<div class="upload-img">
										<img :src="item.url" alt="">
										<span class="del-img" @click="onDelThumb(diyitemIndex, pindex, index)">
											<i class="icon icon-close"></i>
										</span>
									</div>
								</div>
								<div class="img-group" v-if="erranderExtra.thumbs[diyitemIndex + '_' + pindex].length < 3">
									<div class="upload-img">
										<input class="weui-uploader__input" type="file" multiple="multiple" accept="image/*" @change="onUploadImage(diyitemIndex, pindex, $event)">
										<img src="static/img/add_pic.png" alt="">
									</div>
								</div>
							</div>
						</template>
						<template v-else>
							<div class="uploadImg-right">
								<div class="uploadImg-tips">
									<input class="weui-uploader__input" type="file" multiple="multiple" accept="image/*" @change="onUploadImage(diyitemIndex, pindex, $event)">
									{{item.placeholder}}
								</div>
								<div class="icon icon-right"></div>
							</div>
						</template>
					</div>
				</div>
				<template v-else-if="diyitem.id == 'basic'">
					<van-cell-group class="diy-scene-shopinfo margin-10-b" >
						<van-field
							v-model='note'
							type="textarea"
							:placeholder="diyitem.params.placeholder"
							rows="4"
							class="border-0px"
						/>
						<ul class="info-tags">
							<li class="tag-item" @click="onAddLabel(item.tags)" v-for="(item, index) in diyitem.data" :key="index">{{item.tags}}</li>
						</ul>
						<van-cell class="van-hairline--top" v-if="diyitem.params.estimate == 1">
							<div slot="title" class="flex">
								<img class="amount-icon" src="static/img/amount_icon.png" alt="">
								<span class="font-12">骑手垫付商品费，收货后与配送员结清</span>
							</div>
							<div slot="right-icon" class="flex" @click="onChangeStatus('prefee')">
								<span class="font-12" :class="{'c-disabled': !erranderExtra.goods_price}">{{erranderExtra.goods_price > 0 ? '预估 ￥' + erranderExtra.goods_price : '预估商品费'}}</span>
								<span class="icon icon-right c-disabled font-12"></span>
							</div>
						</van-cell>
					</van-cell-group>
					<van-cell-group class="diy-scene-address margin-10-b">
						<template v-if="diyitem.params.scene == 'buy'">
							<van-cell class="border-0px">
								<div slot="title" class="flex">
									<div class="margin-15-r">{{diyitem.params.buytitle}}</div>
									<div class="address-type flex">
										<div class="address-type-item font-12 " :class="{active: buyAddressType == 'store'}" @click="onToggleBuyAddressType('store')">{{diyitem.params.buytype1title}}</div>
										<div class="address-type-item font-12" :class="{active: buyAddressType == 'nearby'}" @click="onToggleBuyAddressType('nearby')"> {{diyitem.params.buytype2title}}</div>
									</div>
								</div>
							</van-cell>
							<van-cell v-if="erranderExtra.buyAddressType == 'store'" :to="util.getUrl({path: '/pages/paotui/location'})">
								<div slot="title" class="flex">
									<div class="margin-15-r opacity-1">111</div>
									<span  v-if="erranderExtra.buyaddress && erranderExtra.buyaddress.location_x">{{erranderExtra.buyaddress.address}}</span>
									<span class="c-disabled" v-else>{{diyitem.params.buytype1placehode}}</span>
								</div>
								<div slot="right-icon" class="flex">
									<span class="icon icon-right c-disabled font-12"></span>
								</div>
							</van-cell>
							<van-cell :to="util.getUrl({path: '/pages/member/address', query:{channel: 'errander', input: 'accept', erranderId: id}})">
								<div slot="title" class="flex ">
									<div class="margin-15-r">{{diyitem.params.accepttitle}}</div>
									<span v-if="erranderExtra.acceptaddress_id > 0">
										{{acceptaddress.address}}-{{acceptaddress.number}}
										<div class="c-disabled">{{acceptaddress.realname}} {{acceptaddress.sex}} {{acceptaddress.mobile}}</div>
									</span>
									<span class="c-disabled" v-else>{{diyitem.params.acceptplacehode}}</span>
								</div>
								<div slot="right-icon" class="flex">
									<span class="icon icon-right c-disabled font-12"></span>
								</div>
							</van-cell>
						</template>
						<template v-else-if="diyitem.params.scene == 'delivery'">
							<van-cell :to="util.getUrl({path: '/pages/member/address', query:{channel: 'errander', input: 'buy', erranderId: id}})">
								<div slot="title" class="flex height-50" >
									<div class="address-icon bg-primary"></div>
									<div v-if="erranderExtra.buyaddress_id > 0">
										<div>{{buyaddress.address}}-{{buyaddress.number}}</div>
										<div class="c-disabled">{{buyaddress.realname}} {{buyaddress.mobile}}</div>
									</div>
									<span class="c-disabled" v-else>{{diyitem.params.buytype1placehode}}</span>
								</div>
								<div slot="right-icon" class="flex">
									<span class="icon icon-right c-disabled font-12"></span>
								</div>
							</van-cell>
							<van-cell :to="util.getUrl({path: '/pages/member/address', query:{channel: 'errander', input: 'accept', erranderId: id}})">
								<div slot="title" class="flex height-50">
									<div class="address-icon bg-danger"></div>
									<div v-if="erranderExtra.acceptaddress_id > 0">
										{{acceptaddress.address}} {{acceptaddress.number}}
										<div class="c-disabled">{{acceptaddress.realname}} {{acceptaddress.mobile}}</div>
									</div>
									<span class="c-disabled" v-else>{{diyitem.params.acceptplacehode}}</span>
								</div>
								<div slot="right-icon" class="flex">
									<span class="icon icon-right c-disabled font-12"></span>
								</div>
							</van-cell>
						</template>
						<van-row>
							<van-col span="12" class="van-hairline--right">
								<van-cell  @click="onChangeStatus('deliveryTime')">
									<div slot="title">{{erranderExtra.delivery_day}} {{erranderExtra.delivery_time == order.delivery_nowtime ? '立即送出': erranderExtra.delivery_time}}</div>
									<div slot="right-icon" class="icon icon-right c-disabled font-12"></div>
								</van-cell>
							</van-col>
							<van-col span="12">
								<van-cell @click="onChangeStatus('goodsWeight')">
									<div slot="title" v-if="erranderExtra.goods_weight > diy.data.fees.weight_data.basic">{{erranderExtra.goods_weight}}公斤</div>
									<div slot="title" v-else >物品重量：{{diy.data.fees.weight_data.basic}}公斤内</div>
									<div slot="right-icon" class="icon icon-right c-disabled font-12"></div>
								</van-cell>
							</van-col>
						</van-row>
					</van-cell-group>
				</template>

				<template v-else-if="diyitem.id == 'text'">
					<van-cell-group class="diy-scene-text margin-10-b" :style="{'margin-top': diyitem.style.marginTop + 'px'}">
						<template v-for="(text, pindex) in diyitem.data">
							<van-field :ref="diyitemIndex + '_' + pindex"
								:value="erranderExtra.partData[diyitemIndex + '_' + pindex]"
								:label="text.title"
								placeholder="请输入提示信息"
								@blur="onGetPartData({type: 'text', info: {name: diyitemIndex + '_' + pindex}})"
							/>
						</template>
					</van-cell-group>
				</template>

				<!--选项-->
				<template v-else-if="diyitem.id == 'multipleChoices'">
					<div class="diy-scene-choose flex-lr margin-10-b" :style="{'margin-top': diyitem.style.marginTop + 'px'}" v-for="(item, pindex) in diyitem.data" :key="item">
						<div class="choose-title ellipsis font-14">{{item.title}}</div>
						<div class="choose-options">
							<span class="option-item font-14" :class="{active: (erranderExtra.partData[diyitemIndex + '_' + pindex] && erranderExtra.partData[diyitemIndex + '_' + pindex][cindex] == option.name)}" v-for="(option, cindex) in item.options" :key="cindex"  @click="onGetPartData({type:'multipleChoices', info: {name: diyitemIndex + '_' + pindex, 'value': option.name, 'cindex': cindex}})">{{option.name}}</span>
						</div>
					</div>
				</template>

				<!--选项-->
				<template v-else-if="diyitem.id == 'oneChoice'">
					<div class="diy-scene-choose flex-lr margin-10-b" :style="{'margin-top': diyitem.style.marginTop + 'px'}" v-for="(item, pindex) in diyitem.data">
						<div class="choose-title ellipsis font-14">{{item.title}}</div>
						<div class="choose-options">
							<span class="option-item font-14" :class="{active: (erranderExtra.partData[diyitemIndex + '_' + pindex] && erranderExtra.partData[diyitemIndex + '_' + pindex] == option.name)}" v-for="(option, cindex) in item.options" :key="cindex" @click="onGetPartData({type: 'oneChoice',info: {name: diyitemIndex + '_' + pindex, 'value': option.name, 'cindex': cindex}})">{{option.name}}</span>
						</div>
					</div>
				</template>
			</template>
			<template v-if="diy.data.fees && diy.data.fees.extra_fee">
				<div class="diy-scene-choose flex-lr margin-10-b" v-for="(feeItem, pindex) in diy.data.fees.extra_fee" v-if="feeItem.status == 1" :key="pindex">
					<div class="choose-title ellipsis font-14">{{feeItem.title}}</div>
					<div class="choose-options">
						<span class="option-item font-14" v-for="(option, cindex) in feeItem.data" :key="cindex" :class="{active: erranderExtra.extra_fee[pindex] && erranderExtra.extra_fee[pindex][cindex] == cindex}" @click="onGetExtraFee(cindex, pindex)">{{option.fee_name}}-￥{{option.fee}}</span>
					</div>
				</div>
			</template>

			<van-cell-group class="diy-scene-extra-fee">
				<van-cell>
					<div slot="title">{{basicPart.params.redpacketname}}</div>
					<div slot="right-icon">
						<span class="c-danger font-12" @click="onChangeStatus('redpacket')" v-if="order.redpacket">-￥{{order.redpacket.discount}}</span>
						<span class="font-12" :class="{'c-danger': redPackets.length > 0, 'c-disabled': redPackets.length <= 0}" @click="onChangeStatus('redpacket')" v-else>{{redPackets.length > 0 ? (redPackets.length + '个可用红包') : basicPart.params.noredpacketnote}}</span>
						<span class="icon icon-right c-disabled font-12"></span>
					</div>
				</van-cell>
				<van-cell v-if="basicPart.params.showtips == 1"  @click="onChangeStatus('tip')">
					<div slot="title">{{basicPart.params.tipsname}}</div>
					<div slot="right-icon">
						<span class="font-14" :class="{'c-danger': erranderExtra.delivery_tips > 0}">{{erranderExtra.delivery_tips > 0 ? '￥' + erranderExtra.delivery_tips : basicPart.params.tipsnote}}</span>
						<span class="icon icon-right c-disabled font-12"></span>
					</div>
				</van-cell>
			</van-cell-group>
			<p class="diy-scene-agreement font-12" @click="onShowAgreement">点击查看 <span class="c-default">《跑腿服务协议》</span></p>
		</div>
		<div class="diy-scene-submit van-hairline--top">
			<div class="order-info flex-lr">
				<div class="font-12">{{order.distance > 0 ? order.distance + '公里' : ''}}</div>
				<div class="font-12 c-default" @click="onChangeStatus('fee')">
					<span>{{basicPart.params.feesname}}</span>
					<span class="c-danger">
						<span class="font-20">{{order.final_fee}}</span>元
					</span>
					<span class="icon icon-fold font-12 c-disabled"></span>
				</div>
			</div>
			<van-button disabled size="normal" :block="true" v-if="diy.is_rest == 1">休息中暂不提供服务</van-button>
			<van-button size="normal" :block="true" type="danger" @click="onSubmit" v-else>{{basicPart.params.submitname}}</van-button>
		</div>
		<!--预估商品费弹出层-->
		<van-popup v-model="status.prefee" position="bottom" class="popup-prefee">
			<div class="popup-title flex-lr border-1px-b">
				<span class="font-14" @click="onChangeStatus('prefee')">取消</span>
				<span>预估商品费</span>
				<span class="font-14" @click="onConfirmPrefee">确定</span>
			</div>
			<div class="popup-content">
				<p class="prefee-tips">供骑手代购时参考（可选填）</p>
				<div class="prefee-edit">
					预估 ¥
					<input type="text" v-model="erranderExtra.goods_price">
				</div>
				<p class="prefee-max c-disabled">
					<span class="icon icon-info"></span>最高500元
				</p>
			</div>
		</van-popup>

		<!--取件时间弹出层-->
		<van-popup v-model="status.deliveryTime" position="bottom" class="popup-delivery-time" v-if="order.delivery_info && erranderExtra.delivery_day">
			<div class="popup-title flex-lr border-1px-b">
				<span class="font-14" @click="onChangeStatus('deliveryTime')">取消</span>
				<span>取件时间</span>
				<span class="opacity-1">确定</span>
			</div>
			<div class="popup-content flex-lr">
				<div class="date">
					<div class="date-item" :class="{active: day == erranderExtra.delivery_day}" v-for="(item, day) in order.delivery_info" @click="onSelectDay(day)" :key="item">{{day}}</div>
				</div>
				<div class="time">
					<div class="time-item" :class="{active: item == erranderExtra.delivery_time}" v-for="(item, index) in order.delivery_info[erranderExtra.delivery_day].times" :key="index" @click="onSelectTime(item)">
						{{item == order.delivery_nowtime ? '立即送出' : item}}
						<span class="icon" :class="{'icon-check': item == erranderExtra.delivery_time}"></span>
					</div>
				</div>
			</div>
		</van-popup>
		<!--物品重量弹出层-->
		<van-popup v-model="status.goodsWeight" position="bottom" class="popup-goods-weight" v-if="erranderExtra.goods_weight !== '' && diy.data && diy.data.fees">
			<div class="popup-title flex-lr border-1px-b">
				<span class="font-14" @click="onChangeStatus('goodsWeight')">取消</span>
				<span>物品重量</span>
				<span class="opacity-1">确定</span>
			</div>
			<div class="popup-content">
				<p class="weight-label">重量</p>
				<div class="weight-value" v-if="erranderExtra.goods_weight > diy.data.fees.weight_data.basic">{{erranderExtra.goods_weight}}公斤</div>
				<div class="weight-value" v-else>小于{{diy.data.fees.weight_data.basic}}公斤</div>
				<div class="slider">
					<van-slider v-model="goodsWeight" :min="diy.data.fees.weight_data.basic" :max="100" @change="onChangeWeight"/>
					<div class="slide-line-bottom">
						<div class="left">小于{{diy.data.fees.weight_data.basic}}公斤</div>
						<div class="right">100公斤</div>
					</div>
				</div>
			</div>
		</van-popup>
		<!--小费弹出层-->
		<van-popup v-model="status.tip" position="bottom" class="popup-goods-weight popup-tip">
			<div class="popup-title flex-lr border-1px-b">
				<span class="font-14" @click="onChangeStatus('tip')">取消</span>
				<span>小费</span>
				<span class="opacity-1">确定</span>
			</div>
			<div class="popup-content">
				<p class="weight-label">加小费抢单更快哦(单位:元)</p>
				<div class="weight-value" v-if="erranderExtra.delivery_tips > 0">{{erranderExtra.delivery_tips}}元</div>
				<div class="slider">
					<van-slider v-model="tip" :min="basicPart.params.minfee" :max="basicPart.params.maxfee" @change="onChangeTip"/>
					<div class="slide-line-bottom">
						<div class="left">{{basicPart.params.minfee}}元</div>
						<div class="right">{{basicPart.params.maxfee}}元</div>
					</div>
				</div>
			</div>
		</van-popup>
		<!--费用明细弹出层-->
		<van-popup v-model="status.fee" position="bottom" class="popup-fee">
			<div class="popup-title flex-lr border-1px-b">
					<span class="font-12 flex opacity-1">
						价格规则
						<span class="icon icon-right font-12 "></span>
					</span>
				<span @click="util.getUrl({path: '/pages/paotui/feeRule', query:{id: id}})">费用明细</span>
				<span class="font-12 c-primary flex opacity-1">
						价格规则
						<span class="icon icon-right font-12 "></span>
					</span>
			</div>
			<div class="popup-content">
				<van-cell-group class="border-0px">
					<template v-for="(item, index) in order.fees" >
						<van-cell class="border-0px" v-if="item.fee != ''" :class="{'c-danger': item.fee < 0}" :title="item.title" :value="item.fee_cn" />
					</template>
				</van-cell-group>
			</div>
		</van-popup>
		<!-- 红包弹出层 -->
		<van-popup v-model="status.redpacket" position="bottom" v-if="redPackets.length > 0">
			<div class="popup-redpacket">
				<div class="popup-title van-hairline--bottom text-center">可用红包</div>
				<div class="popup-container">
					<load type="loaded" :text="'可用红包(' + redPackets.length + '个)'" bgcolor="#f5f5f5"></load>
					<div class="redPacket-list content-padded" v-for="item in redPackets" :key="item.id">
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
							<div class="selected-status" v-if="item.id == order.redpacket_id">
								<img src="static/img/success.png" alt="" class="img-100">
							</div>
						</div>
					</div>
				</div>
				<div class="popup-cancle van-hairline--top" @click="onSelectRedpacket(0)">不使用红包</div>
			</div>
		</van-popup>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
		<agreement :show="agreemnetShow" :title="agreementtitle" :content="diy.agreement" @agreementHide="agreemnetShow = false"></agreement>
		<failed-tips :failedTips="failedTips" v-if="!getLocationStatus"></failed-tips>
	</div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import PublicHeader from "@/components/header"
import agreement from '@/components/agreement'
import failedTips from '@/components/failedTips'
export default {
	name: "paotuiScene",
	components: {
		PublicHeader,
		agreement,
		failedTips
	},
	data() {
		return {
			title: '跑腿',
			agreemnetShow: false,
			agreementtitle: '《帮买服务协议》',
			showPreLoading: true,
			status: {
				prefee: false,
				deliveryTime: false,
				goodsWeight: false,
				tip: false,
				fee: false,
				redpacket: false,
				address: false,
			},
			note: '',
			goodsWeight: 0,
			tip: 0,
			buyaddressPoint: true,
			diy: {
				data: {},
			},
			basicPart: {
				params: {}
			},
			redPackets:[],
			addresses: [],
			buyaddress:{},
			buyAddressType: 'nearby',
			acceptaddress: {},
			order:{},
			submitDisabled: 0,
			failedTips: {
				type: 'location',
				tips: '获取定位失败!您可以选择手动搜索地址',
				btnText: '手动搜索地址',
				link: '/pages/home/location'
			},
			getLocationStatus: true,
		}
	},
	computed: {
		...mapState([
			'erranderExtra', 'erranderSceneId'
		]),
	},

	methods: {
		...mapMutations([
			'setState', 'replaceState'
		]),
		onUploadImage(diyitemindex, pindex, e) {
			var that = this;
			var key = diyitemindex + '_' + pindex;
			that.util.image({
				obj: e,
				success: function(obj, result) {
					if(result.url && result.filename) {
						var thumb = {
							url: result.url,
							filename: result.filename,
						};
						var thumbs = that.erranderExtra.thumbs;
						if(!thumbs) {
							thumbs = {};
						}
						if(!thumbs[key]) {
							thumbs[key] = [];
						}
						thumbs[key].push(thumb);
						var tempExtra = Object.assign(that.erranderExtra, {
							thumbs: thumbs,
						});
						that.replaceState({key: 'erranderExtra', val: tempExtra});
						that.onCalculate();
					}
				},
				options: {channel: 'h5'}
			});
		},
		onDelThumb(diyitemindex, pindex, index) {
			var key = diyitemindex + '_' + pindex;
			var thumbs = this.erranderExtra.thumbs;
			thumbs[key].splice(index, 1);
			var tempExtra = Object.assign(this.erranderExtra, {
				thumbs: thumbs,
			});
			this.replaceState({key: 'erranderExtra', val: tempExtra});
			this.onCalculate();
		},
		onShowAgreement() {
			this.agreemnetShow = true;
		},
		onChangeStatus(key) {
			if(key == 'prefee' && this.status.prefee) {
				this.setState({type: 'erranderExtra', key: 'goods_price', val: 0});
			} else if (key == 'goodsWeight' && this.status.goodsWeight) {
				//var basic = this.diy.data.fees.weight_data.basic
				this.setState({type: 'erranderExtra', key: 'goods_weight', val: 0});
				this.onCalculate();
			} else if (key == 'tip' && this.status.tip) {
				this.setState({type: 'erranderExtra', key: 'delivery_tips', val: 0});
				this.onCalculate();
			} 
			this.status[key] = !this.status[key];
		},

		onConfirmPrefee() {
			this.setState({type: 'erranderExtra', key: 'goods_price', val: this.erranderExtra.goods_price}); 
			this.status.prefee = false;
			this.onCalculate();
		},
		onToggleBuyAddressType(type) {
			this.buyAddressType = type;
			this.setState({type: 'erranderExtra', key: 'buyAddressType', val: type});
			if(type == 'nearby') {
				this.setState({type: 'erranderExtra', key: 'buyaddress', val: {}});
			}
			this.onCalculate();
		},
		onSelectDay(day) {
			this.setState({type: 'erranderExtra', key: 'delivery_day', val: day});
			this.order = Object.assign({}, this.order);
		},
		onSelectTime(time) {
			this.setState({type: 'erranderExtra', key: 'delivery_time', val: time});
			this.erranderExtra.delivery_time = time;
			this.status.deliveryTime = false;
			this.onCalculate();
		},
		onChangeWeight() {
			this.setState({type: 'erranderExtra', key: 'goods_weight', val: this.goodsWeight});
			this.onCalculate();
		},
		onChangeTip() {
			this.setState({type: 'erranderExtra', key: 'delivery_tips', val: this.tip});
			this.onCalculate();
		},
		onSelectRedpacket(id) {
			if(id == this.erranderExtra.redpacket_id) {
				id = 0;
			}
			this.setState({type: 'erranderExtra', key: 'redpacket_id', val: id});
			this.status.redpacket = false;
			this.onCalculate();
		},
		onGetExtraFee(cindex, pindex) {
			if(!this.erranderExtra.extra_fee || this.erranderExtra.extra_fee.length == 0) {
				this.erranderExtra.extra_fee = {};
			}
			if(this.erranderExtra.extra_fee[pindex]) {
				for(var i in this.erranderExtra.extra_fee[pindex]) {
					if(this.erranderExtra.extra_fee[pindex][i] == cindex) {
						delete this.erranderExtra.extra_fee.current;
						delete this.erranderExtra.extra_fee[pindex][i];
						this.onCalculate();
						return false;
					}
				}
			} else {
				this.erranderExtra.extra_fee[pindex] = {};
			}
			this.erranderExtra.extra_fee[pindex][cindex] = cindex;
			this.erranderExtra.extra_fee.current = {
				pindex: pindex,
				cindex: cindex
			};
			this.onCalculate();
		},

		onGetPartData(params) {
			var type = params.type;
			var info = params.info;
			var name = info.name;
			var value = info.value;
			var cindex = info.cindex;
			if(!this.erranderExtra.partData) {
				this.erranderExtra.partData = {};
			}
			if(type == 'text') {
				this.erranderExtra.partData[name] = this.$refs[name][0].$refs.input.value;
			} else if(type == 'oneChoice') {
				if(this.erranderExtra.partData[name]) {
					if(this.erranderExtra.partData[name] == value) {
						this.erranderExtra.partData[name] = '';
						this.diy.data.items = Object.assign({}, this.diy.data.items);
						this.replaceState({key: 'erranderExtra', val: this.erranderExtra});
						return false;
					}
				}
				this.erranderExtra.partData[name] = value;
				this.diy.data.items = Object.assign({}, this.diy.data.items);
			} else if(type == 'multipleChoices') {
				if(this.erranderExtra.partData[name]) {
					for(var i in this.erranderExtra.partData[name]) {
						if(this.erranderExtra.partData[name][i] == value) {
							delete this.erranderExtra.partData[name][i];
							this.diy.data.items = Object.assign({}, this.diy.data.items);
							this.replaceState({key: 'erranderExtra', val: this.erranderExtra});
							return false;
						}
					}
				} else {
					this.erranderExtra.partData[name] = {};
				}
				this.erranderExtra.partData[name][cindex] = value;
				this.diy.data.items = Object.assign({}, this.diy.data.items);
				this.replaceState({key: 'erranderExtra', val: this.erranderExtra});
			}
			this.replaceState({key: 'erranderExtra', val: this.erranderExtra});
		},

		onCalculate() {
			this.status.redpacket = false;
			var params = {
				is_calculate: 1,
				extra: this.erranderExtra,
				id: this.id
			};
			this.util.request({
				url: 'errander/diy/index',
				data: params,
			}).then((res) => {
				let result = res.data.message;
				if(result.errno != 0) {
					this.util.$toast(result.message, '', 1000);
					if(result.errno == -1000) {
						delete this.erranderExtra.extra_fee[this.erranderExtra.extra_fee.current.pindex][this.erranderExtra.extra_fee.current.cindex];
						this.util.$toast(result.message, '', 1000);
						this.replaceState({key: 'erranderExtra', val: this.erranderExtra});
						return false;
					}
					return false;
				}

				result = result.message;
				if (result.buyaddress && result.buyaddress.errno) {
					this.util.$toast(result.buyaddress.message, '', 1000);
				}
				var tempExtra = Object.assign(this.erranderExtra, {
					delivery_nowtime: result.order.delivery_nowtime,
					acceptaddress_id: result.acceptaddress_id,
					buyaddress_id: result.buyaddress_id,
					extra_fee: result.order.extra_fee,
					redpacket_id: result.order.redpacket_id,
					goods_price: result.order.goods_price,
					delivery_day: result.order.delivery_day,
					delivery_time: result.order.delivery_time,
					delivery_tips: result.order.delivery_tips
				});
				this.basicPart = result.basic;
				this.diy.data.items = Object.assign({}, this.diy.data.items);
				this.replaceState({key: 'erranderExtra', val:tempExtra});

				this.redPackets = result.redPackets;
				this.addresses = result.addresses;
				this.buyaddress = result.buyaddress;
				this.acceptaddress = result.acceptaddress;
				this.order = result.order;
			})
		},
		onSubmit() {
			if(this.submitDisabled == 1) {
				return false;
			}
			if(!this.erranderExtra.note) {
				this.util.$toast('请填写物品信息', '', 1500);
				return false;
			}
			if(this.diy.data.page.scene != 'buy') {
				if(!this.buyaddress) {
					this.util.$toast('请选择取货地址', '', 1500);
					return false;
				}
				if(!this.util.isValidMobile(this.buyaddress.mobile)) {
					this.$toast('取货联系人手机号格式不正确');
					return false;
				}
			}
			if(!this.acceptaddress) {
				this.util.$toast('请选择收货地址', '');
				return false;
			}
			if(!this.util.isValidMobile(this.acceptaddress.mobile)) {
				this.$toast('收货联系人手机号格式不正确');
				return false;
			}
			if(this.diy.data.fees.weight_status ==1 && !this.erranderExtra.goods_weight) {
				this.util.$toast('请选择物品重量', '', 1500);
				return false;
			}
			this.submitDisabled = 1;
			this.util.request({
				url: 'errander/orderdiy/create',
				data: {
					id: this.id,
					extra: this.erranderExtra
				}
			}).then((res) => {
				var result = res.data.message;
				if(result.errno) {
					this.submitDisabled = 0;
					this.util.$toast(result.message, '', 1000);
					return false;
				}
				var order_id = result.message;
				this.$router.replace(this.util.getUrl({path: '/pages/public/pay?order_id=' + order_id + '&order_type=errander'}));
				this.replaceState({key: 'erranderExtra', val: {partData: {}, thumbs: {}}});
				return false;
			})

		},

		onLoad() {
			if(this.id != this.erranderSceneId) {
				this.setState({type: 'erranderExtra', key: 'delivery_tips', val: 0});
				this.replaceState({key: 'erranderSceneId', val: this.id});
			}
			if(this.erranderExtra.notes && !this.erranderExtra.note) {
				this.erranderExtra.note = this.erranderExtra.notes[this.id];
			}
			this.util.request({
				url: 'errander/diy/index',
				data: {
					id: this.id,
					extra: this.erranderExtra,
					forceLocation: 1,
				},
			}).then((res) => {
				this.showPreLoading = false;
				let result = res.data.message;
				if(result.errno != 0) {
					this.util.$toast(result.message, '', 1000);
					return false;
				}
				result = result.message;
				if(this.erranderExtra.buyAddressType == 'nearby' || this.erranderExtra.buyAddressType == 'store') {
					this.buyAddressType = this.erranderExtra.buyAddressType;
				}
				var tempExtra = Object.assign(this.erranderExtra, {
					delivery_day: result.order.delivery_day,
					delivery_time: result.order.delivery_time,
					delivery_nowtime: result.order.delivery_nowtime,
					buyaddress_id: result.buyaddress_id,
					acceptaddress_id: result.acceptaddress_id,
					delivery_tips: result.order.delivery_tips,
					extra_fee: result.order.extra_fee || {},
					goods_weight: result.order.goods_weight,
					goods_price: result.order.goods_price,
					note: result.order.note,
				});

				this.replaceState({key: 'erranderExtra', val:tempExtra});
				this.redPackets = result.redPackets;
				this.addresses = result.addresses;
				this.buyaddress = result.buyaddress;
				this.acceptaddress = result.acceptaddress;
				this.diy = result.diy;
				this.basicPart = result.basic;
				this.order = result.order;
				if(this.erranderExtra && this.erranderExtra.note) {
					this.note = this.erranderExtra.note;
				}
				if(!this.erranderExtra.extra_fee) {
					this.erranderExtra.extra_fee = {};
				}
				this.setState({type: 'erranderExtra', key: 'agentid', val: result.diy.agentid});
				this.title = '跑腿下单';
				if(result.diy.data.page.title) {
					this.title = result.diy.data.page.title;
				}
				this.util.setWXTitle(this.title);
			}).catch((res) => {
				if(window.forceGetLocationStatus == 'fail') {
					this.showPreLoading = false;
					this.getLocationStatus = false;
				}
			})
		},
		onAddLabel(note) {
			this.note = this.note + note + ' ';
		},
	},
	watch: {
		note: function() {
			this.setState({type: 'erranderExtra', key: 'note', val: this.note});
			var id = this.id;
			var notes = this.erranderExtra.notes;
			if(!notes) {
				notes = {}
			}
			notes[id] = this.note;
			this.setState({type: 'erranderExtra', key: 'notes', val: notes});
		}
	},
	created() {
		this.query = this.$route.query;
		if(this.query) {
			this.id = this.query.id;
		}
	},
	mounted() {
		this.onLoad();
	}
}
</script>

<style>
	@import "../../../static/css/diy.css";
	#paotui-scene .van-popup{
		z-index: 100000000!important;
	}
	#paotui-scene .content{
		bottom: 100px;
	}
	#paotui-scene .height-30{
		height: 30px;
	}
	#paotui-scene .height-50{
		height: 50px;
	}
	#paotui-scene .amount-icon{
		width: 20px;
		height: 20px;
		margin-right: 5px;
	}
	#paotui-scene .diy-scene-shopinfo .info-tags{
		padding: 10px 15px 0;
		font-size: 14px;
	}
	#paotui-scene .diy-scene-shopinfo .info-tags .tag-item{
		display: inline-block;
		margin-bottom: 10px;
		padding:5px 10px;
		margin-right:10px;
		color:#626d7c;
		background:#f3f7f8;
		border-radius:55px;
	}
	#paotui-scene .address-icon{
		width: 10px;
		height: 10px;
		border-radius: 50%;
		margin-right: 10px;
	}
	#paotui-scene .diy-scene-address .address-type-item{
		height: 28px;
		padding: 0 8px;
		line-height: 28px;
		text-align: center;
		border: 1px solid #ccc;
		margin-right: 10px;
	}
	#paotui-scene .diy-scene-address .address-type-item.active{
		border-color: #ff2d4b;
	}
	#paotui-scene .diy-scene-agreement{
		padding: 10px 15px;
		color: #bfbfbf;
	}
	#paotui-scene .diy-scene-choose{
		width: 100%;
		padding: 10px 15px;
		line-height: 24px;
		background-color: #fff;
	}
	#paotui-scene .diy-scene-choose .choose-title{
		width: 25%;
	}
	#paotui-scene .diy-scene-choose .choose-options{
		width:75%;
		overflow-x: auto;
		overflow-y: hidden;
	}
	#paotui-scene .diy-scene-choose .choose-options::-webkit-scrollbar {
		display: none;
	}
	#paotui-scene .diy-scene-choose .choose-options .option-item{
		padding: 0px 8px;
		border:1px solid #999;
		border-radius:3px;
		margin-right:10px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		margin-bottom: -6px;
	}
	#paotui-scene .diy-scene-choose .choose-options .option-item.active{
		background-color: #ff2d4b;
		color: #fff;
		border-color: #ff2d4b;
	}
	#paotui-scene .diy-scene-submit{
		background-color: #fff;
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		padding: 0px 15px 15px;
		z-index: 10000;
	}
	#paotui-scene .diy-scene-submit .order-info{
		height: 40px;
		line-height: 40px;
	}

	/*预估商品费弹出层*/
	#paotui-scene .van-popup{
	}
	#paotui-scene .popup-prefee{
		z-index: 20000!important;
	}
	#paotui-scene .van-popup .popup-title{
		height: 50px;
		line-height: 50px;
		padding: 0 10px;
	}
	#paotui-scene .van-popup.popup-prefee .popup-content{
		padding: 0px 10px;
	}
	#paotui-scene .van-popup .popup-content .prefee-tips{
		color:#666;
		width:100%;
		text-align:center;
		font-size:14px;
		height: 40px;
		line-height: 40px;
	}
	#paotui-scene .van-popup .popup-content .prefee-edit{
		height: 40px;
		border: 1px solid #ff2d4b;
		border-radius:4px;
		color: #ff2d4b;
		display:flex;
		justify-content:center;
		align-items:center;
		font-size:14px;
	}
	#paotui-scene .van-popup .popup-content .prefee-edit input{
		width: 55px;
		margin-left: 5px;
		color: #ff2d4b;
	}
	#paotui-scene .van-popup .popup-content .prefee-max{
		height: 50px;
		line-height: 50px;
		text-align: center;
		font-size: 14px;
	}
	#paotui-scene .van-popup .popup-content .prefee-max .icon{
		margin-right: 5px;
	}
	/*取件时间弹出层*/
	#paotui-scene .popup-delivery-time{
		z-index: 20000!important;
	}
	#paotui-scene .popup-delivery-time .popup-content{
		height: 300px;
		padding: 0;
	}
	#paotui-scene .popup-delivery-time .popup-content>div{
		width: 200px;
		height: 100%;
		overflow-y: auto;
	}
	#paotui-scene .popup-delivery-time .popup-content div::-webkit-scrollbar{
		display: none;
	}
	#paotui-scene .popup-delivery-time .popup-content .date{
		width: 30%;
		background-color: #f5f5f5;
	}
	#paotui-scene .popup-delivery-time .popup-content .date .date-item{
		width: 100%;
		height: 50px;
		line-height: 50px;
		text-align: center;
		font-size: 14px;
	}
	#paotui-scene .popup-delivery-time .popup-content .date .date-item.active{
		background-color: #fff;
	}
	#paotui-scene .popup-delivery-time .popup-content .time{
		width: 70%;
	}
	#paotui-scene .popup-delivery-time .popup-content .time .time-item{
		height: 50px;
		line-height: 50px;
		text-align: center;
		font-size: 14px;
		position: relative;
	}
	#paotui-scene .popup-delivery-time .popup-content .time .time-item.active{
		color: #ff2d4b;
	}
	#paotui-scene .popup-delivery-time .popup-content .time .time-item .icon{
		position: absolute;
		top: 0;
		right: 10px;
		bottom: 0;
		font-size: 20px;
		color: #ff2d4b;
		display: none;
	}
	#paotui-scene .popup-delivery-time .popup-content .time .time-item.active .icon{
		display: block;
	}
	/*物品重量弹出层*/
	#paotui-scene .popup-goods-weight{
		z-index: 20000!important;
	}
	#paotui-scene .popup-goods-weight .popup-content{
		padding: 0px 15px;
	}
	#paotui-scene .popup-goods-weight .weight-label{
		font-size: 16px;
		text-align: center;
		margin: 20px auto;
	}
	#paotui-scene .popup-goods-weight .weight-value{
		font-size:24px;
		color:#fbb000;
		text-align: center;
		margin: 20px auto;
	}
	#paotui-scene .popup-goods-weight .slider{
		width: 70%;
		margin: 20px auto 60px;
	}
	#paotui-scene .popup-goods-weight .slider .van-slider__bar{
		background-color: #ff2d4b;
	}
	#paotui-scene .popup-goods-weight .slider .slide-line-bottom{
		position: relative;
		font-size: 12px;
		color: #999;
	}
	#paotui-scene .popup-goods-weight .slider .slide-line-bottom .left{
		position: absolute;
		top: 12px;
		left: -30px;
	}
	#paotui-scene .popup-goods-weight .slider .slide-line-bottom .right{
		position: absolute;
		top: 12px;
		right: -25px;
	}
	/*小费弹出层*/
	#paotui-scene .popup-tip .slide-line-bottom .left{
		left: -10px!important;
	}
	#paotui-scene .popup-tip .slide-line-bottom .right{
		right: -10px!important;
	}
	/*费用明细弹出层*/
	#paotui-scene .popup-fee{
		bottom: 100px;
	}
	#paotui-scene .popup-fee .popup-content{
		max-height: 220px;
		overflow-y: auto;
	}
	#paotui-scene .popup-fee .popup-content::-webkit-scrollbar{
		display: none;
	}
	/*红包弹出层*/
	#paotui-scene .popup-redpacket{
		width: 100%;
		height: 400px;
		overflow: hidden;
	}
	#paotui-scene .popup-redpacket .popup-cancle{
		width: 100%;
		height:50px;
		text-align:center;
		line-height:50px;
		font-size:16px;
		color:#FF2D4B;
	}
	#paotui-scene .popup-redpacket .popup-container{
		width: 100%;
		height: 300px;
		overflow-y: auto;
		background: #f5f5f5;
	}
	#paotui-scene .popup-redpacket .popup-container::-webkit-scrollbar{
		display: none;
	}
	#paotui-scene .redPacket-list.content-padded{
		margin: 10px;
	}
	#paotui-scene .redPacket-list .row{
		margin-left: -4%;
		overflow: hidden;
	}
	#paotui-scene .redPacket-list .text-right{
		text-align: right;
	}
	#paotui-scene .redPacket-list .redPacket-list-item{
		background: #fff;
		margin-bottom: 12px;
		overflow: hidden;
		position: relative;
	}
	#paotui-scene .redPacket-list .redPacket-list-item .selected-status{
		position: absolute;
		right: 0;
		bottom: 0;
		width: 40px;
	}
	#paotui-scene .redPacket-list .redPacket-list-item .redPacket-list-item-container{
		padding: 25px 16px;
	}
	#paotui-scene .redPacket-list .redPacket-list-item .redPacket-list-item-container.superredpacket-meal{
		border: 2px solid #ff2d4b;
	}
	#paotui-scene .redPacket-list .redPacket-info .col-50{
		width: 46%;
		margin-left: 4%;
		float: left;
	}
	#paotui-scene .redPacket-list .redPacket-info .col-50 .redPacket-title{
		color: #ff2d4b;
		margin: 0;
		font-size: 18px;
	}
	#paotui-scene .redPacket-list .redPacket-info .col-50 .price{
		color: #ff2d4b;
		position: relative;
		margin-top: -4px;
	}
	#paotui-scene .redPacket-list .redPacket-info .col-50 .price .price-num{
		font-size: 22px;
		line-height: 26px;
	}
	#paotui-scene .redPacket-list .redPacket-list-item .redPacket-list-item-container .redPacket-use-limit{
		margin-top: 10px;
		color: #666;
		font-size: 14px;
	}
	#paotui-scene .redPacket-list .row .col-60{
		width: 55.99999999999999%;
		margin-left: 4%;
		float: left;
		white-space:nowrap
	}
	#paotui-scene .redPacket-list .row .col-40{
		width: 36%;
		margin-left: 4%;
		float: left;
	}
	#paotui-scene .redPacket-list .row .col-40 .use-condition{
		margin: 0;
		font-size: 14px;
	}
	#paotui-scene .redPacket-list .redPacket-list-item .redPacket-list-item-container .other-limit{
		font-size: 12px;
		color: #999;
		border-top: 1px dashed #e0e0e0;
		padding-top: 4px;
	}
	#paotui-scene .redPacket-list .redPacket-list-item .circle{
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
	#paotui-scene .redPacket-list .redPacket-list-item .circle.superredpacket-meal{
		border: 2px solid #ff2d4b;
	}
	#paotui-scene .redPacket-list .redPacket-list-item .circle-left{
		left: -8px;
	}
	#paotui-scene .redPacket-list .redPacket-list-item .circle-right{
		right: -8px;
	}
	#paotui-scene .diy-uploadImg{
		width: 100%;
		padding-left: 15px;
		background-color: #fff;
	}
	#paotui-scene .diy-uploadImg .uploadImg-item{
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 10px 0;
		border-bottom: 1px solid #eaeaea;
	}
	#paotui-scene .diy-uploadImg .uploadImg-item:last-child{
		border-bottom: 0px;
	}
	#paotui-scene .diy-uploadImg .uploadImg-item .uploadImg-title{
		width: 25%;
		font-size: 14px;
		color: #333;
		line-height: 24px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	#paotui-scene .diy-uploadImg .uploadImg-item .uploadImg-right{
		display: flex;
		position: relative;
		align-items: center;
		justify-content: space-between;
		flex: 1;
		line-height: 24px;
	}
	#paotui-scene .diy-uploadImg .uploadImg-item .uploadImg-right .uploadImg-tips{
		font-size: 14px;
		color: #757575;
	}
	#paotui-scene .diy-uploadImg .uploadImg-item .uploadImg-right .icon-right{
		padding-right: 10px;
		font-size: 12px;
		color: #ccc;
	}
	#paotui-scene .diy-uploadImg .uploadImg-item .img-list{
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex: 1;
		padding-right: 10px;
	}
	#paotui-scene .diy-uploadImg .uploadImg-item .img-group{
		width: 33.33%;
		height: 81px;
	}
	#paotui-scene .diy-uploadImg .uploadImg-item .img-group .upload-img{
		position: relative;
		width: 100%;
		height: 100%;
		padding-right: 5px;
	}
	#paotui-scene .diy-uploadImg .uploadImg-item .img-group .upload-img img{
		width: 100%;
		height: 100%;
		border-radius: 3px;
		border: none;
	}
	#paotui-scene .diy-uploadImg .uploadImg-item .img-group .upload-img .del-img{
		position: absolute;
		top: -8px;
		right: 0;
		width: 20px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		background-color: #ff2d4b;
		color: #fff;
		border-radius: 20px;
	}
	#paotui-scene .diy-uploadImg .uploadImg-item .weui-uploader__input{
		display: block;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		opacity: 0;
	}
</style>


// WEBPACK FOOTER //
// src/pages/paotui/diy.vue