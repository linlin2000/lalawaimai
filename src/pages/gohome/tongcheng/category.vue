<template>
	<div id="tongcheng-category">
		<public-header :title="page_title" @onClickRight="onSetSearch">
			<div slot="right" class="search-btn">
				<span class="icon icon-search"></span>
			</div>
		</public-header>
		<public-footer :menufooter="menufooter" :preLoading="showPreLoading"></public-footer>
		<div class="content">
			<van-pull-refresh v-model="isRefresh" @refresh="onPullDownRefresh">
				<div class="categorys-wrap van-hairline--bottom">
					<div class="cate-active" v-if="categorys[id]">{{categorys[id]['title']}}</div>
					<div class="cate-all swiper-container" id="cate-swiper">
						<ul class="swiper-wrapper">
							<li class="cate-item ellipsis swiper-slide" v-for="item in categorys" :key="'c' + item.id" :data-id="item.id">{{item.title}}</li>
						</ul>
					</div>
				</div>
				<div class="category-child" v-if="categorys[id] && categorys[id].child">
					<router-link tag="div" class="child-item" :class="{active: item.id == childid}" v-for="item in categorys[id].child" :key="item.id" :to="util.getUrl({path: '/gohome/pages/tongcheng/category', query: {id: id, childid: item.id}})">{{item.title}}</router-link>
				</div>
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
					<p>还没有信息，快去发布吧</p>
				</div>
			</van-pull-refresh>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	import InformationItem from './components/informationItem'
	import {getData, getRecords} from "@/controller/funcCommon"
	import Swiper from 'swiper';
	import 'swiper/dist/css/swiper.min.css';
	export default {
		components: {
			PublicHeader,
			PublicFooter,
			InformationItem
		},
		data() {
			return {
				showPreLoading: true,
				isRefresh: false,
				categorys: {},
				records: {
					page: 1,
					psize: 10,
					loading: true,
					finished: false,
					empty: false,
					data:[]
				},
				page_title: '同城信息',
				menufooter: {},
			}
		},
		methods: {
			onLoad(force, swiperStatus) {
				var that = this;
				getRecords({
					vue: that,
					force: force,
					recordsName: 'informations',
					url: 'tongcheng/index/category',
					data: {
						id: that.id,
						childid: that.childid,
						keyword: that.keyword,
						menufooter: 1
					},
					success: (res) => {
						that.categorys = res.categorys;
						that.page_title = that.categorys[that.id].title;
						that.util.setWXTitle(that.page_title);
						that.menufooter = window.menufooter;
						if(swiperStatus) {
							that.$nextTick(function() {
								that.swiper = new Swiper('.swiper-container', {
									autoplay: {
										delay: 2000,
										stopOnLastSlide: false,
										disableOnInteraction: false,
									},
									loop: true,
									slidesPerView: 4,
									on: {
										click: function(e) {
											//this指向的是swiper实例
											let id = e.target.dataset.id;
											that.$router.push(that.util.getUrl({path: '/gohome/pages/tongcheng/category', query: {id: id, childid: 0}}));
										}
									}
								})
							})
						}
					}
				})
			},

			onPullDownRefresh() {
				this.onLoad(true);
			},
			onSetSearch() {
				this.$router.push(this.util.getUrl({path: '/gohome/pages/tongcheng/search', query: {id: this.id}}));
			},
			onToggleCategory(id) {
				this.$router.push(this.util.getUrl({path: '/gohome/pages/tongcheng/category', query: {id: id, childid: 0}}));
			},

		},
		created() {
			if(this.$route.query) {
				this.id = this.$route.query.id;
				this.childid = this.$route.query.childid;
				this.keyword = this.$route.query.keyword;
			}
		},
		watch: {
			'$route' (to, from) {
				this.showPreLoading = true;
				if(this.$route.query && this.$route.query.id > 0) {
					this.id = this.$route.query.id

					this.childid = this.$route.query.childid > 0 ? this.$route.query.childid : 0;
				}
				//销毁swiper实例对象
				//this.swiper.destroy();
				this.onLoad(true);
			}
		},
		mounted(){
			this.onLoad(false, true);
		}

	}
</script>

<style scoped>
	#tongcheng-category .search-btn{
		height: 45px;
	}
	#tongcheng-category .search-btn .icon-search{
		font-size: 20px;
	}
	#tongcheng-category .category-child{
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		padding: 5px 0px 15px 15px;
		font-size: 13px;
	}
	#tongcheng-category .category-child .child-item{
		margin: 10px 10px 0 0;
		padding: 5px 15px;
		background-color: #fff;
		border-radius: 50px;
		border: 1px solid #eee;
	}
	#tongcheng-category .category-child .child-item.active{
		background-color: #FFE0E5;
		color: #ff2d4b;
		border-color: #FFE0E5;
	}
	#tongcheng-category .categorys-wrap{
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		background-color: #fff;
		font-size: 14px;
	}
	#tongcheng-category .categorys-wrap .cate-active{
		width: 20%;
		height: 46px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #ff2d4b;
		position: relative;
	}
	#tongcheng-category .categorys-wrap .cate-active:before{
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 0;
		border-bottom: 2px solid #ff2d4b;
	}
	#tongcheng-category .categorys-wrap .cate-all{
		width: 80%;
		height: 46px;
	}
	#tongcheng-category .categorys-wrap .cate-all .cate-item{
		text-align: center;
		line-height: 46px;
		padding: 0 5px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
</style>



// WEBPACK FOOTER //
// src/pages/gohome/tongcheng/category.vue