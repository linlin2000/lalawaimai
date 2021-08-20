<template>
	<div id="publish-stick">
		<public-header title="发布置顶"></public-header>
		<div class="content">
			<van-cell-group v-if="0">
				<van-field
					v-model="name"
					label="信息置顶站点："
					type="text"
					placeholder="请输入信息置顶站点"
					input-align="right"
				/>
				<van-field
					v-model="name"
					label="信息置顶分类："
					type="text"
					placeholder="请输入信息置顶分类"
					input-align="right"
				/>
			</van-cell-group>
			<van-radio-group v-model="days" class="margin-10-t" v-if="category.config">
				<van-cell-group>
					<van-cell title="选择置顶" :value="days > 0 ? '置顶' + days + '天' : ''" />
					<template v-if="category.config.stick_price" v-for="stickItem in category.config.stick_price">
						<van-cell class="border-0px" :title="'置顶' + stickItem.day + '天(' + stickItem.price + '元)'" clickable @click="onSelectStick(stickItem.day)">
							<van-radio :name="stickItem.day" />
						</van-cell>
					</template>
				</van-cell-group>
			</van-radio-group>
			<div class="stick-text">
				点击置顶系统会自动把推广信息置顶到所在分类的推广位置，支付后实时生效。
			</div>
			<div class="padding-15 stick-button" @click="onSubmit">
				<van-button size="normal" block class="bg-danger font-16">立即置顶</van-button>
			</div>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		components: {
			PublicHeader,
		},
		data() {
			return {
				showPreLoading: true,
				category: {},
				calculate: {
					final_fee: 0
				},
				days: 0
			}
		},
		methods: {
			onSelectStick(day) {
				if(this.calculate && this.calculate.stick_is_available != 1) {
					this.util.$toast('置顶位已售完,暂时不可购买', '', 1000);
					return false;
				}
				this.days = day;
			},
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'tongcheng/publish/stick',
					data: {
						information_id: that.information_id
					},
					success: function(res) {
						that.category = res.category;
						that.calculate = res.calculate;
						that.days = that.calculate.default_days;
					}
				});
			},
			onSubmit() {
				var that = this;
				if(that.days == 0) {
					that.util.$toast('请选择置顶天数');
					return;
				}
				setData({
					vue: that,
					url: 'tongcheng/publish/stick',
					data: {
						information_id: that.information_id,
						days: that.days,
					},
					success: function(res) {
						that.util.$toast('请支付', that.util.getUrl({path: '/pages/public/pay', query: {order_id: res, order_type: 'tongcheng'}}), 1500, 'replace');
					}
				});
			}
		},
		created() {
			if(this.$route.query) {
				this.information_id = this.$route.query.information_id;
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#publish-stick .van-cell__title{
		max-width: 120px;
	}
	#publish-stick .van-icon-check{
		color: #fff;
		border: 1px solid #ccc;
		border-radius: 50px;
		margin-bottom: 1px;
		width: 20px;
		height: 20px;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#publish-stick .van-icon-checked{
		width: 20px;
		height: 20px;
		background-color: #ff2d4b;
		color: #fff;
		border-radius: 50px;
		font-size: 14px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#publish-stick .stick-text{
		padding: 10px 15px;
		color: #999;
		font-size: 14px;
		line-height: 1.2;
	}
	#publish-stick .stick-button{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/tongcheng/publish/stick.vue