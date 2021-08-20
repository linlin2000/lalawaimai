<template>
	<div id="creditshop-goodsdetail">
		<public-header title="商品详情"></public-header>
		<div class="content">
			<div class="main-scroll">
				<van-swipe :autoplay="3000" class="margin-15">
					<van-swipe-item>
						<img :src="good.thumb" alt="">
					</van-swipe-item>
				</van-swipe>
				<div class="cell-group">
					<div class="cell">
						<div class="cell-text goods-title">
							<label v-if="good.type == 'goods'">商品</label>
							<label v-else-if="good.type == 'credit2'">余额</label>
							<label v-else-if="good.type == 'redpacket'">红包</label>
							<span>{{good.title}}</span>
						</div>
					</div>
					<div class="cell cell-credit">
						<div class="cell-text">
							<span>单人仅限兑换: {{good.chance}} 次,该商品目前已累计兑换: {{good.records_num}} 次</span>
						</div>
					</div>
					<div class="cell">
						<div class="cell-text">
							<div class="price">
								<span class="big">{{good.use_credit1}}</span> 酒币
								<template v-if="good.use_credit2 > 0">
									+ <span class="big">{{good.use_credit2}}</span> 元
								</template>
								<span class="old-price">原价: {{good.old_price}}元</span>
							</div>
						</div>
					</div>
				</div>
				<div class="wui-tab">
					<van-tabs v-model="active" swipeable>
						<van-tab title="商品详情">
							<div class="tab-basic" v-html="good.description" v-if="good.description"></div>
							<div class="nodata" v-else>暂无商品详情</div>
						</van-tab>
						<van-tab title="参与记录">
							<template v-if="!records.empty">
								<div class="list" v-for="(item, index) in records.data" :key="index">
									<div class="list-media">
										<img :src="item.avatar" alt="">
									</div>
									<div class="list-inner">
										<div class="title">{{item.nickname}}</div>
									</div>
									<div class="list-media text"> {{item.addtime}} </div>
								</div>
								<div class="more" v-if="!records.loaded">
									<span @click="onGetRecords">查看更多</span>
								</div>
								<div class="more" v-else>
									<span class="c-disabled">没有更多了</span>
								</div>
							</template>
							<div class="nodata" v-else>暂无参与记录</div>
						</van-tab>
					</van-tabs>
				</div>
				<div class="list-group">
					<div class="list">
						<div class="group-list-inner">
							<div class="title border-1px-b">为您推荐</div>
							<div class="text">
								<router-link :to="util.getUrl({path: '/pages/creditshop/goodsDetail', query: {id: item.id}})" class="item" v-for="(item, index) in goods" :key="index">
									<img :src="item.thumb" alt="">
									<div class="title">{{item.title}}</div>
									<div class="price">
										{{item.use_credit1}}酒币
										<template v-if="item.use_credit2 > 0">
											+ {{item.use_credit2}}元
										</template>
									</div>
								</router-link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<template v-if="good.status == 1">
				<template v-if="good.can == 1">
					<div class="bottom-fixed disabled" v-if="member.credit1 < good.use_credit1">酒币不足</div>
					<router-link :to="util.getUrl({path: '/pages/creditshop/create', query: {goods_id: good.id}})" class="bottom-fixed" v-else>立即兑换</router-link>
				</template>
				<div class="bottom-fixed disabled" v-else>兑换已达最大次数</div>
			</template>
			<div class="bottom-fixed disabled" v-else>商品已下架，无法兑换</div>
		</div>
		<div class="tips flex" v-if="good.status == 0">
			<div class="icon icon-commentfill"></div>
			<div>商品已下架，无法兑换</div>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		data() {
			return {
				id: Number,
				good: {},
				goods: {},
				member: {},
				records: {
					page: 2,
					psize: 15,
					empty: false,
					loaded: false,
					data: [],
				},
				active: 0,
				showPreLoading: true
			}
		},
		components: {
			PublicHeader,
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'creditshop/index/detail',
					data: {
						id: this.id
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					result = result.message;
					this.good = result.good;
					this.goods = result.goods;
					this.member = result.member;
					this.records.data = [...this.records.data, ...result.records];
					if(!this.records.data.length) {
						this.records.empty = true;
					}
				})
			},
			onGetRecords() {
				if(this.records.loaded) {
					return false;
				}
				this.util.request({
					url: 'creditshop/index/detail',
					data: {
						id: this.id,
						page: this.records.page,
						psize: this.records.psize
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					result = result.message;
					this.records.data = [...this.records.data, ...result.records];
					if(result.records.length < this.records.psize) {
						this.records.loaded = true;
					}
					if(!this.records.data.length) {
						this.records.empty = true;
					}
					this.records.page++;
				})
			}
		},
		watch: {
			// 对路由变化作出响应...
			'$route' (to, from) {
				this.good = {};
				this.goods = {};
				this.member = {};
				this.records = {
					page: 2,
					psize: 15,
					empty: false,
					loaded: false,
					data: [],
				},
				this.active = 0;
				if(this.$route.query.id) {
					this.id = this.$route.query.id;
				}
				this.onLoad();
			}
		},
		created() {
			if(this.$route.query.id) {
				this.id = this.$route.query.id;
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
	#creditshop-goodsdetail .tips{
		position: fixed;
		top: 46px;
		left: 0;
		right: 0;
		z-index: 10000;
		height:30px;
		background-color:rgba(0,0,0,0.3);
		line-height:30px;
		font-size:16px;
		color:#ccc;
	}
	#creditshop-goodsdetail .tips .icon{
		margin: 0 5px 0 10px;
	}
    #creditshop-goodsdetail .content .main-scroll{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 50px;
		right: 0;
		overflow-y: scroll;
    }
    #creditshop-goodsdetail .content .main-scroll .van-swipe .van-swipe-item img{
		max-width: 100%;
		max-height: 300px;
		display: block;
		margin: 0 auto;
    }
    #creditshop-goodsdetail .content .main-scroll .cell-group{
		background-color:#fff;
		line-height:1.4;
		font-size:17px;
		overflow:hidden;
		position:relative;
		display:block;
    }
    #creditshop-goodsdetail .content .main-scroll .cell-group .cell{
		position:relative;
		padding:16px 13px 14px;
		display:flex;
		-webkit-box-align:center;
		align-items:center;
		transition-duration:300ms;
		transition-property:background-color;
		line-height:20px;
    }
    #creditshop-goodsdetail .content .main-scroll .cell-group .cell.cell-credit {
		padding:4px 11px;
	}
	#creditshop-goodsdetail .content .main-scroll .cell-group .cell .cell-text{
		color:#7c7c7c;
		font-size:13px;
		-webkit-box-flex:1;
		flex:1;
		line-height:15px;
	}
	#creditshop-goodsdetail .content .main-scroll .cell-group .cell .cell-text.goods-title{
		line-height: 1.8;
	}
	#creditshop-goodsdetail .content .main-scroll .cell-group .cell .cell-text label{
		padding:1px 4px;
		background:#ff2d4b;
		border-radius: 5px;
		color:#fff;
		font-size:12px;
		margin-right:4px;
	}
	#creditshop-goodsdetail .content .main-scroll .cell-group .cell .cell-text .price{
		text-align:left;
		margin-right:3px;
		color:#f24749;
		font-weight:bold;
	}
	#creditshop-goodsdetail .content .main-scroll .cell-group .cell .cell-text .price .big{
		font-size:17px;
		font-weight:bold;
	}
	#creditshop-goodsdetail .content .main-scroll .cell-group .cell .cell-text .price .old-price{
		color:#7c7c7c;
		font-size: 14px;
		text-decoration: line-through;
	}
	#creditshop-goodsdetail .content .main-scroll .wui-tab{
		margin-top: 11px;
		background-color: #fff;
	}
	#creditshop-goodsdetail .content .main-scroll .wui-tab .nodata{
		font-size: 15px;
		padding: 10px 15px;
		color: #999;
	}
	#creditshop-goodsdetail .content .main-scroll .wui-tab .van-tab__pane .tab-basic{
		font-size:15px;
		color:#666;
		padding:11px;
		box-sizing:border-box;
		width:100%;
	}
	#creditshop-goodsdetail .content .main-scroll .wui-tab .van-tab__pane .list{
		position:relative;
		display:flex;
		padding:8px 13px;
		transition-duration:300ms;
		-webkit-box-align:center;
		align-items:center;
		overflow:hidden;
	}
	#creditshop-goodsdetail .content .main-scroll .wui-tab .van-tab__pane .list .list-media{
		display:flex;
		flex-shrink:0;
		-webkit-box-lines:single;
		flex-wrap:nowrap;
		box-sizing:border-box;
		-webkit-box-align:center;
		align-items:center;
		margin-right:13px;
		position:relative;
		color:#aaa;
	}
	#creditshop-goodsdetail .content .main-scroll .wui-tab .van-tab__pane .list .list-media img{
		height:44px;
		width:44px;
		border-radius:100%;
		display:inline-block;
		overflow:hidden;
	}
	#creditshop-goodsdetail .content .main-scroll .wui-tab .van-tab__pane .list .list-media.text{
		font-size:13px;
		color:#666;
	}
	#creditshop-goodsdetail .content .main-scroll .wui-tab .van-tab__pane .list .list-inner{
		position:relative;
		width:100%;
		overflow:hidden;
		box-sizing:border-box;
		-webkit-box-flex:1;
		flex:1;
		display:block;
	}
	#creditshop-goodsdetail .content .main-scroll .wui-tab .van-tab__pane .list .list-inner .title{
		position:relative;
		color:#000;
		white-space:nowrap;
		overflow:hidden;
		text-overflow:ellipsis;
		height:22px;
		line-height:22px;
		font-size:15px;
	}
	#creditshop-goodsdetail .content .main-scroll .wui-tab .van-tab__pane .more{
		text-align:center;
		font-size:15px;
		color:#666;
		padding-bottom:11px;
	}
	#creditshop-goodsdetail .content .main-scroll .wui-tab .van-tab__pane .more span{
		color: #f60;
	}
	#creditshop-goodsdetail .content .main-scroll .list-group{
		margin-top:11px;
		background-color:#fff;
		position:relative;
	}
	#creditshop-goodsdetail .content .main-scroll .list-group .list{
		position:relative;
		display:flex;
		transition-duration:300ms;
		-webkit-box-align:center;
		align-items:center;
		overflow:hidden;
	}
	#creditshop-goodsdetail .content .main-scroll .list-group .list .group-list-inner{
		position:relative;
		width:100%;
		overflow:hidden;
		box-sizing:border-box;
		display:-webkit-box;
		display:-webkit-flex;
		display:flex;
		-webkit-box-flex:1;
		-webkit-flex:1;
		-ms-flex:1;
		flex:1;
		display:block;
	}
	#creditshop-goodsdetail .content .main-scroll .list-group .list .title{
		font-size:17px;
		padding: 0px 15px;
		height: 44px;
		line-height: 44px;
	}
	#creditshop-goodsdetail .content .main-scroll .list-group .list .text{
		position:relative;
		font-size:14px;
		color:#666;
		height:auto;
		display:flex;
		-webkit-box-align:start;
		align-items:center;
		padding: 15px 0;
	}
	#creditshop-goodsdetail .content .main-scroll .list-group .list .text .item{
		height:auto;
		width:33%;
		text-align:center;
		display:inline-block;
		color:#666;
		line-height: 20px;
	}
	#creditshop-goodsdetail .content .main-scroll .list-group .list .text .item img{
		width:88px;
		height:88px;
		vertical-align:middle;
	}
	#creditshop-goodsdetail .content .main-scroll .list-group .list .text .item .title{
		color:#666;
		font-size:14px;
		height:20px;
		line-height:20px;
		position:relative;
		white-space:nowrap;
		text-overflow:ellipsis;
		overflow:hidden;
		margin-top: 5px;
	}
	#creditshop-goodsdetail .content .main-scroll .list-group .list .text .item .price{
		color:#f24749;
		font-size:12px;
	}
	#creditshop-goodsdetail .content .bottom-fixed{
		display: inline-block;
		position: absolute;
		bottom:0;
		width:100%;
		height:50px;
		text-align:center;
		line-height:50px;
		font-size:16px;
		background-color:#f24749;
		color:#fff;
	}
	#creditshop-goodsdetail .content .bottom-fixed.disabled{
		background: #ddd;
		color: #fff;
	}
</style>


// WEBPACK FOOTER //
// src/pages/creditshop/goodsDetail.vue