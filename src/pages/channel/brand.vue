<template>
	<div id="store-brand">
		<public-header title="为您优选"></public-header>
		<div class="content">
			<div class='banner'>
				<img :src="selective.imgurl">
			</div>
			<store-group :stores="stores"></store-group>
		</div>
		<transition name="loading">
			<iloading v-show="showLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	import storeGroup from '@/components/storeGroup'
	export default {
		data() {
			return {
				stores: [],
				showLoading: true,
				selective: {}
			}
		},
		components: {
			PublicHeader,
			storeGroup,
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'wmall/channel/brand',
					data: {
					},
				}).then((res) => {
					let result = res.data.message.message;
					this.stores = result.stores;
					this.selective = result.selective;
					this.showLoading = false;
				})
			},
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#store-brand .content{
		position: absolute;
		top: 46px;
		right: 0;
		left: 0;
		overflow-y: auto;
	}
	#store-brand .content::-webkit-scrollbar{
		display: none;
	}
	#store-brand .content .banner{
		width: 100%;
		height: 150px;
	}
	#store-brand .content .banner img{
		width: 100%;
		height: 100%;
	}
</style>



// WEBPACK FOOTER //
// src/pages/channel/brand.vue