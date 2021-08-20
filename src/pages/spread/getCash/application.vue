<template>
	<div id="spread-getcash-application">
		<public-header title="推广员佣金提现"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<div class="list-block">
				<div class="item-content">
					<div class="item-inner">
						<div class="item-title">
							账户可用余额：<span class="price">¥ {{member.spreadcredit2}}</span>
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
					<div class="help">
						<p>最低提现金额为{{config.withdraw}}元</p>
						<p>提现费率为{{config.withdrawcharge}}%</p>
					</div>
				</div>
			</div>
			<div class="list-block">
				<van-radio-group v-model="channel" v-if="config.cashcredit">
					<van-cell-group>
						<template v-for="item in config.cashcredit">
							<van-cell title="提现到微信" clickable @click="channel = 'wechat'" v-if="item == 'wechat'">
								<van-radio name="wechat" />
							</van-cell>
							<van-cell title="提现到余额" clickable @click="channel = 'credit'" v-else-if="item == 'credit2'">
								<van-radio name="credit" />
							</van-cell>
						</template>
					</van-cell-group>
				</van-radio-group>
				<div class="item-inner" v-else>
					<div class="item-title">平台当前未设置提现方式,请联系平台管理员</div>
				</div>
			</div>
			<div class="tab">
				<div @click='onSubmit' class="button-fill">提现</div>
			</div>
		</div>
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
				channel: '',
				config: {},
				member: {},
				showPreLoading: true,
				menufooter: {}
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'spread/getCash/application',
					data: {
						menufooter: 1
					}
				}).then((res) => {
					let result = res.data.message;
					this.config = result.message.config;
					this.channel = this.config.cashcredit[0];
					if(this.channel == 'credit2') {
						this.channel = 'credit'
					}
					this.member = result.message.member;
					this.showPreLoading = false;
					this.menufooter = window.menufooter;
				})
			},
			onSubmit() {
				if(this.fee <= 0) {
					this.$toast('请填写提现金额');
					return false;
				}
				if(!this.channel) {
					this.$toast('请选择提现渠道');
					return false;
				}
				this.util.request({
					url: 'spread/getCash/application',
					data: {
						status : 1,
						fee : this.fee,
						channel : this.channel
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno == 0) {
						this.$toast('申请提现成功');
						this.$router.push(this.util.getUrl({path: '/pages/spread/getCash/index'}));
					} else {
						this.$toast(result.message);
						if(result.errno == -1000) {
							this.$router.push(this.util.getUrl({path: '/pages/member/profile'}));
						}
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
	#spread-getcash-application .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#spread-getcash-application .content::-webkit-scrollbar {
		display: none;
	}
	#spread-getcash-application .content .list-block{
		margin: 12px 0 0;
		background: #fff;
	}
	#spread-getcash-application .content .list-block .item-content{
		position: relative;
		padding-left: 15px;
		display: flex;
		min-height: 44px;
	}
	#spread-getcash-application .content .list-block .item-content .item-inner{
		width: 100%;
		padding: 8px 15px 8px 0;
		margin: 0;
	}
	#spread-getcash-application .content .list-block .item-content .item-inner .item-title{
		position: relative;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 17px;
	}
	#spread-getcash-application .content .list-block .item-content .item-inner .item-title .price{
		color: #FF314A;
	}
	#spread-getcash-application .content .list-block .list-item{
		padding: 12px;
		background-color: #fff;
	}
	#spread-getcash-application .content .list-block .list-item .list-title{
		font-size: 14px;
		line-height: 21px;
	}
	#spread-getcash-application .content .list-block .list-item .list-input{
		border: 1px solid #ccc;
		border-radius: 4px;
		margin-top: 8px;
	}
	#spread-getcash-application .content .list-block .list-item .list-input .van-cell{
		padding: 1px;
		padding-left: 5px;
	}
	#spread-getcash-application .content .list-block .list-item .list-input .van-cell .van-field__body input{
		height: 36px;
	}
	#spread-getcash-application .content .list-block .list-item .help{
		margin-top: 6px;
		color: #999;
		font-size: 14px;
		position: relative;
	}
	#spread-getcash-application .content .list-block .list-item .help p:before{
		content: "";
		width: 4px;
		height: 4px;
		position: absolute;
		left: 0;
		top: 40%;
		background-color: #999;
		border-radius: 100%;
	}
	#spread-getcash-application .content .list-block .list-item .help p{
		line-height: 21px;
		padding-left: 16px;
		position: relative;
	}
	#spread-getcash-application .content .list-block .van-cell__title{
		font-size: 17px;
	}
	#spread-getcash-application .content .list-block .van-cell__value .van-icon-checked{
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
	#spread-getcash-application .content .list-block .van-cell__value .van-icon-check{
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
	#spread-getcash-application .content .list-block .item-inner{
		margin: 12px 0 0;
		background: #fff;
		line-height: 29px;
		padding: 8px 15px 7px;
		font-size: 17px;
	}
	#spread-getcash-application .content .tab{
		text-align: center;
		margin-top: 10px;
	}
	#spread-getcash-application .content .tab .button-fill{
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
// src/pages/spread/getCash/application.vue