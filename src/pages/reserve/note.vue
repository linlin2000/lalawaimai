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
			}
		},
		methods: {
			...mapMutations([
				'setState'
			]),
			onLoad() {
				if(!this.$route.query.sid) {
					this.$toast('参数错误');
					return;
				} else {
					this.sid = this.$route.query.sid
				}
				this.util.request({
					url: 'wmall/store/reserve/note',
					data: {
						sid: this.sid,
					}
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.$toast(result.message)
						return;
					}
					this.order_note = [...this.order_note, ...result.message.store.order_note];
				})
			},
			onChooseLabel(note) {
				this.note = this.note + ' ' + note;
			},
			onSubmit() {
				this.setState({type: 'reserveExtra', key: 'note', val: this.note});
				this.$router.push(this.util.getUrl({path: '/tangshi/pages/reserve/create?sid=' + this.sid}));
			}
		},
		computed: {
			...mapState([
				'reserveExtra'
			]),
		},
		mounted() {
			this.note = this.reserveExtra.note || '';
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
</style>


// WEBPACK FOOTER //
// src/pages/reserve/note.vue