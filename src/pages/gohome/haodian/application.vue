<template>
	<div id="haodian-application">
		<public-header title="好店入驻"></public-header>
		<div class="content">
			<van-cell-group>
				<van-field
					v-model="store.title"
					label="店铺名称"
					placeholder="请填写店铺名称"
					input-align="right"
				/>
				<van-field
					v-model="store.telephone"
					label="店铺电话"
					placeholder="请填写店铺电话"
					input-align="right"
				/>
				<van-cell title="行业分类">
					<div slot="right-icon" @click="onTogglePopup('category')">
						<span>{{store.category_cn ? store.category_cn : '请选择'}}</span>
						<van-icon name="arrow"></van-icon>
					</div>
				</van-cell>
				<van-cell title="营业时间" v-if="0">
					<div slot="right-icon" @click="onTogglePopup('time')">
						<span>请选择</span>
						<van-icon name="arrow"></van-icon>
					</div>
				</van-cell>
				<van-field
					v-model="store.address"
					label="店铺地址"
					placeholder="请填写店铺地址"
					input-align="right"
				/>
				<van-field
					v-model="store.content"
					label="店铺简介"
					type="textarea"
					placeholder="请填写店铺简介"
					rows="1"
					input-align="right"
					autosize
				/>
			</van-cell-group>
			<van-cell-group class="margin-10-t">
				<van-cell>
					<div class="upload-img">
						<div class="goods-img">
							<div>添加店铺图标</div>
						</div>
						<uploader :max="1" :value="logo" @onGetUrl="onChangeLogo" @delete="onChangeLogo"></uploader>
					</div>
				</van-cell>
				<van-cell>
					<div class="upload-img">
						<div class="goods-img">
							<div>营业资质照(依次上传营业执照、餐饮服务许可证、其他资质)</div>
						</div>
						<uploader :max="3" :value="qualification" @onGetUrl="onChangeQualification" @delete="onChangeQualification"></uploader>
					</div>
				</van-cell>
				<van-cell>
					<div class="upload-img">
						<div class="goods-img">
							<div>添加店铺详情图</div>
						</div>
						<uploader :max="4" :value="thumbs" @onGetUrl="onChangeThumbs" @delete="onChangeThumbs"></uploader>
					</div>
				</van-cell>
			</van-cell-group>
			<template v-if="config.meal && config.meal.length > 0">
				<van-radio-group v-model="meal.selectIndex" class="margin-10-t">
					<van-cell-group>
						<van-cell title="入驻费用" />
						<van-cell clickable v-for="(item, index) in config.meal" @click="onSelectMeal(index)" :key="index">
							<div slot="title">{{item.title}}<span class="c-danger">（{{item.time}}天 / ￥{{item.price}}）</span></div>
							<van-radio :name="index" />
						</van-cell>
					</van-cell-group>
				</van-radio-group>
			</template>
			<div class="tips flex" @click="onTogglePopup('agreement')">
				<i class="icon" :class="{'icon-check': check == '1'}"></i>
				<span>我已阅读并同意</span>
				<span class="c-danger">《商家入驻协议》</span>
			</div>
			<div class="padding-15">
				<van-button size="normal" block :disabled="submitting" class="bg-danger" @click="onSubmit" v-if="meal.price > 0">确认支付￥{{meal.price}}</van-button>
				<van-button size="normal" block :disabled="submitting" class="bg-danger" @click="onSubmit" v-else>提交</van-button>
			</div>
		</div>
		<van-popup v-model="popupStatus.category" position="bottom">
			<van-picker
				show-toolbar
				title="所属分类"
				:columns="columns"
				value-key="title"
				@cancel="onTogglePopup('category')"
				@confirm="onConfirmCategory"
				@change="onChangeCategory"
			/>
		</van-popup>
