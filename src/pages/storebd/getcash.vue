<template>
	<div id="store-getcash">
		<public-header title="立即提现"></public-header>
		<div class="content">
			<div class="list-block">
				<div class="item-content">
					<div class="item-inner">
						<div class="item-title">
							账户可用余额：<span class="price">¥ {{storebd_user.credit2}}</span>
						</div>
					</div>
				</div>
			</div>
			<div class="list-block">
				<div class="list-item">
					<div class="list-title">提现金额</div>
					<div class="list-input">
						<van-cell-group>
							<van-field v-model="fee" type="number" />
						</van-cell-group>
					</div>
					<div class="help" v-if="config.fee_getcash">
						<p>最低提现金额为{{config.fee_getcash.get_cash_fee_min}}元</p>
						<p>提现费率为{{config.fee_getcash.get_cash_fee_rate}}%</p>
					</div>
				</div>
			</div>
<!-- 			<div class="list-block">
				<van-radio-group v-model="channel" v-if="config.cashcredit">
					<van-cell-group>
						<template v-for="item in config.cashcredit">
							<van-cell title="提现到微信" clickable @click="channel = 'wechat'" v-if="item == 'wechat'">
								<van-radio name="wechat" />
							</van-cell>
							<van-cell title="提现到余额" clickable @click="channel = 'credit2'" v-else-if="item == 'credit2'">
								<van-radio name="credit2" />
							</van-cell>
						</template>
					</van-cell-group>
				</van-radio-group>
				<div class="item-inner" v-else>
					<div class="item-title">平台当前未设置提现方式,请联系平台管理员</div>
				</div>
			</div> -->
			<div class="tab">
				<div @click='onSubmit' class="button-fill">提现</div>
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
				fee: '',
				config: {},
				storebd_user: {},
				showPreLoading: true
			}
		},
		methods: {
			onLoad() {
				this.showPreLoading = true;
				this.util.request({
					url: 'storebd/getcash/application',
					data: {
						menufooter: 1
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					this.config = result.message.config;
					this.storebd_user = result.message.storebd_user;
				})
			},
			onSubmit() {
				if(this.fee <= 0) {
					this.$toast('请填写提现金额');
					return false;
				}
				this.util.request({
					url: 'storebd/getcash/application',
					data: {
						fee : this.fee
					},
					method: 'POST'
				}).then((res) => {
					let result = res.data.message;
					if(result.errno == 0) {
						this.$toast('申请提现成功');
						this.$router.replace(this.util.getUrl({path: '/package/pages/storebd/index'}));
					} else {
						this.$toast(result.message);
						return;
					}
				})
			}

		},
		mounted() {
			this.onLoad()
		}
	}
</script>

<style>
	#store-getcash .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#store-getcash .content::-webkit-scrollbar {
		display: none;
	}
	#store-getcash .content .list-block{
		margin: 12px 0 0;
		background: #fff;
	}
	#store-getcash .content .list-block .item-content{
		position: relative;
		padding-left: 15px;
		display: flex;
		min-height: 44px;
	}
	#store-getcash .content .list-block .item-content .item-inner{
		width: 100%;
		padding: 8px 15px 8px 0;
		margin: 0;
	}
	#store-getcash .content .list-block .item-content .item-inner .item-title{
		position: relative;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 17px;
	}
	#store-getcash .content .list-block .item-content .item-inner .item-title .price{
		color: #FF314A;
	}
	#store-getcash .content .list-block .list-item{
		padding: 12px;
		background-color: #fff;
	}
	#store-getcash .content .list-block .list-item .list-title{
		font-size: 14px;
		line-height: 21px;
	}
	#store-getcash .content .list-block .list-item .list-input{
		border: 1px solid #ccc;
		border-radius: 4px;
		margin-top: 8px;
	}
	#store-getcash .content .list-block .list-item .list-input .van-cell{
		padding: 1px;
		padding-left: 5px;
	}
	#store-getcash .content .list-block .list-item .list-input .van-cell .van-field__body input{
		height: 36px;
	}
	#store-getcash .content .list-block .list-item .help{
		margin-top: 6px;
		color: #999;
		font-size: 14px;
		position: relative;
	}
	#store-getcash .content .list-block .list-item .help p:before{
		content: "";
		width: 4px;
		height: 4px;
		position: absolute;
		left: 0;
		top: 40%;
		background-color: #999;
		border-radius: 100%;
	}
	#store-getcash .content .list-block .list-item .help p{
		line-height: 21px;
		padding-left: 16px;
		position: relative;
	}
	#store-getcash .content .list-block .van-cell__title{
		font-size: 17px;
	}
	#store-getcash .content .list-block .van-cell__value .van-icon-checked{
		color: #fff;
		background: #FF2D4B;
		position: relative;
		width: 20px;
		height: 20px;
		line-height: 22px;
		border-radius: 20px;
		font-size: 14px;
		text-align: center;
	}
	#store-getcash .content .list-block .van-cell__value .van-icon-check{
		color: #fff;
		position: relative;
		width: 20px;
		height: 20px;
		line-height: 22px;
		border: 1px solid #c7c7cc;
		border-radius: 20px;
		font-size: 14px;
		text-align: center;
	}
	#store-getcash .content .list-block .item-inner{
		margin: 12px 0 0;
		background: #fff;
		line-height: 29px;
		padding: 8px 15px 7px;
		font-size: 17px;
	}
	#store-getcash .content .tab{
		text-align: center;
		margin-top: 10px;
	}
	#store-getcash .content .tab .button-fill{
		width: 90%;
		display: inline-block;
		padding: 8px 0;
		height: auto;
		color: #fff;
		background-color: #f6383a;
		text-align: center;
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
		border-radius: 5px;
		line-height: 27px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/storebd/getcash.vue