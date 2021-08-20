<template>
	<div id="publish-index">
		<public-header title="发布信息"></public-header>
		<public-footer :menufooter="menufooter" :preLoading="showPreLoading" :showFailedTips="black_member.status" :failedTips="failedTips"></public-footer>
		<div class="content">
			<div class="tip">免责声明：本平台只负责信息的发布与展示，信息本身与平台无关，平台本身不负任何责任。</div>
			<div class="store-settle flex-lr hide">
				<div class="flex">
					<i class="icon icon-store"></i>
					<ul class="margin-10-l">
						<li class="font-15 margin-5-b">我是商家，点击入驻</li>
						<li class="c-gray font-13">超低成本，帮您快速宣传店铺</li>
					</ul>
				</div>
				<van-icon name="arrow" class="c-gray font-14"></van-icon>
			</div>
			<div class="bg-default margin-10-t">
				<div class="padding-15-tb text-center font-13  van-hairline--bottom">请选择您要发布的消息类型</div>
				<van-row class="padding-15-t">
					<van-col span="6" v-for="(item, index) in categorys" :key="'p' + index">
						<div class="cate-item" @click="onPublish(item)">
							<div class="thumb-wrap">
								<img :src="item.thumb" alt="">
							</div>
							<div class="title ellipsis">{{item.title}}</div>
						</div>
					</van-col>
				</van-row>
			</div>
		</div>
		<van-popup v-model="catePopup" position="bottom" class="bg-gray">
			<div class="title-parent padding-15-tb text-center font-14 bg-danger">选择{{categorySelected.title}}子分类</div>
			<ul class="child-list">
				<li class="van-hairline--bottom" v-for="(item, index) in categorySelected.child" :key="'c' + index" @click="onPublish(item)">{{item.title}}</li>
			</ul>
			<div class="title-parent padding-15-tb text-center font-14 margin-10-t bg-default" @click="catePopup = !catePopup">取消</div>
		</van-popup>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
			PublicFooter
		},
		data() {
			return {
				showPreLoading: true,
				catePopup: false,
				categorys: {},
				categorySelected: {},
				black_member: {
					status: false,
				},
				failedTips: {
					type: 'message',
					tips: '',
					btnText: '关闭',
					link: '/gohome/pages/tongcheng/index'
				},
				menufooter: {},
			}
		},
		methods: {
			onLoad(id) {
				var that = this;
				if(id) {
					that.id = id;
				}
				getData({
					vue: that,
					url: 'tongcheng/publish/index',
					data: {
						menufooter: 1
					},
					success: function(res) {
						that.categorys = res.categorys;
						that.menufooter = window.menufooter;
					},
					fail: function(res) {
						if(res.errno == -1000) {
							var black_member = res.message.black_member;
							that.black_member = black_member;
							that.failedTips.tips = black_member.tip;
							return;
						} else {
							that.util.$toast(res.message, '', 1000);
						}
					}
				})
			},
			onPublish(category) {
				if(!category.child) {
					var parentid = category.parentid;
					var childid = category.id;
					if(parentid == 0) {
						parentid = category.id;
						childid = 0;
					}
					this.$router.push(this.util.getUrl({path: '/gohome/pages/tongcheng/publish/post', query:{parentid: parentid, childid: childid}}));
				} else {
					this.categorySelected = category;
					this.catePopup = !this.catePopup;
				}
			}

		},
		mounted(){
			this.onLoad();
		}
	}
</script>

<style>
	#publish-index .tip{
		line-height: 1.4;
		font-size: 14px;
		padding: 13px 10px;
		color: #7a7a7a;
	}
	#publish-index .store-settle{
		padding: 15px 10px;
		background-color: #fff;
	}
	#publish-index .store-settle .icon-store{
		font-size: 32px;
		color: #ff2d4b;
	}
	#publish-index .cate-item{
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		padding-bottom: 15px;
	}
	#publish-index .cate-item .thumb-wrap{
		width: 42px;
		height: 42px;
	}
	#publish-index .cate-item .thumb-wrap img{
		width: 100%;
		height: 100%;
	}
	#publish-index .cate-item .title{
		font-size: 13px;
		margin-top: 7px;
		width: 100%;
		padding: 0 10px;
		text-align: center;
	}
	#publish-index .child-list{
		background-color: #fff;
		font-size: 14px;
		max-height: 352px;
		overflow-y: scroll;
		overflow-x: hidden;
	}
	#publish-index .child-list li{
		padding: 15px;
		text-align: center;
		color: #7a7a7a;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	#publish-index .child-list li:last-child:after{
		display: none;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/tongcheng/publish/index.vue