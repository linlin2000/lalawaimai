<template>
	<div id="order-note">
		<public-header title="添加备注" bgcolor="#f5f5f5" textcolor="#000"></public-header>
		<div class="content">
			<van-cell-group class="text">
				<van-field v-model="note" type="textarea" placeholder="请输入备注，最多50字哦"/>
				<div class="label-box" v-if="order_note && order_note.length > 0">
					<div class="label" v-for="item in order_note" @click="onChooseLabel(item)">{{item}}</div>
				</div>
			</van-cell-group>
			<van-radio-group v-model="radio" class="margin-10-t">
				<van-cell-group>
					<van-cell title="发票"></van-cell>
					<van-cell title="不需要发票" clickable @click="radio = 0">
						<van-radio :name="0" />
					</van-cell>
					<van-cell :title="item.title" clickable @click="radio = item.id" v-for="(item, index) in invoices" :key="index">
						<van-radio :name="item.id" />
					</van-cell>
				</van-cell-group>
			</van-radio-group>
			<div class="add-invoice" @click="util.jsUrl('/pages/order/invoice',{ sid: sid}, 'replace')"><i class="icon icon-roundadd"></i>添加发票抬头</div>
			<div class="save-btn">
				<van-button type="danger" size="large" @click="onSubmit">保存</van-button>
			</div>
		</div>
	</div>
</template>

<script>
	import {mapState, mapMutations} from 'vuex'
	import PublicHeader from '@/components/header'
	export default {
		name: "orderNote",
		components: {
			PublicHeader
		},
		data() {
			return {
				note: '',
				sid: Number,
				order_note: [],
				invoices: [],
				radio: 0,
			}
		},
		methods: {
			...mapMutations([
				'setOrderExtra'
			]),
			onLoad() {
				if(!this.$route.query.sid) {
					this.$toast('参数错误');
					return;
				} else {
					this.sid = this.$route.query.sid
				}
				this.util.request({
					url: 'wmall/order/create/note',
					data: {
						sid: this.sid,
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message)
						return;
					}
					result = result.message;
					if(result.store.invoice_status == '1') {
						this.invoices = [...this.invoices, ...result.invoices];
					}
					this.order_note = [...this.order_note, ...result.message.store.order_note];
				})
			},
			onChooseLabel(note) {
				this.note = this.note + ' ' + note;
			},
			onSubmit() {
				if(this.radio > 0) {
					this.setOrderExtra({key: 'invoiceId', val: this.radio});
				}
				this.setOrderExtra({key: 'note', val: this.note});
				this.$router.replace(this.util.getUrl({path: '/pages/order/create?sid=' + this.$route.query.sid}));
			}
		},
		computed: {
			...mapState([
				'orderExtra'
			]),
		},
		mounted() {
			this.note = this.orderExtra.note || '';
			this.radio = this.orderExtra.invoiceId || 0;
			this.onLoad();
		}
	}
</script>

<style>
	#order-note .content .text .van-field{
		padding: 15px;
	}
	#order-note .content textarea{
		background-color: #f5f5f5;
		height: 140px;
		border:1px solid #ECECEC;
		padding:10px;
		font-size: 16px;
	}
	#order-note .content .label-box{
		padding: 10px 15px 5px 15px;
	}
	#order-note .content .label-box .label{
		display: inline-block;
		padding: 4px 10px;
		font-size:12px;
		border:1px solid #ECECEC;
		margin: 0 10px 10px 0;
		color: #333;
		line-height: 20px
	}
	#order-note .content .save-btn{
		padding: 15px;
	}
	#order-note .add-invoice{
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 15px;
		color: #ff2d4b;
		background-color: #fff;
		font-size: 14px;
	}
	#order-note .add-invoice .icon{
		font-size: 18px;
		padding-right: 5px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/order/note.vue