<template>
	<div id="complain-index">
		<div class="content">
			<template v-if="!status">
				<div class="tips">请选择投诉该网页的原因:</div>
				<van-cell-group>
					<van-cell :title="item.title" @click="onChooseOption(item.type)" is-link v-for="(item, index) in options" :key="index" />
				</van-cell-group>
				<div class="tips info" @click="util.jsUrl('https://mp.weixin.qq.com/s/TbX1CcZhQNReneXVc3At9Q')">遇到网页流量被劫持怎么办</div>
				<div class="complain-help">
					<div class="help" @click="util.jsUrl('https://weixin110.qq.com/security/readtemplate?t=w_security_center_website/report_agreement&lang=zh_CN')">投诉须知</div>
				</div>
			</template>
			<template v-else-if="status == 1">
				<div class="tips">你可以:</div>
				<van-cell-group>
					<van-cell title="交给微信团队审核" is-link @click="onSubmit" />
				</van-cell-group>
				<template v-if="type == 'induce'">
					<div class="tips info" @click="util.jsUrl('https://mp.weixin.qq.com/s/LJkN77dgg2A9C8GepUGdeA')">了解什么是诱导分享类内容</div>
				</template>
				<template v-else-if="type == 'rumor'">
					<div class="tips info" @click="util.jsUrl('https://mp.weixin.qq.com/s/w2VEz97HTsYTNALskHlSIQ')">了解微信对谣言的治理</div>
				</template>
				<div class="complain-help">
					<div class="help" @click="util.jsUrl('https://weixin110.qq.com/security/readtemplate?t=w_security_center_website/report_agreement&lang=zh_CN')">投诉须知</div>
				</div>
			</template>
			<template v-else-if="status == 2">
				<div class="imessage success">
					<div class="icon-area">
						<i class="icon icon-icon"></i>
					</div>
					<div class="text-area">
						<p class="msg-title">投诉已提交</p>
						<p class="desc">微信团队会尽快核实，并通过"微信团队"通知你审核结果。感谢你的支持</p>
					</div>
					<div class="btn-area">
						<div class="button" @click="util.jsUrl('close')">
							关闭
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import {setData} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader
		},
		data() {
			return {
				status: 0,
				type: '',
				complainUrl: '',
				options: [
					{
						type: 'cheat',
						title: '网页包含欺诈信息（如：假红包）',
					},
					{
						type: 'eroticism',
						title: '网页包含欺色情信息',
					},
					{
						type: 'violence',
						title: '网页包含欺暴力恐怖信息',
					},
					{
						type: 'politics',
						title: '网页包含欺政治敏感信息',
					},
					{
						type: 'privacy',
						title: '网页在手机个人隐私信息（如：钓鱼链接）',
					},
					{
						type: 'induce',
						title: '网页包含诱导分享/关注性质的内容',
					},
					{
						type: 'rumor',
						title: '网页可能包含谣言信息',
					},
					{
						type: 'gamble',
						title: '网页包含赌博信息',
					},
				]
			}
		},
		methods: {
			onChooseOption(type){
				if(!type) {
					return;
				}
				this.type = type;
				this.$router.push(this.util.getUrl({path: '/gohome/pages/complain/index', query: {type: type, status: 1}}));
			},
			onSubmit() {
				var that = this;
				if(!that.type || !that.complainUrl) {
					return;
				}
				setData({
					vue: that,
					url: 'gohome/complain/post',
					data: {
						type: that.type,
						link: this.complainUrl
					},
					success: (res) => {
						this.$router.push(this.util.getUrl({path: '/gohome/pages/complain/index', query: {status: 2}}));
					}
				})
			},
			onClose() {
				window.location.href = this.complainUrl;
			}
		},
		mounted() {
			if(this.$route.query && this.$route.query.status) {
				this.status = this.$route.query.status;
			}
			if(this.$route.query && this.$route.query.type) {
				this.type = this.$route.query.type;
			}
			this.complainUrl = this.util.getStorage('complainUrl');
			if(!this.util.isWeixin()) {
				this.$router.push(this.util.getUrl({path: '/pages/home/index'}));
				return;
			}
		},
		watch: {
			// 对路由变化作出响应...
			'$route' (to, from) {
				if(this.$route.query && this.$route.query.status) {
					this.status = this.$route.query.status;
				} else {
					this.status = 0;
				}
				if(this.$route.query && this.$route.query.type) {
					this.type = this.$route.query.type;
				}
			}
		},
	}
</script>

<style>
	#complain-index .content{
		background-color: #f0eff4;
	}
	#complain-index .content .tips{
		padding: 10px 15px;
		font-size: 14px;
		color: #999;
	}
	#complain-index .content .tips.info{
		color: #5e7088;
	}
	#complain-index .content .van-cell__title{
		font-size: 16px;
	}
	#complain-index .content .van-icon{
		color: #C8C8CD;
	}
	#complain-index .content .complain-help{
		position: fixed;
		bottom: 10px;
		width: 100%;
		color: #1276D8;
		font-size: 14px;
	}
	#complain-index .content .complain-help .help{
		text-align: center;
		color: #5e7088;
	}
	#complain-index .imessage{
		position: fixed;
		z-index: 1000000;
		background-color: #fff;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	#complain-index .imessage{
		background-color: #fff;
		text-align: center;
		padding: 0 15px;
	}
	#complain-index .imessage .icon-area{
		padding: 30px 0 20px;
	}
	#complain-index .imessage.success .icon-icon:before {
		font-size: 104px;
		color: #09BB07;
		content: "\e619";
	}
	#complain-index .imessage .text-area{
		margin-bottom: 25px;
		line-height: 1.5;
	}
	#complain-index .imessage .text-area .msg-title {
		margin-bottom: 5px;
		font-weight: 400;
		font-size: 20px;
		margin-top: 0;
	}
	#complain-index .imessage .text-area .desc {
		font-size: 14px;
		color: #888;
	}
	#complain-index .imessage .btn-area .button{
		height:42px;
		line-height: 42px;
		background: #f7f7f7;
		border-radius: 5px;
	}
	#complain-index .imessage.success .btn-area .button{
		background: #09BB07;
		color: #fff;
		border-color: #FB2D37;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/complain/index.vue