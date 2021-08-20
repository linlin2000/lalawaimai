<template>
	<div id="svip-enjoy">
		<public-header title="会员专享"></public-header>
		<div class="content">
			<div class="title-img">
				<img class="img-100" src="https://shadow.elemecdn.com/faas/h5/static/banner.c89d59b.png" alt="">
			</div>
			<!--<ul class="wrapper-list" v-if="0">
				<li>
					<span class="item active">会员精选</span>
				</li>
				<li>
					<span class="item">新品特惠</span>
				</li>
			</ul>-->
			<van-pull-refresh v-model="isRefresh" @refresh="onPullDownRefresh()">
				<van-list
					v-model="records.loading"
					:finished="records.finished"
					@load="onLoad"
					:offset="100"
					:immediate-check="false"
					class="goods-list"
					v-if="!records.empty"
				>
					<router-link tag="div" :to="util.getUrl({path: 'pages/store/goodsDetail', query: {sid: item.sid, id: item.id}})" class="goods-item" v-for="item in records.data" :key="item.id">
						<div class="goods-img">
							<img class="img-100" :src="item.thumb" alt="">
						</div>
						<div class="goods-info">
							<div class="goods-title ellipsis">{{item.title}}</div>
							<div class="flex">
								<div class="discount">
									<i class="icon icon-crownfill font-12"></i>
									{{item.svip_discount}}折
								</div>
								<div class="font-12 c-gray padding-5-l">月售{{item.sailed}}份</div>
							</div>
							<div class="padding-5-t">
								<span class="c-danger">
									<span class="font-12">¥</span>
									<span class="font-20">{{item.svip_price}}</span>
								</span>
								<span class="font-12 c-gray line-through">¥{{item.price}}</span>
							</div>
							<div class="buy-btn"></div>
						</div>
						<div class="goods-footer flex-lr">
							<div class="flex c-gray font-12">
								<i class="icon icon-store"></i>
								<span class="padding-5-l">{{item.store_title}}</span>
							</div>
							<div class="font-12 c-gray">{{item.store_score}}分</div>
						</div>
					</router-link>
					<div class="loaded" v-if="records.finished">
						<div class="loaded-tips">已经到底了</div>
					</div>
				</van-list>
				<div class="no-data" v-else>
					<img src="static/img/goods_no_con.png" alt="">
					<p>暂无会员特属商品!</p>
				</div>
			</van-pull-refresh>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import publicHeader from "@/components/header"
	import {getRecords} from "@/controller/funcCommon";
	export default {
		components: {
			publicHeader
		},
		data() {
			return {
				isRefresh: false,
				records:{
					page: 1,
					psize: 10,
					loading: false,
					finished: false,
					empty: false,
					data:[]
				},
				showPreLoading: true
			}
		},
		methods: {
			onLoad(force){
				var that = this;
				getRecords({
					vue: that,
					force: force,
					url: 'svip/goods/index',
					recordsName: 'goods',
				});
			},
			onPullDownRefresh() {
				this.onLoad(true);
			},
		},
		mounted() {
			this.onLoad();
		},
	}
</script>

<style>
	#svip-enjoy #public-header .van-nav-bar{
		background-color: #14110f!important;
	}
	#svip-enjoy .title-img{
		width: 100%;
		height: 150px;
		border: none;
	}
	#svip-enjoy .wrapper-list{
		display: flex;
		width: 100%;
		height: 40px;
		background: #fff;
	}
	#svip-enjoy .wrapper-list li{
		display: flex;
		flex: 1;
		align-items: center;
		justify-content: center;
		height: 100%;
	}
	#svip-enjoy .wrapper-list li .item{
		padding: 7px 0 8px 0;
		border-bottom: 2px solid transparent;
		color: #666;
		font-size: 14px;
		line-height: 16px;
		opacity: .7;
	}
	#svip-enjoy .wrapper-list li .item.active{
		border-color: #333;
		font-weight: 700;
		opacity: 1;
	}
	#svip-enjoy .goods-list{
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		width: 100%;
		padding: 7.5px;
	}
	#svip-enjoy .goods-list .goods-item{
		width: 50%;
		padding: 7.5px;
		background-color: #f5f5f5;
	}
	#svip-enjoy .goods-list .goods-item .goods-img{
		width: 100%;
		height: 170px;
	}
	#svip-enjoy .goods-list .goods-item .goods-info{
		position: relative;
		padding: 10px;
		background-color: #fff;
	}
	#svip-enjoy .goods-list .goods-item .goods-info .goods-title{
		font-size: 15px;
		color: #333;
		font-weight: 700;
		padding-bottom: 5px;
	}
	#svip-enjoy .goods-list .goods-item .goods-info .discount{
		height: 15px;
		line-height: 15px;
		width: 55px;
		background-color: #29211b;
		color: #ffefa6;
		font-size: 12px;
		border-radius: 3px;
		text-align: center;
	}
	#svip-enjoy .goods-list .goods-item .goods-info .buy-btn{
		position: absolute;
		right: 10px;
		bottom: 10px;
		width: 30px;
		height: 30px;
		background: url(data:image/png;base64,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) 0 0 no-repeat;
		background-size: 100% 100%;
	}
	#svip-enjoy .goods-list .goods-item .goods-info:after{
		position: absolute;
		content: "";
		border-top: 1px solid #eee;
		transform: scaleY(.7);
		left: 0;
		right: 0;
		bottom: 0;
		top: auto;
		border-top-style: dashed;
	}
	#svip-enjoy .goods-list .goods-item .goods-footer{
		background-color: #fff;
		padding: 5px 10px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/svip/vipEnjoy.vue