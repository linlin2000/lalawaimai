<template>
	<div id="dowload-manager">
		<div class="content">
			<div class="dow-btn-warp">
				<div class="dow-btn">
					<div class="dow" @click="onShowClick"><van-icon name='down'></van-icon>下载商户客户端</div>
				</div>
			</div>
			<div class="abodytips" :class="{'is-show': show}" @click="onHideClick">
				<div class="tips_center">
					<img src="static/img/androidtips.png">
				</div>
				<div class="tips_bottom">
					<div class="tips_bottom_2" @click="onHideClick">
						<img src="static/img/zhi.png">
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				iosLink: '',
				androidLink: ''
			}
		},
		methods: {
			onShowClick() {
				if (this.util.isWeixin()) {
					this.show = true;
				}else{
					if(this.util.isIos()) {
						if (!this.iosLink) {
							this.util.$toast('下载地址不存在');
						}else{
							window.location.href = this.iosLink;
						}
					}else{
						window.location.href = this.androidLink;
					}
				}	
			},
			onHideClick() {
				this.show = false;
			}
		},
		mounted() {
			this.util.request({
				url: 'system/common/download/manager',
				method: 'POST',
			}).then((result) => {
				var result = result.data.message;
				if(result.errno) {
					this.util.$toast(result.message);
					return false;
				}
				result = result.message;
				this.iosLink = result.link_ios;
				this.androidLink = result.link_android;
			})
		}
	}
</script>

<style>
	#dowload-manager .content{
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		width: 100%;
		overflow-x: hidden;
		overflow-y: scroll;
		background: url(../../../../static/img/app-manager.png) no-repeat;
		background-size:100% 100%;
		text-align: center;
	}
	#dowload-manager .content::-webkit-scrollbar {
		display: none;
	}
	#dowload-manager .content .dow-btn-warp{
		position: absolute;
		bottom: 68px;
		width: 100%;
		margin: 0 auto;
	}
	#dowload-manager .content .dow-btn{
		display:inline-block;
		width:290px;
		height:49px;
		-webkit-border-radius:7px;
		-moz-border-radius:7px;
		border-radius:7px;
		background:#fff;
		-moz-box-shadow:2px 2px 5px #363636;
		-webkit-box-shadow:2px 2px 5px #363636;
		box-shadow:2px 2px 5px #363636;
	}
	#dowload-manager .content .dow-btn .dow{
		display: inline-block;
		height: 49px;
		line-height: 49px;
		color: #44abf6;
		font-size: 15px;
	}
	#dowload-manager .content .dow-btn .dow .van-icon{
		font-size: 18px;
		padding-right: 5px;
	}
	#dowload-manager .content .abodytips{
		display: none;
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		background: url(../../../../static/img/alltips.png);
		background-size: 100% 100%;
		z-index: 10;
		cursor: pointer;
	}
	#dowload-manager .content .abodytips.is-show{
		display: block;
	}
	#dowload-manager .content .abodytips .tips_center{
		width: 86%;
		margin: 0 auto;
		margin-top: 20%;
		margin-bottom: 6%;
	}
	#dowload-manager .content .abodytips .tips_center img{
		width: 100%;
	}
	#dowload-manager .content .abodytips .tips_bottom{
		position: absolute;
		width: 100%;
	}
	#dowload-manager .content .abodytips .tips_bottom .tips_bottom_2{
		width: 36%;
		margin-left: 32%;
	}
	#dowload-manager .content .abodytips .tips_bottom .tips_bottom_2 img{
		width: 100%;
	}
</style>


// WEBPACK FOOTER //
// src/pages/public/dowload/appManager.vue