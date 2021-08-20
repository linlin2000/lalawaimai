<template>
	<div id="home-allcategory">
		<public-header title="全部分类" ></public-header>
		<div class="content">
			<van-row>
				<van-col span="5" :style="{height: vanColHeight +'px'}">
					<div class="tab-list" ref="leftCategoryWrapper" :style="{height: vanColHeight +'px'}">
						<div>
							<div class="tab-item" :class="{active: tabActive == index}" ref="leftCategoryItem" v-for="(item, index) in allcategory" :key="index" @click="selectCategory(index, $event)">
								<div class="category-name">{{item.title}}</div>
								<span class="category-num">{{item.store_num}}</span>
							</div>
						</div>
					</div>
				</van-col>
				<van-col span="19" :style="{height: vanColHeight +'px'}">
					<div ref="rightCategoryWrapper" :style="{height: vanColHeight +'px'}">
						<div>
							<div class="category-item" v-for="(item, index) in allcategory" :key="index" ref="childCategoryItem">
								<div class="goods-title flex-lr">
									<div class="font-15">{{item.title}}</div>
									<div class="font-13 c-gray" @click="onGoCategory(item.id)">去频道 <span class="icon icon-right"></span></div>
								</div>
								<div class="goods-group">
									<van-row v-if="item.child">
										<van-col span="8" v-for="(childItem, childIndex) in item.child" :key="childIndex">
											<div class="goods-item" @click="onGoCategory(item.id, childItem.id)">
												<img :src="childItem.thumb" alt="">
												<div class="font-14 padding-5-t">{{childItem.title}}</div>
												<span class="goods-num">{{childItem.store_num}}</span>
											</div>
										</van-col>
									</van-row>
									<van-row v-else>
										<van-col span="8">
											<div class="goods-item" @click="onGoCategory(item.id)">
												<img :src="item.thumb" alt="">
												<div class="font-14 padding-5-t">{{item.title}}</div>
												<span class="goods-num">{{item.store_num}}</span>
											</div>
										</van-col>
									</van-row>
								</div>
							</div>
						</div>
					</div>
				</van-col>
			</van-row>
		</div>
		<iloading v-if="showPreLoading"></iloading>
		<failed-tips v-if="!getLocationStatus" :failedTips="failedTips"></failed-tips>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import BScroll from 'better-scroll'
	export default {
		data() {
			return {
				showPreLoading: true,
				allcategory: [],
				scrollY: 0,
				listHeight: [],
				tabActive: 0,
				vanColHeight: 0,
				getLocationStatus: true,
				failedTips: {
					type: 'location',
					tips: '获取定位失败!您可以选择手动搜索地址',
					btnText: '手动搜索地址',
					link: '/pages/home/location'
				}
			}
		},
		components: {
			PublicHeader
		},
		methods: {
			onLoad() {
				var that = this;
				that.util.request({
					url: 'wmall/home/search/allcategory',
					data: {forceLocation: 1},
				}).then((res) => {
					that.showPreLoading = false;
					var result = res.data.message;
					if(result.errno) {
						that.util.toast(result.message, '', 1000);
						return;
					}
					that.allcategory = result.message.allcategory;
					that.$nextTick(() => {
						that._initScroll();
						that._calculateHeight();
					})
				}).catch((res) => {
					if(window.forceGetLocationStatus == 'fail') {
						this.showPreLoading = false;
						this.getLocationStatus = false;
					}
				})
			},
			onGoCategory(parentid, childid) {
				this.$router.push(this.util.getUrl({path: 'pages/home/category', query: {cid: parentid, child_id: childid}}));
			},
			selectCategory(index, event) {
				if (!event._constructed) {
					return;
				}
				let childCategoryItem = this.$refs.childCategoryItem;
				let el = childCategoryItem[index];
				this.rigthScroll.scrollToElement(el, 500);
			},
			_initScroll() {
				this.leftScroll = new BScroll(this.$refs.leftCategoryWrapper, {
					click: true
				});
				this.rigthScroll = new BScroll(this.$refs.rightCategoryWrapper, {
					click: true,
					probeType: 3
				});
				this.rigthScroll.on('scroll', (pos) => {
					// 判断滑动方向，避免下拉时分类高亮错误（如第一分类商品数量为1时，下拉使得第二分类高亮）
					if (pos.y <= 0) {
						this.scrollY = Math.abs(Math.round(pos.y));
					}
					var length = this.listHeight.length;
					for (var i = 0; i < length; i++) {
						var height1 = this.listHeight[i];
						var height2 = this.listHeight[i + 1];
						if (height2 && this.scrollY >= height1 && this.scrollY < height2) {
							if(i != this.tabActive) {
								this.tabActive = i;
								this._followScroll(i);
							}
						}
					}
				});
			},
			_calculateHeight() {
				let childCategoryItem = this.$refs.childCategoryItem;
				let height = 0;
				this.listHeight.push(0);
				for (let i = 0; i < childCategoryItem.length; i++) {
					let item = childCategoryItem[i];
					height += item.clientHeight;
					this.listHeight.push(height);
				}
			},
			_followScroll(index) {
				let leftCategoryItem = this.$refs.leftCategoryItem;
				let el = leftCategoryItem[index];
				this.leftScroll.scrollToElement(el, 300, 0, -100);
			},
		},
		mounted () {
			this.onLoad();
			this.$nextTick(() => {
				let bodyHeight = document.documentElement.clientHeight;
				console.log(bodyHeight);
				this.vanColHeight = bodyHeight;
				if(document.getElementById('public-header')) {
					let publicHeader = document.getElementById('public-header').clientHeight;
					this.vanColHeight = this.vanColHeight - publicHeader;
				}
			})
		}
	}
</script>

<style>
	#home-allcategory .van-col{
		overflow-y: auto;
	}
	#home-allcategory .tab-list{
		width: 100%;
		text-align: center;
		background: #fff;
	}
	#home-allcategory .tab-list .tab-item{
		padding: 15px 0;
	}
	#home-allcategory .tab-list .tab-item .category-name{
		font-size: 15px;
	}
	#home-allcategory .tab-list .tab-item .category-num{
		display: inline-block;
		color: #999;
		font-size: 12px;
		padding: 2px 8px;
		border-radius: 16px;
		background-color: #f5f5f5;
		margin-top: 10px;
	}
	#home-allcategory .tab-list .tab-item.active{
		background-color: #f5f5f5;
		color: #ff2d4b;
	}
	#home-allcategory .tab-list .tab-item.active .category-num{
		background-color: #fff;
		color: #ff2d4b;
	}
	#home-allcategory .category-item{
		padding: 0 10px;
	}
	#home-allcategory .category-item .goods-title{
		flex: 1;
		padding: 15px 0;
	}
	#home-allcategory .category-item .goods-group{
		padding: 30px 15px 0px;
		background-color: #fff;
		border-radius: 5px;
	}
	#home-allcategory .category-item .goods-group .goods-item{
		text-align: center;
	}
	#home-allcategory .category-item .goods-group .goods-item img{
		width: 45px;
		height: 45px;
		border: none;
	}
	#home-allcategory .category-item .goods-group .goods-item .goods-num{
		display: inline-block;
		color: #999;
		font-size: 12px;
		padding: 2px 8px;
		margin: 5px 0px 10px;
		border-radius: 16px;
		background-color: #f5f5f5;
	}
</style>


// WEBPACK FOOTER //
// src/pages/home/allcategory.vue