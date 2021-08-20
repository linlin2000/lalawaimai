<template>
	<div id="shareRedpacket-index">
		<public-header :title="redPacket.title"></public-header>
		<div class="content">
			<div class="init-area">
				<img src="static/img/init_pic.png" alt="">
			</div>
			<div class="init-info">
				<img src="static/img/init_bg.png" alt="">
				<div class="init-con">
					<div class="init-text">
						送好友最高<span>{{redPacket.follow_redpacket_max}}</span>红包，TA首次下单您也得
					</div>
					<div class="init-money">
						<i>￥</i>
						{{redPacket.share_redpacket_max}}
					</div>
					<div class="init-btn">
						<div  @click="onChangeZhezhao()">发红包</div>
					</div>
				</div>
			</div>
			<div class="init-status">
				<div class="buttons-tab">
					<div @click="onChangeStatus('invite')" class="button" :class="{active: type == 'invite'}"><span>邀请奖励</span></div>
					<div @click="onChangeStatus('ranking')" class="button" :class="{active: type == 'ranking'}"><span>排行榜</span></div>
					<div @click="onChangeStatus('agreement')" class="button" :class="{active: type == 'agreement'}"><span>活动规则</span></div>
				</div>
				<template v-if="type == 'invite'">
					<div class="init-title" >
						<div class="init-tab van-hairline--right">
							<p class="init-tab-h">
								<van-icon name='selection'></van-icon>
								成功邀请
							</p>
							<p class="init-tab-c">
								{{total}}
								<span>人</span>
							</p>
						</div>
						<div class="init-tab">
							<p class="init-tab-h">
								<van-icon name='sponsorfill'></van-icon>
								赚取红包
							</p>
							<p class="init-tab-c">
								{{redPacket_num}}
								<span>元</span>
							</p>
						</div>
					</div>
					<div class="init-friend">
						共有	<span>{{total}}</span>人接受了我的邀请
					</div>
				</template>
				<div class="list-block" v-if="type == 'invite'">
					<van-list v-model="invited_info.loading"  :finished="invited_info.finished" @load="onLoad" v-if="invited_info.data.length > 0" :offset="100" :immediate-check="false">
						<ul class="invite-list">
							<li class="van-hairline--bottom" v-for="item in invited_info.data" :key="item.id"> 
								<div class="item-content">
									<div class="item-media">
										<img v-if="item.avatar" :src="item.avatar" alt="">
										<img v-else src="static/img/head.png" alt="">
									</div>
									<div class="item-inner">
										<div class="item-title-row">
											<div class="item-title">{{item.nickname}}</div>
										</div>
										<div class="item-subtitle">领取了您的红包</div>
										<div class="init-wait" v-if="item.status == 1">
											<p>已经下单了</p>
											<span>您获得</span>{{item.share_redpacket_discount}}<span>元红包</span>
										</div>
										<div class="init-wait" v-else>等待下单</div>
									</div>
								</div>
							</li>
						</ul>
					</van-list>
				</div>
				<div class="list-block" v-if="type == 'ranking'">
					<van-list v-model="rank.loading"  :finished="rank.finished" @load="onGetRank" v-if="rank.data.length > 0" :offset="100" :immediate-check="false">
						<ul class="invite-list">
							<li class="van-hairline--bottom" v-for="item in rank.data" :key="item.id">
								<div class="item-content">
									<div class="item-media">
										<img v-if="item.avatar" :src="item.avatar" alt="">
										<img v-else src="static/img/head.png" alt="">
									</div>
									<div class="item-inner">
										<div class="item-title-row">
											<div class="item-title">{{item.nickname}}</div>
											<div class="item-after">邀请{{item.total}}人</div>
										</div>
									</div>
								</div>
							</li>
						</ul>
					</van-list>
				</div>
				<div class="agreement" v-if="type == 'agreement'" v-html="redPacket.agreement">
				</div>
			</div>
		</div>
		<div class="share-zhezhao" @click="onChangeZhezhao()" v-if="zhezhaoShow">
			<img src="static/img/share-layer.png" alt="">
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
  				type: 'invite',
  				total: 0,
  				redPacket_num: 0,
  				redPacket: {},
  				invited_info: {
  					page: 1,
  					psize: 15,
  					loading: false,
					finished: false,
					empty: false,
					data: []
  				},
  				rank: {
  					page: 1,
  					psize: 15,
  					loading: false,
					finished: false,
					empty: false,
					data: []
  				},
  				share: {},
  				zhezhaoShow: false
  			}
  		},
  		methods: {
  			onChangeStatus(type) {
  				this.type = type;
  				if(type == 'ranking') {
  					this.onGetRank();
  				}else if(type == 'invite') {
  					this.onLoad();
  				}
  			},
			onLoad() {
				if(this.invited_info.finished) {
					return false;
				}
				if(this.invited_info.loading) {
					return false;
				}
				this.invited_info.loading = true;
				this.util.request({
					url: 'shareRedpacket/index/invite',
					data: {
						page: this.invited_info.page,
  						psize: this.invited_info.psize
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return false;
					}
					result = result.message;
					this.total = result.total;
					this.redPacket_num = result.redPacket_num || 0;
					this.redPacket = result.redPacket;
					this.share = result.share;
					this.invited_info.data = [...this.invited_info.data, ...result.invited_info];
					if(result.invited_info.length < this.invited_info.psize) {
						this.invited_info.finished = true;
					}
					if(this.invited_info.data.length == 0) {
						this.invited_info.empty = true;
					}
					this.invited_info.loading = false;
					this.invited_info.page++;
				})
			},
			onGetRank() {
				if(this.rank.finished) {
					return false;
				}
				if(this.rank.loading) {
					return false;
				}
				this.rank.loading = true;
				this.util.request({
					url: 'shareRedpacket/index/ranking',
					data: {
						page: this.rank.page,
  						psize: this.rank.psize
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return false;
					}
					result = result.message;
					this.rank.data = [...this.rank.data, ...result.rankings];
					if(result.rankings.length < this.rank.psize) {
						this.rank.finished = true;
					}
					if(this.rank.data.length == 0) {
						this.rank.empty = true;
					}
					this.rank.loading = false;
					this.rank.page++;
				})
			},
			onChangeZhezhao() {
				this.zhezhaoShow = !this.zhezhaoShow;
			}
		},
		mounted () {
			this.onLoad();
		},
	}
