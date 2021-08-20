<template>
	<div id="store-assign-detail">
		<public-header title="排队详情"></public-header>
		<div class="content">
			<div class="wrapper">
				<div class="type">{{mine.title}}</div>
				<div class="title">排队序号</div>
				<div class="number">{{mine.number}}</div>
				<div class="wait-number">前方等待人数: {{mine.$before_num}}</div>
				<div class="divide">
					<div class="divide-line"></div>
				</div>
				<div class="address">{{store.address}}</div>
				<div class="to-store" @click="util.jsLocation({lat: store.location_x, lng: store.location_y, address: store.address, name: store.title});">
					<i class="icon icon-location"></i>前往商家
				</div>
				<ul class="detail border-1px-radius">
					<li class="flex-lr border-1px-b">
						<i class="icon icon-time"></i>
						<div class="detail-item flex-lr">
							<div class="key">取号时间</div>
							<div class="value ellipsis">{{mine.createtime_cn}}</div>
						</div>
					</li>
					<router-link tag='li' :to="util.getUrl({path: '/pages/store/index', query: {sid: sid}})" class="flex-lr border-1px-b">
						<i class="icon icon-choiceness"></i>
						<div class="detail-item flex-lr">
							<div class="key">商家环境</div>
							<div class="value ">
								<i class="icon icon-right"></i>
							</div>
						</div>
					</router-link>
					<li class="flex-lr" @click="util.jsTel(store.telephone)">
						<i class="icon icon-telephone"></i>
						<div class="detail-item flex-lr">
							<div class="key">商家电话</div>
							<div class="value ">
								{{store.telephone}}
								<i class="icon icon-right"></i>
							</div>
						</div>
					</li>
				</ul>
				<div class="cancel" @click="util.jspost({url: 'wmall/store/assign/cancel?id=' + mine.id + '&sid=' + sid, confirm: '确定取消排号吗?', successUrl: util.getUrl({path: '/tangshi/pages/assign/assign', query: {sid: sid}})})">取消排号</div>
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
				mine: {},
			}
		},
		methods: {
			onLoad() {
				this.showPreLoading = true;
				this.util.request({
					url: 'wmall/store/assign/mine',
					data: {
						sid: this.sid
					}
				}).then((res) => {
					this.showPreLoading = false;
					let result = res.data.message;
					if(result.errno == 0) {
						this.store = result.message.store;
						this.mine = result.message.mine;
					} else if(result.errno == -1000) {
						this.util.$toast(result.message, this.util.getUrl({path: '/tangshi/pages/assign/assign', query:{sid: this.sid}}), 1000, 'replace');
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
	#store-assign-detail .content{
		background-color: #ff2d4b;
	}
	#store-assign-detail .content .wrapper{
		position: relative;
		margin: 20px;
		padding-bottom: 20px;
		border-radius: 5px 5px 0 0;
		background-color: #fff;
	}
	#store-assign-detail .type{
		padding: 20px 0 10px;
		text-align: center;
		color: #6a6a6a;
	}
	#store-assign-detail .title{
		padding: 0 20px;
		color: #ff2d4b;
	}
	#store-assign-detail .number{
		padding: 30px 0;
		text-align: center;
		font-family: Arial;
		font-size: 50px;
		color: #ff2d4b;
	}
	#store-assign-detail .wait-number{
		padding-right: 20px;
		margin-bottom: 10px;
		text-align: right;
		color: #ff2d4b;
	}
	#store-assign-detail .divide{
		padding: 10px 0;
	}
	#store-assign-detail .divide .divide-line{
		border-top: 2px dashed #ff2d4b;
	}
	#store-assign-detail .divide::before, #store-assign-detail .divide::after{
		background-color: #ff2d4b;
		width: 20px;
		height: 20px;
	}
	#store-assign-detail .divide::before{
		left: -10px;
	}
	#store-assign-detail .divide::after{
		right: -10px;
	}
	#store-assign-detail .address{
		line-height: 1.5;
		padding: 0 20px;
		margin: 10px 0 0 0;
		text-align: center;
		color: #373737;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 2;
		overflow: hidden;
	}
	#store-assign-detail .to-store{
		width: 40%;
		margin: 15px auto 20px;
		padding: 10px;
		border-radius: 5px;
		text-align: center;
		background-color: #ff2d4b;
		color:#fff;
		display: flex;
		flex-flow: row nowrap;
		align-items: center;
		justify-content: center;
		font-size: 15px;
	}
	#store-assign-detail .to-store .icon{
		font-size: 18px;
		margin-right: 5px;
	}
	#store-assign-detail .detail{
		margin: 0 20px;
		padding: 0 10px;
		font-size: 14px;
		border-radius: 5px;
	}
	#store-assign-detail .detail li{
		padding: 10px 0;
	}
	#store-assign-detail .detail .icon{
		width: 10%;
		font-size: 18px;
		color: #999;
	}
	#store-assign-detail .detail .icon.icon-telephone{
		font-size: 16px;
	}
	#store-assign-detail .detail .detail-item{
		width: 90%;
	}
	#store-assign-detail .detail .detail-item .key{
		width: 35%;
		color: #4F4F4F;
	}
	#store-assign-detail .detail .detail-item .value{
		width: 65%;
		text-align: right;
		color: #8E8E8E;
	}
	#store-assign-detail .detail .detail-item .value .icon-right{
		font-size: 14px;
		width: auto;
	}
	#store-assign-detail .cancel{
		width: 30%;
		padding: 10px;
		margin: 20px auto 0;
		border-radius: 100px;
		background-color: #ff2d4b;
		color:#fff;
		text-align: center;
	}
	#store-assign-detail .line{
		position: absolute;
		width: 100%;
		bottom: -3px;
		border-bottom: 3px dotted #fff;
	}
</style>


// WEBPACK FOOTER //
// src/pages/store/assignDetail.vue