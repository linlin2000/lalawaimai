<template>
	<div id="order-address">
		<public-header title="修改收货信息">
			<div slot="right" class="font-16" @click="util.jsUrl('/pages/member/addressPost', {sid: order.sid, orderId: order.id})">新增地址</div>
		</public-header>
		<div class="content">
			<div class="header-remind flex">
				<div class="icon icon-notice font-18 c-gray"></div>
				<div class="padding-5-l c-gray">温馨提示: 当前订单仅能修改{{config.address_update_num}}次, 只支持将地址修改为距离原地址{{config.newaddress_distance}}km以内的地点</div>
			</div>
			<div class="address-now">
				<div class="icon icon-location font-18 c-gray"></div>
				<div class="padding-10-l">
					<div class="font-14 c-gray">当前下单地址</div>
					<div class="font-16 padding-10-t">{{order.address}}</div>
					<div class="font-14 c-gray padding-10-t flex">
						<div>{{order.username}}({{order.sex}})</div>
						<div class="padding-15-l">{{order.mobile}}</div>
					</div>
				</div>
			</div>
			<template v-if="addresses.available.length > 0">
				<div class="padding-10-tb padding-15-lr c-gray font-14">可更改地址</div>
				<div class="address-list">
					<div class="address-item flex van-hairline--top" @click.prevent.stop="onSelectAddress(index)" v-for="(item, index) in addresses.available" :key="item.id">
						<div class="address-icon">
							<i class="icon" :class="{'icon-check': index == selectIndex}"></i>
						</div>
						<div class="flex-lr address-info-group">
							<div class="address-info">
								<div class="font-14 ellipsis">{{item.address}}</div>
								<div class="font-14 c-gray padding-5-t">{{item.realname}}({{item.sex}})<span class="padding-15-l font-14 c-gray">{{item.mobile}}</span></div>
							</div>
							<div class="icon icon-edit" @click="util.jsUrl('/pages/member/addressPost', {id: item.id, sid: order.sid, orderId: order.id})"></div>
						</div>
					</div>
				</div>
			</template>
			<template v-if="addresses.dis_available.length > 0">
				<div class="padding-10-tb padding-15-lr c-gray font-14">超出可更改范围地址</div>
				<div class="address-list address-more">
					<div class="address-item flex van-hairline--top" v-for="(item, index) in addresses.dis_available" :key="item.id">
						<div class="address-icon"></div>
						<div class="flex-lr address-info-group">
							<div class="address-info">
								<div class="font-14 ellipsis c-gray flex">{{item.address}}</div>
								<div class="font-14 c-gray padding-5-t">{{item.realname}}({{item.sex}})<span class="padding-15-l font-14 c-gray">{{item.mobile}}</span></div>
							</div>
						</div>
					</div>
				</div>
			</template>
			<div class="address-btn " :class="{disabled: selectIndex < 0 || !islegal}" @click="onSubmit">确认修改</div>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		data() {
			return {
				order: {
					address: '',
					username: '',
					sex: '',
					mobile: ''
				},
				addresses: {
					available: [],
					dis_available: []
				},
				config: {},
				selectIndex: -1,
				islegal: false,
				showPreLoading: true
			}
		},
		components: {
			PublicHeader
		},
		methods: {
			onLoad() {
				var that =  this;
				getData({
					vue: that,
					url: 'wmall/order/index/update_address',
					data: {
						id: that.id,
					},
					success: (res) => {
						that.order = that.util.extend(that.order, res.order);
						if(res.addresses && res.addresses.available && res.addresses.available.length > 0) {
							that.addresses.available = [...res.addresses.available];
						}
						if(res.addresses && res.addresses.dis_available && res.addresses.dis_available.length > 0) {
							that.addresses.dis_available = [...res.addresses.dis_available];
						}
						that.config = that.util.extend(that.config, res.config);
						that.islegal = true;
					}
				})
			},
			onSelectAddress(index) {
				var that = this;
				if(index == that.selectIndex) {
					return;
				} else {
					that.selectIndex = index;
				}
			},
			onSubmit() {
				var that = this;
				var selectIndex = that.selectIndex;
				if(selectIndex < 0 || !that.addresses.available[selectIndex] || !that.islegal) {
					return;
				}
				that.islegal = false;
				setData({
					vue: that,
					url: 'wmall/order/index/update_address',
					confirm: '确认修改该订单的收货地址吗',
					data: {
						id: that.id,
						address_id: that.addresses.available[selectIndex]['id']
					},
					success: (res) => {
						that.util.$toast(res, that.util.getUrl({path: '/pages/order/detail', query: {id: that.id}}), 1500, 'replace')
					},
					fail: (res) => {
						that.util.$toast(res);
						that.islegal = true;
					},
					cancel: () => {
						that.islegal = true;
					}
				})

			}
		},
		mounted () {
			var that = this;
			var query = that.util.parseQuery(that.$route.query);
			that.id = query.id;
			that.onLoad()
		}
	}
</script>

<style>
	#order-address .header-remind{
		font-size: 14px;
		line-height: 18px;
		padding: 10px 15px;
		background-color: #FFF6E6;
	}
	#order-address .address-now{
		display: flex;
		padding: 10px 15px;
		margin: 10px 15px 5px 15px;
		background-color: #fff;
	}
	#order-address .address-title{
		padding: 10px 15px;
		font-weight: bold;
	}
	#order-address .address-list{
		background-color: #fff;
	}
	#order-address .address-list .address-item{
		margin-left: 15px;
		padding: 10px 15px 10px 0;
	}
	#order-address .address-list .address-item:last-child{
		border: 0px;
	}
	#order-address .address-list .address-item .address-icon{
		width: 10%;
	}
	#order-address .address-list .address-item .icon{
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 1px solid #ccc;
		text-align: center;
		line-height: 18px;
	}
	#order-address .address-list .address-item .icon.icon-check{
		color: #fff;
		background-color: #ff2d4b;
		border-color: #ff2d4b;
	}
	#order-address .address-list .address-item .address-info-group{
		width: 90%;
	}
	#order-address .address-list .address-item .address-info{
		width: 90%;
	}
	#order-address .address-list .address-item .address-info .tag{
		margin: 0 0 0 20px;
		padding: 2px 10px;
		color: #fff;
		background-color: #ff2d4b;
	}
	#order-address .address-list .address-item .address-info-group .icon-edit{
		text-align: right;
		font-size: 20px;
		color: #333;
		border: none;
		margin: 0;
	}
	#order-address .address-list.address-more .address-item:last-child{
		margin-bottom: 50px;
	}
	#order-address .address-btn{
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 50px;
		line-height: 50px;
		background: #ff2d4b;
		text-align: center;
		color: #fff;
	}
	#order-address .address-btn.disabled{
		background-color: #999;
	}
</style>


// WEBPACK FOOTER //
// src/pages/order/address.vue