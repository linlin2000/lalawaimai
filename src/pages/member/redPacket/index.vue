<template>
	<div id="red-packet">
		<public-header title="我的红包"></public-header>
		<div class="content">
			<template v-if="!showLoading">
				<van-list v-model="redpackets.loading" :finished="redpackets.finished" @load="onLoad" v-if="redpackets.data.length > 0" :offset="100" :immediate-check="false">
					<div class="redPacket-list content-padded">
						<div class="redPacket-list-item" :class="{invalid: item.status > 1}" v-for="(item, index) in redpackets.data" :key="item">
							<div class="redPacket-list-item-container">
								<div class="redPacket-info row">
									<div class="col-50">
										<span class="redPacket-title">{{item.title}}</span>
									</div>
									<div class="col-50 text-right">
										<div class="price">￥<span class="price-num">{{item.discount}}</span></div>
									</div>
								</div>
								<div class="redPacket-use-limit">
									<div class="superRedpacket-time">
										<span v-if="item.channel == 'mealRedpacket_plus' || item.channel == 'mealRedpacket'" class="superRedpacket-meal">红包套餐</span>
										<span v-else-if="item.channel == 'svip'" class="superRedpacket-meal">超级会员</span>
										有效期：{{item.starttime}}~{{item.endtime}}
									</div>
									<div class="superRedpacket-condition">
										<p class="use-condition">满{{item.condition}}元</p>
									</div>
								</div>
								<div class="other-limit" v-if=" item.category_cn || item.time_cn">
									{{item.category_cn}} {{item.time_cn}}
								</div>
							</div>
							<span class="border-1px-r circle circle-left"></span>
							<span class="border-1px-l circle circle-right"></span>
							<span class="overdue" v-if="item.status == 3"></span>
							<span class="use" v-if="item.status == 2"></span>
						</div>
					</div>
					<div class="no-more" >
						<span class="no-more-a" v-if="redpackets.finished">没有更多红包了</span>
						<template v-if="redpackets.status == '1'">
							<span v-if="redpackets.finished">|</span >
							<router-link class="no-more-a" :to="util.getUrl({path: '/pages/member/redPacket/index?status=2'})">查看无效券</router-link>
						</template>
					</div>
				</van-list>
				<div class="no-data" v-else>
					<img src= "static/img/coupon_no_con.png" alt="" />
					<p>您没有红包记录</p>
				</div>
				<div style="width:100%; height: 50px;"></div>
			</template>
		</div>
		<transition name="loading">
			<iloading v-show="showLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import PublicFooter from '@/components/footer'
	import PublicHeader from '@/components/header'
	import loading from '@/components/loading'
	export default {
		data() {
			return {
				redpackets: {
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
			PublicFooter,
			loading
		},
		watch: {
			// 对路由变化作出响应...
			'$route' (to, from) {
				this.showLoading = true;
				this.redpackets = {
					loading: false,
					finished: false,
					status: 1,
					data: []
				};
				if(this.$route.query.status) {
					this.redpackets.status = this.$route.query.status;
				}
				this.onLoad();
			}
		},
		methods: {
			onLoad() {
				if(this.redpackets.finished) {
					return false;
				}
				this.util.request({
					url: 'wmall/member/redPacket',
					data: {
						min: this.redpackets.min,
						status: this.redpackets.status
					},
				}).then((res) => {
					let result = res.data.message;
					this.redpackets.data = [...this.redpackets.data, ...result.message];
					this.hideLoading();
					if(this.redpackets.data.length < 6) {
						this.redpackets.finished = true;
					}
					this.redpackets.loading = false;
					this.redpackets.min = result.min;
					if(!result.min) {
						this.redpackets.finished = true;
					}
				})
			},
			hideLoading(){
				this.showLoading = false;
			},
		},
		mounted() {
			if(this.$route.query.status) {
				this.redpackets.status = this.$route.query.status;
			}
			this.onLoad();
		}
	}

</script>

<style scoped>
	#red-packet .loading-enter-active, .loading-leave-active {
		transition: opacity .7s
	}
	.loading-enter, .loading-leave-active {
		opacity: 0
	}
	#red-packet .content-padded{
		margin: 10px;
	}
	#red-packet .row{
		margin-left: -4%;
		overflow: hidden;
	}
	#red-packet .redPacket-list .redPacket-list-item{
		background: #fff;
		margin-bottom: 12px;
		overflow: hidden;
		position: relative;
	}
	#red-packet .redPacket-list .redPacket-list-item.invalid{
		opacity: 0.5;
	}
	#red-packet .redPacket-list .redPacket-list-item .redPacket-list-item-container{
		padding: 16px;
	}
	#red-packet .redPacket-info .col-50{
		width: 46%;
		margin-left: 4%;
		float: left;
	}
	#red-packet .redPacket-info .col-50 .redPacket-title{
		color: #ff2d4b;
		margin: 0;
		font-size: 16px;
	}
	#red-packet .redPacket-info .col-50 .price{
		color: #ff2d4b;
		position: relative;
		margin-top: -4px;
	}
	#red-packet .redPacket-info .col-50 .price .price-num{
		font-size: 20px;
		line-height: 26px;
	}
	#red-packet .redPacket-list-item .redPacket-list-item-container .redPacket-use-limit{
		overflow: hidden;
		margin-top: 8px;
		color: #666;
		font-size: 12px;
		padding-bottom: 12px;
		line-height: 20px;
	}
	#red-packet .redPacket-list-item .redPacket-list-item-container .redPacket-use-limit .superRedpacket-time .superRedpacket-meal{
		height: 18px;
		line-height: 14px;
		padding: 2px 4px;
		background-color: #ff2d4b;
		color: #fff;
		font-size: 12px;
		border-radius: 2px;
		margin-right: 5px;
	}
	#red-packet .redPacket-list-item .redPacket-list-item-container .redPacket-use-limit .superRedpacket-time{
		float: left;
		font-size: 12px;
	}
	#red-packet .redPacket-list-item .redPacket-list-item-container .redPacket-use-limit .superRedpacket-condition{
		float: right;
		font-size: 12px;
	}
	#red-packet .row .col-40 .use-condition{
		margin: 0;
		font-size: 12px;
	}
	#red-packet .redPacket-list-item .redPacket-list-item-container .other-limit{
		font-size: 12px;
		color: #999;
		border-top: 1px dashed #e0e0e0;
		padding-top: 4px;
	}
	#red-packet .redPacket-list-item .circle{
		display: block;
		width: 16px;
		height: 16px;
		background: #eee;
		position: absolute;
		border-radius: 16px;
		top:50%;
		margin-top: -8px;
		z-index: 20;
	}
	#red-packet .redPacket-list-item .circle-left{
		left: -8px;
	}
	#red-packet .redPacket-list-item .circle-right{
		right: -8px;
	}
	#red-packet .redPacket-list-item .overdue{
		display: block;
		position: absolute;
		width: 70px;
		height: 70px;
		top: 10px;
		right: 10px;
		background: url(../../../../static/img/ws.png);
		background-size: 100%;
		z-index: 100;
	}
	#red-packet .redPacket-list-item .use{
		display: block;
		position: absolute;
		width: 70px;
		height: 70px;
		top: 10px;
		right: 10px;
		background: url(../../../../static/img/wu.png);
		background-size: 100%;
		z-index: 100;
	}
	#red-packet .no-more{
		text-align: center;
		color: #999;
		margin-bottom: 20px;
		font-size: 12px;
	}
	#red-packet .no-more .no-more-a{
		color: #999;
	}
</style>



// WEBPACK FOOTER //
// src/pages/member/redPacket/index.vue