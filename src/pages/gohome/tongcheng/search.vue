<template>
	<div id="tongcheng-search">
		<public-header title="搜索"></public-header>
		<div class="content">
			<div class='search-header van-hairline--bottom'>
				<div class="search-content">
					<van-icon name="search"/>
					<input type="text" class="search-input" placeholder="请输入信息内容" v-model="keyword">
				</div>
				<div class="search-btn" @click="onGetSearch">搜索</div>
			</div>
			<div class='rmd-history'>
				<div class='search-rmd-wrap' v-if="categorys && categorys.length > 0">
					<div class='search-rmd-title '>
						<div class="van-hairline--bottom">热门搜索</div>
					</div>
					<div class='search-rmd'>
						<router-link :to="util.getUrl({path: '/gohome/pages/tongcheng/category', query: {id: item.parentid == 0 ? item.id : item.parentid, childid: item.parentid == 0 ? 0 : item.id}})" tag="div" v-for="(item, index) in categorys" :key="index">{{item.title}}</router-link>
					</div>
				</div>
				<div class='search-history-wrap' v-if="searchHistory && searchHistory.length > 0">
					<div class='search-rmd-title'>
						<div class="van-hairline--bottom">历史搜索</div>
						<div class='icon icon-delete' @click="onDeleteHistory"></div>
					</div>
					<div class='search-rmd'>
						<div v-for="(item, index) in searchHistory" :key="index" @click="onSelectHistory(item)">{{item}}</div>
					</div>
				</div>
			</div>
			<van-cell-group v-if="0">
				<van-cell title="猜你在找" />
				<van-cell is-link class="guess-store" v-for="(item, index) in 5" to="" :key="index">
					<template slot="title">
						<img src="" alt="">
						<span>技术人才</span>
					</template>
				</van-cell>
			</van-cell-group>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	import {getData} from "@/controller/funcCommon"
	export default {
		data() {
			return {
				showPreLoading: true,
				keyword: '',
				searchHistory: [],
				categorys: [],
			}
		},
		components: {
			PublicHeader,
			PublicFooter
		},
		methods: {
			onLoad() {
				var that = this;
				that.searchHistory = that.util.getStorage('isearchHistory.tongcheng');
				if(!that.searchHistory) {
					that.searchHistory = [];
				}
				getData({
					vue: that,
					url: 'tongcheng/index/get_search',
					data: {},
					success: function(res) {
						that.categorys = res.categorys;
					},
				});
			},
			onGetSearch() {
				if(this.keyword == '') {
					this.util.$toast('请输入搜索条件');
					return false;
				}
				this.searchHistory.push(this.keyword);
				this.util.setStorage('isearchHistory.tongcheng', this.searchHistory);
				this.$router.push(this.util.getUrl({path: '/gohome/pages/tongcheng/searchResult', query: {id: this.id, keyword: this.keyword}}));
			},
			onDeleteHistory() {
				this.$dialog.confirm({
					message: '确定清除历史记录吗'
				}).then((res) => {
					if (res == 'confirm') {
						this.util.removeStorage('isearchHistory.tongcheng');
						this.searchHistory = [];
					}
				})
			},
			onSelectHistory(item) {
				this.keyword = this.keyword + item;
			},
			onGoHot(parentid, childid) {
				if(parentid == 0) {
					parentid = childid;
				} else {
					childid = 0;
				}
				this.$router.push(this.util.getUrl({path: '/gohome/pages/tongcheng/searchResult', query: {id: this.id, keyword: this.keyword}}));
			},

		},
		created() {
			if(this.$route.query) {
				this.id = this.$route.query.id;
			}
		},
		mounted(){
			this.onLoad();
		}

	}
</script>

<style>
	#tongcheng-search .content{
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
	#tongcheng-search .content::-webkit-scrollbar {
		width: 0px;
		height: 0px;
	}
	#tongcheng-search .search-header{
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
	#tongcheng-search .search-header .search-content{
		width: 90%;
		height: 100%;
		border-radius: 40px;
		position: relative;
	}
	#tongcheng-search .search-header .search-content .van-icon{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 30px;
		line-height: 28px;
		text-align: center;
		font-size: 14px;
	}
	#tongcheng-search .search-header .search-content .search-input{
		width: 100%;
		height: 100%;
		line-height: 28px;
		border-radius: 40px;
		padding-left: 25px;
		box-sizing: border-box;
		background: #f2f2f2;
		font-size: 14px;
	}
	#tongcheng-search .search-header .search-btn{
		font-size: 14px;
		color: #FF2D4B;
	}
	#tongcheng-search .rmd-history{
		margin-bottom: 10px;
		background-color: #f5f5f5;
	}
	#tongcheng-search .rmd-history .search-rmd-title{
		position: relative;
		padding-left: 16px;
		font-size: 15px;
		line-height: 38px;
		color: #656565;
		background: #fff;
	}
	#tongcheng-search .rmd-history .search-rmd{
		padding: 8px 9px;
		background: #fff;
		overflow: hidden;
	}
	#tongcheng-search .rmd-history .search-rmd div{
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
	#tongcheng-search .search-rmd-title .icon{
		position: absolute;
		top: 0;
		right: 15px;
	}
	#tongcheng-search .search-history-wrap{
		margin-top: 10px;
	}
	#tongcheng-search .guess-store .van-cell__title{
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
	}
	#tongcheng-search .guess-store .van-cell__title img{
		width: 28px;
		height: 28px;
		border-radius: 50%;
		margin-right: 5px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/tongcheng/search.vue