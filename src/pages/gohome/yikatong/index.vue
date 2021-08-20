<template>
	<div id="yikatong-index">
		<!--<public-header title="一卡通"></public-header>-->
		<div class="content">
			<div class="vip-card bg-default">
				<div class="card-bg"></div>
				<div class="card-wrap">
					<div class="img-wrap">
						<img class="img-100" src="static/img/vip_bg.png" alt="">
					</div>
					<div class="card-content">
						<div class="card-tip">
							开通啦啦生活圈一卡通预计将为您节省
							<span class="margin-5-l font-16 font-500">¥123.45</span>
						</div>
						<div class="btn-buy">立即开通</div>
					</div>
				</div>
			</div>
			<div class="vip-boon bg-default">
				<div class="boon-header">
					<div class="boom-title">尊享权益</div>
					<div class="bg-line"></div>
				</div>
				<ul class="flex-lr">
					<li class="boon-item">
						<div class="img-wrap">
							<img class="img-100" src="static/img/vip_privilege.png" alt="">
						</div>
						<span class="font-13 margin-10-t">专属特权</span>
					</li>
					<li class="boon-item">
						<div class="img-wrap">
							<img class="img-100" src="static/img/vip_gift.png" alt="">
						</div>
						<span class="font-13 margin-10-t">会员礼包</span>
					</li>
					<li class="boon-item">
						<div class="img-wrap">
							<img class="img-100" src="static/img/vip_discount.png" alt="">
						</div>
						<span class="font-13 margin-10-t">专属折扣</span>
					</li>
					<li class="boon-item">
						<div class="img-wrap">
							<img class="img-100" src="static/img/vip_coupon.png" alt="">
						</div>
						<span class="font-13 margin-10-t">专属卡券</span>
					</li>
				</ul>
			</div>
			<div class="margin-10-t ">
				<div class="tab-group van-hairline--bottom">
					<div class="tab-item" :class="{active: tabActive == 'privilege'}" @click="onToggleTab('privilege')">会员特权</div>
					<div class="tab-item" :class="{active: tabActive == 'seckill'}" @click="onToggleTab('seckill')">专享抢购</div>
					<div class="tab-item" :class="{active: tabActive == 'gift'}" @click="onToggleTab('gift')">会员礼包</div>
					<div class="tab-item" :class="{active: tabActive == 'coupon'}" @click="onToggleTab('coupon')">专属卡券</div>
				</div>
				<div class="privilege bg-default" v-if="tabActive == 'privilege'">
					<ul class="date">
						<li class="date-item active">
							<div>今天</div>
							<div>12-14</div>
						</li>
						<li class="date-item">
							<div>明天</div>
							<div>12-15</div>
						</li>
						<li class="date-item">
							<div>后天</div>
							<div>12-16</div>
						</li>
						<li class="date-item" v-for="(item, index) in 7" :key="index">
							<div>周{{item}}</div>
							<div>12-{{item+16}}</div>
						</li>
					</ul>
					<ul class="goods-list">
						<li class="goods-item">
							<div class="img-wrap">
								<img class="img-100" src="https://fuss10.elemecdn.com/e/46/02b0c5d2fdfca3e11a13ad3fa4094jpeg.jpeg" alt="">
							</div>
							<div class="w-100 ellipsis font-14 padding-10-tb">葱肉馅饺子葱肉馅饺子葱肉馅饺子葱肉馅饺子</div>
							<ul class="flex-lr">
								<li class="goods-discount">会员专享1.1折</li>
								<li class="to-use">立即使用</li>
							</ul>
						</li>
						<li class="goods-item" v-for="(item, index) in 5" :key="index">
							<div class="img-wrap">
								<img class="img-100" src="https://fuss10.elemecdn.com/e/46/02b0c5d2fdfca3e11a13ad3fa4094jpeg.jpeg" alt="">
							</div>
							<div class="w-100 ellipsis font-14 padding-10-tb">葱肉馅饺子</div>
							<ul class="flex-lr">
								<li class="goods-discount">会员专享1.1折</li>
								<li class="to-use">立即使用</li>
							</ul>
						</li>
					</ul>
				</div>
				<div class="seckill" v-else-if="tabActive == 'seckill'">
					<ul class="category bg-default">
						<li class="cate-item active">全部</li>
						<li class="cate-item " v-for="(item, index) in 8" :key="index">抢购分类{{item}}</li>
					</ul>
					<div class="goods-list margin-10-t bg-default">
						<div class="goods-item van-hairline--bottom" v-for="(item, index) in 6" :key="index">
							<div class="img-wrap">
								<img class="img-100" src="https://fuss10.elemecdn.com/e/46/02b0c5d2fdfca3e11a13ad3fa4094jpeg.jpeg" alt="">
							</div>
							<div class="info">
								<div class="store-title font-15 font-500 ellipsis">茶不思</div>
								<div class="goods-title font-13 w-100 ellipsis">葱肉馅饺子</div>
								<div class="c-gray font-13">结束时间: 2018-12-23 23:59</div>
								<div>
									<span class="c-danger font-15 font-500">¥10.00</span>
									<span class="c-gray margin-5-l line-through font-12">¥20.00</span>
								</div>
								<div class="distance">3.4km</div>
								<div class="btn-buy">立即抢购</div>
							</div>
						</div>
					</div>
				</div>
				<div class="gift" v-else-if="tabActive == 'gift'">
					<ul class="category bg-default">
						<li class="cate-item active">全部</li>
						<li class="cate-item " v-for="(item, index) in 8" :key="index">分类{{item}}</li>
					</ul>
					<div class="store-list bg-default margin-10-t">
						<div class="store-item van-hairline--bottom" v-for="(item, index) in 6" :key="index">
							<div class="flex w-100">
								<div class="img-wrap">
									<img class="img-100" src="http://1.xinzuowl.com/attachment/images/1/2016/08/D6uWzXWwXTGU59w97t73QG399953Tx.jpg" alt="">
								</div>
								<div class="store-title ellipsis font-500">茶不思</div>
							</div>
							<div class="margin-10-tb flex w-100">
								<span class="coupon-title ellipsis">芒柚水果茶免费券</span>
								<span class="c-gray margin-5-l">x3</span>
							</div>
							<div class="c-danger">价值120元</div>
							<div class="distance">3.4km</div>
							<div class="btn-buy">立即抢购</div>
						</div>
					</div>
				</div>
				<div class="coupon" v-else-if="tabActive == 'coupon'">
					<ul class="category bg-default">
						<li class="cate-item active">全部</li>
						<li class="cate-item " v-for="(item, index) in 8" :key="index">分类{{item}}</li>
					</ul>
					<div class="coupon-list">
						<div class="coupon-item flex-lr" v-for="(item, index) in 8" :key="item">
							<div class="left">
								<div class="c-white font-500 w-100 flex">
									<div class="img-wrap">
										<img class="img-100" src="http://1.xinzuowl.com/attachment/images/1/2016/08/D6uWzXWwXTGU59w97t73QG399953Tx.jpg" alt="">
									</div>
									<div class="coupon-title ellipsis">茶不思港式烧腊馆茶不思港式烧腊馆茶不思港式烧腊馆茶不思港式烧腊馆</div>
								</div>
								<div class="c-white margin-10-t font-12">满100元可用</div>
								<div class="c-white margin-10-t font-12">限 2018-12-31 前使用</div>
							</div>
							<div class="right">
								<span class="font-18 font-bold c-white">¥5</span>
								<div class="btn-take">立即领取</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		components: {
			PublicHeader,
		},
		data() {
			return {
				tabActive: 'coupon'
			}
		},
		methods: {
			onLoad() {

			},
			onToggleTab(value) {
				var that = this;
				if(that.tabActive == value) {
					return;
				} else {
					that.tabActive = value;
				}
			}
		}
	}
