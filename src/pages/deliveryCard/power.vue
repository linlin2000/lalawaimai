<template>
	<div id="deliveryCard-power">
		<public-header title="配送会员卡"></public-header>
		<div class="content">
			<div class="tequan-pic"><img src="static/img/card-privilege.jpg" alt=""></div>
			<p class="tequan-info">特权说明</p>
			<ul class="tequan-list">
				<li>仅支持平台配送商户使用</li>
				<li>下单配送费直接扣除</li>
				<li v-if="member.setmeal_day_free_limit > 0">每日仅限{{member.setmeal_day_free_limit}}单享受特权</li>
				<li v-else>每日不限次享受特权</li>
				<li v-if="member.setmeal_deliveryfee_free_limit > 0">每单最高减免配送费{{member.setmeal_deliveryfee_free_limit}}元</li>
				<li v-else>免费送金额不设限制</li>
			</ul>
			<div class="card-button"><router-link class="button-round" :to="util.getUrl({path: '/pages/home/index'})">现在去购物</router-link></div>
		</div>	
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		data() {
			return {
				member: {}
			}
		},
		components: {
			PublicHeader,
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'deliveryCard/index/power',
				}).then((res) => {
					let result = res.data.message.message;
					this.member = result.member;
				})
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#deliveryCard-power .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
	    background: #fff;
	}
	#deliveryCard-power .tequan-pic{
	    padding: 40px 30px 0;
	}
	#deliveryCard-power .tequan-pic img{
		border: none;
		max-width: 100%;
	}
	#deliveryCard-power .tequan-info{
		text-align: center;
		margin: 20px 0;
	}
	#deliveryCard-power .tequan-list{
		overflow: hidden;
	    padding: 0 15px 30px;
	    border-bottom: 1px solid #f3f4f4;
	}
	#deliveryCard-power .tequan-list li:before{
		content: "";
		width: 8px;
		height:8px;
		border-radius: 3px;
		display: inline-block;
		zoom:1;
		background: #ececec;
		margin-right: 5px;
	}
	#deliveryCard-power .tequan-list li{
		float: left;
	    width: 50%;
	    font-size: 12px;
	    color: #999;
	    margin: 6px 0;
	}
	#deliveryCard-power .card-button{
		width: 60%;
		margin: 30px auto;
	}
	#deliveryCard-power .card-button .button-round{
	    display: block;
	    background: #ff2d4b;
	    height: 36px;
	    line-height: 36px;
	    color: #fff;
	    border-radius: 25px;
	    padding: 0 10px;
	    margin: 0;
	    font-size: 14px;
	    text-align: center;
	    text-decoration: none;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    cursor: pointer;
	}
</style>


// WEBPACK FOOTER //
// src/pages/deliveryCard/power.vue