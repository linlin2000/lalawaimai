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
								<van-rate v-model="value" color="#ff2b4d" />
								<span class="customer-score">&nbsp;{{store.score}}</span>
							</div>
						</div>
						<div class="delivery-info">
							<!-- 起送价￥{{store.send_price}}
							&nbsp;&nbsp;|&nbsp;&nbsp;配送费￥{{store.delivery_price}}
							&nbsp;&nbsp;|&nbsp;&nbsp;{{store.delivery_time}}分钟 -->
						</div>
					</div>
					<div class="activity-container" v-if="activity && activity.num > 0">
						<div v-for="(item, index) in activity.items" class="tags" :class="'tags-' + item.type">
							<div class='icon-b'>
								<img :src="'static/img/' + item.type + '_b.png'">
							</div>
							{{item.title}}
						</div>
						<div class="tags" v-if="store.delivery_free_price > 0">
							满{{store.delivery_free_price}}元免配送费
						</div>
						<div class="tags" v-if="activity.hot_goods">
							热销:<span v-for="(hot, index) in activity.hot_goods">{{hot.goods}}</span>
						</div>
					</div>
				</div>
				<div class="dotted-area">
					<span class="circle circle-left"></span>
					<span class="circle circle-right"></span>
					<span class="dotted-line"></span>
				</div>
				<div class="goods">
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
				sid: Number,
				activity: {},
				store: {},
				hot_goods: [],
				value: 0
			}
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'wmall/store/share',
					data:{
						sid: this.sid
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						return;
					}
					this.activity = result.message.activity;
					this.store = result.message.store;
					this.hot_goods = [...this.hot_goods, ...result.message.hot_goods];
					this.value = result.message.store.score;
					this.util.setWXTitle(this.store.title)
				})
			},
		},
		created() {
			if(this.$route.query.sid) {
				this.sid = this.$route.query.sid;
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
	#store-share .content .container  .store-wrapper .store-comment-info .store-comment .comment-center{
		margin: 0 auto;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
	}
	#store-share .content .container  .store-wrapper .store-comment-info .store-comment .customer-score{
		color: #656565;
		font-size: 16px;
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
// src/pages/store/share.vue