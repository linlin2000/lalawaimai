<template>
	<div id="shareRedpacket-success">
		<public-header title="分享有礼"></public-header>
		<div class="content">
			<div class="platform-ad">
				<img src="static/img/shareRedpacket-top.png" alt="">
			</div>
			<div class="getsuccess">
				<p>恭喜你，成功领取了新用户红包</p>
				<p>快去<router-link :to="util.getUrl({path: '/pages/home/index'})">{{mall_title}}</router-link>订餐吧</p>
			</div>
			<div class="newuser-share">
				<div class="share-title">新用户专享红包</div>
				<p class="use-limit">仅限首单使用</p>
				<p class="limit-time">有效期{{record.follow_redpacket_days_limit}}天</p>
				<div class="packet-money">
					¥<span>{{record.follow_redpacket_discount}}</span>
				</div>
			</div>
			<div class="use-now">
				<router-link :to="util.getUrl({path: '/pages/home/index'})">立即使用</router-link>
			</div>
			<div class="invite">
				<router-link :to="util.getUrl({path: '/package/pages/shareRedpacket/index'})">邀请好友最高得{{redPacket.share_redpacket_max}}元</router-link>
			</div>
			<div class="activity-rule">
				<div class="rule-title">活动规则</div>
				<div class="agreement" v-html="redPacket.agreement"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		components: {
			PublicHeader
		},
  		data() {
  			return {
  				redPacket: {},
  				record: {},
  				mall_title: ''
  			}
  		},
  		methods: {
			onLoad() {
				this.util.request({
					url: 'shareRedpacket/share/success',
					data: {
						uid: this.uid,
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return false;
					}
					result = result.message;
					this.record = result.record;
					this.redPacket = result.redPacket;
					this.mall_title = result.mall_title;
				})
			},
		},
		created() {
			this.query = this.$route.query;
			if(this.query) {
				this.uid = this.query.uid;
			}
		},
		mounted () {
			this.onLoad();
		},
	}
</script>

<style>
	#shareRedpacket-success .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
	    background: url(../../../static/img/bgrepeat.png) repeat;
		overflow-x: hidden;
        overflow-y: scroll;
        padding: 20px 10px 0;
        text-align: center;
	}
	#shareRedpacket-success .content::-webkit-scrollbar {
        display: none;
    }
    #shareRedpacket-success .van-nav-bar{
	    background-color: #fff!important;
	    color: #000!important;
    }
    #shareRedpacket-success .van-hairline--bottom .van-icon-left{
    	color: #000!important;
    }
    #shareRedpacket-success .content .platform-ad img{
		border: none;
		max-width: 100%;
    }
    #shareRedpacket-success .content .getsuccess{
		border: 2px solid #3d1e13;
		background: #ffee8a;
		border-radius: 8px;
		padding: 15px 0;
    }
    #shareRedpacket-success .content .getsuccess p{
		margin: 0;
		font-size: 14px;
		line-height: 21px;
    }
    #shareRedpacket-success .content .getsuccess p a{
	    color: #f00;
    }
    #shareRedpacket-success .content .newuser-share{
		background: #fff;
		border-radius: 6px;
		margin: 15px 0;
		position: relative;
		text-align: left;
		padding: 10px 15px;
    }
    #shareRedpacket-success .content .newuser-share:before{
		content: "";
		width: 16px;
		height: 16px;
		background: #fbda29;
		position: absolute;
		top: 50%;
		margin-top: -8px;
		border-radius: 100%;
		left: -8px;
    }
    #shareRedpacket-success .content .newuser-share:after{
		content: "";
		width: 16px;
		height: 16px;
		background: #fbda29;
		position: absolute;
		top: 50%;
		margin-top: -8px;
		border-radius: 100%;
		right: -8px;
    }
    #shareRedpacket-success .content .newuser-share .share-title{
	    color: #f00;
	    line-height: 25px;
	    font-size: 17px;
    }
	#shareRedpacket-success .content .newuser-share .use-limit{
		font-size: 14px;
		color: #666;
		margin: 4px 0 10px;
		line-height: 21px;
    }
    #shareRedpacket-success .content .newuser-share .limit-time{
		font-size: 14px;
		color: #999;
		border-top: 1px dashed #a9a9a9;
		padding-top: 6px;
    }
    #shareRedpacket-success .content .newuser-share .packet-money{
		position: absolute;
		right: 15px;
		font-size: 20px;
		top: 0;
		color: #f00;
		line-height: 54px;
    }
    #shareRedpacket-success .content .newuser-share .packet-money span{
	    font-size: 36px;
    }
    #shareRedpacket-success .content .use-now{
		height: 40px;
		line-height: 40px;
		border-radius: 4px;
		background: #f1491e;
		margin: 15px 0;
    }
    #shareRedpacket-success .content .use-now a{
    	color: #fff;
    }
    #shareRedpacket-success .content .invite{
		height: 40px;
		line-height: 40px;
		border-radius: 4px;
		background: #f0f0f0;
		margin-bottom: 15px;
    }
    #shareRedpacket-success .content .invite a{
    	color: #333;
    }
    #shareRedpacket-success .content .activity-rule{
		border-radius: 4px;
		background: #ffee8a;
		border: 2px solid #3d1e13;
		padding: 10px 15px;
		margin-bottom: 10px;
    }
    #shareRedpacket-success .content .activity-rule .rule-title{
    	font-weight: 600;
    	line-height: 25px;
    }
    #shareRedpacket-success .content .activity-rule .agreement{
		text-align: left;
    }
</style>


// WEBPACK FOOTER //
// src/pages/shareRedpacket/success.vue