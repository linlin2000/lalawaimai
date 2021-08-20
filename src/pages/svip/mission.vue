<template>
	<div id="svip-mission">
		<public-header title="会员任务">
			<div slot="right" @click="onTogglePopup">任务说明</div>
		</public-header>
		<public-footer :menufooter="menufooter" :preLoading="showPreLoading"></public-footer>
		<div class="content">
			<van-pull-refresh v-model="isRefresh" @refresh="onPullDownRefresh()">
			<div class="mission-header">
				<div class="mission-title">做任务，赢好礼</div>
				<router-link tag="div" :to="util.getUrl({path: 'package/pages/svip/missionList'})" class="mission-tips">
					<span>已完成任务</span>
					<span class="num">{{stat.total_finish}}</span>个
					<!-- <span>个， 累计获奖励金</span>
					<span class="num">0</span>
					<span>个</span> -->
					<i class="icon icon-right"></i>
				</router-link>
			</div>
			<div class="mission-group">
				<div class="mission-group-title">会员任务任你选<span class="font-12 c-gray padding-5-l"></span></div>
				<van-list
					v-model="records.loading"
					:finished="records.finished"
					@load="onLoad"
					:offset="100"
					:immediate-check="false"
					class="mission-list"
					v-if="!records.empty"
				>
					<div class="flex-lr mission-item" v-for="item in records.data" :key="item.id">
						<div class="avatar">
							<img :src="item.thumb" alt="">
						</div>
						<div class="mission-left flex-lr">
							<div class="activity-info">
								<div class="font-15 c-default">{{item.title}}</div>
								<div class="ellipsis">{{item.content}}</div>
								<div class="c-danger padding-5-t font-13">{{item.award_cn}}</div>
							</div>
							<div class="activity-price" @click="onTakepart(item.id, item.button.link_type, item.button.link)">
								<div class="activity-but">{{item.button.text}}</div>
							</div>
						</div>
					</div>
				</van-list>
				<div class="no-data" v-else>
					<img src="static/img/goods_no_con.png" alt="" v-if="0">
					<p>暂无会员任务!</p>
				</div>
			</div>
			<div class="mission-group" v-if="0">
				<div class="padding-15 font-16 flex-lr">
					<div class="font-bold">我的任务</div>
					<div class="mission-tips">还剩2单，加油哦！</div>
				</div>
				<div class="mission-list">
					<div class="flex-lr mine-mission padding-15-t">
						<div class="avatar">
							<img src="https://fuss10.elemecdn.com/2/f9/6afbdf65292266d7d85fd9f051001png.png?imageMogr/format/webp/thumbnail/!72x72r/gravity/Center/crop/72x72/" alt="">
						</div>
						<div class="mission-left flex-lr">
							<div class="activity-info">
								<div>
									<div class="font-15 c-default">超级特惠任务</div>
									<div class="ellipsis padding-10-t">今天下2笔满20元订单</div>
									<div class="c-danger padding-10-t font-13">奖励金+4</div>
								</div>
							</div>
							<div class="activity-price">
								<div class="activity-btn">去下单</div>
								<div class="font-12 c-gray flex">
									<span class="padding-5-r">进度0/2</span>
									<div class="flex">
										<div class="steps"></div>
										<div class="steps"></div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			</van-pull-refresh>
		</div>
		<van-popup v-model="agreementMissionShow" position="bottom" class="agreement-popup">
			<van-nav-bar class="border-0px" title="会员任务说明" @click-left="onTogglePopup" :style="{background: '#ff2d4b', color: '#fff' }">
				<van-icon name="left" :style="{color: '#fff'}" slot="left" class="font-20"></van-icon>
			</van-nav-bar>
			<div class="popup-content margin-10" v-html="agreementMission"></div>
		</van-popup>
	</div>
</template>

<script>
	import publicHeader from "@/components/header"
	import publicFooter from "@/components/footer"
	import {getRecords, setData} from "@/controller/funcCommon";
	export default {
		components: {
			publicHeader,
			publicFooter
		},
		data() {
			return {
				isRefresh: false,
				showPreLoading: true,
				islegal: false,
				menufooter: {},
				records:{
					page: 1,
					psize: 10,
					loading: false,
					finished: false,
					empty: false,
					data:[]
				},
				stat: {},
				agreementMission: '',
				agreementMissionShow: false
			}
		},
		methods: {
			onLoad(force){
				var that = this;
				getRecords({
					vue: that,
					force: force,
					url: 'svip/task/index',
					data: {
						menufooter: 1,
					},
					recordsName: 'tasks',
					success: function(res) {
						that.islegal = true;
						that.stat = res.stat;
						that.agreementMission = res.agreementMission;
					}
				});
			},
			onPullDownRefresh() {
				this.onLoad(true);
			},
			onTakepart(id, link_type, link) {
				var that = this;
				if(link_type == 1) {
					that.$router.push(that.util.getUrl({path: link}));
					return;
				}
				if(!that.islegal) {
					return;
				}
				that.islegal = false;
				setData({
					vue: that,
					url: 'svip/task/takepart',
					data: {id: id},
					success: function(res) {
						that.islegal = true;
						that.util.$toast(res, '', 1000);
						that.onLoad(true);
					},
					fail: (res) => {
						that.islegal = true;
						that.util.$toast(res.message, '', 1000);
					}
				});
			},
			onTogglePopup(){
				this.agreementMissionShow = !this.agreementMissionShow;
			}
		},
		mounted() {
			this.onLoad();
		},
	}
