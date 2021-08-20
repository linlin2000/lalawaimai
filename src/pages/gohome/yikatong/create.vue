<template>
	<div id="yikatong-create">
		<public-header title="会员开通"></public-header>
		<div class="content">
			<div class="wrap-search">
				<div class="tab-group flex-lr">
					<div class="tab-item active">在线开通</div>
					<div class="tab-item">激活码兑换</div>
				</div>
			</div>
			<div class="vip-group" v-if="1">
				<div class="vip-list">
					<div class="vip-item active">
						<div>银卡</div>
						<div class="padding-10-t c-danger font-bold font-15">￥8.00</div>
					</div>
					<div class="vip-item">
						<div>金卡</div>
						<div class="padding-10-t c-danger font-bold">￥8.00</div>
					</div>
					<div class="vip-item">
						<div class="ellipsis">至尊白金卡</div>
						<div class="padding-10-t c-danger font-bold">￥8.00</div>
					</div>
				</div>
				<van-cell-group class="margin-10-t">
					<van-field
							v-model="value"
							label="姓名"
							placeholder="请输入姓名"
					/>
					<van-field
							v-model="value"
							label="联系方式"
							placeholder="请输入联系方式"
					/>
					<van-cell title="适用区域">
						<div slot="right-icon" class="flex">
							<van-icon name="arrow"></van-icon>
						</div>
					</van-cell>
				</van-cell-group>
				<div class="create-button">
					<van-button size="normal" block class="bg-danger">确认支付￥8.00</van-button>
				</div>
			</div>
			<div class="code-exchange" v-if="0">
				<van-cell-group>
					<van-field
							v-model="value"
							label="激活码"
							placeholder="请输入您要兑换的激活码"
					/>
				</van-cell-group>
				<div class="create-button">
					<van-button size="normal" block class="bg-danger">立即兑换</van-button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		data() {
			return {
				value: ''
			}
		},
		components: {
			PublicHeader,
		},
		methods: {

		}
	}
</script>

<style>
	#yikatong-create .vip-group{
		padding-top: 45px;
	}
	#yikatong-create .vip-list{
		white-space: nowrap;
		overflow-x: scroll;
		overflow-y: hidden;
		padding: 15px;
		background-color: #fff;
		font-size: 0;
	}
	#yikatong-create .vip-list .vip-item{
		display: inline-block;
		width: 30%;
		margin-right: 15px;
		border: 1px solid #eee;
		border-radius: 5px;
		text-align: center;
		font-size: 14px;
		padding: 15px;
	}
	#yikatong-create .vip-list .vip-item.active{
		border-color: #FF2D4B;
		background-color: #FFF5F6;
	}
	#yikatong-create .create-button{
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 15px;
		background-color: #fff;
	}
	#yikatong-create .code-exchange{
		padding-top: 45px;
	}
</style>


// WEBPACK FOOTER //
// src/pages/gohome/yikatong/create.vue