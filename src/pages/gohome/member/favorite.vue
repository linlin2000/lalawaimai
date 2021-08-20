<template>
	<div id="gohome-favor">
		<public-header title="我的收藏"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<van-pull-refresh v-model="isRefresh" @refresh="onPullDownRefresh()">
				<van-list
					v-model="records.loading"
					:finished="records.finished"
					@load="onLoad"
					:offset="100"
					:immediate-check="false"
					v-if="!records.empty"
					class="favorite-list"
				>
					<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/' + item.type + '/detail', query:{id: item.goods_id}})" class="favorite-item flex-lr" v-for="(item, index) in records.data" :key="item.id">
						<div class="favorite-img">
							<img class="img-100" :src="item.goods.thumb" alt="">
							<div class="mark" v-if="item.type == 'pintuan'">
								{{item.goods.peoplenum}}人团
							</div>
						</div>
						<div class="favorite-info">
							<div class="flex-lr">
								<div class="store-name">{{item.store.title}}</div>
								<div class="order-type" :class="item.type_all.css">{{item.type_all.text}}</div>
							</div>
							<div class="goods-name">
								{{item.goods.name}}
							</div>
							<div class="flex goods-price">
								<div class="c-danger font-16 font-bold">￥{{item.goods.price}}</div>
								<div class="c-gray font-12 line-through margin-5-l">￥{{item.goods.oldprice}}</div>
							</div>
						</div>
					</router-link>
					<div class="loaded" v-if="records.finished">
						<div class="loaded-tips">没有更多了</div>
					</div>
				</van-list>
				<div class="no-data" v-else>
					<img src="static/img/order_no_con.png" alt="">
					<p>没有符合条件的数据!</p>
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
				filter: {
					items: {
						type: ''
					}
				},
				showPreLoading: true,
				isRefresh: false,
				menufooter: {},
			}
		},
		methods: {
			onLoad(force) {
				var that = this;
				getRecords({
					vue: that,
					force: force,
					url: 'gohome/favorite/list',
					data: {
						menufooter: 1
					},
					success: (res) => {
						that.menufooter = window.menufooter;
					}
				})
			},
			onPullDownRefresh(){
				this.onLoad(true);
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#gohome-favor .content .favorite-item{
		margin: 10px;
		background-color: #fff;
		border-radius: 5px;
		padding: 10px;
	}
	#gohome-favor .content .favorite-item .favorite-img{
		position: relative;
		width: 70px;
		height: 70px;
		margin-right: 10px;
	}
	#gohome-favor .content .favorite-item .favorite-img .mark{
		position: absolute;
		width: 44px;
		height: 28px;
		top: 0;
		left: 5px;
		padding-top: 4px;
		background: url('../../../../static/img/robot.png') no-repeat;
		background-size: 100% 100% ;
		color: #fff;
		font-size: 12px;
		text-align: center;
	}
	#gohome-favor .content .favorite-item .favorite-info{
		width: 75%;
	}
	#gohome-favor .content .favorite-item .favorite-info .store-name{
		font-size: 16px;
		font-weight: 600;
	}
	#gohome-favor .content .favorite-item .favorite-info .order-type{
		display: inline-block;
		background-color: #ff2d4b;
		color: #fff;
		font-size: 12px;
		padding: 3px 5px;
		border-radius: 3px;
		margin-right: 5px;
	}
	#gohome-favor .content .favorite-item .favorite-info .label{
		color: #fff;
	}
	#gohome-favor .content .favorite-item .favorite-info .label.label-info{
		background-color: #5bc0de;
	}
	#gohome-favor .content .favorite-item .favorite-info .label.label-danger{
		background-color: #ff2d4b;
	}
	#gohome-favor .content .favorite-item .favorite-info .label.label-warning{
		background-color: #f0ad4e;
	}
	#gohome-favor .content .favorite-item .favorite-info .goods-name{
		font-size: 14px;
		color: #333;
		padding-top: 5px;
	}
	#gohome-favor .content .favorite-item .goods-price{
		padding-top: 15px;
	}
	#gohome-favor .content .favorite-item .discount{
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
	#gohome-favor .content .favorite-item .discount:before{
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
</style>


// WEBPACK FOOTER //
// src/pages/gohome/member/favorite.vue