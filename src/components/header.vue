<template>
	<div id="public-header">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=0">
		<van-nav-bar :title="title" @click-left="onClickLeft" @click-right="onClickRight" :style="{background: headerstyle.background, color: headerstyle.color }">
			<div slot="left" v-if="back"><van-icon name="left" :style="{color: headerstyle.color}"></van-icon></div>
			<div slot="right">
				<slot name="right"></slot>
			</div>
		</van-nav-bar>
	</div>
</template>

<script>
	export default {
		name: 'PublicHeader',
		props:{
			title: String,
		},
		data() {
			return {
				back: false,
				headerstyle: {
					background: '#ff2d4b',
					color: '#fff'
				}
			}
		},

		methods: {
			onClickLeft() {
				if(!this.back) {
					return;
				}
				this.$router.back(-1);
			},
			onClickRight() {
				this.$emit('onClickRight');
			}
		},
		mounted() {
			if(window.history.length > 1) {
				this.back = true;
			}
			var theme = this.util.getStorage('theme');
			if(theme.header) {
				this.headerstyle = theme.header;
			}
		}
	}
</script>

<style>
	#public-header{
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 100;
	}
	#public-header>div{
		background-color: #ff2d4b;
		color: #fff;
		font-size: 16px;
	}
	#public-header .van-nav-bar__title{
		color: #fff!important;
	}
	#public-header .van-icon{
		font-size: 24px;
		font-weight: bold;
		margin-right: 2px;
		color: #fff;
	}
	#public-header .van-hairline--bottom::after {
		border-bottom-width: 0px;
	}
</style>



// WEBPACK FOOTER //
// src/components/header.vue