</script>

<style>
	#shareRedpacket-index .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
	    background: #fe6241;
		overflow-x: hidden;
        overflow-y: scroll;
	}
	#shareRedpacket-index .content::-webkit-scrollbar {
        display: none;
    }
    #shareRedpacket-index .van-nav-bar{
	    background-color: #fff!important;
	    color: #000!important;
    }
    #shareRedpacket-index .van-hairline--bottom .van-icon-left{
    	color: #000!important;
    }
	#shareRedpacket-index .content .init-area img{
		border: none;
		max-width: 100%;
    }
    #shareRedpacket-index .content .init-info{
		padding: 10px;
		position: relative;
    }
    #shareRedpacket-index .content .init-info img{
		border: none;
		max-width: 100%;
    }
    #shareRedpacket-index .content .init-info .init-con{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		text-align: center;
    }
    #shareRedpacket-index .content .init-info .init-con .init-text{
	    margin-top: 24px;
	    font-size: 14px;
	    line-height: 21px;
    }
    #shareRedpacket-index .content .init-info .init-con .init-text>span{
    	color: #f00;
    }
    #shareRedpacket-index .content .init-info .init-con .init-money{
		position: absolute;
		top: 15%;
		font-size: 48px;
		color: #f00;
		width: 100%;
		line-height: 72px;
    }
    #shareRedpacket-index .content .init-info .init-con .init-money>i{
    	font-style: normal;
    	font-size: 20px;
    	margin-right: -15px;
    }
    #shareRedpacket-index .content .init-info .init-con .init-btn{
		position: absolute;
		top: 52%;
		width: 84%;
		height: 50px;
		line-height: 50px;
		background: #ffd400;
		margin: 0 8%;
		border-radius: 6px;
    }
    #shareRedpacket-index .content .init-info .init-con .init-btn a{
    	color: #cc5400;
    }
    #shareRedpacket-index .content .init-status{
		background: #fff;
		border-radius: 6px;
		margin: 10px;
		margin-top: 0;
		padding-bottom: 10px;
    }
    #shareRedpacket-index .content .init-status .buttons-tab{
		border: none;
		background-color: #fe6241;
		position: relative;
		z-index: 10;
		display: flex;
		align-self: center;
		flex-wrap: nowrap;
    }
    #shareRedpacket-index .content .init-status .buttons-tab .button.active{
		border: 0;
		background-color: #fff;
		color: #ff2d4b;
    }
    #shareRedpacket-index .content .init-status .buttons-tab .button{
		position: relative;
		display: block;
		border-top-left-radius: 6px;
		border-top-right-radius: 6px;
		margin-right: 6px;
		background-color: #b30f18;
		color: #fff;
		bottom: 0;
		margin-right: 6px;
		z-index: 100;
		font-size: 14px;
		width: 100%;
		height: 40px;
		line-height: 40px;
		-webkit-box-flex: 1;
		text-align: center;
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
		box-sizing: border-box;
		-webkit-appearance: none;
		padding: 0 10px;
    }
    #shareRedpacket-index .content .init-status .buttons-tab .button:last-child{
    	margin-right: 0;
    }
    #shareRedpacket-index .content .init-status .init-title{
		height: 80px;
		background: #f2f2f2;
		text-align: center;
		padding: 10px 0;
		overflow: hidden;
    }
    #shareRedpacket-index .content .init-status .init-title .init-tab{
		width: 50%;
		float: left;
    }
    #shareRedpacket-index .content .init-status .init-title .init-tab .init-tab-h{
	    font-size: 14px;
	    line-height: 24px;
	    margin: 0;
    }
    #shareRedpacket-index .content .init-status .init-title .init-tab .init-tab-h .van-icon{
		font-size: 16px;
		color: #666;
    }
    #shareRedpacket-index .content .init-status .init-title .init-tab .init-tab-c{
		color: #ccc;
		font-size: 30px;
		line-height: 1.4;
		margin: 0;
    }
    #shareRedpacket-index .content .init-status .init-title .init-tab .init-tab-c>span{
    	font-size: 12px;
    	margin-left: -5px;
    }
    #shareRedpacket-index .content .init-status .init-friend{
		text-align: center;
		position: relative;
		margin: 20px 0;
		color: #9d9390;
		font-size: 16px;
		line-height: 24px;
    }
    #shareRedpacket-index .content .init-status .init-friend>span{
    	color: #f00;
    }
    #shareRedpacket-index .content .init-status .init-friend:before{
		position: absolute;
		left: 10px;
		content: "";
		width: 40px;
		height: 2px;
		background: #efeceb;
		top: 50%;
    }
    #shareRedpacket-index .content .init-status .init-friend:after{
		position: absolute;
		right: 10px;
		content: "";
		width: 40px;
		height: 2px;
		background: #efeceb;
		top: 50%;
    }
    #shareRedpacket-index .content .init-status .list-block{
    	margin: 0;
    	font-size: 17px;
    }
    #shareRedpacket-index .content .init-status .list-block .invite-list{
		position: relative;
		padding: 0 10px;
		margin: 0;
		list-style: none;
		background-color: #fff;
		border: 0;
    }
    #shareRedpacket-index .content .init-status .list-block .invite-list .item-content{
		display: flex;
		min-height: 44px;
		box-sizing: border-box;
		-webkit-box-pack: justify;
		justify-content: space-between;
		-webkit-box-align: center;
    }
    #shareRedpacket-index .content .init-status .list-block .invite-list .item-content .item-media{
		display: flex;
		padding-top: 9px;
		padding-bottom: 10px;
		flex-shrink: 0;
		flex-wrap: nowrap;
		-webkit-box-align: center;
		align-items: center;
		box-sizing: border-box;
    }
    #shareRedpacket-index .content .init-status .list-block .invite-list .item-content .item-media img{
		display: block;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: none;
		max-width: 100%;
    }
    #shareRedpacket-index .content .init-status .list-block .invite-list .item-content .item-inner{
		display: block;
		padding: 10px 15px 9px 0;
		-ms-flex-item-align: stretch;
		-webkit-align-self: stretch;
		align-self: stretch;
		margin-left: 15px;
	    width: 100%;
	    box-sizing: border-box;
    }
    #shareRedpacket-index .content .init-status .list-block .invite-list .item-content .item-inner .item-title-row{
		display: flex;
		-webkit-box-pack: justify;
		justify-content: space-between;
		line-height: 18px;
    }
    #shareRedpacket-index .content .init-status .list-block .invite-list .item-content .item-inner .item-title-row .item-title{
		font-weight: normal;
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
    #shareRedpacket-index .content .init-status .list-block .invite-list .item-content .item-inner .item-title-row .item-after{
		font-weight: normal;
		font-size: 12px;
		display: inline-block;
		max-width: 300px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-left: 5px;
		color: #5f646e;
		flex-shrink: 0;
    }
    #shareRedpacket-index .content .init-status .list-block .invite-list .item-content .item-inner .item-subtitle{
		font-weight: normal;
		font-size: 12px;
		position: relative;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 18px;
    }
    #shareRedpacket-index .content .init-status .list-block .invite-list .item-content .item-inner .init-wait{
		position: absolute;
		top: 50%;
		margin-top: -14px;
		right: 0;
		font-size: 12px;
    }
    #shareRedpacket-index .content .init-status .agreement{
        padding: 10px 16px 0;
    } 
</style>


// WEBPACK FOOTER //
// src/pages/shareRedpacket/index.vue