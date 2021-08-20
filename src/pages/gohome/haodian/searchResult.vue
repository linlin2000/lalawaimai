<template>
	<div id="haodian-searchResult">
		<public-header title="搜索结果"></public-header>
		<div class="content">
			<div class='search-header van-hairline--bottom'>
				<div class="search-content">
					<van-icon name="search"/>
					<input type="text" class="search-input" placeholder="请输入商家" v-model="keyword">
				</div>
				<div class="search-btn" @click="onSearch">搜索</div>
			</div>
			<div class="haodian-store-box" v-if="stores.length > 0">
				<div class="haodian-list">
					<div class="store-item " :class="{'van-hairline--top': index > 0}" v-for="(item, index) in stores" :key="item.id">
						<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/haodian/detail', query: {sid: item.id}})" class="img-wrap">
							<img :src="item.logo" alt="">
						</router-link>
						<div class="store-main">
							<router-link tag="div" :to="util.getUrl({path: '/gohome/pages/haodian/detail', query: {sid: item.id}})">
								<div class="flex-lr">
									<div class="flex">
										<div class="store-title">{{item.title}}</div>
										<van-rate v-model="item.haodian_score" :size="12" disabled-color="#ff2d4b" disabled/>
										<span class="c-gray font-12 margin-5-l">{{item.haodian_score}}分</span>
									</div>
									<div class="c-danger">{{item.distance}}km</div>
								</div>
								<div class="c-gray font-12 margin-10-t">营业时间: {{item.business_hours_cn}}</div>
								<ul class="store-tags" v-if="item.haodian_tags.length > 0">
									<li class="tag-item" v-for="(haodianTag, haodianTagIndex) in item.haodian_tags" :key="haodianTagIndex">{{haodianTag}}</li>
								</ul>
							</router-link>
							<div class="discount-box" v-if="item.activity.length > 0">
								<div class="single-line" v-for="(act, index) in item.activity" :key="act.index">
									<img :src="act.thumb_vue" alt="">
									<div class="discount-text">{{act.text}}</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<!-- 没有合适的商户 -->
			<div class='no-result'v-else>
				<div class='img'>
					<div class='icon icon-store'></div>
				</div>
				<div class='text'>抱歉,没有找到合适的商户</div>
			</div>
		</div>
		<transition name="van-fade">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import load from '@/components/load'
	export default {
		data() {
			return {
				keyword: '',
				stores: [],
				showPreLoading: true
			}
		},
		components: {
			PublicHeader,
			load
		},
		methods: {
			onLoad() {
				let key = this.$route.query.key ? this.$route.query.key : '';
				if(this.keyword) {
					key = this.keyword;
					this.stores = [];
				}
				let params = {
					key: key,
				};
				this.util.request({
					url: 'haodian/hunt/search',
					data: params
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message)
						return;
					}
					this.stores = [...this.stores, ...result.message.stores.store];
				})
			},
			onSearch() {
				if(!this.keyword) {
					return false;
				}
				this.onLoad();
			}
		},
		mounted () {
			this.onLoad();
		},
	}
</script>

