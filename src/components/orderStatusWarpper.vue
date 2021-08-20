<template>
	<div id="order-status-warpper">
		<div class="order-status-warpper" :style="{background:sysstyle}" :class="{active: active}" @click="onChangeActive">
			<img :src="order.logo" alt="">
			<div class="text">
				<div class="order-status" v-if="order.log && order.log.title">{{order.log.title}}</div>
				<div class="time">请耐心等待</div>
			</div>
			<span class="order-status-close">&times;</span>
		</div>
	</div>
</template>

<script>
	export default {
		props:{
			order: {
				type: Object,
				default: () => {
					return {
						order: {
							log: {
								title: ''
							}
						}
					};
				}
			},
      sysstyle:{},
		},
		data() {
			return {
				active: false
			}
		},
		methods: {
			onChangeActive() {
				this.active = !this.active;
			}
		}
	}
</script>

<style>
	#order-status-warpper .order-status-warpper{
		width: 180px;
		transition: width 1s;
		display: flex;
		height: 50px;
		border-radius: 50px;
		position: fixed;
		bottom: 60px;
		right: 20px;
		z-index: 10000;
		padding: 3px;
		-webkit-box-align: center;
		-webkit-align-items: center;
		-ms-flex-align: center;
		align-items: center;
		color: #fff;
		overflow: hidden;
		background-color: #ff2d4b;
	}
	#order-status-warpper .order-status-warpper.active{
		width: 48px;
	}
	#order-status-warpper .order-status-warpper img{
		border-radius: 100%;
		height: 44px;
		width: 44px;
		border: none;
		max-width: 100%;
	}
	#order-status-warpper .order-status-warpper .text{
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		margin: 0 0 0 7px;
		max-width: 140px;
		font-size: 14px;
	}
	#order-status-warpper .order-status-warpper .text .order-status{
		line-height: 21px;
	}
	#order-status-warpper .order-status-warpper .text .time{
		font-size: 12px;
		line-height: 18px;
	}
	#order-status-warpper .order-status-warpper .order-status-close{
		font-size: 20px;
		margin: 0 4px 0 4px;
	}
</style>



// WEBPACK FOOTER //
// src/components/orderStatusWarpper.vue