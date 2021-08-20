<template>
	<div id="store-share">
		<div class="content">
			<div class="container">
				<div class="store-wrapper">
					<div class="store-logo-wrapper">
						<div class="store-logo">
							<img :src="store.logo" alt="">
						</div>
					</div>
					<div class="store-comment-info">
						<h3 class="store-title">{{store.title}}</h3>
						<div class="store-comment">
							<div class="comment-center">
								<van-rate v-model="store.score" disabled disabled-color='#ff2d4b'/>							
								<span class="customer-score">&nbsp;{{store.score}}</span>
							</div>
							
						</div>
						<div class="delivery-info">
							<!-- 起送价￥{{store.send_price}}
							&nbsp;&nbsp;|&nbsp;&nbsp;配送费￥{{store.delivery_price}}
							&nbsp;&nbsp;|&nbsp;&nbsp;{{store.delivery_time}}分钟 -->
						</div>
					</div>
                    <div class="activity-container" v-if="activity.length > 0 || store.delivery_free_price > 0" @click="onShowAllDiscount">
                        <div class="activity-num" v-if="activity.length > 1">
                    		<van-icon name='arrow-down' class="icon"></van-icon>
                    	</div>
                        <div v-for="(item, index) in activity" :key="index" class="tags" :class="'tags-' + item.type" v-if="index == 0 || showAll">
                        	<div class='icon-b' >
								<img :src="'static/img/' + item.type + '_b.png'">
							</div>
                        	{{item.title}}
                        </div>
                        <div class="tags" v-if="store.delivery_free_price > 0 && (activity.length == 1 || showAll || activity.length == 0)">
                        	满{{store.delivery_free_price}}元免配送费
                        </div>
                        <div class="tags" v-if="store.hot_goods">
                        	热销:<span v-for="hot in store.hot_goods" :key='hot.id'>{{hot.goods}}</span>
                        </div>
                    </div>
				</div>
				<div class="dotted-area">
					<span class="circle circle-left"></span>
					<span class="circle circle-right"></span>
					<span class="dotted-line"></span>
				</div>
				<div class="order">
					<div class="order-detail">
						<h3>订单明细</h3>
						<div class="order-details-con">
							<div class="inner-con van-hairline--bottom">
								<div class="no-gutter" v-for="item in goods" :key="item.id">
									<div class="goods-title">{{item.goods_title}}</div>
									<div class="color-muted">×{{item.goods_num}}</div>
									<div class="color-black">￥{{item.goods_price}}</div>
								</div>
							</div>
							<div class="inner-con van-hairline--bottom">
								<div class="no-gutter" v-if="order.box_price > 0">
									<div class="col-80">餐盒费</div>
									<div class="color-black">￥{{order.box_price}}</div>
								</div>
								<div class="no-gutter">
									<div class="col-80">包装费</div>
									<div class="color-black">￥{{order.pack_fee}}</div>
								</div>
								<div class="no-gutter">
									<div class="col-80">配送费</div>
									<div class="color-black">￥{{order.delivery_fee}}</div>
								</div>
								<div class="no-gutter" v-if="order.order_type == 3">
									<div class="col-80">服务费</div>
									<div class="color-black">￥{{order.serve_fee}}</div>
								</div>
							</div>
							<div class="inner-con van-hairline--bottom" v-if="discounts">
								<div class="no-gutter" v-for="item in discounts" :key="item.id">
									<div class="tags">
										<div class="icon-b">
											<img :src="'static/img/' + item.type + '_b.png'">
										</div>
										{{item.name}}
									</div>
									<div class="color-black">{{item.note}}</div>
								</div>
							</div>
							<div class="inner-con">
								<div class="no-gutter">
									<div class="col-50">订单<span class="black">￥{{order.total_fee}}</span> - 优惠<span class="black">￥{{order.discount_fee}}</span></div>
									<div class="col-15">总计</div>
									<div class="col-25 red">￥<span class="final-fee">{{order.final_fee}}</span></div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="comments van-hairline--bottom">
					<div class="comment-detail">
						<div class="comment-title">我的评价</div>
						<div class="comment-stars">
							<van-rate v-model="comment.score" disabled disabled-color='#ff2d4b'/>
						</div>
						<div class="my-comment">{{comment.note}}</div>
						<template v-if="comment.data">
							<div class="favourable-goods" v-if="comment.data.good">
								<i class="icon favor"></i>
								<span class="goods-label" v-for="(item, index) in comment.data.good" :key="item">{{item}}&nbsp;</span>
							</div>
						</template>
					</div>
				</div>
				<div class="goods" v-if="hot_goods">
					<div class="best-seller">
						<h3 class="best-seller-title">热销商品</h3>
						<ul class="best-seller-list">
							<li class="col-33" v-for="(goods, index) in hot_goods">
								<router-link :to="util.getUrl({path: '/pages/store/goods', query: {sid : store.id, goods_id: goods.id}})">
									<div class="best-seller-img">
										<img :src="goods.thumb" alt="">
									</div>
									<span class="seller-item-name">{{goods.title}}</span>
									<span class="seller-item-sale">已售{{goods.sailed}}</span>
									<div class="seller-item-price">
										￥
										<span class="price">{{goods.price}}</span>
									</div>
								</router-link>
							</li>
						</ul>
					</div>
				</div>
			</div>
		</div>
		<div class="bar-tab">
			<router-link class="bar-tab-a" :to="util.getUrl({path: '/pages/store/goods', query: {sid : store.id}})">进店购买</router-link>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				showAll: false,
				store: {},
				hot_goods: [],
				order: {},
				activity: [],
				discounts: {},
				comment: {
					data:[]
				},
				goods: [],
			}
		},
		methods: {
			onShowAllDiscount() {
				this.showAll = !this.showAll;
			},
			onLoad() {
				this.util.request({
					url: 'ordergrant/share/detail',
					data:{
						id: this.id
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return;
					}
					result = result.message;
					this.activity = result.activity;
					this.store = result.store;
					this.hot_goods = result.hot_goods;
					this.order = result.order;
					this.discounts = result.discounts;
					this.comment = result.comment;
					this.goods = result.goods;
				})	
			},
		},
		created() {
			this.query = this.$route.query
			if(this.query) {
				this.id = this.query.id;
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#store-share .content{
		position: fixed;
		bottom: 50px;
		left: 0;
		right: 0;
		top: 0;
		width: 100%;
		background: url(../../../static/img/ordershare-bg.jpg) no-repeat;
		background-size: 100% 100%;
		overflow: auto;
		overflow-x: hidden;
        overflow-y: scroll;
	}
	#store-share .content::-webkit-scrollbar {
        display: none;
    }
	#store-share .content .container{
	    box-sizing: border-box;
    	margin: 62.5px 20px 20px;
	}
	#store-share .content .container  .store-wrapper{
	    background: #fff;
   		border-radius: 4px 4px 0 0;
	}
	#store-share .content .container  .store-wrapper .store-logo-wrapper{
		position: relative;
		height: 55px;
	}
	#store-share .content .container  .store-wrapper .store-logo-wrapper .store-logo{
	    position: absolute;
	    left: 50%;
	    top: -55px;
	    width: 110px;
	    height: 110px;
	    margin-left: -55px;
	    padding-top: 10px;
	    border-radius: 50%;
	    box-sizing: border-box;
	    background: #fff;
	}
	#store-share .content .container  .store-wrapper .store-logo-wrapper .store-logo img{
	    display: block;
	    width: 88px;
	    height: 88px;
	    border-radius: 50%;
	    margin: 0 auto;
	    border: 1px solid #f4f4f4;
	    object-fit: contain;
	}
	#store-share .content .container  .store-wrapper .store-comment-info .store-title{
		height: 25px;
		line-height: 25px;
	    margin: 0 10px;
	    font-size: 18px;
	    text-align: center;
	    color: #333;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    word-wrap: break-word;
	    word-break: break-all;
	    padding: 0;
	    font-weight: normal;
	}
	#store-share .content .container  .store-wrapper .store-comment-info .store-comment{
		position: relative;
	    margin-top: 5px;
	    text-align: center;
	    overflow: hidden;
	}
	#store-share .content .container  .store-wrapper .store-comment-info .store-comment .van-rate{
		float: left;
	    width: 120px;
	    height: 25px;
	    position: relative;
	}
	#store-share .content .container  .store-wrapper .store-comment-info .store-comment .comment-center{
		margin: 0 auto;
		width: 135px;
		overflow: hidden;
	}
	#store-share .content .container  .store-wrapper .store-comment-info .store-comment .customer-score{
		float: left;
	    color: #656565;
	    height: 21px;
	    font-size: 16px;
	    line-height: 21px;
	    vertical-align: middle;
	}
	#store-share .content .container  .store-wrapper .store-comment-info .delivery-info{
	    margin-top: 5px;
	    text-align: center;
	    font-size: 12px;
	    color: #a9a9a9;
	    line-height: 18px;
	}
	#store-share .content .container  .store-wrapper .activity-container{
	    position: relative;
	    width: 90%;
	    padding: 15px 0 5px;
	    margin: 15px auto 0;
	    border-top: 1px dotted #e5e5e5;
	    font-size: 11px;
	    overflow: hidden;
	}
	#store-share .content .container  .store-wrapper .activity-container .activity-num{
		position: absolute;
		top: 18px;
		right: 0;
	}
	#store-share .content .container  .store-wrapper .activity-container .tags{
	    overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    line-height: 17px;
	    color: #3d4145;
	    padding-bottom: 2px;
	}
	#store-share .content .container  .store-wrapper .activity-container .tags .icon-b{
		width: 16px;
		height: 16px;
		float: left;
		margin-right: 3px;
	}
	#store-share .content .container  .store-wrapper .activity-container .tags .icon-b img{
		width: 100%;
		height: 100%;
	}
	#store-share .content .container .dotted-area{
		position: relative;
	    height: 20px;
	    background: #fff;
	    margin: 0 10px;
	}
	#store-share .content .container .dotted-area .circle{
	    position: absolute;
	    width: 10px;
	    height: 20px;
	    background: url(../../../static/img/half-circle.png) no-repeat;
	    background-size: 10px auto;
	}
	#store-share .content .container .dotted-area .circle-left{
		left: -10px;
	}
	#store-share .content .container .dotted-area .circle-right{
		right: -10px;
	    transform: rotateY(180deg);
	}
	#store-share .content .container .dotted-line{
		display: block;
	    width: 90%;
	    height: 10px;
	    margin: 0 auto;
	    border-bottom: 1px dotted #e5e5e5;
	}
	#store-share .content .container .order{
		background-color: #fff;
	}
	#store-share .content .container .order .order-detail{
		width: 90%;
		margin: 0 auto;
		padding: 15px 0;
	}
	#store-share .content .container .order .order-detail h3{
		font-size: 18px;
		font-weight: normal;
		text-align: center;
		margin: 0;
		line-height: 26px;
	}
	#store-share .content .container .order .order-detail .order-details-con{
		margin-top: 15px;
	}
	#store-share .content .container .order .order-detail .order-details-con .inner-con{
		font-size: 15px;
		color: #3d4145;
		padding: 10px 0 5px 0;
	}
	#store-share .content .container .order .order-detail .order-details-con .inner-con .no-gutter{
		overflow: hidden;
		line-height: 23px;
	}
	#store-share .content .container .order .order-detail .order-details-con .inner-con .no-gutter .goods-title{
		float: left;
		width: 55%;
		font-size: 14px;
		color: #3d4145;
		line-height: 23px;
	}
	#store-share .content .container .order .order-detail .order-details-con .inner-con .no-gutter .color-muted{
		float: left;
		text-align: right;
		color: #999;
		width: 10%;
	}
	#store-share .content .container .order .order-detail .order-details-con .inner-con .no-gutter .color-black{
		width: 35%;
		float: left;
		color: #000;
		text-align: right;
	}
	#store-share .content .container .order .order-detail .order-details-con .inner-con .no-gutter .tags{
		float: left;
		width: 65%;
		overflow: hidden;
	    text-overflow: ellipsis;
	    white-space: nowrap;
	    line-height: 17px;
	    color: #3d4145;
	}
	#store-share .content .container .order .order-detail .order-details-con .inner-con .no-gutter .icon-b{
		width: 16px;
		height: 16px;
		float: left;
		margin-right: 3px;
	}
	#store-share .content .container .order .order-detail .order-details-con .inner-con .no-gutter .icon-b img{
		width: 100%;
		height: 100%;
	}
	#store-share .content .container .order .order-detail .order-details-con .inner-con .no-gutter .col-80{
		width: 65%;
		float: left;
		font-size: 14px;
		color: #3d4145;
	}
	#store-share .content .container .order .order-detail .order-details-con .inner-con .no-gutter .col-50{
		line-height: 20px;
		width: 60%;
		float: left;
		color: #999;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	#store-share .content .container .order .order-detail .order-details-con .inner-con .no-gutter .col-50 .black{
		color: #000;
	}
	#store-share .content .container .order .order-detail .order-details-con .inner-con .no-gutter .col-15{
		line-height: 20px;
		width: 15%;
		float: left;
		text-align: right;
		color: #999;
	}
	#store-share .content .container .order .order-detail .order-details-con .inner-con .no-gutter .col-25{
		line-height: 20px;
		width: 25%;
		float: left;
		text-align: right;
		color: #999;
	}
	#store-share .content .container .order .order-detail .order-details-con .inner-con .no-gutter .col-25.red{
	    color: #f6383a;
	}
	#store-share .content .container .order .order-detail .order-details-con .inner-con .no-gutter .col-25 .final-fee{
		font-size: 19px;
	}
	#store-share .content .container .comments{
		background: #fff;
	}
	#store-share .content .container .comments .comment-detail{
		width: 90%;
		margin: 0 auto;
		padding: 15px 0;
		border-top: 1px dotted #e5e5e5;
	}
	#store-share .content .container .comments .comment-detail .comment-title{
		font-size: 17px;
		font-weight: normal;
		text-align: center;
		margin: 0;
	}
	#store-share .content .container .comments .comment-detail .comment-stars{
		margin-top: 5px;
		text-align: center;
	}
	#store-share .content .container .comments .comment-detail .my-comment{
		font-size: 15px;
		color: #000;
		margin: 4px 0;
		word-wrap: break-word
	}
	#store-share .content .container .comments .comment-detail .favourable-goods{
		margin: 4px 0;
		overflow: hidden;
	}
	#store-share .content .container .comments .comment-detail .favourable-goods .icon.favor{
		float: left;
		display: inline-block; 
		width: 30px; 
		height: 19px;
		margin-right: 4px;
		background: url(../../../static/img/favor.png) no-repeat; 
		background-size: cover;
	}
	#store-share .content .container .comments .comment-detail .favourable-goods .goods-label{
		float: left;
		margin: 0 3px; 
		height: 18px; 
		line-height: 18px; 
		display: inline-block; 
		background: #eceff2; 
		color: #919cae; 
		border-radius: 18px; 
		padding: 0 6px; 
		font-size: 12px;
	}
	#store-share .content .container .goods{
	    background: #fff;
	    border-radius: 0 0 4px 4px;
	}
	#store-share .content .container .goods .best-seller{
		width: 90%;
	    margin: 0 auto;
	    padding: 15px 0;
	}
	#store-share .content .container .goods .best-seller .best-seller-title{
		font-size: 16px;
		line-height: 24px;
	    font-weight: normal;
	    text-align: center;
	    margin: 0;
	}
	#store-share .content .container .goods .best-seller .best-seller-list{
	    margin-top: 15px;
    	margin-bottom: -15px;
	    margin-left: -4%;
	    overflow: hidden;
	}
	#store-share .content .container .goods .best-seller .best-seller-list .col-33{
		margin-bottom: 15px;
		width: 29.333333333333332%;
    	margin-left: 4%;
    	float: left;
	}
	#store-share .content .container .goods .best-seller .best-seller-list .col-33 .best-seller-img{
		margin-bottom: 5px;
	    height: 80px;
	}
	#store-share .content .container .goods .best-seller .best-seller-list .col-33 .best-seller-img img{
		width: 100%;
	    height: 80px;
	}
	#store-share .content .container .goods .best-seller .best-seller-list .col-33 .seller-item-name{
	    display: block;
	    line-height: 20px;
	    font-size: 14px;
	    color: #2C3038;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	}
	#store-share .content .container .goods .best-seller .best-seller-list .col-33 .seller-item-sale{
	    display: block;
	    line-height: 18px;
	    font-size: 11px;
	    color: #656565;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	}
	#store-share .content .container .goods .best-seller .best-seller-list .col-33 .seller-item-price{
	    height: 20px;
	    line-height: 20px;
	    font-size: 11px;
	    color: #F01800;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	}
	#store-share .content .container .goods .best-seller .best-seller-list .col-33 .seller-item-price .price{
		font-size: 16px;
		margin-left: -4px;
	}
	#store-share .bar-tab{
		position: absolute;
		right: 0;
		left: 0;
		bottom: 0;
		z-index: 900;
		width: 100%;
		height: 50px;
		padding: 0;
	}
	#store-share .bar-tab .bar-tab-a{
		display: block;
	    background: #ff2d4b;
	    color: #fff;
	    text-align: center;
	    height: 50px;
	    line-height: 50px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/ordergrant/detail.vue