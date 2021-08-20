<template>
	<div id="store-commission">
		<public-header title="店铺推广拥金"></public-header>
		<div class="content">
			<div class="detail">
				<div class="left">
					<div>累计佣金(元)</div>
					<div class="price">{{commission.total}}</div>
				</div>
				<div class="right">
					<router-link :to="util.getUrl({path: '/package/pages/storebd/getcashlog'})">提现明细</router-link>
				</div>
			</div>
			<div class="list-block">
				<ul>
					<li class="item-content">
						<div class="item-media">
							<van-icon name='recharge'></van-icon>
						</div>
						<div class="item-inner">
							<div class="item-title">可提现佣金</div>
							<div class="item-after red">￥{{storebd_user.credit2}}</div>
						</div>
					</li>
				</ul>
			</div>
			<div class="list-block">
				<ul>
					<router-link tag="li" class="item-content border-1px-b" :to="util.getUrl({path: '/package/pages/storebd/current'})">
						<div class="item-media">
							<van-icon name='time'></van-icon>
						</div>
						<div class="item-inner">
							<div class="item-title">累计佣金</div>
							<div class="item-after">￥{{commission.total}}</div>
						</div>
					</router-link>
					<li class="item-content border-1px-b">
						<div class="item-media">
							<van-icon name='rest'></van-icon>
						</div>
						<div class="item-inner">
							<div class="item-title">待打款佣金</div>
							<div class="item-after">￥{{commission.getcash_apply}}</div>
						</div>
					</li>
					<li class="item-content">
						<div class="item-media">
							<van-icon name='signboard'></van-icon>
						</div>
						<div class="item-inner">
							<div class="item-title">成功提现佣金</div>
							<div class="item-after">￥{{commission.getcash_success}}</div>
						</div>
					</li>
				</ul>
			</div>
<!-- 			<div class="must">
				<div class="text-title">用户须知</div>
				<div class="text">
					<p>买家确认收货后,佣金将自动打入您的佣金账户余额。</p>
					<p>买家确认收货买家确认收货并评价后,佣金将自动打入您的佣金账户余额。</p>
					<p>注意:可用佣金满<span>1</span>元后才能申请提现</p>
				</div>
				<van-icon name='unfold1'></van-icon>
			</div> -->
			<div class="tab">
				<router-link :to="util.getUrl({path: '/package/pages/storebd/getcash'})" class="button-fill" v-if="storebd_user.credit2 > 0">我要提现</router-link>
				<div class="button-fill disabled" v-else>我要提现</div>
			</div>
		</div>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	export default {
		components: {
			PublicHeader,
			PublicFooter,
		},
		data() {
			return {
				storebd_user: {},
				commission: {},
				config: {},
				showPreLoading: true
			}

		},
		methods: {
			onLoad() {
				this.showPreLoading = true;
				this.util.request({
					url: 'storebd/index/commission',
					data: {}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message, '', 1000);
						return;
					} 
					result = result.message;
					this.storebd_user = result.storebd_user;
	  				this.commission = result.commission;
	  				this.config = result.config;
				})
			},
		},
		mounted() {
			this.onLoad()
		}
	}
</script>

<style>
	#store-commission .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#store-commission .content::-webkit-scrollbar {
		display: none;
	}
	#store-commission .content .detail{
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: #FF2D4B;
		color: #fff;
		padding: 14px 12px;
	}
	#store-commission .content .detail .left{
		font-size: 15px;
	}
	#store-commission .content .detail .left div{
		line-height: 22px;
	}
	#store-commission .content .detail .right a{
		display: block;
		color: #fff;
		font-size: 14px;
		padding: 0 6px;
		border: 1px solid #fff;
		border-radius: 12px;
		line-height: 21px;
	}
	#store-commission .content .list-block{
		margin-top: 8px;
		margin-bottom: 0;
	}
	#store-commission .content .list-block ul{
		position: relative;
		padding: 0;
		margin: 0;
		list-style: none;
		background-color: #fff;
	}
	#store-commission .content .list-block ul .item-content{
		margin-right: 15px;
		margin-left: 15px;
		padding-left: 0;
		display: flex;
	}
	#store-commission .content .list-block ul .item-content .item-media{
		padding-top: 7px;
		padding-bottom: 8px;
	}
	#store-commission .content .list-block ul .item-content .item-media .van-icon{
		font-size: 16px;
		line-height: 33px;
	}
	#store-commission .content .list-block ul .item-content .item-inner{
		position: relative;
		display: flex;
		width: 100%;
		padding: 8px 0 7px 15px;
		-webkit-justify-content: space-between;
		line-height: 29px;
	}
	#store-commission .content .list-block ul .item-content .item-inner .item-title{
		font-size: 14px;
	}
	#store-commission .content .list-block ul .item-content .item-inner .item-after{
		color: #5f646e;
		display: inline-block;
		max-width: 300px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 14px;	
	}
	#store-commission .content .list-block ul .item-content .item-inner .item-after.red{
		color: #FF5355;
	}
	#store-commission .content .must{    	
		padding: 8px 15px;
		margin-top: 8px;
		background-color: #fff;
		position: relative;
	}
	#store-commission .content .must .text-title{
		font-size: 14px;
		line-height: 21px;
	}
	#store-commission .content .must .text{
		padding-top: 8px;
	}
	#store-commission .content .must .text p{
		margin: 0;
		font-size: 14px;
		color: #666;
		line-height: 21px;
	}
	#store-commission .content .must .text p span{
		color: #FF5355;
	}
	#store-commission .content .must .van-icon{
		position: absolute;
		top: 10px;
		right: 18px;
		font-size: 16px;
	}
	#store-commission .content .tab{
		text-align: center;
		margin-top: 10px;
	}
	#store-commission .content .tab .button-fill{
		width: 90%;
		display: inline-block;
		padding: 8px 0;
		height: auto;
		color: #fff;
		background-color: #f6383a;
		border: none;
		border-radius: 5px;
		line-height: 27px;
	}
	#store-commission .content .tab .button-fill.disabled{
		background-color: #c8c9cb;
	}
</style>



// WEBPACK FOOTER //
// src/pages/storebd/commission.vue