</script>

<style>
	#yikatong-index .van-nav-bar{
		background: linear-gradient(to right, #FC6030 , #FF0101) !important;
	}
	#yikatong-index .vip-card{
		position: relative;
		width: 100%;
		height: 200px;
	}
	#yikatong-index .vip-card .card-bg{
		width: 100%;
		height: 60%;
		background: linear-gradient(to right, #FC6030 , #FF0101);
	}
	#yikatong-index .vip-card .card-wrap{
		position: absolute;
		right: 20px;
		bottom: 0px;
		left: 20px;
		border-radius: 5px;
	}
	#yikatong-index .vip-card .card-wrap .img-wrap{
		font-size: 0px;
		width: 100%;
	}
	#yikatong-index .vip-card .card-wrap .card-content{
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		color: #fff;
		font-size: 14px;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: space-between;
		padding: 8% 0 5%;
	}
	#yikatong-index .vip-card .card-wrap .card-content .btn-buy{
		padding: 5px 15px;
		border-radius: 50px;
		background: linear-gradient(to right, #FC6030 , #FF0101);
	}
	/*会员特权*/
	#yikatong-index .vip-boon{
		padding: 0px 20px;
	}
	#yikatong-index .vip-boon .boon-header{
		position: relative;
		height: 58px;
	}
	#yikatong-index .vip-boon .boon-header .bg-line{
		position: absolute;
		z-index: 1;
		top: 28px;
		left: 0;
		right: 0;
		border-top: 1px solid #969696;
	}
	#yikatong-index .vip-boon .boon-header .boom-title{
		position: absolute;
		z-index:2;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: inline-flex;
		padding: 0 15px;
		font-weight: 500;
		background-color: #fff;
	}
	#yikatong-index .vip-boon .boon-header .boom-title:before, #yikatong-index .vip-boon .boom-title:after{
		content: '';
		position: absolute;
		top: 50%;
		margin-top: -3px;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background-color: #666;
	}
	#yikatong-index .vip-boon .boon-header .boom-title:before{
		left: 0px;
	}
	#yikatong-index .vip-boon .boon-header .boom-title:after{
		right: 0px;
	}
	#yikatong-index .vip-boon .boon-item{
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: space-between;
		padding-bottom: 15px;
	}
	#yikatong-index .vip-boon .boon-item .img-wrap{
		width: 50px;
		height: 50px;
		font-size: 0px;
	}
	/*主体*/
	#yikatong-index .tab-group{
		position:relative;
		top: 0;
	}
	#yikatong-index .privilege .date{
		width: 100%;
		padding: 15px 0px 0px 15px;
		white-space: nowrap;
		overflow-x: scroll;
		overflow-y: hidden;
		font-size: 0px;
	}
	#yikatong-index .privilege .date .date-item{
		width: 45px;
		height: 45px;
		border-radius: 50%;
		display: inline-flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		border: 1px solid #999;
		color: #999;
		font-size: 12px;
		margin-right: 10px;
	}
	#yikatong-index .privilege .date .date-item.active{
		color: #ff2d4b;
		border-color: #ff2d4b;
	}
	#yikatong-index .privilege .goods-list{
		padding: 7.5px;
		display:flex;
		flex-flow: row wrap;
	}
	#yikatong-index .privilege .goods-list .goods-item{
		width: 50%;
		padding: 7.5px;
	}
	#yikatong-index .privilege .goods-list .goods-item .img-wrap{
		width: 100%;
		height: 170px;
		font-size: 0px;
	}
	#yikatong-index .privilege .goods-list .goods-item .goods-discount{
		width: 62%;
		color: #fff;
		background-color: #000;
		text-align: center;
		font-size: 13px;
		padding: 5px 0;
		border-radius: 3px 0 0 3px;
	}
	#yikatong-index .privilege .goods-list .goods-item .to-use{
		width: 38%;
		background-color: #ff2d4b;
		flex: 1;
		font-size: 13px;
		color: #fff;
		text-align: center;
		padding: 5px 0;
		border-radius: 0 3px 3px 0;
	}
	#yikatong-index .category{
		width: 100%;
		white-space: nowrap;
		overflow-x: scroll;
		overflow-y: hidden;
		padding: 15px 0px 15px 15px;
		font-size: 0px;
	}
	#yikatong-index .category .cate-item{
		display: inline-flex;
		font-size: 13px;
		margin-right: 15px;
	}
	#yikatong-index .category .cate-item.active{
		padding: 3px 10px;
		border-radius: 50px;
		color: #ff2d4b;
		background-color: #FDE0E5;
	}
	#yikatong-index .seckill .goods-item{
		padding: 15px;
		position: relative;
	}
	#yikatong-index .seckill .goods-item .img-wrap{
		width: 80px;
		height: 80px;
		font-size: 0px;
		border-radius: 3px;
		overflow: hidden;
	}
	#yikatong-index .seckill .goods-item .info{
		position: absolute;
		left: 105px;
		top: 15px;
		right: 15px;
		bottom: 15px;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
		font-size: 14px;
	}
	#yikatong-index .seckill .goods-item .info .store-title{
		max-width: 75%;
	}
	#yikatong-index .seckill .goods-item .info .distance{
		position: absolute;
		top: 0;
		right: 0;
		color: #999;
	}
	#yikatong-index .seckill .goods-item .info .btn-buy{
		position: absolute;
		bottom: 0;
		right: 0;
		background: linear-gradient(to right, #FC6030 , #FF0101);
		color: #fff;
		padding: 5px 10px;
		border-radius: 3px;
	}
	#yikatong-index .gift .store-item{
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
		position: relative;
		padding: 15px;
		font-size: 14px;
	}
	#yikatong-index .gift .store-item .store-title{
		max-width: 75%;
	}
	#yikatong-index .gift .store-item .img-wrap{
		width: 20px;
		height: 20px;
		font-size: 0px;
		margin-right: 10px;
	}
	#yikatong-index .gift .store-item .coupon-title{
		max-width: 70%;
	}
	#yikatong-index .store-item .distance{
		position: absolute;
		top: 18px;
		right: 15px;
		color: #999;
	}
	#yikatong-index .store-item .btn-buy{
		position: absolute;
		bottom: 15px;
		right: 15px;
		background: linear-gradient(to right, #FC6030 , #FF0101);
		color: #fff;
		padding: 5px 10px;
		border-radius: 3px;
	}
	#yikatong-index .coupon-list .coupon-item{
		background-repeat: no-repeat;
		background-position: center center;
		background-size: 100% 100%;
		margin: 15px;
		font-size: 14px;
	}
	#yikatong-index .coupon-list .coupon-item:nth-child(4n) {
		background-image: url('../../../../static/img/coupon_bg_4.png');
	}
	#yikatong-index .coupon-list .coupon-item:nth-child(4n-1) {
		background-image: url('../../../../static/img/coupon_bg_3.png');
	}
	#yikatong-index .coupon-list .coupon-item:nth-child(4n-2) {
		background-image: url('../../../../static/img/coupon_bg_2.png');
	}
	#yikatong-index .coupon-list .coupon-item:nth-child(4n-3) {
		background-image: url('../../../../static/img/coupon_bg_1.png');
	}
	#yikatong-index .coupon-list .coupon-item .left{
		width: 72%;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: space-between;
		padding: 15px 10px;
	}
	#yikatong-index .coupon-list .coupon-item .left .img-wrap{
		width: 20px;
		height: 20px;
		font-size: 0px;
		margin-right: 10px;
	}
	#yikatong-index .coupon-list .coupon-item .left .coupon-title{
		width: 85%;
	}
	#yikatong-index .coupon-list .coupon-item .right{
		width: 28%;
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
	}
	#yikatong-index .coupon-list .coupon-item .btn-take{
		background-color: #fff;
		color: #ff2d4b;
		border-radius: 50px;
		padding: 5px 10px;
		font-size: 12px;
		margin-top: 15px;
	}
	#yikatong-index .coupon-list .coupon-item:nth-child(4n) .btn-take {
		color: #FD2D8D;
	}
	#yikatong-index .coupon-list .coupon-item:nth-child(4n-1) .btn-take {
		color: #FF3056;
	}
	#yikatong-index .coupon-list .coupon-item:nth-child(4n-2) .btn-take {
		color: #2D7DFD;
	}
	#yikatong-index .coupon-list .coupon-item:nth-child(4n-3) .btn-take {
		color: #FF0302;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/yikatong/index.vue