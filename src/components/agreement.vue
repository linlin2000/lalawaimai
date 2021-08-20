<template>
	<div id="agreement">
		<van-popup v-model="show" position="bottom">
			<van-nav-bar class="border-0px" :title="title" @click-left="onClose" :style="{background: '#ff2d4b', color: '#fff' }">
				<van-icon name="left" :style="{color: '#fff'}" slot="left" class="font-20"></van-icon>
			</van-nav-bar>
			<div class="richtext" v-html="content"></div>
		</van-popup>
	</div>
</template>

<script>
	export default {
		name: "agreement",
		props: {
			show: false,
			title: '',
			content: '',
		},
		methods: {
			onClose() {
				this.$emit('agreementHide');
			}
		}
	}
</script>

<style scoped>
	#agreement .van-popup{
		width: 100%;
		height: 100%;
		z-index: 30000!important;
	}
	#agreement .richtext{
		padding: 10px;
		line-height: 1.5;
		width: 100%;
	}
</style>


// WEBPACK FOOTER //
// src/components/agreement.vue