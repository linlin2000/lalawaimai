<template>
	<div id="deliveryCard-index">
		<public-header title="会员中心"></public-header>
		<div class="content">
			<div class="user-info">
				<div class="list-block media-list">
					<ul>
						<li>
							<div class="item-content">
								<div class="item-media">
									<img :src="member.avatar">
								</div>
								<div class="item-inner">
									<div class="item-title-row">
										<div class="item-title">
											{{member.nickname}}
											<img src="static/img/vip_effective.png" alt="" v-if="deliveryCard_setmeal_ok==1">
											<img src="static/img/vip_deprecated.png" alt="" v-else>
										</div>
									</div>
									<div class="item-subtitle">平台会员(免配送费)</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
			</div>
			<div class="card-img" v-if="deliveryCard_setmeal_ok == 1 || member.setmeal_id > 0">
				<img src="static/img/card-setmeal.png" alt="">
				<div class="card-info">
					<p class="use-date">会员期限：<span>{{member.setmeal_starttime}}</span>至<span>{{member.setmeal_endtime}}</span></p>
					<p class="use-times">每日可免费配送：<span>{{member.setmeal_day_free_limit > 0 ? member.setmeal_day_free_limit + '单' : '不限单数'}}</span></p>
					<p class="use-times" v-if="member.setmeal_deliveryfee_free_limit > 0">每单最高减免配送费：<span>{{member.setmeal_deliveryfee_free_limit}}元</span></p>
					<p class="use-times" v-else>每单配送费全免</p>
				</div>
			</div>
			<div class="card-img" v-else>
				<img src="static/img/card.png">
			</div>
			<div class="card-box">
				<div class="left van-hairline--right" >
					<router-link :to="util.getUrl({path: '/pages/deliveryCard/power'})">
						<img src="static/img/card-mian.png" alt="">
						<p>平台配送免配送费</p>
					</router-link>
				</div>
				<div class="right">
					<img src="static/img/card-more.png" alt="">
					<p>敬请期待</p>
				</div>
			</div>
			<p class="card-agreement">
				<a class="open-popup" @click="onChangePopup">
					<van-icon name='question-circle' class="icon"></van-icon>
					会员卡规则
				</a>
			</p>
		</div>
		<nav class="footer-bar" >
			<div class="pay-btn" v-if="deliveryCard_setmeal_ok == 1 || member.setmeal_id > 0"><router-link :to="util.getUrl({path: '/pages/deliveryCard/apply'})" >马上续费</router-link></div>
			<div class="pay-btn" v-else><router-link :to="util.getUrl({path: '/pages/deliveryCard/apply'})" >开通会员</router-link></div>
		</nav>
		<van-popup v-model="agreementShow" position="bottom" class="agreement-popup">
			<van-nav-bar class="border-0px" title="会员规则详解" @click-left="onChangePopup" :style="{background: '#ff2d4b', color: '#fff' }">
				<van-icon name="left" :style="{color: '#fff'}" slot="left" class="font-20"></van-icon>
			</van-nav-bar>
			<div class="popup-content margin-10" v-html="agreement"></div>
		</van-popup>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		data() {
			return {
				member: {},
				deliveryCard_setmeal_ok: 0,
				agreement: '',
				agreementShow: false,
			}
		},
		components: {
			PublicHeader,
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'deliveryCard/index',
				}).then((res) => {
					let result = res.data.message.message;
					this.member = result.member;
					this.deliveryCard_setmeal_ok = result.deliveryCard_setmeal_ok;
					this.agreement = result.agreement;
				})
			},
			onChangePopup() {
				this.agreementShow = !this.agreementShow;
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	body{
		background: #fff;
	}
	#deliveryCard-index .user-info{
		padding: 0 15px;
	}
	#deliveryCard-index .user-info .list-block{
		margin: 0;
		font-size: 17px;
	}
	#deliveryCard-index .user-info .list-block ul{
	    position: relative;
	    padding: 0;
	    margin: 0;
	    list-style: none;
	    /*background-color: #fff;*/
	}
	#deliveryCard-index .user-info .list-block ul li{
		position: relative;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
	}
	#deliveryCard-index .user-info .list-block ul li .item-content{
	    display: flex;
	    min-height: 44px;
	    box-sizing: border-box;
	    -webkit-box-pack: justify;
	    -ms-flex-pack: justify;
	    -webkit-box-align: center;
	    align-items: center;
	}
	#deliveryCard-index .user-info .list-block ul li .item-content .item-media{
	    padding-top: 9px;
	    padding-bottom: 10px;
	}
	#deliveryCard-index .user-info .list-block ul li .item-content .item-media img{
		width: 44px;
		border-radius: 100%;
	}
	#deliveryCard-index .user-info .list-block ul li .item-content .item-inner{
	    display: block;
	    padding-top: 10px;
	    padding-bottom: 9px;
	    -ms-flex-item-align: stretch;
	    -webkit-align-self: stretch;
	    align-self: stretch;
        margin-left: 15px;
        width: 100%;
	}
	#deliveryCard-index .user-info .list-block ul li .item-content .item-inner .item-title-row .item-title{
	    font-weight: 500;
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    line-height: 25px;
	}
	#deliveryCard-index .user-info .list-block ul li .item-content .item-inner .item-title-row .item-title img{
		width: 28px;
	    vertical-align: middle;
	}
	#deliveryCard-index .user-info .list-block ul li .item-content .item-inner .item-subtitle{
	    color: #aaa;
	    font-size: 12px;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    overflow: hidden;
	    line-height: 20px;
	}
	#deliveryCard-index .card-img{
		padding: 15px 20px;
	    position: relative;
	}
	#deliveryCard-index .card-img img{
		border: none;
		max-width: 100%;
	}
	#deliveryCard-index .card-img .card-info{
	    position: absolute;
	    bottom: 30px;
	    left: 20px;
	    background: none;
	    overflow: hidden;
	}
	#deliveryCard-index .card-img .card-info p{
		color: #fff;
		margin: 0 0 0 10px;
		font-size: 14px;
		line-height: 21px;
	}
	#deliveryCard-index .card-box{
	    overflow: hidden;
	    padding-top: 30px;
	}
	#deliveryCard-index .card-box .left{
	    float: left;
	    width: 50%;
	    text-align: center;
	}
	#deliveryCard-index .card-box .left img{
	    max-width: 45px;
	}
	#deliveryCard-index .card-box .left p{
	    margin: 0;
	    font-size: 14px;
	    color: #808080;
	    margin-bottom: 10px;
	    line-height: 21px;
	}
	#deliveryCard-index .card-box .right{
	    float: left;
	    width: 50%;
	    text-align: center;
	}
	#deliveryCard-index .card-box .right img{
	    max-width: 45px;
	}
	#deliveryCard-index .card-box .right p{
	    margin: 0;
	    font-size: 14px;
	    color: #808080;
	    margin-bottom: 10px;
	    line-height: 21px;
	}
	#deliveryCard-index .card-agreement{
	    text-align: center;
	    font-size: 12px;
	    margin: 20px 0;
	}
	#deliveryCard-index .card-agreement .open-popup{
		color: #aaa;
	}
	#deliveryCard-index .footer-bar{
		width: 100%;
	    height: 50px;
	    line-height: 50px;
	    background: #ff2d4b;
	    text-align: center;
	    position: absolute;
	    bottom: 0;
	}
	#deliveryCard-index .footer-bar .pay-btn a{
		color: #fff;
	}
	#deliveryCard-index .agreement-popup{
		height: 100%;
		width: 100%;
	}
</style>


// WEBPACK FOOTER //
// src/pages/deliveryCard/index.vue