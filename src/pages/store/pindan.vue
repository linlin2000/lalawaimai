<template>
	<div id="store-pindan">
		<public-header title="拼单"></public-header>
		<div class="content">
			<template v-if="extra.is_founder == 1 && pindan.mine.pindan_status == 2">
				<div class="lock">
					<div class="lock-inner w-100 text-center">
						<div class="tip font-15">锁定状态，手动解锁后可继续拼单</div>
						<van-button size="normal" block class="bg-danger font-16 deblock" @click="onContinue">解锁</van-button>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="content-inner">
					<van-pull-refresh v-model="isRefresh" @refresh="onPullDownRefresh">
					<!--商家信息-->
					<div class="store bg-default span-center padding-15">
						<img :src="store.logo" />
						<div class="name ellipsis">{{store.title}}</div>
						<template v-if="pindan.pindan_status == 1">
							<van-button size="normal" block class="bg-danger font-16" v-if="extra.is_founder == 1" @click="onChangeZhezhao">邀请好友</van-button>
							<van-button size="normal" block class="bg-danger font-16" v-if="extra.not_takepart == 1" @click="onTakePindan">参与拼单</van-button>
						</template>
						<template v-else-if="pindan.pindan_status == 2">
							<div class="tip font-15">正在提交拼单中...</div>
						</template>
						<template v-else-if="pindan.pindan_status == 3">
							<div class="tip font-15">拼单订单已提交成功</div>
						</template>
					</div>
					<template v-if="pindan.mine">
						<div class="font-14 c-gray margin-10">拼单列表</div>
						<div class="order-info bg-default padding-10-l">
							<div class="user flex-lr padding-10-t" v-if="pindan.mine.member">
								<div class="left flex">
									<img class="avatar" :src="pindan.mine.member.avatar">
								</div>
								<div class="right flex-lr van-hairline--bottom">
									<div class="nickname">
										<span class="ellipsis">{{pindan.mine.member.nickname}}</span>
										<span class="label label-mine" >我</span>
										<span class="label label-start" v-if="pindan.mine.id == pindan.pindan_id">发起</span>
									</div>
									<div class="btn-group flex" v-if="pindan.pindan_status == 1">
										<div class="btn-item edit-btn" @click="onEditGoods">编辑商品</div>
										<div class="btn-item cancle-btn" @click="onGiveUp(pindan.mine.id)">不拼了</div>
									</div>
								</div>
							</div>
							<div class="goods flex-lr" v-if="pindan.mine.data">
								<div class="left"></div>
								<div class="right">
									<template v-for="item in pindan.mine.data">
										<div class="goods-item" v-for="option in item" :key="option.id">
											<div class="goods-title ellipsis">{{option.title}}</div>
											<div class="goods-num">x{{option.num}}</div>
											<div class="goods-price c-danger">¥{{option.total_discount_price}}</div>
										</div>
									</template>
									<div class="goods-item" v-if="pindan.mine.box_price > 0">
										<div class="goods-title ellipsis">餐盒费</div>
										<div class="goods-num"></div>
										<div class="goods-price c-danger">¥{{pindan.mine.box_price}}</div>
									</div>
								</div>
							</div>
						</div>
					</template>
					<template v-if="pindan.other && pindan.other.length > 0">
						<div class="font-14 c-gray margin-10">其他拼友</div>
						<div class="order-info bg-default padding-10-l margin-10-b" v-for="cart in pindan.other" :key="cart.id">
							<div class="user flex-lr padding-10-t">
								<div class="left flex">
									<img class="avatar" :src="cart.member.avatar">
								</div>
								<div class="right flex-lr van-hairline--bottom">
									<div class="nickname">
										<span class="ellipsis">{{cart.member.nickname}}</span>
										<span class="label label-start" v-if="cart.id == pindan.pindan_id">发起</span>
									</div>
									<i class="icon icon-delete margin-10-r font-18 c-gray" @click="onGiveUp(cart.id)" v-if="extra.is_founder"></i>
								</div>
							</div>
							<div class="goods flex-lr">
								<div class="left"></div>
								<div class="right">
									<template v-for="item in cart.data">
										<div class="goods-item" v-for="option in item" :key="option.id">
											<div class="goods-title ellipsis">{{option.title}}</div>
											<div class="goods-num">x{{option.num}}</div>
											<div class="goods-price c-danger">¥{{option.total_discount_price}}</div>
										</div>
									</template>
									<div class="goods-item" v-if="cart.box_price > 0">
										<div class="goods-title ellipsis">{{store.cn.box_price}}</div>
										<div class="goods-num"></div>
										<div class="goods-price c-danger">¥{{cart.box_price}}</div>
									</div>
								</div>
							</div>
						</div>
					</template>
					<van-cell-group class="margin-10-t">
						<van-cell :title="store.cn.pack_fee" v-if="store.pack_price > 0">
							<span slot="right-icon">
								 <span class="c-danger">¥{{store.pack_price}}</span>
							</span>
						</van-cell>
						<van-cell title="配送费">
							<span slot="right-icon">
								另需配送费 <span class="c-danger">¥{{store.delivery_price}}</span>
							</span>
						</van-cell>
						<van-cell title="总计">
							<span slot="right-icon" class="c-danger">
								¥{{pindan.total_cart_price}}
							</span>
						</van-cell>
					</van-cell-group>
					</van-pull-refresh>
				</div>
				<div class="cart flex-lr" v-if="extra.is_founder == 1">
					<div class="takepart-tips" v-if="pindan.takepart_num > 1">
						您的<span class="c-danger">{{pindan.takepart_num - 1}}</span>位拼友已完成拼单
					</div>
					<div class='cart-tips'>
						<div class="total font-bold">¥{{pindan.total_cart_price}}</div>
						<div class="delivery-fee">另需配送费¥{{store.delivery_price}}</div>
					</div>
					<template v-if="pindan.num > 0">
						<div class="cart-btn disabled" v-if="cartSendCondition > 0">差¥{{cartSendCondition}}起送</div>
						<div class='cart-btn ' :class="{disabled: 0}" v-if="cartSendCondition <= 0" @click="onSubmit">去结算</div>
					</template>
					<template v-else>
						<div class="cart-btn disabled">未选择商品</div>
					</template>
				</div>
			</template>
		</div>
		<div class="share-zhezhao" @click="onChangeZhezhao()" v-if="zhezhaoShow">
			<img src="static/img/share-layer.png" alt="">
		</div>
		<imessage v-if="message.type" :message = message></imessage>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import imessage from '@/components/imessage'
	import { Dialog } from 'vant';
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
			Dialog,
			imessage
		},
		data() {
			return {
				showPreLoading: true,
				isRefresh: false,
				zhezhaoShow: false,
				message: {
					type: '',
					message: '',
					description: '',
					redirect: '',
					btnText: '',
				},
				pindan: {
					mine: {},
				},
				store: {
					cn: {}
				},
				extra: {},
				goback: true
			}
		},
		computed: {
			cartSendCondition: function (){
				return (this.store.send_price - this.pindan.total_cart_price).toFixed(2);
			}
		},
		methods: {
			onPullDownRefresh() {
				this.onLoad();
			},
			onChangeZhezhao() {
				this.zhezhaoShow = !this.zhezhaoShow;
			},
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'wmall/store/goods/pindan',
					data: {
						sid: that.sid,
						pindan_id: that.pindan_id
					},
					success: function(res) {
						that.pindan = res.pindan;
						that.store = res.store;
						that.extra = res.extra;
						that.isRefresh = false;
						that.pindan_id = that.pindan.pindan_id;
						if(that.extra.is_founder == 1) {
							// 按需使用：A→B→C就需要页面一进来的时候，就添加一个历史记录
							window.history.pushState(null, null, document.URL);
							// 给window添加一个popstate事件，拦截返回键，执行this.onBrowserBack事件，addEventListener需要指向一个方法
							window.addEventListener("popstate", that.onBrowserBack, false);
							//window.removeEventListener("popstate", that.onBrowserBack, false);
						}
					},
					fail: function(res) {
						if(res.errno == -1000) {
							that.util.$toast(res.message, '', 1000);
							that.pindan_id = 0;
							that.onLoad();
						} else if(res.errno == -1001) {
							that.message = {
								type: 'info',
								message: res.message,
								redirect: that.util.getUrl({path: '/pages/home/index'}),
								btnText: '自己点菜',
							} 
						} else {
							that.util.$toast(res.message, '', 1000);
						}
					}
				})
			},
			onEditGoods() {
				var that = this;
				that.$router.replace(that.util.getUrl({path: 'pages/store/goods', query: {sid: that.store.id, pindan_id: that.pindan_id}}))
			},
			onGiveUp(cart_id) {
				var that = this;
				var confirm = '确定不要继续拼单了吗？';
				if(that.extra.is_founder == 1) {
					confirm = '删除后不可恢复，确认删除吗？';
				}
				setData({
					vue: that,
					confirm: confirm,
					url: 'wmall/store/goods/giveupPindan',
					data: {
						sid: that.sid,
						cart_id: cart_id
					},
					success: function(res) {
						that.pindan = res.pindan;
						that.extra.not_takepart = res.extra.not_takepart;
						that.util.$toast('取消拼单成功', that.util.getUrl({path: 'pages/store/goods', query: {sid: that.sid}}), 1000, 'replace');
					},
					fail: function(res) {
						if(res.errno == -1000) {
							//that.$router.go(-1);

							//that.$router.replace({path: '/pages/store/goods', query: {sid: that.sid}});

							//that.util.$toast('取消拼单成功', that.util.getUrl({path: 'pages/store/goods', query: {sid: that.sid}}), 1000, 'replace');
							that.onGoBack();
						}
					}

				})
			},
			onContinue(cart_id) {
				var that = this;
				setData({
					vue: that,
					url: 'wmall/store/goods/continuePindan',
					data: {
						sid: that.sid
					},
					success: function(res) {
						that.onLoad();
					}
				})
			},
			onTakePindan() {
				var that = this;
				setData({
					vue: that,
					url: 'wmall/store/goods/takePartPindan',
					data: {
						sid: that.sid,
						pindan_id: that.pindan_id
					},
					success: function(res) {
						that.$router.replace(that.util.getUrl({'path': '/pages/store/goods', query: {sid: that.sid, pindan_id: that.pindan_id}}));
					},
					fail: function(res) {
						that.util.$toast(res.message, '', 1000);
						that.pindan_id = 0;
						that.onLoad();
					}
				})
			},
			onSubmit() {
				Dialog.confirm({
					title: '温馨提示',
					message: '去结算后其他用户不可加入，确定去结算吗？'
				}).then(() => {
					this.$router.push(this.util.getUrl({'path': '/pages/order/create', query: {sid: this.store.id, is_pindan: 1, pindan_id: this.pindan.pindan_id}}));
				})
			},
			onGoBack() {
				var that = this;
				if(window.history.length < 2) {
					that.$router.replace(that.util.getUrl({path: '/pages/store/goods', query: {sid: that.sid}}));
				} else {
					that.goback = false;
					that.$router.back();
				}
			},
			onBrowserBack() {
				var that = this;
				if(!that.goback) {
					that.onGoBack();
					return false;
				}
				this.goback = false;
				Dialog.confirm({
					title: '你确定退出拼单吗',
					message: '退出拼单不会保留此次拼单内容'
				}).then(() => {
					if(that.extra.is_founder == 1) {
						setData({
							vue: that,
							url: 'wmall/store/goods/giveupPindan',
							data: {
								sid: that.sid,
								cart_id: that.pindan_id
							},
							fail: function(res) {
								if(res.errno == -1000) {
									//that.$router.replace({path: '/pages/store/goods', query: {sid: that.sid}});
									//that.$router.push(that.util.getUrl({'path': '/pages/store/goods', query: {sid: that.sid}}));
									that.onGoBack();
								}
							}

						})
					}
				}).catch(() => {
					this.goback = true;
					window.history.pushState(null, null, document.URL);
				})
			}
		},
		created() {
			if(this.$route.query && this.$route.query.sid > 0) {
				this.sid = this.$route.query.sid;
				this.pindan_id = 0;
				if(this.$route.query.pindan_id > 0) {
					this.pindan_id = this.$route.query.pindan_id;
				}
			}
		},
		mounted() {
			this.onLoad();
		},
		beforeDestroy() {
			window.removeEventListener("popstate", this.onBrowserBack, false);
			return false;
		}
	}
