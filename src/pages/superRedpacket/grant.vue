<template>
	<div id="superRedpacket-grant">
		<div class="content" :style="{background: activity.data.activity.backgroundColor}">
			<div class="banner">
				<img :src="activity.data.activity.image" alt="">
			</div>		
			<div class="redpacket">
				<div class="redpacket-item activity-empty" v-if="activity.status != 1">
					活动已经过期啦
				</div>
				<div class="redpacket-item activity-empty" v-else-if="redpackets.length == 0">
					红包抢光啦
				</div>
				<template v-else-if="redpackets.length > 0">
					<div class="redpacket-item" v-for="item in redpackets" :key='item.id'>
						<div class="clearfix">
							<div class="image">
								<img src="static/img/superredpacket.png" alt="">
							</div>
							<div class="redpacket-info">
								<span class="redpacket-title" :style="{color: activity.data.activity.color}">{{item.title}}</span>
								<span class="use-condition">满{{item.condition}}可用</span>
							</div>
							<div class="price" :style="{color: activity.data.activity.color}">
								<span>￥</span>
								{{item.discount}}
							</div>
						</div>
						<div class="redpacket-bottom">
							<div class="use-days-limit">
								{{item.condition_cn}} {{item.category_cn ? item.category_cn : ''}} {{item.times_cn ? item.times_cn : ''}}
							</div>
							<router-link :to="util.getUrl({path: '/pages/home/index'})" class="to-use">去使用</router-link>
						</div>
					</div>
					<div class="get-success">
						<span>红包已放入账号:</span>
						<span>{{member.nickname}} {{member.mobile}}</span>
					</div>
					<router-link :to="util.getUrl({path: '/pages/home/index'})" class="immediate-use" :style="{background: activity.data.activity.button.backgroundColor,color: activity.data.activity.button.color}">立即使用</router-link>
					<router-link :to="util.getUrl({path: '/pages/member/redPacket/index'})" class="give-redpacket" :style="{background: activity.data.activity.button.backgroundColor,color: activity.data.activity.button.color}">查看我的红包</router-link>
				</template>
			</div>
			<div class="records-agreement">
				<div class="records-title">
					看看大家手气
				</div>
				<div class="records-container">
					<ul>
						<li v-for="item in rankings">
							<div class="item-content">
								<div class="item-media">
									<img v-if="item.avatar" :src="item.avatar" alt="">
									<img v-else src="static/img/head.png" alt="">
								</div>
								<div class="item-inner">
									<div class="item-title-row">
										<div class="item-title">{{item.nickname}}</div>
										<div class="item-after">{{item.total_discount}}元</div>
									</div>
									<div class="item-title-row">
										<div class="item-subtitle">{{item.granttime_cn}}</div>
										<div class="item-after color" v-if="member.ranking == 1">手气最佳</div>
									</div>
								</div>
							</div>
						</li>
					</ul>
				</div>
				<div class="agreement-title">
					活动规则
				</div>
				<div class="agreement-inner" v-html="activity.data.activity.agreement">					
				</div>
			</div>
		</div>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	export default {
		components: {

		},
  		data() {
  			return {
  				showPreLoading: true,
  				is_get: 0,
  				get_status: 0,
  				rankings: {},
				activity: {
					data:{
						activity:{}	
					}
				},
				member: {},
				redpackets: [],
  			}
  		},
  		methods: {
			onLoad() {
				this.util.request({
					url: 'superRedpacket/share/grant',
					data: {
						order_id: this.order_id
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						this.activity = result.message.activity;
						return false;
					} 
					result = result.message;
					this.activity = result.activity;
					this.get_status = result.get_status;
					if(this.get_status == 1) {
						this.util.$toast('领取红包成功', '', 1000);
					}
					this.is_get = result.is_get;
					if(this.is_get == 1) {
						this.util.$toast('您已领取过这个红包了', '', 1000);
					}
					this.redpackets = result.redpackets;
					this.rankings = result.rankings;
					this.member = result.member;
					this.util.setWXTitle(this.activity.name);
				})
			},
		},
		created() {
			this.query = this.$route.query;
			if(this.query) {
				this.order_id = this.query.order_id;
			}
		},
		mounted () {
			this.onLoad();
		},
	}