</script>

<style>
	#svip-mission #public-header .van-nav-bar{
		background-color: #14110f!important;
	}
	#svip-mission .mission-header{
		background-color: #14110f;
		padding: 37px 23px 75px 23px;
	}
	#svip-mission .mission-header .mission-title{
		margin-bottom: 10px;
		font-size: 24px;
		color: #edd992;
		font-weight: 600;
	}
	#svip-mission .mission-header .mission-tips{
		color: #aba192;
		font-size: 14px;
	}
	#svip-mission .mission-header .mission-tips .num{
		font-size: 20px;
		color: #f1d48f;
	}
	#svip-mission .mission-group{
		position: absolute;
		top: 130px;
		left: 15px;
		right: 15px;
		border-radius: 3px;
		background-color: #fff;
		box-shadow: 0 4px 8px 0 rgba(0,0,0,.05);
		color: #333;
	}
	#svip-mission .mission-group .mission-group-title{
		padding: 15px;
		font-size: 16px;
		color: #333;
		font-weight: 800;
	}
	#svip-mission .mission-group .mission-list{
		padding: 0 15px;
	}
	#svip-mission .mission-group .mission-item:first-child{
		padding-top: 0;
	}
	#svip-mission .mission-group .mission-item:last-child .activity-info,#svip-mission .mission-group .mission-item:last-child .activity-price{
		border: none;
	}
	#svip-mission .mission-group .mission-item{
		overflow: hidden;
		padding-top: 10px;
	}
	#svip-mission .mission-group .mission-item .avatar{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 20%;
		height: 80px;
	}
	#svip-mission .mission-group .mission-item .avatar img{
		width: 36px;
		height: 36px;
	}
	#svip-mission .mission-group .mission-item .mission-left{
		width: 80%;
		padding-bottom: 15px;
		border-bottom: 1px solid hsla(0,0%,93%,.5);
	}
	#svip-mission .mission-group .mission-item .activity-info{
		width: 65%;
		font-size: 12px;
		color: #999;
		line-height: 1.5;
	}
	#svip-mission .mission-group .mission-item .activity-price .activity-but{
		padding: 4px 15px;
		font-size: 13px;
		border-radius: 50px;
		color: #594519;
		background-image: linear-gradient(90deg,#faeaa7,#d4b96a);
		background-size: 110% 110%;
	}
	/*领取任务成功样式*/
	#svip-mission .mission-group .mission-tips{
		display: inline-flex;
		align-items: center;
		background-color: #ffe9e9;
		font-size: 12px;
		color: #ff7373;
		padding: 3px 10px;
		border-radius: 100px 0 0 100px;
		margin-right: -15px;
	}
	#svip-mission .mission-group .mine-mission{
		padding-top: 10px;
	}
	#svip-mission .mission-group .mine-mission .avatar{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 20%;
		height: 80px;
	}
	#svip-mission .mission-group .mine-mission .avatar img{
		width: 36px;
		height: 36px;
	}
	#svip-mission .mission-group .mine-mission .mission-left{
		width: 80%;
		padding-bottom: 15px;
	}
	#svip-mission .mission-group .mine-mission .mission-left .activity-info{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 65px;
		width: 65%;
		font-size: 12px;
		color: #999;
	}
	#svip-mission .mission-group .mine-mission .activity-price{
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		height: 65px;
	}
	#svip-mission .mission-group .mine-mission .activity-price .activity-btn{
		padding: 4px 15px;
		font-size: 13px;
		border-radius: 50px;
		color: #594519;
		background-image: linear-gradient(90deg,#faeaa7,#d4b96a);
		background-size: 110% 110%;
		width: 70px;
	}
	#svip-mission .mission-group .mine-mission .activity-price .steps{
		display: block;
		height: 4px;
		background-color: #e9e9e9;
		margin: 0 2px;
		width: 15px;
	}
	#svip-mission .agreement-popup{
		width: 100%;
		height: 100%;
	}
</style>


// WEBPACK FOOTER //
// src/pages/svip/mission.vue