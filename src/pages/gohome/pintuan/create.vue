<template>
	<div id="pintuan-order-create">
		<public-header title="确认订单"></public-header>
		<div class="content ">
			<div class="content-scroll">
				<div class="delivery-info margin-10-b bg-default radius-3">
					<ul class="delivery-mode" v-if="0">
						<li class="delivery active" v-if="detail.usetype == 2">快递配送</li>
						<li class="self " v-if="detail.usetype == 1">到店核销</li>
					</ul>
					<div class="padding-15-lr">
						<div class="padding-15-tb flex-lr" v-if="0 && detail.usetype == 2">
							<div class="flex" v-if="order.address">
								<i class="icon icon-locationfill font-20"></i>
								<ul class=" padding-10-l" :to="util.getUrl({path: '/pages/member/address', query: {channel: 'pintuan', pintuan_id: id, team_id: team_id, sid: detail.sid}})">
									<li class="font-14">{{order.address.address ? order.address.address : '选择收货地址'}}</li>
									<li class="c-gray font-12 margin-5-t">{{order.address.realname}} {{order.address.mobile}}</li>
								</ul>
							</div>
							<van-icon name="arrow" class="c-gray margin-10-l"></van-icon>
						</div>
						<div class="padding-15-tb flex-lr" v-else-if="1">
							<div class="flex" v-if="order.store">
								<i class="icon icon-locationfill font-20" @click="util.jsLocation({lat: order.store.location_x, lng: order.store.location_y, address: order.store.address})"></i>
								<ul class=" padding-10-l">
									<li class="font-14">{{order.store.address}}</li>
									<li class="c-gray font-12 margin-5-t" @click="util.jsTel(order.store.telephone)">{{order.store.telephone}}</li>
								</ul>
							</div>
							<van-icon name="arrow" class="c-gray margin-10-l"></van-icon>
						</div>
						<div class="flex-lr van-hairline--top">
							<ul class="username-mobile flex-lr font-13 padding-15-tb">
								<li class="van-hairline--right">
									<div class="margin-10-b">姓名</div>
									<input v-model="order.username" class="w-100" type="text" placeholder="请输入自提人姓名">
								</li>
								<li class="padding-10-l">
									<div class="margin-10-b">手机号</div>
									<input class="w-100" v-model="order.mobile" type="text" placeholder="请输入预留手机号">
								</li>
							</ul>
						</div>
						<div class="padding-15-tb flex-lr van-hairline--top" v-if="0">
							<div class="flex">
								<i class="icon icon-timefill font-18"></i>
								<span class="padding-10-l font-14">立即送出</span>
							</div>
							<div class="flex">
								<span class="font-14 c-info">预计16:30送达</span>
								<van-icon name="arrow" class="c-gray"></van-icon>
							</div>
						</div>
					</div>
				</div>
				<div class="order-info">
					<div class="flex" v-if="order.store">
						<i class="icon icon-store font-18"></i>
						<span class="font-14 margin-10-l font-500">{{order.store.title}}</span>
					</div>
					<div class="padding-15-tb goods flex-lr van-hairline--bottom">
						<div class="thumb">
							<img class="img-100" :src="detail.thumb" alt="">
						</div>
						<div class="info">
							<p>{{detail.name}}</p>
							<div class="flex">
								<div class="c-danger font-16 font-bold">¥{{is_team ? detail.price : detail.aloneprice}}</div>
								<div class="c-gray font-12 line-through margin-5-l">¥{{detail.oldprice}}</div>
							</div>
						</div>
					</div>
					<div class="van-hairline--bottom padding-15-b font-13" v-if="detail.buylimit == 1">
						<div class="margin-15-t flex-lr">
							<span>数量</span>
							<span>{{order.goods_num}}</span>
						</div>
						<div class="margin-15-t flex-lr">
							<span>总价</span>
							<span class="c-danger">¥{{order.goods_price}}</span>
						</div>
					</div>
					<div class="van-hairline--bottom padding-15-b font-13" v-else>
						<div class="margin-15-t flex-lr">
							<span>数量</span>
							<van-stepper v-model="order.goods_num" integer :min="1" @change="onCalculate()"/>
						</div>
						<div class="margin-15-t flex-lr">
							<span>总价</span>
							<span class="c-danger">¥{{order.goods_price}}</span>
						</div>
					</div>
					<template v-if="0">
						<div class="van-hairline--bottom padding-15-b font-13">
							<div class="margin-15-t flex-lr">
								<span>包装费</span>
								<span>¥2</span>
							</div>
							<div class="margin-15-t flex-lr">
								<span>配送费</span>
								<span>¥2</span>
							</div>
						</div>
						<div class="padding-15-tb flex-lr van-hairline--bottom font-13">
							<div class="c-danger">新客立减</div>
							<div class="c-danger">-¥2</div>
						</div>
						<div class="padding-15-b van-hairline--bottom font-13">
							<div class="margin-15-t flex-lr">
								<span>代金券</span>
								<div class="flex">
									<span class="c-gray">暂无可用代金券</span>
									<van-icon name="arrow" class="c-gray"></van-icon>
								</div>
							</div>
							<div class="margin-15-t flex-lr">
								<span>红包</span>
								<div class="flex">
									<span class="c-danger">通用红包3元</span>
									<van-icon name="arrow" class="c-gray"></van-icon>
								</div>
							</div>
						</div>
					</template>
					<div class="padding-15-t total-price">
						<div>
							已优惠 <span class="c-danger">¥{{order.discount}}</span>
						</div>
						<div class="margin-15-l">
							<span>小计</span> <span class="c-danger font-16 font-500">¥{{order.final_fee}}</span>
						</div>
					</div>
				</div>
				<van-field
					v-model="order.remark"
					label="备注"
					type="textarea"
					placeholder="请输入备注"
					rows="2"
					class="margin-10-t"
				/>
			</div>
		</div>
		<van-submit-bar :price="order.final_fee * 100" label="待支付" button-text="提交订单" @submit="onSubmit">
			<div slot="default" class="order-benefit">
				已优惠 ¥{{order.discount}}
			</div>
			<span slot="tip" v-if="0">
				<span>提示：</span>
			</span>
		</van-submit-bar>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import {mapState, mapMutations} from 'vuex'
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
		},
		data() {
			return {
				team_id: 0,
				showPreLoading: true,
				detail: {},
				order: {
					remark: '',
				},
			}
		},
		computed: {
			...mapState([
				'pinTuanExtra'
			]),
		},
		methods: {
			...mapMutations([
				'setState'
			]),
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'pintuan/create/index',
					data: {
						id: that.id,
						team_id: that.team_id,
						is_team: that.is_team,
						extra: that.pinTuanExtra
					},
					success: function(res) {
						that.detail = res.goods;
						that.order = res.order;
						if(that.order.goods_num < that.pinTuanExtra.goods_num) {
							that.util.$toast('本次活动限购' + that.order.goods_num + that.detail.unit, '', 1000);
						}
					},
					fail: function(res) {
						if(res.errno == -1001) {
							var record = res.message;
							that.util.$toast('您已参加该活动,请等待本次团购结束后在进行开团', that.util.getUrl({path: '/gohome/pages/pintuan/share', query: {id: record.goods_id, team_id: record.team_id}}), 1000, 'replace');
						} else if(res.errno == -1000) {
							that.$router.push(that.util.getUrl({path: '/gohome/pages/pintuan/detail', query: {id: that.id}}));
						} else {
							that.util.$toast(res.message, that.util.getUrl({path: '/gohome/pages/pintuan/index'}), 1000, 'replace');
						}

					}
				})
			},

			onCalculate() {
				this.pinTuanExtra.goods_num = this.order.goods_num;
				if(this.detail.total > 0 && this.order.goods_num >= this.detail.total) {
					this.pinTuanExtra.goods_num = this.order.goods_num = this.detail.total;
					this.util.$toast('商品库存不足', '', 1000);
					return;
				}
				this.onLoad();
			},

			onSubmit() {
				var that = this;
				if(!that.order.mobile) {
					that.util.$toast('请输入预留手机号');
					return;
				}
				if(!that.util.isValidMobile(that.order.mobile)) {
					that.util.$toast('手机号格式错误');
					return;
				}
				that.pinTuanExtra.username = that.order.username;
				that.pinTuanExtra.mobile = that.order.mobile;
				that.pinTuanExtra.remark = that.order.remark;
				that.pinTuanExtra.is_team = that.is_team;
				setData({
					vue: that,
					url: 'pintuan/create/create',
					data: {
						id: that.id,
						team_id: that.team_id,
						extra: JSON.stringify(that.pinTuanExtra) 
					},
					success: (res) => {
						that.pinTuanExtra = {};
						var team_id = 0;
						if(that.is_team == 1) {
							team_id = that.team_id > 0 ? that.team_id : res;
						}
						that.util.$toast('下单成功', that.util.getUrl({path: '/pages/public/pay', query: {order_id: res, order_type: 'gohome', extra:{order_type: 'pintuan', goods_id: that.id, is_team: that.is_team, team_id: team_id}}}), 1000, 'replace');
					}
				});
			}
		},
		created() {
			this.uid = 0;
			this.query = this.$route.query;
			if(this.query) {
				this.is_team = 0;
				if(this.query.team_id > 0) {
					this.team_id = this.query.team_id
					this.is_team = 1
				}
				if(this.query.id > 0) {
					this.id = this.query.id
				}
				if(this.query.is_team == 1) {
					this.is_team = this.query.is_team
				}
			}
		},
		mounted(){
			this.onLoad();
		}
	}
