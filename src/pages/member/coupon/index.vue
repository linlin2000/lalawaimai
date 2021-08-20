<template>
	<div id="index-copy">
		<public-header title="我的代金券"></public-header>
		<div class="content" v-if="!showLoading">
			<div class="coupon-list">
				<van-list v-model="coupons.loading"  :finished="coupons.finished" @load="onLoad" v-if="coupons.data.length > 0" :offset="100" :immediate-check="false">
					<div class="coupon-item" v-for="(item,index) in coupons.data" :key="item.id" :class="{active: item.status == 2 || item.status == 3}">
						<div class="coupon-item-top">
							<div class="coupon-item-left">
								<span class="overdue" v-if="item.status == 3"></span>
								<span class="use" v-if="item.status == 2"></span>
								<div class="seller-img">
									<img :src="item.logo" alt="">
								</div>
								<div class="seller">
									<p class="seller-name">{{item.title}}</p>
									<div class="seller-type">同享券</div>
									<div class="coupon-expires">有效期至:{{item.endtime}}</div>
								</div>
							</div>
							<div class="coupon-item-right">
								<p class="coupon-money">
									<span class="money-unit">￥</span>
									{{item.discount}}
								</p>
								<p class="coupon-condition">满{{item.condition}}可用</p>
							</div>
						</div>
						<div class="coupon-item-line">
							<div class="line"></div>
						</div>
						<div class="coupon-item-bottom">
							<div class="explain-text">仅限门店{{item.title}}使用</div>
							<router-link :to="util.getUrl({path: '/pages/store/goods', query: {sid: item.id}})" class="to-use" teg="div">
								去使用
								<van-icon name='right'></van-icon>
							</router-link>
						</div>
					</div>
					<div class="j-coupon-tip" v-if="coupons.finished">
						没有更多代金券了&nbsp;&nbsp;
						<template v-if="coupons.status == '1'">
							|&nbsp;&nbsp;<router-link :to="util.getUrl({path: '/pages/member/coupon/index?status=2'})">查看过期券 &gt;&gt;</router-link>
						</template>
					</div>
				</van-list>
				<div class="no-data" v-else>
					<img src= "static/img/coupon_no_con.png" alt="" />
					<p>您没有代金券</p>
				</div>
			</div>
			<div class="give-member" v-if="0">
				<router-link :to="util.getUrl({path: '/pages/member/coupon/give'})" class="button">
					<span>赠送好友代金券</span>
				</router-link>
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

