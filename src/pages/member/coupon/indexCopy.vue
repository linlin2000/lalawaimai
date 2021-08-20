<template>
	<div id="coupon">
		<public-header title="我的代金券"></public-header>
		<div class="content">
			<template v-if="!showLoading">
				<div class="coupon-list">
					<van-list v-model="coupons.loading"  :finished="coupons.finished" @load="onLoad" v-if="coupons.data.length > 0" :offset="100" :immediate-check="false">
						<div class="content-padded" v-for="(item, index) in coupons.data" :key="item">
							<div class="coupon-item">
								<router-link to="">
									<div class="clearfix">
										<span class="circle circle-left"></span>
										<span class="circle circle-right"></span>
										<span class="overdue" v-if="item.status == 3"></span>
										<span class="use" v-if="item.status == 2"></span>
										<div class="left">
											<div class="store-logo">
												<img :src="item.logo" alt="">
											</div>
											<div class="coupon-detail">
												<div class="coupon-title">{{item.title}}</div>
												<div class="use-time">有效期至:{{item.endtime}}</div>
											</div>
										</div>
										<div class="right">
											<div class="price">
												<span>￥</span>{{item.discount}}
											</div>
											<div class="condition">满{{item.condition}}元可用</div>
										</div>
									</div>
								</router-link>
							</div>
						</div>
						<div class="no-more" v-if="coupons.finished">
							<span class="no-more-a" to="">没有更多了</span>
							<template v-if="coupons.status == '1'">
								<span v-if="coupons.finished">|</span>
								<router-link class="no-more-a" :to="util.getUrl({path: '/pages/member/coupon/index?status=2'})">查看无效券</router-link>
							</template>
						</div>
					</van-list>
					<div class="common-no-con" v-else>
						<img src= "static/img/coupon_no_con.png" alt="" />
						<p>您没有代金券</p>
						<div class="btn">
							<router-link class="btn-a" :to="util.getUrl({path: '/pages/channel/coupon'})">去领券中心看看</router-link>
						</div>
					</div>
				</div>
			</template>
			<div class="coupon-more">
				<router-link class="coupon-more-a" :to="util.getUrl({path: '/pages/channel/coupon'})">更多好券,去领券中心看看</router-link>
			</div>
		</div>
		<transition name="loading">
			<iloading v-show="showLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import loading from '@/components/loading'
	export default {
		data() {
			return {
				coupons: {
					loading: false,
					finished: false,
					status: 1,
					data: []
				},
				showLoading: true
			}
		},
		components: {
			PublicHeader,
			loading
		},
		watch: {
			// 对路由变化作出响应...
			'$route' (to, from) {
				this.showLoading = true;
				this.coupons = {
					loading: false,
					finished: false,
					status: 1,
					data: []
				};
				if(this.$route.query.status) {
					this.coupons.status = this.$route.query.status;
				}
				this.onLoad();
			}
		},
		methods: {
			onLoad() {
				if(this.coupons.finished) {
					return false;
				}
				this.util.request({
					url: 'wmall/member/coupon',
					data: {
						min: this.coupons.min,
						status: this.coupons.status
					},
				}).then((res) => {
					let result = res.data.message;
					this.coupons.data = [...this.coupons.data, ...result.message];
					this.hideLoading();
					if(result.message.length < 6) {
						this.coupons.finished = true;
					}
					this.coupons.loading = false;
					this.coupons.min = result.min;
					if(!result.min) {
						this.coupons.finished = true;
					}
				})
			},
			hideLoading(){
				this.showLoading = false;
			},
		},
		mounted() {
			if(this.$route.query.status) {
				this.coupons.status = this.$route.query.status;
			}
			this.onLoad();
		}
	}
</script>

<style scoped>
	.loading-enter-active, .loading-leave-active {
		transition: opacity .7s
	}
	.loading-enter, .loading-leave-active {
		opacity: 0
	}
	#coupon{
		background: #f5f5f5;
		height: 100%;
	}
	#coupon .coupon-list .content-padded{
		margin: 10px;
	}
	#coupon .coupon-list .content-padded .coupon-item{
		background: #fff;
		overflow: hidden;
		padding: 16px;
		position: relative;
	}
	#coupon .coupon-item .clearfix{
		overflow: hidden;
	}
	#coupon .coupon-item .clearfix .circle{
		display: block;
		width: 16px;
		height: 16px;
		background: #f5f5f5;
		position: absolute;
		border-radius: 16px;
		top: 50%;
		margin-top: -8px;
		z-index: 20;
	}
	#coupon .coupon-item .clearfix .circle-left{
		left: -8px;
	}
	#coupon .coupon-item .clearfix .circle-right{
		right: -8px;
	}
	#coupon .coupon-item .clearfix .overdue{
		display: block;
		position: absolute;
		width: 70px;
		height: 70px;
		top: 10px;
		right: 10px;
		z-index: 100;
		background: url(../../../../static/img/ws.png);
		background-size: 100%;
	}
	#coupon .coupon-item .clearfix .use{
		display: block;
		position: absolute;
		width: 70px;
		height: 70px;
		top: 10px;
		right: 10px;
		z-index: 100;
		background: url(../../../../static/img/wu.png);
		background-size: 100%;
	}
	#coupon .coupon-item .left{
		width: 70%;
		float: left;
	}
	#coupon .coupon-item .left .store-logo{
		display: inline-block;
		float: left;
		width: 32%;
	}
	#coupon .coupon-item .left .store-logo img{
		display: inline-block;
		width: 56px;
		height: 56px;
		margin-top: 4px;
	}
	#coupon .coupon-item .left .coupon-detail{
		display: inline-block;
		float: left;
		width: 60%;
	}
	#coupon .coupon-item .left .coupon-detail .coupon-title{
		font-weight: bold;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #ff2d4b;
		margin-top: 3px;
	}
	#coupon .coupon-item .left .coupon-detail .use-time{
		font-size: 12px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		color: #808080;
		margin-top: 16px;
	}
	#coupon .coupon-item .right{
		width: 29%;
		border-left: 1px dashed #ccc;
		text-align: center;
		float: right;
	}
	#coupon .coupon-item .right .price{
		color: #ff2d4b;
		font-size: 24px;
	}
	#coupon .coupon-item .right .price span{
		font-size: 14px;
		margin-right: 2px;
	}
	#coupon .coupon-item .right .condition{
		margin-top: 8px;
		font-size: 12px;
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		white-space: normal !important;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		padding: 2px;
		color: #808080;
	}
	#coupon .coupon-list .no-more{
		text-align: center;
		color: #999;
		margin-bottom: 20px;
		font-size: 12px;
	}
	#coupon .no-more .no-more-a{
		color: #999;
	}
	#coupon .coupon-more{
		margin: 10px 15px;
		border-radius: 5px;
		font-size: 15px;
		height: 40px;
		line-height: 40px;
		background: #fff;
		text-align: center;
	}
	#coupon .coupon-more .coupon-more-a{
		color: #ff2d4b;
	}
	#coupon .common-no-con{
		margin-top: 50%;
		width: 100%;
		height: 200px;
		text-align: center;
		color: #768491;
		font-size: 16px;
	}
	#coupon .common-no-con p{
		margin: 10px 0;
	}
	#coupon .common-no-con img{
		max-width: 25%;
		vertical-align: middle;
	}
	#coupon .common-no-con .btn .btn-a{
		display: inline-block;
		height: 40px;
		line-height: 40px;
		color: #fff;
		background: #ff2d4b;
		padding: 0 20px;
		border-radius: 40px;
	}
</style>



// WEBPACK FOOTER //
// src/pages/member/coupon/indexCopy.vue