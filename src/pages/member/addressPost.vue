<template>
	<div id="address-post">
		<public-header title="编辑地址"></public-header>
		<div class="content">
			<div class="list">
				<div class="list-item flex-lr van-hairline--bottom" v-if="!address_type">
					<div class="item-title ellipsis">小区/大厦/学校</div>
					<div class="item-input flex-lr">
						<i class="icon icon-location"></i>
						<div class="location">
							<div class="flex-lr" @click="util.jsUrl('/pages/member/addressLocation', {id: id, sid: sid, channel: channel, erranderId: erranderId, input: input, orderId: orderId}, 'replace')">
								<div v-if="address.address" style="color: #333">{{address.address}}</div>
								<span v-else>点击添加地址(必填)</span>
								<i class="icon icon-right"></i>
							</div>
						</div>
					</div>
				</div>
				<div class="list-item flex-lr van-hairline--bottom" v-else-if="address_type == 1">
					<div class="item-title ellipsis">选择地址</div>
					<div class="item-input flex-lr">
						<div class="w-100 font-15">
							<div class="flex-lr" @click="onToggleAddressPopupStatus">
								<div v-if="address.address" style="color: #333">{{address.address}}</div>
								<span class="c-gray" v-else>点击选择地址(必填)</span>
								<i class="icon icon-right c-gray"></i>
							</div>
						</div>
					</div>
				</div>
				<div class="list-item flex-lr van-hairline--bottom">
					<div class="item-title ellipsis">楼号-门牌号</div>
					<div class="item-input ">
						<input name='number' v-model="address.number" type="text" class="" placeholder="例:16号楼427室">
					</div>
				</div>
				<div class="list-item flex-lr van-hairline--bottom">
					<div class="item-title ellipsis ">联系人</div>
					<div class="item-input">
						<div class="username van-hairline--bottom">
							<input type="text" name='realname' v-model="address.realname" placeholder="您的姓名">
						</div>
						<div class="sex flex">
							<div class="sex-item flex" @click="onSelectSex('先生')">
								<i class="icon" :class="{'icon-check': sexName == '先生'}"></i>先生
							</div>
							<div class="sex-item flex" @click="onSelectSex('女士')">
								<i class="icon" :class="{'icon-check': sexName == '女士'}"></i>女士
							</div>
						</div>
					</div>
				</div>
				<div class="list-item flex-lr van-hairline--bottom">
					<div class="item-title ellipsis">手机号</div>
					<div class="item-input ">
						<input type="text" name='mobile' v-model="address.mobile" class="" placeholder="请填写收货手机号码">
					</div>
				</div>
			</div>
			<div class="save-btn" @click="onSubmit">
				<van-button type="danger" size="normal" :block="true">保存</van-button>
			</div>
			<div class="save-btn" v-if="address && address.id > 0" @click="onDel">
				<van-button type="default" size="normal" :block="true">删除</van-button>
			</div>
		</div>
		<van-popup v-model="addressPopupStatus" position="bottom">
			<van-picker
				show-toolbar
				title="选择地址"
				value-key="title"
				:columns="columns"
				@cancel="onToggleAddressPopupStatus"
				@confirm="onConfirmAddress"
				@change="onChangePicker"
			/>
		</van-popup>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import { mapState, mapMutations } from "vuex"
	import PublicHeader from '@/components/header'
	import Uploader from '@/components/uploader'

	export default {
		data() {
			return {
				address: {
					address: ''
				},
				sexName: '先生',
				submiting: 0,
				value: [],

				address_type: 0,
				areas: [],
				columns: [
					{
						values: [],
						className: 'column1',
						defaultIndex: 0
					},
					{
						values: [],
						className: 'column2',
						defaultIndex: 0
					}
				],
				addressPopupStatus: false,
				showPreLoading: true
			}
		},
		components: {
			PublicHeader,
			Uploader
		},
		computed: {
			...mapState(['editAddress', 'erranderExtra'])
		},
		methods: {
			...mapMutations(['replaceAddress', 'setOrderExtra', 'setState']),
			onToggleAddressPopupStatus() {
				var that = this;
				that.addressPopupStatus = !that.addressPopupStatus;
			},

			onChangePicker(picker, values, index) {
				var that = this;
				if(index == 0) {
					if(values[0].child && values[0].child.length > 0) {
						picker.setColumnValues(1, values[0].child);
					} else {
						picker.setColumnValues(1, []);
					}
				}
			},

			onConfirmAddress(values, indexes) {
				var that = this;
				that.address.address = values[0].title + values[1].title;
				that.address.location_x = values[1].location_x;
				that.address.location_y = values[1].location_y;
				that.address.area_id = values[1].id;
				that.address.area_parentid = values[0].id;
				that.onToggleAddressPopupStatus();
			},

			onLoad() {
				var that = this;
				this.util.request({
					url: 'wmall/member/address/post',
					data: {
						sid: this.sid,
						id: this.id
					},
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
					}
					this.address = result.message;
					if(this.from == 'location' && this.editAddress.address && this.editAddress.lat && this.editAddress.lng) {
						this.address = Object.assign(this.address, this.editAddress);
						//this.replaceAddress({});
					}
					this.sexName = !this.address.sex ? this.sexName : this.address.sex;
					this.address_type = result.message.address_type;
					if(this.address_type == 1 && result.message.areas && result.message.areas.length > 0) {
						this.areas = [...result.message.areas];
						this.columns[0].values = [...this.areas];
						var area_parent_index = result.message.area_parent_index;
						this.columns[0].defaultIndex = area_parent_index
						if(this.areas[area_parent_index].child && this.areas[area_parent_index].child.length > 0) {
							this.columns[1].values = [...this.areas[area_parent_index].child]
							this.columns[1].defaultIndex = result.message.area_index;
						}
					}
					if(!this.id) {
						if(!this.editAddress.address && this.address_type != 1) {
							this.util.getLocation({
								successLocation: function(res) {
								},
								successAddress:  function(res) {
									that.address.address = res.address;
									that.address.location_x = res.location_x;
									that.address.location_y = res.location_y;
									that.address = Object.assign({}, that.address);
								},
								fail: function(res) {
								}
							});
						}
					}
					if(this.from == 'location') {
						this.replaceAddress({});
					}
				});

			},

			onSubmit() {
				if(this.submiting == 1) {
					return false;
				}
				if(!this.address.address) {
					this.$toast('收货地址不能为空');
					return false;
				}
/*
				if(!this.address.number) {
					this.$toast('门牌号不能为空');
					return false;
				}
*/
				if(!this.address.realname) {
					this.$toast('联系人不能为空');
					return false;
				}
				if(!this.address.mobile) {
					this.$toast('手机号不能为空');
					return false;
				}
				if(!this.util.isValidMobile(this.address.mobile)) {
					this.$toast('手机号格式错误');
					return false;
				}
				this.submiting = 1;
				var params = {
					id: this.id,
					sid: this.sid,
					order_id: this.orderId,
					channel: this.channel,
					flag: 1,
					sex: this.sexName,
					number: this.address.number,
					realname: this.address.realname,
					mobile: this.address.mobile,
					address:  this.address.address,
					location_x:  this.address.location_x || this.address.lat,
					location_y:  this.address.location_y || this.address.lng,
					area_id: this.address.area_id,
					area_parentid: this.address.area_parentid,
				};
				if(this.erranderExtra && this.erranderExtra.agentid) {
					params['agentid'] = this.erranderExtra.agentid;
				}
				this.util.request({
					url: 'wmall/member/address/post',
					data: params,
					method: 'POST',
				}).then((res) => {
					this.submiting = 0;
					let result = res.data.message;
					if(!this.channel || this.channel == '' || this.channel == 'undefined') {
						if(result.errno) {
							this.$toast(result.message);
							return false;
						}
						this.replaceAddress({});
						this.util.$toast('保存地址成功', this.util.getUrl({path: '/pages/member/address'}), 1500, 'replace');
						return;
					} else if(this.channel == 'takeout') {
						if(result.errno == -1000) {
							if(this.address_type == 1) {
								this.$dialog.confirm({
									title: '温馨提示',
									message: '亲，您的地址已超出商家的配送范围了，请更换商家下单',
									confirmButtonText: '更换商家',
									cancelButtonText: '调整地址',
								}).then(() => {
									this.$router.replace(this.util.getUrl({path: '/pages/home/index'}));
								}).catch(() => {});
							} else {
								this.$dialog.confirm({
									title: '温馨提示',
									message: result.message,
									confirmButtonText: '调整地址',
									cancelButtonText: '仍然保存',
								}).then(() => {
								}).catch(() => {
									params.force = 1;
									this.util.request({
										method: 'POST',
										url: "wmall/member/address/post",
										data: params,
									}).then((res) => {
										if(this.orderId && this.orderId > 0) {
											this.$router.replace(this.util.getUrl({path: '/pages/order/address', query: {id: this.orderId}}));
										} else {
											this.replaceAddress({});
											this.setOrderExtra({key: 'address_id', val: 0});
											this.$router.replace(this.util.getUrl({path: '/pages/order/create?sid=' + this.sid}));
										}
									});
								});
							}
						} else {
							if(result.errno) {
								this.$toast(result.message);
								return false;
							}
							if(this.orderId && this.orderId > 0) {
								this.$router.replace(this.util.getUrl({path: '/pages/order/address', query: {id: this.orderId}}));
							} else {
								this.setOrderExtra({key: 'address_id', val: result.message});
								this.$router.replace(this.util.getUrl({path: '/pages/order/create?sid=' + this.sid}));
							}
						}
					} else if(this.channel == 'errander') {
						if(result.errno == -1000) {
							this.$dialog.confirm({
								title: '温馨提示',
								message: '亲,您的地址已超出跑腿的服务范围了!',
								confirmButtonText: '调整地址',
								cancelButtonText: '仍然保存',
							}).then(() => {
							}).catch(() => {
								params.force = 1;
								this.util.request({
									method: 'POST',
									url: "wmall/member/address/post",
									data: params,
								}).then((res) => {
									this.replaceAddress({});
									if(this.input == 'accept') {
										this.setState({type: 'erranderExtra', key: 'acceptaddress_id', val: 0});
									} else if(this.input == 'buy') {
										this.setState({type: 'erranderExtra', key: 'buyaddress_id', val: 0});
									}
									this.$router.replace(this.util.getUrl({path: '/pages/paotui/diy', query:{id: this.erranderId}}));
								});
							});
						} else {
							if(result.errno) {
								this.$toast(result.message);
								return false;
							}
							if(this.input == 'accept') {
								this.setState({type: 'erranderExtra', key: 'acceptaddress_id', val: result.message});
							} else if(this.input == 'buy') {
								this.setState({type: 'erranderExtra', key: 'buyaddress_id', val: result.message});
							}
							this.$router.replace(this.util.getUrl({path: '/pages/paotui/diy', query:{id: this.erranderId}}));
							return false;
						}
					} else {

					}
				})
			},
			onSelectSex(sexName) {
				this.sexName = sexName;
			},
			onDel() {
				this.$dialog.confirm({
					title: '温馨提示',
					message: '删除后将不可恢复,确定删除吗?'
				}).then(() => {
					this.util.request({
						url: 'wmall/member/address/del',
						data: {
							id: this.id
						},
					}).then((res) => {
						let result = res.data.message;
						if(!result.errno) {
							var query = {};
							if(this.sid > 0) {
								query = {
									sid: this.sid
								}
							}
							this.$router.replace(this.util.getUrl({path: '/pages/member/address', query: query}));
						}
					})
				});
			},
		},

		created(){
			this.query = this.$route.query;
			if(this.query) {
				this.id = this.query.id;
				this.sid = this.query.sid;
				this.channel = this.query.channel;
				this.input = this.query.input;
				this.erranderId = this.query.erranderId;
				this.from = this.query.from;
				this.orderId = this.query.orderId;
				if(this.sid > 0) {
					this.channel = 'takeout';
				}
			}
		},

		mounted() {
			this.onLoad();
		},

	}
