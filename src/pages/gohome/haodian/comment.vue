<template>
	<div id="haodian-comment">
		<public-header title="好店评价"></public-header>
		<div class="content">
			<div class="margin-15 bg-default padding-15-lr radius-3">
				<div class="padding-15-tb van-hairline--bottom flex-lr">
					<div class="avatar-wrap" >
						<img :src="store.logo" alt="">
					</div>
					<div class="basic-info ellipsis font-15 font-500">{{store.title}}</div>
				</div>
				<div class="text-center padding-5-b">
					<van-rate
						v-model="haodianStar"
						:size="25"
						:count="5"
						color="#FFD160"
						class="margin-10-b"
					/>
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
		<transition name="van-fade">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import Uploader from '@/components/uploader'
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		data() {
			return {
				sid: 0,
				store: {
					title: '',
					logo: ''
				},
				haodianStar: 5,
				note: '',
				thumbs: [],
				islegal: true,
				showPreLoading: true
			}
		},
		components: {
			PublicHeader,
			Uploader
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'haodian/comment/index',
					data: {
						sid: that.sid
					},
					autoAssign: true,
					variable: 'store',
				})
			},
			onSubmit() {
				var that = this;
				if(!that.note) {
					that.util.$toast('评论内容不能为空');
					return false;
				}
				let params = {
					sid : that.sid,
					note: that.note,
					haodianStar: that.haodianStar,
					thumbs: that.thumbs,
				}
				setData({
					vue: that,
					url: 'haodian/comment/post',
					data: params,
					message: '评论成功',
					redirect: that.util.getUrl({path: '/gohome/pages/haodian/detail', query:{sid: that.sid}})
				})
			},
			onGetImgsUrl(value) {
				this.thumbs = value;
			},
		},
		mounted () {
			if(this.$route.query && this.$route.query.sid) {
				this.sid = this.$route.query.sid;
			}
			this.onLoad();
		}
	}
</script>

<style>
	#haodian-comment .avatar-wrap{
		width: 40px;
		height: 40px;
		font-size: 0px;
		border-radius: 50%;
		border: 1px solid #eee;
	}
	#haodian-comment .avatar-wrap img{
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	#haodian-comment .basic-info{
		flex: 1;
		padding-left: 10px;
	}
	#haodian-comment .basic-info .delivery-title{
		margin-left: 10px;
		padding: 3px 8px;
		background-color: #ff2d4b;
		color: #fff;
		font-size: 12px;
		border-radius: 10px 0 10px 0;
	}
	#haodian-comment .rate-tip{
		padding-top: 20px;
		text-align: center;
	}
	#haodian-comment .van-rate{
		padding-top: 20px;
	}
	#haodian-comment .tags{
		padding: 5px 0;
		margin: 0 -5px;
	}
	#haodian-comment .tag-item{
		border-radius: 3px;
		border: 1px solid #eee;
		margin: 5px 0;
		padding: 8px 0;
		font-size: 12px;
	}
	#haodian-comment .tag-item.active{
		border-color: #ff2d4b;
		color: #ff2d4b;
	}
	#haodian-comment .comment-text{
		background-color: #f5f5f5;
		font-size: 14px;
	}
	#haodian-comment .uploader-wrap{
		position: relative;
		margin-top: 15px;
		padding-bottom: 5px;
	}
	#haodian-comment .uploader-wrap #uploader{
		padding: 0px;
	}
	#haodian-comment .uploader-wrap .icon{
		color: #7a7a7a;
		font-size: 28px;
	}
	#haodian-comment .upload-tips{
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
// src/pages/gohome/haodian/comment.vue