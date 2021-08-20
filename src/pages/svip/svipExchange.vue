<template>
	<div id="svip-exchange">
		<public-header title="兑换超级会员"></public-header>
		<div class="content">
			<div class="tips">成功兑换后将关联到当前帐号：{{nickname}}</div>
			<van-cell-group>
				<van-field
					v-model="code"
					label="兑换码"
					placeholder="请输入16位兑换码"
				/>
			</van-cell-group>
			<div class="padding-15">
				<van-button size="normal" :disabled="!islegal" block class="svip-button" @click="onSubmit">兑换超级会员</van-button>
			</div>
		</div>
		<iloading v-if="showPreLoading"></iloading>
	</div>
</template>

<script>
	import publicHeader from "@/components/header"
	import {getData, setData} from "@/controller/funcCommon"
	export default {
		components: {
			publicHeader
		},
		data() {
			return {
				code: '',
				nickname: '',
				islegal: false,
				showPreLoading: true
			}
		},
		methods: {
			onLoad() {
				var that = this;
				getData({
					vue: that,
					url: 'svip/svipExchange/index',
					data: {},
					success: (res) => {
						that.nickname = res.nickname;
						that.islegal = true;
					}
				})
			},
			onSubmit() {
				var that = this;
				if(!that.islegal) {
					return;
				}
				if(!that.code) {
					that.util.$toast('请输入16位兑换码');
					return;
				}
				that.islegal = false;
				setData({
					vue: that,
					url: 'svip/svipExchange/exchange',
					data: {
						code: that.code
					},
					success: (res) => {
						that.util.$toast('兑换成功', that.util.getUrl({path: '/package/pages/svip/mine'}), 1500);
						return;
					},
					fail: (res) => {
						that.util.$toast(res);
						that.islegal = true;
						return;
					}
				})
			}
		},
		mounted() {
			this.onLoad();
		},
	}
</script>

<style>
	#svip-exchange .tips{
		padding: 10px 15px;
		font-size: 14px;
		color: #666;
	}
	#svip-exchange .svip-button{
		color: #fff;
		background-color: #ff2d4b;
	}
	#svip-exchange .svip-button .van-button__text{
		font-size: 16px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/svip/svipExchange.vue