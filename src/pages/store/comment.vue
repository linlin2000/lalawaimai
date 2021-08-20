<template>
	<div id="store-comment">
		<public-header :title="store.title" v-if="!isWeixin"></public-header>
		<store-header :store="store"></store-header>
		<!-- 标签 -->
		<div class="store-tabs flex-lr van-hairline--bottom">
			<router-link  class="tab-item " :to="util.getUrl({path: '/tangshi/pages/table/goods?sid=' + store.id})" tag="div">商品</router-link>
			<!-- <router-link v-if="table == 0" class="tab-item " :to="util.getUrl({path: '/tangshi/pages/reserve/index', query: {sid: store.id}})" tag="div">预定</router-link> -->
			<div class="tab-item active" >评价</div>
			<router-link class="tab-item" :to="util.getUrl({path: '/pages/store/index?sid=' + store.id})" tag="div">商家</router-link>
		</div>
		<div class="comment" :style="{height: commentHeight +'px'}">
			<div class='cmt-detail-info flex-lr'>
				<div class='cmt-detail-info-left-cell'>
					<div class='cmt-detail-info-data'>
						<div class='cmt-detail-info-receive'>{{stat.score}}</div>
					</div>
					<div class='cmt-detail-info-desc'>商家评价</div>
				</div>
				<div class='cmt-detail-info-middle-cell'>
					<div class='cmt-detail-info-stars'>
						<div class='cmt-detail-info-desc'>商品质量</div>
						<div class='appr-status'>
							<template v-for="type in stat.goods_quality_star">
								<div class='appr-score' :class="{'appr-score-all': type == 'all', 'appr-score-half': type == 'half', 'appr-score-gray': type == 'gray'}"></div>
							</template>
						</div>
						<div class='cmt-detail-info-receive'>{{stat.goods_quality}}</div>
					</div>
					<div class='cmt-detail-info-stars'>
						<div class='cmt-detail-info-desc'>配送质量</div>
						<div class='appr-status'>
							<template v-for="type in stat.delivery_service_star">
								<div class='appr-score appr-score-all' :class="{'appr-score-all': type == 'all', 'appr-score-half': type == 'half', 'appr-score-gray': type == 'gray'}"></div>
							</template>
						</div>
						<div class='cmt-detail-info-receive'>{{stat.delivery_service}}</div>
					</div>
				</div>
				<div class='cmt-detail-info-right-cell'>
					<div class='cmt-detail-info-dvy'>{{stat.delivery_service}}</div>
					<div class='cmt-detail-info-desc'>配送评分</div>
				</div>
			</div>
			<div class="comment-grade">
				<van-row gutter="15">
					<van-col span="6">
						<div class="grade-item flex-lr" :class="{'active': type == 0}" @click="onChangeType(0)">
							<div>全部</div>
							<div>{{stat.all > 999 ? '999+': stat.all}}</div>
						</div>
					</van-col>
					<van-col span="6">
						<div class="grade-item flex-lr" :class="{'active': type == 1}" @click="onChangeType(1)">
							<div>好评</div>
							<div>{{stat.good > 999 ? '999+': stat.good}}</div>
						</div>
					</van-col>
					<van-col span="6">
						<div class="grade-item flex-lr" :class="{'active': type == 2}" @click="onChangeType(2)">
							<div>中评</div>
							<div>{{stat.middle > 999 ? '999+': stat.middle}}</div>
						</div>
					</van-col>
					<van-col span="6">
						<div class="grade-item flex-lr" :class="{'active': type == 3}" @click="onChangeType(3)">
							<div>差评</div>
							<div>{{stat.bad > 999 ? '999+': stat.bad}}</div>
						</div>
					</van-col>
				</van-row>
			</div>
			<div class="read-comment">
				<div class="read-comment-group" @click="onCheckedReadComment">
					<i class="icon" :class="{'icon-check': note == 1}"></i>
					<span>只看有内容的评价</span>
				</div>
			</div>
			<div class='evaluates-field'>
				<div class='evaluate-list'>
					<van-list v-model="loading" v-if="!empty" :finished="loaded" @load="onLoad" :offset="100" :immediate-check="false">
						<div class='evaluate-item' v-for="item in comments" :key="item.id">
							<div class='evaluate-sub clearfix'>
								<div class='evaluate-sub-left'>
									<img class="evaluate-user-pic" :src='item.avatar'>
								</div>
								<div class='evaluate-sub-right'>
									<div class='evaluate-sub clearfix'>
										<div class='evaluate-name'>{{item.mobile}}</div>
										<div class='evaluate-time'>{{item.addtime}}</div>
									</div>
									<div class='evaluate-stars clearfix'>
										<template v-for="type in item.scores">
											<div class='appr-score appr-score-all' :class="{'appr-score-all': type == 'all', 'appr-score-half': type == 'half', 'appr-score-gray': type == 'gray'}"></div>
										</template>
										<div class='evaluate-ship-time' style="display: none">44分钟到达</div>
										<div style="clear:both;"></div>
									</div>
									<div class='evaluate-comment clearfix'>
										{{item.note}}
									</div>
									<template v-if="item.thumbs">
										<div class='evaluate-comment-pics clearfix' v-if="item.thumbs.length == 1">
											<div class='comment-pics' v-for="thumb in item.thumbs" @click="util.jsPreviewImage(item.thumbs)">
												<img :src='thumb'>
											</div>
											<div style="clear:both;"></div>
										</div>
										<div class='evaluate-comment-pics pic-multi clearfix' v-else-if="item.thumbs.length > 1">
											<div class='comment-pics' v-for="thumb in item.thumbs" @click="util.jsPreviewImage(item.thumbs)">
												<img :src='thumb'>
											</div>
											<div style="clear:both;"></div>
										</div>
									</template>

									<div class='comment-bottom clearfix' v-if="item.data.good">
										<div class='comment-favor-icon'></div>
										<div class='comment-favor-text'>
											<template v-for="goodsItem in item.data.good">
												{{goodsItem + ' '}}
											</template>
										</div>
									</div>
									<div class='replay' v-if="item.reply">
										商家回复({{item.replytime}}): {{item.reply}}
									</div>
								</div>
							</div>
							<div style="clear:both"></div>
						</div>
					</van-list>
					<div class="common-no-con" v-else>
						<img src= "static/img/comment_no_con.png" alt="" />
						<p>无评价记录</p>
					</div>
				</div>
			</div>
		</div>
		<transition name="loading">
			<iloading v-if="preLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import PublicFooter from '@/components/footer'
	import Load from '@/components/load'
	import StoreHeader from '@/components/storeHeader'
	export default {
		name: 'StoreGoods',
		data() {
			return {
				type: 0,
				note: 1,
				commentHeight: 0,
				title: '',
				store: {
					activity: {
						num: 0
					}
				},
				stat: {},
				comments: [],
				min: 0,
				loaded: false,
				loading: false,
				empty: false,
				preLoading: true
			}
		},
		components: {
			PublicHeader,
			PublicFooter,
			Load,
			StoreHeader,
		},
		methods: {
			onLoad(focus) {
				this.table = this.util.getStorage("table_id");
			
				if(focus) {
					this.min = 0;
					this.comments = [];
					this.loaded = false;
					this.loading = false;
					this.empty = false;
				}
				if(this.loaded) {
					return false;
				}
				this.loading = true;
				this.util.request({
					url: 'wmall/store/comment',
					data: {
						note: this.note,
						type: this.type,
						sid: this.$route.query.sid,
						min: this.min
					}
				}).then((res) => {
					let result = res.data.message;
					this.store = result.message.store;
					this.title = result.message.store.title;
					this.stat = result.message.stat;
					this.comments = [...this.comments, ...result.message.comments];
					this.util.setWXTitle(this.store.title)
					if(!this.comments.length) {
						this.loaded = true;
						this.empty = true;
					}
					if(!result.min) {
						this.loaded = true;
					}
					this.loading = false;
					this.min = result.min;
					this.preLoading = false;
				})
			},
			onChangeType(type) {
				var that = this;
				if(that.type == type) {
					return;
				}
				that.type = type;
				that.onLoad(true);
			},
			onCheckedReadComment() {
				var that = this;
				if(that.note == 1) {
					that.note = 0;
				} else {
					that.note = 1;
				}
				that.onLoad(true);
			}
		},
		mounted () {
			this.onLoad();
			let bodyHeight = document.documentElement.clientHeight;
			let headerHeight = document.getElementsByClassName('header')[0].clientHeight;
			let tabsHeight =document.getElementsByClassName('store-tabs')[0].clientHeight;
			this.commentHeight = bodyHeight-headerHeight-tabsHeight;
			if(document.getElementById('public-header')) {
				let publicHeader = document.getElementById('public-header').clientHeight;
				this.commentHeight = this.commentHeight - publicHeader;
			}
      
      this.query = this.$route.query;
      if($this.query){
        console.log(this.query.custtype);
      }
		}
	}
