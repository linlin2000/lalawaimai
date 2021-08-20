<template>
	<div id="recharge">
		<public-header title="余额充值"></public-header>
		<div class="content">
			<div class="recharge">
				<div class="recharge-list row">
					<div class="col-33 recharge-item" :class="{selected: select == index}" v-for="(item, index) in recharge" @click="changeSelect(index, item.charge)" :key="item">
						<div class="recharge-num">￥<span>{{item.charge}}</span></div>
						<div class="back-num">
							送{{item.back}}
							<span v-if="item.type == 'credit2'">元</span>
							<span v-else>酒币</span>
						</div>
						<span class="selected-status"></span>
					</div>

					<div class="col-33 recharge-item last-item" :class="{selected: select == 'other'}" @click="changeSelect('other', input)">
						<input type="text" placeholder="输入金额" id="inputpay" value="" v-if="select == 'other'" v-model.number="input">
						<span class="entry-text" v-else>其他金额</span>
						<span class="selected-status"></span>
					</div>
				</div>
				<div class="list-block">
					<ul>
						<li class="item-content">
							<div class="item-inner">
								<div class="item-title">支付金额</div>
								<div class="item-after pay-num" data-charge="0" v-if="price > 0">￥{{price}}元</div>
							</div>
						</li>
					</ul>
				</div>
				<div class="buttons">
					<div class="content-block-a" @click="onSubmit">确认充值</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import PublicFooter from '@/components/footer'
	import PublicHeader from '@/components/header'
	export default {
		data() {
			return {
				select: 0,
				price: 0,
				input: '',
				recharge: [],
				status: 0
			}
		},
		components: {
			PublicHeader,
			PublicFooter
		},
		watch: {
			input() {
				this.price = this.input;
			}
		},

		methods: {
			onLoad() {
				this.util.request({
					url: 'wmall/member/recharge/index'
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return;
					}
					this.status = 1;
					if(result.message && result.message.length > 0) {
						this.recharge = [...this.recharge, ...result.message];
						this.price = this.recharge[0].charge;
					}
				})
			},
			changeSelect(index, charge) {
				this.select = index;
				this.price = charge;
			},
			onSubmit() {
				if(this.status != 1) {
					return false;
				}
				this.util.request({
					url: 'wmall/member/recharge/submit',
					data: {
						price: this.price
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return false;
					}
					var orderId = result.message;
					this.$router.replace(this.util.getUrl({path: '/pages/public/pay?order_id=' + orderId + '&order_type=recharge'}));
				})
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style scoped>
	#recharge .recharge-list{
		padding: 10px 10px 0 10px;
	}
	#recharge .row{
		margin-left: -4%;
		overflow: hidden;
	}
	#recharge .row .col-33{
		width: 29.333333333333332%;
		margin-left: 4%;
		float:left;
		box-sizing: border-box;
	}
	#recharge .recharge-list .recharge-item{
		border: 1px solid #e0e0e0;
		margin-bottom: 10px;
		position: relative;
		text-align: center;
		color: #10aeff;
		background-color: #fff;
		padding: 6px;
		font-size: 16px;
		height: 60px;
		line-height: 1.7;
	}
	#recharge .recharge-list .selected{
		border-color: #ff2d4b;
	}
	#recharge .recharge-list .recharge-item.selected .selected-status{
		display: inline-block;
	}
	#recharge .recharge-list .recharge-item .selected-status{
		display: none;
		width: 31px;
		height: 24px;
		position: absolute;
		bottom: 0;
		right: 0;
		background: url(../../../static/img/selected-success.png) no-repeat right bottom;
		background-size: contain;
		z-index: 2;
	}
	#recharge .recharge-list .recharge-item .back-num{
		font-size: 10px;
	}
	#recharge .recharge-list .recharge-item:last-child{
		font-size: 12px;
		line-height: 4;
	}
	#recharge .recharge-list .recharge-item #inputpay{
		color: #333;
		width: 100%;
		height: 40px;
		margin-bottom: 20px;
		line-height: 30px;
		background-color: #fff;
		border-radius: 4px;
		outline: 0;
		border: none;
		text-align: center;
	}
	#recharge .recharge .list-block{
		margin: 0;
		padding: 0 10px;
	}
	#recharge .recharge .list-block ul{
		position: relative;
		padding: 0;
		margin: 0;
		list-style: none;
		background-color: #fff;
	}
	#recharge .recharge .list-block ul .item-content{
		display: -webkit-box;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		min-height: 44px;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		padding-left: 15px;
		-webkit-box-pack: justify;
		-ms-flex-pack: justify;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		-webkit-box-align: center;
		-ms-flex-align: center;
		-webkit-align-items: center;
		align-items: center;
	}
	#recharge .recharge .list-block ul .item-content .item-inner{
		border-bottom: 0;
		border-left: 0;
		position: relative;
		display: -webkit-box;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		width: 100%;
		min-height: 2.2rem;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		padding-top: .4rem;
		padding-right: .75rem;
		padding-bottom: .35rem;
		-webkit-box-flex: 1;
		-ms-flex: 1;
		-webkit-box-pack: justify;
		-ms-flex-pack: justify;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		-webkit-box-align: center;
		-ms-flex-align: center;
		-webkit-align-items: center;
		align-items: center;
	}
	#recharge .recharge .list-block ul .item-content .item-inner .item-title{
		font-size: 12px;
		position: relative;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		-webkit-flex-shrink: 1;
		-ms-flex: 0 1 auto;
		-webkit-flex-shrink: 1;
		-ms-flex-negative: 1;
		flex-shrink: 1;
	}
	#recharge .recharge .list-block ul .item-content .item-inner .item-after{
		font-size: 14px;
		color: #04be02;
		display: inline-block;
		max-width: 300px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#recharge .recharge .buttons{
		margin: 16px 0;
		padding: 0 15px;
		color: #6d6d72;
	}
	#recharge .recharge .buttons .content-block-a{
		display: block;
		color: #fff;
		border-radius: 5px;
		background-color: #f6383a;
		height: 48px;
		font-size: 17px;
		line-height: 48px;
		padding: 0 10px;
		margin: 0;
		text-align: center;
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
	}
</style>



// WEBPACK FOOTER //
// src/pages/member/recharge.vue