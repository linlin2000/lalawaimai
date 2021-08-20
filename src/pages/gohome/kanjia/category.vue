<template>
	<div id="kanjia-category">
		<public-header :title="category.title"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<van-pull-refresh v-model="isRefresh" @refresh="onPullDownRefresh()">
				<div class="padding-15-tb padding-10-lr font-14 c-danger bg-default" v-if="!records.empty">召集好友来砍价</div>
				<van-list
					v-model="records.loading"
					:finished="records.finished"
					@load="onLoad"
					:offset="100"
					:immediate-check="false"
					v-if="!records.empty"
					class="activity-list padding-10-b"
				>
					<div class="activity-item van-hairline--top" v-for="(item, index) in records.data" :key="item.id">
						<div class="thumb">
							<img class="img-100" :src="item.thumb" alt="">
							<div class="end-bg" v-if="item.status == 3">
								<img src="static/img/end.png" alt="">
							</div>
						</div>
						<div class="title">【邀请好友帮忙砍价】{{item.name}}</div>
						<div class="flex-lr">
							<div class="flex-lr">
								<div class="flex">
									<div class="c-danger font-16 font-bold">¥{{item.price}}</div>
									<div class="c-gray font-12 line-through margin-5-l">¥{{item.oldprice}}</div>
								</div>
								<div class="buy-history flex" v-if="item.userlist && item.userlist.length > 0">
									<div class="avatar-list">
										<img :src="item.avatar" v-for="(item, index) in item.userlist" :key="index" v-if="index < 3">
									</div>
									<div class="font-12 c-gray margin-5-l">{{item.userlist.length}}人参与</div>
								</div>
							</div>
							<template v-if="item.status == 1">
								<router-link :to="util.getUrl({path: '/gohome/pages/kanjia/detail', query:{id: item.id}})" tag="div" class="btn btn-detail" v-if="item.total != 0">去砍价</router-link>
								<div class="btn btn-end" v-else>已抢光</div>
							</template>
							<template v-else-if="item.status == 2">
								<div class="btn btn-end">未开始</div>
							</template>
							<template v-else-if="item.status == 3">
								<div class="btn btn-end">已结束</div>
							</template>
						</div>
					</div>
					<div class="loaded" v-if="records.finished">
						<div class="loaded-tips">没有更多了</div>
					</div>
				</van-list>
				<div class="no-data" v-else>
					<img src="static/img/goods_no_con.png" alt="">
					<p>暂无砍价活动!</p>
				</div>
			</van-pull-refresh>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	import {getRecords} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
			PublicFooter
		},
		data() {
			return {
				records: {
					page: 1,
					psize: 15,
					loading: true,
					finished: false,
					empty: false,
					data:[]
				},
				cateid: 0,
				category: {
					title: '',
				},
				isRefresh: false,
				showPreLoading: true,
				menufooter: {},
			}
		},
		methods: {
			onLoad(force) {
				var that = this;
				getRecords({
					vue: that,
					force: force,
					url: 'kanjia/activity/index',
					data: {
						menufooter: 1,
						cateid: that.cateid,
					},
					success: (res) => {
						that.menufooter = window.menufooter;
						that.category = Object.assign(that.category, res.category);
						that.util.setWXTitle(that.category.title);
					}
				})
			},
			onPullDownRefresh(){
				this.onLoad(true);
			}
		},
		mounted() {
			if(this.$route.query && this.$route.query.cateid > 0) {
				this.cateid = this.$route.query.cateid;
			}
			this.onLoad();
		}
	}
</script>

<style>
	#kanjia-category .van-pull-refresh{
		overflow: visible;
	}
	#kanjia-category .activity-item{
		padding: 10px;
		background-color: #fff;
	}
	#kanjia-category .activity-item:first-child{
		padding-top: 0px;
	}
	#kanjia-category .activity-item:first-child:after{
		display: none;
	}
	#kanjia-category .activity-item .thumb{
		width: 100%;
		max-height: 162px;
		font-size: 0px;
		border-radius: 3px;
		overflow: hidden;
		position: relative;
	}
	#kanjia-category .activity-item .thumb .end-bg{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#kanjia-category .activity-item .thumb .end-bg img{
		width: 150px;
	}
	#kanjia-category .activity-item .title{
		font-size: 14px;
		padding: 8px 0;
		line-height: 1.3;
		font-weight: 500;
	}
	#kanjia-category .activity-item .btn{
		color: #fff;
		font-size: 14px;
		padding: 8px 10px;
		border-radius: 3px;
	}
	#kanjia-category .activity-item .btn.btn-detail{
		background: -webkit-linear-gradient(left, #FC6030, #FF0101);
		background: -o-linear-gradient(right, #FC6030, #FF0101);
		background: -moz-linear-gradient(right, #FC6030, #FF0101);
		background: linear-gradient(to right, #FC6030 , #FF0101);
	}
	#kanjia-category .activity-item .btn.btn-end{
		background-color: #959595;
	}
	#kanjia-category .activity-item .avatar-list{
		margin-left: 20px;
	}
	#kanjia-category .activity-item .avatar-list img{
		width: 18px;
		height: 18px;
		border-radius: 50%;
		margin-left: -10px;
	}
	#kanjia-category .activity-item .avatar-list img:first-child{
		margin-left: 0;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/kanjia/category.vue