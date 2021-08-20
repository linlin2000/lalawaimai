<template>
	<div id="pintuan-category">
		<public-header title="钜惠拼团"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<van-pull-refresh v-model="isRefresh" @refresh="onPullDownRefresh()">
				<div class="no-data" v-if="records.empty">
					<img src="static/img/goods_no_con.png" alt="">
					<p>暂无拼团活动!</p>
				</div>
				<template v-else>
					<div class="padding-15-t padding-15-lr font-14 c-danger bg-default">拼团购物更优惠</div>
					<van-list
						v-model="records.loading"
						:finished="records.finished"
						@load="onLoad"
						:offset="100"
						:immediate-check="false"
						class="activity-list"
					>
						<div class="activity-item bg-default flex-lr padding-15 van-hairline--bottom" v-for="(item, index) in records.data" :key="item.id">
							<div class="thumb">
								<img class="img-100" :src="item.thumb" alt="">
								<div class="mark">
									{{item.peoplenum}}人团
								</div>
							</div>
							<div class="info">
								<div class="font-14 w-100">
									<div class="flex-lr margin-10-b">
										<div class="font-500">{{item.store.title}}</div>
										<span class="c-gray" v-if="0">3.5km</span>
									</div>
									<p>{{item.name}}</p>
								</div>
								<div class="flex-lr-bottom w-100">
									<div>
										<div class="flex">
											<span class="c-danger font-500 font-15 margin-5-r">{{item.price}}</span>
											<div class="c-gray line-through font-12">{{item.oldprice}}</div>
											<div class="discount">{{item.discount}}折</div>
										</div>
										<template v-if="item.status == 2">
											<div class="bar">
												<div class="bar-inner" style="width: 0%"></div>
												<div class="bar-text" style="width: 0%">已团0份</div>
											</div>
										</template>
										<template v-else>
											<div class="bar" :class="{'bar-end': item.total == 0}">
												<div class="bar-inner" :style="'width:' + item.sailed_percent + '%'" v-if="item.total != -1"></div>
												<div class="bar-text" style="width: 0%">已团{{item.falesailed_total}}份</div>
											</div>
										</template>
									</div>
									<div class="btn btn-end" v-if="item.status == 2">未开始</div>
									<div class="btn btn-end" v-else-if="item.status == 3">已结束</div>
									<template v-else-if="item.status == 1">
										<div class="btn btn-end" v-if="item.total == 0">已抢完</div>
										<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/pintuan/detail', query: {id: item.id}})" class="btn btn-detail" v-else>去拼团</router-link>
									</template>
								</div>
							</div>
						</div>
					</van-list>
					<div class="loaded" v-if="records.finished">
						<div class="loaded-tips">已经到底了</div>
					</div>
				</template>
			</van-pull-refresh>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	import {getRecords} from "@/controller/funcCommon";
	export default {
		components: {
			PublicHeader,
			PublicFooter
		},
		data() {
			return {
				records:{
					page: 1,
					psize: 15,
					loading: false,
					finished: false,
					empty: false,
					data:[]
				},
				menufooter: {},
				isRefresh: false,
				showPreLoading: true
			}
		},
		methods: {
			onLoad(force){
				var that = this;
				getRecords({
					vue: that,
					force: force,
					url: 'pintuan/index/index',
					data: {
						cateid: that.cid,
						menufooter: 1
					},
					recordsName: 'goods',
					success: (res) => {
						that.menufooter = window.menufooter;
					}
				});
			},
			onPullDownRefresh() {
				this.onLoad(true);
			},
		},
		created() {
			if(this.$route.query && this.$route.query.cid > 0) {
				this.cid = this.$route.query.cid
			}
		},
		mounted() {
			this.onLoad();
		},
	}
</script>

<style>
	#pintuan-category .activity-item .thumb{
		position: relative;
		width: 100px;
		height: 100px;
		border-radius: 2px;
		overflow: hidden;
	}
	#pintuan-category .activity-item .thumb .mark{
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
	#pintuan-category .activity-item .btn{
		color: #fff;
		font-size: 14px;
		padding: 8px 10px;
		border-radius: 3px;
	}
	#pintuan-category .activity-item .btn.btn-detail{
		background: -webkit-linear-gradient(left, #FC6030, #FF0101);
		background: -o-linear-gradient(right, #FC6030, #FF0101);
		background: -moz-linear-gradient(right, #FC6030, #FF0101);
		background: linear-gradient(to right, #FC6030 , #FF0101);
	}
	#pintuan-category .activity-item .btn.btn-end{
		background-color: #959595;
	}
	#pintuan-category .activity-item .info{
		flex: 1;
		padding-left: 10px;
		height: 100px;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
	}
	#pintuan-category .activity-item .info .discount{
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
	#pintuan-category .activity-item .info .discount:before{
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
	#pintuan-category .activity-item .bar{
		width: 150px;
		height: 14px;
		border-radius: 20px;
		background-color: #FED4D5;
		position: relative;
		margin-top: 10px;
	}
	#pintuan-category .activity-item .bar.bar-end{
		background-color: #959595;
	}
	#pintuan-category .activity-item .bar .bar-inner{
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
	#pintuan-category .activity-item .bar .bar-text{
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
	/*拼团导航栏样式*/
	.pintuan-navs{
		background: #a2d9f2;
	}
	.pintuan-navs .van-swipe{
		background-color: #fff;
	}
	.pintuan-navs-container {
		position: relative;
		overflow: hidden;
		background-color: #fff;
		display: flex;
		flex-flow:row wrap;
	}
	.pintuan-navs-container.col-5 .pintuan-nav-col {
		width: 20%;
	}
	.pintuan-navs-container .pintuan-nav-col {
		width: 25%;
		height: auto;
		position: relative;
		padding: 0;
		margin: 8px 0;
		text-align: center;
	}
	.pintuan-navs-container .pintuan-nav-col .pintuan-nav-icon {
		margin: auto;
		text-align: center;
		height: 50px;
		line-height: 50px;
	}
	.pintuan-navs-container .pintuan-nav-col img {
		display: inline-block;
		width: 50px;
		max-width: 50px;
		height: 50px;
		max-height: 100%;
	}
	.pintuan-navs-container .pintuan-nav-col .pintuan-nav-text {
		font-size: 12px;
		text-align: center;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-top: 4px;
		line-height: 1.5;
		color: #333;
	}
	.pintuan-navs-container.circle img{
		border-radius: 100%;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/pintuan/category.vue