</script>

<style>
	#superRedpacket-grant .content{
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #e36e07;
		overflow-x: hidden;
        overflow-y: scroll;
	}
	#superRedpacket-grant .content::-webkit-scrollbar {
        display: none;
    }
    #superRedpacket-grant .content .banner{
    	line-height: 0.85;
    }
    #superRedpacket-grant .content .banner img{
		border: none;
	    max-width: 100%;
    }
    #superRedpacket-grant .content .redpacket{
		width: 95%;
		margin: 0 auto;
		background: rgba(255,255,255,0.6);
		border-radius: 3px;
		padding: 10px;
    }
    #superRedpacket-grant .content .redpacket .redpacket-item{
		box-sizing: border-box;
		min-height: 64px;
		background: url(https://xs01.meituan.net/waimai_c_activity_web/img/resource/red-enve2/result-bg.c1682c6b.png) no-repeat;
		background-size: 100% 100%;
		text-align: center;
		padding: 4px 16px 0;
		margin-bottom: 10px;
    }
    #superRedpacket-grant .content .redpacket .redpacket-item.activity-empty{
		height: 100px;
		line-height: 100px;
		padding: 0;
		font-size: 22px;
		font-weight: bold;
		color: #ccc;
		margin-bottom: 0;
    }
    #superRedpacket-grant .content .redpacket .redpacket-item .clearfix{
    	overflow: hidden;
    }
    #superRedpacket-grant .content .redpacket .redpacket-item .image{
		width: 50px;
		margin: 6px 10px 0 0;
		float: left;
    }
    #superRedpacket-grant .content .redpacket .redpacket-item .image img{
		width: 50px;
		height: 50px;
		border: none;
		max-width: 100%;
    }
    #superRedpacket-grant .content .redpacket .redpacket-item .redpacket-info{
		max-width: 118px;
		height: 56px;
		float: left;
    }
    #superRedpacket-grant .content .redpacket .redpacket-item .redpacket-info .redpacket-title{
	    display: block;
        color: #ef361e;
		max-width: 118px;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		font-size: 16px;
		margin-top: 10px;
		margin-bottom: 4px;
		line-height: 24px;
    }
    #superRedpacket-grant .content .redpacket .redpacket-item .redpacket-info .use-condition{
		font-size: 14px;
		color: #666;
		display: block;
		text-align: left;
		line-height: 21px;
    }
    #superRedpacket-grant .content .redpacket .redpacket-item .price{
		color: #ef361e;
		float: right;
		font-size: 44px;
		line-height: 56px;
    }
    #superRedpacket-grant .content .redpacket .redpacket-item .price span{
		font-size: 20px;
		font-weight: bold;
		margin-right: -10px;
    }
    #superRedpacket-grant .content .redpacket .redpacket-item .redpacket-bottom{
		color: #a9a9a9;
		font-size: 12px;
		padding: 4px 0;
		border-top: 1px dashed #eaeaea;
		overflow: hidden;
    }
    #superRedpacket-grant .content .redpacket .redpacket-item .redpacket-bottom .use-days-limit{
		max-width: 80%;
		text-align: left;
		float: left;
		line-height: 18px;
    }
    #superRedpacket-grant .content .redpacket .redpacket-item .redpacket-bottom .to-use{
		color: #ef361e;
		display: table-cell;
		vertical-align: middle;
		padding-left: 6px;
		float: right;
		line-height: 18px;
    }
    #superRedpacket-grant .content .redpacket .get-success{
	    margin: 10px 0;
	    text-align: center;
	    font-size: 15px;
	    color: #333;
	    line-height: 21px;
    }
    #superRedpacket-grant .content .redpacket .immediate-use{
    	display: block;
		background: #ff3f26;
		color: #fff;
		height: 48px;
	    line-height: 48px;
	    font-size: 17px;
	    padding: 0 10px;
	    border: none;
		text-align: center;
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
		border-radius: 5px;
    }
    #superRedpacket-grant .content .redpacket .give-redpacket{
    	display: block;
	    margin-top: 16px;
		background: #ff3f26;
		color: #fff;
		height: 48px;
	    line-height: 48px;
	    font-size: 17px;
	    padding: 0 10px;
	    border: none;
		text-align: center;
		text-decoration: none;
		text-overflow: ellipsis;
		white-space: nowrap;
		cursor: pointer;
		border-radius: 5px;
    }
    #superRedpacket-grant .content .records-agreement{
		width: 95%;
		margin: 10px auto 0;
		background: rgba(255,255,255,0.6);
		border-radius: 3px;
		padding: 10px 0;
    }
    #superRedpacket-grant .content .records-agreement .records-title{
		background: url(../../../static/img/bg-ling.png) no-repeat;
		background-size: 100% auto;
		background-position: 0;
		color: #333;
		text-align: center;
		font-weight: normal;
		margin: 5px auto 0;
		width: 95%;
		font-size: 16px;
    }
    #superRedpacket-grant .content .records-agreement .records-container{
    	margin: 0;
    	font-size: 17px;
    }
    #superRedpacket-grant .content .records-agreement .records-container ul{
		padding: 0 10px;
		background: none;
    }
    #superRedpacket-grant .content .records-agreement .records-container ul .item-content{
		display: flex;
		min-height: 44px;
		box-sizing: border-box;
		justify-content: space-between;
		-webkit-box-align: center;
    }
    #superRedpacket-grant .content .records-agreement .records-container ul .item-content .item-media{
    	padding: 9px 0 10px;
    	display: flex;
		box-sizing: border-box;
		justify-content: space-between;
		-webkit-box-align: center;
    }
    #superRedpacket-grant .content .records-agreement .records-container ul .item-content .item-media img{
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: none;
		max-width: 100%;
    }
    #superRedpacket-grant .content .records-agreement .records-container ul .item-content .item-inner{
		display: flex;
		width: 80%;
		min-height: 44px;
		padding-right: 15px;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		margin-left: 15px;
		display: block;
		padding-top: 10px;
		padding-bottom: 9px;
    }
    #superRedpacket-grant .content .records-agreement .records-container ul .item-content .item-inner .item-title-row{
		display: flex;
		-webkit-box-pack: justify;
		justify-content: space-between;
		line-height: 18px;
    }
    #superRedpacket-grant .content .records-agreement .records-container ul .item-content .item-inner .item-title-row .item-title{
		font-weight: normal;
		font-size: 13px;
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
		line-height: 19px;
    }
    #superRedpacket-grant .content .records-agreement .records-container ul .item-content .item-inner .item-title-row .item-after{
		font-weight: normal;
		font-size: 13px;
		color: #3d1415;
		display: inline-block;
		max-width: 300px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-height: 28px;
		margin-left: 50px;
		flex-shrink: 0;
		line-height: 19px;
    }
    #superRedpacket-grant .content .records-agreement .records-container ul .item-content .item-inner .item-title-row .item-after.color{
    	color: #ef361e;
    }
    #superRedpacket-grant .content .records-agreement .records-container ul .item-content .item-inner .item-title-row .item-subtitle{
		font-weight: normal;
		font-size: 11px;
		position: relative;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
    }
    #superRedpacket-grant .content .records-agreement .agreement-title{
		background: url(../../../static/img/bg-ling.png) no-repeat;
		background-size: 100% auto;
		background-position: 0;
		color: #333333;
		text-align: center;
		font-weight: normal;
		margin: 5px auto 0;
		width: 95%;
		font-size: 16px;
    }
    #superRedpacket-grant .content .records-agreement .agreement-inner{
		padding: 0 5%;
		font-size: 15px;
		line-height: 22px;
    }
</style>


// WEBPACK FOOTER //
// src/pages/superRedpacket/grant.vue