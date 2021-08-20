<template>
	<div id="creditshop-goods">
		<public-header title="兑换商品"></public-header>
		<div class="content">
			<van-search
				v-model="key"
				show-action
				background="#f5f5f5"
				placeholder="请输入关键字"
			>
				<div slot="action" @click="onSearch">搜索</div>
			</van-search>
			<div class="goods-group">
				<van-list
						v-model="goods.loading"
						:finished="goods.finished"
						@load="onLoad"
						:offset="100"
						:immediate-check="false"
						v-if="!goods.empty"
						class="goods-list"
				>
					<div class="goods-item" v-for="(item, index) in goods.data" :key="index">
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
					<div class="loaded-group">
						<div class="loaded" v-if="goods.finished">
							<div class="loaded-tips">没有更多了</div>
						</div>
					</div>
				</van-list>
				<div class="no-data" v-else>
					<img src="static/img/goods_no_con.png" alt="">
					<p>暂无符合条件的商品!</p>
				</div>
			</div>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import Load from '@/components/load'
	export default {
		data() {
			return {
				category_id: Number,
				goods: {
					page: 1,
					psize: 12,
					title: '',
					loading: false,
					finished: false,
					empty: false,
					data: []
				},
				key: '',
				showPreLoading: true
			}
		},
		components: {
			PublicHeader,
			Load
		},
		methods: {
			onLoad(force) {
				if(force) {
					this.goods = {
						page: 1,
						psize: 12,
						title: this.key,
						loading: true,
						finished: false,
						empty: false,
						data: []
					};
				}
				if(this.goods.finished) {
					return false;
				}
				this.util.request({
					url: 'creditshop/index/goods',
					data: {
						page: this.goods.page,
						psize: this.goods.psize,
						category_id: this.category_id,
						title: this.goods.title
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					result = result.message.goods;
					this.goods.data = [...this.goods.data, ...result];
					if(result.length < this.goods.psize ) {
						this.goods.finished = true;
						if(!this.goods.data.length) {
							this.goods.empty = true;
						}
					}
					this.goods.loading = false;
					this.goods.page++;
				})
			},
			onSearch() {
				if(this.key) {
					this.onLoad(true);
				}
			}
		},
		created() {
			if(this.$route.query.category_id) {
				this.category_id = this.$route.query.category_id;
			} else {
				this.util.$toast('参数错误')
				return false;
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#creditshop-goods .content{
		bottom: 0;
		background: #f9f9f9;
	}
	#creditshop-goods .content #load .loaded .loaded-tips{
		background: #f5f5f5;
	}
	#creditshop-goods .content .van-search__action{
		color:#5f646e;
		padding: 0 10px;
	}
	#creditshop-goods .content .van-search .van-icon-clear{
		display: none;
	}
	#creditshop-goods .content .goods-group{
		background-color: #f9f9f9;
	}
	#creditshop-goods .goods-list{
		padding: 7.5px;
		background-color: #fff;
		text-align: center;
		display: flex;
		flex-flow: row wrap;
		align-items: center;
	}
	#creditshop-goods .goods-list .goods-item{
		width: 33.33%;
		padding: 7.5px;
	}
	#creditshop-goods .goods-list .goods-item .thumb{
		width: 90px;
		height: 90px;
		margin: 0 auto;
	}
	#creditshop-goods .goods-list .goods-item .thumb img{
		width: 100%;
		height: 100%;
	}
	#creditshop-goods .goods-list .goods-item .goods-name{
		font-size: 13px;
		line-height: 1.2;
		margin: 5px 0;
	}
	#creditshop-goods .goods-list .goods-item .price{
		text-align: center;
	}
	#creditshop-goods .goods-list .goods-item .exchange{
		margin-top: 8px;
		text-align: center;
		height: 20px;
	}
	#creditshop-goods .goods-list .goods-item .exchange .exchange-btn{
		padding: 1px 10px;
		font-size: 12px;
		border: 1px solid #ff2d4b;
		border-radius: 20px;
	}
	#creditshop-goods .goods-list .loaded-group{
		width: 100%;
	}
	#creditshop-goods .goods-list .loaded-group .loaded-tips{
		background-color: #fff;
	}
	#creditshop-goods .no-data{
		padding: 40px 0;
	}
</style>


// WEBPACK FOOTER //
// src/pages/creditshop/goods.vue