<template>
	<div id="shareRedpacket-repeat">
		<public-header title="分享有礼"></public-header>
		<div class="content">
			<div class="platform-ad">
				<img src="static/img/shareRedpacket-top.png" alt="">
			</div>
			<div class="cannot-get">
				<p class="notice">
					您已经是平台的老朋友啦<br>
					<small class="color-danger">仅限新用户参加</small>
				</p>
			</div>
			<div class="invite clearfix">
				<span class="pull-left"></span>
				<router-link :to="util.getUrl({path: '/package/pages/shareRedpacket/index'})">邀请好友,可以各赢大红包哦</router-link>
				<span class="pull-right"></span>
			</div>
			<router-link :to="util.getUrl({path: '/package/pages/shareRedpacket/index'})" class="invite-btn">送好友红包，奖励拿不停</router-link>
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

  			}
  		}
	}
</script>

<style>
	#shareRedpacket-repeat .content{
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
	#shareRedpacket-repeat .content::-webkit-scrollbar {
        display: none;
    }
    #shareRedpacket-repeat .van-nav-bar{
	    background-color: #fff!important;
	    color: #000!important;
    }
    #shareRedpacket-repeat .van-hairline--bottom .van-icon-left{
    	color: #000!important;
    }
    #shareRedpacket-repeat .content .platform-ad img{
		border: none;
		max-width: 100%;
    }
    #shareRedpacket-repeat .content .cannot-get{
		background: #ffee8a;
		line-height: 30px;
		width: 90%;
		font-size: 14px;
		margin: 6px auto;
		border: 2px solid #3d1e13;
		border-radius: 8px;
    }
    #shareRedpacket-repeat .content .cannot-get .notice{
	    margin: 2px 0;
    }
    #shareRedpacket-repeat .content .cannot-get .notice .color-danger{
	    color: #f6383a;
	    font-size: 12px;
    }
    #shareRedpacket-repeat .content .invite{
		font-size: 14px;
		padding: 20px 0;
		color: #3d1e13;
		width: 96%;
		margin: 30px auto 0;
		overflow: hidden;
    }
	#shareRedpacket-repeat .content .invite .pull-left{
		width: 15%;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		-ms-flex: 1;
		flex: 1;
		margin: 0 2%;
		display: block;
		border-bottom: 1px solid #333;
		float: left;
    }
    #shareRedpacket-repeat .content .invite a{
		width: 60%;
		color: #3d1e13;
		display: block;
		line-height: 40px;
		margin-top: -20px;
		float: left;
    }
    #shareRedpacket-repeat .content .invite .pull-right{
		width: 15%;
		-webkit-box-flex: 1;
		-webkit-flex: 1;
		-ms-flex: 1;
		flex: 1;
		margin: 0 2%;
		display: block;
		border-bottom: 1px solid #333;
		float: right;
    }
    #shareRedpacket-repeat .content .invite-btn{
		font-size: 14px;
		display: block;
		background-color: #f1491e;
		border-radius: 4px;
		width: 90%;
		margin: 10px auto 0;
		line-height: 48px;
		text-align: center;
		color: #fff;
    }
</style>


// WEBPACK FOOTER //
// src/pages/shareRedpacket/repeat.vue