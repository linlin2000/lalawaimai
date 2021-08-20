<template>
	<div id="ordergrant-share">
		<public-header title="订单分享" bgcolor="#ff2d4b"></public-header>
		<div class="content">
			<van-list v-model="loading" v-if="!empty" :finished="loaded" @load="onLoad" :offset="100" :immediate-check="false">
				<div class="order-share-list" v-for="comment in comments">
					<div class="order-share-item">
						<div class="col-15">
							<img :src="comment.avatar" alt="">
						</div>
						<div class="col-85">
							<div class="user">
								<div class="username">
									{{comment.username}}
									<span class="order-time">{{comment.addtime}}</span>
								</div>
								<div class="stars">
									<span class="star-rank-outline">
										<span class="star-rank-active" :style="{'width': comment.score + '%'}"></span>
									</span>
									<span class="delivery-time">{{comment.lasttime}}分钟送达</span>
								</div>
							</div>
							<div class="comment">{{comment.note}}</div>
							<div class="list-block">
								<ul>
									<li>
										<router-link :to="util.getUrl({path: '../store/goods', query: {sid: comment.sid}})" class="item-link">
											<div class="item-media">
												<img :src="comment.logo">
											</div>
											<div class="item-inner">
												<div class="item-title">{{comment.store.title}}</div>	
												<template v-for="activityItem in comment.activity.items" v-if="activityItem.int_num <= 1">
													<div class="tags">{{activityItem.title}}</div>
													<van-icon name='right' class="icon"></van-icon>
												</template>
											</div>
										</router-link>
									</li>
								</ul>
							</div>
							<div class="order">
								<span>TA的订单:</span>
								<div class="order-goods row">
									<div class="goods-item col-25" v-for="good in comment.goods">
										<img :src="good.thumb" alt="">
										<div class="goods-num">{{good.goods_num}}份</div>
										<div class="goods-title">{{good.goods_title}}</div>
									</div>
								</div>
								<div class="other">
									实付：
									<span class="price">￥<span>{{comment.final_fee}}</span></span>
									<router-link :to="util.getUrl({path: '../store/goods', query: {sid: comment.sid,order_id: comment.oid,f: 1}})" class="eorder">跟一单</router-link>
								</div>
							</div>
						</div>
					</div>
				</div>
			</van-list>
			<div class="common-no-con" v-else>
				<img src="static/img/comment_no_con.png" alt="">
				<p>还没有分享记录</p>
			</div>
		</div>
		<public-footer></public-footer>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	export default {
		components: {
			PublicHeader,
			PublicFooter
		},
  		data() {
  			return {
  				comments: [],
  				loaded: false,
  				loading: false,
  				empty: false,
  				min: 0,
  			}
  		},
  		methods: {
			onLoad() {
				if(this.loaded) {
					return false;
				}
				this.loading = true;
				this.util.request({
					url: 'ordergrant/share',
					data: {
						min: this.min
					},
				}).then((res) => {
					let result = res.data.message;
					this.comments = [...this.comments, ...result.message];
					if(!this.comments.length) {
						this.loaded = true;
						this.empty = true;
					}
					if (!result.min) {
						this.loaded = true;
					}
					this.loading = false;
					this.min = result.min;
				})
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#ordergrant-share .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		bottom: 50px;
		width: 100%;
		background: #f5f5f5;
		overflow-x: hidden;
        overflow-y: scroll;
	}
	#ordergrant-share .content::-webkit-scrollbar {
        display: none;
    }
    #ordergrant-share .content .order-share-list .order-share-item{
	    background-color: #fff;
	    padding: 10px;
	    font-size: 16px;
	    margin-bottom: 10px;
        margin-left: -4%;
    	overflow: hidden;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-15{
	    width: 10.999999999999998%;
	    margin-left: 4%;
	    float: left;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-15 img{
    	border-radius: 100%;
	    border: none;
    	max-width: 100%;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85{
		width: 81%;
	    margin-left: 4%;
	    float: left;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .user .username{
    	line-height: 22px;
    	font-size: 16px;
    	overflow: hidden;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .user .username .order-time{
		font-size: 12px;
	    color: #999;
	    margin-top: 4px;
	    float: right;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .user .stars{
    	line-height: 25px;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .user .stars .star-rank-outline{
		display: inline-block;
		width: 75px;
		height: 14px;
		position: relative;
		background: transparent ../../../static/img/star-off-1.png) repeat-x left top;
		background-size: cover;
		margin-bottom: -1px;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .user .stars .star-rank-outline .star-rank-active{
	    display: inline-block;
	    position: absolute;
	    top: 0;
	    left: 0;
	    height: inherit;
	    background: transparent ../../../static/img/star-on-1.png) repeat-x left top;
	    background-size: cover;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .user .stars .delivery-time{
		font-size: 12px;
	    color: #999;
	    margin-left: 10px;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .comment{
    	font-size: 12px;
    	line-height: 19px;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .list-block{
		margin-top: 4px;
		margin-bottom: 8px;
		font-size: 17px;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .list-block ul{
	    position: relative;
	    padding: 0;
	    margin: 0;
	    list-style: none;
	    background-color: #fff;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .list-block ul li{
	    list-style: none;
	    margin: 0;
	    padding: 0;
	    position: relative;
	    -moz-box-sizing: border-box;
	    box-sizing: border-box;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .list-block ul li .item-link{
		padding-left: 10px;
	    background-color: rgba(211,211,211,0.2);
		color: inherit;
		-webkit-transition-duration: .3s;
		-o-transition-duration: .3s;
		transition-duration: .3s;
		display: flex;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		-webkit-box-pack: justify;
		-ms-flex-pack: justify;
		-webkit-justify-content: space-between;
		justify-content: space-between;
		-webkit-box-align: center;
		-ms-flex-align: center;
		-webkit-align-items: center;
		align-items: center;
		position: relative;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .list-block ul li .item-link .item-media{
	    padding-top: 9px;
	    padding-bottom: 10px;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .list-block ul li .item-link .item-media img{
	    width: 50px;
	    height: 50px;
    	border: none;
    	max-width: 100%;
    	border-radius: 100%;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .list-block ul li .item-link .item-inner{
	    border-bottom: 0;
	    border-left: 0;
	    display: block;
	    padding-top: 10px;
	    padding-bottom: 9px;
	    align-self: stretch;
       	margin-left: 15px;
       	width: 78%;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .list-block ul li .item-link .item-inner .item-title{
		font-size: 16px;
		line-height: 24px;
	    font-weight: normal;
	    position: relative;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .list-block ul li .item-link .item-inner .tags{
	    height: auto;
	    overflow: hidden;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    font-size: 14px;
	    position: relative;
    	display: -webkit-box;
	    line-height: 21px;
    	color: #5f646e;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .list-block ul li .item-link .item-inner .icon{
    	position: absolute;
    	top: 26px;
    	right: 10px;
	    color: #b2b2b2;
	    font-size: 17px;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .order{
	    background-color: rgba(211,211,211,0.2);
	    padding-bottom: 4px;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .order>span{
	    margin-left: 10px;
    	font-size: 12px;
    	line-height: 17px;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .order .order-goods{
		margin-left: 0;
	    line-height: 1;
	    overflow: hidden;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .order .order-goods .goods-item{
		margin-top: 4px;
		position: relative;
		width: 21%;
		margin-left: 4%;
		float: left;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .order .order-goods .goods-item img{
		width: 100%;
	    height: 60px;
	    border-radius: 100%;
        border: none;
    	max-width: 100%;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .order .order-goods .goods-item .goods-num{
	    position: absolute;
	    top: 0;
	    right: 0;
	    height: 16px;
	    display: inline-block;
	    text-align: center;
	    line-height: 17px;
	    background: #ff2d4b;
	    font-size: 10px;
	    color: #fff;
	    padding: 0 2px;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .order .order-goods .goods-item .goods-title{
		position: absolute;
	    bottom: 2px;
	    font-size: 10px;
	    background-color: rgba(0,0,0,0.6);
	    width: 100%;
	    color: #fff;
	    height: 16px;
	    line-height: 17px;
	    text-align: center;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .order .other{
	    padding: 0 10px;
	    margin-top: 10px;
	    font-size: 12px;
	    overflow: hidden;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .order .other .price{
    	color: #ff2d4b;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .order .other .price span{
    	font-size: 16px;
    }
    #ordergrant-share .content .order-share-list .order-share-item .col-85 .order .other .eorder{
		border: 1px solid #ff2d4b;
	    color: #ff2d4b;
	    padding: 2px 8px;
	    font-size: 12px;
	    border-radius: 4px;
	    float: right;
	    line-height: 18px;
    }
    #ordergrant-share .content .common-no-con{
		position: absolute;
		top: 32%;
		left: 0;
		width: 100%;
		height: 200px;
		text-align: center;
		color: #768491;
		font-size: 16px;
    }
    #ordergrant-share .content .common-no-con img{
	    max-width: 25%;
	    vertical-align: middle;
    }
    #ordergrant-share .content .common-no-con p{
	    margin: 16px 0;
    }
</style>


// WEBPACK FOOTER //
// src/pages/ordergrant/share.vue