<template>
	<div id="pintuan-share">
		<public-header title="拼团进行中"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<div class="goods-info margin-15 padding-15 bg-default flex-lr">
				<div class="thumb">
					<img class="img-100" :src="detail.thumb" alt="">
					<div class="mark">
						{{detail.peoplenum}}人团
					</div>
				</div>
				<div class="info">
					<div class="font-14">
						<div class="flex-lr margin-10-b">
							<div class="font-500 ellipsis" v-if="detail.store">{{detail.store.title}}</div>
						</div>
						<p>{{detail.name}}</p>
					</div>
					<div class="flex-lr-bottom w-100">
						<div>
							<div class="flex">
								<span class="c-danger font-500 font-15 margin-5-r">¥{{detail.price}}</span>
								<div class="c-gray line-through font-12">¥{{detail.oldprice}}</div>
								<div class="discount">{{detail.discount}}折</div>
							</div>
							<div class="bar" :class="{'bar-end': detail.total == 0}">
								<div class="bar-inner" :style="'width:' + detail.sailed_percent + '%'" v-if="detail.total != -1"></div>
								<div class="bar-text" style="width: 0%">已团{{detail.falesailed_total}}份</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="padding-15 margin-15 bg-default">
				<div class="flex-lr padding-15-b van-hairline--bottom">
					<div class="step-item active">
						<span class="step-number active">
							<div class="step-number-inner">1</div>
						</span>
						<div class="step-title active">发起拼团</div>
					</div>
					<div class="step-item" :class="{active: (team[0].status > 2 && team[0].status < 7)}">
						<span class="step-number active">
							<div class="step-number-inner">2</div>
						</span>
						<div class="step-title active">邀请好友参团</div>
					</div>
					<div class="step-item">
						<span class="step-number" :class="{active: (team[0].status > 2 && team[0].status < 7)}">
							<div class="step-number-inner">3</div>
						</span>
						<div class="step-title" :class="{active: (team[0].status > 2 && team[0].status < 7)}">拼团成功</div>
					</div>
				</div>
				<div class="take-info van-hairline--bottom" v-if="team && team[0]">
					<template v-if="team[0].status == 2">
						<!--拼团中-->
						<p>已有{{team[0].takepart_num}}人参与, 还差<span class="c-danger font-18 margin-5-r margin-5-l font-500">{{team[0].team_num - team[0].takepart_num}}</span>人拼团成功</p>
						<div class="flex margin-15-t">
							<span class="c-gray margin-5-r">距结束仅剩</span>
							<count-down :endTime="team[0].overtime"></count-down>
						</div>
					</template>
					<template v-else-if="team[0].status > 2 && team[0].status < 7">
						<!--拼团成功-->
						<div class="flex">
							<img class="success-star" src="static/img/pintuan_success_star.png" alt="">
							<span class="font-16 c-danger">恭喜，顺利成团啦！</span>
						</div>
					</template>

					<div class="avatars margin-15-t">
						<div class="avatar-item" v-for="(item, index) in team" :key="'a' + index" v-if="index < 3">
							<img class="img-100" :src="item.avatar" alt="">
							<div class="mark" v-if="item.id == item.team_id">团长</div>
						</div>
						<div class="avatar-item empty" v-if="team[0].status < 3">?</div>
					</div>
					<template v-if="member.is_takepart">
						<!--拼团中-->
						<div class="btn-invite" @click="zhezhaoShow = !zhezhaoShow">邀请好友</div>
					</template>
					<template v-else>
						<!--拼团成功-->
						<div class="btn-group flex-lr">
							<router-link tag="div" class="btn-item" :to="util.getUrl({path: '/gohome/pages/pintuan/create', query: {id: id, team_id: team_id}})">我要参团</router-link>
							<router-link tag="div" class="btn-item new" :to="util.getUrl({path: '/gohome/pages/pintuan/create', query: {id: id, is_team: 1}})">我要开团</router-link>
						</div>
					</template>
				</div>
				<p class="font-12 c-gray margin-15-t">邀请好友来参团，{{detail.grouptime}}小时内拼团成功发货，不成功自动退款</p>
			</div>
			<div class="padding-15-lr margin-15-t font-14 c-gray">更多拼团</div>
			<div class="activity-list">
				<div class="activity-item" v-for="(item, index) in more_activity" :key="index">
					<router-link tag="div" class="item-inner bg-default" :to="util.getUrl({path: '/gohome/pages/pintuan/detail', query: {id: item.id}})">
						<div class="thumb">
							<img class="img-100" :src="item.thumb" alt="">
							<div class="mark">
								{{item.peoplenum}}人团
							</div>
						</div>
						<div class="goods-title padding-10-lr">{{item.name}}</div>
						<div class="flex-lr padding-10-lr padding-10-b">
							<div class="flex">
								<span class="c-danger font-500 font-15 margin-5-r">¥{{item.price}}</span>
								<div class="c-gray line-through font-12">¥{{item.oldprice}}</div>
							</div>
							<div class="c-gray font-12">已售{{item.falesailed_total}}份</div>
						</div>
					</router-link>
				</div>
			</div>
		</div>
		<transition name="van-fade">
			<div class="share-zhezhao" @click="zhezhaoShow = !zhezhaoShow" v-if="zhezhaoShow">
				<img src="static/img/share-layer.png" alt="">
			</div>
		</transition>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	import CountDown from '@/components/countDown'
	import {getData} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
			PublicFooter,
			CountDown,
		},
		data() {
			return {
				showPreLoading: true,
				zhezhaoShow: false,
				detail: {},
				more_activity: {},
				member: {},
				team: [],
				menufooter: {},
			}
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'pintuan/index/share',
					data: {
						id: that.id,
						team_id: that.team_id,
						menufooter: 1
					},
					success: function(res) {
						that.detail = res.detail;
						that.member = res.member;
						that.team = res.team;
						that.more_activity = res.more_activity;
						that.menufooter = window.menufooter;
						var shareData = window._share;
						if(shareData) {
							shareData.success = function() {
								that.util.request({
									url: 'gohome/common/share',
									data: {id: that.id, type: 'pintuan'}
								}).then((res) => {})
							}
						}
						that.wx.share(shareData);
					}
				})
			},
		},
		created() {
			if(this.$route.query) {
				if(this.$route.query.team_id > 0) {
					this.team_id = this.$route.query.team_id;
				}
				if(this.$route.query.id > 0) {
					this.id = this.$route.query.id
				}
			}
		},
		mounted(){
			this.onLoad();
		}
	}
