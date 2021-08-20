<template>
	<div id="wheel-index">
		<div class="content">
			<div class="wheel">
				<div class="content-wheel">
					<div class="wheel-item" :class="{active: activeNum == 1}">
						<img :src="wheelData.data.one.imgurl" class="wheel-img" alt="">
						<span class="wheel-text" :style="{color: wheelData.data.one.color}">{{wheelData.data.one.text}}</span>
					</div>
					<div class="wheel-item thanks" :class="{active: activeNum == 2}">
						<img v-if="activeNum == 2" src="static/img/huigu-active.png" class="wheel-img" alt="">
						<img v-else src="static/img/huigu.png" class="wheel-img" alt="">
						<span class="wheel-text">谢谢惠顾</span>
					</div>
					<div class="wheel-item thanks" :class="{active: activeNum == 3}">
						<img v-if="activeNum == 3" src="static/img/huigu-active.png" class="wheel-img" alt="">
						<img v-else src="static/img/huigu.png" class="wheel-img" alt="">
						<span class="wheel-text">谢谢惠顾</span>
					</div>
					<div class="wheel-item thanks" :class="{active: activeNum == 8}">
						<img v-if="activeNum == 8" src="static/img/huigu-active.png" class="wheel-img" alt="">
						<img v-else src="static/img/huigu.png" class="wheel-img" alt="">
						<span class="wheel-text">谢谢惠顾</span>
					</div>
					<div class="wheel-item" @click="onDraw">
						<span class="draw-click">点击抽奖</span>
						<span class="draw-go"><strong>GO!</strong></span>
					</div>
					<div class="wheel-item" :class="{active: activeNum == 4}">
						<img :src="wheelData.data.two.imgurl" class="wheel-img" alt="">
						<span class="wheel-text" :style="{color: wheelData.data.two.color}">{{wheelData.data.two.text}}</span>
					</div>
					<div class="wheel-item" :class="{active: activeNum == 7}">
						<img :src="wheelData.data.three.imgurl" class="wheel-img" alt="">
						<span class="wheel-text" :style="{color: wheelData.data.three.color}">{{wheelData.data.three.text}}</span>
					</div>
					<div class="wheel-item thanks" :class="{active: activeNum == 6}">
						<img v-if="activeNum == 6" src="static/img/huigu-active.png" class="wheel-img" alt="">
						<img v-else src="static/img/huigu.png" class="wheel-img" alt="">
						<span class="wheel-text">谢谢惠顾</span>
					</div>
					<div class="wheel-item thanks" :class="{active: activeNum == 5}">
						<img v-if="activeNum == 5" src="static/img/huigu-active.png" class="wheel-img" alt="">
						<img v-else src="static/img/huigu.png" class="wheel-img" alt="">
						<span class="wheel-text">谢谢惠顾</span>
					</div>
				</div>
				<div class="info-wrap">
					<router-link tag='div' :to="util.getUrl({path: '/pages/wheel/record'})" class="wrap-head">查看奖品</router-link>
					<div class="wrap-text">
						<div class="wrap-inner">
							1.活动有效时间：
							<span class="activity-info-content">{{wheelData.params.starttime}}~{{wheelData.params.endtime}}</span>
						</div>
						<div class="wrap-inner">
							2.活动说明：
							<span class="activity-info-content">
								<template v-for="item in wheelData.params.desc">
									{{item}}<br>
								</template>
							</span>
						</div>
					</div>
				</div>
			</div>			
		</div>
		<navigator :navs="menufooter"></navigator>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import Navigator from "@/components/navigator"
	export default {
		components: {
			Navigator
		},
  		data() {
  			return {
  				showPreLoading: true,
  				activeNum: 0,
  				wheelData: {
  					data: {
  						one: {},
  						two: {},
  						three: {},
  					},
  					params: {}
  				},
  				init: {
  					index: 1,//当前选中对象的位置
  					fast: 4, //在哪个位置开始加速
  					num: 8,//共有多少个抽奖对象,
  					num_t: 4,
  					cycle: 3, //转动多少圈
  					flag: false,
  					lucky: '', //中奖号码
  					cycle_default: 3,
  					speed: 100,
  				},
  				prize: {
  					note: '',
  					type: '',
  					id: '',
  				},
  				imghuigu:'',
  				menufooter: {},
  			}
  		},
  		methods: {
  			rand(min, max) {
  				var Range = max - min;
				var Rand = Math.random();
				return(min + Math.round(Rand * Range));
  			},
  			onDraw() {
	  			if(this.init.flag) {
					return false;
				}
				this.init.fast = this.rand(5, 6);
				this.init.cycle_default = this.init.cycle = this.rand(3, 5);
				this.init.speed = 300;            //开始时速度
				this.init.flag = true;
  				this.util.request({
					url: 'wheel/activity/index',
					method: 'POST',
					data:{
						id: this.id,
						order_id: this.order_id
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return false;
					}
					//result = result.message;
					this.init.lucky = result.luckyNum;
					var lucky = this.init.lucky;
					if(lucky == '1' || lucky == '4' || lucky == '7') {
						this.prize.type = result.award.type;
						this.prize.id = result.id;
					}
					this.prize.note = result.message;
					this.activeNum = 1;
					this.showLottery();
				})	

  			},
  			showLottery() {
	  			if (this.init.index > this.init.num) {
					this.init.index = 1;
					this.init.cycle--;
				}
				var c = this.init.num + 1;
				var cycle_stop = this.init.lucky - this.init.num_t >= 0 ? 0 : 1;
				var beforeOrAfter = this.init.lucky - this.init.num_t;
				var t_index = beforeOrAfter >= 0 ? (beforeOrAfter > 0 ? beforeOrAfter : 1) : c + beforeOrAfter;
				this.activeNum = this.init.index;
			
				if (this.init.index > this.init.fast && this.init.cycle == this.init.cycle_default) {
					this.init.speed = 100;//开始加速
				}
				if ((this.init.cycle == cycle_stop && this.init.index >= t_index) || this.init.cycle < cycle_stop) {
					this.init.speed = this.init.speed + 200;//开始减速
				}
				var that = this;
				if (this.init.cycle <= 0 && this.init.index == this.init.lucky) {//结束抽奖，选中号码
					clearTimeout(lottery);
					setTimeout(function () {
						that.$toast(that.prize.note);
						that.init.flag = false;
						that.init.index = 1;
						that.prize.type = 0;
						that.prize.note = '';
						//that.activeNum = 0;
					}, 1000);
					that.init.flag = false;
				} else {
					this.init.index++;
					var lottery = setTimeout(this.showLottery, this.init.speed);
				}
  			},
			onLoad() {
				this.util.request({
					url: 'wheel/activity/index',
					data:{
						id: this.id,
						order_id: this.order_id,
						menufooter: 1,
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return;
					}
					result = result.message;
					this.wheelData = result.wheelData;
					this.menufooter = window.menufooter;
				})
			},
		},
		created() {
			this.query = this.$route.query
			if(this.query) {
				this.id = this.query.id;
				this.order_id = this.query.order_id;
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#wheel-index .content{
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		background: #F02940;
		overflow-x: hidden;
	    overflow-y: scroll;
	}
	#wheel-index .content::-webkit-scrollbar {
	    display: none;
	}
	#wheel-index .content .wheel{
	    background: url(../../../static/img/background.png) no-repeat;
	    background-size: 100%;
	    text-align: center;
	}
	#wheel-index .content .wheel .content-wheel{
		width: 298px;
		height: 298px;
		margin: 0 auto;
		margin-top: 220px;
		display: inline-block;
		background: url(../../../static/img/wheel-background.png) no-repeat;
		background-size: 100% 100%;
		padding-left: 3px;
	}
	#wheel-index .content .wheel .content-wheel .wheel-item:first-child, #wheel-index .content .wheel .content-wheel .wheel-item:nth-child(2), #wheel-index .content .wheel .content-wheel .wheel-item:nth-child(3){
	    margin-top: 0.9rem;
	}
	#wheel-index .content .wheel .content-wheel .wheel-item:nth-child(5){
	    background: #ffeb18;
	}
	#wheel-index .content .wheel .content-wheel .wheel-item{
		width: 85px;
		height: 85px;
		background: #fff;
		border-radius: 3px;
		text-align: center;
		float: left;
		margin-left: 9px;
		margin-top: 0.4rem;
		box-sizing: border-box;
	}
	#wheel-index .content .wheel .content-wheel .wheel-item .wheel-img{
		width: 45px;
		height: 45px;
		margin-top: 15px;
		display: inline-block;
		vertical-align: top;
		border: none;
		max-width: 100%;
	}
	#wheel-index .content .wheel .content-wheel .wheel-item .wheel-text{
		font-size: 13px;
		color: #f87a7c;
		display: inline-block;
		margin-top: 7px;
	}
	#wheel-index .content .wheel .content-wheel .wheel-item .draw-click{
		font-size: 15px;
		color: #ff0007;
		margin-top: 20px;
		display: inline-block;
		line-height: 22px;
	}
	#wheel-index .content .wheel .content-wheel .wheel-item .draw-go{
		color: #ff0007;
		display: inline-block;
	}
	#wheel-index .content .wheel .content-wheel .wheel-item .draw-go strong{
	    font-weight: 700;
	}
	#wheel-index .content .wheel .content-wheel .wheel-item.active{
	    background: #ffcdd3;
	}
	#wheel-index .content .wheel .content-wheel .thanks .wheel-text{
		color: #ff2d4b;
	}
	#wheel-index .content .wheel .content-wheel .thanks.active .wheel-text{
		color: #fff;
	}
	#wheel-index .content .wheel .info-wrap{
		width: 298px;
		padding: 10px 0 20px;
		margin: 0 auto;
		overflow: hidden;
	}
	#wheel-index .content .wheel .info-wrap .wrap-head{
		color: #000;
		text-align: right;
		font-size: 16px;
		line-height: 24px;
	}
	#wheel-index .content .wheel .info-wrap .wrap-text{
		margin-top: 10px;
		font-size: 16px;
		color: #000;
		text-align: left;
	}
	#wheel-index .content .wheel .info-wrap .wrap-text .wrap-inner{
		margin-bottom: 8px;
		cursor: pointer;
		line-height: 22px;
		display: inline-block;
		font-size: 14px;
	}
	#wheel-index .content .wheel .info-wrap .wrap-text .wrap-inner .activity-info-content{
		margin-left: 14px;
		cursor: pointer;
		display: block;
		font-size: 14px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/wheel/index.vue