<style>
	#index-copy .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#index-copy .content::-webkit-scrollbar {
		display: none;
	}
	#index-copy .content .coupon-list{
		display: block;
	}
	#index-copy .content .coupon-list .coupon-item{
		display: block;
		position: relative;
		margin: 10px;
		background-color: #fff;
	}
	#index-copy .content .coupon-list .coupon-item.active{
		opacity: 0.6;
	}
	#index-copy .content .coupon-list .coupon-item .coupon-item-top{
		display: -webkit-box;
		padding: 15px 15px;
		position: relative;
		overflow: hidden;
	}
	#index-copy .content .coupon-list .coupon-item .coupon-item-top .coupon-item-left{
		position: relative;
		float: left;
		-webkit-box-flex: 1;
		-moz-box-flex: 1;
		width: 70%;
	}
	#index-copy .content .coupon-list .coupon-item .coupon-item-top .coupon-item-left .seller-img{
		float: left;
		width: 55px;
		height: 55px;
		border: 1px solid #E4E4E4;
	}
	#index-copy .content .coupon-list .coupon-item .coupon-item-top .coupon-item-left .seller-img img{
		width: 100%;
		height: 100%;
		border: none;
	}
	#index-copy .content .coupon-list .coupon-item .coupon-item-top .coupon-item-left .seller{
		display: block;
		float: left;
		width: 65%;
		margin-left: 10px;
	}
	#index-copy .content .coupon-list .coupon-item .coupon-item-top .coupon-item-left .seller .seller-name{
		line-height: 16px;
		font-size: 16px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		color: #2f2f2f;
		padding-bottom: 3px;
	}
	#index-copy .content .coupon-list .coupon-item .coupon-item-top .coupon-item-left .seller .seller-type{
		width: 46px;
		height: 21px;
		background: #fff;
		padding: 4px;
		font-size: 12px;
		color: #FFA511;
		border: 1px solid #FFA511;
	}
	#index-copy .content .coupon-list .coupon-item .coupon-item-top .coupon-item-left .seller .coupon-expires{
		font-size: 11px;
		color: #666;
		line-height: 12px;
		padding-top: 3px;
	}
	#index-copy .content .coupon-list .coupon-item .coupon-item-top .coupon-item-left .overdue{
		display: block;
		position: absolute;
		width: 70px;
		height: 70px;
		top: -5px;
		right: -10px;
		z-index: 100;
		background: url(../../../../static/img/ws.png);
		background-size: 100%;
	}
	#index-copy .content .coupon-list .coupon-item .coupon-item-top .coupon-item-left .use{
		display: block;
		position: absolute;
		width: 70px;
		height: 70px;
		top: -5px;
		right: -10px;
		z-index: 100;
		background: url(../../../../static/img/wu.png);
		background-size: 100%;
	}
	#index-copy .content .coupon-list .coupon-item .coupon-item-top .coupon-item-right{
		text-align: right;
		width: 30%;
	}
	#index-copy .content .coupon-list .coupon-item .coupon-item-top .coupon-item-right .coupon-money{
		font-size: 30px;
		color: #FB4E44;
		line-height: 35px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#index-copy .content .coupon-list .coupon-item .coupon-item-top .coupon-item-right .coupon-money .money-unit{
		font-size: 24px;
		margin-right: -10px;
	}
	#index-copy .content .coupon-list .coupon-item .coupon-item-top .coupon-item-right .coupon-condition{
		color: #666;
		font-size: 12px;
		line-height: 16px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#index-copy .content .coupon-list .coupon-item-line{
		position: relative;
	}
	#index-copy .content .coupon-list .coupon-item-line .line{
		border-top: 1px dashed #E6E6E6;
	}
	#index-copy .content .coupon-list .coupon-item-line .line:before{
		content: '';
		position: absolute;
		top: -5px;
		left: -2px;
		z-index: 20;
		width: 5px;
		height: 10px;
		border-radius: 0 5px 5px 0;
		border: 1px solid #f6f6f6;
		background: #f6f6f6;
	}
	#index-copy .content .coupon-list .coupon-item-line .line:after{
		content: '';
		position: absolute;
		top: -5px;
		right: -1px;
		z-index: 20;
		width: 5px;
		height: 10px;
		border-radius: 5px 0 0 5px;
		border: 1px solid #f6f6f6;
		background: #f6f6f6;
	}
	#index-copy .content .coupon-list .coupon-item-bottom{
		padding: 5px 15px;
		position: relative;
		overflow: hidden;
	}
	#index-copy .content .coupon-list .coupon-item-bottom .explain-text{
		width: 80%;
		float: left;
		line-height: 18px;
		color: #B3B3B3;
		font-size: 12px;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#index-copy .content .coupon-list .coupon-item-bottom .to-use{
		width: 20%;
		float: right;
		line-height: 18px;
		color: #FF2D4B;
		font-size: 12px;
		text-align: right;
	}
	#index-copy .content .coupon-list .j-coupon-tip{
		margin: 20px 0;
		text-align: center;
		color: #666;
		line-height: 18px;
		font-size: 12px;
	}
	#index-copy .content .coupon-list .j-coupon-tip a{
		color: #666;
		line-height: 18px;
		font-size: 12px;
	}
	#index-copy .content .give-member{
		display: flex;
		align-items: center;
		justify-content: center;
		position: fixed;
		bottom: 15px;
		left: 5%;
		width: 90%;
		height: 50px;
		background: red;
		border-radius: 30px;
	}
	#index-copy .content .give-member .button{
		margin: 10px;
		width: 95%;
		height: 69.25%;
		background-size: cover;
		color: #cab96e;
		font-weight: 200;
		font-size: 18px;
		text-align: center;
	}
	#index-copy .content .give-member .button span{
		font-weight: 200;
		line-height: 35px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/member/coupon/index.vue