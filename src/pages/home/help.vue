<template>
	<div id="help">
		<public-header title="帮助中心"></public-header>
		<div class="content">
			<div class="title border-box">常见问题</div>
			<van-collapse v-model="activeName" accordion v-if="helps.length > 0">
				<van-collapse-item  :title="help.title" :name="help.id" v-for="(help, index) in helps" :key="index">
					<div v-html="help.content"></div>
				</van-collapse-item>
			</van-collapse>
		</div>
		<div class="service flex border-box border-1px-t">
			<a class="service-container online-service border-box" :href="'tel:' + mobile">
				<van-icon name='service1' class="icon"></van-icon>
				<div>在线客服</div>
			</a>
			<a class="service-container border-1px-l" :href="'tel:' + mobile">
				<van-icon name='phone' class="icon"></van-icon>
				<div>电话客服</div>
			</a>
		</div>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		data() {
			return {
				helps: [],
				mobile: '',
				activeName: ''
			}
		},
		components: {
			PublicHeader,
		},
		methods: {
			onLoad() {
				this.util.request({
					url: 'wmall/home/help/index',
				}).then((res) => {
					var result = res.data.message;
					if(result.errno) {
						this.$toast(result.message);
						return false;
					}
					this.helps = [...this.helps, ...result.message.helps];
					this.mobile = result.message.mobile;
				})
			}
		},
		mounted() {
			this.onLoad();

		}
	}
</script>

<style>
	#help .content{
		bottom: 67px;
	}
	#help .border-box{
		box-sizing: border-box;
	}
	#help .flex{
		display: flex;
		flex-flow: row nowrap;
		align-items:center;
		justify-content:space-between;
	}
	#help .title{
		width:100%;
		padding:10px 15px;
		font-size: 16px;
	}
	#help .service{
		width: 100%;
		padding: 10px 0;
		position: absolute;
		bottom: 0;
		z-index: 10;
		background-color: #fff;
	}
	#help .service .service-container{
		display: inline-block;
		width:49.9%;
		text-align:center;
		font-size:15px;
		color: #000;
	}
	#help .service .service-container .icon{
		color:#FF2D4B;
		font-size:25px;
		height:25px;
		line-height:25px;
	}
	#help .service .service-container div{
		line-height: 22px;
	}
	#help .service .online-service{
		background-color:#fff;
		line-height:inherit;
	}
</style>


// WEBPACK FOOTER //
// src/pages/home/help.vue