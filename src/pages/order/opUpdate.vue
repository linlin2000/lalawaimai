<template>
	<div id="order-opUpdate">
		<public-header title="修改订单信息"></public-header>
		<div class="content">
			<van-cell-group class="text" v-if="type == 'note'">
				<van-field v-model="order.note" type="textarea" placeholder="请输入备注，最多50字哦"/>
				<div class="label-box" v-if="order_note && order_note.length > 0">
					<div class="label" v-for="item in order_note" @click="onChooseLabel(item)">{{item}}</div>
				</div>
			</van-cell-group>
			<van-cell-group class="margin-15-t" v-if="type == 'person_num'" @click="onChangePicknum">
				<van-cell to="" title="餐具数量">
					<div class="flex c-gray" slot="right-icon">
						<span v-if="order.person_num">{{order.person_num}}套</span>
						<span v-else>未选择</span>
						<van-icon name="arrow" class="margin-5-l"></van-icon>
					</div>
				</van-cell>
			</van-cell-group>
			<van-cell-group class="margin-15-t" v-if="type == 'mobile'">
				<van-field
					v-model="order.mobile"
					type="number"
					placeholder="请输入收货电话"
					label="收货电话"
					input-align="right"
				/>
			</van-cell-group>
			<div class="padding-15">
				<van-button size="normal" block class="bg-danger" :disabled="!islegal" @click="onSubmit">保存</van-button>
			</div>
		</div>
		<!--餐具人数选择-->
		<van-popup v-model="picknum" position="bottom">
			<div class="popup-picknum">
				<van-picker :columns="columns" @confirm="onConfirmPersonNum" @cancel="onChangePicknum" show-toolbar confirm-button-text="确认" cancel-button-text="取消"/>
			</div>
		</van-popup>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		data() {
			return {
				id: 0,
				order: {},
				order_note: [],
				type: '',
				picknum: false,
				columns: ['1人', '2人', '3人', '4人', '5人'],
				islegal: false,
				showPreLoading: true,
			}
		},
		components: {
			PublicHeader
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'wmall/order/index/order_info_update',
					data: {
						id: that.id
					},
					success: (res) => {
						that.order = res.order;
						that.order_note = [...that.order_note, ...res.store.order_note];
						that.islegal = true;
					}
				})
			},
			onChangePicknum() {
				this.picknum = !this.picknum;
			},
			onConfirmPersonNum(value, index) {
				var person_num = index + 1;
				this.order.person_num = person_num;
				this.onChangePicknum();
			},
			onChooseLabel(note) {
				this.order.note = this.order.note + ' ' + note;
			},
			onSubmit() {
				var that = this;
				if(!that.islegal) {
					return;
				}
				if(that.type == 'note') {
					var params = {
						id: that.id,
						note: that.order.note,
						type: that.type
					}
				} else if(that.type == 'mobile') {
					if(!that.order.mobile) {
						that.$toast('请输入手机号');
						return false;
					}
					if(!that.util.isValidMobile(that.order.mobile)) {
						that.$toast('手机号格式错误');
						return false;
					}
					var params = {
						id: that.id,
						mobile: that.order.mobile,
						type: that.type
					}
				} else if(that.type == 'person_num') {
					var params = {
						id: that.id,
						person_num: that.order.person_num,
						type: that.type
					}
				}
				that.islegal = false;
				setData({
					vue: that,
					url: 'wmall/order/index/order_info_update',
					data: params,
					success: (res) => {
						that.util.$toast(res, that.util.getUrl({path: '/pages/order/op', query:{id: that.id}}), 1500, 'replace');
					},
					fail: (res) => {
						that.util.$toast(res);
						that.islegal = true;
					}
				})
			}
		},
		mounted () {
			this.onLoad();
		},
		created() {
			this.query = this.$route.query;
			if(this.query && this.query.type && this.query.id) {
				this.id = this.query.id;
				this.type = this.query.type;
			}
		}
	}
</script>

<style>
	#order-opUpdate .content .text .van-field{
		padding: 15px;
	}
	#order-opUpdate .content textarea{
		background-color: #f5f5f5;
		height: 140px;
		border:1px solid #ECECEC;
		padding:10px;
		font-size: 16px;
	}
	#order-opUpdate .content .label-box{
		padding: 10px 15px 5px 15px;
	}
	#order-opUpdate .content .label-box .label{
		display: inline-block;
		padding: 4px 10px;
		font-size:12px;
		border:1px solid #ECECEC;
		margin: 0 10px 10px 0;
		color: #333;
		line-height: 20px
	}
</style>


// WEBPACK FOOTER //
// src/pages/order/opUpdate.vue