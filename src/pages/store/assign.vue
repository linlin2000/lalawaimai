<template>
	<div id="store-assign">
		<public-header title="排队取号"></public-header>
		<div class="content">
			<div class="wrapper">
				<div class="logo">
					<img :src="store.logo" alt="">
				</div>
				<div class="title ellipsis">{{store.title}}</div>
				<div class="divide">
					<div class="divide-line"></div>
				</div>
				<ul class="operation">
					<template v-for="(item, index) in queues" >
						<li class="operation-item ellipsis" :class="{active: queueid_select == index}" @click="onSelectQueue(index)">{{item.title}}{{item.guest_num > 0 ? '(推荐' + item.guest_num + '人)': ''}}<span class="font-12">(目前有{{item.wait}}人等待)</span></li>
					</template>
				</ul>
				<div class="submit" @click="onSubmit">立即取号</div>
				<div class="tip">
					<i class="icon icon-question1"></i>
					过号请重新取号，谢谢配合！
				</div>
				<div class="line"></div>
			</div>
		</div>
		<transition name="loading">
			<iloading v-if="showPreLoading"></iloading>
		</transition>
	</div>
</template>

<script>
	import PublicHeader from '@/components/header'
	export default {
		components: {
			PublicHeader
		},
		data() {
			return {
				showPreLoading: true,
				store: {},
				queues: [],
				queueid_select: 0
			}
		},
		methods: {
			onSelectQueue(index) {
				this.queueid_select = index;
			},
			onSubmit() {
				this.util.request({
					url: 'wmall/store/assign/index',
					data: {
						sid: this.sid,
						queue_id: this.queueid_select
					},
					method: 'POST'
				}).then((res) => {
					let result = res.data.message;
					if(result.errno) {
						this.util.$toast(result.message, '', 1000);
						return false;
					} 
					this.util.$toast(result.message, this.util.getUrl({path: '/tangshi/pages/assign/assignDetail', query:{sid: this.sid}}), 1000, 'replace');
				})
			},
			onLoad() {
				this.showPreLoading = true;
				this.util.request({
					url: 'wmall/store/assign/index',
					data: {
						sid: this.sid
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno == 0) {
						this.store = result.message.store;
						this.queues = result.message.queues;
						this.queueid_select = result.message.queueid_select;
					} else if(result.errno == -1000) {
						this.util.$toast(result.message, this.util.getUrl({path: '/pages/store/index', query:{sid: this.sid}}), 1000, 'replace');
					} else if(result.errno == 1000) {
						this.util.$toast(result.message, this.util.getUrl({path: '/tangshi/pages/assign/assignDetail', query:{sid: this.sid}}), 1000, 'replace');
					} else if(result.errno == -1) {
						this.util.$toast(result.message, this.util.getUrl({path: '/pages/home/index'}), 1000, 'replace');
					} 
				})
			}

		},
		created(){
			this.query = this.$route.query;
			if(this.query) {
				this.sid = this.query.sid;
			}
		},
		mounted() {
			this.onLoad();
		}
	}
</script>

<style>
	#store-assign .content{
		background-color: #ff2d4b;
	}
	#store-assign .content .wrapper{
		position: absolute;
		top: 50px;
		bottom: 50px;
		right: 20px;
		left: 20px;
		background-color: #fff;
	}
	#store-assign .logo{
		width: 70px;
		height: 70px;
		position: absolute;
		top: -35px;
		left: 50%;
		margin-left: -35px;
	}
	#store-assign .logo img{
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	#store-assign .title{
		padding: 0 15px;
		margin-top: 50px;
		text-align: center;
		color: #ff2d4b;
		font-size: 16px;
		line-height: 1.5;
	}
	#store-assign .divide{
		padding: 10px 0;
	}
	#store-assign .divide .divide-line{
		border-top: 2px dashed #ff2d4b;
	}
	#store-assign .divide::before, #store-assign .divide::after{
		background-color: #ff2d4b;
		width: 20px;
		height: 20px;
	}
	#store-assign .divide::before{
		left: -10px;
	}
	#store-assign .divide::after{
		right: -10px;
	}
	#store-assign .operation{
		position: absolute;
		top: 104px;
		right: 20px;
		bottom: 110px;
		left: 20px;
		padding: 15px;
		border-radius: 3px;
		background-color: #f5f5f5;
		text-align: center;
		color: #6A6A6A;
	}
	#store-assign .operation .operation-item{
		padding: 10px;
		border-radius: 5px;
	}
	#store-assign .operation .operation-item.active{
		color: #fff;
		background-color: #ff2d4b;
	}
	#store-assign .submit{
		position: absolute;
		bottom: 56px;
		left: 20px;
		right: 20px;
		padding: 10px;
		border-radius: 50px;
		text-align: center;
		background-color: #ff2d4b;
		color: #fff;
	}
	#store-assign .tip{
		position: absolute;
		width: 100%;
		bottom: 0px;
		padding: 20px;
		text-align: center;
		font-size: 14px;
		color: #6a6a6a;
	}
	#store-assign .line{
		position: absolute;
		width: 100%;
		bottom: -3px;
		border-bottom: 3px dotted #fff;
	}
</style>


// WEBPACK FOOTER //
// src/pages/store/assign.vue