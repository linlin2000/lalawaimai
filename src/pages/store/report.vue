<template>
	<div id="store-report">
		<public-header title="举报商家"></public-header>
		<div class="content">
			<van-radio-group v-model="radio" class="reason-list" v-if="reasons && reasons.length > 0">
				<van-cell-group>
					<van-cell>
						<div slot="title" class="flex">
							<div class="icon icon-infofill"></div>举报商家:{{store.title}}
						</div>
					</van-cell>
					<van-cell  v-for="(reason, index) in reasons" :key="index">
						<van-radio :name="'' + index">{{reason}}</van-radio>
					</van-cell>
				</van-cell-group>
			</van-radio-group>
			<van-cell-group>
				<van-field
					v-model="note"
					type="textarea"
					placeholder="必填。描述详细。"
					rows="3"
				/>
			</van-cell-group>
			<div class="tip">有图有真相</div>
			<uploader @onGetUrl="onGetImgsUrl" :max="3"></uploader>
			<div class="tip">手机号,仅平台管理员可见</div>
			<van-cell-group>
				<van-field v-model="mobile" placeholder="手机号码：仅平台管理员可见" />
			</van-cell-group>
			<div class="save-btn" @click="onSubmit">
				<van-button type="danger" size="normal" :block="true">保存</van-button>
			</div>
		</div>
		<transition name="loading">
			<iloading v-if="preLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import Uploader from '@/components/uploader'
	export default {
		data() {
			return {
				sid: Number,
				radio: '0',
				note: '',
				thumbs: [],
				mobile: '',
				store: {},
				reasons: [],
				member: {},
				preLoading: true
			}
		},
		components: {
			PublicHeader,
			Uploader
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'wmall/store/report',
					data: {
						sid: this.sid
					}
				}).then((res) => {
					this.preLoading = false;
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					this.store = result.message.store;
					this.mobile = result.message.member.mobile;
					if(result.message.reasons.length > 0) {
						this.reasons = [...result.message.reasons];
						this.radio = String(this.reasons.length - 1);
					}
				})
			},
			onSubmit() {
				var title = this.reasons[this.radio];
				if(!title) {
					this.util.$toast('投诉类型不能为空');
					return false;
				}
				if(!this.note) {
					this.util.$toast('投诉内容不能为空');
					return false;
				}
				if(!this.util.isValidMobile(this.mobile)) {
					this.$toast('手机号格式错误');
					return false;
				}
				if(this.thumbs.length > 3) {
					this.util.$toast("最多能上传3张图片");
					return false;
				}
				var params = {
					sid: this.sid,
					title: title,
					note: this.note,
					mobile: this.mobile,
					thumbs: this.thumbs
				};
				this.util.request({
					url: 'wmall/store/report/post',
					method: 'post',
					data: params,
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message);
						return false;
					}
					this.util.$toast(result.message, this.util.getUrl({path: 'pages/store/index', query: {sid: this.sid}}))
				})
			},
			onGetImgsUrl(value) {
				this.thumbs = value;
			},
		},
		created() {
			if(this.$route.query.sid) {
				this.sid = this.$route.query.sid;
			} else {
				this.util.$toast('门店不存在或已删除');
				return false;
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#store-report .reason-list{
		margin: 10px 0;
	}
	#store-report .reason-list .icon-infofill{
		font-size: 22px;
		margin-right: 10px;
	}
	#store-report .reason-list .van-icon{
		width: 20px;
		height: 20px;
		border-radius: 50%;
		text-align: center;
		line-height: 20px;
		border: 1px solid #c7c7cc;
		font-size: 16px;
		color: #fff;
	}
	#store-report .reason-list .van-icon-checked{
		background-color: #ff2d4b;
		border-color: #ff2d4b;
	}
	#store-report .van-radio__label{
		max-width: 90%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	#store-report .tip{
		width: 100%;
		padding: 10px 15px;
		font-size: 14px;
		color: #6d6d72;
	}
	#store-report .save-btn{
		margin: 15px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/store/report.vue