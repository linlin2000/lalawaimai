<template>
	<div id="ordergrant-refund">
		<public-header title="订单退款" bgcolor="#ff2d4b"></public-header>
		<div class="content">
			<div class="cause">退款原因</div>
			<div class="cause-inner">
				<van-collapse v-model="activeNames">
					<van-collapse-item title="请选择退款原因" name="1">
						<div class="cause-inner-list">其他理由</div>
						<div class="cause-inner-list">其他理由</div>
						<div class="cause-inner-list">其他理由</div>
					</van-collapse-item>
				</van-collapse>
				<div class="description-cause">
					<div class="text-cause">
						<textarea maxlength="100" placeholder="请描述退款原因"></textarea>
					</div>
					<div class="submit-cause">
						<uploader></uploader>
                        <span class="upload-img">上传图片</span>
					</div>
				</div>
			</div>
			<div class="cause">选择退款来源</div>
			<div class="cause-inner">
				<van-radio-group v-model="radio">
					<van-cell-group>
					<van-cell title="退款至您的账户" clickable @click="radio = '1'">
						<van-radio name="1" />
					</van-cell>
					</van-cell-group>
				</van-radio-group>
			</div>
			<div class="cause">选择退款方式</div>
			<div class="cause-inner">
				<div class="quick-cause van-hairline--bottom">
					<div class="title-quick">
						急速退款
						<van-icon name='question1'></van-icon>
					</div>
					<div class="text-quick">
						无需商家同意可直接全单退款
					</div>
					<div class="quick-submit">
						<van-icon name='check'></van-icon>
					</div>
				</div>
				<div class="quick-cause">
					<div class="title-quick">
						普通退款
					</div>
					<div class="text-quick">
						支持全单/部分退款，商家同意后退款
					</div>
					<div class="quick-submit">
						<van-icon name='check'></van-icon>
					</div>
				</div>
				<div class="select-button"></div>
			</div>
			<div class="cause">选择退款商品</div>
			<div class="goods-refund">
				<div class="goods-head">
					<div class="store-img">
						<img src="http://1.xinzuowl.com/attachment/images/1/2016/12/ecc9Eu0LIyr62aoOiC6goU6aLAcIIC.jpg">
					</div>
					<div class="store-title">茶不思</div>
					<div class="store-sign">啦啦专送</div>
				</div>
			</div>
			<div class="goods-item">
				<div class="goods-list">
					<div class="goods-selected" v-if="1">
						<van-icon name='check'></van-icon>
					</div>
					<div class="goods-select" v-if="0">
						<van-icon name='check'></van-icon>
					</div>
					<div class="goods-img">
						<img src="http://1.xinzuowl.com/attachment/images/1/2016/12/ecc9Eu0LIyr62aoOiC6goU6aLAcIIC.jpg">
					</div>
					<div class="goods-info">
						<div class="goods-name">农夫山泉</div>
						<div class="goods-number">
							&times;99999999
						</div>
					</div>
                    <div class="goods-count">
                        <div class="count">
                            <van-icon name='plus'  class="none"></van-icon>
                            <div class='num'>99999999</div>
                            <van-icon name='minus'></van-icon>
                        </div>
                    </div>
				</div>
			</div>
            <div class="goods-item">
                <div class="goods-list">
                    <div class="goods-selected" v-if="1">
                        <van-icon name='check'></van-icon>
                    </div>
                    <div class="goods-select" v-if="0">
                        <van-icon name='check'></van-icon>
                    </div>
                    <div class="goods-img">
                        <img src="http://1.xinzuowl.com/attachment/images/1/2016/12/ecc9Eu0LIyr62aoOiC6goU6aLAcIIC.jpg">
                    </div>
                    <div class="goods-info">
                        <div class="goods-name">农夫山泉</div>
                        <div class="goods-number">
                            &times;99999999
                        </div>
                    </div>
                    <div class="goods-count">
                        <div class="count">
                            <van-icon name='plus'></van-icon>
                            <div class='num'>99999999</div>
                            <van-icon name='minus'></van-icon>
                        </div>
                    </div>
                </div>
            </div>
			<div class="delivery-price van-hairline--bottom">
				<div class="price">
					<div class="price-left">配送费</div>
					<div class="price-right"><span>￥3</span></div>
				</div>
				<div class="explain">部分退，配送费不退回</div>
			</div>
			<div class="delivery-price">
				<div class="refund-number">
					<div class="check-all">
						<div class="checked" v-if="1">
							<van-icon name='check'></van-icon>
						</div>
						<div class="check" v-if="0">
							<van-icon name='check'></van-icon>
						</div>
						全选
					</div>
					<div class="refund-price-number">退款金额<span>￥4.13</span></div>
				</div>
				<div class="description">单独商品的退款金额是在刨除配送费后按照优惠活动等比计算得出。如您选择全部商品则按照全部退款返还您支付的全部金额</div>
			</div>
			<div class="submit">提交</div>
		</div>
	</div>
