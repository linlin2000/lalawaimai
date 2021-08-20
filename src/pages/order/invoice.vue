<template>
	<div id="order-invoice">
		<public-header title="新增发票信息" ></public-header>
		<div class="content">
			<van-cell-group class="margin-10-t">
				<van-field
					v-model="title"
					label="抬头"
					input-align="right"
					placeholder="请填写准确的抬头名称"
				/>
				<van-field
					v-model="recognition"
					label="税号"
					input-align="right"
					placeholder="请填写[税号]或[社会信用代码]"
				/>
			</van-cell-group>
			<div class="invoice-tips">
				可咨询公司财务部门获得[税号]或[社会信用代码]
			</div>
			<div class="padding-15-lr">
				<van-button size="normal" block class="bg-danger" @click="onSubmit">保存</van-button>
			</div>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import {setData} from "@/controller/funcCommon"
	export default {
		data() {
			return {
				sid: 0,
				title: '',
				recognition: ''
			}
		},
		components: {
			PublicHeader
		},
		methods: {
			onSubmit() {
				var that = this;
				if(!that.title) {
					that.$toast('抬头名称不能为空');
					return false;
				}
				if(!that.recognition) {
					that.$toast('税号不能为空');
					return false;
				}
				setData({
					vue: that,
					url: 'wmall/member/invoice',
					data: {
						title: that.title,
						recognition: that.recognition,
					},
					success: (res) => {
						that.util.$toast('添加成功', that.util.getUrl({path: '/pages/order/note', query: {sid: that.sid}}), 1000)
					}
				});
			}
		},
		created(){
			if(!this.$route.query.sid) {
				this.$toast('参数错误');
				return;
			} else {
				this.sid = this.$route.query.sid
			}
		},
	}
</script>

<style>
	#order-invoice .invoice-tips{
		padding: 15px;
		font-size: 12px;
		color: #999;
	}
</style>


// WEBPACK FOOTER //
// src/pages/order/invoice.vue