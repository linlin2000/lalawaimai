<template>
	<div id="tongcheng-search-result">
		<public-header title="搜索结果" @onClickRight="onSetSearch">
			<div slot="right" class="search-btn">
				<span class="icon icon-search"></span>
			</div>
		</public-header>
		<div class="content">
			<van-list
				v-model="records.loading"
				:finished="records.finished"
				@load="onLoad"
				:offset="100"
				:immediate-check="false"
				v-if="!records.empty"
			>
				<information-item :informations="records.data" from="category"></information-item>
				<div class="loaded" v-if="records.finished">
					<div class="loaded-tips">没有更多了</div>
				</div>
			</van-list>
			<div class="no-data" v-else>
				<img src="static/img/order_no_con.png" alt="">
				<p>暂无符合条件的帖子</p>
			</div>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import InformationItem from './components/informationItem'
	import {getData, getRecords} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
			InformationItem
		},
		data() {
			return {
				showPreLoading: true,
				records: {
					page: 1,
					psize: 10,
					loading: true,
					finished: false,
					empty: false,
					data:[]
				}
			}
		},
		methods: {
			onLoad(force) {
				var that = this;
				getRecords({
					vue: that,
					force: force,
					recordsName: 'informations',
					url: 'tongcheng/index/search',
					data: {
						keyword: that.keyword
					}
				})
			},

			onSetSearch() {
				this.$router.push(this.util.getUrl({path: '/gohome/pages/tongcheng/search'}));
			},

		},
		created() {
			if(this.$route.query) {
				this.keyword = this.$route.query.keyword;
			}
		},
		mounted(){
			this.onLoad();
		}

	}
</script>

<style scoped>
	#tongcheng-search-result .search-btn{
		height: 45px;
	}
	#tongcheng-search-result .search-btn .icon-search{
		font-size: 20px;
	}
</style>



// WEBPACK FOOTER //
// src/pages/gohome/tongcheng/searchResult.vue