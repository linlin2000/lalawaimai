<template>
	<div id="spread-order">
		<public-header title="推广订单"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content" :style="{'padding-top': config.spread_types.length == 1 ? '0px' : '45px'}">
			<div class="tab-group" v-if="config.spread_types.length > 1">
				<template v-for="item in config.spread_types">
					<div class="tab-item" :class="{active: filter.items.order_type == item.type}" @click="onToggleOrdertype(item.type)">{{item.title}}</div>
				</template>
			</div>
			<template v-if="config.spread_types.length == 1">
				<van-tabs v-model="active" swipeable @click='onChangeStatus'>
					<van-tab v-for="(index,key) in 4" :title="title[index]" :key="key">
						<van-list v-model="records.loading" :finished="records.finished" v-if="!records.empty" @load="onLoad" :offset="100" :immediate-check="false">
							<div class="current-list">
								<div class="list-block">
									<ul class="list">
										<li class="item-content" v-for="(item, orderIndex) in records.data" :key="orderIndex">
											<router-link :to="util.getUrl({path: 'pages/spread/detail', query: {id: item.id, order_type: filter.items.order_type}})">
												<div class="item-inner">
													<div class="item-title">
														<div class="item-title-top">{{item.ordersn}}<span v-if="item.spread1 == item.spreadid">（一级）</span> <span v-if="item.spread2 == item.spreadid">（二级）</span></div>
														<div class="item-title-bottom">{{item.paytime_cn}}</div>
													</div>
													<div class="item-after">
														<div class="item-title-top">+{{item.commission}}</div>
														<div class="item-title-bottom">{{item.status_cn}}</div>
													</div>
												</div>
											</router-link>
											<span class="success" v-if="item.spreadbalance == 1">已结算</span>
											<span class="danger" v-else>未结算</span>
											<van-icon name='right'></van-icon>
										</li>
									</ul>
								</div>
							</div>
							<div class="loaded" v-if="records.finished">
								<div class="loaded-tips">没有更多了</div>
							</div>
						</van-list>
						<div class="current-list" v-else>
							<div class="no-data">
								<div class="bg"></div>
								<p>暂时没有推广订单哦～</p>
							</div>
						</div>
					</van-tab>
				</van-tabs>
			</template>
			<template v-else>
				<van-list v-model="records.loading" :finished="records.finished" v-if="!records.empty" @load="onLoad" :offset="100" :immediate-check="false">
					<div class="current-list">
						<div class="list-block">
							<ul class="list">
								<li class="item-content" v-for="(item, orderIndex) in records.data" :key="orderIndex">
									<router-link :to="util.getUrl({path: 'pages/spread/detail', query: {id: item.id, order_type: filter.items.order_type}})">
										<div class="item-inner">
											<div class="item-title">
												<div class="item-title-top">{{item.ordersn}}<span v-if="item.spread1 == item.spreadid">（一级）</span> <span v-if="item.spread2 == item.spreadid">（二级）</span></div>
												<div class="item-title-bottom">{{item.paytime_cn}}</div>
											</div>
											<div class="item-after">
												<div class="item-title-top">+{{item.commission}}</div>
												<div class="item-title-bottom">{{item.status_cn}}</div>
											</div>
										</div>
									</router-link>
									<span class="success" v-if="item.spreadbalance == 1">已结算</span>
									<span class="danger" v-else>未结算</span>
									<van-icon name='right'></van-icon>
								</li>
							</ul>
						</div>
					</div>
					<div class="loaded" v-if="records.finished">
						<div class="loaded-tips">没有更多了</div>
					</div>
				</van-list>
				<div class="current-list" v-else>
					<div class="no-data">
						<div class="bg"></div>
						<p>暂时没有推广订单哦～</p>
					</div>
				</div>
			</template>
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
			PublicFooter,
		},
		data() {
			return {
				active: 0,
				filter: {
					items: {
						status: 0,
						order_type: 'takeout',
					}
				},
				title: {
					1:'所有',
					2:'未完成',
					3:'已完成',
					4:'已取消',
				},
				records: {
					page: 1,
					psize: 15,
					loading: true,
					finished: false,
					empty: false,
					data:[]
				},
				config: {
					spread_types: []
				},
				showPreLoading: true,
				menufooter: {}
			}
		},
		methods: {
			onLoad(force) {
				var that = this;
				getRecords({
					vue: that,
					force: force,
					url: 'spread/order/index',
					data: {
						menufooter: 1
					},
					success: (res) => {
						that.config = res.config;
						that.menufooter = window.menufooter;
					}
				})
			},
			onChangeStatus(index, title) {
				if(this.filter.items.status == index) {
					return;
				}
				this.filter.items.status = index;
				this.onLoad(true);
			},
			onToggleOrdertype(type) {
				if(this.filter.items.order_type == type) {
					return;
				}
				this.filter.items.order_type = type;
				this.onLoad(true);
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#spread-order .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		width: 100%;
		padding-top: 45px;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#spread-order .content::-webkit-scrollbar {
		display: none;
	}
	#spread-order .content .van-tabs .van-tabs__wrap{
		border-bottom: 1px solid #d0d0d0;
	}
	#spread-order .content .current-list .list-block{
		margin: 8px 0 0;
		font-size: 17px;
	}
	#spread-order .content .current-list .list-block .list{
		position: relative;
		padding: 0;
		margin: 0;
		list-style: none;
		background-color: #fff;
	}
	#spread-order .content .current-list .list-block .list .item-content{
		position: relative;
		color: inherit;
		display: flex;
		min-height: 44px;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		padding-left: 15px;
		-webkit-box-pack: justify;
		-ms-flex-pack: justify;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		-webkit-box-align: center;
		-ms-flex-align: center;
		-webkit-align-items: center;
		align-items: center;
	}
	#spread-order .content .current-list .list-block .list .item-content a{
		display: inline-block;
		width: 100%;
	}
	#spread-order .content .current-list .list-block .list .item-content>span{
		position: absolute;
		left: 0;
		top: 0;
		width: 60px;
		line-height: 19px;
		font-size: 13px;
		text-align: center;
		color: #fff;
	}
	#spread-order .content .current-list .list-block .list .item-content>span.success{
		background-color: #4cd964;
	}
	#spread-order .content .current-list .list-block .list .item-content>span.danger{
		background-color: #f6383a;
	}
	#spread-order .content .current-list .list-block .list .item-content .van-icon{
		position: absolute;
		top: 20px;
		right: 7px;
		font-size: 17px;
		color: #b2b2b2;
	}
	#spread-order .content .current-list .list-block .list .item-content a .item-inner{
		position: relative;
		display: -webkit-box;
		display: -ms-flexbox;
		display: -webkit-flex;
		display: flex;
		width: 100%;
		min-height: 44px;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		padding-top: 8px;
		padding-right: 28px;
		padding-bottom: 7px;
		-webkit-box-flex: 1;
		-ms-flex: 1;
		-webkit-box-pack: justify;
		-ms-flex-pack: justify;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		-webkit-box-align: center;
		-ms-flex-align: center;
		-webkit-align-items: center;
		align-items: center;
	}
	#spread-order .content .current-list .list-block .list .item-content a .item-inner .item-title{
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
	#spread-order .content .current-list .list-block .list .item-content a .item-inner .item-title .item-title-top{
		font-size: 14px;
		color: #333;
		line-height: 21px;
	}
	#spread-order .content .current-list .list-block .list .item-content a .item-inner .item-title .item-title-bottom{
		font-size: 14px;
		color: #9A999A;
		line-height: 21px;
	}
	#spread-order .content .current-list .list-block .list .item-content a .item-inner .item-after{
		display: inline-block;
		max-width: 300px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-height: none;
	}
	#spread-order .content .current-list .list-block .list .item-content a .item-inner .item-after .item-title-top{
		font-size: 14px;
		color: #666;
		line-height: 21px;
	}
	#spread-order .content .current-list .list-block .list .item-content a .item-inner .item-after .item-title-bottom{
		font-size: 14px;
		color: #9A999A;
		line-height: 21px;
	}
	#spread-order .content .current-list .no-data{
		padding-top: 30%;
		text-align: center;
	}
	#spread-order .content .current-list .no-data .bg{
		display: inline-block;
		width: 160px;
		height: 160px;
		background: url(../../../static/img/no_order.png) no-repeat 0 0;
		background-size: cover;
	}
	#spread-order .content .current-list .no-data p{
		margin: 0;
		color: #999;
		font-size: 18px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/spread/order.vue