<template>
	<div id="creditshop-list">
		<public-header title="兑换列表"></public-header>
		<div class="content">
			<van-list
				v-model="list.loading"
				:finished="list.finished"
				@load="onLoad"
				:offset="100"
				:immediate-check="false"
				v-if="!list.empty"
			>
				<div class="list-item" v-for="(item, index) in list.data" :key="index">
					<div class="first-line">
						<div class="order-sn">订单号：{{item.order_sn}}</div>
						<div class="status" v-if="0">待发货</div>
					</div>
					<router-link :to="util.getUrl({path: '/pages/creditshop/detail', query:{id: item.id}})" class="second-line">
						<div class="left">
							<img :src="item.thumb" alt="">
						</div>
						<div class="right">
							<div class="title">{{item.title}}</div>
							<div class="type">
								<span v-if="item.goods_type == 'goods'">商品</span>
								<span v-else-if="item.goods_type == 'credit2'">余额</span>
								<span v-else-if="item.goods_type == 'redpacket'">红包</span>
							</div>
							<div class="credit">
								{{item.use_credit1}}酒币
								<template v-if="item.use_credit2 > 0">
									+ ¥{{item.use_credit2}}
								</template>
							</div>
						</div>
					</router-link>
					<div class="third-line border-1px-t">
						<div class="code">兑换码：{{item.code}}</div>
						<div class="btn-group">
							<div class="btn bg-default btn-cel" @click="onCancel(item.id)" v-if="item.use_credit1 > 0 && item.is_pay == 0 && item.status == 1 && item.use_credit1_status == 1">
								取消订单
							</div>
							<router-link :to="util.getUrl({path: '/pages/public/pay', query: {order_id: item.id, order_type: 'creditshop'}})" class="btn bg-danger" v-if="item.use_credit2 > 0 && item.is_pay == 0 && item.status == 1">
								立即支付
							</router-link>
						</div>
					</div>
				</div>
				<load type="loaded" text="我是有底线的" v-if="list.finished"></load>
			</van-list>
			<load type="loaded" text="暂无酒币兑换记录" v-else></load>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import Load from '@/components/load'
	export default {
		data() {
			return {
				list: {
					page: 1,
					psize: 4,
					loading: false,
					finished: false,
					empty: false,
					data: []
				},
				showPreLoading: true,
			}
		},
		components: {
			PublicHeader,
			Load
		},
		methods: {
			onLoad() {
				if(this.list.finished) {
					return false;
				}
				this.util.request({
					url: 'creditshop/order/list',
					data: {
						page: this.list.page,
						psize: this.list.psize,
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					result = result.message;
					this.list.data = [...this.list.data, ...result];
					if(result.length < this.list.psize ) {
						this.list.finished = true;
						if(!this.list.data.length) {
							this.list.empty = true;
						}
					}
					this.list.loading = false;
					this.list.page++;
					
				})
			},
			onCancel(order_id) {
				var order_id = order_id;
				if(order_id > 0) {
					this.$dialog.confirm({
						title: '确认取消该订单吗'
					}).then(() => {
						this.util.request({
							url: 'creditshop/order/cancel',
							data: {
								order_id: order_id,
							}
						}).then((res) => {
							let result = res.data.message;
							if(result.errno) {
								this.util.$toast(result.message);
								return false;
							}
							this.util.$toast(result.message, 'refresh');
						})
					})
				}
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#creditshop-list .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#creditshop-list .content::-webkit-scrollbar {
		display: none;
	}
	#creditshop-list .content .list-item{
		width:100%;
		box-sizing:border-box;
		padding:0px 10px;
		background:#fff;
		margin-bottom:10px;
	}
	#creditshop-list .content .list-item .first-line{
		display:flex;
		flex-flow:row nowrap;
		align-items:center;
		justify-content:space-between;
		padding:10px 0px;
		line-height: 25px;
	}
	#creditshop-list .content .list-item .first-line .order-sn{
		color:#757575;
		font-size:16px;
	}
	#creditshop-list .content .list-item .first-line .status{
		color:#F2965B;
		font-size:16px;
	}
	#creditshop-list .content .list-item .second-line{
		display:flex;
		flex-flow:row nowrap;
		align-items:flex-start;
		padding-bottom:10px;
		overflow: hidden;
	}
	#creditshop-list .content .list-item .second-line .left{
		width:100px;
		margin-left:10px;
	}
	#creditshop-list .content .list-item .second-line .left img{
		width:100px;
		height:100px;
		border-radius:5px;
	}
	#creditshop-list .content .list-item .second-line .right{
		width:270px;
		box-sizing:border-box;
		padding-left:15px;
	}
	#creditshop-list .content .list-item .second-line .right .title{
		max-width:100%;
		overflow:hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
		font-size:16px;
		font-weight:600;
		line-height: 33px;
		margin-bottom:5px;
		color: #000;
	}
	#creditshop-list .content .list-item .second-line .right .type{
		display:flex;
		align-items:center;
		height:33px;
	}
	#creditshop-list .content .list-item .second-line .right .type span{
		display:flex;
		align-items:center;
		padding:0 5px;
		color:#fff;
		background:#F44453;
		font-size:12px;
		border-radius:3px;
		line-height: 19px;
	}
	#creditshop-list .content .list-item .second-line .right .credit{
		font-size:14px;
		color:#D34B4C;
		line-height: 33px;
		display:flex;
		align-items:flex-end;
	}
	#creditshop-list .content .list-item .third-line{
		font-size:16px;
		color:#9F9F9F;
		display:flex;
		padding:10px 0;
		display:flex;
		flex-flow:row nowrap;
		justify-content:space-between;
		align-items:center;
	}
	#creditshop-list .content .list-item .third-line .btn-group{
		display:flex;
		justify-content:right;
	}
	#creditshop-list .content .list-item .third-line .btn-group .btn{
		display: inline-block;
		padding: 0;
		font-size: 15px;
		border-radius: 3px;
		width: 85px;
		text-align: center;
		line-height: 36px;
	}
	#creditshop-list .content .list-item .third-line .btn-group .btn.btn-cel{
		border: 1px solid #ccc;
		margin-right: 10px;
	}
	#creditshop-list .content #load .loaded .loaded-tips{
		background: #f5f5f5;
	}
</style>


// WEBPACK FOOTER //
// src/pages/creditshop/list.vue