<!-- 		<van-popup class="popup-time" v-model="popupStatus.time" position="bottom">
			<van-datetime-picker
				v-model="currentDate"
				type="time"
				@confirm="onConfirmTime"
				@cancel="onTogglePopup('time')"
			/>
		</van-popup> -->
		<agreement :show="popupStatus.agreement" :title="agreement.title" :content="agreement.value" @agreementHide="onTogglePopup('agreement')"></agreement>
		<imessage v-if="message.type" :message = message></imessage>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import Agreement from '@/components/agreement'
	import Uploader from '@/components/uploader'
	import imessage from '@/components/imessage'
	export default {
		components: {
			PublicHeader,
			Uploader,
			Agreement,
			imessage
		},
		data() {
			return {
				showPreLoading: true,
				submitting: false,
				store: {
					title: '',
					telephone: '',
					address: '',
					content: '',
					haodian_cid: 0,
					haodian_child_id: 0,
					logo: '',
					category_cn1: '',
					category_cn2: '',
				},
				qualification: [],
				logo: [],
				thumbs: [],
				popupStatus: {
					category: false,
					agreement: false,
					time: false
				},
				columns: [
					{
						values: [],
						defaultIndex: 0
					},
					{
						values: [],
						defaultIndex: 0
					},
				],
				meal: {
					selectIndex: 0,
					price: 0,
					days: 0
				},
				config: {},
				agreement: {
					title:  '',
					value: ''
				},
				message: {
					type: '',
					message: '',
					description: '',
					redirect: '',
					btnText: '',
				},
				check: 1,
				currentDate: '08:00'
			}
		},
		methods: {
			onTogglePopup(key) {
				this.popupStatus[key] = !this.popupStatus[key];
			},
			onConfirmCategory(picker) {
				if(picker[1]) {
					this.store.haodian_cid = picker[1].parentid;
					this.store.haodian_child_id = picker[1].id;
					this.store.category_cn = picker[0].title + '-' + picker[1].title;
				} else {
					this.store.haodian_cid = picker[0].id;
					this.store.haodian_child_id = 0;
					this.store.category_cn = picker[0].title;
				}
				this.onTogglePopup('category');
			},
			onChangeCategory(picker, value) {
				if(value[0].child && value[0].child.length > 0) {
					picker.setColumnValues(1, value[0].child);
				} else {
					picker.setColumnValues(1, []);
				}
			},
			onSelectMeal(index) {
				this.meal.selectIndex = index;
				var selectMeal = this.config.meal[index];
				console.log(selectMeal);
				this.meal.price = selectMeal.price;
				this.meal.days = selectMeal.time;
				//this.onCalculate();
			},
			onCalculate() {
				this.util.request({
					url: 'haodian/settle/calculate',
					data: {meal_index: this.meal.selectIndex},
				}).then((res) => {
					let result = res.data.message;
					this.meal.price = res.data.message.message.price
				})
			},
			onChangeLogo(value) {
				if(value[0]) {
					this.store.logo = value[0].filename;
				} else {
					this.store.logo = '';
				}
			},
			onChangeThumbs(value) {
				this.thumbs = value;
			},
			onChangeQualification(value) {
				this.qualification = value
			},
			onSubmit() {
				if(this.submitting) {
					return false;
				}
				if(!this.store.telephone){
					this.$toast('手机号不能为空');
					return false;
				}
				if(!this.util.isValidMobile(this.store.telephone)) {
					this.$toast('手机号格式错误');
					return false;
				}
				if(!this.store.address){
					this.$toast('商户地址不能为空');
					return false;
				}
				if(!this.store.title){
					this.$toast('商户名称不能为空');
					return false;
				}
				if(!this.store.haodian_cid){
					this.$toast('请选择商户分类');
					return false;
				}
				if(this.config.qualification_verify_status == 1 && (!this.qualification[0] || !this.qualification[0].filename)) {
					this.$toast('请上传营业执照照片');
					return false;
				}
				this.submitting = true;
				this.util.request({
					url: 'haodian/settle/store',
					method: 'POST',
					data: {
						store: JSON.stringify(this.store),
						thumbs: this.thumbs,
						qualification: this.qualification,
						meal: this.meal 
					},
				}).then((res) => {
					let result = res.data.message;
					if(result.errno == -1) {
						this.$toast(result.message);
						this.submitting = false;
						return false;
					} else if(result.errno == -1006) {
						this.util.$toast('请支付', this.util.getUrl({path: 'pages/public/pay', query: {order_id: result.message, order_type: 'haodian'}}), 1000, 'replace');
					} 
					this.onLoad();
				})
			},
			onLoad() {
				this.util.request({
					url: 'haodian/settle/store',
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno == -1000) {
						this.util.$toast(result.message, this.util.getUrl({path: '/gohome/pages/haodian/settle'}), 1000, 'replace');
					} else if(result.errno == -1005 || result.errno == 0 || result.errno == -1004) {
						this.message = {
							type: 'info',
							message: result.message.message,
							redirect: this.util.getUrl({path: '/gohome/pages/haodian/index'}),
							btnText: '确定',
						} 
					} else if(result.errno == -1) {
						this.message = {
							type: 'error',
							message: result.message,
							redirect: this.util.getUrl({path: '/gohome/pages/haodian/index'}),
							btnText: '返回',
						} 
					} else if(result.errno == -1006) {
						this.message = {
							type: 'info',
							message: result.message.message,
							redirect: this.util.getUrl({path: '/pages/public/pay', query: {order_id: result.message.order_id, order_type: 'haodian'}}),
							btnText: '前去支付',
						} 
					} else {
						this.agreement = result.message.agreement;
						this.config = result.message.config;
						if(this.config.meal && this.config.meal.length > 0) {
							this.meal.price = this.config.meal[0].price;
							this.meal.days = this.config.meal[0].time;
						}
						var categorys = result.message.categorys;
						this.columns[0].values = categorys;
						if(this.columns[0].values[0].child) {
							this.columns[1].values = categorys[0]['child'];
						}
						this.columns = [...this.columns];
					}
				})
			}

		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#haodian-application .content .upload-img #uploader{
		padding: 0;
	}
	#haodian-application .content .upload-img .goods-img{
		padding-bottom: 10px;
		color: #333;
		font-size: 14px;
	}
	#haodian-application .content .tips{
		padding: 15px 10px 0;
		font-size: 14px;
		color: #999;
	}
	#haodian-application .content .tips .icon{
		width: 20px;
		height: 20px;
		border-radius: 50%;
		border: 1px solid #ccc;
		text-align: center;
		line-height: 18px;
		margin-right: 5px;
	}
	#haodian-application .content .tips .icon.icon-check{
		color: #fff;
		background-color: #ff2d4b;
		border-color: #ff2d4b;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/haodian/application.vue