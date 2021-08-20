<template>
	<div id="creditshop-index">
		<public-header title="酒币商城"></public-header>
		<div class="content">
			<van-pull-refresh v-model="isRefresh" @refresh="onPullDownRefresh()">
				<div class="creditshop-slider" v-if="adv.length > 0">
					<van-swipe :autoplay="5000" indicator-color="#ff2d4b">
						<van-swipe-item v-for="(item, index) in adv" :key="item.id">
							<div class="img-wrap" @click="util.jsUrl(item.wxapp_link)">
								<img :src="item.thumb" alt="">
							</div>
						</van-swipe-item>
					</van-swipe>
				</div>
				<ul class="flex-lr font-14 bg-default margin-10-b">
					<li class="flex-1 flex-center padding-10-tb van-hairline--right">
						<i class="icon icon-recharge margin-5-r"></i>酒币:
						<span class="c-danger">{{member.credit1}}</span>
					</li>
					<router-link tag="li" :to="util.getUrl({path: 'pages/creditshop/list'})" class="flex-center flex-1 padding-10-tb">
						<i class="icon icon-order margin-5-r"></i>兑换记录
					</router-link>
				</ul>
				<van-row class="creditshop-navs" v-if="category.length > 0">
					<van-col span="6" v-for="(item, index) in category" :key="item.id">
						<div class="nav-item" >
							<router-link tag="div" class="thumb-wrap" :to="util.getUrl({path: '/pages/creditshop/goods', query: {category_id: item.id}})">
								<img :src="item.thumb" alt="">
							</router-link>
							<div class="title">{{item.name}}</div>
						</div>
					</van-col>
				</van-row>
				<div class="creditshop-goods" v-if="records.data.length > 0">
					<div class="goods-title-wrap">
						<div class="goods-title van-hairline--bottom">
							<div class="flex font-14">
								<i class="icon icon-gifts c-gray margin-10-r font-18"></i>
								<span>酒币兑换实物</span>
							</div>
							<div class="flex c-gray font-14 hide">
								<span class="font-13">更多</span>
								<i class="icon icon-right"></i>
							</div>
						</div>
					</div>
					<van-list
						v-model="records.loading"
						:finished="records.finished"
						@load="onGetGoods"
						:offset="100"
						:immediate-check="false"
						v-if="!records.empty"
					>
						<div class="goods-list">
							<div class="goods-item"  v-for="(item, index) in records.data" :key="item.id">
								<div class="thumb">
									<img :src="item.thumb" alt="">
								</div>
								<div class="goods-name ellipsis">{{item.title}}</div>
								<div class="price font-12 ellipsis">
									<span class="c-danger font-15">{{item.use_credit1}}</span>
									<span>酒币</span>
									<span class="c-danger" v-if="item.use_credit2 > 0">+<span class="font-15">￥{{item.use_credit2}}</span></span>
								</div>
								<div class="exchange">
									<router-link tag="span" :to="util.getUrl({path: '/pages/creditshop/goodsDetail', query: {id: item.id}})" class="exchange-btn c-danger">立即兑换</router-link>
								</div>
							</div>
						</div>
						<div class="loaded-group">
							<div class="loaded" v-if="records.finished">
								<div class="loaded-tips">没有更多了</div>
							</div>
						</div>
					</van-list>
					<div class="no-data" v-else>
						<img src="static/img/goods_no_con.png" alt="">
						<p>暂无酒币兑换商品!</p>
					</div>
				</div>
			</van-pull-refresh>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import {getData, getRecords} from "@/controller/funcCommon"
	export default {
		data() {
			return {
				adv: [],
				category: [],
				records: {
					page: 1,
					psize: 20,
					loading: true,
					finished: false,
					empty: false,
					data:[]
				},
				member: {},
				showPreLoading: true,
				isRefresh: false
			}
		},
		components: {
			PublicHeader,
		},
		methods: {
			onLoad(){
				var that = this;
				getData({
					vue: that,
					url: 'creditshop/index',
					data: {},
					success: (res) => {
						that.isRefresh = false;
						that.adv = [...that.adv, ...res.adv];
						that.category = [...that.category, ...res.category];
						that.member = res.member;
						that.records.data = [...that.records.data, ...res.goods];
						if(!that.records.data.length) {
							that.records.empty = true;
						}
						if(res.goods && res.goods.length < that.records.psize) {
							that.records.finished = true;
						}
						that.records.page++;
						that.records.loading = false;
					}
				})
			},
			onGetGoods() {
				var that = this;
				getRecords({
					vue: that,
					url: 'creditshop/index/goods',
					recordsName: 'goods',
					data: {
						page: that.records.page,
						psize: that.records.psize
					},
				})
			},
			onPullDownRefresh() {
				this.records = {
					page: 1,
					psize: 20,
					loading: true,
					finished: false,
					empty: false,
					data:[]
				};
				this.adv = [];
				this.category = [];
				this.onLoad();
			}
		},
		mounted(){
			this.onLoad();
		}
	}