</script>

<style>
	#address-post .content .list{
		background-color: #fff;
		padding-left: 15px;
		margin-top: 10px;
	}
	#address-post .content .list .list-item{
		padding: 10px 15px 10px 0;
		line-height: 30px;
	}
	#address-post .content .list .list-item:nth-child(3) .item-title{
		align-self: flex-start;
	}
	#address-post .content .list .list-item .item-title{
		width: 25%;
		font-size: 16px;
	}
	#address-post .content .list .list-item .item-input{
		width: 75%;
	}
	#address-post .content .list .list-item .item-input input{
		width: 100%;
		padding-left: 5px;
		font-size: 15px;
	}
	#address-post .content .list .list-item .item-input .icon-location{
		font-size: 18px;
	}
	#address-post .content .list .list-item .item-input .location{
		width: 90%;
		font-size: 15px;
	}
	#address-post .content .list .list-item .item-input .location span{
		color: #c6c6c8;
	}
	#address-post .content .list .list-item .item-input .location .icon{
		color: #e0e0e0;
		font-size: 16px;
	}
	#address-post .content .list .list-item .item-input .username{
		padding-bottom: 10px;
	}
	#address-post .content .list .list-item .item-input .sex{
		padding-top: 10px;
	}
	#address-post .content .list .list-item .sex-item{
		margin-right: 20px;
	}
	#address-post .content .list .list-item .sex-item .icon{
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 1px solid #ccc;
		text-align: center;
		line-height: 18px;
		margin-right: 5px;
	}
	#address-post .content .list .list-item .sex-item .icon.icon-check{
		color: #fff;
		background-color: #ff2d4b;
		border-color: #ff2d4b;
	}
	#address-post .content .save-btn{
		margin: 15px;
	}
</style>



// WEBPACK FOOTER //
// src/pages/member/addressPost.vue