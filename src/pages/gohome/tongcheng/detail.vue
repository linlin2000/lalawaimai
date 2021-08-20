<template>
	<div id="tongcheng-detail">
		<public-header title="同城信息"></public-header>
		<div class="content">
			<div class="detail">
				<div class="userinfo flex-lr">
					<div class="left">
						<div class="avatar">
							<img class="img-100" :src="detail.ft_avatar" alt="">
						</div>
					</div>
					<div class="right flex-lr">
						<ul>
							<li class="flex">
								<span class="tag-top" v-if="detail.is_stick == 1">置顶</span>
								<span class="tag-cate" v-if="detail.category">{{detail.category.title}}</span>
								<span class="nickname ellipsis">{{detail.nickname}}</span>
							</li>
							<li class="c-gray font-12 margin-5-t">
								{{detail.addtime_cn}}发布
							</li>
						</ul>
						<div class="icon icon-phone2 c-danger font-20" v-if="detail.mobile" @click="util.jsTel(detail.mobile)"></div>
					</div>
				</div>
				<li class="tags flex">
					<div class="tag-item" v-for="(tag, index) in detail.keyword" :key="'t' + index">{{tag}}</div>
				</li>
				<div class="tiezi-info">
					<div class="text" v-html="detail.content"></div>
					<ul class="thumbs">
						<li class="thumb-item" v-for="(img, index) in detail.thumbs" :key="'i' + index" @click="util.jsPreviewImage(detail.thumbs, index)" >
							<img :src="img" alt="">
						</li>
					</ul>
				</div>
				<ul class="flex font-13 c-gray margin-10-t">
					<li class="flex margin-10-r">
						<i class="icon icon-attention font-15"></i>
						<span>{{detail.looknum}}</span>
					</li>
					<li class="flex margin-10-r" @click="onLike()">
						<i class="icon icon-appreciate_light font-14"></i>
						<span>{{detail.likenum}}</span>
					</li>
				</ul>
				<div class="zan-wrap">
					<div class="zan-total">
						<span>{{detail.likenum}}</span>
						<span>赞</span>
					</div>
					<div class="avatar" v-for="(item, index) in detail.like_avatar" :key="'a' + index">
						<img class="img-100" :src="item" alt="">
					</div>
				</div>
			</div>
			<div class="comment bg-default margin-10-t">
				<div class="comment-title flex-lr van-hairline--bottom">
					<span class="c-gray">评论</span>
					<span class="c-danger" @click="onComment('comment', id)">我要评论</span>
				</div>
				<ul class="comment-list" v-if="comments && comments.length > 0">
					<li class="comment-item van-hairline--bottom" v-for="(item, index1) in comments" :key="'c' + index1">
						<div class="userinfo flex-lr">
							<div class="left">
								<div class="avatar">
									<img class="img-100" :src="item.avatar" alt="">
								</div>
							</div>
							<div class="right flex-lr">
								<ul>
									<li class="flex">
										<span class="nickname ellipsis">{{item.nickname}}</span>
									</li>
									<li class="c-gray font-12 margin-5-t">
										{{item.addtime_cn}}
									</li>
								</ul>
								<span class="c-info font-14" @click="onComment('reply', item.id, item.uid, item.nickname)">回复</span>
							</div>
						</div>
						<div class="comment-inner">
							<div class="text">{{item.content}}</div>
							<div class="reply-list" v-if="item.reply && item.reply.length > 0">
								<div class="reply-item " :class="{'van-hairline--bottom': rindex < item.reply.length - 1}" v-for="(replyItem, rindex) in item.reply" :key="'r' + index">
									<div class="userinfo flex-lr">
										<div class="left" v-if="0">
											<div class="avatar">
												<img class="img-100" src="" alt="">
											</div>
										</div>
										<div class="right flex-lr">
											<ul>
												<li class="flex">
													<span class="nickname ellipsis" @click="onComment('reply', item.id, replyItem.from_uid, replyItem.from_nickname)">{{replyItem.from_nickname}}</span>
													<span class="c-gray margin-5-l">回复</span>
													<span class="nickname ellipsis margin-5-l" @click="onComment('reply', item.id, replyItem.to_uid, replyItem.to_nickname)">{{replyItem.to_nickname}}</span>
												</li>
												<li class="c-gray font-12 margin-5-t">
													{{replyItem.addtime_cn}}
												</li>
											</ul>
											<span class="c-info font-14" v-if="0">回复</span>
										</div>
									</div>
									<div class="comment-inner">
										<div class="text">{{replyItem.content}}</div>
									</div>
								</div>
							</div>
						</div>
					</li>
				</ul>
				<div class="padding-15-tb font-14 c-gray text-center" v-else>暂无任何评论~</div>
			</div>
		</div>

		<van-dialog
			v-model="commentShow"
			show-cancel-button
			confirm-button-text='发表'
			@confirm="onCommentSubmit"
			@cancel="commentShow = false"
		>	
			<van-field
				:placeholder="comment.title"
				input-align="center"
				readonly
			/>
			<van-field
				v-model="comment.content"
				type='textarea'
				:placeholder="comment.placeholder"
				minHeight="100px"
			/>
		</van-dialog>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader
		},
		data() {
			return {
				detail: {},
				showPreLoading: true,
				commentShow: false,
				comment: {
					title: '评论',
					placeholder: '说点什么...',
					content: '',
					type: '',
					id: 0,
					to_uid: 0,
				},
				comments: []
			}
		},
		methods: {
			onLoad(){
				var that = this;
				getData({
					vue: that,
					url: 'tongcheng/index/detail',
					data: {
						id: that.id,
						trade_id: that.trade_id
					},
					success: function(res) {
						that.detail = res.detail;
						that.id = that.detail.id;
						that.comments = res.comments;
					}
				})
			},
			onPullDownRefresh() {
				this.onLoad(true);
			},
			onToggleCommentShow() {
				this.commentShow = !this.commentShow;
			},
			onComment(type, id, uid, username) {
				this.comment.type = type;
				this.comment.id = id;
				this.comment.to_uid = uid;
				this.comment.title = '评论';
				this.comment.placeholder = '说点什么...';
				if(type == 'reply') {
					this.comment.title = '回复';
					this.comment.placeholder = '回复' + username;
				}
				this.onToggleCommentShow();
			},
			onCommentSubmit() {
				var that = this;
				if(!that.comment.content) {
					that.util.$toast('你好像什么也没说', '', 1000);
					return false;
				}
				var url = 'tongcheng/index/comment';
				if(that.comment.type == 'reply') {
					var url = 'tongcheng/index/reply';
				}
				setData({
					vue: that,
					url: url,
					data: {
						id: that.comment.id,
						tid: that.id,
						to_uid: that.comment.to_uid,
						content: that.comment.content,
					},
					message: that.comment.type == 'reply' ? '回复成功' : '评论成功',
				})
			},
			onLike() {
				var that = this;
				setData({
					vue: that,
					url: 'tongcheng/index/like',
					data: {
						id: that.id
					},
					message: '点赞成功'
				})
			}
		},
		created() {
			if(this.$route.query) {
				if(this.$route.query.id > 0) {
					this.id = this.$route.query.id;
				} else if(this.$route.query.trade_id > 0) {
					this.trade_id = this.$route.query.trade_id;
				}
			}
		},
		mounted() {
			this.onLoad();
		},
	}
