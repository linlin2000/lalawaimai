<template>
	<div id="search">
		<public-header title="搜索"></public-header>
		<public-footer :menufooter="menufooter" :preLoading="preLoading"></public-footer>
		<div class="content">
			<div class='search-header van-hairline--bottom'>
				<div class="search-content">
					<van-icon name="search"/>
					<input type="text" class="search-input" placeholder="请输入商家或商品名称" v-model="keyword">
				</div>
				<div class="search-btn" @click="onSearch">搜索</div>
			</div>
			<div class='rmd-history' v-if="hotStores.length > 0 || searchHistorys.length > 0">
				<div class='search-rmd-wrap' v-if="hotStores.length > 0">
					<div class='search-rmd-title '>
						<div class="van-hairline--bottom">热门搜索</div>
					</div>
					<div class='search-rmd'>
						<router-link :to="util.getUrl({path: item.url})" tag="div" v-for="(item, index) in hotStores" :key="index">{{item.title}}</router-link>
					</div>
				</div>
				<div class='search-history-wrap' v-if="searchHistorys.length > 0">
					<div class='search-rmd-title'>
						<div class="van-hairline--bottom">历史搜索</div>
						<div class='icon icon-delete' @click="onClearHistory"></div>
					</div>
					<div class='search-rmd'>
						<div v-for="(item, index) in searchHistorys" @click="onKeyword(item)" :key="index">{{item}}</div>
					</div>
				</div>
			</div>
			<van-cell-group v-if="recommendStores.length > 0">
				<van-cell title="猜你在找" />
				<van-cell is-link class="guess-store" v-for="(item, index) in recommendStores" :to="util.getUrl({path: item.url})" :key="index">
					<template slot="title">
						<img :src="item.logo">
						<span>{{item.title}}</span>
					</template>
				</van-cell>
			</van-cell-group>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	export default {
		data() {
			return {
				hotStores:[],
				recommendStores: [],
				searchHistorys: [],
				keyword: '',
				menufooter: this.util.getStorage('menufooter'),
				preLoading: false
			}
		},
		components: {
			PublicHeader,
			PublicFooter
		},
		methods: {
			onLoad() {
				this.preLoading = true;
				this.util.request({
					url: 'wmall/home/hunt/index',
					data: {
						menufooter: 1
					}
				}).then((res) => {
					this.preLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message)
						return;
					}
					this.util.setStorage('itime', result.message.v);
					this.hotStores = [...this.hotStores, ...result.message.hotStores];
					this.recommendStores = [...this.recommendStores, ...result.message.recommendStores];
					this.searchHistorys = [...this.searchHistorys, ...result.message.searchHistorys];
				})
			},
			onClearHistory() {
				this.$dialog.confirm({
					message: '确定清除历史记录吗'
				}).then((res) => {
					if (res == 'confirm') {
						this.util.request({
							url: 'wmall/home/hunt/truncate',
						}).then((res) => {
							let result = res.data.message;
							if(result.errno) {
								this.$toast(result.message)
								return;
							}
							this.searchHistorys = [];
						}).catch((res) => {

						})
					}
				})
			},
			onKeyword(keyword) {
				this.keyword = keyword;
			},
			onSearch() {
				if(!this.keyword) {
					return false;
				}
				let key = this.keyword;
				this.$router.push(this.util.getUrl({
					path: '/pages/home/searchResult',
					query:{
						key: this.keyword
					}
				}));
			}
		},
		mounted () {
			this.onLoad();
		},
	}
</script>

<style>
	#search .content{
		position: absolute;
		left: 0;
		right: 0px;
		bottom: 0px;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		overflow-y: auto;
		background-color: #f5f5f5;
	}
	#search .content::-webkit-scrollbar {
		width: 0px;
		height: 0px;
	}
	#search .search-header{
		background-color: #fff;
		width: 100%;
		height: 50px;
		box-sizing: border-box;
		padding:10px;
		display:flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: space-between;
	}
	#search .search-header .search-content{
		width: 90%;
		height: 100%;
		border-radius: 40px;
		position: relative;
	}
	#search .search-header .search-content .van-icon{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 30px;
		line-height: 28px;
		text-align: center;
		font-size: 14px;
	}
	#search .search-header .search-content .search-input{
		width: 100%;
		height: 100%;
		line-height: 28px;
		border-radius: 40px;
		padding-left: 25px;
		box-sizing: border-box;
		background: #f2f2f2;
		font-size: 14px;
	}
	#search .search-header .search-btn{
		font-size: 14px;
		color: #FF2D4B;
	}
	#search .rmd-history{
		margin-bottom: 10px;
		background-color: #f5f5f5;
	}
	#search .rmd-history .search-rmd-title{
		position: relative;
		padding-left: 16px;
		font-size: 15px;
		line-height: 38px;
		color: #656565;
		background: #fff;
	}
	#search .rmd-history .search-rmd{
		padding: 8px 9px;
		background: #fff;
		overflow: hidden;
	}
	#search .rmd-history .search-rmd div{
		display: inline-block;
		float: left;
		max-width: 187px;
		min-width: 58px;
		height: 31px;
		line-height: 31px;
		margin: 8px 5px;
		padding: 0 16px;
		-webkit-box-sizing: border-box;
		-mox-box-sizing: border-box;
		box-sizing: border-box;
		-webkit-border-radius: 2px;
		-moz-border-radius: 2px;
		border-radius: 2px;
		border: 1px solid #ccc;
		color: #2f2f2f;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
		text-align: center;
		font-size: 14px;
	}
	#search .search-rmd-title .icon{
		position: absolute;
		top: 0;
		right: 15px;
	}
	#search .search-history-wrap{
		margin-top: 10px;
	}
	#search .guess-store .van-cell__title{
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
	}
	#search .guess-store .van-cell__title img{
		width: 28px;
		height: 28px;
		border-radius: 50%;
		margin-right: 5px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/home/search.vue