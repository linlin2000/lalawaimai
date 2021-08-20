<template>
	<div id="store-application">
		<public-header title="商户信息"></public-header>
		<div class="content">
			<van-cell-group>
				<van-field v-model="title" label="商户名称" placeholder="店铺名称"/>
				<van-field v-model="address" label="商户地址" placeholder="店铺详细地址"/>
				<van-field v-model="mobile" label="联系电话" placeholder="店铺负责人电话"/>
				<van-field v-model="content" type="textarea" label="商户简介" />
				<van-field label="资质认证" placeholder="仅用于平台认证" readonly="readonly"/>
			</van-cell-group>
			<div class="store-aptitude">
				<div class="aptitude-img">
					<input class="weui-uploader__input" type="file" multiple="multiple" accept="image/*" @change="onUploadImage(0, $event)">
					<img :src="qualification[0].url" alt="" v-if="qualification[0].url">
					<img src="static/img/store_aptitude.png" alt="" v-else>
				</div>
				<div class="aptitude-img">
					<input class="weui-uploader__input" type="file" multiple="multiple" accept="image/*" @change="onUploadImage(1, $event)">
					<img :src="qualification[1].url" alt="" v-if="qualification[1].url">
					<img src="static/img/food_aptitude.png" alt="" v-else>
				</div>
				<div class="aptitude-img">
					<input class="weui-uploader__input" type="file" multiple="multiple" accept="image/*" @change="onUploadImage(2, $event)">
					<img :src="qualification[2].url" alt="" v-if="qualification[2].url">
					<img src="static/img/other_aptitude.png" alt="" v-else>
				</div>
			</div>
			<div class="protocol">
				我已阅读并同意 <span class="c-danger" @click="agreementShow = true">《商户入驻协议》</span>
			</div>
			<div class="submit">
				<van-button @click="onSubmit" size="normal" type="danger" :block="true" :disabled="submitting">提交</van-button>
			</div>
		</div>
		<agreement :show="agreementShow" :title="agreement.title" :content="agreement.value" @agreementHide="agreementHide"></agreement>
		<imessage v-if="message.type" :message = message></imessage>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import Agreement from '@/components/agreement'
	import imessage from '@/components/imessage'
	export default {
		name: "storeApplication",
		components: {
			PublicHeader,
			Agreement,
			imessage
		},
		data() {
			return {
				submitting: false,
				agreementShow: false,
				agreement: {},
				mobile: '',
				title: '',
				content: '',
				address: '',
				config: {},
				message: {
					type: '',
					message: '',
					description: '',
					redirect: '',
					btnText: '',
				},
				qualification: {
					0: {},
					1: {},
					2: {}
				},
				showPreLoading: true
			}
		},
		methods: {
			agreementHide() {
				this.agreementShow = false
			},
			onSubmit() {
				if(this.submitting) {
					return false;
				}
				if(!this.mobile){
					this.$toast('手机号不能为空');
					return false;
				}
				if(!this.util.isValidMobile(this.mobile)) {
					this.$toast('手机号格式错误');
					return false;
				}
				if(!this.address){
					this.$toast('商户地址不能为空');
					return false;
				}
				if(!this.title){
					this.$toast('商户名称不能为空');
					return false;
				}
				if(this.config.qualification_verify_status == 1 && this.qualification[0].update == 0) {
					this.$toast('请上传营业执照照片');
					return false;
				}
				this.submitting = true;
				this.util.request({
					url: 'wmall/store/settle/store',
					method: 'POST',
					data: {
						telephone: this.mobile,
						address: this.address,
						content: this.content,
						title: this.title,
						qualification: this.qualification
					},
				}).then((res) => {
					let result = res.data.message;
					if(result.errno == -1) {
						this.$toast(result.message);
						this.submitting = false;
						return false;
					}
					this.onLoad();
				})
			},
			onLoad() {
				this.util.request({
					url: 'wmall/store/settle/store',
				}).then((res) => {
					let result = res.data.message;
					this.showPreLoading = false;
					if(result.errno == -1000) {
						this.util.$toast(result.message, this.util.getUrl({path: '/pages/store/settle'}), 1000, 'replace');
					} else if(result.errno == -1001) {
						this.message = {
							type: 'info',
							message: result.message.message,
							redirect: this.util.getUrl({path: '/pages/member/mine'}),
							btnText: '确定',
						} 
					} else if(result.errno == -1) {
						this.message = {
							type: 'error',
							message: result.message,
							redirect: this.util.getUrl({path: '/pages/member/mine'}),
							btnText: '返回',
						} 
					} else if(result.errno == 0) {
						this.util.$toast(result.message.message, this.util.getUrl({path: '/pages/home/index'}), 1000, 'replace');
					} else {
						this.agreement = result.message.agreement;
						this.config = result.message.config;
					}
				})
			},

			onUploadImage(index, e) {
				var that = this;
				that.util.image({
					obj: e,
					success: function(obj, result) {
						if(result.url && result.filename) {
							that.qualification[index] = {
								url: result.url,
								filename: result.filename,
								update: 1
							};
							that.qualification = Object.assign({}, that.qualification);
						}
					},
					options: {channel: 'h5'}
				});
			}

		},
		mounted() {
			this.onLoad();
		}
		
	}
</script>

<style scoped>
	#store-application .protocol{
		margin-top:10px;
		margin-right:10px;
		text-align: right;
		font-size:14px;
		color:#B1B1B1;
	}
	#store-application .submit{
		margin-top: 10px;
		padding: 0 15px;
	}
	#store-application .content .store-aptitude{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 10px 25px;
		background-color: #fff;
	}
	#store-application .content .store-aptitude .aptitude-img{
		position: relative;
		height: 108px;
		width: 46%;
	}
	#store-application .content .store-aptitude .aptitude-img:first-child{
		margin-bottom: 18px;
	}
	#store-application .content .store-aptitude .aptitude-img:nth-child(2){
		margin-bottom: 18px;
	}
	#store-application .content .store-aptitude .aptitude-img img{
		width: 100%;
		height: 100%;
		border: none;
	}
	#store-application .content .store-aptitude .aptitude-img .weui-uploader__input{
		display: block;
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		opacity: 0;
	}
</style>


// WEBPACK FOOTER //
// src/pages/store/application.vue