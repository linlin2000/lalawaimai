<template>
	<div id="storebd-store">
		<public-header title="推广店铺"></public-header>
		<div class="content">
			<van-list v-model="stores.loading" :finished="stores.loaded" :offset="100" @load="onLoad" :immediate-check="false" v-if="!stores.empty">
				<div class="store" v-for="(item,index) in stores.data" :key="index">
					<div class="store-content van-hairline--bottom">
						<div class="store-info">
							<img class="store-img" :src="item.logo" alt="">
							<div class="name">{{item.title}}</div>
						</div>
						<div class="bind-time">
							<div>绑定时间：{{item.addtime_cn}}</div>
						</div>
					</div>
					<div class="store-tips">
						<div class="tips">
							<div>店内单佣金计算方式：</div>
							<div v-if="item.fee_instore.type == 1">抽成比例：{{item.fee_instore.fee_rate}}% ,最低抽成金额：{{item.fee_instore.fee_min}}元</div>
							<div v-else-if="item.fee_instore.type == 2">固定抽成：{{item.fee_instore.fee}}元</div>
							<div v-else>未设置</div>
						</div>
						<div class="tips">
							<div>外卖单佣金计算方式：</div>
							<div v-if="item.fee_takeout.type == 1">抽成比例：{{item.fee_takeout.fee_rate}}% ,最低抽成金额：{{item.fee_takeout.fee_min}}元</div>
							<div v-else-if="item.fee_takeout.type == 2">固定抽成：{{item.fee_takeout.fee}}元</div>
							<div v-else>未设置</div>
						</div>
					</div>
				</div>
				<div class="loaded" v-if="stores.loaded">
					<div class="loaded-tips">我是有底线的</div>
				</div>
			</van-list>
			<div class="no-data" v-else>
				<div class="bg"></div>
				<p>暂时没有数据哦～</p>
			</div>
		</div>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		components: {
			PublicHeader,
		},
		data() {
			return {
				showPreLoading: true,
				stores: {
					page: 1,
					psize: 15,
					loading: false,
					loaded: false,
					empty: false,
					data:[]
				}
			}
		},
		methods: {
			onLoad() {
				if (this.stores.loaded) {
					return false;
				}
				this.util.request({
					url: 'storebd/store',
					data: {
						page: this.stores.page,
						psize: this.stores.psize
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message)
						return;
					}
					this.stores.page ++;
					this.stores.data = [...this.stores.data, ...result.message.stores];
					if (!this.stores.data.length) {
						this.stores.empty = true;
					}
					if(result.message.stores.length < this.stores.psize) {
						this.stores.loaded = true;
					}
					this.stores.loading = false;
				})
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#storebd-store .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#storebd-store .content::-webkit-scrollbar {
		display: none;
	}
	#storebd-store .content .store{
		margin-top: 10px;
		background-color: #FFF;
	}
	#storebd-store .content .store .store-content{
		display:flex;
		flex-wrap:nowrap;
		justify-content:space-between;
		align-items:center;
		padding:10px 15px;
	}
	#storebd-store .content .store .store-content .store-info{
		display:flex;
		flex-wrap:nowrap;
		align-items:center;
	}
	#storebd-store .content .store .store-content .store-info .store-img{
		width:35px;
		height:35px;
		border:none;
		margin-right:10px;
	}
	#storebd-store .content .store .store-content .store-info .name{
		font-size: 14px;
	}
	#storebd-store .content .store .store-content .bind-time{
		text-align:right;
		font-size: 14px;
		line-height: 21px;
	}
	#storebd-store .content .store .store-tips{
		padding:10px 15px;
		font-size:12px;
		color:#A9A9A9;
	}
	#storebd-store .content .store .store-tips .tips{
		width:100%;
		overflow:hidden;
	}
	#storebd-store .content .store .store-tips .tips div{
		line-height: 19px;
		float: left;
	}
	#storebd-store .content .no-data{
		padding-top: 30%;
		text-align: center;
	}
	#storebd-store .content .no-data .bg{
		display: inline-block;
		width: 160px;
		height: 160px;
		background: url(../../../static/img/no_order.png) no-repeat 0 0;
		background-size: cover;
	}
	#storebd-store .content .no-data p{
		margin: 0;
		color: #999;
		font-size: 18px;
		line-height: 27px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/storebd/store.vue