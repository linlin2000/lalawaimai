<template>
	<div id="imessage">
		<div class="content" :class="message.type">
			<div class="icon-area">
				<i class="icon icon-icon"></i>
			</div>
			<div class="text-area">
				<p class="msg-title">{{message.message}}</p>
				<p class="desc" v-if="message.description">{{message.description}}</p>
			</div>
			<div class="btn-area">
				<p>
					<router-link tag="div" :to="message.redirect ? message.redirect : ''" class="button">
						<template v-if="message.btnText">
							{{message.btnText}}
						</template>
						<template v-else>
							确定
						</template>
					</router-link>
				</p>
			</div>
			<div class="extra-area">
				<router-link :to="util.getUrl({path: '/pages/home/index'})" >返回首页</router-link>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			message: {
				type: Object,
				default() {
					return {
						type: 'error',
						message: '提示信息',
						description: '描述信息',
						redirect: '/pages/home/index',
						btnText: '确定',
					}
				}
			}
		}
	}
</script>

<style scoped>
	#imessage{
		position: fixed;
		z-index: 1000000;
		background-color: #fff;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
	}
	#imessage .content{
		background-color: #fff;
		text-align: center;
		padding: 0 30px;
	}
	#imessage .content .icon-area{
		padding: 35px 0;
	}
	#imessage .content.error .icon-icon:before{
		font-size: 104px;
		color: #f76260;
		content: "\e61a";
	}
	#imessage .content.info .icon-icon:before {
		font-size: 104px;
		color: #10aeff;
		content: "\e61c";
	}
	#imessage .content.success .icon-icon:before {
		font-size: 104px;
		color: #09BB07;
		content: "\e619";
	}
	#imessage .content .text-area{
		padding: 0 20px;
		margin-bottom: 25px;
		line-height: 1.5;
	}
	#imessage .content .text-area .msg-title {
		margin-bottom: 5px;
		font-weight: 400;
		font-size: 20px;
		margin-top: 0;
	}
	#imessage .content .text-area .desc {
		font-size: 14px;
		color: #888;
	}
	#imessage .content .btn-area .button{
		height:42px;
		line-height: 42px;
		background: #f7f7f7;
		border-radius: 5px;
	}
	#imessage .content.success .btn-area .button{
		background: #09BB07;
		color: #fff;
		border-color: #09BB07;
	}
	#imessage .content.info .btn-area .button{
		background: #10aeff;
		color: #fff;
		border-color: #10aeff;
	}
	#imessage .content.error .btn-area .button{
		background: #f76260;
		color: #fff;
		border-color: #f76260;
	}
	#imessage .content .extra-area{
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		text-align: center;
		margin-bottom: 15px;
		line-height: 1.5;
	}
	#imessage .content .extra-area a{
		color: #61749B;
		font-size: 14px;
	}
	/*.message{background: #fff;}*/
	/*.message .container{padding:0 1.5rem ;text-align: center;}*/
	/*.message .container .icon-area{margin-top: 1rem;}*/
	/*.message .container.success .icon-icon:before {font-size: 104px;color: #09BB07; content: "\e619";}*/
	/*.message .container.info .icon-icon:before {font-size: 104px;color: #10aeff; content: "\e61c";}*/
	/*.message .container.error .icon-icon:before {font-size: 104px;color: #f76260; content: "\e61a";}*/
	/*.message .container .text-area{margin-bottom: 25px;padding: 0 20px;}*/
	/*.message .container .text-area .msg-title {margin-bottom: 5px;font-weight: 400;font-size: 20px;margin-top: 0;}*/
	/*.message .container .text-area .desc {font-size: 14px;color: #888;}*/
	/*.message .container .text-area .desc > h3{margin: 0; font-size: 25px}*/
	/*.message .container .btn-area {margin-bottom: 25px;}*/
	/*.message .container .btn-area .button{margin-bottom: .75rem;height: 2.1rem;line-height: 2.1rem;background: #f7f7f7;}*/
	/*.message .container.success .btn-area .button{background: #09BB07;color: #fff;border-color: #09BB07;}*/
	/*.message .container.info .btn-area .button{background: #10aeff;color: #fff;border-color: #10aeff;}*/
	/*.message .container.error .btn-area .button{background: #f76260;color: #fff;border-color: #f76260;}*/
	/*.message .container .extra-area{position: fixed;left: 0;bottom: 0;width: 100%;text-align: center;margin-bottom: .75rem;}*/
	/*.message .container .extra-area a{color: #61749B;font-size: .7rem;}*/
</style>


// WEBPACK FOOTER //
// src/components/imessage.vue