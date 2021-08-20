<template>
	<div id="get-coupon">
		<public-header title="领券中心"></public-header>
		<div class="content">

			<van-list v-model="coupons.loading"  :finished="coupons.finished" @load="onLoad" v-if="coupons.data.length > 0" :offset="100" :immediate-check="false">
			<div class="coupon-list">
				<template v-for="(item, index) in coupons.data" >
				<div class="coupon-item" >
					<div class="coupon-left">
						<div class="triangle-border-left">
							<div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
						</div>
						<div class="img-div-backg">
							<div class="img-div">
								<img :src="item.logo" alt="">
							</div>
						</div>
						<div class="pro-content">
							<div class="pro-info">{{item.store_title}}</div>
							<div class="pro-price">
								<div class="coupon-discount">{{item.discount}}元</div>
								<div class="coupon-title">{{item.title}}</div>
							</div>
							<div class="pro-condition">{{item.couponInfo}}</div>
						</div>
					</div>
					<div class="coupon-right">
						<div class="triangle-border-right">
							<div class="circular0"></div>
							<div class="circular1"></div>
							<div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div><div class="i"></div>
						</div>
						<div class="change-block">
							<div class="diy-circle" v-if="!item.get">
								<div class="circle" style="{'background-color': item.percent > 50 ? '#E3BC03' : '#fff'}">
									<!--左半边圆-->
									<div class="circle_left" :style="{transform: item.percent > 50 ? 'rotate(' + item.percent/100*360-360 + 'deg)' : 'rotate(' + 0 + 'deg)','background-color': item.percent > 50 ? '#fff' : '#E3BC03','z-index': 5}">
										<div class="clip_left">
										</div>
									</div>
									<!--右半边圆-->
									<div class="circle_right" :style="{transform: item.percent <= 50 ? 'rotate(' + item.percent/100*360 + 'deg)' : 'rotate(' + 0 + 'deg)', 'background-color': item.percent > 50 ? '#fff' : '#E3BC03', 'z-index': 10}">
										<div class="clip_right"></div>
									</div>
									<div class="mask">
										已抢
										<span>{{item.percent}}</span>%
									</div>
								</div>
							</div>
							<div class="coupon-btn" v-if="!item.get" @click="onGetCoupon(item.sid, index)">
								立即领取
							</div>
							<div class="had" v-if="item.get">
								<img src="http://cos.lalawaimai.com/we7_wmall/wxapp/gone.png">
							</div>
							<router-link class="coupon-btn coupon-btn-yellow" v-if="item.get" :to="util.getUrl({path: '/pages/store/goods', query:{sid: item.sid}})">
								去使用
							</router-link>
						</div>
					</div>
				</div>
				</template>
				</div>
			</van-list>
			<div class="no-data" v-else>
				<img src="static/img/coupon_no_con.png" alt="" />
				<p>没有可以领取的代金券</p>
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
					data: []
				},
				showLoading: true
			}
		},
		components: {
			PublicHeader,
			loading
		},
		methods: {
			onLoad() {
				if(this.coupons.finished) {
					return false;
				}
				this.coupons.loading = true;
				this.showLoading = true;
				this.util.request({
					url: 'wmall/channel/coupon/list',
					data: {
						min: this.coupons.min,
					},
				}).then((res) => {
					let result = res.data.message;
					this.coupons.data = [...this.coupons.data, ...result.message];
					this.hideLoading();
					if(result.message.length < 15) {
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
            onGetCoupon(sid, index) {
            	this.util.request({
					url: 'wmall/channel/coupon/get',
					data: {
						sid: sid
					},
				}).then((res) => {
					let result = res.data.message;
					if(!result.errno) {
						this.coupons.data[index].get = true;
					}
					this.$toast(result.message);
				})

            }
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style scoped>
	#get-coupon{
		background: #f5f5f5;
	}
	.content{
		padding: 10px;
	}
	.coupon-list .coupon-item{
		width: 100%;
		margin-bottom: 10px;
		height: 100px;
		display: flex;
		justify-content: space-between;
		flex-flow: row nowrap;
	}
	.coupon-list .coupon-item .coupon-left{
		width: 100%;
		display:-webkit-box;
		background-color:#fff;
		position:relative;
		padding-right:10px;
		padding-left:13px;
	}
	.coupon-list .coupon-item .coupon-left .triangle-border-left{
		height:100%;
		width:6px;
		position:absolute;
		left:-5px;
		z-index:1;
	}
	.coupon-list .coupon-item .coupon-left .triangle-border-left div{
		display:block;
		border:2px solid transparent;
		border-right:3px solid #fff;
		border-left:3px solid transparent;
		width:0px;
		height:1px;
	}
	.coupon-list .coupon-item .coupon-left .img-div-backg{
		width: 75px;
		height: 75px;
		margin-top: 13px;
		background-size: 75px 75px;
	}
	.coupon-list .coupon-item .coupon-left .img-div-backg .img-div{
		width:71px;
		height:71px;
		font-size:0px;
		margin-top:2px;
		margin-left:2px;
		text-align:center;
	}
	.coupon-list .coupon-item .coupon-left .img-div-backg .img-div img{
		width: 100%;
		height: 100%;
	}
	.coupon-list .coupon-item .coupon-left .pro-content{
		margin-top: 15px;
		height: 75px;
		margin-left: 10px;
		-webkit-box-flex:1;
	}
	.coupon-list .coupon-item .coupon-left .pro-content .pro-info{
		overflow: hidden;
		text-overflow: ellipsis;
		display:-webkit-box;
		-webkit-line-clamp:2;
		line-clamp:2;
		box-orient:vertical;
		-webkit-box-orient:vertical;
		word-break:break-all;
		font-size: 13px;
		color: #232326;
		height: 28px;
		line-height: 14px;
	}
	.coupon-list .coupon-item .coupon-left .pro-content .pro-price{
		height: 24px;
		overflow: hidden;
		width: 100%;
		position: relative;
		display: -webkit-box;
	}
	.coupon-list .coupon-item .coupon-left .pro-content .pro-price .coupon-discount{
		display: inline-block;
		font-size: 16px;
		height: 20px;
		line-height: 16px;
		font-weight: bold;
		position: relative;
		color: #f95049;

	}
	.coupon-list .coupon-item .coupon-left .pro-content .pro-price .coupon-title{
		color: #232326;
		display: inline-block;
		-webkit-box-flex: 1;
		margin-top: 10px;
		font-size: 12px;
		height: 12px;
		line-height: 12px;
		margin-left: 5px;
		text-align: left;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.coupon-list .coupon-item .coupon-left .pro-content .pro-condition{
		font-size: 13px;
		color: #abacab;
		margin-top: 3px;
		width: 100%;
		overflow: hidden;
		text-overflow:ellipsis;
		white-space:nowrap;
	}
	.coupon-list .coupon-item .coupon-right{
		width:75px;
		height:100%;
		background-color:#FFD300;
		margin-left:4px;
		position:relative;
		border-radius:0px 5px 5px 0px;
	}
	.coupon-list .coupon-item .coupon-right .triangle-border-right{
		height: 100%;
		width: 6px;
		position: absolute;
		left: -5px;
		z-index: 1;
	}
	.coupon-list .coupon-item .coupon-right .triangle-border-right .circular0{
		position:absolute;
		height:12px;
		width:12px;
		border-radius:6px 6px 6px 6px;
		background-color:#f3f5f7;
		left:-3px;
		top:-6px;
		z-index:2;
	}
	.coupon-list .coupon-item .coupon-right .triangle-border-right .circular1{
		position:absolute;
		height:12px;
		width:12px;
		border-radius:6px 6px 6px 6px;
		background-color:#f3f5f7;
		left:-3px;
		bottom:-6px;
		z-index:2;
	}
	.coupon-list .coupon-item .coupon-right .triangle-border-right .i{
		display:block;
		border:2px solid transparent;
		border-right:3px solid #FFD300;
		border-left:3px solid #fff;
		width:0px;
		height:1px;
	}
	.coupon-list .coupon-item .coupon-right .change-block{
		width:75px;
		height:100%;
		margin:0px;
		padding:0px;
		box-sizing:border-box;
		-webkit-box-sizing:border-box;
	}
	.coupon-list .coupon-item .coupon-right .change-block .had{
		width:60px;
		height:44px;
		display:block;
		margin-top:0px;
		margin-left:6px;
	}
	.coupon-list .coupon-item .coupon-right .change-block .had img{
		width: 100%;
		height: 100%;
	}
	/*优惠券百分比*/
	.diy-circle{
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 30px;
	}
	.diy-circle .circle {
		width: 50px;
		height: 50px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin: -25px 0 0 -25px;
		border-radius: 50%;
		background: #fff;
	}
	.diy-circle .clip_left,.diy-circle .clip_right{
		width:50px;
		height:50px;
		position: absolute;
		top: 0px;left: 0px;
	}
	.diy-circle .circle_left,.diy-circle .circle_right{
		width:50px;
		height:50px;
		position: absolute;
		border-radius: 50%;
		top: 0px;left: 0px;
		background: #E3BC03;
	}
	.diy-circle .circle_left,.diy-circle .clip_left{
		clip:rect(0,25px,auto,0);
	}
	.diy-circle .circle_right,.diy-circle .clip_right{
		clip:rect(0,auto,auto,25px);
	}
	.change-block .diy-circle .mask {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		left: 5px;
		top: 5px;
		background: #FFD300;
		position: absolute;
		text-align: center;
		line-height: 16px;
		font-size: 12px;
		color: #fff;
		box-sizing: border-box;
		padding-top: 5px;
		z-index: 15;
	}
	.coupon-list .coupon-item .coupon-right .change-block .coupon-btn{
		display: block;
		position: absolute;
	    bottom: 12px;
	    right: 6px;
	    height: 24px;
	    line-height: 19px;
	    width: 57px;
	    border: 3px solid #E3BC03;
	    border-radius: 12px;
	    background-color: #fff;
	    font-size: 12px;
	    color: #FFD300;
	    text-align: center;
	}
	.coupon-list .coupon-item .coupon-right .change-block .coupon-btn-yellow{
		background-color:#ffec00;
		color:#232326;
	}
</style>



// WEBPACK FOOTER //
// src/pages/channel/coupon.vue