</script>

<style>
	#store-pindan .content .content-inner{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0px;
		right: 0;
		
		overflow-y: scroll;
		-webkit-overflow-scrolling: touch;
		background-color: #f5f5f5;
		padding-bottom: 82px;
	}
	#store-pindan .content .cart{
		position: absolute;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 50px;
		background-color: #313131;
	}
	#store-pindan .content .cart .takepart-tips{
		position: absolute;
		top: -32px;
		right: 0;
		left: 0;
		height: 32px;
		line-height: 32px;
		text-align: center;
		background-color: #fff7cc;
		font-size: 12px;
	}
	#store-pindan .content .cart .cart-tips{
		height: 50px;
		flex: 1;
		color: #fff;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: center;
		padding-left: 15px;
	}
	#store-pindan .content .cart .cart-tips .delivery-fee{
		font-size: 12px;
		color: #747474;
		margin-top: 3px;
	}
	#store-pindan .content .cart  .cart-btn{
		width: 110px;
		height: 50px;
		background-color: #ff2d4b;
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: bold;
	}
	#store-pindan .content .cart .cart-btn.disabled{
		background-color: #313131!important;
		color: #999;
	}
	/*商户信息*/
	#store-pindan .store{
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
	}
	#store-pindan .store img{
		width: 55px;
		height: 55px;
		border-radius: 100%;
	}
	#store-pindan .store .name{
		max-height: 90%;
		margin: 0 auto;
		font-size: 15px;
		font-weight: 600;
		margin: 10px 0;
	}
	#store-pindan .store .join{
		height: 45px;
		line-height: 45px;
		background: #ff2d4b;
		color: #fff;
		border-radius: 2px;
		margin: 10px 0 10px 0;
		font-size: 16px;
	}

	/*成员信息*/
	#store-pindan .order-info .left{
		width: 11%;
	}
	#store-pindan .order-info .right{
		width: 86%;
	}
	#store-pindan .order-info .user .right{
		min-height: 45px;
	}
	#store-pindan .order-info .user .avatar{
		width: 100%;
		border-radius: 100%;
		border: 1px solid #eee;
	}
	#store-pindan .order-info .user .nickname{
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #000;
		width: 55%;
	}
	#store-pindan .order-info .user .nickname span:first-child{
		display: inline-block;
		font-weight: 600;
		max-width: 60%;
	}
	#store-pindan .order-info .btn-group .btn-item{
		border-radius: 2px;
		font-size: 11px;
		padding: 2px 5px;
		margin-right: 10px;
	}
	#store-pindan .order-info .btn-group .btn-item.edit-btn{
		border: 1px solid #F4BC5D;
		color: #E2BC59;
	}
	#store-pindan .order-info .btn-group .btn-item.cancle-btn{
		border: 1px solid #BCBCBC;
		color: #AEAEAE;
	}
	#store-pindan .order-info .goods .goods-item{
		width: 100%;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		color: #717171;
		font-size: 14px;
		margin: 10px 0;
	}
	#store-pindan .order-info .goods .goods-item .goods-title{
		width: 70%;
		padding-right: 20px;
		box-sizing: border-box;
	}
	#store-pindan .order-info .goods .goods-item .goods-num{
		width: 10%;
	}
	#store-pindan .order-info .goods .goods-item .goods-price{
		width: 20%;
		box-sizing: border-box;
		padding-right: 10px;
		text-align: right;
	}
	/*用户昵称标签*/
	#store-pindan .order-info .label{
		height: 14px;
		line-height: 14px;
		font-size: 9px;
		border-radius: 2px;
		padding: 0px 4px;
		margin-left: 5px;
	}
	#store-pindan .order-info .label.label-mine{
		color: #F8D594;
		border: 1px solid #F8D594;
	}
	#store-pindan .order-info .label.label-start{
		color: #4987DC;
		border: 1px solid #4987DC;
	}

	/*锁定状态*/
	#store-pindan .content .lock{
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#store-pindan .content .deblock{
		width: 80%;
		margin: 10px auto 0;
	}

</style>


// WEBPACK FOOTER //
// src/pages/store/pindan.vue