</script>

<style>
	@import '../../../static/css/diy.css';
	#store-comment{
		background-color: #f5f5f5;
	}
	#store-comment .comment::-webkit-scrollbar {/*滚动条整体样式*/
		width: 0px;   /*高宽分别对应横竖滚动条的尺寸*/
		height: 0px;
	}
	#store-comment .diy-store-list::-webkit-scrollbar {/*滚动条整体样式*/
		width: 0px;   /*高宽分别对应横竖滚动条的尺寸*/
		height: 0px;
	}
	#store-comment #public-header~#store-header{
		margin-top: 46px;
	}
	#store-comment .van-cell__left-icon{
		font-size: 20px;
	}
	#store-comment .store-tabs{
		width: 100%;
		height: 45px;
		line-height: 45px;
		background-color: #fff;
		color: #333;
	}
	#store-comment .store-tabs .tab-item{
		width: 40%;
		height: 100%;
		text-align: center;
		font-size: 14px;
		position: relative;
	}
	#store-comment .store-tabs .tab-item.active{
		color: #f44;
	}
	#store-comment .store-tabs .tab-item.active:after{
		content: '';
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 0;
		border-bottom: 2px solid #f44;
	}
	/* 分隔线 */
	#store-comment .fg-line{
		display: inline-block;
		margin: 5px 5px 0 5px;
		width: 0;
		height: 9px;
		font-size: 0;
		border-right: 1px solid #ccc;
	}

	/*评价*/
	#store-comment .comment{
		width: 100%;
		box-sizing: border-box;
		background: #f4f4f4;
		overflow-y: auto;
	}
	#store-comment .cmt-detail-info {
		background-color: #FFF;
		margin-top: 10px;
		overflow: hidden;
		padding: 10px 0;
	}
	#store-comment .cmt-detail-info-left-cell {
		float: left;
		width: 26%;
		text-align: center;
		display: inline-block;
	}
	#store-comment .cmt-detail-info-data {
		line-height: 32px;
		font-size: 23px;
	}
	#store-comment .cmt-detail-info-receive {
		font-size: 32px;
	}
	#store-comment .cmt-detail-info-receive, .cmt-detail-info-ship, .cmt-detail-info-rate {
		color: #ff2d4b;
	}
	#store-comment .cmt-detail-info-desc {
		line-height: 22px;
		font-size: 12px;
		color: #656565;
	}
	#store-comment .cmt-detail-info-middle-cell {
		width: 50%;
		display: inline-block;
	}
	#store-comment .cmt-detail-info-stars {
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
	}
	#store-comment .cmt-detail-info-stars .cmt-detail-info-desc {
		display: inline-block;
		vertical-align: middle;
	}
	#store-comment .comment-grade{
		background-color: #fff;
		margin-top: 10px;
		padding: 10px 15px;
	}
	#store-comment .comment-grade .grade-item{
		padding: 10px;
		font-size: 12px;
		background-color: #EDF4FE;
		color: #78828C;
		border-radius: 3px;
	}
	#store-comment .comment-grade .grade-item.active{
		color: #fff;
		background-color: #ff2d4b;
	}
	#store-comment .read-comment{
		padding-left: 15px;
		background-color: #FFF;
	}
	#store-comment .read-comment .read-comment-group{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		padding: 10px 15px 10px 0;
		font-size: 13px;
		color: #656565;
		line-height: 21px;
		border-top: 1px dashed #ebedf0;
	}
	#store-comment .read-comment .read-comment-group .icon{
		width: 18px;
		height: 18px;
		border-radius: 50%;
		border: 1px solid #ccc;
		text-align: center;
		line-height: 16px;
		margin-right: 5px;
	}
	#store-comment .read-comment .read-comment-group .icon.icon-check{
		color: #fff;
		background-color: #ff2d4b;
		border-color: #ff2d4b;
	}
	#store-comment .appr-status {
		display: inline-block;
		height: 10px;
		margin: 0 5px 0 8px;
		vertical-align: middle;
	}
	#store-comment .appr-score {
		display: inline-block;
		background: url(../../../static/img/newstars.ae33dbae.png) no-repeat;
		background-size: cover;
		width: 10px;
		height: 10px;
		float: left;
		margin-right: 4px;
		background-position: 0 0;
	}
	#store-comment .appr-score-half {
		background-position: -13px 0;
	}
	#store-comment .appr-score-gray {
		background-position: -27px 0!important;
	}
	#store-comment .cmt-detail-info-stars .cmt-detail-info-receive {
		font-size: 15px;
		display: inline-block;
		vertical-align: middle;
	}
	#store-comment .cmt-detail-info-right-cell {
		float: right;
		display: inline-block;
		width: 28%;
		text-align: center;
		border-left: 1px solid #D8D8D8;
	}
	#store-comment .cmt-detail-info-dvy {
		font-size: 32px;
		color: #999;
	}
	#store-comment .cmt-detail-info-right-cell .cmt-detail-info-desc {
		color: #999;
	}
	#store-comment .cmt-detail-info-desc {
		line-height: 22px;
		font-size: 12px;
		color: #656565;
	}
	#store-comment .evaluates-field {
		background-color: #fff;
		box-flex: 1;
		-moz-box-flex: 1;
		-webkit-box-flex: 1;
		-ms-flex: 1 0 auto;
		margin-top: 10px;
	}
	#store-comment .evaluate-item {
		padding: 15px 15px 12px 15px;
		border-bottom: 1px solid #f0f0f0;
	}
	#store-comment .evaluate-sub {
		line-height: 15px;
	}
	#store-comment .evaluate-sub-left {
		float: left;
		width: 15%;
		display: inline-block;
	}
	#store-comment .evaluate-user-pic {
		width: 40px;
		height: 40px;
		border-radius: 50%;
	}
	#store-comment .evaluate-sub-right {
		float: left;
		width: 85%;
		display: inline-block;
	}
	#store-comment .evaluate-sub {
		line-height: 15px;
	}
	#store-comment .evaluate-name {
		color: #2f2f2f;
		font-size: 16px;
		display: inline-block;
	}
	#store-comment .evaluate-time {
		font-size: 12px;
		color: #898989;
		float: right;
		display: inline-block;
	}
	#store-comment .evaluate-stars {
		margin-top: 6px;
		margin-bottom: 5px;
	}
	#store-comment .evaluate-sub .appr-status {
		margin: 0;
		float: left;
		margin-right: 2px;
	}
	#store-comment .evaluate-ship-time {
		color: #898989;
		font-size: 12px;
		float: left;
		line-height: 12px;
		display: inline-block;
	}
	#store-comment .evaluate-comment {
		font-size: 14px;
		margin-top: 10px;
		margin-bottom: 6px;
	}
	#store-comment .comment-bottom {
		margin: 4px 0;
		font-size: 12px;
	}
	#store-comment .comment-favor-icon {
		width: 11px;
		height: 11px;
		margin-right: 5px;
		background: url(//xs01.meituan.net/waimai_i/img/sprite/favor.bb7dca4b.png) no-repeat;
		background-size: contain;
		display: inline-block;
	}
	#store-comment .comment-favor-text {
		color: #576B95;
		display: inline-block;
	}
	#store-comment .comment-tag-icon {
		width: 11px;
		height: 11px;
		margin-right: 5px;
		background: url(//xs01.meituan.net/waimai_i/img/sprite/tag.abccfd64.png) no-repeat;
		background-size: contain;
		display: inline-block;
	}
	#store-comment .comment-tag-text {
		color: #898989;
		display: inline-block;
	}
	#store-comment .comment-pics {
		float: left;
		margin-right: 5px;
		margin-bottom: 5px;
		width: 175px;
		height: 175px;
	}
	#store-comment .comment-pics img{
		width: 100%;
		height: 100%;
	}
	#store-comment .pic-multi .comment-pics {
		width: 80px;
		height: 80px;
	}
	#store-comment .replay{
		font-size: 14px;
		color: #898989;
		padding: 10px;
		background: #F4F4F4;
	}
	#store-comment .common-no-con{
		position: absolute;
		top: 425px;
		left: 0;
		right: 0;
		bottom: 0;
		width: 100%;
		text-align: center;
		color: #768491;
		font-size: 16px;
	}
	#store-comment .common-no-con p{
		margin-top: 10px;
	}
	#store-comment .common-no-con img{
		max-width: 25%;
		vertical-align: middle;
		border: none;
	}
</style>



// WEBPACK FOOTER //
// src/pages/store/comment.vue