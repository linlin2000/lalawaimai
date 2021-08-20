<template>
	<div id="address">
		<public-header title="我的地址"></public-header>
		<div class="content">
			<template v-if="((sid > 0 || erranderId > 0) && (available.length > 0 || dis_available.length > 0)) || (!sid && !erranderId && list.length > 0)">
				<template v-if="sid > 0 || erranderId > 0">
					<div class="list">
						<template v-if="available.length > 0">
							<div class="block-title">可选收货地址</div>
							<div class="list-container van-hairline--bottom">
								<div class="item  flex-lr" :class="{'van-hairline--bottom': index < available.length -1 }" v-for="(item, index) in available" :key="item">
									<div class="item-content" @click.prevent.stop="onSelectAddress(item)">
										<div class="user">
											<span>{{item.realname}}</span>
											<span>{{item.sex}}</span>
											<span>{{item.mobile}}</span>
										</div>
										<div class="address">{{item.address}}</div>
									</div>
									<div @click="util.jsUrl('/pages/member/addressPost', {id: item.id, sid: sid, channel: channel, erranderId: erranderId, input: input}, 'replace')">
										<van-icon name="edit"></van-icon>
									</div>
								</div>
							</div>
						</template>
						<template v-if="dis_available.length > 0">
							<div class="block-title">不在配送范围内或地址不完善</div>
							<div class="list-container van-hairline--bottom">
								<div class="item  flex-lr c-disabled" :class="{'van-hairline--bottom': index < dis_available.length -1 }" v-for="(item, index) in dis_available" :key="item">
									<div class="item-content " @click.prevent.stop="onSelectAddress(item)">
										<div class="user">
											<span>{{item.realname}}</span>
											<span>{{item.sex}}</span>
											<span>{{item.mobile}}</span>
										</div>
										<div class="address c-disabled">{{item.address}}</div>
									</div>
									<div @click="util.jsUrl('/pages/member/addressPost', {id: item.id, sid: sid, channel: channel, erranderId: erranderId, input: input}, 'replace')">
										<van-icon name="edit"></van-icon>
									</div>
								</div>
							</div>
						</template>
					</div>
				</template>
				<template v-else>
					<div class="list">
						<div class="list-container van-hairline--bottom">
							<div class="item  flex-lr" :class="{'van-hairline--bottom': index < list.length -1 }" v-for="(item, index) in list" :key="item">
								<div class="item-content" @click.prevent.stop="onSelectAddress(item)">
									<div class="user">
										<span>{{item.realname}}</span>
										<span>{{item.sex}}</span>
										<span>{{item.mobile}}</span>
									</div>
									<div class="address">{{item.address}}</div>
								</div>
								<div @click="util.jsUrl('/pages/member/addressPost', {id: item.id, sid: sid, channel: channel, erranderId: erranderId, input: input})">
									<van-icon name="edit"></van-icon>
								</div>
							</div>
						</div>
					</div>
				</template>
			</template>
			<div v-else class="no-data">
				<img src= "static/img/store_no_con.png" alt="" />
				<p>您还没有收货地址</p>
			</div>
			<div class="add" @click="util.jsUrl('/pages/member/addressPost', {id: 0, sid: sid, channel: channel, erranderId: erranderId, input: input}, 'replace')">
				<van-cell class="border-1px-t" title="新增收货地址" icon="add" is-link />
			</div>
		</div>

		<transition name="loading">
			<iloading v-if="preLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	import PublicHeader from '@/components/header'
	export default {
		data() {
			return {
				preLoading: true,
				list: [],
				available: [],
				dis_available: [],
			}
		},
		components: {
			PublicHeader,
		},
		methods: {
			...mapMutations([
				'setOrderExtra', 'setState'
			]),
			onLoad() {
				var params = {
					sid: this.sid,
					erranderId: this.erranderId
				};
				if(this.erranderExtra && this.erranderExtra.agentid) {
					params['agentid'] = this.erranderExtra.agentid;
				}
				this.util.request({
					url: 'wmall/member/address',
					data: params,
				}).then((res) => {
					this.preLoading = false;
					let result = res.data.message;
					if(result.errno) {
						return;
					}
					if(this.sid > 0 || this.erranderId > 0) {
						this.available = [...this.available, ...result.message.available];
						this.dis_available = [...this.dis_available, ...result.message.dis_available];
					} else {
						this.list = [...this.list, ...result.message];
					}
					
				})
			},

			//选择地址
			onSelectAddress(address){
				if(!this.sid && !this.erranderId) {
					return false;
				}
				if(!address.available) {
					this.$toast('该地址不在商家配送范围内');
					return false;
				}
				if(this.channel == 'errander') {
					if(this.input == 'accept') {
						this.setState({type: 'erranderExtra', key: 'acceptaddress_id', val: address.id});
					} else if(this.input == 'buy') {
						this.setState({type: 'erranderExtra', key: 'buyaddress_id', val: address.id});
					}
					this.$router.replace(this.util.getUrl({path: '/pages/paotui/diy', query:{id: this.erranderId}}));
					return false;
				}
				this.setOrderExtra({key: 'address_id', val: address.id});
				this.$router.replace(this.util.getUrl({path: '/pages/order/create', query:{sid: this.sid}}));
			},
		},
		computed: {
			...mapState([
				'orderExtra', 'erranderExtra'
			]),
		},
		created(){
			this.query = this.$route.query;
			if(this.query) {
				this.sid = this.query.sid;
				this.channel = this.query.channel;
				this.input = this.query.input;
				this.erranderId = this.query.erranderId;
			}
		},

		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#address .list::-webkit-scrollbar {
		width: 0px;
		height: 0px;
	}
	#address .list{
		background-color: #fff;
		position: absolute;
		top: 0px;
		bottom: 45px;
		left: 0;
		right: 0;
		overflow-y: auto;
	}
	#address .list .block-title{
		padding: 10px 15px;
		background-color: #f5f5f5;
		font-size: 14px;
		color: #999;
	}
	#address .list .list-container{
		padding-left: 15px;
	}
	#address .list .item{
		padding: 10px 15px 10px 0;
	}
	#address .list .item.disabled .item-content{
		opacity: 0.4;
		background: none;
	}
	#address .list .item .item-content{
		width: 90%;
	}
	#address .list .item .item-content .user{
		font-size: 14px;
		line-height: 2;
	}
	#address .list .item .item-content .address{
		font-size: 13px;
		line-height: 1.5;
		color: #666;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	#address .list .item .van-icon{
		font-size: 20px;
		color: #333;
	}
	#address .add{
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		z-index: 100;
	}
	#address .add .van-icon-add{
		width: 20px;
		height: 20px;
		border-radius: 50%;
		line-height: 20px;
		text-align: center;
		font-size: 16px;
		color: #fff;
		margin-top: 2px;
		background-color: #FF2D4B;
	}
</style>



// WEBPACK FOOTER //
// src/pages/member/address.vue