</template>

<script>
	import GoodsHandle from '@/components/goodsHandle'
	import PublicHeader from '@/components/header'
    import Uploader from '@/components/uploader'
	export default {
		components: {
			PublicHeader,
			GoodsHandle,
            Uploader
		},
  		data() {
  			return {
  				activeNames: ['1'],
  				radio: 1
  			}
  		},
		methods: {
			onRead(file) {
				
			}
		}
	}
</script>

<style>
	#ordergrant-refund .content{
		position: fixed;
		top: 46px;
		right: 0;
		left: 0;
		bottom: 50px;
		width: 100%;
		background: #fff;
		overflow-x: hidden;
        overflow-y: scroll;
	}
	#ordergrant-refund .content::-webkit-scrollbar {
        display: none;
    }
    #ordergrant-refund .content .cause{
    	background: #EFEFEF;
    	padding: 8px 15px;
    	color: #6E6E6E;
    	font-size: 14px;
    	line-height: 21px;
    }
    #ordergrant-refund .content .cause-inner{
    	position: relative;
    	background: #fff;
    }
    #ordergrant-refund .content .cause-inner .van-cell__value{
    	font-size: 15px;
    }
    #ordergrant-refund .content .cause-inner .van-collapse-item__content{
    	padding: 0px 15px;
    }
    #ordergrant-refund .content .cause-inner .description-cause{
    	background: #fff;
    	padding: 15px;
    }
    #ordergrant-refund .content .cause-inner .description-cause .text-cause{
    	width: 100%;
    	height: 40px;
    }
    #ordergrant-refund .content .cause-inner .description-cause .text-cause textarea{
    	width: 100%;
    	height: 100%;
    	resize:none;
    	border: none;
    	caret-color: #009688;
    	font-size: 15px;
    }
    #ordergrant-refund .content .cause-inner .description-cause .submit-cause{
    	background: #fff;
    	padding-top: 5px;
        position: relative;
    }
    #ordergrant-refund .content .cause-inner .description-cause .submit-cause .upload-img{
        position: absolute;
        left: 28%;
        top: 42%;
    }
    #ordergrant-refund .content .cause-inner .van-radio__input{
    	width: 24px;
		height: 24px;
    }
    #ordergrant-refund .content .cause-inner .van-radio__input .van-icon-checked{
    	color: #fff;
		background: #FF2D4B;
		position: relative;
		width: 22px;
		height: 22px;
		line-height: 24px;
		border-radius: 22px;
		font-size: 14px;
		text-align: center;
    }
    #ordergrant-refund .content .cause-inner .van-radio__input .van-icon-check{
    	color: #fff;
		position: relative;
		width: 21px;
		height: 21px;
		line-height: 24px;
		border: 1px solid #c7c7cc;
		border-radius: 21px;
		font-size: 14px;
		text-align: center;
    }
    #ordergrant-refund .content .cause-inner .quick-cause{
    	position: relative;
    	background: #fff;
    	padding: 10px 15px;
    }
    #ordergrant-refund .content .cause-inner .quick-cause .title-quick{
    	text-align: left;
    	font-size: 15px;
    	line-height: 22px;
    }
    #ordergrant-refund .content .cause-inner .quick-cause .title-quick .van-icon-question1{
    	color: #919191;
    	font-size: 15px;
    }
    #ordergrant-refund .content .cause-inner .quick-cause .text-quick{
    	text-align: left;
    	font-size: 15px;
    	line-height: 22px;
    	color: #999;
    }
    #ordergrant-refund .content .cause-inner .quick-cause .quick-submit{
    	position: absolute;
    	top: 20px;
    	right: 15px;
    	color: #fff;
		background: #FF2D4B;
		width: 22px;
		height: 22px;
		line-height: 24px;
		border-radius: 22px;	
		text-align: center;
    }
    #ordergrant-refund .content .cause-inner .quick-cause .quick-submit .van-icon-check{
    	font-size: 14px;
    }
    #ordergrant-refund .content .cause-inner .cause-inner-list{
    	padding: 0px 15px 5px;
		background-color: #fff;
		color: #333;
		font-size: 14px;
		overflow: hidden;
		line-height: 21px;
    }
    #ordergrant-refund .content .goods-refund{
    	position: relative;
    	background: #fff;
    	padding: 12px 15px;
    }
    #ordergrant-refund .content .goods-refund .goods-head{
    	position: relative;
    	color: #6F6F6F;
    	overflow: hidden;
    }
    #ordergrant-refund .content .goods-refund .goods-head .store-img{
    	float: left;
    	width: 30px;
    	height: 30px;
    }
    #ordergrant-refund .content .goods-refund .goods-head .store-img img{
    	width: 100%;
    	height: 100%;
    	border-radius: 100%;
    	border: none;
    }
    #ordergrant-refund .content .goods-refund .goods-head .store-title{
    	float: left;
    	color: #666;
    	font-size: 15px;
    	line-height: 24px;
    	margin-left: 10px;
    }
    #ordergrant-refund .content .goods-refund .goods-head .store-sign{
    	float: right;
		background-color: #ff2d4b;
		color: #fff;
		height: 20px;
		line-height: 20px;
		text-align: center;
		border-radius: 8px 0 8px 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 30%;
		padding: 0 5px;
		align-self: flex-end;
		margin-top: 5px;
    }
    #ordergrant-refund .content .goods-item{
    	width: 100%;
    	margin-bottom: 5px;
    	background: #f8f8f8;
    }
    #ordergrant-refund .content .goods-item .goods-list{
    	position: relative;
    	overflow: hidden;
    	padding: 12px 15px; 
    }
    #ordergrant-refund .content .goods-item .goods-list .goods-selected{
    	float: left;
    	color: #fff;
		background: #FF2D4B;
		position: relative;
		width: 22px;
		height: 22px;
		line-height: 24px;
		border-radius: 22px;
		font-size: 14px;
		text-align: center;
		margin-top: 19px;
    }
    #ordergrant-refund .content .goods-item .goods-list .goods-select{
    	float: left;
    	color: #fff;
		position: relative;
		width: 21px;
		height: 21px;
		line-height: 24px;
		border: 1px solid #c7c7cc;
		border-radius: 21px;
		font-size: 14px;
		text-align: center;
		margin-top: 19px;
    }
    #ordergrant-refund .content .goods-item .goods-list .goods-img{
    	float: left;
    	width: 64px;
    	height: 64px;
    	margin-left: 16px;
    }
    #ordergrant-refund .content .goods-item .goods-list .goods-img img{
    	width: 100%;
    	height: 100%;
    	border: none;
    }
    #ordergrant-refund .content .goods-item .goods-list .goods-info{
    	float: left;
        width: 64%;
        white-space: nowrap;
        overflow: hidden;
    }
    #ordergrant-refund .content .goods-item .goods-list .goods-info .goods-name{
    	padding-left: 12px;
    	line-height: 21px;
        width: 100%;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
    }
    #ordergrant-refund .content .goods-item .goods-list .goods-info .goods-number{
    	padding-left: 12px;
    	padding-top: 18px;
    	line-height: 25px;
    	color: #9C9C9C;
    }
    #ordergrant-refund .content .goods-item .goods-list .goods-count{
        position: absolute;
        top: 58%;
        right: 4%;
    }
    #ordergrant-refund .content .goods-item .goods-list .goods-count .count{
        overflow: hidden;
        line-height: 24px;
    }
    #ordergrant-refund .content .goods-item .goods-list .goods-count .count .van-icon-plus{
        float: right;
        padding:6px;
        border-radius: 100%;
        background: #ff2d4b;
        color: #fff;
        margin-left: 10px;
    }
    #ordergrant-refund .content .goods-item .goods-list .goods-count .count .van-icon-plus.none{
        background: #ccc;
    }
    #ordergrant-refund .content .goods-item .goods-list .goods-count .count .num{
        float: right;
        max-width: 36px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
    }
    #ordergrant-refund .content .goods-item .goods-list .goods-count .count .van-icon-minus{
        float: right;
        padding:5px;
        border-radius: 100%;
        background: #fff;
        color: #B0B0B0;
        border: 1px solid #ccc;
        margin-right: 10px;
    }
    #ordergrant-refund .content .delivery-price{
    	padding: 12px 15px;
    	position: relative;
    	background: #fff;
    }
    #ordergrant-refund .content .delivery-price .price{
    	line-height: 21px;
    	color: #000;
    	font-size: 15px;
    	width: 100%;
    	overflow: hidden;
    }
    #ordergrant-refund .content .delivery-price .price .price-left{
    	float: left;
    	margin-left: 38px;
    }
    #ordergrant-refund .content .delivery-price .price .price-right{
    	float: right;
    }
    #ordergrant-refund .content .delivery-price .price .price-right span{
    	text-decoration:line-through;
    }
    #ordergrant-refund .content .delivery-price .explain{
    	color: #9F9F9F;
    	text-align: right;
    	line-height: 21px;
    	font-size: 13px;
    }
    #ordergrant-refund .content .delivery-price .refund-number{
    	overflow: hidden;
    }
    #ordergrant-refund .content .delivery-price .refund-number .check-all{
    	float: left;
    	color: #757575;
    	line-height: 22px;
    	font-size: 14px;
    }
    #ordergrant-refund .content .delivery-price .refund-number .check-all .checked{
    	float: left;
    	color: #fff;
		background: #FF2D4B;
		position: relative;
		width: 22px;
		height: 22px;
		line-height: 24px;
		border-radius: 22px;
		font-size: 14px;
		text-align: center;
		margin-right: 16px;
    }
    #ordergrant-refund .content .delivery-price .refund-number .check-all .check{
    	float: left;
    	color: #fff;
		position: relative;
		width: 21px;
		height: 21px;
		line-height: 24px;
		border: 1px solid #c7c7cc;
		border-radius: 21px;
		font-size: 14px;
		text-align: center;
		margin-right: 16px;
    }
    #ordergrant-refund .content .delivery-price .refund-number .refund-price-number{
    	float: right;
    	color: #000;
    	line-height: 22px;
    	font-size: 15px;
    }
    #ordergrant-refund .content .delivery-price .refund-number .refund-price-number span{
    	color: #ff2d4b;
    }
    #ordergrant-refund .content .delivery-price .description{
    	line-height: 18px;
    	font-size: 13px;
    	color: #999;
    	word-wrap: break-word;
    	padding-top: 10px;
    }
    #ordergrant-refund .content .submit{
    	position: fixed;
    	bottom: 0;
    	left: 0;
    	width: 100%;
    	height: 50px;
    	background: #ff2d4b;
    	text-align: center;
    	color: #fff;
    	line-height: 50px;
    }
</style>


// WEBPACK FOOTER //
// src/pages/ordergrant/refund.vue