</script>

<style>
	#tongcheng-detail .detail{
		padding: 10px;
		background-color: #fff;
		font-size: 14px;
	}
	#tongcheng-detail .left{
		width: 40px;
	}
	#tongcheng-detail .right{
		flex: 1;
		padding-left: 10px;
	}
	#tongcheng-detail .avatar{
		width: 40px;
		height: 40px;
		font-size: 0px;
	}
	#tongcheng-detail .avatar img{
		border-radius: 50px;
	}
	#tongcheng-detail .detail .tag-top{
		background-color: #ff2d4b;
		color: #fff;
		font-size: 10px;
		padding: 3px 5px;
		border-radius: 3px;
		margin-right: 5px;
	}
	#tongcheng-detail .detail .tag-cate{
		background-color: #FFE0E5;
		color: #ff2d4b;
		font-size: 10px;
		padding: 3px 10px;
		border-radius: 3px;
		margin-right: 5px;
	}
	#tongcheng-detail .detail .nickname{
		max-width: 100px;
	}
	#tongcheng-detail .detail .tags{
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		justify-content: flex-start;
		margin: 0px -5px -5px;
		padding-top: 5px;
	}
	#tongcheng-detail .detail .tags .tag-item{
		font-size: 10px;
		color: #ff2d4b;
		border: 1px solid #ff2d4b;
		padding: 3px 5px;
		border-radius: 3px;
		margin: 5px;
	}
	#tongcheng-detail .detail .tiezi-info .text{
		line-height: 1.5;
		margin: 7px 0;
	}
	#tongcheng-detail .detail .thumbs .thumb-item{
		font-size: 0px;
		width: 100%;
		padding-bottom: 10px;
	}
	#tongcheng-detail .detail .thumbs .thumb-item:last-child{
		padding-bottom: 0px;
	}
	#tongcheng-detail .detail .thumbs .thumb-item img{
		width: 100%;
	}
	#tongcheng-detail .detail .zan-wrap{
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		align-items: center;
		padding: 10px 10px 5px;
		margin-top: 10px;
		background-color: #f5f5f5;
		border-radius: 3px;
	}
	#tongcheng-detail .detail .zan-wrap .zan-total{
		display: flex;
		flex-flow: column nowrap;
		align-items: center;
		justify-content: center;
		font-size: 10px;
		background-color: #E6E5E5;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		color: #999;
		margin-right: 5px;
		margin-bottom: 5px;
	}
	#tongcheng-detail .detail .zan-wrap .avatar{
		width: 32px;
		height: 32px;
		font-size: 0px;
		margin-right: 5px;
		margin-bottom: 5px;
	}
	#tongcheng-detail .comment .comment-title{
		padding: 15px 10px;
		font-size: 14px;
		position: relative;
	}
	#tongcheng-detail .comment .comment-title:before{
		content: '';
		position: absolute;
		left: 0;
		top: 10px;
		bottom: 10px;
		width: 0px;
		border: 2px solid #ff2d4b;
	}
	#tongcheng-detail .comment .comment-item{
		padding: 10px;
		font-size: 14px;
	}
	#tongcheng-detail .comment .comment-item .comment-inner{
		padding-left: 50px;
	}
	#tongcheng-detail .comment .comment-item .comment-inner .text{
		line-height: 1.4;
		padding: 7px 0;
	}
	#tongcheng-detail .comment .comment-item .comment-inner .reply-list{
		padding: 0 10px 10px;
		background-color: #f5f5f5;
		border-radius: 3px;
		font-size: 13px;
	}
	#tongcheng-detail .comment .comment-item .comment-inner .reply-list .reply-item{
		padding-top: 10px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/tongcheng/detail.vue