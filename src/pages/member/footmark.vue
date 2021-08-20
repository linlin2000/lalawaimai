<template>
	<div id="footmark">
		<public-header title="我的足迹"></public-header>
		<div class="content" v-if="footmarks.length > 0">
			<template v-for="item in footmarks">
				<store-group :stores="item.stores">
					<!-- <div slot="stat_day" class="">
						<span>{{item.date}}</span>
					</div>  -->
				</store-group>
			</template>
		</div>
		<div v-else class="no-data">
			<img src= "static/img/store_no_con.png" alt="" />
			<p>您没有浏览记录</p>
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
				footmarks: [],
				showLoading: true,
			}
		},
		components: {
			PublicHeader,
			storeGroup,
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'wmall/member/footmark',
					data: {},
				}).then((res) => {
					this.footmarks = res.data.message.message.footmarks;
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

</style>



// WEBPACK FOOTER //
// src/pages/member/footmark.vue