</script>

<style>

	#pintuan-order-create .content{
		width: 100%;
		box-sizing: border-box;
		padding: 10px;
		bottom: 50px;
		overflow: hidden;
		background-color: #f5f5f5;
	}
	#pintuan-order-create .content .content-scroll{
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow-y: auto;
		overflow-x: hidden;
	}
	#pintuan-order-create .content .content-scroll::-webkit-scrollbar {
		display: none;
	}
	#pintuan-order-create .username-mobile li{
		width: 49.9%;
	}
	#pintuan-order-create .order-benefit{
		height: 50px;
		line-height: 50px;
		font-size: 14px;
		padding-left: 15px;
	}
	#pintuan-order-create .order-info{
		background-color: #fff;
		padding: 15px;
		border-radius: 3px;
		font-size: 14px;
	}
	#pintuan-order-create .order-info .goods .thumb{
		width: 60px;
		height: 60px;
		border-radius: 3px;
		overflow: hidden;
		font-size: 0px;
	}
	#pintuan-order-create .order-info .goods .info{
		height: 60px;
		font-size: 14px;
		flex: 1;
		padding-left: 10px;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
	}
	#pintuan-order-create .order-info .van-stepper .van-stepper__minus, #pintuan-order-create .order-info .van-stepper .van-stepper__plus{
		width: 24px;
		height: 20px;
	}
	#pintuan-order-create .order-info .van-stepper .van-stepper__input{
		height: 16px;
		width: 24px;
	}
	#pintuan-order-create .order-info .total-price{
		display: flex;
		align-items: flex-end;
		justify-content: flex-end;
	}
	#pintuan-order-create .delivery-mode{
		background-color: #f5f5f5;
		display: flex;
		flex-flow: row nowrap;
		align-items: flex-end;
		justify-content: center;
	}
	#pintuan-order-create .delivery-mode li{
		width: 50%;
		padding: 12px 0;
		text-align: center;
		position: relative;
		font-size: 15px;
		background-color: #eee;
	}
	#pintuan-order-create .delivery-mode .delivery.active{
		background-color: #fff;
		color: #ff2d4b;
		padding: 18px 0 12px 0;
	}
	#pintuan-order-create .delivery-mode .delivery.active:after{
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
	#pintuan-order-create .delivery-mode .self.active{
		background-color: #fff;
		color: #ff2d4b;
		padding: 18px 0 12px 0;
	}
	#pintuan-order-create .delivery-mode .self.active:after{
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
</style>


// WEBPACK FOOTER //
// src/pages/gohome/pintuan/create.vue