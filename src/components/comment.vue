<template>
	<div id="comment">
		<div class="margin-10-t padding-15-l bg-default">
			<div class="flex-lr padding-15-tb padding-15-r font-14 van-hairline--bottom">
				<div class="font-14">用户评价</div>
			</div>
			<template  v-if="comment.length > 0">
				<div class="padding-15-tb padding-15-r van-hairline--bottom" v-for="(item, index) in comment" :key="item.id">
					<div class="consumer-info flex-lr">
						<div class="avatar">
							<img class="img-100" :src="item.avatar" alt="">
						</div>
						<div class="basic flex-lr">
							<div>
								<div class="font-14">{{item.nickname}}</div>
								<div class="c-gray font-12 margin-5-t">{{item.addtime_cn}}</div>
							</div>
							<van-rate v-model="item.goods_quality" :size="13" disabled-color="#ff2d4b" disabled/>
						</div>
					</div>
					<div class="comment-item">
						<div class="text">{{item.note}}</div>
						<div class="comment-tags margin-5-t" v-if="item.tag_goods && item.tag_goods.length > 0">
							<div class="icon icon-tag margin-5-r font-13"></div>
							<div class="tags-wrap font-13 c-gray">
								<div class="tag-item margin-5-r" v-for="(tag, index) in item.tag_goods" :key="tag.id">{{tag.title}}</div>
							</div>
						</div>
						<van-row class="thumbs margin-10-t" gutter="10" v-if="item.thumbs.length > 0 ">
							<van-col span="6" v-for="(img, index) in item.thumbs" :key="img.id" v-if="index < 4">
								<div @click="util.jsPreviewImage(item.thumbs)">
									<img class="w-100" :src="img" alt="">
								</div>
							</van-col>
							<div class="thumbs-num">共{{item.thumbs.length}}张</div>
						</van-row>
						<div class="text-right margin-10-t c-gray hide">
							<i class="icon icon-appreciate  font-18 "></i>
							<span class="margin-5-r font-14">5</span>
							<i class="icon icon-message c-gray font-18"></i>
							<span class="font-14">2</span>
						</div>
					</div>
				</div>
			</template>
			<template v-else>
				<div class="no-comment">暂时没有商品评价</div>
			</template>
		</div>
		<div class="padding-15-tb text-center font-14 bg-default" @click="onChangeComment" v-if="comment.length > 0">查看更多评价</div>
	</div>
</template>

<script>
	export default {
		name: 'Comment',
		props:{
			comment: {
				type: Array,
				default() {
					return []
				}
			}
		},
		data(){
			return{

			}
		},
		methods: {
			onChangeComment(){
				this.$emit('onLoadingComment');
			}
		}
	}
</script>

<style scoped>
	#comment .avatar img{
		width: 50px;
		height: 50px;
		border-radius: 50%;
	}
	#comment .basic{
		padding-left: 10px;
		flex: 1;
	}
	#comment .comment-item{
		margin-left: 60px;
	}
	#comment .comment-item .text{
		font-size: 13px;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 4;
		overflow: hidden;
	}
	#comment .comment-item .thumbs img{
		height: 60px;
		border-radius: 3px;
	}
	#comment .comment-item .thumbs{
		position: relative;
	}
	#comment .comment-item .thumbs .van-col{
		font-size: 0px;
	}
	#comment .comment-item .thumbs-num{
		position: absolute;
		right: 5px;
		bottom: 0;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.5);
		font-size: 10px;
		padding: 2px 5px;
	}
	#comment .comment-item .comment-tags{
		display: flex;
		flex-flow: row nowrap;
		align-items: flex-start;
	}
	#comment .comment-item .comment-tags .icon-tag{
		margin-top: 3px;
	}
	#comment .comment-item .tags-wrap{
		display: flex;
		flex-flow: row wrap;
		align-items: center;
		line-height: 1.3;
	}
	#comment .no-comment{
		padding: 20px 15px 20px 0;
		text-align: center;
		background-color: #fff;
		color: #999;
		font-size: 14px;
	}
</style>



// WEBPACK FOOTER //
// src/components/comment.vue