<template>
	<div id="seckill-category">
		<public-header :title="category.title"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<van-pull-refresh v-model="isRefresh" @refresh="onPullDownRefresh()">
				<div class="padding-15-t padding-15-lr bg-default flex-lr c-danger font-14" v-if="!records.empty">
					超值好货限时抢购
				</div>
				<van-list
					v-model="records.loading"
					:finished="records.finished"
					@load="onLoad"
					:offset="100"
					:immediate-check="false"
					v-if="!records.empty"
					class="goods-list"
				>
					<div class="activity-item" v-for="(item, index) in records.data" :key="index">
						<div class="item-inner">
							<div class="thumb">
								<img class="img-100" :src="item.thumb" alt="">
								<div class="end-bg" v-if="item.status == 3">
									<img src="static/img/end.png" alt="">
								</div>
							</div>
							<div class="goods-title">{{item.title}}</div>
							<div class="flex">
								<span class="c-danger font-500 font-15 margin-5-r">¥{{item.price}}</span>
								<div class="c-gray line-through font-12">¥{{item.oldprice}}</div>
								<div class="discount">{{item.discount}}折</div>
							</div>
							<div class="flex-lr margin-10-t">
								<div class="bar" :class="{'bar-end': item.status == 3 || !item.total}">
									<div class="bar-inner" :style="{width: item.sailed_percent + '%'}" v-if="item.status != 3 && item.total > 0"></div>
									<div class="bar-text" style="width: 100%">已抢{{item.sailed}}份</div>
								</div>
								<template v-if="item.status == 1">
									<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/seckill/detail', query: {id: item.id}})" class="btn btn-detail" v-if="item.total != 0">抢购</router-link>
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
					</div>
					<div class="loaded" v-if="records.finished">
						<div class="loaded-tips">没有更多了</div>
					</div>
				</van-list>
				<div class="no-data" v-else>
					<img src="static/img/goods_no_con.png" alt="">
					<p>暂无抢购活动!</p>
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
				cid: 0,
				category: {},
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
					url: 'seckill/goods/index',
					data: {
						menufooter: 1,
						cid: that.cid,
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
			if(this.$route.query && this.$route.query.cid > 0) {
				this.cid = this.$route.query.cid;
			}
			this.onLoad();
		}
	}
</script>

<style>
	#seckill-category .timer span{
		background-color: #ff2d4b;
		color: #fff;
		font-size: 12px;
		padding: 3px 3px;
		border-radius: 3px;
		margin: 0 3px;
	}
	#seckill-category .goods-list{
		padding: 7.5px;
		background-color: #fff;
		display: flex;
		flex-flow: row wrap;
		align-items: center;
	}
	#seckill-category .goods-list .activity-item{
		width: 50%;
		padding: 7.5px;
	}
	#seckill-category .activity-item .thumb{
		width: 100%;
		height: 162px;
		font-size: 0px;
		border-radius: 3px;
		overflow: hidden;
		position: relative;
	}
	#seckill-category .activity-item .thumb .end-bg{
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
	#seckill-category .activity-item .thumb .end-bg img{
		width: 130px;
	}

	#seckill-category .activity-item .goods-title{
		font-size: 14px;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
		line-height: 1.2;
		margin: 8px 0;
		height: 33px;
	}
	#seckill-category .activity-item .btn{
		color: #fff;
		font-size: 14px;
		padding: 8px 10px;
		border-radius: 3px;
	}
	#seckill-category .activity-item .btn.btn-detail{
		background: -webkit-linear-gradient(left, #FC6030, #FF0101);
		background: -o-linear-gradient(right, #FC6030, #FF0101);
		background: -moz-linear-gradient(right, #FC6030, #FF0101);
		background: linear-gradient(to right, #FC6030 , #FF0101);
	}
	#seckill-category .activity-item .btn.btn-end{
		background-color: #959595;
	}
	#seckill-category .activity-item .discount{
		position: relative;
		padding: 2px 3px 2px 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		background-color: #FED4D5;
		color: #C51C33;
		margin-left: 10px;
	}
	#seckill-category .activity-item .discount:before{
		content: "";
		display: block;
		border-width: 7px;
		position: absolute;
		left: -7px;
		transform: translateX(-50%);
		border-style: solid dashed dashed;
		border-color:  transparent #FED4D5 transparent transparent   ;
		font-size: 0;
		line-height: 0;
		z-index: 10;
	}
	#seckill-category .activity-item .bar{
		width: 60%;
		height: 14px;
		border-radius: 20px;
		background-color: #FED4D5;
		position: relative;
		overflow: hidden;
	}
	#seckill-category .activity-item .bar.bar-end{
		background-color: #959595;
	}
	#seckill-category .activity-item .bar .bar-inner{
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
	#seckill-category .activity-item .bar .bar-text{
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
	#seckill-category .loaded-tips{
		background-color: #fff;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/seckill/category.vue