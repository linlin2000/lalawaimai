<template>
	<div id="navigator">
		<div class="open" @click="onToggleShow" v-if="!show">快捷<br>导航</div>
		<div class="icon icon-close"  @click="onToggleShow" v-else></div>
		<div class="navs" :class="{show: show}">
			<router-link class="icon nav-item" :class="item.icon" :style="{top: (show ? (-key-1) * 50 + 'px' : '0px')}" :to="util.getUrl({path: item.link})" v-for="(item, index, key) in navs.data" :key="index"></router-link>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			navs: {}
		},
		data() {
			return {
				show: false
			}
		},
		methods: {
			onToggleShow() {
				this.show = !this.show;
			}
		},
	}
</script>

<style scoped>
	#navigator{
		position: fixed;
		z-index: 10000;
		bottom: 150px;
		right: 10px;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background-color: rgba(0, 0, 0, 0.5);
		color: #fff;
		text-align: center;
	}
	#navigator .open, #navigator .icon-close, #navigator .nav-item{
		width: 100%;
		height: 100%;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 12px;
		line-height: 1.2;
	}
	#navigator .open, #navigator .icon-close{
		position: absolute;
		z-index: 10;
	}
	#navigator .icon-close{
		font-size: 24px;
		background-color: #ff2d4b;
	}
	#navigator .navs{
		width: 100%;
		height: 100%;
	}
	#navigator .navs .nav-item{
		position: absolute;
		z-index: 5;
		top: 0px;
		background-color: rgba(0, 0, 0, 0.5);
		font-size: 20px;
		color: #fff;
		transition: all .4s;
		transform: rotate(-180deg);
		opacity: 0;
	}
	#navigator .navs.show .nav-item{
		transform: rotate(0deg);
		opacity: 1;
	}
</style>


// WEBPACK FOOTER //
// src/components/navigator.vue