<template>
	<div id="uploader">
		<van-row gutter="10" class="weui-uploader__files">
			<van-col span="6" v-for="(image, index) of value" :key="index">
				<div class="weui-uploader__file" :style="{backgroundImage:'url(' + image.url + ')'}">
					<i class="icon icon-close" @click="onDel(index)"></i>
				</div>
			</van-col>
			<van-col span="6" v-if="(max > 0 && value.length < max) || max <= 0" class="weui-uploader__input-box">
				<div class="weui-uploader__file">
					<input v-if="uploadOptions.type == 'h5'" class="weui-uploader__input" type="file" multiple="multiple" accept="image/*" @change="onUpload(-1, $event)">
					<van-icon name="camerafill"></van-icon>
				</div>
			</van-col>
		</van-row>
	</div>
</template>

<script>
	import axios from 'axios'
	export default {
		name: 'Uploader',
		props: {
			value: {
				type: Array,
				default: () => {return [];}
			},
			max: {
				type: Number | String,
				default: 0
			},
			uploadOptions: {
				type: Object,
				default: () => {
					return {
						type: 'h5',
						dock: 'utility/upload'
					}
				}
			}
		},
		methods: {
			onDel(index) {
				this.value.splice(index, 1);
				this.$emit('delete', this.value)
			},

			onUpload(index, e) {
				var that = this;
				if(that.uploadOptions.type == 'h5') {
					if(!e) {
						return;
					}
					let fileElm = e.target;
					if(fileElm.files && fileElm.files.length > 0) {
						let url = that.util.getFullUrl('c=utility&a=file&do=upload&type=image&thumb=0');
						that.$toast.loading({
							message: '上传中',
							duration: 0
						});
						for(var i = 0; i < fileElm.files.length; i++) {
							let pars = new FormData();
							pars.append('file', fileElm.files[i]);
							axios.post(url, pars).then((res) => {
								that.$toast.clear();
								let result = res.data;
								if(result.errno) {
									if(result.message) {
										alert('上传文件失败, 具体原因:' + result.message);
									} else {
										alert('上传文件失败, 具体原因:' + result.error.message);
									}
									return;
								}
								if(result.url && result.filename) {
									if(index > 0) {
										that.value[index] = {
											url: result.url,
											filename: result.filename
										};
									} else {
										that.value.push({
											url: result.url,
											filename: result.filename
										});
									}
							
									that.$emit('onGetUrl', that.value)
								}
							});
						}
					}
				}
			}
		}
	}
</script>

<style>
	#uploader{
		width: 100%;
		background-color: #fff;
		padding: 10px;
		padding-bottom: 0;
	}
	#uploader .van-col{
		height: 60px;
		margin-bottom: 10px;
	}
	#uploader .van-col .weui-uploader__file{
		position: relative;
		display: inline-block;
		width: 100%;
		height: 100%;
		border-radius: 3px;
		-webkit-background-size: 100% 100%;
		background-size: 100% 100%;
		background-repeat: no-repeat;
		background-position: center center;
	}
	#uploader .van-col .icon{
		position: absolute;
		width: 20px;
		height: 20px;
		border-radius: 50%;
		background: rgba(0,0,0,.6);
		right: -8px;
		top: -8px;
		z-index: 10000;
		color: #fff;
		text-align: center;
		font-size: 14px;
		line-height: 20px;
	}
	#uploader .weui-uploader__input-box .weui-uploader__file{
		border: 1px solid #eee;
	}
	#uploader .weui-uploader__input-box .weui-uploader__input{
		display: inline-block;
		position: absolute;
		width: 100%;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		opacity: 0;
		z-index: 1000;
	}
	#uploader .weui-uploader__input-box .van-icon{
		display: inline-block;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 30px;
	}
</style>



// WEBPACK FOOTER //
// src/components/uploader.vue