</script>

<style>
	#creditshop-index .creditshop-slider{
		padding: 10px;
		background-color: #fff;
	}
	#creditshop-index .creditshop-slider .img-wrap{
		font-size: 0px;
	}
	#creditshop-index .creditshop-slider .van-swipe img{
		width: 100%;
		max-height: 150px;
	}
	#creditshop-index .creditshop-navs{
		background-color: #fff;
		padding-top: 10px;
	}
	#creditshop-index .creditshop-navs .nav-item{
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
		padding-bottom: 12px;
	}
	#creditshop-index .creditshop-navs .nav-item .thumb-wrap{
		width: 50px;
		height: 50px;
	}
	#creditshop-index .creditshop-navs .nav-item .thumb-wrap img{
		width: 100%;
		height: 100%;
		border-radius: 100%;
	}
	#creditshop-index .creditshop-navs .nav-item .title{
		width: 100%;
		padding: 0 5px;
		font-size: 12px;
		text-align: center;
		margin-top: 7px;
	}
	#creditshop-index .creditshop-goods{
		color: #333;
		background-color: #fff;
		margin-top: 10px;
	}
	#creditshop-index .creditshop-goods .goods-title-wrap{
		padding-left: 10px;
	}
	#creditshop-index .creditshop-goods .goods-title{
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
		background-color: #fff;
		padding: 13px 10px 13px 0;
		position: relative;
	}
	#creditshop-index .creditshop-goods .goods-list{
		padding: 7.5px;
		background-color: #fff;
		text-align: center;
		display: flex;
		flex-flow: row wrap;
		align-items: center;
	}
	#creditshop-index .creditshop-goods .goods-list .goods-item{
		width: 33.33%;
		padding: 7.5px;
	}
	#creditshop-index .creditshop-goods .goods-list .goods-item .thumb{
		width: 90px;
		height: 90px;
		margin: 0 auto;
	}
	#creditshop-index .creditshop-goods .goods-list .goods-item .thumb img{
		width: 100%;
		height: 100%;
	}
	#creditshop-index .creditshop-goods .goods-list .goods-item .goods-name{
		font-size: 13px;
		line-height: 1.2;
		margin: 5px 0;
	}
	#creditshop-index .creditshop-goods .goods-list .goods-item .price{
		text-align: center;
	}
	#creditshop-index .creditshop-goods .goods-list .goods-item .exchange{
		margin-top: 8px;
		text-align: center;
		height: 20px;
	}
	#creditshop-index .creditshop-goods .goods-list .goods-item .exchange .exchange-btn{
		padding: 1px 10px;
		font-size: 12px;
		border: 1px solid #ff2d4b;
		border-radius: 20px;
	}
	#creditshop-index .creditshop-goods .goods-list .loaded-group{
		width: 100%;
	}
	#creditshop-index .creditshop-goods .goods-list .loaded-group .loaded-tips{
		background-color: #fff;
	}
	#creditshop-index .creditshop-goods .no-data{
		padding: 40px 0;
	}
	#creditshop-index .creditshop-goods .loaded-group{
		background-color: #f5f5f5;
		border-top: 1px solid #f5f5f5;
	}

</style>


// WEBPACK FOOTER //
// src/pages/creditshop/index.vue