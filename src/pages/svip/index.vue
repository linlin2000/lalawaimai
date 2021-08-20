<template>
	<div id="svip-index">
		<div class="content">
			<div class="wrapper">
				<div class="card">
					<div class="card-top">
						<span>专享红包</span>
						<img src="static/img/svip-head.png" alt="">
						<span>下单奖励</span>
					</div>
					<h2 class="card-title">加入即可领{{config.exchange_max}}个红包</h2>
					<div class="card-description">开通超级会员，享受众多会员特权</div>
				</div>
				<div class="card-list">
					<div class="list-header">
						<h2 class="title-header">会员特权</h2>
					</div>
					<div class="list-bonus" @click="onTogglePopup">
						特权说明
						<van-icon name='question1'></van-icon>
					</div>
					<ul class="list-item">
						<li>
							<img src="static/img/svip-list-bg1.png" alt="">
							<span>专享红包</span>
						</li>
						<li>
							<img src="static/img/svip-list-bg2.png" alt="">
							<span>奖励金</span>
						</li>
						<li>
							<img src="static/img/svip-list-bg3.png" alt="">
							<span>专属客服</span>
						</li>
						<li>
							<img src="static/img/svip-list-bg4.png" alt="">
							<span>专属折扣</span>
						</li>
						<li>
							<img src="static/img/svip-list-bg5.png" alt="">
							<span>金币特权</span>
						</li>
					</ul>
				</div>
			</div>
			<div class="section">
				<div class="wrapper-item">
					<p class="title">
						<van-icon name='redpacket'></van-icon>
						<span>每月免费领红包</span>
					</p>
					<div class="description">会员期内每月可免费领取<span>{{config.exchange_max}}个</span>红包。</div>
				</div>
				<div class="list">
					<div class="wrapper-list">
						<div class="wrapper-group" v-for="item in redpackets" :key="item.id" v-if="item.sid == 0">
							<div class="amount-price">
								<i>￥</i>
								<span>{{item.discount}}</span>
							</div>
							<h4 v-if="item.condition == 0">无门槛红包</h4>
							<h4 v-else-if="item.condition > 0">满{{item.condition}}元可用</h4>
						</div>
					</div>
					<div class="section-list">
						<div class="section-group" v-for="item in redpackets" :key="item.id" v-if="item.sid > 0">
							<div class="wrapper-section-list">
								<div class="top">
									<div class="amount">
										<i>￥</i>
										<span>{{item.discount}}</span>
									</div>
									<span class="condition" v-if="item.condition == 0">无门槛红包</span>
									<span class="condition" v-else-if="item.condition > 0">满{{item.condition}}元可用</span>
								</div>
								<div class="footer">
									<span>{{item.store.title}}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="section">
				<div class="wrapper-item">
					<p class="title">
						<van-icon name='order'></van-icon>
						<span>会员任务奖励</span>
					</p>
					<div class="mission-info" v-if="tasks && tasks.length > 0" v-for="item in tasks">{{item.title}} 任务奖励{{item.award_cn}}</div>
					<div class="mission-info">任务所得奖励金，可兑换各类红包。</div>
				</div>
				<div class="section-list">
					<div class="section-group" v-for="item in redpackets" :key="item.id" v-if="item.can_exchange == 1">
						<div class="wrapper-section-list">
						<div class="top">
							<div class="amount">
								<i>￥</i>
								<span>{{item.discount}}</span>
							</div>
							<span class="condition" v-if="item.condition == 0">无门槛红包</span>
							<span class="condition" v-else-if="item.condition > 0">满{{item.condition}}元可用</span>
						</div>
						<div class="footer">
							<span>需{{item.exchange_cost}}个奖励金</span>
						</div>
					</div>
					</div>
				</div>
			</div>
			<div class="section">
				<div class="wrapper-item">
					<p class="title">
						<span class="icon icon-discount"></span>
						<span>专属折扣</span>
					</p>
					<div class="description">购物享专属特价，万款特价菜等您选购。</div>
				</div>
				<div class="discount-img">
					<img class="img-100" src="https://fuss10.elemecdn.com/8/16/414d1f47fe97488a7b2ee1a2845bcpng.png?imageMogr/format/webp/thumbnail/!651x189r/gravity/Center/crop/651x189/" alt="">
				</div>
			</div>
			<div class="go-member">
				<router-link :to="util.getUrl({path: 'package/pages/svip/purchase'})" class="button">
					<span>开通会员</span>
				</router-link>
			</div>
		</div>
		<van-popup v-model="agreementShow" position="bottom" class="agreement-popup">
			<van-nav-bar class="border-0px" title="会员特权说明" @click-left="onTogglePopup" :style="{background: '#ff2d4b', color: '#fff' }">
				<van-icon name="left" :style="{color: '#fff'}" slot="left" class="font-20"></van-icon>
			</van-nav-bar>
			<div class="popup-content margin-10" v-html="agreement"></div>
		</van-popup>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import {getData} from "@/controller/funcCommon"
	export default {
		data() {
			return {
				showPreLoading: true,
				agreementShow: false,
				agreement: '',
				redpackets: [],
				tasks: [],
				config: {}
			}
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'svip/index/index',
					data: {},
					success: (res) => {
						that.redpackets = res.redpackets;
						that.tasks = res.tasks;
						that.config = res.config;
						that.agreement = res.agreement;
					},
					fail: (res) => {
						if(res.errno == -2) {
							that.$router.replace(that.util.getUrl({path: '/package/pages/svip/mine'}))
						} else {
							that.util.$toast(res.message);
							return;
						}
					}, 
				})
			},
			onTogglePopup() {
				this.agreementShow = !this.agreementShow;
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#svip-index .content{
		padding-bottom: 65px;
	}
	#svip-index .content .wrapper{
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		padding: 2.135% 0 4%;
		width: 100%;
		background: #fff url(../../../static/img/svip-bg-head.png) 0 0 no-repeat;
		background-size: 100% auto;
	}
	#svip-index .content .wrapper .card{
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		padding-bottom: 20px;
		width: 83%;
	}
	#svip-index .content .wrapper .card .card-top{
		display: flex;
		align-items: center;
		justify-content: center;
		margin-top: 8.71%;
		line-height: 16px;
		color: #735b27;
		font-size: 14px;
	}
	#svip-index .content .wrapper .card .card-top:before{
		display: block;
		margin: 0 10px;
		width: 50px;
		height: 1px;
		background: #735b27;
		content: "";
	}
	#svip-index .content .wrapper .card .card-top:after{
		display: block;
		margin: 0 10px;
		width: 50px;
		height: 1px;
		background: #735b27;
		content: "";
	}
	#svip-index .content .wrapper .card .card-top img{
		display: block;
		margin: 0 4px;
		width: 7.5px;
		height: 7.5px;
	}
	#svip-index .content .wrapper .card .card-top span{
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#svip-index .content .wrapper .card .card-title{
		position: relative;
		margin-top: 22px;
		color: #624e22;
		font-weight: 700;
		font-size: 30px;
		line-height: 46px;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-align: center;
	}
	#svip-index .content .wrapper .card .card-description{
		margin-top: 6.6px;
		color: #735b28;
		font-size: 17px;
		line-height: 24px;
		width: 100%;
		white-space: nowrap;
		overflow: hidden;
		text-align: center;
	}
	#svip-index .content .wrapper .card-list{
		position: relative;
		margin-top: 15px;
		width: 100%;
	}
	#svip-index .content .wrapper .card-list .list-header{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#svip-index .content .wrapper .card-list .list-header .title-header{
		color: #515151;
		font-weight: 700;
		line-height: 25px;
		font-size: 21px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#svip-index .content .wrapper .card-list .list-header .title-header:before{
		display: block;
		margin: 3.8px;
		width: 25.4px;
		height: 11px;
		background-image: url(../../../static/img/svip-title-head.png);
		background-position: 0 0;
		background-size: 100% auto;
		background-repeat: no-repeat;
		content: "";
	}
	#svip-index .content .wrapper .card-list .list-header .title-header:after{
		display: block;
		margin: 3.8px;
		width: 25.4px;
		height: 11px;
		background-image: url(../../../static/img/svip-title-head.png);
		background-position: 0 0;
		background-size: 100% auto;
		background-repeat: no-repeat;
		transform: scaleX(-1);
		content: "";
	}
	#svip-index .content .wrapper .card-list .list-bonus{
		position: absolute;
		color: #999;
		font-size: 13px;
		right: 18.7px;
		top: 5.5px;
	}
	#svip-index .content .wrapper .card-list .list-bonus .van-icon-question1{
		font-size: 15px;
		margin-left: 5px;
		color: #ccc;
	}
	#svip-index .content .wrapper .card-list .list-item{
		display: flex;
		justify-content: space-between;
		margin: 3.24% 4.24% 0;
		padding: 2%;
		background-color: #fff;
		box-shadow: 0 0.5px 1px 0 #e9e9e9;
	}
	#svip-index .content .wrapper .card-list .list-item li{
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}
	#svip-index .content .wrapper .card-list .list-item li img{
		display: block;
		width: 52.9px;
		height: 52.9px;
	}
	#svip-index .content .wrapper .card-list .list-item li span{
		margin-top: 3px;
		color: #999;
		font-size: 12px;
		line-height: 16px;
	}
	#svip-index .content .section{
		margin: 10px 0;
		padding: 0 7.5px;
		background: #fff;
	}
	#svip-index .content .section .wrapper-item{
		display: flex;
		align-items: center;
		flex-direction: column;
		padding: 10px 7.5px;
	}
	#svip-index .content .section .wrapper-item .title{
		justify-content: center;
		line-height: 48px;
	}
	#svip-index .content .section .wrapper-item .title .van-icon-redpacket{
		color: #D0A651;
		font-size: 19px;
		margin-right: 10px;
	}
	#svip-index .content .section .wrapper-item .title .van-icon-order{
		color: #D0A651;
		font-size: 19px;
		margin-right: 10px;
	}
	#svip-index .content .section .wrapper-item .title span{
		color: #333;
		font-weight: 700;
		font-size: 15px;
	}
	#svip-index .content .section .wrapper-item .description{
		color: #535353;
		font-size: 13px;
		line-height: 18px;
	}
	#svip-index .content .section .wrapper-item .mission-info{
		color: #535353;
		font-size: 13px;
		line-height: 18px;
		text-align: left;
		width: 100%;
	}
	#svip-index .content .section .wrapper-item .description span{
		color: #b97d2a;
	}
	#svip-index .content .section .list .wrapper-list{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		width: 100%;
		padding: 0 7.5px;
	}
	#svip-index .content .section .list .wrapper-list .wrapper-group{
		display: flex;
		margin-bottom: 8px;
		align-items: center;
		width: 48.7%;
		background: url(../../../static/img/svip-bg-redpack.png) 0 0 no-repeat;
		background-size: 100% 100%;
	}
	#svip-index .content .section .list .wrapper-list .wrapper-group .amount-price{
		align-items: flex-start;
		padding-left:7.5%;
		margin: 12.5% 0;
		width: 38%;
		color: #4a3a16;
		font-weight: 600;
	}
	#svip-index .content .section .list .wrapper-list .wrapper-group .amount-price i{
		float: left;
		font-size: 13px;
		font-style: normal;
		font-weight: 600;
	}
	#svip-index .content .section .list .wrapper-list .wrapper-group .amount-price span{
		font-size: 28px;
		font-style: normal;
		font-weight: 600;
		line-height: 20px;
	}
	#svip-index .content .section .list .wrapper-list .wrapper-group h4{
		width: 62%;
		padding-left: 7.5%;
		color: #333;
		font-weight: 700;
		font-size: 14px;
	}
	#svip-index .content .section .section-list{
		display: flex;
		justify-content: flex-start;
		flex-wrap: wrap;
		width: 100%;
		padding-bottom: 7.5px;
	}
	#svip-index .content .section .section-list .section-group{
		width: 33.33%;
	}
	#svip-index .content .section .section-list .wrapper-section-list{
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 7.5px;
		background: url(../../../static/img/svip-bg-redpack2.png) 0 0 no-repeat;
		background-size: 100% 100%;
	}
	#svip-index .content .section .section-list .wrapper-section-list .top{
		display: flex;
		flex-direction: column;
		align-items: center;
		padding-top: 16.39%;
	}
	#svip-index .content .section .section-list .wrapper-section-list .top .amount{
		display: flex;
		align-items: baseline;
		color: #4a3a16;
		font-weight: 600;
	}
	#svip-index .content .section .section-list .wrapper-section-list .top .amount i{
		font-style: normal;
		font-size: 12px;
		font-weight: 600;
	}
	#svip-index .content .section .section-list .wrapper-section-list .top .amount span{
		font-style: normal;
		font-size: 34px;
		font-weight: 600;
	}
	#svip-index .content .section .section-list .wrapper-section-list .top .condition{
		margin: 20% 0;
		color: #262626;
		font-weight: 700;
		font-size: 12px;
	}
	#svip-index .content .section .section-list .wrapper-section-list .footer{
		display: flex;
		align-items: center;
		justify-content: center;
		color: #262626;
		font-size: 12px;
		line-height: 34px;
		width: 83%;
	}
	#svip-index .content .section .section-list .wrapper-section-list .footer span{
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	#svip-index .content .go-member{
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 65px;
		background: #fff;
	}
	#svip-index .content .go-member .button{
		margin: 10px;
		width: 95%;
		height: 69.25%;
		border-radius: 3px;
		background: url(../../../static/img/svip-button.png) 0 0 no-repeat;
		background-size: cover;
		color: #cab96e;
		font-weight: 700;
		font-size: 18px;
		text-align: center;
	}
	#svip-index .content .go-member .button span{
		font-weight: 700;
		line-height: 45px;
	}
	#svip-index .content .section .wrapper-item .title .icon-discount{
		color: #D0A651;
		font-size: 17px;
		margin-right: 10px;
	}
	#svip-index .content .discount-img{
		width: 326px;
		height: 95px;
		margin: 0 10px 5px;
	}
	#svip-index .agreement-popup{
		height: 100%;
		width: 100%;
	}
	#svip-index .agreement-popup .popup-content{
		word-wrap: break-word;
	}
</style>


// WEBPACK FOOTER //
// src/pages/svip/index.vue