</script>

<style>
	#pintuan-share .goods-info .thumb{
		position: relative;
		width: 100px;
		height: 100px;
		border-radius: 2px;
		overflow: hidden;
	}
	#pintuan-share .thumb .mark{
		position: absolute;
		width: 44px;
		height: 28px;
		top: 0;
		left: 10px;
		padding-top: 4px;
		background: url('../../../../static/img/robot.png') no-repeat;
		background-size: 100% 100% ;
		color: #fff;
		font-size: 12px;
		text-align: center;
	}
	#pintuan-share .goods-info .info{
		flex: 1;
		padding-left: 10px;
		height: 100px;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
	}
	#pintuan-share .goods-info .info .discount{
		position: relative;
		padding: 3px 5px 3px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		background-color: #FED4D5;
		color: #C51C33;
		margin-left: 15px;
	}
	#pintuan-share .goods-info .info .discount:before{
		content: "";
		display: block;
		border-width: 8px;
		position: absolute;
		left: -8px;
		transform: translateX(-50%);
		border-style: solid dashed dashed;
		border-color:  transparent #FED4D5 transparent transparent   ;
		font-size: 0;
		line-height: 0;
		z-index: 10;
	}
	#pintuan-share .goods-info .bar{
		width: 150px;
		height: 14px;
		border-radius: 20px;
		background-color: #FED4D5;
		position: relative;
		margin-top: 10px;
	}
	#pintuan-share .goods-info .bar.bar-end{
		background-color: #959595;
	}
	#pintuan-share .goods-info .bar .bar-inner{
		position: absolute;
		z-index: 1;
		top: 0;
		left: 0;
		bottom: 0;
		border-radius: 20px;
		background: -webkit-linear-gradient(left, #FD6131, #FE0000);
		background: -o-linear-gradient(right, #FD6131, #FE0000);
		background: -moz-linear-gradient(right, #FD6131, #FE0000);
		background: linear-gradient(to right, #FD6131 , #FE0000);
	}
	#pintuan-share .goods-info .bar .bar-text{
		position: absolute;
		z-index: 2;
		top: 0;
		left: 0;
		bottom: 0;
		padding-left: 10px;
		display: flex;
		align-items: center;
		font-size: 10px;
		color: #fff;
		min-width: 80px;
	}
	#pintuan-share .step-item{
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
		font-size: 14px;
		width: 33.33%;
		position: relative;
	}
	#pintuan-share .step-item:before{
		position: absolute;
		content: '';
		top: 10px;
		left: 50%;
		width: 100%;
		border: 1px solid #D6D6D6;
	}
	#pintuan-share .step-item:last-child:before{
		display: none;
	}
	#pintuan-share .step-item .step-number{
		width: 22px;
		height: 22px;
		border-radius: 50%;
		border: 1px solid #D6D6D6;
		padding: 1px;
		margin-bottom: 10px;
		position: relative;
		background-color: #fff;
	}
	#pintuan-share .step-item .step-number .step-number-inner{
		width: 100%;
		height: 100%;
		border-radius: 50%;
		background-color: #d6d6d6;
		color: #fff;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
	}
	#pintuan-share .step-item .step-title{
		color: #d6d6d6;
	}
	#pintuan-share .step-item.active:before,#pintuan-share .step-item .step-number.active{
		border-color: #ff2d4b;
	}
	#pintuan-share .step-item .step-number.active  .step-number-inner{
		background-color: #ff2d4b;
	}
	#pintuan-share .step-item .step-title.active{
		color: #ff2d4b;
	}
	#pintuan-share .take-info{
		padding: 15px 0;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
		font-size: 14px;
	}
	#pintuan-share .take-info .success-star{
		width: 50px;
		margin-right: 10px;
	}
	#pintuan-share .take-info .timer span{
		background-color: #ff2d4b;
		color: #fff;
		font-size: 12px;
		padding: 3px 3px;
		border-radius: 3px;
		margin: 0 3px;
	}
	#pintuan-share .take-info .btn-invite{
		width: 80%;
		padding: 15px 0;
		color: #fff;
		border-radius: 100px;
		text-align: center;
		font-size: 16px;
		margin-top: 15px;
		background: -webkit-linear-gradient(left, #FD6131, #FE0000);
		background: -o-linear-gradient(right, #FD6131, #FE0000);
		background: -moz-linear-gradient(right, #FD6131, #FE0000);
		background: linear-gradient(to right, #FD6131 , #FE0000);
	}
	#pintuan-share .take-info .btn-group{
		margin-top: 15px;
		width: 100%;
		padding: 0 15px;
	}
	#pintuan-share .take-info .btn-group .btn-item{
		width: 45%;
		padding: 10px 0;
		color: #fff;
		border-radius: 100px;
		text-align: center;
		font-size: 16px;
		background: -webkit-linear-gradient(left, #FD6131, #FE0000);
		background: -o-linear-gradient(right, #FD6131, #FE0000);
		background: -moz-linear-gradient(right, #FD6131, #FE0000);
		background: linear-gradient(to right, #FD6131 , #FE0000);
	}
	#pintuan-share .take-info .btn-group .btn-item.new{
		background: -webkit-linear-gradient(left, #FFBC2D, #FF9B2C);
		background: -o-linear-gradient(right, #FFBC2D, #FF9B2C);
		background: -moz-linear-gradient(right, #FFBC2D, #FF9B2C);
		background: linear-gradient(to right, #FFBC2D , #FF9B2C);
	}
	#pintuan-share .take-info .avatars{
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#pintuan-share .take-info .avatars .avatar-item{
		width: 60px;
		height: 60px;
		border-radius: 50%;
		font-size: 0px;
		border: 2px solid #ff2d4b;
		margin: 0 5px;
		position: relative;
	}
	#pintuan-share .take-info .avatars .avatar-item img{
		border-radius: 60px;
	}
	#pintuan-share .take-info .avatars .avatar-item .mark{
		position: absolute;
		z-index: 1;
		left: 50%;
		bottom: -10px;
		font-size: 12px;
		background-color: #ff2d4b;
		transform: translateX(-50%);
		color: #fff;
		width: 34px;
		height: 20px;
		line-height: 20px;
		text-align: center;
		border-radius: 50px;
	}
	#pintuan-share .take-info .avatars .avatar-item.empty{
		border: 2px dashed #ff2d4b;
		background-color: #FEDEE3;
		font-size: 40px;
		text-align: center;
		line-height: 58px;
		color: #ff2d4b;
	}
	#pintuan-share .activity-list{
		padding: 7.5px;
		display: flex;
		flex-flow: row wrap;
		align-items: center;
	}
	#pintuan-share .activity-list .activity-item{
		width: 50%;
		padding: 7.5px;
	}
	#pintuan-share .activity-item .thumb{
		width: 100%;
		height: 162px;
		font-size: 0px;
		border-radius: 3px;
		overflow: hidden;
		position: relative;
	}
	#pintuan-share .activity-item .goods-title{
		font-size: 14px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		line-height: 1.2;
		margin: 8px 0;
		height: 33px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/pintuan/share.vue