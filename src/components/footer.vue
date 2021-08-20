<template>
	<div id="public-footer">
		<transition name="loading">
			<iloading v-if="preLoading"></iloading>
		</transition>
		<template v-if="menufooter && menufooter.data">
			<van-tabbar v-model="active" v-if="menufooter.params.navstyle == 0">
				<van-tabbar-item @click="util.jsUrl(item.link)" v-for="(item, index) in menufooter.data" :key="index"  :style="{color:  util.isMenuActive(item.link) ? menufooter.css.iconColorActive : menufooter.css.iconColor}">
					<div slot="icon" slot-scope="props" class="icon font-20" :class="item.icon"></div>
					<span slot-scope="props">{{item.text}}</span>
				</van-tabbar-item>
			</van-tabbar>
			<ul class="tabbar-img van-hairline--top" v-else-if="menufooter.params.navstyle == 1">
				<li @click="util.jsUrl(item.link)" class="tabbar-img-item" v-for="(item, index) in menufooter.data" :key="index">
					<img :src="item.img" alt="">
				</li>
			</ul>
		</template>
		<failed-tips v-if="showFailedTips" :failedTips="failedTips"></failed-tips>
	</div>
</template>

<script>
	export default {
		name: 'PublicFooter',
		props: {
			preLoading: {
				type: Boolean || Number
			},
			menufooter: Object,
			failedTips: {},
			showFailedTips: false
		},
		data() {
			return {
				active: 0
			}
		}
	}
</script>

<style>
	#public-footer{
		position: absolute;
		z-index: 100;
	}
	#public-footer .van-icon{
		font-size: 20px;
	}
	#public-footer .van-tabbar-item--active {
	    color: #ff2d4b;
	}
	#public-footer .tabbar-img{
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		height: 50px;
		background-color: #fff;
		display: flex;
		align-item: center;
		justify-content: center;
		flex-flow: row nowrap;
	}
	#public-footer .tabbar-img .tabbar-img-item{
		width: 100%;
		height: 100%;
		text-align: center;
	}
	#public-footer .tabbar-img .tabbar-img-item img{
		width: 36px;
		height: 36px;
		margin-top: 7px;
	}
</style>



// WEBPACK FOOTER //
// src/components/footer.vue