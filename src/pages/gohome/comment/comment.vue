<template>
	<div id="gohome-comment">
		<public-header title="评价"></public-header>
		<div class="content font-14">
			<div class="margin-15 bg-default padding-15-lr radius-3 hide">
				<div class="padding-15-tb van-hairline--bottom flex-lr" >
					<div class="avatar-wrap">
						<img src="https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIjAzMVguDJpArLuW1iaqzEvCGao9iatS7lco9JnicH8nPpgRN6jFncBicp5FDodRYUlVCPZKwn02llrQ/132" alt="">
					</div>
					<div class="basic-info">
						<div class="flex-lr">
							<div class="flex">
								<span class="font-500 font-15">张三</span>
								<span class="delivery-title">啦啦专送</span>
							</div>
							<div class="c-gray font-13">评价对骑手匿名</div>
						</div>
						<div class="margin-5-t font-13">2018-11-16 19:55 送达</div>
					</div>
				</div>
				<div class="text-center padding-5-b">
					<p class="rate-tip">给配送员打个分吧</p>
					<van-rate
						v-model="deliveryerStar"
						:size="25"
						:count="5"
						color="#FFD160"
						class="margin-10-b"
					/>
					<van-row class="tags" gutter="10">
						<van-col span="8" >
							<div class="tag-item active">风雨无阻</div>
						</van-col>
						<van-col span="8">
							<div class="tag-item">热情礼貌</div>
						</van-col>
						<van-col span="8">
							<div class="tag-item">穿工作服</div>
						</van-col>
						<van-col span="8">
							<div class="tag-item">快速准时</div>
						</van-col>
						<van-col span="8">
							<div class="tag-item">仪表整洁</div>
						</van-col>
						<van-col span="8">
							<div class="tag-item">货品完好</div>
						</van-col>
					</van-row>
				</div>
			</div>
			<div class="margin-15 bg-default padding-15-lr radius-3">
				<div class="padding-15-tb van-hairline--bottom flex-lr">
					<div class="avatar-wrap" >
						<img :src="order.goods.thumb" alt="">
					</div>
					<div class="basic-info ellipsis font-15 font-500">{{order.goods.name}}</div>
				</div>
				<div class="text-center padding-5-b">
					<p class="rate-tip" v-if="tagsSelected.title">"{{tagsSelected.title}}"</p>
					<van-rate
						v-model="goods_quality"
						:size="25"
						:count="5"
						color="#FFD160"
						class="margin-10-b"
						@change="onRateChange"
					/>
					<van-row class="tags" gutter="10" v-if="tagsSelected.tags.length > 0">
						<van-col span="8" v-for="(item, index) in tagsSelected.tags" :key="index">
							<div class="tag-item" :class="{active: item.active == 1}" @click="onToggleTag(index)">{{item.title}}</div>
						</van-col>
					</van-row>
				</div>
				<van-field
					v-model="note"
					type="textarea"
					placeholder="来点评一下吧，让更多小伙伴了解！"
					rows="4"
					class="comment-text border-0px"
				/>
				<div class="uploader-wrap">
					<uploader @onGetUrl="onGetImgsUrl" :max="6"></uploader>
					<ul class="upload-tips" v-if="!thumbs.length">
						<li class="font-15">上传图片</li>
						<li class="font-12 c-gray margin-10-t">内容丰富的评价有机会成为优质评价哦</li>
					</ul>
				</div>
			</div>
			<div class="margin-15">
				<van-button size="normal" class="bg-danger font-16" block :disabled="!islegal" @click="onSubmit">提交</van-button>
			</div>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import Uploader from '@/components/uploader'
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
			Uploader
		},
		data() {
			return {
				deliveryerStar: 0,
				goods_quality: 0,
				note: '',
				thumbs: [],
				order_id: 0,
				order: {
					goods: {
						thumb: '',
						name: ''
					}
				},
				goods_tags: {},
				tagsSelected: {
					title: '',
					tags: []
				},
				islegal: false
			}
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'gohome/comment/comment',
					data: {
						order_id: that.order_id
					},
					autoAssign: true,
					variable: 'order',
					success: (res) => {
						that.islegal = true;
						that.goods_tags = res.goods_tags;
					}
				})
			},
			onGetImgsUrl(value) {
				this.thumbs = value;
			},
			onRateChange(value) {
				this.tagsSelected.title = this.goods_tags[value].title;
				this.tagsSelected.tags = [];
				this.tagsSelected.tags = [...this.goods_tags[value].tags];
			},
			onToggleTag(index) {
				this.tagsSelected.tags[index].active = !this.tagsSelected.tags[index].active + 0;
			},
			onSubmit() {
				var that = this;
				if(!that.goods_quality) {
					that.util.$toast('请对商品质量进行评分');
					return;
				}
				let params = {
					order_id: that.order_id,
					note: that.note,
					goods_quality: that.goods_quality,
					thumbs: that.thumbs,
					tags: that.tagsSelected.tags
				}
				setData({
					vue: that,
					url: 'gohome/comment/comment',
					data: params,
					message: '评论成功',
					redirect: that.util.getUrl({path: '/gohome/pages/order/index'})
				})
			}
		},
		mounted() {
			if(this.$route.query && this.$route.query.order_id) {
				this.order_id = this.$route.query.order_id;
			}
			this.onLoad();
		}
	}
</script>

<style>
	#gohome-comment .avatar-wrap{
		width: 40px;
		height: 40px;
		font-size: 0px;
		border-radius: 50%;
		border: 1px solid #eee;
	}
	#gohome-comment .avatar-wrap img{
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	#gohome-comment .basic-info{
		flex: 1;
		padding-left: 10px;
	}
	#gohome-comment .basic-info .delivery-title{
		margin-left: 10px;
		padding: 3px 8px;
		background-color: #ff2d4b;
		color: #fff;
		font-size: 12px;
		border-radius: 10px 0 10px 0;
	}
	#gohome-comment .rate-tip{
		padding-top: 20px;
		text-align: center;
	}
	#gohome-comment .van-rate{
		padding-top: 20px;
	}
	#gohome-comment .tags{
		padding: 5px 0;
		margin: 0 -5px;
	}
	#gohome-comment .tag-item{
		border-radius: 3px;
		border: 1px solid #eee;
		margin: 5px 0;
		padding: 8px 0;
		font-size: 12px;
	}
	#gohome-comment .tag-item.active{
		border-color: #ff2d4b;
		color: #ff2d4b;
	}
	#gohome-comment .comment-text{
		background-color: #f5f5f5;
		font-size: 14px;
	}
	#gohome-comment .uploader-wrap{
		position: relative;
		margin-top: 15px;
		padding-bottom: 5px;
	}
	#gohome-comment .uploader-wrap #uploader{
		padding: 0px;
	}
	#gohome-comment .uploader-wrap .icon{
		color: #7a7a7a;
		font-size: 28px;
	}
	#gohome-comment .upload-tips{
		position: absolute;
		width: 74%;
		top: 0px;
		right: 0px;
		bottom: 15px;
		display: flex;
		flex-flow: column nowrap;
		align-items: flex-start;
		justify-content: center;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/comment/comment.vue