<style>
	#haodian-searchResult .content{
		position: absolute;
		top: 46px;
		left: 0;
		right: 0px;
		bottom: 0px;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		overflow-y: auto;
		background-color: #f5f5f5;
		padding-bottom: 10px;
	}
	#haodian-searchResult .content::-webkit-scrollbar {
		display: none;
	}
	#haodian-searchResult .content::-webkit-scrollbar {
		width: 0px;
		height: 0px;
	}
	#haodian-searchResult .search-header{
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
	#haodian-searchResult .search-header .search-content{
		width: 90%;
		height: 100%;
		border-radius: 40px;
		position: relative;
	}
	#haodian-searchResult .search-header .search-content .van-icon{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		width: 30px;
		line-height: 28px;
		text-align: center;
		font-size: 14px;
	}
	#haodian-searchResult .search-header .search-content .search-input{
		width: 100%;
		height: 100%;
		line-height: 28px;
		border-radius: 40px;
		padding-left: 25px;
		box-sizing: border-box;
		background: #f2f2f2;
		font-size: 14px;
	}
	#haodian-searchResult .search-header .search-btn{
		font-size: 14px;
		color: #FF2D4B;
	}
	/* 没有合适的商户 */
	#haodian-searchResult .content .no-result{
		background-color: #fff;
		font-size: 14px;
		text-align: center;
		padding-top: 15px;
		padding-bottom: 10px;
		color: #656565;
		margin-bottom: 10px;
		line-height: 25px;
	}
	#haodian-searchResult .content .no-result .img .icon{
		font-size: 20px;
	}
	#haodian-searchResult .content .no-result .text{
		margin-top: 3px;
	}
	#haodian-searchResult .haodian-list{
		background-color: #f5f5f5;
	}
	#haodian-searchResult .haodian-list .store-item{
		padding: 12px;
		background-color: #fff;
		font-size: 14px;
		display: flex;
		flex-flow: row nowrap;
		align-items: flex-start;
		justify-content: space-between;
	}
	#haodian-searchResult .haodian-list .store-item:first-child:after{
		display: none;
	}
	#haodian-searchResult .haodian-list .store-item .img-wrap{
		width: 70px;
		height: 70px;
		font-size: 0px;
		border-radius: 5px;
		overflow: hidden;
	}
	#haodian-searchResult .haodian-list .store-item .img-wrap img{
		width: 100%;
		height: 100%;
	}
	#haodian-searchResult .haodian-list .store-item .store-main{
		width: 77%;
	}
	#haodian-searchResult .haodian-list .store-item .store-main .store-title{
		max-width: 90px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 15px;
		font-weight: 500;
		margin-right: 5px;
	}
	#haodian-searchResult .haodian-list .store-item .store-main .store-tags{
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		margin-right: -10px;
	}
	#haodian-searchResult .haodian-list .store-item .store-main .store-tags .tag-item{
		font-size: 12px;
		color: #ff2d4b;
		background-color: #FFE3E7;
		padding: 3px 5px;
		border-radius: 3px;
		margin: 10px 10px 0 0;
		max-width: 58px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	#haodian-searchResult .haodian-list .store-item .store-main .discount-box{
		width: 100%;
		position: relative;
		padding-top: 4px;
	}
	#haodian-searchResult .haodian-list .store-item .store-main .discount-box .toggle{
		position: absolute;
		right: 0;
		top: 10px;
		font-size: 11px;
		color: #999;
	}
	#haodian-searchResult .haodian-list .store-item .store-main .discount-box .toggle .icon{
		font-size: 11px;
		color: #999;
	}
	#haodian-searchResult .haodian-list .store-item .store-main .discount-box .single-line {
		max-width: 94%;
		padding-top: 6px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 12px;
		display:flex;
		flex-flow:row wrap;
		align-items:center;
	}
	#haodian-searchResult .haodian-list .store-item .store-main .discount-box .single-line img{
		width: 15px;
		height: 15px;
	}
	#haodian-searchResult .haodian-list .store-item .store-main .discount-box .single-line .discount-text {
		color: #999;
		max-width: 90%;
		font-size: 12px;
		padding-left: 5px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	#haodian-searchResult .haodian-list .store-item .store-main .discount-box{
		width: 100%;
		position: relative;
		padding-top: 4px;
	}
	#haodian-searchResult .haodian-list .store-item .store-main .discount-box .single-line{
		max-width: 94%;
		padding-top: 6px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 12px;
		display:flex;
		flex-flow:row wrap;
		align-items:center;
	}
	#haodian-searchResult .haodian-list .store-item .store-main .discount-box .single-line img{
		width: 15px;
		height: 15px;
	}
	#haodian-searchResult .haodian-list .store-item .store-main .discount-box .single-line .discount-text{
		color: #999;
		max-width: 90%;
		font-size: 12px;
		padding-left: 5px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/haodian/searchResult.vue