<template>
	<div id="spread-commission">
		<public-header title="推广佣金"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<div class="detail">
				<div class="left">
					<div>累计佣金(元)</div>
					<div class="price">{{data.commission_grandtotal}}</div>
				</div>
				<div class="right">
					<router-link to="">提现明细</router-link>
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
							<div class="item-after red">{{data.spreadcredit2}}元</div>
						</div>
					</li>
				</ul>
			</div>
			<div class="list-block">
				<ul>
					<li class="item-content border-1px-b">
						<div class="item-media">
							<van-icon name='time'></van-icon>
						</div>
						<div class="item-inner">
							<div class="item-title">累计佣金</div>
							<div class="item-after">{{data.commission_grandtotal}}元</div>
						</div>
					</li>
					<li class="item-content border-1px-b">
						<div class="item-media">
							<van-icon name='rest'></van-icon>
						</div>
						<div class="item-inner">
							<div class="item-title">待打款佣金</div>
							<div class="item-after">{{data.commission_getcash_apply}}元</div>
						</div>
					</li>
					<li class="item-content">
						<div class="item-media">
							<van-icon name='signboard'></van-icon>
						</div>
						<div class="item-inner">
							<div class="item-title">成功提现佣金</div>
							<div class="item-after">{{data.commission_getcash_success}}元</div>
						</div>
					</li>
				</ul>
			</div>
			<div class="must">
				<div class="text-title">用户须知</div>
				<div class="text">
					<p v-if="settle.balance_condition == 1">买家确认收货后,佣金将自动打入您的佣金账户余额。</p>
					<p v-if="settle.balance_condition == 2">买家确认收货买家确认收货并评价后,佣金将自动打入您的佣金账户余额。</p>
					<p>注意:可用佣金满<span>{{settle.withdraw}}</span>元后才能申请提现</p>
				</div>
				<van-icon name='unfold1'></van-icon>
			</div>
			<div class="tab">
				<router-link :to="util.getUrl({path: '/pages/spread/getCash/application'})" class="button-fill" v-if="data.spreadcredit2 > 0">我要提现</router-link>
				<div class="button-fill disabled" v-else>我要提现</div>
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
  				settle: {},
  				data: {},
  				showPreLoading: true,
  				menufooter: {}
  			}
  		},
  		methods: {
			onLoad() {
				this.util.request({
					url: 'spread/commission',
					data: {
						menufooter: 1
					}
				}).then((res) => {
					let result = res.data.message;
					this.settle = result.message.settle;
	  				this.data = result.message.data;
	  				this.showPreLoading = false;
					this.menufooter = window.menufooter;
				})
			},
		},
		mounted() {
			this.onLoad()
		}
	}
</script>

<style>
	#spread-commission .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
        overflow-y: scroll;
	}
	#spread-commission .content::-webkit-scrollbar {
        display: none;
    }
    #spread-commission .content .detail{
	    background-color: #FF2D4B;
	    color: #fff;
	    padding: 14px 12px;
	    overflow: hidden;
    }
    #spread-commission .content .detail .left{
	    float: left;
	    width: 70%;
	    font-size: 15px;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
    }
    #spread-commission .content .detail .left div{
    	line-height: 22px;
    }
    #spread-commission .content .detail .right{
		float: right;
	    width: 30%;
	    position: relative;
	    min-height: 44px;
    }
    #spread-commission .content .detail .right a{
	    color: #fff;
	    font-size: 14px;
	    display: inline-block;
	    position: absolute;
	    right: 0;
	    top: 50%;
	    padding: 0 6px;
	    border: 1px solid #fff;
	    border-radius: 12px;
	    line-height: 21px;	
    }
    #spread-commission .content .list-block{
	    margin-top: 8px;
	    margin-bottom: 0;
    }
    #spread-commission .content .list-block ul{
	    position: relative;
	    padding: 0;
	    margin: 0;
	    list-style: none;
	    background-color: #fff;
    }
    #spread-commission .content .list-block ul .item-content{
		margin-right: 15px;
	    margin-left: 15px;
	    padding-left: 0;
	    display: flex;
    }
    #spread-commission .content .list-block ul .item-content .item-media{
	    padding-top: 7px;
	    padding-bottom: 8px;
    }
    #spread-commission .content .list-block ul .item-content .item-media .van-icon{
    	font-size: 16px;
    	line-height: 33px;
    }
    #spread-commission .content .list-block ul .item-content .item-inner{
    	position: relative;
    	display: flex;
    	width: 100%;
    	padding: 8px 0 7px 15px;
	    -webkit-justify-content: space-between;
	    line-height: 29px;
    }
    #spread-commission .content .list-block ul .item-content .item-inner .item-title{
    	font-size: 14px;
    }
    #spread-commission .content .list-block ul .item-content .item-inner .item-after{
    	color: #5f646e;
		display: inline-block;
		max-width: 300px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		font-size: 14px;	
    }
    #spread-commission .content .list-block ul .item-content .item-inner .item-after.red{
    	color: #FF5355;
    }
    #spread-commission .content .must{    	
	    padding: 8px 15px;
	    margin-top: 8px;
	    background-color: #fff;
	    position: relative;
    }
    #spread-commission .content .must .text-title{
    	font-size: 14px;
    	line-height: 21px;
    }
    #spread-commission .content .must .text{
		padding-top: 8px;
    }
    #spread-commission .content .must .text p{
    	margin: 0;
    	font-size: 14px;
    	color: #666;
    	line-height: 21px;
    }
    #spread-commission .content .must .text p span{
	    color: #FF5355;
    }
    #spread-commission .content .must .van-icon{
    	position: absolute;
		top: 10px;
		right: 18px;
		font-size: 16px;
    }
    #spread-commission .content .tab{
		text-align: center;
	    margin-top: 10px;
    }
    #spread-commission .content .tab .button-fill{
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
    #spread-commission .content .tab .button-fill.disabled{
    	background-color: #c8c9cb;
    }
</style>



// WEBPACK FOOTER //
// src/pages/spread/commission.vue