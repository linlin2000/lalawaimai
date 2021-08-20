<template>
	<div id="spread-down">
		<public-header title="我的团队"></public-header>
		<public-footer :preLoading="showPreLoading" :menufooter="menufooter"></public-footer>
		<div class="content">
			<van-tabs v-model="active" swipeable @click='onChangeStatus'>
				<van-tab v-for="(index, key) in 2" :title="title[index]" :key="key">
					<van-list v-model="down.loading" :finished="down.loaded" v-if="!down.empty" @load="onLoad" :offset="100" :immediate-check="false">
						<div class="member-list" >
							<div class="item van-hairline--bottom" v-for="(item, downIndex) in down.data" :key="downIndex">
								<div class="left">
									<div class="user-avatar">
										<img :src="item.avatar" alt="">
									</div>
									<div class="user-info">
										<div class="user-name">{{item.nickname}}</div>
										<div class="time">注册时间：{{item.addtime}}</div>
									</div>
								</div>
								<div class="right van-hairline--left">
									<div class="price">消费：{{item.price}}元</div>
									<div class="orders">{{item.frquency}}个订单</div>
								</div>
							</div>
						</div>
					</van-list>
					<div class="no-data" v-else>
						<div class="bg"></div>
						<p>暂时没有下线哦～</p>
					</div>
				</van-tab>
			</van-tabs>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	export default {
		components: {
			PublicHeader,
			PublicFooter,
		},
		data() {
			return {
				spreadid: 'spread1',
				refresh: 0,
				active: 0,
				now_active: 0,
				level1: 0,
				level2: 0,
				down: {
					min: 0,
					loaded: false,
					loading: false,
					empty: false,
					data:[]
				},
				showPreLoading: true,
				menufooter: {}

			}
		},
		computed: {
			title: function() {
				return this.title = {
					1:'一级（' + this.level1 + '）',
					2:'二级（' + this.level2 + '）',
				};
			}
		},
		methods: {
			onLoad() {
				if(this.refresh == 1) {
					this.down = {
						min: 0,
						loaded: false,
						loading: false,
						empty: false,
						data:[]
					};
				}
				if(this.down.loaded) {
					return false;
				}
				this.down.loading = true;
				this.util.request({
					url: 'spread/down/index',
					data: {
						menufooter: 1,
						min: this.down.min,
						spreadid : this.spreadid
					}
				}).then((res) => {
					let result = res.data.message;
					this.level1 = result.message.level1;
					this.level2 = result.message.level2;
					this.down.data = [...this.down.data, ...result.message.members];
					if(!this.down.data.length) {
						this.down.empty = true;
					}
					this.down.loading = false;
					this.down.min = result.min;
					if(!result.min) {
						this.down.loaded = true;
					}
					this.now_active = this.active;
					this.refresh = 0;
					this.showPreLoading = false;
					this.menufooter = window.menufooter;
				})
			},
			onChangeStatus(index, title) {
				if(this.now_active != index) {
					this.refresh = 1;
				}
				if(index == 0) {
					this.spreadid = 'spread1';
				} else if(index == 1) {
					this.spreadid = 'spread2';
				}
				this.onLoad();
			},

		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#spread-down .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
		overflow-y: scroll;
	}
	#spread-down .content::-webkit-scrollbar {
		display: none;
	}
	#spread-down .content .van-tabs__content .member-list{
		padding: 6px 0;
	}
	#spread-down .content .van-tabs__content .member-list .item{
		padding: 8px 0;
		background-color: #fff;
		overflow: hidden;
	}
	#spread-down .content .van-tabs__content .member-list .item .left{
		float: left;
		width: 70%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		height: 50px;
	}
	#spread-down .content .van-tabs__content .member-list .item .left .user-avatar{
		width: 50px;
		height: 50px;
		display: inline-block;
		margin-left: 8px;
		float: left;
	}
	#spread-down .content .van-tabs__content .member-list .item .left .user-avatar img{
		display: inline-block;
		width: 100%;
		height: 100%;
		border-radius: 6px;
		border: none;
	}
	#spread-down .content .van-tabs__content .member-list .item .left .user-info{
		float: left;
		margin-left: 6px;
	}
	#spread-down .content .van-tabs__content .member-list .item .left .user-info .user-name{
		color: #333;
		font-size: 15px;
		padding-top: 4px;
		display: inline-block;
		line-height: 22px;
	}
	#spread-down .content .van-tabs__content .member-list .item .left .user-info .time{
		font-size: 13px;
		color: #9A999A;
		line-height: 19px;
	}
	#spread-down .content .van-tabs__content .member-list .item .right{
		float: left;
		width: 28%;
		text-align: right;
		font-size: 13px;
		color: #9A999A;
		height: 50px;
		padding-right: 6px;
	}
	#spread-down .content .van-tabs__content .member-list .item .right .price{
		padding-top: 6px;
		width: 100%;
		display: inline-block;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 19px;
	}
	#spread-down .content .van-tabs__content .member-list .item .right .orders{
		display: inline-block;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		line-height: 19px;
	}
	#spread-down .content .van-tabs__content .no-data{
		padding-top: 30%;
		text-align: center;
	}
	#spread-down .content .van-tabs__content .no-data .bg{
		display: inline-block;
		width: 160px;
		height: 160px;
		background: url(../../../static/img/no_order.png) no-repeat 0 0;
		background-size: cover;
	}
	#spread-down .content .van-tabs__content .no-data p{
		margin: 0;
		color: #999;
		font-size: 18px;
		line-height: 27px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/spread/down.vue